import { redirect } from 'next/navigation';
import { Shell } from '@/components/dashboard/Shell';
import { getSessionUser } from '@/lib/supabase/guard';

export const metadata = { title: 'Dashboard — Prime Deals' };
export const dynamic = 'force-dynamic';

/** Staff-only. Anyone else is bounced to the sign-in page. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/en/auth');
  if (!['admin', 'editor', 'agent'].includes(user.role)) redirect('/en');

  return <Shell user={{ email: user.email, role: user.role }}>{children}</Shell>;
}
