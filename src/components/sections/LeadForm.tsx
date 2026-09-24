'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

/**
 * Single lead form used by /contact, the property sidebar and the careers page.
 * Posts to /api/leads. `source` tags where it came from for the dashboard.
 */
export function LeadForm({
  dict, source = 'contact', propertyId, layout = 'underline',
}: {
  dict: Dictionary;
  source?: string;
  propertyId?: string;
  layout?: 'underline' | 'boxed';
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source, property_id: propertyId ?? null }),
    });
    setState(res.ok ? 'done' : 'error');
    if (res.ok) setForm({ name: '', email: '', phone: '', message: '' });
  }

  const field =
    layout === 'underline'
      ? 'w-full border-0 border-b border-line bg-transparent py-3 text-[15px] outline-none transition-colors duration-300 focus:border-brand'
      : 'h-11 w-full rounded-[9px] border border-line bg-surface2 px-3.5 outline-none transition-colors duration-300 focus:border-brand';

  return (
    <form onSubmit={submit} className={'grid ' + (layout === 'underline' ? 'max-w-[520px] gap-6' : 'gap-2.5')}>
      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={dict.common.name} className={field} />
      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={dict.common.email} className={field} />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={dict.common.phone} className={field} />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder={dict.common.message}
        className={layout === 'underline' ? field + ' min-h-[110px] resize-y' : 'min-h-[96px] w-full resize-y rounded-[9px] border border-line bg-surface2 p-3 outline-none focus:border-brand'}
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className={
          layout === 'underline'
            ? 'h-12 w-fit rounded-[10px] border-[1.5px] border-brand px-9 font-bold text-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:text-brand-on disabled:opacity-60'
            : 'h-[46px] rounded-[9px] bg-brand font-bold text-brand-on transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60'
        }
      >
        {state === 'done' ? dict.common.sent : dict.common.sendEnquiry}
      </button>
      {state === 'error' && <p className="text-xs text-red-600">{dict.common.error}</p>}
    </form>
  );
}
