'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { switchLocalePath, type Locale } from '@/lib/i18n/config';

export function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const next: Locale = locale === 'ar' ? 'en' : 'ar';
  return (
    <Link
      href={switchLocalePath(pathname, next)}
      onClick={() => { document.cookie = 'NEXT_LOCALE=' + next + '; path=/; max-age=31536000'; }}
      className="grid h-9 place-items-center rounded-[9px] border border-line bg-surface px-3 text-[12.5px] font-semibold tracking-wider transition-colors duration-300 hover:border-brand hover:text-brand"
    >
      {locale === 'ar' ? 'EN' : 'عربي'}
    </Link>
  );
}
