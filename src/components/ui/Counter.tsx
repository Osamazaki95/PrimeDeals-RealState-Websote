'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';

/**
 * Counts up from zero the first time it scrolls into view.
 * Respects prefers-reduced-motion by jumping straight to the value.
 */
export function Counter({
  to, suffix = '', locale, className = '',
}: { to: number; suffix?: string; locale: Locale; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const fmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const start = performance.now();
          const tick = (now: number) => {
            const k = Math.min(1, (now - start) / 1400);
            setValue(Math.round(to * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className={'tabular-nums ' + className}>
      {fmt.format(value)}{suffix}
    </span>
  );
}
