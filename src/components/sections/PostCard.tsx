import Link from 'next/link';
import Image from 'next/image';
import { postCover } from '@/lib/media';
import { formatDate, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Post } from '@/types/db';

export function PostCard({ post, locale, dict }: { post: Post; locale: Locale; dict: Dictionary }) {
  const href = '/' + locale + '/blog/' + post.slug;
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-surface transition-all duration-500 ease-cine hover:-translate-y-2 hover:shadow-card">
      <Link href={href} className="relative block h-[190px] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-cine group-hover:scale-[1.08]">
          <Image src={postCover(post.slug, post.cover)} alt={pick(post, 'title', locale)} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
      </Link>
      <div className="p-5">
        {post.published_at && (
          <div className="mb-2 text-[11.5px] font-semibold tracking-wider text-gold">{formatDate(post.published_at, locale)}</div>
        )}
        <h3 className="mb-2 text-[17.5px] font-semibold leading-snug">
          <Link href={href} className="text-ink hover:text-brand">{pick(post, 'title', locale)}</Link>
        </h3>
        <p className="mb-4 text-[13.5px] leading-relaxed text-muted line-clamp-3">{pick(post, 'excerpt', locale)}</p>
        <Link
          href={href}
          className="inline-grid h-[38px] place-items-center rounded-lg border-[1.5px] border-brand px-5 text-[13px] font-semibold text-brand transition-colors duration-300 hover:bg-brand hover:text-brand-on"
        >
          {dict.common.read}
        </Link>
      </div>
    </article>
  );
}
