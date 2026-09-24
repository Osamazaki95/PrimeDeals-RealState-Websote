import Link from 'next/link';
import Image from 'next/image';
import { propertyShots } from '@/lib/media';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Property } from '@/types/db';
import { FavouriteButton } from './FavouriteButton';

const LISTING_LABEL: Record<string, { en: string; ar: string }> = {
  sale: { en: 'FOR SALE', ar: 'للبيع' },
  rent: { en: 'FOR RENT', ar: 'للإيجار' },
  resale: { en: 'RESALE', ar: 'إعادة بيع' },
  primary: { en: 'PRIMARY', ar: 'أولي' },
};

export function PropertyCard({ property, locale, showFavourite = true }: { property: Property; locale: Locale; showFavourite?: boolean }) {
  const title = pick(property, 'title', locale);
  const href = '/' + locale + '/properties/' + property.slug;
  const units = locale === 'ar'
    ? { area: ' قدم²', bath: ' حمام', bed: ' غرف' }
    : { area: ' sqft', bath: ' bath', bed: ' bedr' };

  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-surface transition-all duration-500 ease-cine hover:-translate-y-2 hover:border-brand hover:shadow-card">
      <div className="relative h-[210px] overflow-hidden">
        <Link href={href} className="absolute inset-0 transition-transform duration-700 ease-cine group-hover:scale-[1.09]">
          <Image src={propertyShots(property.slug, property.images)[0]} alt={title} fill sizes="(max-width: 640px) 100vw, 330px" className="object-cover" />
        </Link>
        <span className="pointer-events-none absolute start-3.5 top-3.5 rounded-full bg-cream px-2.5 py-[5px] text-[10.5px] font-bold tracking-[.12em] text-gold">
          {LISTING_LABEL[property.listing]?.[locale] ?? property.listing}
        </span>
        {property.tour_360_url && (
          <span className="pointer-events-none absolute start-3.5 top-[52px] rounded-full bg-[rgba(6,20,19,.55)] px-2.5 py-1.5 text-[10px] font-bold tracking-[.1em] text-white backdrop-blur-md">
            360°
          </span>
        )}
        {showFavourite && <FavouriteButton propertyId={property.id} />}
        <Link href={href} className="pointer-events-none absolute inset-x-0 bottom-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(6,20,19,.85))' }}>
          <h3 className="m-0 text-[17.5px] font-semibold text-white">{title}</h3>
        </Link>
      </div>
      <div className="p-[18px]">
        <div className="text-[19px] font-bold text-brand">{formatPrice(property.price, locale, property.per_month)}</div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted line-clamp-2">{pick(property, 'description', locale)}</p>
        <div className="mt-4 flex gap-[18px] border-t border-line pt-3.5 text-[12.5px] text-muted">
          <span>{property.area_sqft}{units.area}</span>
          <span>{property.bathrooms}{units.bath}</span>
          <span>{property.bedrooms}{units.bed}</span>
        </div>
      </div>
    </article>
  );
}
