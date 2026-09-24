import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getJobs } from '@/lib/queries';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

export const metadata: Metadata = { title: 'Careers' };

/* CAREERS — every role links to its own page; applying happens there. */
export default async function CareersPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [dict, jobs] = await Promise.all([getDictionary(locale), getJobs()]);

  return (
    <>
      <Hero height="short" kicker={dict.careers.kicker} title={dict.careers.title} sub={dict.careers.sub} />

      <Section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[980px] gap-4">
          {jobs.map((job, i) => (
            <Reveal key={job.id} delay={(i % 4) * 90}>
              <Link
                href={'/' + locale + '/careers/' + job.slug}
                className="group grid gap-5 rounded-2xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand hover:shadow-card sm:p-7 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center"
              >
                <div>
                  <h2 className="mb-2 text-lg font-semibold sm:text-xl">{pick(job, 'title', locale)}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
                    {job.department_en && (
                      <span className="inline-flex items-center gap-1.5"><Briefcase size={13} />{pick(job, 'department', locale)}</span>
                    )}
                    {job.location_en && (
                      <span className="inline-flex items-center gap-1.5"><MapPin size={13} />{pick(job, 'location', locale)}</span>
                    )}
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed text-muted">{pick(job, 'body', locale)}</p>
                <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-brand px-6 font-semibold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-on lg:justify-self-end">
                  {dict.common.apply}
                  <ArrowRight size={15} className={locale === 'ar' ? 'rotate-180' : ''} />
                </span>
              </Link>
            </Reveal>
          ))}

          {jobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line py-16 text-center text-muted">
              <p className="mb-5">{dict.careers.noRoles}</p>
              <Link href={'/' + locale + '/contact'} className="font-semibold text-brand">{dict.nav.contact}</Link>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
