import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHead } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getFaqs, getPageSections, getSeo, getTeam } from '@/lib/queries';
import { MEDIA, avatar } from '@/lib/media';
import { StatsBand } from '@/components/sections/StatsBand';
import Image from 'next/image';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('about');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

/* ABOUT — hero + stats · journey · team · FAQs · CTA */
export default async function AboutPage({ params }: Props) {
  const { locale } = params;
  const [dict, sections, home, team, faqs] = await Promise.all([
    getDictionary(locale), getPageSections('about'), getPageSections('home'), getTeam(), getFaqs(),
  ]);

  const stats = (home.stats?.['content_' + locale] ?? {}) as { items?: { value: string; label: string }[] };
  const journey = (sections.journey?.['content_' + locale] ?? {}) as { title?: string; body?: string };
  const values = (home.values?.['content_' + locale] ?? {}) as { items?: { title: string; body: string }[] };

  return (
    <>
      <Hero height="short" title={dict.about.title} sub={dict.about.sub} image={MEDIA.heroAbout} />

      {/* ── STATS (animated counters) ─────────────────────────── */}
      <Section className="pt-12 sm:pt-16">
        <Reveal>
          <StatsBand
            locale={locale}
            stats={[
              { target: 86, suffix: '+', label: dict.home.statsProjects },
              { target: 96, suffix: '%', label: dict.home.statsClients },
              { target: 8, suffix: '', label: dict.home.statsYears },
              { target: 1240, suffix: '+', label: dict.home.statsUnits },
            ]}
          />
        </Reveal>
      </Section>

      {/* ── JOURNEY ──────────────────────────────────────────── */}
      <Section className="py-[84px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-center gap-12">
          <Reveal>
            <div className="relative h-[380px] overflow-hidden rounded-xl border border-line">
              <Image src={MEDIA.handover} alt={journey.title || dict.about.journeyTitle} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={110}>
            <h2 className="mb-4 text-[clamp(23px,2.8vw,32px)] font-bold leading-tight">{journey.title || dict.about.journeyTitle}</h2>
            <p className="leading-loose text-muted">{journey.body}</p>
          </Reveal>
        </div>
      </Section>

      {/* ── OUR COMMITMENT TO EXCELLENCE ──────────────────────── */}
      <Section tone="surface2" className="py-16 sm:py-[84px]">
        <Reveal>
          <SectionHead kicker={dict.about.whyKicker} title={dict.about.whyTitle} sub={dict.about.whySub} />
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[22px]">
          {(values.items ?? []).map((v, i) => (
            <Reveal key={v.title} delay={(i % 4) * 100}>
              <div className="rounded-2xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand hover:shadow-card">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg text-brand-on">
                  {['◆', '◇', '◈', '❖'][i % 4]}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold">{v.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <Section tone="cream" className="py-20">
        <Reveal><SectionHead title={dict.about.teamTitle} sub={dict.about.teamSub} /></Reveal>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 100}>
              <div className="group overflow-hidden rounded-2xl bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card">
                <div className="relative h-[230px] overflow-hidden">
                  <Image src={avatar(m.id, m.photo)} alt={pick(m, 'name', locale)} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                </div>
                <div className="p-[18px]">
                  <div className="text-[16.5px] font-semibold">{pick(m, 'name', locale)}</div>
                  <div className="mt-1.5 inline-block rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold tracking-[.12em] text-gold">
                    {pick(m, 'role', locale)}
                  </div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                    {m.phone}<br />{m.email}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── FAQs ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[900px] px-6 py-[84px]">
        <Reveal><SectionHead title={dict.about.faqTitle} sub={dict.about.faqSub} /></Reveal>
        <FaqAccordion faqs={faqs} locale={locale} />
        <div className="mt-12 text-center">
          <Button href={'/' + locale + '/contact'} variant="outline">{dict.nav.contact}</Button>
        </div>
      </section>
    </>
  );
}
