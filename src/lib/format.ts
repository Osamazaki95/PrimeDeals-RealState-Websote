import type { Locale } from './i18n/config';

export function formatPrice(value: number, locale: Locale, perMonth = false) {
  const n = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 }).format(value);
  const unit = locale === 'ar' ? 'ج.م' : 'EGP';
  const suffix = perMonth ? (locale === 'ar' ? ' /شهر' : ' /month') : '';
  return locale === 'ar' ? n + ' ' + unit + suffix : unit + ' ' + n + suffix;
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(value);
}

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

/** Pick the right localised column: title_en / title_ar */
export function pick<T extends Record<string, unknown>>(row: T, field: string, locale: Locale): string {
  return (row[field + '_' + locale] as string) || (row[field + '_en'] as string) || '';
}

export function monthlyInstalment(price: number, downPct: number, years: number, ratePct: number) {
  const loan = Math.max(0, price - price * (downPct / 100));
  const r = ratePct / 100 / 12;
  const n = years * 12;
  const monthly = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const totalPaid = monthly * n;
  return { loan, monthly, totalPaid, totalInterest: totalPaid - loan };
}
