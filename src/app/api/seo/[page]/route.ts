import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { page: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { data } = await createClient().from('seo_meta').select('*').eq('page', params.page).maybeSingle();
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('seo_meta')
      .upsert({ ...body, page: params.page }, { onConflict: 'page' })
      .select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}
