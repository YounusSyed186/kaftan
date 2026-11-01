import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PopulatedArticle } from '@/types/models';

interface MoreStoriesSectionProps {
  articles: PopulatedArticle[];
}

function getStoryCategory(story: PopulatedArticle): string {
  if (story.slug.includes('accessories')) return 'LIFESTYLE';
  if (story.slug.includes('emerging-talent')) return 'DESIGNERS';
  if (story.slug.includes('conscious-wardrobe')) return 'SUSTAINABILITY';
  if (story.slug.includes('bec-and-bridge') || story.slug.includes('bec-bridge')) return 'INTERVIEW';
  return story.article_type.replace('_', ' ').toUpperCase();
}

export function MoreStoriesSection({ articles }: MoreStoriesSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-label="More Editorial Stories"
      className="w-full bg-[#F7F4ED] py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* =========================================================================
            HEADER ROW
            Matches reference: "MORE STORIES —" left, "VIEW ALL →" right, clean open gap
            ========================================================================= */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#25221F]">
            More Stories —
          </h3>
          <Link
            href="/latest"
            className="text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#706C66] hover:text-[#25221F] transition-colors inline-flex items-center gap-1.5"
          >
            View All <span>&rarr;</span>
          </Link>
        </div>

        {/* =========================================================================
            DESKTOP / TABLET GRID (4 CARDS)
            Exact Reference Match: 16:10 landscape image, category, 2-line title, date
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {articles.map((story) => {
            const formattedDate = story.published_at
              ? new Date(story.published_at)
                  .toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .toUpperCase()
              : 'OCT 2026';

            const category = getStoryCategory(story);

            const imgSrc =
              story.featured_image?.storage_key ||
              '/images/editorial/more-accessories.jpg';

            return (
              <article key={story.id} className="flex flex-col group">
                {/* 16:10 Landscape Image Container */}
                <Link
                  href={`/stories/${story.slug}`}
                  className="relative w-full aspect-[16/10] overflow-hidden bg-[#EFEAE0] block shadow-2xs"
                >
                  <Image
                    src={imgSrc}
                    alt={story.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </Link>

                {/* Typography Block */}
                <div className="pt-3 sm:pt-3.5 flex flex-col">
                  {/* Category */}
                  <span className="text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.22em] text-[#706C66] block">
                    {category}
                  </span>

                  {/* Title */}
                  <Link href={`/stories/${story.slug}`} className="block mt-1 sm:mt-1.5">
                    <h4 className="font-serif-editorial text-[17px] sm:text-[18px] lg:text-[19px] font-normal leading-[1.18] text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                      {story.title}
                    </h4>
                  </Link>

                  {/* Date */}
                  <span className="text-[8.5px] sm:text-[9px] font-sans font-medium uppercase tracking-[0.16em] text-[#706C66] mt-2 block">
                    {formattedDate}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
