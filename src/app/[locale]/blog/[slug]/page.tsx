import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PostCard } from '@/components/sections/PostCard';
import { Reveal } from '@/components/ui/Reveal';
import Image from 'next/image';
import { avatar, postCover } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getPost, getPosts, getTeam } from '@/lib/queries';
import { formatDate, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: pick(post, 'title', params.locale),
    description: pick(post, 'excerpt', params.locale) || undefined,
    openGraph: { images: post.cover ? [post.cover] : [] },
  };
}

/* BLOG POST — title, cover, body, author card, related posts. */
export default async function PostPage({ params }: Props) {
  const { locale, slug } = params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [dict, team, all] = await Promise.all([getDictionary(locale), getTeam(), getPosts(4)]);
  const author = team[0];
  const related = all.filter((p) => p.slug !== slug).slice(0, 3);
  const title = pick(post, 'title', locale);
  const body = pick(post, 'body', locale);

  return (
    <div className="mx-auto max-w-shell px-5 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10">
      <Link
        href={'/' + locale + '/blog'}
        className="mb-6 inline-grid h-[38px] place-items-center rounded-[9px] border border-line bg-surface px-4 text-[13px] font-semibold text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
      >
        {locale === 'ar' ? '→ ' : '← '}{dict.blog.backToBlog}
      </Link>

      <h1 className="mb-6 max-w-[900px] animate-rise text-[clamp(26px,3.6vw,42px)] font-bold leading-[1.15] text-brand">{title}</h1>

      <div className="relative h-[min(52vh,460px)] animate-rise overflow-hidden rounded-2xl [animation-delay:.1s]">
        <div className="absolute inset-0 animate-kenburns">
          <Image src={postCover(post.slug, post.cover)} alt={title} fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      <div className="mt-12 grid gap-11 lg:grid-cols-[minmax(0,1.7fr)_minmax(250px,.8fr)]">
        <Reveal>
          <article className="max-w-[720px]">
            {post.published_at && (
              <p className="mb-5 font-mono text-[11px] tracking-[.2em] text-gold">{formatDate(post.published_at, locale)}</p>
            )}
            {body.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="mb-6 text-[15px] leading-loose text-muted">{para}</p>
            ))}
          </article>
        </Reveal>

        <Reveal delay={110}>
          <aside className="sticky top-24 self-start rounded-xl border-t-[3px] border-t-brand bg-surface2 p-6 text-center">
            <div className="relative mx-auto mb-3.5 h-[84px] w-[84px] overflow-hidden rounded-full border border-line">
              <Image src={avatar(author?.id ?? 'author', author?.photo)} alt={author ? pick(author, 'name', locale) : ''} fill sizes="88px" className="object-cover" />
            </div>
            <div className="text-[17px] font-semibold">{author ? pick(author, 'name', locale) : 'Prime Deals'}</div>
            <div className="mt-2 inline-block rounded-full bg-cream px-3 py-1 text-[10.5px] font-bold tracking-[.12em] text-gold">
              {author ? pick(author, 'role', locale) : dict.common.salesManager}
            </div>
            <p className="mt-3.5 text-[13px] leading-relaxed text-muted">{author?.email}</p>
          </aside>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-[21px] font-semibold">{dict.blog.related}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <PostCard post={p} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
