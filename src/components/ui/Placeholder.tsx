/**
 * Striped placeholder shown wherever a real photo has not been uploaded yet.
 * Replace by setting the images[] column on the row — nothing else to change.
 */
export function Placeholder({ label, className = '', tone = 'brand' }: { label: string; className?: string; tone?: 'brand' | 'gold' }) {
  const stripe = tone === 'gold' ? 'rgba(184,134,59,.16)' : 'rgba(16,80,79,.14)';
  return (
    <div className={'relative h-full w-full overflow-hidden bg-surface2 ' + className}>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'repeating-linear-gradient(112deg,' + stripe + ' 0 2px, transparent 2px 15px)' }}
      />
      <span className="absolute inset-0 grid place-items-center font-mono text-[10.5px] tracking-[.14em] text-muted">
        {label}
      </span>
    </div>
  );
}
