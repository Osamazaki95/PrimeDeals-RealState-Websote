'use client';

import { useRef, useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type State = 'idle' | 'sending' | 'done' | 'error';

/**
 * Job application form. Posts multipart to /api/applications so the CV file
 * travels with the record. Client-side guards mirror the server's.
 */
export function ApplicationForm({ dict, jobSlug }: { dict: Dictionary; jobSlug: string }) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  const c = dict.careers;

  function pickFile(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(c.cvTooBig); return; }
    setError('');
    setCv(file);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    const body = new FormData(e.currentTarget);
    body.set('job_slug', jobSlug);
    if (cv) body.set('cv', cv);
    else body.delete('cv');

    const res = await fetch('/api/applications', { method: 'POST', body });
    if (res.ok) {
      setState('done');
      e.currentTarget.reset();
      setCv(null);
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || dict.common.error);
      setState('error');
    }
  }

  const field =
    'h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] outline-none transition-colors duration-300 focus:border-brand';
  const label = 'text-[11.5px] font-bold tracking-[.12em] text-muted';

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-brand bg-cream p-8 text-center sm:p-10">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand text-2xl text-brand-on">✓</div>
        <h3 className="mb-2 text-xl font-bold">{c.sentTitle}</h3>
        <p className="mx-auto max-w-[420px] leading-relaxed text-muted">{c.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className={label}>{c.fullName} *</span>
          <input name="full_name" required className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{dict.common.email} *</span>
          <input name="email" type="email" required className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{dict.common.phone} *</span>
          <input name="phone" required inputMode="tel" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{c.cityLabel}</span>
          <input name="location" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{c.currentRole}</span>
          <input name="current_position" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{c.years}</span>
          <input name="years_experience" type="number" min={0} max={50} className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{c.notice}</span>
          <input name="notice_period" className={field} placeholder={c.noticePlaceholder} />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>{c.expected}</span>
          <input name="expected_salary" className={field} />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className={label}>{c.linkedin}</span>
          <input name="linkedin" className={field} placeholder="https://linkedin.com/in/…" />
        </label>
      </div>

      {/* CV upload */}
      <div className="grid gap-1.5">
        <span className={label}>{c.cvLabel}</span>
        {cv ? (
          <div className="flex items-center gap-3 rounded-xl border border-brand bg-cream px-4 py-3.5">
            <FileText size={18} className="shrink-0 text-brand" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{cv.name}</span>
            <span className="shrink-0 text-xs text-muted">{Math.round(cv.size / 1024)} KB</span>
            <button
              type="button"
              onClick={() => { setCv(null); if (fileInput.current) fileInput.current.value = ''; }}
              aria-label={c.removeCv}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface hover:border-brand hover:text-brand"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-surface2 px-4 py-8 text-center transition-colors duration-300 hover:border-brand">
            <input
              ref={fileInput}
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => pickFile(e.target.files)}
            />
            <Upload size={20} className="text-brand" />
            <span className="text-sm font-semibold">{c.cvCta}</span>
            <span className="text-xs text-muted">{c.cvHint}</span>
          </label>
        )}
      </div>

      <label className="grid gap-1.5">
        <span className={label}>{c.notesLabel}</span>
        <textarea
          name="notes"
          rows={5}
          placeholder={c.notesPlaceholder}
          className="w-full resize-y rounded-xl border border-line bg-surface p-4 text-[15px] leading-relaxed outline-none transition-colors duration-300 focus:border-brand"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="h-[52px] w-full rounded-xl bg-brand text-[15px] font-bold text-brand-on transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {state === 'sending' ? c.sending : c.submitApplication}
      </button>
      <p className="text-xs leading-relaxed text-muted">{c.privacyNote}</p>
    </form>
  );
}
