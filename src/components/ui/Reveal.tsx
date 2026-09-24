'use client';

import { useEffect, useRef } from 'react';

/**
 * Cinematic scroll reveal. Wrap any block:
 *   <Reveal delay={120}>…</Reveal>
 * Honours prefers-reduced-motion through globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          node.style.transitionDelay = delay + 'ms';
          node.classList.remove('reveal-hidden');
          node.classList.add('reveal-in');
          io.unobserve(node);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={'reveal-hidden ' + className}>{children}</Tag>;
}
