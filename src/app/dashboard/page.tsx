import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

async function counts() {
  const admin = createAdminClient();
  const tables = ['properties', 'projects', 'posts', 'leads', 'applications', 'reviews'] as const;
  const entries = await Promise.all(
    tables.map(async (t) => {
      const { count } = await admin.from(t).select('*', { count: 'exact', head: true });
      return [t, count ?? 0] as const;
    })
  );
  return Object.fromEntries(entries) as Record<(typeof tables)[number], number>;
}

/* OVERVIEW — the numbers the team asks for, plus quick jumps. */
export default async function DashboardHome() {
  const c = await counts();

  const cards = [
    { label: 'Properties', value: c.properties, href: '/dashboard/properties' },
    { label: 'Projects', value: c.projects, href: '/dashboard/projects' },
    { label: 'Blog posts', value: c.posts, href: '/dashboard/posts' },
    { label: 'Leads', value: c.leads, href: '/dashboard/leads' },
    { label: 'Applications', value: c.applications, href: '/dashboard/applications' },
    { label: 'Reviews', value: c.reviews, href: '/dashboard/reviews' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[26px] font-bold">Overview</h1>
        <p className="mt-1.5 text-sm text-muted">Everything on the public site is edited from here.</p>
      </header>

      <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-card">
            <div className="text-[11px] font-bold tracking-[.14em] text-muted">{card.label.toUpperCase()}</div>
            <div className="mt-2.5 text-[32px] font-bold text-brand">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { t: 'Add a property', d: 'Photos, price, bedrooms, amenities — in Arabic and English.', href: '/dashboard/properties' },
          { t: 'Edit page copy', d: 'Hero text, stats, value cards, contact intro.', href: '/dashboard/content' },
          { t: 'Answer leads', d: 'Move enquiries through new → contacted → won.', href: '/dashboard/leads' },
        ].map((q) => (
          <Link key={q.t} href={q.href} className="rounded-xl bg-cream p-6 transition-transform duration-300 hover:-translate-y-1">
            <h2 className="mb-2 text-[17px] font-semibold">{q.t}</h2>
            <p className="text-[13.5px] leading-relaxed text-muted">{q.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
