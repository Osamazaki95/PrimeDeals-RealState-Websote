import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

/**
 * 1. Redirects "/" and unprefixed paths to /en or /ar (cookie aware).
 * 2. Passes the active locale to the root layout through the x-locale header,
 *    so <html lang dir> is correct on the very first byte.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const bypass =
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE.test(pathname);

  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  const fallback = locales.includes(cookieLocale as never) ? (cookieLocale as string) : defaultLocale;

  if (bypass) {
    const headers = new Headers(req.headers);
    headers.set('x-locale', fallback);
    return NextResponse.next({ request: { headers } });
  }

  const matched = locales.find((l) => pathname === '/' + l || pathname.startsWith('/' + l + '/'));

  if (!matched) {
    const url = req.nextUrl.clone();
    url.pathname = '/' + fallback + (pathname === '/' ? '' : pathname);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(req.headers);
  headers.set('x-locale', matched);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
