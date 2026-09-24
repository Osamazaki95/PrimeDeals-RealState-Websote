import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

/**
 * Server-rendered pagination. Every button is a real link that carries the
 * current filters, so back/forward and sharing both work.
 */
export function Pagination({
  page, pageCount, locale, basePath, params,
}: {
  page: number;
  pageCount: number;
  locale: Locale;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;
  const fmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');

  const href = (n: number) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v && k !== 'page') q.set(k, v); });
    q.set('page', String(n));
    return basePath + '?' + q.toString();
  };

  const arrow = (dir: -1 | 1) => {
    const target = page + dir;
    const disabled = target < 1 || target > pageCount;
    const glyph = dir === -1 ? '‹' : '›';
    const cls =
      'grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-[17px] transition-all duration-300 ';
    if (disabled) return <span className={cls + 'cursor-not-allowed text-muted'}>{glyph}</span>;
    return <Link href={href(target)} className={cls + 'text-brand hover:border-brand'}>{glyph}</Link>;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 pb-20 pt-11">
      {arrow(-1)}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          className={
            'grid h-11 min-w-11 place-items-center rounded-full border px-3.5 text-sm font-semibold transition-all duration-300 ' +
            (n === page ? 'border-brand bg-brand text-brand-on' : 'border-line bg-surface text-ink hover:border-brand')
          }
        >
          {fmt.format(n)}
        </Link>
      ))}
      {arrow(1)}
      <span className="ms-2.5 text-[13px] text-muted">
        {locale === 'ar' ? 'صفحة ' + page + ' من ' + pageCount : 'page ' + page + ' of ' + pageCount}
      </span>
    </div>
  );
}
