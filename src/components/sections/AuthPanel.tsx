'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MEDIA } from '@/lib/media';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type Mode = 'signin' | 'signup' | 'reset';
type Notice = { kind: 'error' | 'success'; text: string } | null;

/**
 * Supabase auth: email/password, Google OAuth and password reset.
 * Every failure path surfaces a readable message instead of failing silently —
 * including the two that confused users most: unconfirmed email, and Google
 * not being enabled yet in the Supabase project.
 */
export function AuthPanel({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const supabase = createClient();
  const ar = locale === 'ar';

  const [mode, setMode] = useState<Mode>('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<'' | 'email' | 'google'>('');
  const [notice, setNotice] = useState<Notice>(null);

  const t = {
    signin: ar ? 'تسجيل الدخول' : 'Sign in',
    signup: ar ? 'إنشاء حساب' : 'Create account',
    reset: ar ? 'استعادة كلمة المرور' : 'Reset password',
    resetSub: ar ? 'هنبعتلك لينك على إيميلك تغيّر منه كلمة المرور' : 'We will email you a link to set a new password.',
    sendLink: ar ? 'ابعت اللينك' : 'Send reset link',
    forgot: ar ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    backToSignin: ar ? 'رجوع لتسجيل الدخول' : 'Back to sign in',
    minChars: ar ? '٦ أحرف على الأقل' : 'At least 6 characters',
    checkInbox: ar ? 'بصّ في إيميلك — بعتنا لينك التأكيد' : 'Check your inbox — we sent a confirmation link.',
    resetSent: ar ? 'بعتنا لينك استعادة كلمة المرور على إيميلك' : 'We sent a password reset link to your email.',
    resend: ar ? 'إعادة إرسال التأكيد' : 'Resend confirmation',
    resent: ar ? 'تم إرسال التأكيد تاني' : 'Confirmation sent again.',
    googleOff: ar
      ? 'الدخول بجوجل لسه مفعّلش. من Supabase → Authentication → Providers فعّل Google وحُط الـ Client ID و Secret'
      : 'Google sign-in is not enabled yet. In Supabase → Authentication → Providers, enable Google and add your Client ID and Secret.',
    unconfirmed: ar
      ? 'الإيميل لسه متأكدش. افتح اللينك اللي في بريدك، أو اطلب إرسال تأكيد جديد'
      : 'This email is not confirmed yet. Open the link in your inbox, or request a new one.',
    badCreds: ar ? 'الإيميل أو كلمة المرور غلط' : 'Wrong email or password.',
    already: ar ? 'الإيميل ده مسجّل قبل كده — سجّل دخولك' : 'That email is already registered — sign in instead.',
  };

  /** Supabase returns English codes; map the common ones to the user's language. */
  function readable(message: string) {
    const m = message.toLowerCase();
    if (m.includes('email not confirmed')) return t.unconfirmed;
    if (m.includes('invalid login credentials')) return t.badCreds;
    if (m.includes('already registered') || m.includes('already been registered')) return t.already;
    if (m.includes('provider is not enabled') || m.includes('unsupported provider')) return t.googleOff;
    return message;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy('email');
    setNotice(null);

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: window.location.origin + '/api/auth/callback?next=/' + locale + '/account',
      });
      setBusy('');
      setNotice(error ? { kind: 'error', text: readable(error.message) } : { kind: 'success', text: t.resetSent });
      return;
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          emailRedirectTo: window.location.origin + '/api/auth/callback?next=/' + locale + '/account',
        },
      });
      setBusy('');
      if (error) { setNotice({ kind: 'error', text: readable(error.message) }); return; }
      // No session means the project requires email confirmation.
      if (!data.session) { setNotice({ kind: 'success', text: t.checkInbox }); return; }
      router.push('/' + locale + '/account');
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setBusy('');
    if (error) { setNotice({ kind: 'error', text: readable(error.message) }); return; }
    router.push('/' + locale + '/account');
    router.refresh();
  }

  async function resend() {
    setBusy('email');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: form.email,
      options: { emailRedirectTo: window.location.origin + '/api/auth/callback?next=/' + locale + '/account' },
    });
    setBusy('');
    setNotice(error ? { kind: 'error', text: readable(error.message) } : { kind: 'success', text: t.resent });
  }

  async function google() {
    setBusy('google');
    setNotice(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/api/auth/callback?next=/' + locale + '/account' },
    });
    if (error) { setBusy(''); setNotice({ kind: 'error', text: readable(error.message) }); }
  }

  const field =
    'h-[52px] w-full rounded-xl border border-line bg-surface2 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-muted focus:border-brand';
  const iconCls = 'pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted';

  const title = mode === 'signin' ? dict.auth.signInTitle : mode === 'signup' ? dict.auth.signUpTitle : t.reset;
  const sub = mode === 'signin' ? dict.auth.signInSub : mode === 'signup' ? dict.auth.signUpSub : t.resetSub;
  const cta = mode === 'signin' ? t.signin : mode === 'signup' ? t.signup : t.sendLink;

  return (
    <section className="grid min-h-[calc(100vh-68px)] lg:grid-cols-2">
      {/* ── FORM SIDE ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-[420px] animate-rise">
          {/* mode tabs */}
          {mode !== 'reset' && (
            <div className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-surface2 p-1">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setNotice(null); }}
                  className={
                    'h-11 rounded-full text-[14.5px] font-semibold transition-all duration-300 ' +
                    (mode === m ? 'bg-brand text-brand-on shadow-card' : 'text-muted hover:text-ink')
                  }
                >
                  {m === 'signin' ? t.signin : t.signup}
                </button>
              ))}
            </div>
          )}

          <h1 className="mb-2 text-[clamp(26px,4vw,32px)] font-bold leading-tight">{title}</h1>
          <p className="mb-7 text-[14.5px] leading-relaxed text-muted">{sub}</p>

          {notice && (
            <div
              className={
                'mb-5 flex items-start gap-3 rounded-xl border p-4 text-[13.5px] leading-relaxed ' +
                (notice.kind === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'border-brand/30 bg-cream text-brand')
              }
            >
              {notice.kind === 'error'
                ? <AlertCircle size={17} className="mt-px shrink-0" />
                : <CheckCircle2 size={17} className="mt-px shrink-0" />}
              <div>
                <p>{notice.text}</p>
                {notice.text === t.unconfirmed && (
                  <button type="button" onClick={resend} className="mt-2 font-semibold underline">
                    {t.resend}
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="grid gap-3.5">
            {mode === 'signup' && (
              <label className="relative block">
                <User size={17} className={iconCls} />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={dict.common.name}
                  autoComplete="name"
                  className={field + ' pe-4 ps-12'}
                />
              </label>
            )}

            <label className="relative block">
              <Mail size={17} className={iconCls} />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={dict.common.email}
                autoComplete="email"
                className={field + ' pe-4 ps-12'}
              />
            </label>

            {mode !== 'reset' && (
              <div>
                <label className="relative block">
                  <Lock size={17} className={iconCls} />
                  <input
                    required
                    minLength={6}
                    type={show ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={dict.common.password}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className={field + ' pe-12 ps-12'}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute end-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-brand"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </label>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[11.5px] text-muted">{mode === 'signup' ? t.minChars : ''}</span>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setNotice(null); }}
                      className="text-[12.5px] font-semibold text-brand hover:underline"
                    >
                      {t.forgot}
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={busy !== ''}
              className="mt-1 flex h-[52px] items-center justify-center gap-2.5 rounded-xl bg-brand font-bold text-brand-on transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:translate-y-0 disabled:opacity-60"
            >
              {busy === 'email' && <Loader2 size={17} className="animate-spin" />}
              {cta}
            </button>

            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => { setMode('signin'); setNotice(null); }}
                className="mt-1 text-[13.5px] font-semibold text-brand hover:underline"
              >
                {t.backToSignin}
              </button>
            ) : (
              <>
                <div className="my-1 flex items-center gap-3 text-xs text-muted">
                  <span className="h-px flex-1 bg-line" />{dict.common.or}<span className="h-px flex-1 bg-line" />
                </div>

                <button
                  type="button"
                  onClick={google}
                  disabled={busy !== ''}
                  className="flex h-[52px] items-center justify-center gap-3 rounded-xl border border-line bg-surface font-semibold transition-all duration-300 hover:border-brand hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                >
                  {busy === 'google' ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
                      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8h-4v3.1A12 12 0 0 0 12 24z" />
                      <path fill="#FBBC05" d="M5.3 14.3a7.1 7.1 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
                      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
                    </svg>
                  )}
                  {dict.common.google}
                </button>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-[12.5px] leading-relaxed text-muted">
            {ar ? 'بالمتابعة أنت توافق على ' : 'By continuing you agree to our '}
            <Link href={'/' + locale + '/terms'} className="font-semibold">{dict.footer.terms}</Link>
            {ar ? ' و' : ' and '}
            <Link href={'/' + locale + '/privacy'} className="font-semibold">{dict.footer.privacy}</Link>
          </p>
        </div>
      </div>

      {/* ── BRAND SIDE ────────────────────────────────────────── */}
      <div className="relative hidden min-h-[340px] overflow-hidden lg:block">
        <div className="absolute inset-0 animate-kenburns">
          <Image src={MEDIA.authSide} alt="" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(200deg, rgba(6,20,19,.3), rgba(6,20,19,.84))' }} />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="mb-2.5 font-mono text-[10.5px] tracking-[.24em] text-[#E9C88B]">PRIME DEALS</p>
          <p className="max-w-[420px] text-[19px] font-semibold leading-snug">{dict.auth.quote}</p>
          <div className="mt-8 grid max-w-[420px] grid-cols-3 gap-4 border-t border-white/20 pt-6">
            {[
              { v: '86+', l: ar ? 'مشروع' : 'Projects' },
              { v: '96%', l: ar ? 'رضا العملاء' : 'Satisfied' },
              { v: '8', l: ar ? 'سنوات' : 'Years' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[22px] font-bold">{s.v}</div>
                <div className="mt-0.5 text-[11.5px] text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
