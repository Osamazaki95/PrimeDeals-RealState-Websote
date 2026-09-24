import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getPosts, getProjects, getAllPropertiesForMap } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticPaths = ['', '/properties', '/projects', '/about', '/contact', '/blog', '/map', '/mortgage', '/careers'];

  const [properties, projects, posts] = await Promise.all([
    getAllPropertiesForMap().catch(() => []),
    getProjects().catch(() => []),
    getPosts().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    staticPaths.forEach((p) => entries.push({ url: base + '/' + locale + p, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
    properties.forEach((p) => entries.push({ url: base + '/' + locale + '/properties/' + p.slug, priority: 0.8 }));
    projects.forEach((p) => entries.push({ url: base + '/' + locale + '/projects/' + p.slug, priority: 0.6 }));
    posts.forEach((p) => entries.push({ url: base + '/' + locale + '/blog/' + p.slug, priority: 0.5 }));
  }
  return entries;
}
