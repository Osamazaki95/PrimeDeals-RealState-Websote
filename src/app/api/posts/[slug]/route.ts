import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';
type Ctx = { params: { slug: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { data, error } = await createClient()
      .from('posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('slug', params.slug)
      .single();
    if (error || !data) return fail('Post not found', 404);
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const body = await req.json();
    const { data, error } = await createAdminClient()
      .from('posts').update(body).eq('slug', params.slug).select().single();
    if (error) throw error;
    return ok(data);
  } catch (e) { return handle(e); }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin', 'editor']);
    const { error } = await createAdminClient().from('posts').delete().eq('slug', params.slug);
    if (error) throw error;
    return ok({ deleted: params.slug });
  } catch (e) { return handle(e); }
}
