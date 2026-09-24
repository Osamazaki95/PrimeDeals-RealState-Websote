import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, created, handle, searchParams } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/properties
 * Query: location, type, beds, maxPrice, listing, featured, sort, page, perPage
 */
export async function GET(req: Request) {
  try {
    const p = searchParams(req);
    const page = Math.max(1, Number(p.get('page') || 1));
    const perPage = Math.min(48, Number(p.get('perPage') || 9));
    const from = (page - 1) * perPage;

    const supabase = createClient();
    let q = supabase.from('properties').select('*', { count: 'exact' }).eq('published', true);

    const location = p.get('location');
    if (location) q = q.or('location_en.ilike.%' + location + '%,location_ar.ilike.%' + location + '%');
    if (p.get('type') && p.get('type') !== 'any') q = q.eq('type', p.get('type'));
    if (p.get('listing')) q = q.eq('listing', p.get('listing'));
    if (p.get('beds') && p.get('beds') !== 'any') q = q.gte('bedrooms', Number(p.get('beds')));
    if (p.get('maxPrice')) q = q.lte('price', Number(p.get('maxPrice')));
    if (p.get('featured') === 'true') q = q.eq('featured', true);

    const sort = p.get('sort') || 'new';
    if (sort === 'low') q = q.order('price', { ascending: true });
    else if (sort === 'high') q = q.order('price', { ascending: false });
    else q = q.order('created_at', { ascending: false });

    const { data, count, error } = await q.range(from, from + perPage - 1);
    if (error) throw error;

    return ok({ items: data ?? [], total: count ?? 0, page, perPage });
  } catch (e) { return handle(e); }
}

/** POST /api/properties — staff only */
export async function POST(req: Request) {
  try {
    await requireRole(['admin', 'editor', 'agent']);
    const body = await req.json();
    const { data, error } = await createAdminClient().from('properties').insert(body).select().single();
    if (error) throw error;
    return created(data);
  } catch (e) { return handle(e); }
}
