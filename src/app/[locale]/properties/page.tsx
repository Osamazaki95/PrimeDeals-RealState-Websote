import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { SearchBar } from '@/components/sections/SearchBar';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { Pagination } from '@/components/sections/Pagination';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { MEDIA } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProperties, getSeo } from '@/lib/queries';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Search = {
  location?: string; type?: string; beds?: string; maxPrice?: string;
  sort?: string; page?: string; instalments?: string; delivery?: string;
};
type Props = { params: { locale: Locale }; searchParams: Search };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSeo('properties');
  if (!seo) return {};
  return { title: pick(seo, 'title', params.locale), description: pick(seo, 'description', params.locale) };
}

const PER_PAGE = 6;

/* PROPERTIES — hero, the same glass search panel as home, then paged results. */
export default async function PropertiesPage({ params, searchParams }: Props) {
  const { locale } = params;
  const page = Math.max(1, Number(searchParams.page || 1));
  const [dict, result] = await Promise.all([
    getDictionary(locale),
    getProperties({ ...searchParams, page, perPage: PER_PAGE }),
  ]);
  const pageCount = Math.max(1, Math.ceil(result.total / PER_PAGE));

  return (
    <>
      <Hero
        height="short"
        title={dict.properties.title}
        sub={dict.properties.sub}
        image={MEDIA.heroProperties}
        bottomPad="search"
      />

      <div className="relative z-[6] mx-auto w-full max-w-[1180px] px-5 sm:px-6">
        <SearchBar locale={locale} dict={dict} />
      </div>

      <Section className="pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">{result.total} {dict.filters.results}</p>
          <p className="text-sm text-muted">
            {locale === 'ar' ? 'صفحة ' + page + ' من ' + pageCount : 'Page ' + page + ' of ' + pageCount}
          </p>
        </div>

        {result.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line py-16 text-center text-muted">
            <p className="mb-5">{dict.filters.none}</p>
            <Button href={'/' + locale + '/properties'} variant="outline" size="sm">{dict.common.reset}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {result.items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 110}>
                <PropertyCard property={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          locale={locale}
          basePath={'/' + locale + '/properties'}
          params={searchParams as Record<string, string | undefined>}
        />
      </Section>
    </>
  );
}
