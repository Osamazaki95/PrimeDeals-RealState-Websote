import Link from 'next/link';

type Variant = 'solid' | 'outline' | 'ghost' | 'onBrand';

const base =
  'inline-grid place-items-center rounded-[10px] font-semibold transition-all duration-300 ease-cine cursor-pointer whitespace-nowrap';

const variants: Record<Variant, string> = {
  solid: 'bg-brand text-brand-on hover:-translate-y-0.5 hover:brightness-110',
  outline: 'border-[1.5px] border-brand text-brand bg-transparent hover:bg-brand hover:text-brand-on hover:-translate-y-0.5',
  ghost: 'border border-line bg-surface text-ink hover:border-brand hover:text-brand',
  onBrand: 'bg-brand-on text-brand hover:-translate-y-0.5',
};

const sizes = { sm: 'h-10 px-4 text-[13px]', md: 'h-12 px-7 text-sm', lg: 'h-[52px] px-9 text-[15px]' };

export function Button({
  children, variant = 'solid', size = 'md', href, className = '', ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = [base, variants[variant], sizes[size], className].join(' ');
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
