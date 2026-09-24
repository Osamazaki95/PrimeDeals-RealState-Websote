'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

/**
 * Scroll-snap rail with arrow controls. Direction-aware, so the arrows do the
 * right thing in Arabic. Children should be fixed-width flex items.
 */
export function Carousel({
  children, locale, title, sub, kicker,
}: {
  children: React.ReactNode;
  locale: Locale;
  title: string;
  sub?: string;
  kicker?: string;
}) {
  const rail = useRef<HTMLDivElement | null>(null);
  const nudge = (dir: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    const rtl = locale === 'ar' ? -1 : 1;
    el.scrollBy({ left: dir * rtl * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-[620px]">
          {kicker && <p className="mb-2.5 font-mono text-[11px] tracking-[.28em] text-gold">{kicker}</p>}
          <h2 className="mb-3 text-[clamp(24px,3vw,34px)] font-bold">{title}</h2>
          {sub && <p className="leading-relaxed text-muted">{sub}</p>}
        </div>
        <div className="flex gap-2.5">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => nudge(dir)}
              aria-label={dir === -1 ? 'Previous' : 'Next'}
              className="grid h-[46px] w-[46px] place-items-center rounded-full border border-line bg-surface text-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:text-brand-on"
            >
              {dir === -1 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={rail}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-0.5 pb-3.5 pt-1.5 [scrollbar-width:thin]"
      >
        {children}
      </div>
    </div>
  );
}
