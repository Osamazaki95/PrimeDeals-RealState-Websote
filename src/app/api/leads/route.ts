import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, created, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

/** GET /api/leads — staff only */
export async function GET() {
  try {
    await requireRole(['admin', 'editor', 'agent']);
    const { data, error } = await createAdminClient()
      .from('leads')
      .select('*, property:properties(slug, title_en, title_ar)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

/** POST /api/leads — public. Used by every contact / enquiry form. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.email) return fail('Name and email are required', 422);
    const { data, error } = await createClient().from('leads').insert({
      name: String(body.name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      phone: body.phone ? String(body.phone).slice(0, 40) : null,
      message: body.message ? String(body.message).slice(0, 4000) : null,
      property_id: body.property_id ?? null,
      source: body.source ?? 'contact',
    }).select().single();
    if (error) throw error;
    return created(data);
  } catch (e) { return handle(e); }
}
