'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedArticle } from '@/types/models';

interface HeroEditorialSectionProps {
  heroArticle: PopulatedArticle;
  heroArticles?: PopulatedArticle[];
  latestArticles: PopulatedArticle[];
}

const HERO_BANNER_IMAGE = '/images/editorial/hero-mediterranean-resortwear.jpg';

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

  // Support arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlides <= 1) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, totalSlides]);

  // Ensure 4 items for latest list matching editorial reference
  const displayedLatest = latestArticles.slice(0, 4);

  return (
    <section
      aria-label="Hero Editorial"
      className="w-full px-5 sm:px-6 pt-3.5 sm:pt-4 pb-8"
    >
      {/* =========================================================================
          DESKTOP HERO COMPOSITION (Screen >= lg)
          Full-viewport editorial grid: dominant hero image panel (~71.5%) with left text overlay,
          compact latest-stories index (~27.5%) on right.
          ========================================================================= */}
      <div className="hidden lg:grid grid-cols-[minmax(0,2.6fr)_minmax(250px,1fr)] gap-[19px] lg:gap-5 items-start w-full min-w-0">
        {/* Left Column: Hero Photographic Panel with Left Text Overlay (Aspect 1.30:1) */}
        <div className="relative w-full aspect-[1.30/1] overflow-hidden bg-[#EFEAE0]">
          {/* Background Hero Image */}
          <Link
            href={`/stories/${activeArticle.slug}`}
            className="absolute inset-0 block w-full h-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <EditorialImage
              media={activeArticle.featured_image}
              src={activeArticle.featured_image?.storage_key || HERO_BANNER_IMAGE}
              alt={activeArticle.title || 'A New Season of Modern Elegance'}
              fill
              priority
              disableZoom
              focalPoint={{ x: 0.65, y: 0.25 }}
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="w-full h-full"
            />
          </Link>

          {/* Gentle, natural warm ivory vignette on the left to preserve text contrast */}
          <div
            className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F7F4ED]/60 via-[#F7F4ED]/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Editorial Text Block Overlay (Left-aligned over photograph) */}
          <div className="absolute left-7 lg:left-8 top-7 lg:top-8 z-10 flex flex-col items-start max-w-[215px]">
            <span className="text-[8.5px] lg:text-[9px] font-semibold tracking-[0.25em] text-[#55504A] uppercase">
              The Kaftan Edit
            </span>

            {/* Desktop Headline with Editorial Narrow Column Line Breaks */}
            <div className="mt-2.5">
              {activeArticle.title === 'A New Season of Modern Elegance' ? (
                <h2 className="font-serif-editorial text-[38px] lg:text-[42px] leading-[0.96] text-[#25221F] font-normal tracking-[-0.01em]">
                  <span className="block">A New</span>
                  <span className="block">Season of</span>
                  <span className="block">Modern</span>
                  <span className="block">Elegance</span>
                </h2>
              ) : (
                <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[40px] leading-[0.96] text-[#25221F] font-normal tracking-[-0.01em]">
                  {activeArticle.title}
                </h2>
              )}
            </div>

            {/* Supporting Description */}
            <p className="text-[10px] lg:text-[10.5px] text-[#3D3934] leading-[1.42] max-w-[200px] mt-3 font-normal">
              {activeArticle.excerpt}
            </p>

            {/* Call To Action */}
            <div className="mt-4">
              <Link
                href={`/stories/${activeArticle.slug}`}
                className="inline-flex items-center text-[8.5px] font-medium uppercase tracking-[0.18em] text-[#25221F] border border-[#25221F] px-3.5 py-1.5 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors bg-[#F7F4ED]/20 backdrop-blur-xs"
              >
                <span>Explore The Edit</span>
                <span className="ml-2">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Desktop Carousel Controls (Lower-Left edge of Hero Image matching reference) */}
          {totalSlides > 1 && (
            <div className="absolute bottom-6 left-7 lg:left-8 flex items-center space-x-5 z-10 pointer-events-auto">
              {/* Pagination & Progress Line */}
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] tracking-wider text-[#25221F]">
                  0{currentSlide} / 0{totalSlides}
                </span>
                <div
                  className="w-14 lg:w-16 h-[1.5px] bg-[#D8D1C5] relative overflow-hidden"
                  role="progressbar"
                  aria-valuenow={currentSlide}
                  aria-valuemin={1}
                  aria-valuemax={totalSlides}
                >
                  <div
                    className="h-full bg-[#25221F] transition-all duration-300"
                    style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                  />
                </div>
              </div>

              {/* Prev / Next Circular Buttons grouped with progress indicator */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-6 h-6 rounded-full border border-[#D8D1C5] bg-[#F7F4ED]/50 backdrop-blur-xs flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-[#F7F4ED] transition-colors"
                >
                  <ChevronLeft className="w-3 h-3 stroke-[1.5]" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-6 h-6 rounded-full border border-[#D8D1C5] bg-[#F7F4ED]/50 backdrop-blur-xs flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-[#F7F4ED] transition-colors"
                >
                  <ChevronRight className="w-3 h-3 stroke-[1.5]" />
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
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#25221F]">
              The Latest
            </h3>
            <Link
              href="/latest"
              className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F] transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          {/* 4 Compact Story Rows with Controlled Editorial Density */}
          <div className="flex flex-col divide-y divide-[#D8D1C5]/60">
            {displayedLatest.map((story) => (
              <article
                key={story.id}
                className="py-2.5 group"
              >
                <Link
                  href={`/stories/${story.slug}`}
                  className="flex items-center space-x-3.5"
                >
                  {/* Clean Editorial Thumbnail Image (~76px square) */}
                  <div className="w-[76px] h-[76px] aspect-square overflow-hidden bg-[#EFEAE0] flex-shrink-0">
                    <EditorialImage
                      media={story.featured_image}
                      src={story.featured_image?.storage_key}
                      alt={story.title}
                      fill
                      sizes="80px"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col justify-center py-0.5 flex-1 min-w-0">
                    <span className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                      {getStoryKicker(story)}
                    </span>
                    <h4 className="font-serif-editorial text-[12px] lg:text-[13px] font-normal leading-[1.2] text-[#25221F] group-hover:text-[#A94F42] transition-colors line-clamp-2 mt-0.5">
                      {story.title}
                    </h4>
                    <span className="text-[7.5px] uppercase tracking-wider text-[#77716A] mt-1 block">
                      {formatEditorialDate(story.published_at)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </div>

      {/* =========================================================================
          MOBILE HERO COMPOSITION (Screen < lg)
          Single-column responsive layout:
          1. Full-width portrait hero image
          2. Editorial text block beneath the image
          3. Carousel controls row
          4. "THE LATEST" stacked list section below
          ========================================================================= */}
      <div className="lg:hidden flex flex-col">
        {/* 1. Mobile Hero Image (Portrait Crop) */}
        <div className="relative w-full aspect-[1/1] sm:aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
          <Link
            href={`/stories/${activeArticle.slug}`}
            className="block w-full h-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <EditorialImage
              media={activeArticle.featured_image}
              src={activeArticle.featured_image?.storage_key || HERO_BANNER_IMAGE}
              alt={activeArticle.title || 'A New Season of Modern Elegance'}
              fill
              priority
              disableZoom
              focalPoint={{ x: 0.72, y: 0.22 }}
              sizes="100vw"
              className="w-full h-full"
            />
          </Link>
        </div>

        {/* 2. Mobile Editorial Copy (Placed BENEATH the photograph) */}
        <div className="mt-4 sm:mt-5 flex flex-col items-start">
          <span className="text-[9px] font-semibold tracking-[0.22em] text-[#77716A] uppercase">
            The Kaftan Edit
          </span>

          {/* Mobile Headline */}
          <div className="mt-2">
            {activeArticle.title === 'A New Season of Modern Elegance' ? (
              <h2 className="font-serif-editorial text-2xl sm:text-3xl leading-[1.06] text-[#25221F] font-normal tracking-[-0.01em]">
                <span className="block">A New Season</span>
                <span className="block">of Modern Elegance</span>
              </h2>
            ) : (
              <h2 className="font-serif-editorial text-2xl sm:text-3xl leading-[1.06] text-[#25221F] font-normal tracking-[-0.01em]">
                {activeArticle.title}
              </h2>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-[11px] sm:text-xs text-[#77716A] leading-relaxed mt-2.5 max-w-md">
            {activeArticle.excerpt}
          </p>

          {/* Mobile CTA */}
          <div className="mt-3.5">
            <Link
              href={`/stories/${activeArticle.slug}`}
              className="inline-flex items-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#25221F] border border-[#25221F] px-4 py-2 hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors"
            >
              <span>Explore The Edit</span>
              <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 3. Mobile Carousel Controls (Beneath Editorial Text) */}
        {totalSlides > 1 && (
          <div className="mt-5 pt-3.5 flex items-center justify-between border-t border-[#D8D1C5]/50">
            {/* Pagination & Progress */}
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[10px] tracking-wider text-[#25221F]">
                0{currentSlide} / 0{totalSlides}
              </span>
              <div
                className="w-14 sm:w-16 h-[1.5px] bg-[#D8D1C5] relative overflow-hidden"
                role="progressbar"
                aria-valuenow={currentSlide}
                aria-valuemin={1}
                aria-valuemax={totalSlides}
              >
                <div
                  className="h-full bg-[#25221F] transition-all duration-300"
                  style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                />
              </div>
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-7 h-7 rounded-full border border-[#D8D1C5] flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-[#EFEAE0] transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-7 h-7 rounded-full border border-[#D8D1C5] flex items-center justify-center text-[#25221F] hover:border-[#25221F] hover:bg-[#EFEAE0] transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        )}

        {/* 4. Mobile "THE LATEST" Section (Placed Below Complete Hero) */}
        <div className="mt-8 pt-5 border-t border-[#D8D1C5]">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#D8D1C5]">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#25221F]">
              The Latest
            </h3>
            <Link
              href="/latest"
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F]"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-[#D8D1C5]/60">
            {displayedLatest.map((story) => (
              <article key={story.id} className="py-3 group">
                <Link
                  href={`/stories/${story.slug}`}
                  className="flex items-center space-x-3.5"
                >
                  <div className="w-[72px] h-[78px] overflow-hidden bg-[#EFEAE0] flex-shrink-0">
                    <EditorialImage
                      media={story.featured_image}
                      src={story.featured_image?.storage_key}
                      alt={story.title}
                      fill
                      sizes="80px"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                      {getStoryKicker(story)}
                    </span>
                    <h4 className="font-serif-editorial text-[13px] sm:text-sm font-normal leading-[1.2] text-[#25221F] group-hover:text-[#A94F42] transition-colors line-clamp-2 mt-0.5">
                      {story.title}
                    </h4>
                    <span className="text-[8px] uppercase tracking-wider text-[#77716A] mt-1 block">
                      {formatEditorialDate(story.published_at)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
