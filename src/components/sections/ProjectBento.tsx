import Link from 'next/link';
import Image from 'next/image';
import { projectImage } from '@/lib/media';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Project } from '@/types/db';

const AREAS = ['a', 'b', 'c', 'd', 'e'];

/**
 * Five signature projects as a bento: one hero tile plus four equal tiles.
 * Falls back to a single column on phones, 2×3 on tablets.
 */
export function ProjectBento({ projects, locale, fromWord }: { projects: Project[]; locale: Locale; fromWord: string }) {
  return (
    <div className="pd-bento grid gap-[18px]">
      {projects.slice(0, 5).map((p, i) => (
        <Link
          key={p.id}
          href={'/' + locale + '/projects/' + p.slug}
          style={{ gridArea: AREAS[i] }}
          className="group relative block min-h-[250px] overflow-hidden rounded-[20px] bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
        >
          <Image
            src={projectImage(p.slug, p.images, i === 0)}
            alt={pick(p, 'name', locale)}
            fill
            sizes={i === 0 ? '(max-width: 1080px) 100vw, 50vw' : '(max-width: 1080px) 50vw, 25vw'}
            className="object-cover transition-transform duration-[800ms] ease-cine group-hover:scale-[1.09]"
          />
          <span className="absolute inset-0" style={{ background: 'linear-gradient(transparent 38%, rgba(6,20,19,.9))' }} />
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-[7px] p-6 text-white">
            <span className="font-mono text-[10px] tracking-[.2em] text-[#E9C88B]">{pick(p, 'location', locale)}</span>
            <span className={(i === 0 ? 'text-[26px]' : 'text-lg') + ' font-semibold leading-tight'}>{pick(p, 'name', locale)}</span>
            <span className="text-[12.5px] text-white/75">
              {pick(p, 'unit_types', locale)}{p.delivery_year ? ' · ' + p.delivery_year : ''}
            </span>
            {p.price_from != null && (
              <span className="mt-1.5 self-start rounded-full border border-white/30 bg-white/20 px-[15px] py-[7px] text-[12.5px] font-bold backdrop-blur-md">
                {fromWord} {formatPrice(p.price_from, locale)}
              </span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}
