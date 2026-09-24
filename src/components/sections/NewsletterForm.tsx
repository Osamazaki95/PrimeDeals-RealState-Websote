'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export function NewsletterForm({ dict, variant = 'footer' }: { dict: Dictionary; variant?: 'footer' | 'band' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? 'done' : 'error');
    if (res.ok) setEmail('');
  }

  const inputBg = variant === 'band' ? 'bg-surface' : 'bg-surface2';

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2.5">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dict.common.emailPlaceholder}
        className={'h-[46px] min-w-[200px] flex-1 rounded-[9px] border border-line px-4 outline-none transition-colors duration-300 focus:border-brand ' + inputBg}
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="h-[46px] rounded-[9px] border border-line bg-surface2 px-6 font-semibold transition-all duration-300 hover:border-brand hover:text-brand disabled:opacity-60"
      >
        {state === 'done' ? '✓' : dict.common.submit}
      </button>
      {state === 'error' && <p className="w-full text-xs text-red-600">{dict.common.error}</p>}
    </form>
  );
}
