import Image from 'next/image';
import { Placeholder } from '../ui/Placeholder';

/**
 * Full-bleed hero with a slow ken-burns push.
 * bottomPad="search" leaves room for the glass search panel to overlap.
 */
export function Hero({
  kicker, title, sub, image, children, height = 'tall', bottomPad = 'normal',
}: {
  kicker?: string;
  title: string;
  sub?: string;
  image?: string | null;
  children?: React.ReactNode;
  height?: 'tall' | 'short';
  bottomPad?: 'normal' | 'search';
}) {
  const h = height === 'tall'
    ? 'h-[min(78vh,660px)] min-h-[440px]'
    : 'h-[min(58vh,460px)] min-h-[320px]';
  const pad = bottomPad === 'search' ? 'pb-[150px] sm:pb-[186px]' : 'pb-12 sm:pb-14';

  return (
    <div className={'relative overflow-hidden bg-surface2 ' + h}>
      <div className="absolute inset-0 animate-kenburns">
        {image
          ? <Image src={image} alt={title} fill sizes="100vw" priority className="object-cover" />
          : <Placeholder label="hero photo — 1920×1080" />}
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(6,20,19,.38), rgba(6,20,19,.78))' }} />
      <div className={'absolute inset-x-0 bottom-0 flex flex-col items-center px-5 text-center text-white sm:px-6 ' + pad}>
        <div className="max-w-[820px]">
          {kicker && <p className="mb-3.5 animate-rise font-mono text-[11px] tracking-[.3em] text-[#E9C88B] sm:text-[11.5px]">{kicker}</p>}
          <h1 className="mb-4 animate-rise text-[clamp(26px,5vw,56px)] font-bold leading-[1.08] tracking-tight [animation-delay:.15s]">{title}</h1>
          {sub && <p className="mx-auto max-w-[620px] animate-rise text-[15px] leading-relaxed text-white/90 [animation-delay:.3s] sm:text-[16.5px]">{sub}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
