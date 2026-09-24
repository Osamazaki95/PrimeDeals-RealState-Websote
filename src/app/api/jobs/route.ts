import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, created, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await createClient()
      .from('jobs')
      .select('*')
      .order('title_en', { ascending: true });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

export async function POST(req: Request) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient().from('jobs').insert(body).select().single();
    if (error) throw error;
    return created(data);
  } catch (e) { return handle(e); }
}
