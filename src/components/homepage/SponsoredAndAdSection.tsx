import React from 'react';
import Link from 'next/link';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedArticle, PopulatedAdCreative } from '@/types/models';

interface SponsoredAndAdSectionProps {
  sponsoredArticle: PopulatedArticle;
  adCreative: PopulatedAdCreative;
}

export function SponsoredAndAdSection({
  sponsoredArticle,
  adCreative,
}: SponsoredAndAdSectionProps) {
  return (
    <section className="w-full px-4 sm:px-5 lg:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* =========================================================================
            LEFT: SPONSORED EDITORIAL
            ========================================================================= */}
        <div className="bg-[#EFEAE0] p-6 sm:p-8 flex flex-col justify-between border border-[#D8D1C5]/60 group">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Image */}
            <div className="sm:col-span-5 aspect-square sm:aspect-[4/5] overflow-hidden bg-[#F7F4ED]">
              <Link href={`/stories/${sponsoredArticle.slug}`}>
                <EditorialImage
                  media={sponsoredArticle.featured_image}
                  src={sponsoredArticle.featured_image?.storage_key}
                  alt={sponsoredArticle.title}
                  fill
                  sizes="260px"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>

            {/* Copy */}
            <div className="sm:col-span-7 flex flex-col justify-center space-y-3">
              <div>
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-[#A94F42] bg-[#A94F42]/10 px-2.5 py-1">
                  Sponsored Editorial
                </span>
              </div>

              <Link href={`/stories/${sponsoredArticle.slug}`}>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                  <span className="text-[#A94F42] italic">The Art</span> of Resort Living with Fashion Spectrum
                </h3>
              </Link>

              <p className="text-xs text-[#77716A] leading-relaxed">
                {sponsoredArticle.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={`/stories/${sponsoredArticle.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#25221F] hover:text-[#A94F42] transition-colors"
                >
                  Read More &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT: ADVERTISEMENT PLACEMENT
            ========================================================================= */}
        <div className="bg-[#EFEAE0] p-6 sm:p-8 flex flex-col justify-between border border-[#D8D1C5]/60 relative group">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Copy */}
            <div className="sm:col-span-7 flex flex-col justify-center items-start space-y-3">
              <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-[#77716A] bg-[#25221F]/10 px-2.5 py-1">
                Advertisement
              </span>

              <h4 className="font-serif-editorial text-2xl sm:text-3xl tracking-[0.1em] text-[#25221F] uppercase font-normal">
                {adCreative.headline}
              </h4>

              <p className="text-[11px] uppercase tracking-[0.2em] text-[#77716A]">
                {adCreative.copy}
              </p>

              <div className="pt-3">
                <a
                  href={adCreative.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#25221F] border border-[#25221F] px-4 py-2 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors"
                >
                  Shop The Collection &rarr;
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="sm:col-span-5 aspect-square sm:aspect-[4/5] overflow-hidden bg-[#F7F4ED]">
              <a
                href={adCreative.destination_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <EditorialImage
                  media={adCreative.desktop_image}
                  src={adCreative.desktop_image?.storage_key}
                  alt={adCreative.headline}
                  fill
                  sizes="260px"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
