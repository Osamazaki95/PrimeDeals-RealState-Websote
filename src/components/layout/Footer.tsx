import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { Logo } from './Logo';
import { NewsletterForm } from '../sections/NewsletterForm';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pages = [
    { href: '', label: dict.nav.home },
    { href: '/about', label: dict.nav.about },
    { href: '/projects', label: dict.nav.projects },
    { href: '/properties', label: dict.nav.property },
    { href: '/blog', label: dict.nav.blog },
    { href: '/contact', label: dict.nav.contact },
  ];
  const tools = [
    { href: '/careers', label: dict.nav.careers },
    { href: '/map', label: dict.nav.map },
    { href: '/mortgage', label: dict.nav.mortgage },
    { href: '/careers', label: dict.nav.careers },
    { href: '/account', label: dict.nav.account },
  ];
  const socials = [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'X', href: 'https://x.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      <div className="pd-shell mx-auto grid max-w-shell grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-9 px-5 pb-7 pt-12 sm:gap-11 sm:px-6 sm:pt-16">
        <div>
          <div className="mb-4"><Logo locale={locale} size="lg" /></div>
          <p className="mb-4 max-w-[300px] text-[13.5px] leading-relaxed text-muted">{dict.footer.blurb}</p>
          <NewsletterForm dict={dict} />
          <p className="mt-3.5 max-w-[300px] text-[11.5px] leading-relaxed text-muted">{dict.footer.consent}</p>
        </div>

        <div>
          <h3 className="mb-4 text-[17px] font-semibold">{dict.footer.pages}</h3>
          <div className="grid gap-2.5">
            {pages.map((p) => (
              <Link key={p.href} href={'/' + locale + p.href} className="w-fit text-sm text-muted transition-all duration-300 hover:translate-x-0.5 hover:text-brand">{p.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[17px] font-semibold">{dict.footer.tools}</h3>
          <div className="grid gap-2.5">
            {tools.map((p) => (
              <Link key={p.href} href={'/' + locale + p.href} className="w-fit text-sm text-muted transition-all duration-300 hover:translate-x-0.5 hover:text-brand">{p.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[17px] font-semibold">{dict.footer.follow}</h3>
          <div className="grid gap-2.5">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2.5 text-sm text-muted transition-all duration-300 hover:translate-x-0.5 hover:text-brand">
                <span className="h-[22px] w-[22px] flex-shrink-0 rounded-md bg-brand opacity-90" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pd-shell mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3.5 border-t border-line px-5 pb-8 pt-5 text-[12.5px] text-muted sm:px-6">
        <span>{dict.footer.copyright}</span>
        <div className="flex gap-6">
          <Link href={'/' + locale + '/privacy'} className="text-muted underline hover:text-brand">{dict.footer.privacy}</Link>
          <Link href={'/' + locale + '/terms'} className="text-muted underline hover:text-brand">{dict.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
