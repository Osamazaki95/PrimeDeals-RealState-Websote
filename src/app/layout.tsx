import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Cairo, IBM_Plex_Mono, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { defaultLocale, isLocale, localeMeta } from '@/lib/i18n/config';
import '@/styles/globals.css';

/* Typeface pairing taken from the design file: geometric sans for Latin,
   Cairo for Arabic, mono only for small technical labels. */
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-latin', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700'], variable: '--font-arabic', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Prime Deals Brokerage', template: '%s — Prime Deals' },
  description: 'Licensed real-estate brokerage across Greater Cairo and the North Coast.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const header = headers().get('x-locale') || defaultLocale;
  const locale = isLocale(header) ? header : defaultLocale;
  const { dir, htmlLang } = localeMeta[locale];

  return (
    <html lang={htmlLang} dir={dir} suppressHydrationWarning>
      <body className={[poppins.variable, cairo.variable, mono.variable, 'font-sans'].join(' ')}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
