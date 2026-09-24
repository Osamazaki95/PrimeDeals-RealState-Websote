import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { LeadForm } from '@/components/sections/LeadForm';
import { Reveal } from '@/components/ui/Reveal';
import Image from 'next/image';
import { MEDIA } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getOffices, getPageSections, getSeo } from '@/lib/queries';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('contact');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

/* CONTACT — form + photo, then the offices map. */
export default async function ContactPage({ params }: Props) {
  const { locale } = params;
  const [dict, sections, offices] = await Promise.all([
    getDictionary(locale), getPageSections('contact'), getOffices(),
  ]);
  const intro = (sections.intro?.['content_' + locale] ?? {}) as { title?: string; sub?: string };

  return (
    <div className="mx-auto max-w-shell px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-[70px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-14">
        <div className="animate-rise">
          <h1 className="mb-2.5 text-[clamp(26px,3.4vw,40px)] font-bold">{intro.title || dict.contact.title}</h1>
          <p className="mb-9 leading-relaxed text-muted">{intro.sub || dict.contact.sub}</p>

          <LeadForm dict={dict} source="contact" />

          <div className="mt-11 grid gap-3.5">
            {[
              { icon: <Mail size={14} />, value: 'hello@primedeals.com' },
              { icon: <Phone size={14} />, value: '(+20) 111 955 5867' },
              {
                icon: <MapPin size={14} />,
                value: offices[0] ? pick(offices[0] as never, 'address', locale) : '90 North St, Fifth Settlement, Cairo',
              },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3.5 text-[14.5px]">
                <span className="grid h-[34px] w-[34px] flex-shrink-0 place-items-center rounded-[9px] bg-cream text-gold">{c.icon}</span>
                <span className="text-muted">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[300px] animate-rise overflow-hidden rounded-[18px] border border-line [animation-delay:.14s] sm:h-[420px] lg:h-[560px]">
          <Image src={MEDIA.contact} alt={dict.contact.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>

      {/* ── LOCATIONS ────────────────────────────────────────── */}
      <Reveal>
        <div className="mt-20">
          <div className="mb-7 text-center">
            <h2 className="mb-2 text-[clamp(23px,2.8vw,32px)] font-bold">{dict.contact.locationsTitle}</h2>
            <p className="text-muted">{dict.contact.locationsSub}</p>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-line bg-surface2">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(16,80,79,.1) 0 1px, transparent 1px 38px), repeating-linear-gradient(0deg, rgba(16,80,79,.1) 0 1px, transparent 1px 38px)',
              }}
            />
            <div className="absolute start-[38%] top-[44%] h-4 w-4 animate-pulseRing rounded-full bg-brand" style={{ boxShadow: '0 0 0 9px rgba(16,80,79,.2)' }} />
            <div className="absolute start-[64%] top-[62%] h-3.5 w-3.5 animate-pulseRing rounded-full bg-gold [animation-delay:.8s]" style={{ boxShadow: '0 0 0 8px rgba(184,134,59,.2)' }} />
            <span className="absolute bottom-4 start-5 font-mono text-[10.5px] text-muted">google maps embed</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
