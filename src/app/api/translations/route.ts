import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

/** GET /api/translations — UI string overrides edited in the dashboard */
export async function GET() {
  try {
    const { data, error } = await createClient()
      .from('translations').select('*').order('namespace', { ascending: true });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

/** PUT /api/translations — upsert one string */
export async function PUT(req: Request) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('translations')
      .upsert(body, { onConflict: 'namespace,key' })
      .select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}
