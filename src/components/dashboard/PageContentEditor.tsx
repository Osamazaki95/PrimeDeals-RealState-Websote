'use client';

import { useEffect, useState } from 'react';

type Section = { key: string; content_en: Record<string, unknown>; content_ar: Record<string, unknown>; sort_order: number };

/**
 * Bilingual page-content editor. Each block of each page is stored as JSON,
 * so a section can hold a headline, a list of stats or a set of value cards
 * without a schema migration. Arabic and English sit side by side.
 */
export function PageContentEditor({ pages }: { pages: { slug: string; label: string }[] }) {
  const [page, setPage] = useState(pages[0].slug);
  const [sections, setSections] = useState<Section[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { en: string; ar: string }>>({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/pages/' + page)
      .then((r) => r.json())
      .then((j) => {
        const list: Section[] = j.data ?? [];
        setSections(list);
        const d: Record<string, { en: string; ar: string }> = {};
        list.forEach((s) => {
          d[s.key] = { en: JSON.stringify(s.content_en, null, 2), ar: JSON.stringify(s.content_ar, null, 2) };
        });
        setDrafts(d);
      });
  }, [page]);

  async function save(section: Section) {
    setStatus('');
    let content_en: unknown, content_ar: unknown;
    try {
      content_en = JSON.parse(drafts[section.key].en);
      content_ar = JSON.parse(drafts[section.key].ar);
    } catch {
      setStatus('Invalid JSON in ' + section.key);
      return;
    }
    const res = await fetch('/api/pages/' + page, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: section.key, content_en, content_ar, sort_order: section.sort_order }),
    });
    setStatus(res.ok ? section.key + ' saved ✓' : 'Save failed');
  }

  async function addSection() {
    const key = prompt('New block key (e.g. testimonials)');
    if (!key) return;
    await fetch('/api/pages/' + page, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, content_en: { title: '' }, content_ar: { title: '' }, sort_order: sections.length + 1 }),
    });
    setPage((p) => p);
    const r = await fetch('/api/pages/' + page);
    const j = await r.json();
    setSections(j.data ?? []);
  }

  const area = 'min-h-[180px] w-full resize-y rounded-[9px] border border-line bg-surface p-3 font-mono text-[12px] leading-relaxed outline-none focus:border-brand';

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">Page content</h1>
        <p className="mt-1.5 text-sm text-muted">Every editable block of every page, in both languages.</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setPage(p.slug)}
            className={'h-10 rounded-[9px] px-4 text-[13.5px] font-semibold transition-colors ' + (page === p.slug ? 'bg-brand text-brand-on' : 'border border-line bg-surface hover:border-brand hover:text-brand')}
          >
            {p.label}
          </button>
        ))}
        <button onClick={addSection} className="ms-auto h-10 rounded-[9px] border border-line px-4 text-[13.5px] font-semibold hover:border-brand hover:text-brand">
          + Add block
        </button>
      </div>

      {status && <p className="mb-4 text-[13px] text-brand">{status}</p>}

      <div className="grid gap-5">
        {sections.map((s) => (
          <div key={s.key} className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-mono text-[12px] uppercase tracking-[.18em] text-gold">{s.key}</h2>
              <button onClick={() => save(s)} className="h-9 rounded-lg bg-brand px-4 text-[13px] font-semibold text-brand-on">Save</button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-[11.5px] font-bold tracking-[.12em] text-muted">ENGLISH</span>
                <textarea
                  dir="ltr"
                  value={drafts[s.key]?.en ?? ''}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: { ...drafts[s.key], en: e.target.value } })}
                  className={area}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[11.5px] font-bold tracking-[.12em] text-muted">العربية</span>
                <textarea
                  dir="rtl"
                  value={drafts[s.key]?.ar ?? ''}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: { ...drafts[s.key], ar: e.target.value } })}
                  className={area}
                />
              </label>
            </div>
          </div>
        ))}
        {sections.length === 0 && <p className="rounded-xl border border-dashed border-line py-12 text-center text-muted">No blocks for this page yet.</p>}
      </div>
    </div>
  );
}
