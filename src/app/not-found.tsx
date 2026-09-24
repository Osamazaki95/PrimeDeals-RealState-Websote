import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="mb-3 font-mono text-[11px] tracking-[.3em] text-gold">404</p>
        <h1 className="mb-4 text-[clamp(26px,4vw,44px)] font-bold">This address does not exist</h1>
        <p className="mb-8 text-muted">The page moved, or the listing was taken off the market.</p>
        <Link href="/" className="inline-grid h-12 place-items-center rounded-[10px] bg-brand px-8 font-semibold text-brand-on">
          Back to home
        </Link>
      </div>
    </div>
  );
}
