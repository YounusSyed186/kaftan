import React from 'react';
import Link from 'next/link';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedArticle } from '@/types/models';

interface MoreStoriesSectionProps {
  articles: PopulatedArticle[];
}

export function MoreStoriesSection({ articles }: MoreStoriesSectionProps) {
  return (
    <section className="w-full px-4 sm:px-5 lg:px-6 py-10 sm:py-12">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D1C5]">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#25221F]">
          More Stories —
        </h3>
        <Link
          href="/latest"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F] transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {articles.map((story) => (
          <article key={story.id} className="flex flex-col space-y-3 group">
            {/* Card Image */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
              <Link href={`/stories/${story.slug}`}>
                <EditorialImage
                  media={story.featured_image}
                  src={story.featured_image?.storage_key}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>

            {/* Meta */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                {story.article_type.replace('_', ' ')}
              </span>
              <Link href={`/stories/${story.slug}`}>
                <h4 className="font-serif-editorial text-lg leading-snug text-[#25221F] group-hover:text-[#A94F42] transition-colors line-clamp-2">
                  {story.title}
                </h4>
              </Link>
              <span className="text-[9px] text-[#77716A] uppercase tracking-wider">
                {story.published_at ? new Date(story.published_at).toLocaleDateString('en-AU', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }) : 'Oct 2026'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
