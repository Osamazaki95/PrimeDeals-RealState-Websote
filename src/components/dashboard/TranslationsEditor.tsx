'use client';

import { useEffect, useState } from 'react';

type Row = { id?: string; namespace: string; key: string; value_en: string; value_ar: string };

/**
 * Overrides for any UI string, without touching the code. The site reads
 * en.json / ar.json first and applies these on top.
 */
export function TranslationsEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row>({ namespace: 'common', key: '', value_en: '', value_ar: '' });
  const [status, setStatus] = useState('');

  async function load() {
    const j = await fetch('/api/translations').then((r) => r.json());
    setRows(j.data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function save(row: Row) {
    const res = await fetch('/api/translations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: row.namespace, key: row.key, value_en: row.value_en, value_ar: row.value_ar }),
    });
    setStatus(res.ok ? 'Saved ✓' : 'Save failed');
    if (res.ok) { await load(); setDraft({ namespace: 'common', key: '', value_en: '', value_ar: '' }); }
  }

  const input = 'h-11 w-full rounded-[9px] border border-line bg-surface px-3.5 outline-none focus:border-brand';

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">Translations</h1>
        <p className="mt-1.5 text-sm text-muted">Override any interface string in Arabic or English.</p>
      </header>

      <div className="mb-8 grid gap-3 rounded-xl border border-line bg-surface p-5 md:grid-cols-[140px_180px_1fr_1fr_auto]">
        <input placeholder="namespace" value={draft.namespace} onChange={(e) => setDraft({ ...draft, namespace: e.target.value })} className={input} />
        <input placeholder="key" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} className={input} />
        <input dir="ltr" placeholder="English" value={draft.value_en} onChange={(e) => setDraft({ ...draft, value_en: e.target.value })} className={input} />
        <input dir="rtl" placeholder="العربية" value={draft.value_ar} onChange={(e) => setDraft({ ...draft, value_ar: e.target.value })} className={input} />
        <button onClick={() => save(draft)} className="h-11 rounded-[10px] bg-brand px-5 font-semibold text-brand-on">Add</button>
      </div>

      {status && <p className="mb-4 text-[13px] text-brand">{status}</p>}

      <div className="grid gap-3">
        {rows.map((r, i) => (
          <div key={r.id ?? i} className="grid gap-3 rounded-xl border border-line bg-surface p-4 md:grid-cols-[140px_180px_1fr_1fr_auto]">
            <div className="grid place-items-start self-center font-mono text-[11.5px] uppercase tracking-[.14em] text-gold">{r.namespace}</div>
            <div className="self-center font-mono text-[12px]">{r.key}</div>
            <input dir="ltr" value={r.value_en} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, value_en: e.target.value } : x)))} className={input} />
            <input dir="rtl" value={r.value_ar} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, value_ar: e.target.value } : x)))} className={input} />
            <button onClick={() => save(rows[i])} className="h-11 rounded-[10px] border border-line px-4 font-semibold hover:border-brand hover:text-brand">Save</button>
          </div>
        ))}
        {rows.length === 0 && <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">No overrides yet.</p>}
      </div>
    </div>
  );
}
