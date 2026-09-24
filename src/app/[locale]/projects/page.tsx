import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import Image from 'next/image';
import { MEDIA, projectImage } from '@/lib/media';
import { Hero } from '@/components/sections/Hero';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProjects, getSeo } from '@/lib/queries';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('projects');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

/* PROJECTS — one wide card per compound, alternating image side on desktop. */
export default async function ProjectsPage({ params }: Props) {
  const { locale } = params;
  const [dict, projects] = await Promise.all([getDictionary(locale), getProjects()]);

  return (
    <>
      <Hero height="short" title={dict.projects.title} sub={dict.projects.sub} image={MEDIA.heroProjects} />

      <Section className="grid gap-6 py-14 sm:gap-[30px] sm:py-16">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 4) * 100}>
            <article className="group grid overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-card lg:grid-cols-2">
              <div className={'relative min-h-[290px] overflow-hidden ' + (i % 2 ? 'lg:order-2' : '')}>
                <div className="absolute inset-0 transition-transform duration-[800ms] ease-cine group-hover:scale-[1.07]">
                  <Image src={projectImage(project.slug, project.images, true)} alt={pick(project, 'name', locale)} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
              <div className="p-6 sm:p-9">
                <div className="font-mono text-[10.5px] tracking-[.22em] text-gold">{pick(project, 'location', locale)}</div>
                <h2 className="mb-2.5 mt-3 text-[25px] font-bold">{pick(project, 'name', locale)}</h2>
                <p className="mb-5 leading-loose text-muted">{pick(project, 'body', locale)}</p>
                <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3">
                  {[
                    { k: dict.projects.type, v: pick(project, 'unit_types', locale) },
                    { k: dict.projects.delivery, v: project.delivery_year ? String(project.delivery_year) : '—' },
                    { k: dict.projects.from, v: project.price_from ? formatPrice(project.price_from, locale) : '—' },
                  ].map((f) => (
                    <div key={f.k} className="rounded-[11px] bg-surface2 p-3.5">
                      <div className="text-[10px] font-bold tracking-[.13em] text-muted">{f.k}</div>
                      <div className="mt-1 text-[15.5px] font-semibold">{f.v}</div>
                    </div>
                  ))}
                </div>
                <Button href={'/' + locale + '/projects/' + project.slug} variant="outline" size="sm">{dict.projects.viewUnits}</Button>
              </div>
            </article>
          </Reveal>
        ))}
      </Section>
    </>
  );
}
