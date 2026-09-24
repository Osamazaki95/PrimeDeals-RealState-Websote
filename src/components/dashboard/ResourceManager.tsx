'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ImageField } from './ImageField';

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'tags' | 'images';
  options?: { value: string; label: string }[];
  required?: boolean;
  half?: boolean;
  help?: string;
};

/**
 * Generic CRUD screen. Every dashboard content page is this component with a
 * different field list — so adding a column means adding one line, nothing else.
 *
 *   resource   "properties"  ->  /api/properties  (+ /api/properties/:key)
 *   idKey      which column identifies a row in the item route ("slug" | "id")
 */
export function ResourceManager<T extends Record<string, any>>({
  resource, idKey = 'id', fields, columns, title, description, newRow,
}: {
  resource: string;
  idKey?: string;
  fields: Field[];
  columns: { name: string; label: string }[];
  title: string;
  description?: string;
  newRow?: Partial<T>;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [state, setState] = useState<'idle' | 'loading' | 'saving' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    const res = await fetch('/api/' + resource);
    const json = await res.json();
    const data = json.data;
    setRows(Array.isArray(data) ? data : (data?.items ?? []));
    setState('idle');
  }, [resource]);

  useEffect(() => { load(); }, [load]);

  const blank = useMemo(() => {
    const base: Record<string, any> = { ...(newRow ?? {}) };
    fields.forEach((f) => {
      if (base[f.name] !== undefined) return;
      base[f.name] = f.type === 'boolean' ? false : f.type === 'number' ? 0 : f.type === 'tags' || f.type === 'images' ? [] : '';
    });
    return base;
  }, [fields, newRow]);

  function openNew() { setEditing(null); setDraft(blank); setMessage(''); }
  function openEdit(row: T) { setEditing(row); setDraft({ ...row }); setMessage(''); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    const url = editing ? '/api/' + resource + '/' + editing[idKey] : '/api/' + resource;
    const res = await fetch(url, {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      setMessage('Saved ✓');
      setDraft({});
      setEditing(null);
      await load();
    } else {
      const j = await res.json().catch(() => ({}));
      setMessage(j.error || 'Save failed');
      setState('error');
    }
  }

  async function remove(row: T) {
    if (!confirm('Delete this record?')) return;
    const res = await fetch('/api/' + resource + '/' + row[idKey], { method: 'DELETE' });
    if (res.ok) await load();
  }

  const input = 'h-11 w-full rounded-[9px] border border-line bg-surface px-3.5 outline-none transition-colors focus:border-brand';
  const isOpen = Object.keys(draft).length > 0;

  return (
    <div>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
        </div>
        <button onClick={openNew} className="flex h-11 items-center gap-2 rounded-[10px] bg-brand px-5 font-semibold text-brand-on transition-transform hover:-translate-y-0.5">
          <Plus size={16} /> New
        </button>
      </header>

      {isOpen && (
        <form onSubmit={save} className="mb-8 animate-rise rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-5 text-[17px] font-semibold">{editing ? 'Edit record' : 'New record'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <label key={f.name} className={'grid gap-1.5 ' + (f.half ? '' : 'md:col-span-2')}>
                <span className="text-[11.5px] font-bold tracking-[.12em] text-muted">{f.label}</span>

                {f.type === 'textarea' && (
                  <textarea
                    required={f.required}
                    value={draft[f.name] ?? ''}
                    onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                    className="min-h-[110px] w-full resize-y rounded-[9px] border border-line bg-surface p-3 outline-none focus:border-brand"
                  />
                )}

                {f.type === 'select' && (
                  <select value={draft[f.name] ?? ''} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} className={input + ' cursor-pointer'}>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                )}

                {f.type === 'boolean' && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, [f.name]: !draft[f.name] })}
                    className={'h-11 rounded-[9px] border text-[13.5px] font-semibold transition-colors ' + (draft[f.name] ? 'border-brand bg-brand text-brand-on' : 'border-line bg-surface text-muted')}
                  >
                    {draft[f.name] ? 'Yes' : 'No'}
                  </button>
                )}

                {f.type === 'number' && (
                  <input type="number" value={draft[f.name] ?? 0} onChange={(e) => setDraft({ ...draft, [f.name]: Number(e.target.value) })} className={input} />
                )}

                {f.type === 'tags' && (
                  <input
                    value={(draft[f.name] ?? []).join(', ')}
                    onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    placeholder="Comma separated"
                    className={input}
                  />
                )}

                {f.type === 'images' && (
                  <ImageField value={draft[f.name] ?? []} onChange={(v) => setDraft({ ...draft, [f.name]: v })} folder={resource} />
                )}

                {f.type === 'text' && (
                  <input required={f.required} value={draft[f.name] ?? ''} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} className={input} />
                )}

                {f.help && <span className="text-[11px] text-muted">{f.help}</span>}
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={state === 'saving'} className="h-11 rounded-[10px] bg-brand px-6 font-semibold text-brand-on disabled:opacity-60">
              {state === 'saving' ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => { setDraft({}); setEditing(null); }} className="h-11 rounded-[10px] border border-line px-5 font-semibold">
              Cancel
            </button>
            {message && <span className="text-[13px] text-muted">{message}</span>}
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-surface2 text-start">
              {columns.map((c) => (
                <th key={c.name} className="px-4 py-3 text-start font-semibold tracking-wide text-muted">{c.label}</th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[idKey])} className="border-b border-line last:border-0 transition-colors hover:bg-surface2">
                {columns.map((c) => (
                  <td key={c.name} className="px-4 py-3 align-middle">
                    {typeof row[c.name] === 'boolean' ? (row[c.name] ? '✓' : '—') : Array.isArray(row[c.name]) ? row[c.name].length : String(row[c.name] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => openEdit(row)} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-md border border-line hover:border-brand hover:text-brand">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => remove(row)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-md border border-line hover:border-red-500 hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted">{state === 'loading' ? 'Loading…' : 'Nothing here yet.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
