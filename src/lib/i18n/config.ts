export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale =
  (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || 'en';

export const localeMeta: Record<Locale, { label: string; dir: 'ltr' | 'rtl'; htmlLang: string }> = {
  en: { label: 'English', dir: 'ltr', htmlLang: 'en' },
  ar: { label: 'العربية', dir: 'rtl', htmlLang: 'ar' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Swap the locale segment of a pathname: /en/properties -> /ar/properties */
export function switchLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts[0] = next;
  else parts.unshift(next);
  return '/' + parts.join('/');
}
