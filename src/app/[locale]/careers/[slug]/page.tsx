import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Briefcase, CalendarDays, Clock, MapPin, Wallet } from 'lucide-react';
import { ApplicationForm } from '@/components/sections/ApplicationForm';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getJob, getJobs } from '@/lib/queries';
import { formatDate, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Job } from '@/types/db';

type Props = { params: { locale: Locale; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) return {};
  return {
    title: pick(job, 'title', params.locale),
    description: pick(job, 'body', params.locale) || undefined,
  };
}

/** Localised string array: responsibilities_en / responsibilities_ar */
function list(job: Job, field: 'responsibilities' | 'requirements' | 'benefits', locale: Locale) {
  const key = (field + '_' + locale) as keyof Job;
  const fallback = (field + '_en') as keyof Job;
  return ((job[key] as string[] | null) ?? (job[fallback] as string[] | null) ?? []) as string[];
}

/* JOB DETAIL — full posting, then the application form with CV upload. */
export default async function JobPage({ params }: Props) {
  const { locale, slug } = params;
  const job = await getJob(slug);
  if (!job || !job.published) notFound();

  const [dict, allJobs] = await Promise.all([getDictionary(locale), getJobs()]);
  const c = dict.careers;
  const title = pick(job, 'title', locale);

  const employmentLabels: Record<string, string> = {
    full_time: c.fullTime, part_time: c.partTime, contract: c.contract, internship: c.internship,
  };

  const facts = [
    job.department_en && { icon: <Briefcase size={15} />, k: c.department, v: pick(job, 'department', locale) },
    job.location_en && { icon: <MapPin size={15} />, k: dict.properties.location, v: pick(job, 'location', locale) },
    job.employment_type && { icon: <Clock size={15} />, k: c.type, v: employmentLabels[job.employment_type] || job.employment_type },
    job.experience_en && { icon: <CalendarDays size={15} />, k: c.experience, v: pick(job, 'experience', locale) },
    job.salary_en && { icon: <Wallet size={15} />, k: c.package, v: pick(job, 'salary', locale) },
  ].filter(Boolean) as { icon: React.ReactNode; k: string; v: string }[];

  const blocks = [
    { title: c.responsibilities, items: list(job, 'responsibilities', locale) },
    { title: c.requirements, items: list(job, 'requirements', locale) },
    { title: c.benefits, items: list(job, 'benefits', locale) },
  ].filter((b) => b.items.length > 0);

  const others = allJobs.filter((j) => j.slug !== slug).slice(0, 3);

  return (
    <>
      {/* HEADER BAND */}
      <div className="border-b border-line bg-cream">
        <div className="mx-auto max-w-shell px-5 py-10 sm:px-6 sm:py-14">
          <Link
            href={'/' + locale + '/careers'}
            className="mb-6 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[13px] font-semibold text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
          >
            <ArrowLeft size={14} className={locale === 'ar' ? 'rotate-180' : ''} />
            {c.backToRoles}
          </Link>

          <h1 className="max-w-[820px] text-[clamp(24px,4.2vw,40px)] font-bold leading-tight">{title}</h1>
          {job.posted_at && (
            <p className="mt-3 text-[13px] text-muted">{c.posted} {formatDate(job.posted_at, locale)}</p>
          )}

          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
            {facts.map((f) => (
              <div key={f.k} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex items-center gap-2 text-[10.5px] font-bold tracking-[.13em] text-muted">
                  <span className="text-gold">{f.icon}</span>{f.k}
                </div>
                <div className="mt-2 text-[15px] font-semibold leading-snug">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BODY + FORM */}
      <div className="mx-auto max-w-shell px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] lg:gap-14">
          <div>
            <Reveal>
              <h2 className="mb-3 text-[21px] font-semibold">{c.aboutRole}</h2>
              <p className="mb-10 text-[15px] leading-loose text-muted">{pick(job, 'body', locale)}</p>

              {blocks.map((b) => (
                <div key={b.title} className="mb-10">
                  <h2 className="mb-4 text-[21px] font-semibold">{b.title}</h2>
                  <ul className="grid gap-3">
                    {b.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                        <span className="mt-2 h-[7px] w-[7px] shrink-0 rounded-full bg-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-2xl bg-surface2 p-6">
                <h3 className="mb-2 text-[17px] font-semibold">{c.processTitle}</h3>
                <ol className="grid gap-3 text-[14px] leading-relaxed text-muted">
                  {c.process.map((step: string, i: number) => (
                    <li key={step} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-brand-on">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          {/* APPLICATION FORM */}
          <Reveal delay={120}>
            <div id="apply" className="rounded-2xl border border-line border-t-[3px] border-t-brand bg-surface p-6 shadow-card sm:p-7 lg:sticky lg:top-24">
              <h2 className="mb-1.5 text-[21px] font-bold">{c.applyTitle}</h2>
              <p className="mb-6 text-[13.5px] leading-relaxed text-muted">{c.applySub}</p>
              <ApplicationForm dict={dict} jobSlug={job.slug} />
            </div>
          </Reveal>
        </div>

        {/* OTHER ROLES */}
        {others.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="mb-6 text-[21px] font-semibold">{c.otherRoles}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
              {others.map((j) => (
                <Link
                  key={j.id}
                  href={'/' + locale + '/careers/' + j.slug}
                  className="rounded-2xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand hover:shadow-card"
                >
                  <h3 className="mb-2 text-[16.5px] font-semibold">{pick(j, 'title', locale)}</h3>
                  <p className="text-[13px] text-muted">{pick(j, 'meta', locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
