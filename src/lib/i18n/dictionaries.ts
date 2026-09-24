import type { Locale } from './config';

const loaders = {
  en: () => import('./en.json').then((m) => m.default),
  ar: () => import('./ar.json').then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<typeof loaders.en>>;

/** Server-side dictionary loader. Used by every page via params.locale. */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
