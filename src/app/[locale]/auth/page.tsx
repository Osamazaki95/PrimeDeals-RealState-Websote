import { AuthPanel } from '@/components/sections/AuthPanel';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

export const metadata = { title: 'Sign in' };

export default async function AuthPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return <AuthPanel locale={params.locale} dict={dict} />;
}
