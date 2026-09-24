'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

/**
 * The glass search panel from the design: two tabs, a wide search field and a
 * row of pill selects. Submitting pushes everything into /properties as query
 * params, so the listing page stays a server component.
 */
export function SearchBar({ locale, dict, floating = true }: { locale: Locale; dict: Dictionary; floating?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();

  const [tab, setTab] = useState<'compounds' | 'properties'>('compounds');
  const [form, setForm] = useState({
    q: params.get('location') ?? '',
    type: params.get('type') ?? 'any',
    beds: params.get('beds') ?? 'any',
    instalments: params.get('instalments') ?? 'any',
    delivery: params.get('delivery') ?? 'any',
    price: params.get('price') ?? 'any',
    maxPrice: params.get('maxPrice') ?? '',
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (form.q) q.set('location', form.q);
    if (form.type !== 'any') q.set('type', form.type);
    if (form.beds !== 'any') q.set('beds', form.beds);
    if (form.instalments !== 'any') q.set('instalments', form.instalments);
    if (form.delivery !== 'any') q.set('delivery', form.delivery);
    if (form.maxPrice) q.set('maxPrice', form.maxPrice.replace(/[^\d]/g, ''));
    else if (form.price !== 'any') q.set('maxPrice', form.price);
    router.push('/' + locale + '/properties' + (q.toString() ? '?' + q.toString() : ''));
  }

  const ar = locale === 'ar';
  const selects: { key: keyof typeof form; options: { v: string; t: string }[] }[] = [
    { key: 'type', options: [
      { v: 'any', t: ar ? 'نوع العقار' : 'Property type' },
      { v: 'apartment', t: ar ? 'شقة' : 'Apartment' },
      { v: 'villa', t: ar ? 'فيلا' : 'Villa' },
      { v: 'townhouse', t: ar ? 'تاون هاوس' : 'Townhouse' },
      { v: 'chalet', t: ar ? 'شاليه' : 'Chalet' },
      { v: 'office', t: ar ? 'مكتب' : 'Office' },
    ] },
    { key: 'beds', options: [
      { v: 'any', t: ar ? 'الغرف والحمامات' : 'Bedrooms & bathrooms' },
      { v: '2', t: ar ? '٢+ غرف' : '2+ bedrooms' },
      { v: '3', t: ar ? '٣+ غرف' : '3+ bedrooms' },
      { v: '4', t: ar ? '٤+ غرف' : '4+ bedrooms' },
      { v: '5', t: ar ? '٥+ غرف' : '5+ bedrooms' },
    ] },
    { key: 'instalments', options: [
      { v: 'any', t: ar ? 'سنين التقسيط' : 'Installment years' },
      { v: '3', t: ar ? 'حتى ٣ سنين' : 'Up to 3 years' },
      { v: '5', t: ar ? 'حتى ٥ سنين' : 'Up to 5 years' },
      { v: '8', t: ar ? 'حتى ٨ سنين' : 'Up to 8 years' },
    ] },
    { key: 'delivery', options: [
      { v: 'any', t: ar ? 'سنة التسليم' : 'Delivery year' },
      { v: '2026', t: '2026' }, { v: '2027', t: '2027' }, { v: '2028', t: '2028' },
    ] },
    { key: 'price', options: [
      { v: 'any', t: ar ? 'نطاق السعر' : 'Price range' },
      { v: '5000000', t: ar ? 'حتى ٥ مليون' : 'Up to 5M' },
      { v: '10000000', t: ar ? 'حتى ١٠ مليون' : 'Up to 10M' },
      { v: '20000000', t: ar ? 'حتى ٢٠ مليون' : 'Up to 20M' },
    ] },
  ];

  const pill =
    'h-[50px] w-full cursor-pointer appearance-none rounded-full border border-line bg-surface/70 pe-10 ps-5 text-[14.5px] text-ink outline-none transition-colors duration-300 hover:border-brand focus:border-brand';

  return (
    <form
      onSubmit={submit}
      className={
        'animate-rise rounded-[24px] border border-line/60 bg-surface/60 p-4 shadow-card backdrop-blur-2xl [animation-delay:.4s] sm:p-[22px] ' +
        (floating ? 'relative z-[5] -mt-[120px] sm:-mt-[136px]' : '')
      }
    >
      {/* tabs */}
      <div className="mb-4 flex gap-7 border-b border-line/60 px-2 pb-1 sm:mb-[18px]">
        {(['compounds', 'properties'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              'relative pb-3 pt-1.5 text-[15px] transition-colors duration-300 sm:text-[17px] ' +
              (tab === t ? 'font-semibold text-brand' : 'font-medium text-muted')
            }
          >
            {t === 'compounds' ? (ar ? 'كومباوندات' : 'Compounds') : (ar ? 'عقارات' : 'Properties')}
            <span
              className="absolute inset-x-0 -bottom-px h-[3px] origin-center rounded-full bg-brand transition-transform duration-300 ease-cine"
              style={{ transform: 'scaleX(' + (tab === t ? 1 : 0) + ')' }}
            />
          </button>
        ))}
      </div>

      {/* wide search field */}
      <div className="relative mb-3.5">
        <Search size={17} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-brand" />
        <input
          value={form.q}
          onChange={set('q')}
          placeholder={ar ? 'ابحث عن كومباوند أو عقار…' : 'Search for compounds, properties…'}
          className="h-[52px] w-full rounded-full border-0 bg-surface pe-5 ps-12 text-[15px] text-ink shadow-[inset_0_0_0_1px_var(--line)] outline-none transition-shadow duration-300 focus:shadow-[inset_0_0_0_2px_var(--brand)] sm:h-[58px] sm:text-[15.5px]"
        />
      </div>

      {/* pills */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        {selects.map((s) => (
          <label key={s.key} className="relative block">
            <select value={form[s.key]} onChange={set(s.key)} className={pill}>
              {s.options.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
            </select>
            <span className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-[11px] text-muted">▾</span>
          </label>
        ))}

        <label className="relative block">
          <input
            value={form.maxPrice}
            onChange={set('maxPrice')}
            inputMode="numeric"
            placeholder={ar ? 'المقدم' : 'Down payment'}
            className="h-[50px] w-full rounded-full border border-line bg-surface/70 pe-14 ps-5 text-[14.5px] text-ink outline-none transition-colors duration-300 focus:border-brand"
          />
          <span className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">
            {dict.common.currency}
          </span>
        </label>

        <button
          type="submit"
          className="h-[50px] rounded-full bg-brand text-[15px] font-bold text-brand-on shadow-[0_14px_30px_-12px_rgba(4,16,15,.55)] transition-all duration-300 ease-cine hover:-translate-y-0.5 hover:brightness-110"
        >
          {ar ? 'ابحث' : 'Search'}
        </button>
      </div>
    </form>
  );
}
