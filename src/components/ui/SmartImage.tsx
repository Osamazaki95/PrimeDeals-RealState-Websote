import Image from 'next/image';
import { Placeholder } from './Placeholder';

/** Renders the uploaded image, or a labelled placeholder while the CMS is still empty. */
export function SmartImage({
  src,
  alt,
  label,
  fill = true,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
  className = '',
}: {
  src?: string | null;
  alt: string;
  label: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) return <Placeholder label={label} className={className} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={'object-cover ' + className}
    />
  );
}
