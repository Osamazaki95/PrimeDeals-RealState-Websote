import Image from 'next/image';
import { avatar } from '@/lib/media';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

export type Review = {
  id: string;
  name_en: string; name_ar: string;
  role_en: string; role_ar: string;
  quote_en: string; quote_ar: string;
  rating: number;
  photo?: string | null;
};

export function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  return (
    <figure className="flex w-[380px] max-w-[380px] shrink-0 snap-start flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand hover:shadow-card">
      <div className="flex gap-[3px] text-[15px] tracking-wide text-gold">{'★'.repeat(Math.round(review.rating))}</div>
      <blockquote className="text-[15px] leading-loose text-ink">{pick(review, 'quote', locale)}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3.5 pt-1.5">
        <Image
          src={avatar(review.id, review.photo)}
          alt={pick(review, 'name', locale)}
          width={46}
          height={46}
          className="h-[46px] w-[46px] shrink-0 rounded-full object-cover"
        />
        <div>
          <div className="text-[14.5px] font-semibold">{pick(review, 'name', locale)}</div>
          <div className="mt-0.5 text-xs text-muted">{pick(review, 'role', locale)}</div>
        </div>
      </figcaption>
    </figure>
  );
}
