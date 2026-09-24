import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { PostCard } from '@/components/sections/PostCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { Hero } from '@/components/sections/Hero';
import { MEDIA } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getPosts, getSeo } from '@/lib/queries';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('blog');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

/* BLOG INDEX */
export default async function BlogPage({ params }: Props) {
  const { locale } = params;
  const [dict, posts] = await Promise.all([getDictionary(locale), getPosts()]);

  return (
    <>
      <Hero height="short" title={dict.blog.title} sub={dict.blog.sub} image={MEDIA.heroBlog} />

      <Section className="pt-16">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[26px]">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 110}>
              <PostCard post={post} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="cream" className="mt-20 py-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="max-w-[420px] text-[clamp(20px,2.4vw,28px)] font-bold">{dict.blog.newsletter}</h2>
          <div className="min-w-[280px] flex-1"><NewsletterForm dict={dict} variant="band" /></div>
        </div>
      </Section>
    </>
  );
}
