import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PopulatedArticle, PopulatedAdCreative } from '@/types/models';

interface SponsoredAndAdSectionProps {
  sponsoredArticle: PopulatedArticle;
  adCreative: PopulatedAdCreative;
}

function ArrowIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 inline-block ml-1 transition-transform group-hover:translate-x-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8h10.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function SponsoredAndAdSection({
  sponsoredArticle,
  adCreative,
}: SponsoredAndAdSectionProps) {
  const sponsoredImg = sponsoredArticle.featured_image?.storage_key || '/images/editorial/sponsored-resort-living.jpg';
  const adImg = adCreative.desktop_image?.storage_key || '/images/editorial/ad-fashion-spectrum.jpg';

  return (
    <section
      aria-label="Sponsored and Advertising"
      className="w-full bg-[#FAF8F5] border-b border-[#D8D1C5]/70 py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* =========================================================================
            DESKTOP: 2-BLOCK ASYMMETRIC LAYOUT (>= md)
            Left (~43%): Sponsored Editorial (Image Left + Text Right)
            Right (~57%): Advertisement Panel (Beige Card: Copy Left + Image Right)
            ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-[4.3fr_5.7fr] gap-6 lg:gap-8 items-stretch">
          
          {/* =======================================================================
              LEFT BLOCK: SPONSORED EDITORIAL
              ======================================================================= */}
          <div className="flex flex-row items-stretch group">
            {/* Portrait Image on Left */}
            <Link
              href={`/stories/${sponsoredArticle.slug}`}
              className="relative w-[45%] self-stretch min-h-[350px] overflow-hidden bg-[#EFEAE0] block shrink-0"
            >
              <Image
                src={sponsoredImg}
                alt={sponsoredArticle.title}
                fill
                sizes="(max-width: 1280px) 22vw, 280px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                unoptimized
              />
            </Link>

            {/* Editorial Copy on Right */}
            <div className="flex-1 flex flex-col justify-between pl-5 lg:pl-6 py-1">
              <div>
                {/* Badge: Pink background with coral/salmon text */}
                <span className="inline-block text-[8.5px] lg:text-[9px] font-bold uppercase tracking-[0.2em] text-[#C55757] bg-[#FCE5E2] px-2.5 py-1">
                  Sponsored Editorial
                </span>

                {/* Headline: "The Art of" with "The Art" italicized coral */}
                <Link href={`/stories/${sponsoredArticle.slug}`} className="block mt-3 mb-2.5">
                  <h3 className="font-serif-editorial text-[23px] lg:text-[27px] xl:text-[29px] font-normal leading-[1.1] text-[#25221F] group-hover:text-[#A94F42] transition-colors max-w-[220px]">
                    <span className="text-[#C55757] italic">The Art</span> of<br />
                    Resort Living<br />
                    with Fashion<br />
                    Spectrum
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-[11.5px] lg:text-[12px] text-[#6A655F] leading-[1.6] font-light max-w-[240px]">
                  {sponsoredArticle.excerpt || 'Discover timeless kaftans and elevated resortwear designed for modern women.'}
                </p>
              </div>

              {/* CTA Link */}
              <div className="pt-4">
                <Link
                  href={`/stories/${sponsoredArticle.slug}`}
                  className="text-[9.5px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors inline-flex items-center"
                >
                  Read More <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* =======================================================================
              RIGHT BLOCK: ADVERTISEMENT PANEL
              Warm beige panel (#EFE9DF) with khaki badge, centered copy & right image
              ======================================================================= */}
          <div className="bg-[#EFE9DF] flex flex-row items-stretch group overflow-hidden border border-[#E2DBD0]">
            {/* Left Copy Column (Centered Brand Identity) */}
            <div className="flex-1 flex flex-col justify-between p-5 lg:p-6">
              {/* Badge: Solid khaki/olive rectangle with white text */}
              <div>
                <span className="inline-block text-[8px] lg:text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[#FAF8F5] bg-[#6C6652] px-3 py-1">
                  Advertisement
                </span>
              </div>

              {/* Centered Typography & Button */}
              <div className="my-auto flex flex-col items-center text-center py-4 px-2">
                <h4 className="font-serif-editorial text-[28px] lg:text-[32px] xl:text-[35px] tracking-[0.08em] text-[#25221F] uppercase font-normal leading-[1.08]">
                  Fashion<br />Spectrum
                </h4>

                <p className="text-[10px] lg:text-[10.5px] uppercase tracking-[0.22em] text-[#5E584E] font-medium leading-relaxed mt-3 max-w-[220px]">
                  Effortless Kaftans<br />For Every Occasion
                </p>

                <div className="mt-5">
                  <a
                    href={adCreative.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-[9px] lg:text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#25221F] border border-[#25221F] bg-transparent px-5 py-2 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors gap-1.5"
                  >
                    Shop The Collection <ArrowIcon />
                  </a>
                </div>
              </div>

              {/* Bottom balance spacing */}
              <div className="h-4" aria-hidden="true" />
            </div>

            {/* Right Portrait Image */}
            <a
              href={adCreative.destination_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[45%] self-stretch min-h-[350px] overflow-hidden bg-[#E5DFD4] block shrink-0"
            >
              <Image
                src={adImg}
                alt={adCreative.headline}
                fill
                sizes="(max-width: 1280px) 28vw, 340px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                unoptimized
              />
            </a>
          </div>

        </div>

        {/* =========================================================================
            MOBILE VIEW (< md): Vertical Flow
            ========================================================================= */}
        <div className="md:hidden flex flex-col divide-y divide-[#D8D1C5]/70 w-full">
          {/* Card 1: Sponsored Editorial */}
          <div className="pb-6 grid grid-cols-12 gap-3.5 group">
            <Link
              href={`/stories/${sponsoredArticle.slug}`}
              className="col-span-5 relative min-h-[190px] overflow-hidden bg-[#EFEAE0] block"
            >
              <Image
                src={sponsoredImg}
                alt={sponsoredArticle.title}
                fill
                sizes="42vw"
                className="object-cover object-center"
                unoptimized
              />
            </Link>

            <div className="col-span-7 flex flex-col justify-between py-0.5">
              <div>
                <span className="inline-block text-[8px] font-bold uppercase tracking-[0.2em] text-[#C55757] bg-[#FCE5E2] px-2 py-0.5">
                  Sponsored Editorial
                </span>
                <Link href={`/stories/${sponsoredArticle.slug}`} className="block mt-2">
                  <h3 className="font-serif-editorial text-[19px] font-normal leading-[1.15] text-[#25221F]">
                    <span className="text-[#C55757] italic">The Art</span> of Resort Living with Fashion Spectrum
                  </h3>
                </Link>
                <p className="text-[11px] text-[#6A655F] leading-snug mt-1.5 line-clamp-3 font-light">
                  {sponsoredArticle.excerpt}
                </p>
              </div>
              <div className="pt-2.5">
                <Link
                  href={`/stories/${sponsoredArticle.slug}`}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#25221F] inline-flex items-center"
                >
                  Read More <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Advertisement */}
          <div className="pt-6">
            <div className="bg-[#EFE9DF] border border-[#E2DBD0] overflow-hidden">
              <div className="p-4">
                <span className="inline-block text-[7.5px] font-semibold uppercase tracking-[0.22em] text-[#FAF8F5] bg-[#6C6652] px-2.5 py-0.5">
                  Advertisement
                </span>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center px-4 pb-4">
                <div className="col-span-7 flex flex-col items-center text-center py-2">
                  <h4 className="font-serif-editorial text-[20px] tracking-[0.06em] text-[#25221F] uppercase font-normal leading-tight">
                    Fashion Spectrum
                  </h4>
                  <p className="text-[9.5px] uppercase tracking-[0.18em] text-[#5E584E] font-medium leading-relaxed mt-1.5">
                    Effortless Kaftans For Every Occasion
                  </p>
                  <div className="mt-3">
                    <a
                      href={adCreative.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[#25221F] border border-[#25221F] px-3 py-1.5 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
                    >
                      Shop The Collection <ArrowIcon />
                    </a>
                  </div>
                </div>

                <div className="col-span-5">
                  <a
                    href={adCreative.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-[4/5] overflow-hidden bg-[#E5DFD4]"
                  >
                    <Image
                      src={adImg}
                      alt={adCreative.headline}
                      fill
                      sizes="38vw"
                      className="object-cover"
                      unoptimized
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
