import { MapExplorer } from '@/components/sections/MapExplorer';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getAllPropertiesForMap } from '@/lib/queries';
import type { Locale } from '@/lib/i18n/config';

export const metadata = { title: 'Map search' };

/* MAP SEARCH — list on one side, pins on the other. */
export default async function MapPage({ params }: { params: { locale: Locale } }) {
  const [dict, properties] = await Promise.all([getDictionary(params.locale), getAllPropertiesForMap()]);
  return <MapExplorer properties={properties} locale={params.locale} dict={dict} />;
}
