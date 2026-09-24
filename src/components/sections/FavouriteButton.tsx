'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FavouriteButton({ propertyId }: { propertyId: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/favourites')
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const ids = (j.data ?? []).map((f: { property_id: string }) => f.property_id);
        setSaved(ids.includes(propertyId));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [propertyId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    const res = await fetch('/api/favourites', {
      method: saved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId }),
    });
    if (res.ok) setSaved(!saved);
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label="Save property"
      className="absolute end-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 transition-transform duration-300 hover:scale-110"
    >
      <Heart size={15} className={saved ? 'fill-red-600 text-red-600' : 'text-muted'} />
    </button>
  );
}
