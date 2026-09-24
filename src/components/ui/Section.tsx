/** Page shell: consistent max width + responsive gutters for every section. */
export function Section({
  children, className = '', tone = 'default', id,
}: { children: React.ReactNode; className?: string; tone?: 'default' | 'cream' | 'surface2' | 'brand'; id?: string }) {
  const tones = {
    default: '',
    cream: 'bg-cream',
    surface2: 'bg-surface2',
    brand: 'bg-brand text-brand-on',
  };
  return (
    <section id={id} className={tones[tone] + ' ' + className}>
      <div className="mx-auto w-full max-w-shell px-5 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHead({
  title, sub, align = 'center', kicker,
}: { title: string; sub?: string; align?: 'center' | 'start'; kicker?: string }) {
  return (
    <div className={'mb-9 max-w-[660px] sm:mb-11 ' + (align === 'center' ? 'mx-auto text-center' : '')}>
      {kicker && <p className="mb-2.5 font-mono text-[11px] tracking-[.28em] text-gold">{kicker}</p>}
      <h2 className="mb-3 text-[clamp(23px,3vw,34px)] font-bold leading-tight">{title}</h2>
      {sub && <p className="leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}
