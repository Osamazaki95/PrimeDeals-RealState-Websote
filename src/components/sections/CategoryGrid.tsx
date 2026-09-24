import Link from 'next/link';
import Image from 'next/image';
import { categoryImage } from '@/lib/media';
import type { Locale } from '@/lib/i18n/config';

export type Category = { type: string; label: string; count: number };

/** "Find a property by category" — each tile pre-filters /properties. */
export function CategoryGrid({ categories, locale, unitWord }: { categories: Category[]; locale: Locale; unitWord: string }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-[18px]">
      {categories.map((c) => (
        <Link
          key={c.type}
          href={'/' + locale + '/properties' + (c.type === 'any' ? '' : '?type=' + c.type)}
          className="group relative block h-[200px] overflow-hidden rounded-[18px] bg-surface2 transition-all duration-500 ease-cine hover:-translate-y-1.5 hover:shadow-card"
        >
          <Image
            src={categoryImage(c.type)}
            alt={c.label}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-[800ms] ease-cine group-hover:scale-110"
          />
          <span className="absolute inset-0" style={{ background: 'linear-gradient(transparent 34%, rgba(6,20,19,.9))' }} />
          <span className="absolute inset-x-0 bottom-0 block p-[18px] text-white">
            <span className="block text-[17px] font-semibold">{c.label}</span>
            <span className="mt-1 block text-xs text-white/75">{c.count} {unitWord}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
