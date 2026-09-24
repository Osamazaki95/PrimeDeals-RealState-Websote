'use client';

import { useState } from 'react';
import { formatPrice, monthlyInstalment } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export function MortgageCalculator({ locale, dict, initialPrice = 5000000 }: { locale: Locale; dict: Dictionary; initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12.5);

  const { loan, monthly, totalPaid, totalInterest } = monthlyInstalment(price, down, years, rate);

  const sliders = [
    { label: dict.mortgage.price, value: price, set: setPrice, min: 500000, max: 40000000, step: 250000, display: formatPrice(price, locale) },
    { label: dict.mortgage.down, value: down, set: setDown, min: 5, max: 80, step: 1, display: down + '%' },
    { label: dict.mortgage.years, value: years, set: setYears, min: 3, max: 30, step: 1, display: String(years) },
    { label: dict.mortgage.rate, value: rate, set: setRate, min: 5, max: 25, step: 0.25, display: rate + '%' },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-10">
      <div className="grid gap-7">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-[13.5px] font-semibold text-muted">{s.label}</span>
              <span className="text-[17px] font-bold text-brand">{s.display}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full cursor-pointer accent-brand"
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-brand p-9 text-brand-on shadow-card">
        <div className="font-mono text-[10.5px] tracking-[.24em] opacity-80">{dict.mortgage.monthly}</div>
        <div className="my-3 text-[clamp(34px,5vw,52px)] font-bold leading-none">{formatPrice(Math.round(monthly), locale)}</div>
        <div className="grid gap-3.5">
          {[
            { k: dict.mortgage.loan, v: loan },
            { k: dict.mortgage.interest, v: totalInterest },
            { k: dict.mortgage.total, v: totalPaid },
          ].map((o) => (
            <div key={o.k} className="flex justify-between gap-4 border-b border-white/20 pb-3 text-sm">
              <span className="opacity-80">{o.k}</span>
              <span className="font-bold">{formatPrice(Math.round(o.v), locale)}</span>
            </div>
          ))}
        </div>
        <a
          href={'/' + locale + '/contact'}
          className="mt-7 grid h-12 place-items-center rounded-[10px] bg-brand-on font-bold text-brand transition-transform duration-300 hover:-translate-y-0.5"
        >
          {dict.mortgage.advisor}
        </a>
        <p className="mt-4 text-[11.5px] leading-relaxed opacity-70">{dict.mortgage.note}</p>
      </div>
    </div>
  );
}
