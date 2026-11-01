'use client';

import React from 'react';
import Image from 'next/image';
import type { CompetitionRow } from '@/types/models';

interface CompetitionBannerProps {
  competition: CompetitionRow;
}

export function CompetitionBanner({ competition }: CompetitionBannerProps) {
  return (
    <section
      aria-label="Fashion Competition"
      className="w-full bg-[#F7F4ED] py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-[1400px] mx-auto border border-[#D8D1C5] bg-[#FCFAF6] overflow-hidden relative shadow-xs min-h-[290px] sm:min-h-[320px] lg:min-h-[350px] flex items-center">
        
        {/* =========================================================================
            BACKGROUND PHOTO WITH SEAMLESS EDITORIAL GRADIENT FADE
            The photo smoothly blends into the ivory background on the left.
            ========================================================================= */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[60%] sm:w-[56%] lg:w-[58%] overflow-hidden pointer-events-none select-none z-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.7) 32%, black 50%, black 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.7) 32%, black 50%, black 100%)',
          }}
        >
          <Image
            src="/images/editorial/competition-strawhat-beach.jpg"
            alt="Woman with straw sun hat looking at Mediterranean ocean"
            fill
            sizes="(max-width: 1024px) 70vw, 58vw"
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>

        {/* Soft overlay gradient for extra legibility on smaller viewports */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#FCFAF6] via-[#FCFAF6]/90 sm:via-[#FCFAF6]/70 to-transparent w-[65%] sm:w-[48%] pointer-events-none z-1"
          aria-hidden="true"
        />

        {/* =========================================================================
            CIRCULAR "WIN A KAFTAN" GOLDEN BRONZE BADGE
            Matches the reference screenshot in position, color, and typography.
            ========================================================================= */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 lg:top-8 lg:right-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-[102px] lg:h-[102px] rounded-full bg-[#785E32] text-[#FAF8F5] flex flex-col items-center justify-center text-center shadow-md z-20 pointer-events-none">
          <span className="font-serif-editorial text-[22px] sm:text-[26px] lg:text-[29px] font-normal tracking-[0.04em] leading-none text-[#FAF8F5]">
            WIN
          </span>
          <span className="text-[9px] sm:text-[10px] lg:text-[10.5px] font-sans font-light tracking-normal text-[#FAF8F5] mt-1">
            a Kaftan
          </span>
        </div>

        {/* =========================================================================
            LEFT EDITORIAL COPY BLOCK
            Exact reference match: Category, 2-line Serif Heading, Excerpt, CTA
            ========================================================================= */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-12 xl:p-14 max-w-[520px] lg:max-w-[580px] flex flex-col justify-center">
          <span className="text-[9.5px] lg:text-[10px] font-semibold uppercase tracking-[0.24em] text-[#706C66] block">
            Competition —
          </span>

          <h3 className="font-serif-editorial text-[26px] sm:text-[32px] lg:text-[38px] xl:text-[42px] font-normal leading-[1.08] text-[#25221F] mt-3 lg:mt-3.5">
            Win a Kaftan<br />from Fashion Spectrum
          </h3>

          <p className="text-[11.5px] lg:text-[12.5px] text-[#6E6962] leading-[1.62] mt-3.5 lg:mt-4 font-light max-w-[380px] lg:max-w-[420px]">
            {competition.description || 'Purchase an eligible kaftan, scan the QR code, upload your receipt and go in the draw to win a stunning kaftan from Fashion Spectrum.'}
          </p>

          <div className="pt-4 lg:pt-5">
            <button
              type="button"
              onClick={() => {
                alert('Competition entry form will open when active submission period begins.');
              }}
              className="inline-flex items-center text-[9px] lg:text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#25221F] border border-[#25221F] bg-transparent px-5 py-2 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors gap-2 cursor-pointer"
            >
              Enter Now <span>&rarr;</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
