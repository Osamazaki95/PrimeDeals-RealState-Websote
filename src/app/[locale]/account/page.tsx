import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PropertyCard } from '@/components/sections/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { createClient } from '@/lib/supabase/server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import type { Property } from '@/types/db';

export const metadata = { title: 'My account' };
export const dynamic = 'force-dynamic';

/* ACCOUNT — saved properties and a quick summary. Requires a session. */
export default async function AccountPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/' + locale + '/auth');

  const [dict, favs, leads, profile] = await Promise.all([
    getDictionary(locale),
    supabase.from('favourites').select('properties(*)').eq('user_id', user.id),
    supabase.from('leads').select('id').eq('email', user.email ?? ''),
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
  ]);

  const saved = ((favs.data ?? []).map((f) => f.properties).filter(Boolean) as unknown) as Property[];
  const initials = (profile.data?.full_name || user.email || 'PD').slice(0, 2).toUpperCase();

  const stats = [
    { k: dict.account.statSaved, v: saved.length },
    { k: dict.account.statEnquiries, v: leads.data?.length ?? 0 },
    { k: dict.account.statViewings, v: 0 },
  ];

  return (
    <div className="mx-auto max-w-shell px-5 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
      <div className="mb-9 flex animate-rise flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-[19px] font-bold text-brand-on">{initials}</div>
          <div>
            <h1 className="text-2xl font-bold">{profile.data?.full_name || user.email}</h1>
            <p className="mt-1 text-[13.5px] text-muted">{user.email}</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <button className="h-[42px] rounded-[9px] border border-line bg-surface px-5 font-semibold transition-colors duration-300 hover:border-brand hover:text-brand">
            {dict.common.signOut}
          </button>
        </form>
      </div>

      <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 90}>
            <div className="rounded-[13px] border border-line bg-surface p-[22px]">
              <div className="text-[11px] font-bold tracking-[.14em] text-muted">{s.k}</div>
              <div className="mt-2.5 text-[28px] font-bold text-brand">{s.v}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <h2 className="mb-5 text-[21px] font-bold">{dict.account.saved}</h2>
      {saved.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {saved.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <PropertyCard property={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line py-14 text-center text-muted">
          <p className="mb-5">{dict.account.none}</p>
          <Button href={'/' + locale + '/properties'} variant="outline" size="sm">{dict.common.browse}</Button>
        </div>
      )}

      <p className="mt-12 text-[13px] text-muted">
        <Link href={'/' + locale + '/properties'} className="font-semibold">{dict.common.browse}</Link>
      </p>
    </div>
  );
}
