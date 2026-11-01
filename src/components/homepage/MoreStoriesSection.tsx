'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import { resolveItemData, type ItemContentOverrides } from '@/types/content-overrides';
import type { PopulatedArticle, PopulatedHomepageItem } from '@/types/models';

interface MoreStoriesSectionProps {
  articles: PopulatedArticle[];
  items?: PopulatedHomepageItem[];
  sectionId?: string;
  isEditorMode?: boolean;
  moreStoriesTitle?: string;
  moreStoriesViewAllLabel?: string;
  moreStoriesViewAllUrl?: string;
  itemOverrides?: Record<string, ItemContentOverrides>;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
}

function getStoryCategory(story: PopulatedArticle): string {
  if (story.slug.includes('accessories')) return 'LIFESTYLE';
  if (story.slug.includes('emerging-talent')) return 'DESIGNERS';
  if (story.slug.includes('conscious-wardrobe')) return 'SUSTAINABILITY';
  if (story.slug.includes('bec-and-bridge') || story.slug.includes('bec-bridge')) return 'INTERVIEW';
  return story.article_type.replace('_', ' ').toUpperCase();
}

export function MoreStoriesSection({
  articles,
  items = [],
  sectionId = 'more_stories',
  isEditorMode = false,
  moreStoriesTitle = 'MORE STORIES',
  moreStoriesViewAllLabel = 'VIEW ALL',
  moreStoriesViewAllUrl = '/latest',
  itemOverrides,
  forcedViewport,
  onCommitInlineText,
}: MoreStoriesSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-label="More Editorial Stories"
      className="w-full bg-[#F7F4ED] py-6 sm:py-8 lg:py-10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <EditableElement
            sectionId={sectionId}
            elementId="more_stories_title"
            elementType="heading"
            label="Section Title"
            allowInlineEdit
            inlineTextValue={moreStoriesTitle}
            onCommitInlineText={(val) => onCommitInlineText?.('more_stories_title', val)}
          >
            <h3 className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#25221F]">
              {moreStoriesTitle} &mdash;
            </h3>
          </EditableElement>

          <EditableElement
            sectionId={sectionId}
            elementId="more_stories_view_all"
            elementType="link"
            label="View All Link"
          >
            <Link
              href={isEditorMode ? '#' : moreStoriesViewAllUrl}
              className="text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#706C66] hover:text-[#25221F] transition-colors inline-flex items-center gap-1.5"
            >
              <span>{moreStoriesViewAllLabel}</span>
              <span>&rarr;</span>
            </Link>
          </EditableElement>
        </div>

        {/* 4 Cards Grid */}
        <div className={forcedViewport === 'mobile' ? 'grid grid-cols-1 gap-4' : (forcedViewport === 'tablet' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6')}>
          {articles.slice(0, 4).map((story, idx) => {
            const item = items[idx];
            const resolved = resolveItemData(story, itemOverrides?.[item?.id]);

            const formattedDate = story.published_at
              ? new Date(story.published_at)
                  .toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .toUpperCase()
              : 'OCT 2026';

            const category = resolved.kicker || getStoryCategory(story);

            const isMobile = forcedViewport === 'mobile';
            const effectiveImgKey =
              (isMobile && resolved.mobileImageStorageKey)
                ? resolved.mobileImageStorageKey
                : (resolved.imageStorageKey || story.featured_image?.storage_key || 'kaftan/editorial/more-accessories');

            const imgSrc = buildCloudinaryUrl(
              effectiveImgKey,
              { width: 800 }
            );

            return (
              <article key={story.id} className="flex flex-col group">
                {/* 16:10 Landscape Image Container */}
                <EditableElement
                  sectionId={sectionId}
                  elementId={isMobile ? `more_story_mobile_image_${idx}` : `more_story_image_${idx}`}
                  elementType="image"
                  label={`Story 0${idx + 1} Image${isMobile ? ' (Mobile)' : ''}`}
                  isOverridden={isMobile ? (resolved.isMobileImageOverridden || resolved.isImageOverridden) : resolved.isImageOverridden}
                >
                  <Link
                    href={isEditorMode ? '#' : `/stories/${story.slug}`}
                    className="relative w-full aspect-[16/10] overflow-hidden bg-[#EFEAE0] block shadow-2xs"
                  >
                    <Image
                      src={imgSrc}
                      alt={resolved.imageAlt || resolved.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>
                </EditableElement>

                {/* Typography Container */}
                <div className="mt-2.5 sm:mt-3 flex flex-col items-start">
                  <span className="text-[7.5px] sm:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                    {category}
                  </span>

                  <EditableElement
                    sectionId={sectionId}
                    elementId={`more_story_title_${idx}`}
                    elementType="heading"
                    label={`Story 0${idx + 1} Headline`}
                    isOverridden={resolved.isTitleOverridden}
                    allowInlineEdit
                    inlineTextValue={resolved.title}
                    className="w-full mt-1"
                  >
                    <Link
                      href={isEditorMode ? '#' : `/stories/${story.slug}`}
                      className="font-serif-editorial text-[14px] sm:text-[14.5px] lg:text-[15px] xl:text-[15.5px] leading-[1.2] text-[#25221F] group-hover:text-[#A94F42] transition-colors font-normal line-clamp-2"
                    >
                      {resolved.title}
                    </Link>
                  </EditableElement>

                  <span className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-[#77716A] mt-1.5 font-mono">
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
