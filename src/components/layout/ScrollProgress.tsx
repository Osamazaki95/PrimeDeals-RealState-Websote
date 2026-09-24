'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        className="h-full transition-[width] duration-100"
        style={{ width: pct + '%', background: 'linear-gradient(90deg, var(--brand), var(--gold))' }}
      />
    </div>
  );
}
