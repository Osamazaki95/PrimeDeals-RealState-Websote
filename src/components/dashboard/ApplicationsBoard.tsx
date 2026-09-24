'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

type Application = {
  id: string; job_slug: string | null; full_name: string; email: string; phone: string;
  location: string | null; linkedin: string | null; years_experience: number | null;
  current_position: string | null; notice_period: string | null; expected_salary: string | null;
  cv_name: string | null; notes: string | null;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'rejected';
  created_at: string;
  job?: { slug: string; title_en: string } | null;
};

const STAGES: Application['status'][] = ['new', 'screening', 'interview', 'offer', 'rejected'];
const TONE: Record<Application['status'], string> = {
  new: 'bg-cream text-gold',
  screening: 'bg-surface2 text-ink',
  interview: 'bg-surface2 text-brand',
  offer: 'bg-brand text-brand-on',
  rejected: 'bg-surface2 text-muted',
};

/** Hiring inbox. CVs open through a short-lived signed URL, never a public link. */
export function ApplicationsBoard() {
  const [rows, setRows] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'all' | Application['status']>('all');
  const [loading, setLoading] = useState(true);

  async function load() {
    const json = await fetch('/api/applications').then((r) => r.json());
    setRows(json.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(row: Application, status: Application['status']) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
    await fetch('/api/applications/' + row.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function openCv(row: Application) {
    const json = await fetch('/api/applications/' + row.id).then((r) => r.json());
    if (json.data?.url) window.open(json.data.url, '_blank', 'noopener');
  }

  const shown = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">Applications</h1>
        <p className="mt-1.5 text-sm text-muted">Every CV submitted from the careers pages.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              'h-10 rounded-[9px] px-4 text-[13.5px] font-semibold capitalize transition-colors ' +
              (filter === s ? 'bg-brand text-brand-on' : 'border border-line bg-surface hover:border-brand hover:text-brand')
            }
          >
            {s} {s !== 'all' && '(' + rows.filter((r) => r.status === s).length + ')'}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {shown.map((a) => (
          <article key={a.id} className="grid gap-4 rounded-xl border border-line bg-surface p-5 lg:grid-cols-[1.1fr_1.3fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base font-semibold">{a.full_name}</h2>
                <span className={'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.12em] ' + TONE[a.status]}>{a.status}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-muted">{a.email} · {a.phone}</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[.14em] text-gold">
                {a.job?.title_en || a.job_slug || 'general'}
              </p>
              <dl className="mt-2.5 grid gap-1 text-[12.5px] text-muted">
                {a.current_position && <div>{a.current_position}{a.years_experience != null ? ' · ' + a.years_experience + 'y' : ''}</div>}
                {a.notice_period && <div>Notice: {a.notice_period}</div>}
                {a.expected_salary && <div>Expects: {a.expected_salary}</div>}
                {a.linkedin && <a href={a.linkedin} target="_blank" rel="noreferrer" className="font-semibold">LinkedIn</a>}
              </dl>
            </div>

            <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-muted">{a.notes || '—'}</p>

            <div className="grid content-start gap-2">
              {a.cv_name && (
                <button
                  onClick={() => openCv(a)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-xs font-semibold hover:border-brand hover:text-brand"
                >
                  <Download size={13} />{a.cv_name}
                </button>
              )}
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(a, s)}
                    className={
                      'h-9 rounded-lg px-3 text-[12px] font-semibold capitalize transition-colors ' +
                      (a.status === s ? 'bg-brand text-brand-on' : 'border border-line hover:border-brand hover:text-brand')
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
        {shown.length === 0 && (
          <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">
            {loading ? 'Loading…' : 'No applications in this view.'}
          </p>
        )}
      </div>
    </div>
  );
}
