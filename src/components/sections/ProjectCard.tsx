import Link from 'next/link';
import Image from 'next/image';
import { projectImage } from '@/lib/media';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Project } from '@/types/db';

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <Link
      href={'/' + locale + '/projects/' + project.slug}
      className="group relative block h-[300px] overflow-hidden rounded-xl bg-surface transition-shadow duration-500 hover:shadow-card"
    >
      <div className="absolute inset-0 transition-transform duration-[800ms] ease-cine group-hover:scale-110">
        <Image src={projectImage(project.slug, project.images)} alt={pick(project, 'name', locale)} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, rgba(6,20,19,.88))' }} />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="mb-1.5 font-mono text-[10px] tracking-[.2em] text-[#E9C88B]">{pick(project, 'location', locale)}</div>
        <h3 className="mb-1.5 text-lg font-semibold">{pick(project, 'name', locale)}</h3>
        <p className="text-[12.5px] text-white/75">
          {pick(project, 'unit_types', locale)}{project.delivery_year ? ' · ' + project.delivery_year : ''}
        </p>
      </div>
    </Link>
  );
}
