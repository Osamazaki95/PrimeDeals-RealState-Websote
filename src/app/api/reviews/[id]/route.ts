import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('reviews').update(body).eq('id', params.id).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const { error } = await createAdminClient().from('reviews').delete().eq('id', params.id);
    if (error) throw error;
    return ok({ deleted: params.id });
  } catch (e) { return handle(e); }
}
