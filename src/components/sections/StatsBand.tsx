import { Counter } from '../ui/Counter';
import type { Locale } from '@/lib/i18n/config';

export type Stat = { target: number; suffix?: string; label: string };

/** Glass card of animated counters. Sits under the hero, not inside it. */
export function StatsBand({ stats, locale, tone = 'card' }: { stats: Stat[]; locale: Locale; tone?: 'card' | 'plain' }) {
  const shell =
    tone === 'card'
      ? 'rounded-[22px] border border-line bg-surface/80 p-[34px_26px] shadow-card backdrop-blur-xl'
      : '';
  return (
    <div className={'grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[26px] ' + shell} style={tone === 'card' ? { padding: '34px 26px' } : undefined}>
      {stats.map((s) => (
        <div key={s.label} className="px-2.5 text-center">
          <div className={'text-[clamp(28px,3.4vw,42px)] font-bold leading-none ' + (tone === 'card' ? 'text-brand' : 'text-white')}>
            <Counter to={s.target} suffix={s.suffix} locale={locale} />
          </div>
          <div className={'mt-2 text-[13px] font-semibold tracking-wide ' + (tone === 'card' ? 'text-muted' : 'text-white/72')}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
