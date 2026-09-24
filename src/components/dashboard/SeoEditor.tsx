'use client';

import { useEffect, useState } from 'react';

const PAGES = ['home', 'properties', 'projects', 'about', 'contact', 'blog'];

export function SeoEditor() {
  const [page, setPage] = useState('home');
  const [row, setRow] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/seo/' + page).then((r) => r.json()).then((j) => setRow(j.data ?? {}));
  }, [page]);

  async function save() {
    const res = await fetch('/api/seo/' + page, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_en: row.title_en ?? '', title_ar: row.title_ar ?? '',
        description_en: row.description_en ?? '', description_ar: row.description_ar ?? '',
        og_image: row.og_image ?? null,
      }),
    });
    setStatus(res.ok ? 'Saved ✓' : 'Save failed');
  }

  const input = 'h-11 w-full rounded-[9px] border border-line bg-surface px-3.5 outline-none focus:border-brand';

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">SEO</h1>
        <p className="mt-1.5 text-sm text-muted">Titles and meta descriptions per page, per language.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button key={p} onClick={() => setPage(p)} className={'h-10 rounded-[9px] px-4 text-[13.5px] font-semibold capitalize transition-colors ' + (page === p ? 'bg-brand text-brand-on' : 'border border-line bg-surface hover:border-brand hover:text-brand')}>
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-xl border border-line bg-surface p-6 lg:grid-cols-2">
        {[
          { k: 'title_en', l: 'TITLE (EN)', dir: 'ltr' },
          { k: 'title_ar', l: 'العنوان (AR)', dir: 'rtl' },
        ].map((f) => (
          <label key={f.k} className="grid gap-1.5">
            <span className="text-[11.5px] font-bold tracking-[.12em] text-muted">{f.l}</span>
            <input dir={f.dir} value={row[f.k] ?? ''} onChange={(e) => setRow({ ...row, [f.k]: e.target.value })} className={input} />
          </label>
        ))}
        {[
          { k: 'description_en', l: 'DESCRIPTION (EN)', dir: 'ltr' },
          { k: 'description_ar', l: 'الوصف (AR)', dir: 'rtl' },
        ].map((f) => (
          <label key={f.k} className="grid gap-1.5">
            <span className="text-[11.5px] font-bold tracking-[.12em] text-muted">{f.l}</span>
            <textarea dir={f.dir} value={row[f.k] ?? ''} onChange={(e) => setRow({ ...row, [f.k]: e.target.value })} className="min-h-[90px] w-full resize-y rounded-[9px] border border-line bg-surface p-3 outline-none focus:border-brand" />
          </label>
        ))}
        <div className="flex items-center gap-3 lg:col-span-2">
          <button onClick={save} className="h-11 rounded-[10px] bg-brand px-6 font-semibold text-brand-on">Save</button>
          {status && <span className="text-[13px] text-muted">{status}</span>}
        </div>
      </div>
    </div>
  );
}
