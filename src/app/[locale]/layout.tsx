import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { QuickActions } from '@/components/layout/QuickActions';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Site chrome. The dashboard deliberately sits outside this layout. */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <ScrollProgress />
      <Header locale={locale} dict={dict} />
      <main className="pd-shell min-h-[60vh]">{children}</main>
      <Footer locale={locale} dict={dict} />
      <QuickActions locale={locale} />
    </>
  );
}
