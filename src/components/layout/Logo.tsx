import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

export function Logo({ locale, size = 'md' }: { locale: Locale; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-[46px] w-[46px] text-[15px]' : 'h-[38px] w-[38px] text-[13px]';
  return (
    <Link href={'/' + locale} className="flex flex-shrink-0 items-center gap-2.5 group">
      <span
        className={box + ' grid place-items-center bg-brand font-bold text-brand-on transition-transform duration-500 ease-cine group-hover:-rotate-[8deg] group-hover:scale-105'}
        style={{ borderRadius: '50% 50% 50% 8px' }}
      >
        PD
      </span>
      <span className="flex flex-col leading-[1.05]">
        <span className="text-sm font-semibold tracking-[.09em] text-brand">PRIME DEALS</span>
        <span className="text-[9.5px] font-medium tracking-[.22em] text-gold">BROKERAGE</span>
      </span>
    </Link>
  );
}
