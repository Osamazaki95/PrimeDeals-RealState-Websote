'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Rotate3d, X } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

/**
 * Photo gallery with an optional 360° tour. The tour only appears when the
 * listing carries tour_360_url, so the button is never a dead end.
 */
export function PropertyGallery({
  shots, tour, title, dict,
}: { shots: string[]; tour?: string | null; title: string; dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const [inTour, setInTour] = useState(false);

  return (
    <div className="mb-6">
      <div className="mb-3.5 grid gap-3.5 lg:grid-cols-3">
        <div className="relative h-[260px] overflow-hidden rounded-[18px] bg-surface2 sm:h-[360px] lg:col-span-2 lg:h-[440px]">
          {inTour && tour ? (
            <div className="absolute inset-0 bg-[#06100F]">
              <Image src={tour} alt={title + ' 360'} fill sizes="66vw" className="animate-[pan_38s_linear_infinite_alternate] scale-[1.6] object-cover" />
              <div className="absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-3.5 rounded-full border border-white/25 bg-[rgba(6,20,19,.6)] px-5 py-2.5 text-white backdrop-blur-xl">
                <span className="font-mono text-[10.5px] tracking-[.2em]">360° VIRTUAL TOUR</span>
                <button
                  onClick={() => setInTour(false)}
                  className="flex h-[30px] items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-bold text-brand"
                >
                  <X size={12} />{dict.properties.exitTour}
                </button>
              </div>
            </div>
          ) : (
            <>
              <Image src={shots[active]} alt={title} fill sizes="(max-width: 1024px) 100vw, 66vw" priority className="animate-kenburns object-cover" />
              {tour && (
                <button
                  onClick={() => setInTour(true)}
                  className="absolute bottom-4 start-4 flex h-12 items-center gap-3 rounded-full border border-white/40 bg-[rgba(6,20,19,.5)] px-5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 ease-cine hover:-translate-y-0.5 hover:bg-brand"
                >
                  <Rotate3d size={17} />{dict.properties.view360}
                </button>
              )}
            </>
          )}
        </div>

        <div className="hidden gap-3.5 lg:grid">
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => { setActive(n % shots.length); setInTour(false); }}
              className="group relative h-[213px] overflow-hidden rounded-[18px] bg-surface2"
            >
              <Image src={shots[n % shots.length]} alt={title + ' ' + n} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {shots.map((src, n) => (
          <button
            key={src + n}
            onClick={() => { setActive(n); setInTour(false); }}
            className="relative h-[60px] w-[88px] overflow-hidden rounded-xl outline-offset-2 transition-all duration-300 sm:h-[72px] sm:w-[104px]"
            style={{ outline: '2px solid ' + (active === n && !inTour ? 'var(--brand)' : 'transparent') }}
          >
            <Image src={src} alt="" fill sizes="104px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
