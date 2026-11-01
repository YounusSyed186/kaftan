import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PopulatedArticle } from '@/types/models';

interface FeaturedEditorialGridProps {
  articles: PopulatedArticle[];
}

function ArrowIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 inline-block ml-0.5 transition-transform group-hover:translate-x-0.5 shrink-0"
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

export function FeaturedEditorialGrid({ articles }: FeaturedEditorialGridProps) {
  const storyLeft = articles[0];
  const storyCenterTop = articles[1];
  const storyCenterBottom = articles[2];
  const storyRight = articles[3];

  if (!storyLeft || !storyCenterTop || !storyCenterBottom || !storyRight) {
    return null;
  }

  const leftImg = storyLeft.featured_image?.storage_key || '/images/editorial/redefining-fashion.jpg';
  const centerTopImg = storyCenterTop.featured_image?.storage_key || '/images/editorial/effortless-dressing.jpg';
  const centerBottomImg = storyCenterBottom.featured_image?.storage_key || '/images/editorial/next-getaway.jpg';
  const rightImg = storyRight.featured_image?.storage_key || '/images/editorial/warm-days-bolder-looks.jpg';

  return (
    <section
      aria-label="Featured Editorial Stories"
      className="w-full bg-[#FAF8F5] border-y border-[#D8D1C5]/70 py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* =========================================================================
            DESKTOP: 3 ASYMMETRIC COLUMNS WITH 2 VERTICAL DIVIDERS (>= md)
            Column 1 (~40%): Split (Tall Image on Left + Editorial Text on Right)
            Column 2 (~32%): 2 Stacked Rows without divider (Text Left + Thumbnail Right)
            Column 3 (~28%): Stacked (Image on Top + Editorial Text on Bottom)
            ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-[4fr_3.1fr_2.9fr] divide-x divide-[#D8D1C5]/70 items-stretch">
          
          {/* -----------------------------------------------------------------------
              COLUMN 1: FEATURED STORY
              Split: Tall flush portrait image on left, text block on right.
              ----------------------------------------------------------------------- */}
          <div className="flex flex-row items-stretch pr-6 lg:pr-8 group">
            {/* Portrait Image */}
            <Link
              href={`/stories/${storyLeft.slug}`}
              className="relative w-[48%] self-stretch min-h-[360px] overflow-hidden bg-[#EFEAE0] block shrink-0"
            >
              <Image
                src={leftImg}
                alt={storyLeft.title}
                fill
                sizes="(max-width: 1280px) 22vw, 280px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                unoptimized
              />
            </Link>

            {/* Typography & CTA */}
            <div className="flex-1 flex flex-col justify-between pl-4 lg:pl-6 py-1">
              <div>
                <span className="text-[9.5px] lg:text-[10px] font-semibold uppercase tracking-[0.24em] text-[#77716A] block">
                  Featured Story
                </span>
                <Link href={`/stories/${storyLeft.slug}`} className="block mt-2.5 lg:mt-3 mb-2.5">
                  <h3 className="font-serif-editorial text-[24px] lg:text-[28px] xl:text-[31px] font-normal leading-[1.1] text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                    The Designers Redefining Australian Fashion
                  </h3>
                </Link>
                <p className="text-[11.5px] lg:text-[12.5px] text-[#6A655F] leading-[1.6] font-light">
                  Meet the visionary designers shaping a more modern, confident and globally recognised Australian fashion industry.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href={`/stories/${storyLeft.slug}`}
                  className="text-[9.5px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors inline-flex items-center gap-1.5"
                >
                  Read The Story <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              COLUMN 2: STYLE GUIDE & DESTINATION (2 stacked rows)
              ----------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between px-6 lg:px-8 py-1 gap-6">
            {/* Top Row: Style Guide */}
            <div className="flex items-center justify-between gap-4 group">
              <div className="flex-1 flex flex-col justify-between min-h-[125px]">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                    Style Guide
                  </span>
                  <Link href={`/stories/${storyCenterTop.slug}`} className="block mt-1.5">
                    <h4 className="font-serif-editorial text-[18px] lg:text-[20px] xl:text-[21px] font-normal leading-[1.15] text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                      The Art of Effortless Dressing
                    </h4>
                  </Link>
                  <p className="text-[11px] lg:text-[11.5px] text-[#6A655F] leading-[1.5] mt-1.5 font-light">
                    Modern outfit ideas for everyday elegance.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/stories/${storyCenterTop.slug}`}
                    className="text-[9px] lg:text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors inline-flex items-center gap-1"
                  >
                    Explore More <ArrowIcon />
                  </Link>
                </div>
              </div>

              <Link
                href={`/stories/${storyCenterTop.slug}`}
                className="relative w-[105px] lg:w-[120px] aspect-[4/5] shrink-0 overflow-hidden bg-[#EFEAE0] block"
              >
                <Image
                  src={centerTopImg}
                  alt={storyCenterTop.title}
                  fill
                  sizes="130px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  unoptimized
                />
              </Link>
            </div>

            {/* Bottom Row: Destination */}
            <div className="flex items-center justify-between gap-4 group">
              <div className="flex-1 flex flex-col justify-between min-h-[125px]">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                    Destination
                  </span>
                  <Link href={`/stories/${storyCenterBottom.slug}`} className="block mt-1.5">
                    <h4 className="font-serif-editorial text-[18px] lg:text-[20px] xl:text-[21px] font-normal leading-[1.15] text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                      Where to Shop on Your Next Getaway
                    </h4>
                  </Link>
                  <p className="text-[11px] lg:text-[11.5px] text-[#6A655F] leading-[1.5] mt-1.5 font-light">
                    From coastal boutiques to hidden gems, explore the best fashion destinations.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/stories/${storyCenterBottom.slug}`}
                    className="text-[9px] lg:text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors inline-flex items-center gap-1"
                  >
                    Discover More <ArrowIcon />
                  </Link>
                </div>
              </div>

              <Link
                href={`/stories/${storyCenterBottom.slug}`}
                className="relative w-[105px] lg:w-[120px] aspect-[4/5] shrink-0 overflow-hidden bg-[#EFEAE0] block"
              >
                <Image
                  src={centerBottomImg}
                  alt={storyCenterBottom.title}
                  fill
                  sizes="130px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  unoptimized
                />
              </Link>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              COLUMN 3: TREND REPORT (Stacked: Image top + Text bottom)
              ----------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between pl-6 lg:pl-8 py-1 group">
            <div>
              <Link
                href={`/stories/${storyRight.slug}`}
                className="relative w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0] block mb-3.5"
              >
                <Image
                  src={rightImg}
                  alt={storyRight.title}
                  fill
                  sizes="(max-width: 1280px) 25vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                  unoptimized
                />
              </Link>

              <span className="text-[9.5px] lg:text-[10px] font-semibold uppercase tracking-[0.24em] text-[#77716A] block">
                Trend Report
              </span>
              <Link href={`/stories/${storyRight.slug}`} className="block mt-2 mb-2">
                <h3 className="font-serif-editorial text-[22px] lg:text-[25px] xl:text-[27px] font-normal leading-[1.12] text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                  Warm Days, Bolder Looks
                </h3>
              </Link>
              <p className="text-[11.5px] lg:text-[12px] text-[#6A655F] leading-[1.55] font-light">
                The key trends, colours and pieces defining the new season.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href={`/stories/${storyRight.slug}`}
                className="text-[9.5px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors inline-flex items-center gap-1.5"
              >
                Read The Report <ArrowIcon />
              </Link>
            </div>
          </div>

        </div>

        {/* =========================================================================
            MOBILE VIEW (< md): Clean vertical flow with dividers
            ========================================================================= */}
        <div className="md:hidden flex flex-col divide-y divide-[#D8D1C5]/70 w-full">
          {/* Card 1: Featured Story (Horizontal split on mobile too) */}
          <div className="pb-6 grid grid-cols-12 gap-3.5 group">
            <Link
              href={`/stories/${storyLeft.slug}`}
              className="col-span-5 relative min-h-[190px] overflow-hidden bg-[#EFEAE0] block"
            >
              <Image
                src={leftImg}
                alt={storyLeft.title}
                fill
                sizes="42vw"
                className="object-cover object-center"
                unoptimized
              />
            </Link>

            <div className="col-span-7 flex flex-col justify-between py-0.5">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  Featured Story
                </span>
                <Link href={`/stories/${storyLeft.slug}`} className="block mt-1.5">
                  <h3 className="font-serif-editorial text-[19px] font-normal leading-[1.15] text-[#25221F]">
                    {storyLeft.title}
                  </h3>
                </Link>
                <p className="text-[11px] text-[#6A655F] leading-snug mt-1.5 line-clamp-3 font-light">
                  {storyLeft.excerpt}
                </p>
              </div>
              <div className="pt-2.5">
                <Link
                  href={`/stories/${storyLeft.slug}`}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#25221F] inline-flex items-center gap-1"
                >
                  Read The Story <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Style Guide */}
          <div className="py-5 grid grid-cols-12 gap-3.5 items-center group">
            <div className="col-span-7 flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  Style Guide
                </span>
                <Link href={`/stories/${storyCenterTop.slug}`} className="block mt-1">
                  <h4 className="font-serif-editorial text-[17px] font-normal leading-[1.2] text-[#25221F]">
                    {storyCenterTop.title}
                  </h4>
                </Link>
                <p className="text-[11px] text-[#6A655F] leading-snug mt-1.5 line-clamp-2 font-light">
                  {storyCenterTop.excerpt}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/stories/${storyCenterTop.slug}`}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#25221F] inline-flex items-center gap-1"
                >
                  Explore More <ArrowIcon />
                </Link>
              </div>
            </div>

            <Link
              href={`/stories/${storyCenterTop.slug}`}
              className="col-span-5 relative aspect-[4/5] overflow-hidden bg-[#EFEAE0] block"
            >
              <Image
                src={centerTopImg}
                alt={storyCenterTop.title}
                fill
                sizes="38vw"
                className="object-cover"
                unoptimized
              />
            </Link>
          </div>

          {/* Card 3: Destination */}
          <div className="py-5 grid grid-cols-12 gap-3.5 items-center group">
            <div className="col-span-7 flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  Destination
                </span>
                <Link href={`/stories/${storyCenterBottom.slug}`} className="block mt-1">
                  <h4 className="font-serif-editorial text-[17px] font-normal leading-[1.2] text-[#25221F]">
                    {storyCenterBottom.title}
                  </h4>
                </Link>
                <p className="text-[11px] text-[#6A655F] leading-snug mt-1.5 line-clamp-2 font-light">
                  {storyCenterBottom.excerpt}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/stories/${storyCenterBottom.slug}`}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#25221F] inline-flex items-center gap-1"
                >
                  Discover More <ArrowIcon />
                </Link>
              </div>
            </div>

            <Link
              href={`/stories/${storyCenterBottom.slug}`}
              className="col-span-5 relative aspect-[4/5] overflow-hidden bg-[#EFEAE0] block"
            >
              <Image
                src={centerBottomImg}
                alt={storyCenterBottom.title}
                fill
                sizes="38vw"
                className="object-cover"
                unoptimized
              />
            </Link>
          </div>

          {/* Card 4: Trend Report */}
          <div className="pt-6 group">
            <Link
              href={`/stories/${storyRight.slug}`}
              className="relative w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0] block mb-3"
            >
              <Image
                src={rightImg}
                alt={storyRight.title}
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </Link>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  Trend Report
                </span>
                <Link href={`/stories/${storyRight.slug}`} className="block mt-1.5">
                  <h3 className="font-serif-editorial text-[19px] font-normal leading-[1.2] text-[#25221F]">
                    {storyRight.title}
                  </h3>
                </Link>
                <p className="text-[11px] text-[#6A655F] leading-snug mt-1.5 font-light">
                  {storyRight.excerpt}
                </p>
              </div>
              <div className="pt-2.5">
                <Link
                  href={`/stories/${storyRight.slug}`}
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#25221F] inline-flex items-center gap-1"
                >
                  Read The Report <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
