'use client';

import React from 'react';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { CompetitionRow } from '@/types/models';

interface CompetitionBannerProps {
  competition: CompetitionRow;
}

export function CompetitionBanner({ competition }: CompetitionBannerProps) {
  return (
    <section className="w-full px-4 sm:px-5 lg:px-6 py-8">
      <div className="bg-[#EFEAE0] border border-[#D8D1C5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#77716A]">
            Competition —
          </span>

          <h3 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[40px] leading-tight text-[#25221F] font-normal">
            {competition.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed max-w-lg">
            {competition.description}
          </p>

          <div className="pt-4">
            <button
              onClick={() => {
                alert('Competition entry form will open when active submission period begins.');
              }}
              className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#25221F] border border-[#25221F] px-6 py-3 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors"
            >
              Enter Now &rarr;
            </button>
          </div>
        </div>

        {/* Image with Gold Badge */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden bg-[#F7F4ED]">
          <EditorialImage
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
            alt="Woman with sun hat on ocean beach"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />

          {/* Golden Badge matching reference */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#7A6136] text-[#F7F4ED] flex flex-col items-center justify-center text-center shadow-lg border-2 border-[#A88C52] z-10">
            <span className="font-serif-editorial text-2xl sm:text-3xl italic tracking-wider leading-none">
              WIN
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 font-sans">
              a Kaftan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
