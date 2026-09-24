import { createClient } from './server';

export type Role = 'admin' | 'editor' | 'agent' | 'user';

/** Returns the signed-in user + their role, or null. */
export async function getSessionUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single();
  return { id: user.id, email: user.email, role: (profile?.role ?? 'user') as Role, name: profile?.full_name ?? null, avatar: profile?.avatar_url ?? null };
}

/** Throws a 403-shaped error unless the user holds one of the allowed roles. */
export async function requireRole(roles: Role[]) {
  const user = await getSessionUser();
  if (!user || !roles.includes(user.role)) {
    const err = new Error('Forbidden') as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  return user;
}
