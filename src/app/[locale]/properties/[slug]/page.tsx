import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Check } from 'lucide-react';
import { LeadForm } from '@/components/sections/LeadForm';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { PropertyGallery } from '@/components/sections/PropertyGallery';
import { Reveal } from '@/components/ui/Reveal';
import { avatar, propertyShots } from '@/lib/media';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProperties, getProperty, getTeam } from '@/lib/queries';
import { formatPrice, pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';

type Props = { params: { locale: Locale; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug);
  if (!property) return {};
  return {
    title: pick(property, 'title', params.locale),
    description: pick(property, 'description', params.locale) || undefined,
    openGraph: { images: property.images?.[0] ? [property.images[0]] : [] },
  };
}

/* PROPERTY DETAIL — gallery + 360 · specs · overview · rooms · payment plan
   · amenities · nearby · map · agent sidebar · similar listings */
export default async function PropertyDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const [dict, team, similar] = await Promise.all([
    getDictionary(locale),
    getTeam(),
    getProperties({ type: property.type, perPage: 4 }),
  ]);

  const ar = locale === 'ar';
  const title = pick(property, 'title', locale);
  const agent = team[0];
  const shots = propertyShots(property.slug, property.images);
  const amenities = (ar ? property.amenities_ar : property.amenities_en) ?? [];
  const areaUnit = ar ? ' قدم²' : ' sqft';

  const typeLabels: Record<string, string> = ar
    ? { apartment: 'شقة', villa: 'فيلا', townhouse: 'تاون هاوس', chalet: 'شاليه', office: 'مكتب' }
    : { apartment: 'Apartment', villa: 'Villa', townhouse: 'Townhouse', chalet: 'Chalet', office: 'Office' };

  const specs = [
    { k: dict.properties.area, v: property.area_sqft + areaUnit },
    { k: dict.properties.beds, v: String(property.bedrooms) },
    { k: dict.properties.baths, v: String(property.bathrooms) },
    { k: dict.properties.kind, v: typeLabels[property.type] },
    { k: dict.properties.finishing, v: pick(property, 'finishing', locale) || (ar ? 'سوبر لوكس' : 'Turnkey') },
    { k: dict.properties.delivery, v: pick(property, 'delivery', locale) || (ar ? 'فوري' : 'Ready') },
  ];

  const downPct = property.down_payment_pct ?? 10;
  const years = property.instalment_years ?? 7;
  const plan = [
    { k: dict.properties.downPayment, v: formatPrice(Math.round(property.price * (downPct / 100)), locale) },
    { k: dict.properties.monthly, v: formatPrice(Math.round((property.price * (1 - downPct / 100)) / (years * 12)), locale) },
    { k: dict.properties.term, v: years + ' ' + dict.properties.years },
    { k: dict.properties.maintenance, v: formatPrice(Math.round(property.price * 0.08), locale) },
  ];

  const rooms = (property.rooms ?? []).length
    ? property.rooms
    : (ar
        ? [
            { name_en: '', name_ar: 'الريسبشن', size: '42 م²', note_en: '', note_ar: 'مزدوج الارتفاع' },
            { name_en: '', name_ar: 'غرفة رئيسية', size: '28 م²', note_en: '', note_ar: 'حمام خاص + دريسنج' },
            { name_en: '', name_ar: 'المطبخ', size: '16 م²', note_en: '', note_ar: 'مجهز بالكامل' },
          ]
        : [
            { name_en: 'Reception', name_ar: '', size: '42 m²', note_en: 'Double height', note_ar: '' },
            { name_en: 'Master bedroom', name_ar: '', size: '28 m²', note_en: 'En-suite + dressing', note_ar: '' },
            { name_en: 'Kitchen', name_ar: '', size: '16 m²', note_en: 'Fully fitted', note_ar: '' },
          ]);

  const nearby = (property.nearby ?? []).length
    ? property.nearby
    : (ar
        ? [
            { name_en: '', name_ar: 'مدارس دولية', time_en: '', time_ar: '٦ دقائق' },
            { name_en: '', name_ar: 'كايرو فستيفال سيتي', time_en: '', time_ar: '١٢ دقيقة' },
            { name_en: '', name_ar: 'مطار القاهرة', time_en: '', time_ar: '٢٥ دقيقة' },
          ]
        : [
            { name_en: 'International schools', name_ar: '', time_en: '6 min', time_ar: '' },
            { name_en: 'Cairo Festival City', name_ar: '', time_en: '12 min', time_ar: '' },
            { name_en: 'Cairo airport', name_ar: '', time_en: '25 min', time_ar: '' },
          ]);

  const docs = ar
    ? ['عقد ملكية مراجَع', 'شهادة توافق مع الترخيص', 'كشف مديونية حديث', 'معاينة ميدانية موثّقة']
    : ['Verified title deed', 'Licence compliance certificate', 'Recent debt statement', 'Documented site inspection'];

  return (
    <div className="mx-auto max-w-shell px-5 pb-20 pt-8 sm:px-6 sm:pb-24">
      <Link
        href={'/' + locale + '/properties'}
        className="mb-5 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[13px] font-semibold text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
      >
        <ArrowLeft size={14} className={ar ? 'rotate-180' : ''} />{dict.properties.backToList}
      </Link>

      <PropertyGallery shots={shots} tour={property.tour_360_url} title={title} dict={dict} />

      <div className="grid gap-9 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,.9fr)]">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3.5">
              <h1 className="text-[clamp(22px,3.4vw,36px)] font-bold">{title}</h1>
              <div className="text-[22px] font-bold text-brand sm:text-[26px]">
                {formatPrice(property.price, locale, property.per_month)}
              </div>
            </div>
            <p className="mt-2.5 font-mono text-[11.5px] tracking-[.16em] text-gold">
              {property.listing.toUpperCase()} · {pick(property, 'location', locale)}
              {property.reference_code ? ' · ' + property.reference_code : ''}
            </p>

            {/* SPECS */}
            <div className="my-7 grid grid-cols-[repeat(auto-fit,minmax(118px,1fr))] gap-3.5">
              {specs.map((s) => (
                <div key={s.k} className="rounded-[14px] bg-surface2 p-4">
                  <div className="text-[10.5px] font-bold tracking-[.14em] text-muted">{s.k}</div>
                  <div className="mt-1.5 text-[16px] font-semibold sm:text-[17px]">{s.v}</div>
                </div>
              ))}
            </div>

            {/* OVERVIEW */}
            <h2 className="mb-3 text-[19px] font-semibold sm:text-[21px]">{dict.properties.overview}</h2>
            <p className="leading-loose text-muted">{pick(property, 'description', locale)}</p>

            {/* ROOMS */}
            <h2 className="mb-3.5 mt-8 text-[19px] font-semibold sm:text-[21px]">{dict.properties.rooms}</h2>
            <div className="overflow-hidden rounded-2xl border border-line">
              {rooms.map((r, i) => (
                <div
                  key={i}
                  className={'grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3.5 text-[13px] last:border-0 sm:px-[18px] sm:text-[13.5px] ' + (i % 2 ? 'bg-surface2' : '')}
                >
                  <span className="font-semibold">{ar ? r.name_ar || r.name_en : r.name_en || r.name_ar}</span>
                  <span className="text-muted">{r.size}</span>
                  <span className="text-muted">{ar ? r.note_ar || r.note_en : r.note_en || r.note_ar}</span>
                </div>
              ))}
            </div>

            {/* PAYMENT PLAN */}
            <h2 className="mb-3.5 mt-8 text-[19px] font-semibold sm:text-[21px]">{dict.properties.plan}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
              {plan.map((p) => (
                <div key={p.k} className="rounded-[14px] border border-line border-t-[3px] border-t-gold p-[18px]">
                  <div className="text-[10.5px] font-bold tracking-[.14em] text-muted">{p.k}</div>
                  <div className="mt-2 text-[17px] font-bold text-brand sm:text-[18px]">{p.v}</div>
                </div>
              ))}
            </div>

            {/* AMENITIES */}
            {amenities.length > 0 && (
              <>
                <h2 className="mb-3.5 mt-8 text-[19px] font-semibold sm:text-[21px]">{dict.properties.amenities}</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 rounded-xl bg-surface2 px-4 py-3 text-[13.5px]">
                      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-gold" />{a}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* NEARBY */}
            <h2 className="mb-3.5 mt-8 text-[19px] font-semibold sm:text-[21px]">{dict.properties.nearby}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
              {nearby.map((n, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 text-[13.5px]">
                  <span>{ar ? n.name_ar || n.name_en : n.name_en || n.name_ar}</span>
                  <span className="font-bold text-brand">{ar ? n.time_ar || n.time_en : n.time_en || n.time_ar}</span>
                </div>
              ))}
            </div>

            {/* LOCATION */}
            <h2 className="mb-3.5 mt-8 text-[19px] font-semibold sm:text-[21px]">{dict.properties.location}</h2>
            <div className="relative h-[240px] overflow-hidden rounded-2xl border border-line bg-surface2 sm:h-[300px]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(16,80,79,.1) 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, rgba(16,80,79,.1) 0 1px, transparent 1px 34px)',
                }}
              />
              <div className="absolute start-[46%] top-[48%] h-4 w-4 animate-pulseRing rounded-full bg-brand" style={{ boxShadow: '0 0 0 8px rgba(16,80,79,.22)' }} />
              <span className="absolute bottom-3.5 start-4 rounded-full bg-surface/80 px-3.5 py-2 font-mono text-[10.5px] text-ink backdrop-blur-xl">
                {property.lat && property.lng ? property.lat.toFixed(4) + ', ' + property.lng.toFixed(4) : 'map embed'}
              </span>
            </div>
          </Reveal>
        </div>

        {/* SIDEBAR */}
        <Reveal delay={120}>
          <aside className="grid gap-3.5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[18px] border border-line border-t-[3px] border-t-brand bg-surface p-6 shadow-card">
              <div className="flex items-center gap-3.5">
                <Image
                  src={avatar(agent?.id ?? 'agent', agent?.photo)}
                  alt={agent ? pick(agent, 'name', locale) : 'Prime Deals'}
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] rounded-full object-cover"
                />
                <div>
                  <div className="text-base font-semibold">{agent ? pick(agent, 'name', locale) : 'Prime Deals'}</div>
                  <div className="mt-1 inline-block rounded-full bg-cream px-2.5 py-0.5 text-[10.5px] font-bold tracking-wider text-gold">
                    {agent ? pick(agent, 'role', locale) : dict.common.salesManager}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <LeadForm dict={dict} source="property" propertyId={property.id} layout="boxed" />
              </div>
              <Link
                href={'/' + locale + '/mortgage?price=' + property.price}
                className="mt-2.5 grid h-11 place-items-center rounded-full border-[1.5px] border-brand font-semibold text-brand transition-colors duration-300 hover:bg-brand hover:text-brand-on"
              >
                {dict.nav.mortgage}
              </Link>
            </div>

            <div className="rounded-[18px] bg-cream p-[22px]">
              <div className="mb-3 font-mono text-[10px] tracking-[.2em] text-gold">{dict.properties.docs}</div>
              {docs.map((d) => (
                <div key={d} className="flex items-center gap-2.5 py-[7px] text-[13px]">
                  <Check size={14} className="shrink-0 text-brand" />{d}
                </div>
              ))}
            </div>
          </aside>
        </Reveal>
      </div>

      {/* SIMILAR */}
      {similar.items.filter((p) => p.slug !== slug).length > 0 && (
        <div className="mt-16 sm:mt-20">
          <h2 className="mb-6 text-[19px] font-semibold sm:text-[21px]">{dict.properties.similar}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {similar.items.filter((p) => p.slug !== slug).slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <PropertyCard property={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
