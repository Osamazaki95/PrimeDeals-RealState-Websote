import { createClient } from './supabase/server';
import type { Faq, Job, Post, Project, Property, TeamMember, PageSection, SeoMeta, Review } from '@/types/db';

/**
 * Server-side data access. Pages call these; the /api routes exist for the
 * dashboard, client components and any external consumer.
 */

export async function getPageSections(page: string) {
  const { data } = await createClient()
    .from('page_sections').select('*').eq('page', page).order('sort_order');
  const map: Record<string, PageSection> = {};
  (data ?? []).forEach((s) => { map[s.key] = s as PageSection; });
  return map;
}

export async function getSeo(page: string) {
  const { data } = await createClient().from('seo_meta').select('*').eq('page', page).maybeSingle();
  return (data ?? null) as SeoMeta | null;
}

export async function getProperties(opts: {
  location?: string; type?: string; beds?: string; maxPrice?: string;
  sort?: string; featured?: boolean; page?: number; perPage?: number;
} = {}) {
  const perPage = opts.perPage ?? 9;
  const page = opts.page ?? 1;
  const from = (page - 1) * perPage;

  let q = createClient().from('properties').select('*', { count: 'exact' }).eq('published', true);
  if (opts.location) q = q.or('location_en.ilike.%' + opts.location + '%,location_ar.ilike.%' + opts.location + '%');
  if (opts.type && opts.type !== 'any') q = q.eq('type', opts.type);
  if (opts.beds && opts.beds !== 'any') q = q.gte('bedrooms', Number(opts.beds));
  if (opts.maxPrice) q = q.lte('price', Number(opts.maxPrice));
  if (opts.featured) q = q.eq('featured', true);

  if (opts.sort === 'low') q = q.order('price', { ascending: true });
  else if (opts.sort === 'high') q = q.order('price', { ascending: false });
  else q = q.order('created_at', { ascending: false });

  const { data, count } = await q.range(from, from + perPage - 1);
  return { items: (data ?? []) as Property[], total: count ?? 0, page, perPage };
}

export async function getAllPropertiesForMap() {
  const { data } = await createClient()
    .from('properties').select('*').eq('published', true).limit(200);
  return (data ?? []) as Property[];
}

export async function getProperty(slug: string) {
  const { data } = await createClient().from('properties').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as Property | null;
}

export async function getProjects() {
  const { data } = await createClient()
    .from('projects').select('*').eq('published', true).order('created_at', { ascending: false });
  return (data ?? []) as Project[];
}

export async function getProject(slug: string) {
  const { data } = await createClient().from('projects').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as Project | null;
}

export async function getPosts(limit?: number) {
  let q = createClient().from('posts').select('*').eq('published', true).order('published_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as Post[];
}

export async function getPost(slug: string) {
  const { data } = await createClient().from('posts').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as Post | null;
}

export async function getTeam() {
  const { data } = await createClient().from('team_members').select('*').order('sort_order');
  return (data ?? []) as TeamMember[];
}

export async function getFaqs() {
  const { data } = await createClient().from('faqs').select('*').order('sort_order');
  return (data ?? []) as Faq[];
}

export async function getReviews(limit?: number) {
  let query = createClient().from('reviews').select('*').order('sort_order');
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as Review[];
}

export async function getJob(slug: string) {
  const { data } = await createClient().from('jobs').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as Job | null;
}

export async function getJobs() {
  const { data } = await createClient().from('jobs').select('*').eq('published', true);
  return (data ?? []) as Job[];
}

export async function getOffices() {
  const { data } = await createClient().from('offices').select('*');
  return data ?? [];
}

/** Listing counts per type — feeds "Find a property by category". */
export async function getCategoryCounts() {
  const types = ['apartment', 'villa', 'townhouse', 'chalet', 'office'] as const;
  const supabase = createClient();
  const entries = await Promise.all(
    types.map(async (t) => {
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)
        .eq('type', t);
      return [t, count ?? 0] as const;
    })
  );
  const { count: total } = await supabase
    .from('properties').select('*', { count: 'exact', head: true }).eq('published', true);
  return { byType: Object.fromEntries(entries) as Record<string, number>, total: total ?? 0 };
}
