import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { page: string } };

/**
 * GET  /api/pages/home        -> every editable block of the home page
 * PUT  /api/pages/home        -> { key, content_en, content_ar } (staff)
 */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { data, error } = await createClient()
      .from('page_sections')
      .select('*')
      .eq('page', params.page)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('page_sections')
      .upsert(
        {
          page: params.page,
          key: body.key,
          content_en: body.content_en ?? {},
          content_ar: body.content_ar ?? {},
          sort_order: body.sort_order ?? 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page,key' }
      )
      .select()
      .single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}
