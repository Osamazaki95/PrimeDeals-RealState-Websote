import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

/** WhatsApp has no lucide glyph, so it ships as a small inline mark. */
function WhatsAppMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2.5a9.4 9.4 0 0 0-8 14.3L2.5 21.5l4.8-1.5a9.4 9.4 0 1 0 4.74-17.5zm0 1.7a7.7 7.7 0 0 1 0 15.4 7.6 7.6 0 0 1-3.9-1.07l-.35-.2-2.6.8.8-2.5-.22-.36a7.7 7.7 0 0 1 6.27-12.07zm-3.3 3.6c-.18 0-.46.07-.7.33-.24.26-.9.88-.9 2.13s.92 2.46 1.05 2.63c.13.18 1.78 2.82 4.4 3.84 2.18.84 2.62.67 3.1.63.48-.05 1.54-.63 1.76-1.24.22-.61.22-1.14.15-1.25-.07-.1-.26-.17-.55-.31-.28-.15-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.27-.68.86-.83 1.04-.15.17-.3.2-.55.07-.26-.13-1.1-.4-2.09-1.29-.74-.66-1.24-1.47-1.39-1.73-.15-.27-.02-.41.11-.55.13-.13.29-.34.44-.5.15-.17.2-.29.3-.48.09-.2.05-.36-.02-.5-.07-.14-.6-1.44-.82-1.97-.18-.42-.36-.43-.5-.44h-.07z" />
    </svg>
  );
}

/**
 * Floating glass contact rail — visible from the first paint, docked to the
 * bottom-right so it never overlaps the hero search panel.
 */
export function QuickActions({ locale }: { locale: Locale }) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || '201119555867';
  const cls =
    'grid h-[52px] w-[52px] place-items-center rounded-full border border-line bg-surface/85 text-brand shadow-card backdrop-blur-2xl transition-all duration-300 ease-cine hover:-translate-y-0.5 hover:scale-105 hover:bg-brand hover:text-brand-on';

  return (
    <div className="fixed bottom-5 end-3 z-[70] flex flex-col gap-3 sm:bottom-6 sm:end-3">
      <Link href={'/' + locale + '/contact'} aria-label="Contact" className={cls}><Mail size={21} /></Link>
      <a href={'tel:+' + wa} aria-label="Call" className={cls}><Phone size={21} /></a>
      <a href={'https://wa.me/' + wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={cls}><WhatsAppMark /></a>
    </div>
  );
}
