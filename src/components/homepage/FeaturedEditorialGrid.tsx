import React from 'react';
import Link from 'next/link';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedArticle } from '@/types/models';

interface FeaturedEditorialGridProps {
  articles: PopulatedArticle[];
}

export function FeaturedEditorialGrid({ articles }: FeaturedEditorialGridProps) {
  const storyLeft = articles[0];
  const storyCenterTop = articles[1];
  const storyCenterBottom = articles[2];
  const storyRight = articles[3];

  if (!storyLeft || !storyCenterTop || !storyCenterBottom || !storyRight) {
    return null;
  }

  return (
    <section className="w-full px-4 sm:px-5 lg:px-6 py-10 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
        {/* =========================================================================
            COLUMN 1: FEATURED STORY (Left)
            ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col space-y-4 group">
          <div className="w-full aspect-[4/5] overflow-hidden bg-[#EFEAE0]">
            <Link href={`/stories/${storyLeft.slug}`}>
              <EditorialImage
                media={storyLeft.featured_image}
                src={storyLeft.featured_image?.storage_key}
                alt={storyLeft.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>

          <div className="flex flex-col space-y-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
              Featured Story
            </span>
            <Link href={`/stories/${storyLeft.slug}`}>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                {storyLeft.title}
              </h3>
            </Link>
            <p className="text-xs text-[#77716A] leading-relaxed line-clamp-3">
              {storyLeft.excerpt}
            </p>
            <div className="pt-2">
              <Link
                href={`/stories/${storyLeft.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors"
              >
                Read The Story &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2: STACKED STORIES (Center)
            ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col space-y-8 divide-y divide-[#D8D1C5]">
          {/* Top: Style Guide */}
          <div className="grid grid-cols-12 gap-4 items-center group">
            <div className="col-span-7 flex flex-col space-y-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
                Style Guide
              </span>
              <Link href={`/stories/${storyCenterTop.slug}`}>
                <h4 className="font-serif-editorial text-xl sm:text-2xl font-normal leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                  {storyCenterTop.title}
                </h4>
              </Link>
              <p className="text-xs text-[#77716A] leading-relaxed line-clamp-2">
                {storyCenterTop.excerpt}
              </p>
              <div className="pt-1">
                <Link
                  href={`/stories/${storyCenterTop.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors"
                >
                  Explore More &rarr;
                </Link>
              </div>
            </div>

            <div className="col-span-5 aspect-[4/5] overflow-hidden bg-[#EFEAE0]">
              <Link href={`/stories/${storyCenterTop.slug}`}>
                <EditorialImage
                  media={storyCenterTop.featured_image}
                  src={storyCenterTop.featured_image?.storage_key}
                  alt={storyCenterTop.title}
                  fill
                  sizes="160px"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
          </div>

          {/* Bottom: Destination */}
          <div className="grid grid-cols-12 gap-4 items-center pt-8 group">
            <div className="col-span-7 flex flex-col space-y-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
                Destination
              </span>
              <Link href={`/stories/${storyCenterBottom.slug}`}>
                <h4 className="font-serif-editorial text-xl sm:text-2xl font-normal leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                  {storyCenterBottom.title}
                </h4>
              </Link>
              <p className="text-xs text-[#77716A] leading-relaxed line-clamp-2">
                {storyCenterBottom.excerpt}
              </p>
              <div className="pt-1">
                <Link
                  href={`/stories/${storyCenterBottom.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors"
                >
                  Discover More &rarr;
                </Link>
              </div>
            </div>

            <div className="col-span-5 aspect-[4/5] overflow-hidden bg-[#EFEAE0]">
              <Link href={`/stories/${storyCenterBottom.slug}`}>
                <EditorialImage
                  media={storyCenterBottom.featured_image}
                  src={storyCenterBottom.featured_image?.storage_key}
                  alt={storyCenterBottom.title}
                  fill
                  sizes="160px"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3: TREND REPORT (Right)
            ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col space-y-4 group">
          <div className="w-full aspect-[4/5] overflow-hidden bg-[#EFEAE0]">
            <Link href={`/stories/${storyRight.slug}`}>
              <EditorialImage
                media={storyRight.featured_image}
                src={storyRight.featured_image?.storage_key}
                alt={storyRight.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>

          <div className="flex flex-col space-y-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
              Trend Report
            </span>
            <Link href={`/stories/${storyRight.slug}`}>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                {storyRight.title}
              </h3>
            </Link>
            <p className="text-xs text-[#77716A] leading-relaxed line-clamp-3">
              {storyRight.excerpt}
            </p>
            <div className="pt-2">
              <Link
                href={`/stories/${storyRight.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors"
              >
                Read The Report &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
