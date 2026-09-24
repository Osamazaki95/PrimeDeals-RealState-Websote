'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: string; name: string; email: string; phone: string | null; message: string | null;
  source: string; status: 'new' | 'contacted' | 'won' | 'lost'; created_at: string;
  property?: { slug: string; title_en: string } | null;
};

const STATUSES: Lead['status'][] = ['new', 'contacted', 'won', 'lost'];
const TONE: Record<Lead['status'], string> = {
  new: 'bg-cream text-gold',
  contacted: 'bg-surface2 text-ink',
  won: 'bg-brand text-brand-on',
  lost: 'bg-surface2 text-muted',
};

export function LeadsBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [loading, setLoading] = useState(true);

  async function load() {
    const j = await fetch('/api/leads').then((r) => r.json());
    setLeads(j.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(lead: Lead, status: Lead['status']) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await fetch('/api/leads/' + lead.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  const shown = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">Leads</h1>
        <p className="mt-1.5 text-sm text-muted">Every enquiry from the site, tagged with where it came from.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={'h-10 rounded-[9px] px-4 text-[13.5px] font-semibold capitalize transition-colors ' + (filter === s ? 'bg-brand text-brand-on' : 'border border-line bg-surface hover:border-brand hover:text-brand')}
          >
            {s} {s !== 'all' && '(' + leads.filter((l) => l.status === s).length + ')'}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {shown.map((lead) => (
          <article key={lead.id} className="grid gap-4 rounded-xl border border-line bg-surface p-5 lg:grid-cols-[1.1fr_1.4fr_auto]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[16px] font-semibold">{lead.name}</h2>
                <span className={'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.12em] ' + TONE[lead.status]}>{lead.status}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-muted">{lead.email}{lead.phone ? ' · ' + lead.phone : ''}</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[.14em] text-gold">{lead.source}</p>
            </div>
            <p className="text-[13.5px] leading-relaxed text-muted">{lead.message || '—'}</p>
            <div className="flex flex-wrap items-start gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(lead, s)}
                  className={'h-9 rounded-lg px-3 text-[12px] font-semibold capitalize transition-colors ' + (lead.status === s ? 'bg-brand text-brand-on' : 'border border-line hover:border-brand hover:text-brand')}
                >
                  {s}
                </button>
              ))}
            </div>
          </article>
        ))}
        {shown.length === 0 && <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">{loading ? 'Loading…' : 'No leads in this view.'}</p>}
      </div>
    </div>
  );
}
