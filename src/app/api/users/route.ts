import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

/** GET /api/users — dashboard "Users & roles" */
export async function GET() {
  try {
    await requireRole(['admin']);
    const { data, error } = await createAdminClient()
      .from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

/** PATCH /api/users — change a role */
export async function PATCH(req: Request) {
  try {
    await requireRole(['admin']);
    const { id, role } = await req.json();
    const { data, error } = await createAdminClient()
      .from('profiles').update({ role }).eq('id', id).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}
