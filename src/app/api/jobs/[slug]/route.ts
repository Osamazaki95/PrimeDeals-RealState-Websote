import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { slug: string } };

/** GET /api/jobs/[slug] — the full posting behind the Apply button */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { data, error } = await createClient()
      .from('jobs').select('*').eq('slug', params.slug).maybeSingle();
    if (error || !data) return fail('Job not found', 404);
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('jobs').update(body).eq('slug', params.slug).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const { error } = await createAdminClient().from('jobs').delete().eq('slug', params.slug);
    if (error) throw error;
    return ok({ deleted: params.slug });
  } catch (e) { return handle(e); }
}
