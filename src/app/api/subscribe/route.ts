import { createClient } from '@/lib/supabase/server';
import { created, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

/** POST /api/subscribe — newsletter footer + blog band */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/.+@.+\..+/.test(email)) return fail('Valid email required', 422);
    const { error } = await createClient().from('subscribers').insert({ email });
    if (error && error.code !== '23505') throw error; // ignore duplicates
    return created({ email });
  } catch (e) { return handle(e); }
}
