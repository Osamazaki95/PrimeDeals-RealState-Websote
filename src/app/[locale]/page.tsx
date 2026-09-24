import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { SearchBar } from '@/components/sections/SearchBar';
import { StatsBand } from '@/components/sections/StatsBand';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ProjectBento } from '@/components/sections/ProjectBento';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { PostCard } from '@/components/sections/PostCard';
import { ReviewCard } from '@/components/sections/ReviewCard';
import { Carousel } from '@/components/ui/Carousel';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHead } from '@/components/ui/Section';
import { MEDIA } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import {
  getCategoryCounts, getPageSections, getPosts, getProjects, getProperties, getReviews, getSeo,
} from '@/lib/queries';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('home');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

/* ─────────────────────────────────────────────────────────────────────
   HOME — section order:
   hero · search · stats · featured (carousel) · categories · welcome
   · values · five projects (bento) · reviews (carousel) · news · CTA
   Copy comes from page_sections (dashboard-editable) with the shipped
   dictionary as fallback.
   ───────────────────────────────────────────────────────────────────── */
export default async function HomePage({ params }: Props) {
  const { locale } = params;
  const [dict, sections, featured, projects, posts, reviews, counts] = await Promise.all([
    getDictionary(locale),
    getPageSections('home'),
    getProperties({ perPage: 8 }),
    getProjects(),
    getPosts(3),
    getReviews(),
    getCategoryCounts(),
  ]);

  const heroCms = (sections.hero?.['content_' + locale] ?? {}) as Record<string, string>;
  const valuesCms = (sections.values?.['content_' + locale] ?? {}) as { items?: { title: string; body: string }[] };

  const stats = [
    { target: 86, suffix: '+', label: dict.home.statsProjects },
    { target: 96, suffix: '%', label: dict.home.statsClients },
    { target: 8, suffix: '', label: dict.home.statsYears },
    { target: 1240, suffix: '+', label: dict.home.statsUnits },
  ];

  const categories = [
    { type: 'apartment', label: locale === 'ar' ? 'شقق' : 'Apartments', count: counts.byType.apartment ?? 0 },
    { type: 'villa', label: locale === 'ar' ? 'فيلات' : 'Villas', count: counts.byType.villa ?? 0 },
    { type: 'townhouse', label: locale === 'ar' ? 'تاون هاوس' : 'Townhouses', count: counts.byType.townhouse ?? 0 },
    { type: 'chalet', label: locale === 'ar' ? 'شاليهات' : 'Chalets', count: counts.byType.chalet ?? 0 },
    { type: 'office', label: locale === 'ar' ? 'مكاتب' : 'Offices', count: counts.byType.office ?? 0 },
    { type: 'any', label: locale === 'ar' ? 'كل الوحدات' : 'Everything', count: counts.total },
  ];

  const valueIcons = ['◆', '◇', '◈', '❖'];

  return (
    <>
      {/* ── HERO (headline only — the numbers have their own band) ─── */}
      <Hero
        kicker={heroCms.kicker || dict.home.kicker}
        title={heroCms.title || dict.home.title}
        sub={heroCms.sub || dict.home.sub}
        image={heroCms.image || MEDIA.heroHome}
        bottomPad="search"
      />

      {/* ── SEARCH PANEL (glass, overlapping the hero) ─────────────── */}
      <div className="relative z-[6] mx-auto -mt-[112px] w-full max-w-[1180px] px-5 sm:-mt-[136px] sm:px-6">
        <SearchBar locale={locale} dict={dict} floating={false} />
      </div>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <Section className="pt-14 sm:pt-20">
        <Reveal><StatsBand stats={stats} locale={locale} /></Reveal>
      </Section>

      {/* ── FEATURED LISTINGS (horizontal carousel) ────────────────── */}
      <Section className="pt-16 sm:pt-[84px]">
        <Reveal>
          <Carousel locale={locale} title={dict.home.featTitle} sub={dict.home.featSub}>
            {featured.items.map((p) => (
              <div key={p.id} className="w-[300px] shrink-0 snap-start sm:w-[330px]">
                <PropertyCard property={p} locale={locale} />
              </div>
            ))}
          </Carousel>
        </Reveal>
        <div className="mt-8 flex justify-center">
          <Button href={'/' + locale + '/properties'} variant="outline">{dict.common.viewAll}</Button>
        </div>
      </Section>

      {/* ── FIND A PROPERTY BY CATEGORY ────────────────────────────── */}
      <Section className="pt-16 sm:pt-[88px]">
        <Reveal>
          <SectionHead kicker={dict.home.catKicker} title={dict.home.catTitle} sub={dict.home.catSub} />
        </Reveal>
        <Reveal delay={90}>
          <CategoryGrid categories={categories} locale={locale} unitWord={dict.common.listings} />
        </Reveal>
      </Section>

      {/* ── WELCOME ────────────────────────────────────────────────── */}
      <Section tone="cream" className="mt-16 py-16 sm:mt-24 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <p className="mb-3 font-mono text-[11px] tracking-[.28em] text-gold">{dict.home.aboutKicker}</p>
            <h2 className="mb-4 text-[clamp(23px,3vw,34px)] font-bold leading-tight">{dict.home.welcomeTitle}</h2>
            <p className="mb-4 leading-loose text-muted">{dict.home.welcomeBody}</p>
            <Button href={'/' + locale + '/about'} variant="outline" size="sm" className="mt-2">{dict.common.discover}</Button>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-[260px] overflow-hidden rounded-[18px] sm:h-[340px]">
              <Image src={MEDIA.office} alt={dict.home.welcomeTitle} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── VALUES ─────────────────────────────────────────────────── */}
      <Section className="py-16 sm:py-[88px]">
        <Reveal><SectionHead title={dict.home.whyTitle} sub={dict.home.whySub} /></Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[22px]">
          {(valuesCms.items ?? []).map((v, i) => (
            <Reveal key={v.title} delay={(i % 4) * 100}>
              <div className="rounded-2xl bg-cream p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg text-brand-on">
                  {valueIcons[i % 4]}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold">{v.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── FIVE SIGNATURE PROJECTS (bento) ───────────────────────── */}
      <Section tone="surface2" className="py-16 sm:py-[84px]">
        <Reveal>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-[620px]">
              <p className="mb-2.5 font-mono text-[11px] tracking-[.28em] text-gold">{dict.home.projKicker}</p>
              <h2 className="mb-2 text-[clamp(23px,3vw,32px)] font-bold">{dict.home.projTitle}</h2>
              <p className="text-muted">{dict.home.projSub}</p>
            </div>
            <Button href={'/' + locale + '/projects'} variant="outline" size="sm">{dict.home.allProjects}</Button>
          </div>
        </Reveal>
        <ProjectBento projects={projects} locale={locale} fromWord={dict.common.from} />
      </Section>

      {/* ── CLIENT REVIEWS (carousel) ─────────────────────────────── */}
      <Section className="py-16 sm:py-[88px]">
        <Reveal>
          <Carousel locale={locale} kicker={dict.home.revKicker} title={dict.home.revTitle} sub={dict.home.revSub}>
            {reviews.map((r) => <ReviewCard key={r.id} review={r} locale={locale} />)}
          </Carousel>
        </Reveal>
      </Section>

      {/* ── LATEST NEWS ───────────────────────────────────────────── */}
      <Section tone="surface2" className="py-16 sm:py-[84px]">
        <Reveal><SectionHead title={dict.home.blogTitle} sub={dict.home.blogSub} /></Reveal>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[26px]">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 110}>
              <PostCard post={post} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-[86px]">
        <Image src={MEDIA.cta} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(16,80,79,.92), rgba(6,20,19,.82))' }} />
        <Reveal>
          <div className="relative mx-auto max-w-[820px] text-center text-white">
            <h2 className="mb-3 text-[clamp(23px,3vw,34px)] font-bold">{dict.home.ctaTitle}</h2>
            <p className="mb-7 leading-relaxed opacity-90">{dict.home.ctaSub}</p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Link href={'/' + locale + '/contact'} className="grid h-[50px] place-items-center rounded-full bg-white px-8 font-bold text-brand transition-transform duration-300 hover:-translate-y-0.5">
                {dict.nav.contact}
              </Link>
              <Link href={'/' + locale + '/mortgage'} className="grid h-[50px] place-items-center rounded-full border-[1.5px] border-white/60 bg-white/10 px-8 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand">
                {dict.nav.mortgage}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
