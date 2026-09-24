'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

/** Uploads into the Supabase "media" bucket and stores the public URL list. */
export function ImageField({ value, onChange, folder = 'uploads' }: { value: string[]; onChange: (v: string[]) => void; folder?: string }) {
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body });
      if (res.ok) {
        const json = await res.json();
        urls.push(json.data.url);
      }
    }
    onChange([...value, ...urls]);
    setBusy(false);
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex flex-wrap gap-2.5">
        {value.map((url) => (
          <div key={url} className="relative h-20 w-28 overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute end-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-line text-muted transition-colors hover:border-brand hover:text-brand">
          <input type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          {busy ? <span className="text-[11px]">…</span> : <Upload size={16} />}
        </label>
      </div>
      <p className="text-[11px] text-muted">First image is used as the cover.</p>
    </div>
  );
}
