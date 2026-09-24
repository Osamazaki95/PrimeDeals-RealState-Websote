'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Property } from '@/types/db';
import Image from 'next/image';
import { propertyShots } from '@/lib/media';

/**
 * Map + list search. The grid background is a placeholder — drop a Mapbox GL or
 * Google Maps layer into <div data-map-canvas> and the pins keep working.
 */
export function MapExplorer({ properties, locale, dict }: { properties: Property[]; locale: Locale; dict: Dictionary }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) => p.location_en.toLowerCase().includes(q) || p.location_ar.includes(query.trim())
    );
  }, [properties, query]);

  // Normalise lat/lng into percentage positions on the placeholder canvas.
  const bounds = useMemo(() => {
    const pts = properties.filter((p) => p.lat != null && p.lng != null);
    if (!pts.length) return null;
    const lats = pts.map((p) => p.lat as number);
    const lngs = pts.map((p) => p.lng as number);
    return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
  }, [properties]);

  const pos = (p: Property) => {
    if (!bounds || p.lat == null || p.lng == null) return { top: '50%', left: '50%' };
    const spanLat = bounds.maxLat - bounds.minLat || 1;
    const spanLng = bounds.maxLng - bounds.minLng || 1;
    const top = 12 + ((bounds.maxLat - p.lat) / spanLat) * 72;
    const left = 10 + ((p.lng - bounds.minLng) / spanLng) * 78;
    return { top: top + '%', left: left + '%' };
  };

  return (
    <div className="grid min-h-[calc(100vh-68px)] grid-cols-1 lg:grid-cols-[minmax(300px,.85fr)_minmax(0,1.6fr)]">
      <div className="max-h-[52vh] overflow-auto border-b border-line bg-surface lg:max-h-[calc(100vh-68px)] lg:border-b-0 lg:border-e">
        <div className="sticky top-0 z-[2] border-b border-line bg-surface p-5">
          <h1 className="mb-1.5 text-[21px] font-bold">{dict.nav.map}</h1>
          <p className="mb-3.5 text-[13px] text-muted">{list.length} {dict.filters.results}</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.filters.locationPlaceholder}
            className="h-[42px] w-full rounded-[9px] border border-line bg-surface2 px-3.5 outline-none focus:border-brand"
          />
        </div>
        <div className="grid gap-3.5 p-4">
          {list.map((p) => (
            <Link
              key={p.id}
              href={'/' + locale + '/properties/' + p.slug}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              className="grid grid-cols-[96px_minmax(0,1fr)] gap-3.5 rounded-xl border border-line p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand"
            >
              <div className="relative h-20 overflow-hidden rounded-[11px]">
                <Image src={propertyShots(p.slug, p.images)[0]} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14.5px] font-semibold text-ink">{pick(p, 'title', locale)}</div>
                <div className="mt-1 text-[14.5px] font-bold text-brand">{formatPrice(p.price, locale, p.per_month)}</div>
                <div className="mt-1.5 text-[11.5px] text-muted">{p.area_sqft} · {p.bedrooms}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div data-map-canvas className="relative min-h-[420px] bg-surface2">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(16,80,79,.09) 0 1px, transparent 1px 42px), repeating-linear-gradient(0deg, rgba(16,80,79,.09) 0 1px, transparent 1px 42px)',
          }}
        />
        {list.map((p) => {
          const { top, left } = pos(p);
          return (
            <Link
              key={p.id}
              href={'/' + locale + '/properties/' + p.slug}
              style={{ top, insetInlineStart: left }}
              className={
                'absolute -translate-x-1/2 -translate-y-full rounded-full px-3 py-[7px] text-[12.5px] font-bold shadow-card transition-transform duration-300 ease-cine hover:scale-110 ' +
                (active === p.id ? 'bg-gold text-white' : 'bg-brand text-brand-on')
              }
            >
              {formatPrice(p.price, locale, p.per_month)}
            </Link>
          );
        })}
        <span className="absolute bottom-4 start-5 font-mono text-[10.5px] text-muted">map tiles — Mapbox / Google</span>
      </div>
    </div>
  );
}
