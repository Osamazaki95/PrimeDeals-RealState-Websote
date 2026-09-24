'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';

type Item = { href: string; label: string; children?: { href: string; label: string }[] };

/**
 * Glass sticky header. The full nav shows from xl up; below that it collapses
 * into a sheet so it can never collide with the control cluster.
 */
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState('');
  const ar = locale === 'ar';

  const items: Item[] = [
    { href: '', label: dict.nav.home },
    { href: '/about', label: dict.nav.about },
    {
      href: '/projects',
      label: dict.nav.projects,
      children: [
        { href: '/projects', label: ar ? 'كل المشاريع' : 'All projects' },
        { href: '/projects?area=new-cairo', label: ar ? 'القاهرة الجديدة' : 'New Cairo' },
        { href: '/projects?area=sheikh-zayed', label: ar ? 'الشيخ زايد' : 'Sheikh Zayed' },
        { href: '/projects?area=north-coast', label: ar ? 'الساحل الشمالي' : 'North Coast' },
        { href: '/map', label: ar ? 'المشاريع على الخريطة' : 'Projects on map' },
      ],
    },
    {
      href: '/properties',
      label: dict.nav.property,
      children: [
        { href: '/properties', label: ar ? 'كل العقارات' : 'All properties' },
        { href: '/properties?listing=sale', label: ar ? 'للبيع' : 'For sale' },
        { href: '/properties?listing=rent', label: ar ? 'للإيجار' : 'For rent' },
        { href: '/properties?listing=resale', label: ar ? 'إعادة بيع' : 'Resale' },
        { href: '/map', label: dict.nav.map },
      ],
    },
    { href: '/blog', label: dict.nav.blog },
    { href: '/careers', label: dict.nav.careers },
    { href: '/contact', label: dict.nav.contact },
  ];

  const full = (h: string) => '/' + locale + h;
  const isActive = (h: string) => (h === '' ? pathname === '/' + locale : pathname.startsWith(full(h)));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-2xl">
      <div className="pd-shell mx-auto flex max-w-shell items-center gap-6 px-5 py-3 sm:px-6 sm:py-3.5">
        <Logo locale={locale} />

        {/* full nav — xl and up only */}
        <nav className="ms-auto hidden min-w-0 items-center gap-0.5 xl:flex">
          {items.map((item) => (
            <div
              key={item.href}
              className="relative shrink-0"
              onMouseEnter={() => item.children && setOpen(item.href)}
              onMouseLeave={() => item.children && setOpen('')}
            >
              <Link
                href={full(item.href)}
                className={
                  'relative flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-3 py-2 text-[14.5px] transition-colors duration-300 hover:bg-surface2 ' +
                  (isActive(item.href) ? 'font-semibold text-brand' : 'font-medium text-ink')
                }
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={13}
                    className="opacity-60 transition-transform duration-300"
                    style={{ transform: 'rotate(' + (open === item.href ? 180 : 0) + 'deg)' }}
                  />
                )}
                <span
                  className="absolute inset-x-3 bottom-0.5 h-0.5 origin-center rounded-full bg-brand transition-transform duration-300 ease-cine"
                  style={{ transform: 'scaleX(' + (isActive(item.href) ? 1 : 0) + ')' }}
                />
              </Link>

              {item.children && open === item.href && (
                <div className="absolute start-0 top-full z-[60] mt-1.5 min-w-[230px] animate-rise rounded-2xl border border-line bg-surface/90 p-2 shadow-card backdrop-blur-2xl">
                  {item.children.map((c) => (
                    <Link
                      key={c.href + c.label}
                      href={full(c.href)}
                      onClick={() => setOpen('')}
                      className="block whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 hover:bg-cream hover:text-brand"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* controls — own the auto margin so they stay end-aligned with no nav */}
        <div className="ms-auto flex shrink-0 items-center gap-2">
          <button
            onClick={() => setSheet((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-[9px] border border-line bg-surface transition-colors duration-300 hover:border-brand hover:text-brand xl:hidden"
          >
            {sheet ? <X size={17} /> : <Menu size={17} />}
          </button>
          <LocaleToggle locale={locale} />
          <ThemeToggle />
          <Link
            href={full('/auth')}
            className="hidden h-9 place-items-center rounded-[9px] bg-brand px-[18px] text-[13.5px] font-semibold text-brand-on transition-transform duration-300 hover:-translate-y-0.5 sm:grid"
          >
            {dict.common.signIn}
          </Link>
        </div>
      </div>

      {/* sheet nav */}
      {sheet && (
        <div className="animate-rise border-t border-line bg-surface/90 px-5 pb-5 pt-3.5 backdrop-blur-2xl sm:px-6 xl:hidden">
          <div className="pd-shell mx-auto grid max-w-shell gap-1">
            {items.map((item) => (
              <div key={item.href} className="grid gap-0.5">
                <Link
                  href={full(item.href)}
                  onClick={() => setSheet(false)}
                  className={
                    'rounded-xl px-3.5 py-3 text-[15.5px] transition-colors duration-300 ' +
                    (isActive(item.href) ? 'bg-surface2 font-semibold text-brand' : 'font-medium text-ink hover:bg-surface2')
                  }
                >
                  {item.label}
                </Link>
                {item.children?.map((c) => (
                  <Link
                    key={c.href + c.label}
                    href={full(c.href)}
                    onClick={() => setSheet(false)}
                    className="ms-3.5 rounded-[10px] px-3.5 py-2 text-sm text-muted transition-colors duration-300 hover:text-brand"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href={full('/auth')}
              onClick={() => setSheet(false)}
              className="mt-2 grid h-12 place-items-center rounded-xl bg-brand font-semibold text-brand-on sm:hidden"
            >
              {dict.common.signIn}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
