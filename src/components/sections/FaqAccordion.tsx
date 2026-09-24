'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { pick } from '@/lib/format';
import type { Locale } from '@/lib/i18n/config';
import type { Faq } from '@/types/db';

export function FaqAccordion({ faqs, locale }: { faqs: Faq[]; locale: Locale }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-3">
      {faqs.map((f, i) => (
        <div key={f.id} className="overflow-hidden rounded-xl border border-line bg-surface">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 p-5 text-start text-[15.5px] font-semibold transition-colors duration-300 hover:text-brand"
          >
            {pick(f, 'question', locale)}
            <Plus
              size={18}
              className="flex-shrink-0 text-brand transition-transform duration-300 ease-cine"
              style={{ transform: 'rotate(' + (open === i ? 45 : 0) + 'deg)' }}
            />
          </button>
          <div
            className="overflow-hidden transition-[max-height] duration-500 ease-cine"
            style={{ maxHeight: open === i ? '260px' : '0px' }}
          >
            <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-muted">{pick(f, 'answer', locale)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
