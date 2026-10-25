import React from 'react';
import Link from 'next/link';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedArticle } from '@/types/models';

interface EditorialListingProps {
  title: string;
  subtitle?: string;
  articles: PopulatedArticle[];
}

export function EditorialListing({
  title,
  subtitle,
  articles,
}: EditorialListingProps) {
  return (
    <div className="w-full px-4 sm:px-5 lg:px-6 py-10 sm:py-12">
      {/* Title Header */}
      <div className="pb-8 border-b border-[#D8D1C5] mb-10 flex flex-col items-center text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#77716A]">
          KAFTAN Editorial
        </span>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-normal text-[#25221F] tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#77716A] max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((story) => (
          <article key={story.id} className="flex flex-col space-y-3 group">
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
              <Link href={`/stories/${story.slug}`}>
                <EditorialImage
                  media={story.featured_image}
                  src={story.featured_image?.storage_key}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>

            <div className="flex flex-col space-y-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                {story.article_type.replace('_', ' ')}
              </span>
              <Link href={`/stories/${story.slug}`}>
                <h2 className="font-serif-editorial text-2xl leading-tight text-[#25221F] group-hover:text-[#A94F42] transition-colors">
                  {story.title}
                </h2>
              </Link>
              <p className="text-xs text-[#77716A] line-clamp-2 leading-relaxed">
                {story.excerpt}
              </p>
              <div className="pt-2 text-[9px] text-[#77716A] uppercase tracking-wider flex items-center justify-between">
                <span>
                  {story.published_at
                    ? new Date(story.published_at).toLocaleDateString('en-AU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'October 2026'}
                </span>
                <span className="group-hover:translate-x-1 transition-transform">
                  Read &rarr;
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
