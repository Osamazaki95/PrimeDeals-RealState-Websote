'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

/**
 * URL-driven filter bar. Every change rewrites the query string, so filters are
 * shareable, back-button friendly and read by the server component that lists results.
 */
export function PropertyFilters({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const params = useSearchParams();

  const set = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === 'any') next.delete(key);
      else next.set(key, value);
      next.delete('page');
      router.push('/' + locale + '/properties?' + next.toString());
    },
    [params, router, locale]
  );

  const types = [
    { v: 'any', t: dict.filters.anyType },
    { v: 'apartment', t: locale === 'ar' ? 'شقة' : 'Apartment' },
    { v: 'villa', t: locale === 'ar' ? 'فيلا' : 'Villa' },
    { v: 'townhouse', t: locale === 'ar' ? 'تاون هاوس' : 'Townhouse' },
    { v: 'chalet', t: locale === 'ar' ? 'شاليه' : 'Chalet' },
  ];
  const beds = ['any', '2', '3', '4', '5'].map((v) => ({ v, t: v === 'any' ? dict.filters.any : v + '+' }));
  const sorts = [
    { v: 'new', t: dict.filters.sortNew },
    { v: 'low', t: dict.filters.sortLow },
    { v: 'high', t: dict.filters.sortHigh },
  ];

  const input = 'h-[42px] rounded-[9px] border border-line bg-surface2 px-3.5 outline-none transition-colors duration-300 focus:border-brand';
  const labelCls = 'text-[11px] font-bold tracking-[.14em] text-muted';

  return (
    <div className="relative z-[5] -mt-[34px] grid animate-rise grid-cols-[repeat(auto-fit,minmax(170px,1fr))] items-end gap-4 rounded-xl border border-line bg-surface p-5 shadow-card">
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{dict.filters.location}</span>
        <input
          defaultValue={params.get('location') ?? ''}
          onBlur={(e) => set('location', e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') set('location', (e.target as HTMLInputElement).value); }}
          placeholder={dict.filters.locationPlaceholder}
          className={input}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{dict.filters.type}</span>
        <select value={params.get('type') ?? 'any'} onChange={(e) => set('type', e.target.value)} className={input + ' cursor-pointer'}>
          {types.map((t) => <option key={t.v} value={t.v}>{t.t}</option>)}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{dict.filters.beds}</span>
        <select value={params.get('beds') ?? 'any'} onChange={(e) => set('beds', e.target.value)} className={input + ' cursor-pointer'}>
          {beds.map((b) => <option key={b.v} value={b.v}>{b.t}</option>)}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{dict.filters.budget}</span>
        <input
          defaultValue={params.get('maxPrice') ?? ''}
          onBlur={(e) => set('maxPrice', e.target.value.replace(/[^\d]/g, ''))}
          placeholder={dict.filters.budgetPlaceholder}
          className={input}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{dict.filters.sortNew}</span>
        <select value={params.get('sort') ?? 'new'} onChange={(e) => set('sort', e.target.value)} className={input + ' cursor-pointer'}>
          {sorts.map((s) => <option key={s.v} value={s.v}>{s.t}</option>)}
        </select>
      </label>

      <button
        onClick={() => router.push('/' + locale + '/properties')}
        className="h-[44px] rounded-[9px] border border-line bg-surface2 text-[13.5px] font-semibold transition-colors duration-300 hover:border-brand hover:text-brand"
      >
        {dict.common.reset}
      </button>
    </div>
  );
}
