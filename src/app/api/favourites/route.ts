import { createClient } from '@/lib/supabase/server';
import { ok, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function me() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  try {
    const { supabase, user } = await me();
    if (!user) return ok([]);
    const { data, error } = await supabase
      .from('favourites')
      .select('property_id, properties(*)')
      .eq('user_id', user.id);
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

export async function POST(req: Request) {
  try {
    const { supabase, user } = await me();
    if (!user) return fail('Sign in required', 401);
    const { property_id } = await req.json();
    const { error } = await supabase.from('favourites').insert({ user_id: user.id, property_id });
    if (error && error.code !== '23505') throw error;
    return ok({ property_id, saved: true });
  } catch (e) { return handle(e); }
}

export async function DELETE(req: Request) {
  try {
    const { supabase, user } = await me();
    if (!user) return fail('Sign in required', 401);
    const { property_id } = await req.json();
    const { error } = await supabase.from('favourites').delete()
      .eq('user_id', user.id).eq('property_id', property_id);
    if (error) throw error;
    return ok({ property_id, saved: false });
  } catch (e) { return handle(e); }
}
