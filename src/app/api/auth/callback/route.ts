import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** OAuth / magic-link callback. Redirects back into the site with a session cookie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/';
  if (code) {
    await createClient().auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
