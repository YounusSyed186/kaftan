'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialImage } from '@/components/media/EditorialImage';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import type { PopulatedArticle } from '@/types/models';
import type { MediaReferenceOverride } from '@/types/content-overrides';

interface HeroEditorialSectionProps {
  heroArticle: PopulatedArticle;
  heroArticles?: PopulatedArticle[];
  latestArticles: PopulatedArticle[];
  sectionId?: string;
  isEditorMode?: boolean;
  desktopHeroImage?: MediaReferenceOverride | null;
  mobileHeroImage?: MediaReferenceOverride | null;
  eyebrow?: string;
  headingOverride?: string;
  descriptionOverride?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  latestTitleOverrides?: Record<string, string>;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
}

const HERO_BANNER_IMAGE = 'kaftan/editorial/hero-mediterranean-resortwear';

function formatEditorialDate(dateStr?: string | null, fallback = '20 OCT 2026'): string {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    const day = d.getDate();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[d.getMonth()] || 'OCT';
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return fallback;
  }
}

function getStoryKicker(story: PopulatedArticle): string {
  const lowerSlug = story.slug.toLowerCase();
  if (lowerSlug.includes('resortwear') || lowerSlug.includes('trend')) return 'TRENDS';
  if (lowerSlug.includes('australian-labels') || lowerSlug.includes('designer')) return 'DESIGNERS';
  if (lowerSlug.includes('capsule-wardrobe') || lowerSlug.includes('wardrobe') || lowerSlug.includes('style')) return 'STYLE';
  if (lowerSlug.includes('boutiques') || lowerSlug.includes('travel') || lowerSlug.includes('getaway')) return 'TRAVEL';

  switch (story.article_type) {
    case 'trend_report': return 'TRENDS';
    case 'designer_profile': return 'DESIGNERS';
    case 'style_guide': return 'STYLE';
    case 'fashion_editorial': return 'EDITORIAL';
    case 'interview': return 'INTERVIEW';
    default: return story.article_type.replace('_', ' ').toUpperCase();
  }
}

export function HeroEditorialSection({
  heroArticle,
  heroArticles,
  latestArticles,
  sectionId = 'hero-editorial',
  isEditorMode = false,
  desktopHeroImage,
  mobileHeroImage,
  eyebrow,
  headingOverride,
  descriptionOverride,
  ctaLabel,
  ctaUrl,
  latestTitleOverrides,
  forcedViewport,
  onCommitInlineText,
}: HeroEditorialSectionProps) {
  const slides = heroArticles && heroArticles.length > 0 ? heroArticles : [heroArticle];
  const totalSlides = slides.length;
  const [currentSlide, setCurrentSlide] = useState(1);

  const activeArticle = slides[currentSlide - 1] || heroArticle;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev <= 1 ? totalSlides : prev - 1));
  }, [totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlides <= 1) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, totalSlides]);

  const displayedLatest = latestArticles.slice(0, 4);

  // Effective content resolution
  const effectiveEyebrow = eyebrow || 'The Kaftan Edit';
  const effectiveHeading = headingOverride !== undefined && headingOverride !== ''
    ? headingOverride
    : activeArticle.title;
  const effectiveDescription = descriptionOverride !== undefined && descriptionOverride !== ''
    ? descriptionOverride
    : activeArticle.excerpt;
  const effectiveCtaLabel = ctaLabel || 'Explore The Edit';
  const effectiveCtaUrl = ctaUrl || `/stories/${activeArticle.slug}`;

  // Effective responsive hero images
  const desktopSrc = desktopHeroImage?.storage_key || activeArticle.featured_image?.storage_key || HERO_BANNER_IMAGE;
  const desktopFocal = desktopHeroImage?.focal_point || { x: 0.60, y: 0.35 };
  const desktopAlt = desktopHeroImage?.alt_text || effectiveHeading;

  const mobileSrc = mobileHeroImage?.storage_key || desktopSrc;
  const mobileFocal = mobileHeroImage?.focal_point || { x: 0.72, y: 0.22 };
  const mobileAlt = mobileHeroImage?.alt_text || effectiveHeading;

  return (
    <section
      aria-label="Hero Editorial"
      className="w-full pt-3.5 sm:pt-4 pb-8"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* =========================================================================
            DESKTOP HERO COMPOSITION (Screen >= md)
            Fluid editorial grid: dominant hero image panel (~71%) with left text overlay,
            compact latest-stories index (~27%) on right.
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'hidden' : (forcedViewport ? 'grid grid-cols-[minmax(0,2.658fr)_minmax(0,1fr)] gap-[19px] lg:gap-5 items-start w-full min-w-0' : 'hidden md:grid grid-cols-[minmax(0,2.658fr)_minmax(0,1fr)] gap-[19px] lg:gap-5 items-start w-full min-w-0')}>
          {/* Left Column: Hero Photographic Panel with Left Text Overlay */}
          <div className="relative w-full aspect-[1.3025/1] max-h-[520px] xl:max-h-[540px] overflow-hidden bg-[#EFEAE0]">
            {/* Desktop Hero Image with Editable Element */}
            <EditableElement
              sectionId={sectionId}
              elementId="desktop_hero_image"
              elementType="image"
              label="Desktop Hero Image"
              isOverridden={Boolean(desktopHeroImage)}
              className="absolute inset-0 block w-full h-full"
            >
              <Link
                href={isEditorMode ? '#' : effectiveCtaUrl}
                className="block w-full h-full"
                tabIndex={-1}
                aria-hidden="true"
              >
                <EditorialImage
                  media={activeArticle.featured_image}
                  src={desktopSrc}
                  alt={desktopAlt}
                  fill
                  priority
                  disableZoom
                  focalPoint={desktopFocal}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="w-full h-full"
                />
              </Link>
            </EditableElement>

            {/* Natural warm ivory vignette */}
            <div
              className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F7F4ED]/60 via-[#F7F4ED]/20 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Editorial Text Block Overlay */}
            <div className="absolute left-6 md:left-7 lg:left-8 top-6 md:top-7 lg:top-8 z-10 flex flex-col items-start max-w-[215px] xl:max-w-[280px]">
              {/* Eyebrow */}
              <EditableElement
                sectionId={sectionId}
                elementId="eyebrow"
                elementType="heading"
                label="Eyebrow Kicker"
                allowInlineEdit
                inlineTextValue={effectiveEyebrow}
                onCommitInlineText={(val) => onCommitInlineText?.('eyebrow', val)}
              >
                <span className="text-[8.5px] lg:text-[9px] xl:text-[10px] font-semibold tracking-[0.25em] text-[#55504A] uppercase">
                  {effectiveEyebrow}
                </span>
              </EditableElement>

              {/* Desktop Headline */}
              <div className="mt-2.5">
                <EditableElement
                  sectionId={sectionId}
                  elementId="heading_override"
                  elementType="heading"
                  label="Hero Headline"
                  isOverridden={Boolean(headingOverride)}
                  allowInlineEdit
                  inlineTextValue={effectiveHeading}
                  onCommitInlineText={(val) => onCommitInlineText?.('heading_override', val)}
                >
                  <h2 className="font-serif-editorial text-[38px] lg:text-[42px] xl:text-[46px] leading-[0.96] text-[#25221F] font-normal tracking-[-0.01em]">
                    {effectiveHeading}
                  </h2>
                </EditableElement>
              </div>

              {/* Supporting Description */}
              <EditableElement
                sectionId={sectionId}
                elementId="description_override"
                elementType="text"
                label="Hero Description"
                isOverridden={Boolean(descriptionOverride)}
                allowInlineEdit
                inlineTextValue={effectiveDescription || ''}
                onCommitInlineText={(val) => onCommitInlineText?.('description_override', val)}
                className="mt-3"
              >
                <p className="text-[10px] lg:text-[10.5px] xl:text-[11.5px] text-[#3D3934] leading-[1.42] max-w-[200px] xl:max-w-[260px] font-normal">
                  {effectiveDescription}
                </p>
              </EditableElement>

              {/* Call To Action */}
              <div className="mt-4">
                <EditableElement
                  sectionId={sectionId}
                  elementId="hero_cta"
                  elementType="cta"
                  label="Hero CTA Button"
                >
                  <Link
                    href={isEditorMode ? '#' : effectiveCtaUrl}
                    className="inline-flex items-center text-[8.5px] xl:text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#25221F] border border-[#25221F] px-3.5 xl:px-4 py-1.5 xl:py-2 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors bg-[#F7F4ED]/20 backdrop-blur-xs"
                  >
                    <span>{effectiveCtaLabel}</span>
                    <span className="ml-2">&rarr;</span>
                  </Link>
                </EditableElement>
              </div>
            </div>

            {/* Desktop Carousel Controls */}
            {totalSlides > 1 && (
              <div className="absolute left-6 md:left-7 lg:left-8 bottom-5 z-10 flex items-center space-x-3">
                <span className="text-[9px] xl:text-[10px] font-medium text-[#25221F] tracking-widest font-mono">
                  {String(currentSlide).padStart(2, '0')}&mdash;{String(totalSlides).padStart(2, '0')}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-[26px] h-[26px] rounded-full border border-[#25221F]/30 bg-white/20 backdrop-blur-xs flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-white/40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-[26px] h-[26px] rounded-full border border-[#25221F]/30 bg-white/20 backdrop-blur-xs flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-white/40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: "THE LATEST" Editorial Sidebar */}
          <aside
            aria-label="The Latest Stories"
            className="flex flex-col"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D8D1C5]">
              <h3 className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.25em] text-[#25221F]">
                The Latest
              </h3>
              <Link
                href="/latest"
                className="text-[8px] xl:text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F] transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            {/* 4 Compact Story Rows with Controlled Editorial Density */}
            <div className="flex flex-col divide-y divide-[#D8D1C5]/60">
              {displayedLatest.map((story, idx) => {
                const customTitle = latestTitleOverrides?.[idx] || latestTitleOverrides?.[String(idx)];
                const effectiveTitle = customTitle || story.title;
                const isOverridden = Boolean(customTitle);

                return (
                  <article
                    key={story.id}
                    className="py-2 xl:py-2.5 group"
                  >
                    <EditableElement
                      sectionId={sectionId}
                      elementId={`latest_slot_${idx}`}
                      elementType="slot"
                      label={`Latest Slot 0${idx + 1}`}
                      isOverridden={isOverridden}
                      allowInlineEdit
                      inlineTextValue={effectiveTitle}
                      onCommitInlineText={(val) => onCommitInlineText?.(`latest_title_${idx}`, val)}
                    >
                      <Link
                        href={isEditorMode ? '#' : `/stories/${story.slug}`}
                        className="flex items-center space-x-3 xl:space-x-3.5"
                      >
                        {/* Clean Editorial Thumbnail Image */}
                        <div className="w-[76px] xl:w-[86px] 2xl:w-[92px] h-[76px] xl:h-[86px] 2xl:h-[92px] aspect-square overflow-hidden bg-[#EFEAE0] flex-shrink-0">
                          <EditorialImage
                            media={story.featured_image}
                            src={story.featured_image?.storage_key}
                            alt={effectiveTitle}
                            fill
                            sizes="92px"
                            className="w-full h-full"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col justify-center py-0.5 flex-1 min-w-0">
                          <span className="text-[7px] md:text-[7.5px] xl:text-[8px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                            {getStoryKicker(story)}
                          </span>
                          <h4 className="font-serif-editorial text-[11.5px] md:text-[12px] xl:text-[14px] 2xl:text-[15px] font-normal leading-[1.22] text-[#25221F] group-hover:text-[#A94F42] transition-colors line-clamp-3 mt-0.5">
                            {effectiveTitle}
                          </h4>
                          <span className="text-[7px] md:text-[7.5px] xl:text-[8px] uppercase tracking-wider text-[#77716A] mt-1 block">
                            {formatEditorialDate(story.published_at)}
                          </span>
                        </div>
                      </Link>
                    </EditableElement>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>

        {/* =========================================================================
            MOBILE HERO COMPOSITION (Screen < md)
            Independent mobile hero image + beneath-image copy
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'flex flex-col' : (forcedViewport ? 'hidden' : 'md:hidden flex flex-col')}>
          {/* 1. Mobile Hero Image (Independently selected image) */}
          <EditableElement
            sectionId={sectionId}
            elementId="mobile_hero_image"
            elementType="image"
            label="Mobile Hero Image"
            isOverridden={Boolean(mobileHeroImage)}
            className="relative w-full aspect-[1/1] sm:aspect-[4/3] overflow-hidden bg-[#EFEAE0]"
          >
            <Link
              href={isEditorMode ? '#' : effectiveCtaUrl}
              className="block w-full h-full"
              tabIndex={-1}
              aria-hidden="true"
            >
              <EditorialImage
                media={activeArticle.featured_image}
                src={mobileSrc}
                alt={mobileAlt}
                fill
                priority
                disableZoom
                focalPoint={mobileFocal}
                sizes="100vw"
                className="w-full h-full"
              />
            </Link>
          </EditableElement>

          {/* 2. Mobile Editorial Copy */}
          <div className="mt-4 sm:mt-5 flex flex-col items-start">
            <EditableElement
              sectionId={sectionId}
              elementId="eyebrow"
              elementType="heading"
              label="Eyebrow Kicker"
              allowInlineEdit
              inlineTextValue={effectiveEyebrow}
              onCommitInlineText={(val) => onCommitInlineText?.('eyebrow', val)}
            >
              <span className="text-[8.5px] sm:text-[9px] font-semibold tracking-[0.25em] text-[#55504A] uppercase">
                {effectiveEyebrow}
              </span>
            </EditableElement>

            <EditableElement
              sectionId={sectionId}
              elementId="heading_override"
              elementType="heading"
              label="Hero Headline"
              isOverridden={Boolean(headingOverride)}
              allowInlineEdit
              inlineTextValue={effectiveHeading}
              onCommitInlineText={(val) => onCommitInlineText?.('heading_override', val)}
              className="mt-2"
            >
              <h2 className="font-serif-editorial text-[30px] sm:text-[36px] leading-[1.0] text-[#25221F] font-normal tracking-[-0.01em]">
                {effectiveHeading}
              </h2>
            </EditableElement>

            <EditableElement
              sectionId={sectionId}
              elementId="description_override"
              elementType="text"
              label="Hero Description"
              isOverridden={Boolean(descriptionOverride)}
              allowInlineEdit
              inlineTextValue={effectiveDescription || ''}
              onCommitInlineText={(val) => onCommitInlineText?.('description_override', val)}
              className="mt-2.5"
            >
              <p className="text-[11.5px] sm:text-xs text-[#3D3934] leading-[1.45] font-normal">
                {effectiveDescription}
              </p>
            </EditableElement>

            <div className="mt-3.5">
              <EditableElement
                sectionId={sectionId}
                elementId="hero_cta"
                elementType="cta"
                label="Hero CTA Button"
              >
                <Link
                  href={isEditorMode ? '#' : effectiveCtaUrl}
                  className="inline-flex items-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#25221F] border border-[#25221F] px-4 py-2 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors"
                >
                  <span>{effectiveCtaLabel}</span>
                  <span className="ml-2">&rarr;</span>
                </Link>
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
