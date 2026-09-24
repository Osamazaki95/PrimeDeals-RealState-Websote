import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { id: string } };

/** PATCH — move an application through the hiring stages. */
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('applications').update(body).eq('id', params.id).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}

/** GET — returns a 5-minute signed link to the candidate's CV. */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const admin = createAdminClient();
    const { data: row } = await admin.from('applications').select('cv_url').eq('id', params.id).maybeSingle();
    if (!row?.cv_url) return ok({ url: null });
    const { data } = await admin.storage.from('cvs').createSignedUrl(row.cv_url, 300);
    return ok({ url: data?.signedUrl ?? null });
  } catch (e) { return handle(e); }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin']);
    const { error } = await createAdminClient().from('applications').delete().eq('id', params.id);
    if (error) throw error;
    return ok({ deleted: params.id });
  } catch (e) { return handle(e); }
}
