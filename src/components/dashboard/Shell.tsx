'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2, FileText, Globe, Home, Inbox, Languages, LayoutDashboard,
  Search, Settings, Users, Briefcase, HelpCircle, UserSquare2, Star, FileCheck2,
} from 'lucide-react';
import { ThemeToggle } from '../layout/ThemeToggle';

const GROUPS = [
  {
    title: 'Content',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/properties', label: 'Properties', icon: Building2 },
      { href: '/dashboard/projects', label: 'Projects', icon: Home },
      { href: '/dashboard/posts', label: 'Blog posts', icon: FileText },
      { href: '/dashboard/content', label: 'Page content', icon: Settings },
      { href: '/dashboard/reviews', label: 'Client reviews', icon: Star },
    ],
  },
  {
    title: 'Site data',
    items: [
      { href: '/dashboard/team', label: 'Team', icon: UserSquare2 },
      { href: '/dashboard/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/dashboard/leads', label: 'Leads', icon: Inbox },
      { href: '/dashboard/applications', label: 'Applications', icon: FileCheck2 },
      { href: '/dashboard/users', label: 'Users & roles', icon: Users },
      { href: '/dashboard/seo', label: 'SEO', icon: Search },
      { href: '/dashboard/translations', label: 'Translations', icon: Languages },
    ],
  },
];

export function Shell({ children, user }: { children: React.ReactNode; user: { email?: string | null; role: string } }) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="border-e border-line bg-surface">
        <div className="sticky top-0 flex h-full flex-col p-5">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center bg-brand text-[13px] font-bold text-brand-on" style={{ borderRadius: '50% 50% 50% 8px' }}>PD</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-[.08em] text-brand">PRIME DEALS</span>
              <span className="text-[9px] font-medium tracking-[.2em] text-gold">DASHBOARD</span>
            </span>
          </Link>

          <nav className="grid gap-6">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <p className="mb-2 px-2 font-mono text-[9.5px] uppercase tracking-[.2em] text-muted">{g.title}</p>
                <div className="grid gap-0.5">
                  {g.items.map((i) => {
                    const active = pathname === i.href;
                    const Icon = i.icon;
                    return (
                      <Link
                        key={i.href}
                        href={i.href}
                        className={
                          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors duration-200 ' +
                          (active ? 'bg-cream font-semibold text-brand' : 'text-ink hover:bg-surface2')
                        }
                      >
                        <Icon size={15} className={active ? 'text-brand' : 'text-muted'} />
                        {i.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto grid gap-3 pt-8">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-surface2 p-3">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold">{user.email}</p>
                <p className="font-mono text-[9.5px] uppercase tracking-[.16em] text-gold">{user.role}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="grid gap-1.5">
              <Link href="/" className="flex items-center gap-2 px-1 text-[12.5px] text-muted hover:text-brand">
                <Globe size={13} /> View site
              </Link>
              <form action="/api/auth/signout" method="post">
                <button className="px-1 text-[12.5px] text-muted hover:text-brand">Sign out</button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 bg-bg p-6 lg:p-10">{children}</main>
    </div>
  );
}
