import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { LeadForm } from '@/components/sections/LeadForm';
import { Hero } from '@/components/sections/Hero';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProject, getProperties } from '@/lib/queries';
import { projectImage } from '@/lib/media';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  return { title: pick(project, 'name', params.locale), description: pick(project, 'body', params.locale) || undefined };
}

/* PROJECT DETAIL — hero, facts, available units, enquiry. */
export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [dict, units] = await Promise.all([getDictionary(locale), getProperties({ perPage: 6 })]);
  const inProject = units.items.filter((u) => u.project_id === project.id);
  const shown = inProject.length ? inProject : units.items.slice(0, 3);

  return (
    <>
      <Hero
        height="short"
        kicker={pick(project, 'location', locale)}
        title={pick(project, 'name', locale)}
        sub={pick(project, 'body', locale)}
        image={projectImage(project.slug, project.images, true)}
      />

      <Section className="py-16">
        <Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {[
              { k: dict.projects.type, v: pick(project, 'unit_types', locale) },
              { k: dict.projects.delivery, v: project.delivery_year ? String(project.delivery_year) : '—' },
              { k: dict.projects.from, v: project.price_from ? formatPrice(project.price_from, locale) : '—' },
            ].map((f) => (
              <div key={f.k} className="rounded-xl bg-surface2 p-5">
                <div className="text-[10.5px] font-bold tracking-[.14em] text-muted">{f.k}</div>
                <div className="mt-2 text-[18px] font-semibold">{f.v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <h2 className="mb-6 mt-14 text-[21px] font-semibold">{dict.projects.viewUnits}</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[26px]">
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 110}>
              <PropertyCard property={p} locale={locale} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-7 rounded-2xl border border-line bg-surface p-6 sm:mt-16 sm:gap-9 sm:p-9 lg:grid-cols-2">
          <div>
            <h2 className="mb-2 text-[22px] font-bold">{dict.contact.title}</h2>
            <p className="text-muted">{dict.contact.sub}</p>
          </div>
          <LeadForm dict={dict} source={'project:' + project.slug} layout="boxed" />
        </div>
      </Section>
    </>
  );
}
