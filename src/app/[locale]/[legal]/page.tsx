import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

const PAGES = ['privacy', 'terms'] as const;

/** Privacy / Terms — footer links resolve here so no link is ever dead. */
export default async function LegalPage({ params }: { params: { locale: Locale; legal: string } }) {
  if (!PAGES.includes(params.legal as never)) notFound();
  const dict = await getDictionary(params.locale);
  const title = params.legal === 'privacy' ? dict.footer.privacy : dict.footer.terms;

  return (
    <Section className="py-20">
      <div className="mx-auto max-w-[760px]">
        <h1 className="mb-6 text-[clamp(26px,3.4vw,40px)] font-bold">{title}</h1>
        <p className="mb-5 leading-loose text-muted">{dict.footer.consent}</p>
        <p className="leading-loose text-muted">
          {params.locale === 'ar'
            ? 'النص القانوني الكامل يُحرَّر من الداشبورد ضمن محتوى الصفحات (page_sections) — اكتب البنود هناك وستظهر هنا مباشرة.'
            : 'The full legal copy is edited from the dashboard under Page content (page_sections) — write your clauses there and they render here.'}
        </p>
      </div>
    </Section>
  );
}
