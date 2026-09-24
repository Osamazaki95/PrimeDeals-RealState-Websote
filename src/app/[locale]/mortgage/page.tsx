import { MortgageCalculator } from '@/components/sections/MortgageCalculator';
import { Section } from '@/components/ui/Section';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

export const metadata = { title: 'Mortgage calculator' };

/* MORTGAGE CALCULATOR — ?price=… pre-fills from a property page. */
export default async function MortgagePage({
  params, searchParams,
}: { params: { locale: Locale }; searchParams: { price?: string } }) {
  const dict = await getDictionary(params.locale);
  const initial = Number(searchParams.price) || 5000000;

  return (
    <>
      <Section tone="cream" className="py-[60px] text-center">
        <h1 className="mb-3 animate-rise text-[clamp(26px,3.4vw,40px)] font-bold">{dict.mortgage.title}</h1>
        <p className="mx-auto max-w-[560px] animate-rise leading-relaxed text-muted [animation-delay:.1s]">{dict.mortgage.sub}</p>
      </Section>
      <section className="mx-auto max-w-[1100px] px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-14">
        <MortgageCalculator locale={params.locale} dict={dict} initialPrice={initial} />
      </section>
    </>
  );
}
