'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import { resolveItemData, type ItemContentOverrides } from '@/types/content-overrides';
import type { PopulatedArticle, PopulatedHomepageItem } from '@/types/models';

interface FeaturedEditorialGridProps {
  articles: PopulatedArticle[];
  items?: PopulatedHomepageItem[];
  sectionId?: string;
  isEditorMode?: boolean;
  heading?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  itemOverrides?: Record<string, ItemContentOverrides>;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
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

export function FeaturedEditorialGrid({
  articles,
  items = [],
  sectionId = 'featured_editorial_grid',
  isEditorMode = false,
  heading = 'Featured Stories',
  subtitle,
  viewAllLabel = 'View All',
  viewAllUrl = '/latest',
  itemOverrides,
  forcedViewport,
  onCommitInlineText,
}: FeaturedEditorialGridProps) {
  const storyLeft = articles[0];
  const storyCenterTop = articles[1];
  const storyCenterBottom = articles[2];
  const storyRight = articles[3];

  if (!storyLeft || !storyCenterTop || !storyCenterBottom || !storyRight) {
    return null;
  }

  const effectiveHeading = heading || 'Featured Stories';
  const effectiveViewAllLabel = viewAllLabel || 'View All';
  const effectiveViewAllUrl = viewAllUrl || '/latest';

  // Resolve items using override architecture
  const dataLeft = resolveItemData(storyLeft, itemOverrides?.[items[0]?.id]);
  const dataCenterTop = resolveItemData(storyCenterTop, itemOverrides?.[items[1]?.id]);
  const dataCenterBottom = resolveItemData(storyCenterBottom, itemOverrides?.[items[2]?.id]);
  const dataRight = resolveItemData(storyRight, itemOverrides?.[items[3]?.id]);

  const leftImg = buildCloudinaryUrl(
    dataLeft.imageStorageKey || 'kaftan/editorial/redefining-fashion',
    { width: 1200 }
  );
  const centerTopImg = buildCloudinaryUrl(
    dataCenterTop.imageStorageKey || 'kaftan/editorial/effortless-dressing',
    { width: 800 }
  );
  const centerBottomImg = buildCloudinaryUrl(
    dataCenterBottom.imageStorageKey || 'kaftan/editorial/next-getaway',
    { width: 800 }
  );
  const rightImg = buildCloudinaryUrl(
    dataRight.imageStorageKey || 'kaftan/editorial/warm-days-bolder-looks',
    { width: 1200 }
  );

  const mobileLeftImg = buildCloudinaryUrl(
    dataLeft.mobileImageStorageKey || dataLeft.imageStorageKey || 'kaftan/editorial/redefining-fashion',
    { width: 800 }
  );
  const mobileCenterTopImg = buildCloudinaryUrl(
    dataCenterTop.mobileImageStorageKey || dataCenterTop.imageStorageKey || 'kaftan/editorial/effortless-dressing',
    { width: 600 }
  );
  const mobileCenterBottomImg = buildCloudinaryUrl(
    dataCenterBottom.mobileImageStorageKey || dataCenterBottom.imageStorageKey || 'kaftan/editorial/next-getaway',
    { width: 600 }
  );
  const mobileRightImg = buildCloudinaryUrl(
    dataRight.mobileImageStorageKey || dataRight.imageStorageKey || 'kaftan/editorial/warm-days-bolder-looks',
    { width: 800 }
  );

  return (
    <section
      aria-label="Featured Editorial Stories"
      className="w-full bg-[#FAF8F5] border-y border-[#D8D1C5]/70 py-6 md:py-8 lg:py-10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Editorial Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#D8D1C5]/60">
          <EditableElement
            sectionId={sectionId}
            elementId="heading"
            elementType="heading"
            label="Section Heading"
            allowInlineEdit
            inlineTextValue={effectiveHeading}
            onCommitInlineText={(val) => onCommitInlineText?.('heading', val)}
          >
            <h3 className="font-serif-editorial text-lg md:text-xl text-[#25221F] font-normal">
              {effectiveHeading}
            </h3>
          </EditableElement>

          <EditableElement
            sectionId={sectionId}
            elementId="view_all_label"
            elementType="link"
            label="View All Link"
          >
            <Link
              href={isEditorMode ? '#' : effectiveViewAllUrl}
              className="text-[9px] font-mono uppercase tracking-widest text-[#77716A] hover:text-[#25221F] transition-colors"
            >
              {effectiveViewAllLabel} &rarr;
            </Link>
          </EditableElement>
        </div>

        {/* =========================================================================
            DESKTOP: 3 ASYMMETRIC COLUMNS WITH 2 VERTICAL DIVIDERS (>= md)
            Column 1 (~40%): Split (Tall Image on Left + Editorial Text on Right)
            Column 2 (~32%): 2 Stacked Rows without divider (Text Left + Thumbnail Right)
            Column 3 (~28%): Stacked (Image on Top + Editorial Text on Bottom)
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'hidden' : (forcedViewport ? 'grid md:grid-cols-[4fr_3.1fr_2.9fr] divide-x divide-[#D8D1C5]/70 items-stretch' : 'hidden md:grid md:grid-cols-[4fr_3.1fr_2.9fr] divide-x divide-[#D8D1C5]/70 items-stretch')}>
          {/* -----------------------------------------------------------------------
              COLUMN 1: FEATURED STORY
              Split: Tall flush portrait image on left, text block on right.
              ----------------------------------------------------------------------- */}
          <div className="flex flex-row items-stretch pr-6 lg:pr-8 group">
            <EditableElement
              sectionId={sectionId}
              elementId="slot_0_image"
              elementType="image"
              label="Slot 1 Image"
              isOverridden={dataLeft.isImageOverridden}
              className="relative w-[50%] self-stretch min-h-[380px] lg:min-h-[420px] overflow-hidden bg-[#EFEAE0] block shrink-0"
            >
              <Link
                href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`}
                className="block w-full h-full"
              >
                <Image
                  src={leftImg}
                  alt={dataLeft.imageAlt || dataLeft.title}
                  fill
                  sizes="(max-width: 1280px) 22vw, 280px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>
            </EditableElement>

            <div className="flex-1 flex flex-col justify-between pl-5 lg:pl-6 py-1">
              <div>
                <span className="text-[7.5px] lg:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  {dataLeft.kicker}
                </span>

                <EditableElement
                  sectionId={sectionId}
                  elementId="slot_0_title"
                  elementType="heading"
                  label="Slot 1 Headline"
                  isOverridden={dataLeft.isTitleOverridden}
                  allowInlineEdit
                  inlineTextValue={dataLeft.title}
                  onCommitInlineText={(val) => {
                    const itemId = items[0]?.id;
                    if (itemId) onCommitInlineText?.(`item_title_${itemId}`, val);
                  }}
                  className="mt-2"
                >
                  <Link href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`} className="block">
                    <h3 className="font-serif-editorial text-[22px] lg:text-[25px] xl:text-[27px] leading-[1.08] text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors">
                      {dataLeft.title}
                    </h3>
                  </Link>
                </EditableElement>

                <p className="text-[10px] lg:text-[10.5px] xl:text-[11px] text-[#55504A] leading-[1.45] mt-3 line-clamp-4 font-normal">
                  {dataLeft.excerpt}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`}
                  className="inline-flex items-center text-[8px] lg:text-[8.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F] group-hover:text-[#A94F42] transition-colors"
                >
                  <span>{dataLeft.ctaLabel}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              COLUMN 2: 2 STACKED STORIES
              Divided from the center: 50% Text Left + 50% Portrait Image Right
              ----------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between px-6 lg:px-8 divide-y divide-[#D8D1C5]/70">
            {/* Row 1 */}
            <article className="flex-1 flex flex-row items-stretch gap-4 lg:gap-5 pb-5 group">
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span className="text-[7.5px] lg:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                    {dataCenterTop.kicker}
                  </span>
                  <EditableElement
                    sectionId={sectionId}
                    elementId="slot_1_title"
                    elementType="heading"
                    label="Slot 2 Headline"
                    isOverridden={dataCenterTop.isTitleOverridden}
                    allowInlineEdit
                    inlineTextValue={dataCenterTop.title}
                    onCommitInlineText={(val) => {
                      const itemId = items[1]?.id;
                      if (itemId) onCommitInlineText?.(`item_title_${itemId}`, val);
                    }}
                  >
                    <Link href={isEditorMode ? '#' : `/stories/${storyCenterTop.slug}`} className="block mt-1.5">
                      <h3 className="font-serif-editorial text-[17px] lg:text-[19px] xl:text-[21px] leading-[1.12] text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors line-clamp-3">
                        {dataCenterTop.title}
                      </h3>
                    </Link>
                  </EditableElement>
                  {dataCenterTop.excerpt && (
                    <p className="text-[10px] lg:text-[10.5px] text-[#55504A] leading-[1.42] mt-2 line-clamp-2 font-normal">
                      {dataCenterTop.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={isEditorMode ? '#' : `/stories/${storyCenterTop.slug}`}
                    className="inline-flex items-center text-[7.5px] lg:text-[8px] uppercase tracking-[0.2em] font-semibold text-[#25221F] group-hover:text-[#A94F42] transition-colors"
                  >
                    <span>{dataCenterTop.ctaLabel || 'EXPLORE MORE'}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <EditableElement
                sectionId={sectionId}
                elementId="slot_1_image"
                elementType="image"
                label="Slot 2 Image"
                isOverridden={dataCenterTop.isImageOverridden}
                className="relative w-[48%] self-stretch min-h-[175px] overflow-hidden bg-[#EFEAE0] shrink-0"
              >
                <Link href={isEditorMode ? '#' : `/stories/${storyCenterTop.slug}`} className="block w-full h-full">
                  <Image
                    src={centerTopImg}
                    alt={dataCenterTop.imageAlt || dataCenterTop.title}
                    fill
                    sizes="(max-width: 1280px) 16vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </Link>
              </EditableElement>
            </article>

            {/* Row 2 */}
            <article className="flex-1 flex flex-row items-stretch gap-4 lg:gap-5 pt-5 group">
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span className="text-[7.5px] lg:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                    {dataCenterBottom.kicker}
                  </span>
                  <EditableElement
                    sectionId={sectionId}
                    elementId="slot_2_title"
                    elementType="heading"
                    label="Slot 3 Headline"
                    isOverridden={dataCenterBottom.isTitleOverridden}
                    allowInlineEdit
                    inlineTextValue={dataCenterBottom.title}
                    onCommitInlineText={(val) => {
                      const itemId = items[2]?.id;
                      if (itemId) onCommitInlineText?.(`item_title_${itemId}`, val);
                    }}
                  >
                    <Link href={isEditorMode ? '#' : `/stories/${storyCenterBottom.slug}`} className="block mt-1.5">
                      <h3 className="font-serif-editorial text-[17px] lg:text-[19px] xl:text-[21px] leading-[1.12] text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors line-clamp-3">
                        {dataCenterBottom.title}
                      </h3>
                    </Link>
                  </EditableElement>
                  {dataCenterBottom.excerpt && (
                    <p className="text-[10px] lg:text-[10.5px] text-[#55504A] leading-[1.42] mt-2 line-clamp-2 font-normal">
                      {dataCenterBottom.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={isEditorMode ? '#' : `/stories/${storyCenterBottom.slug}`}
                    className="inline-flex items-center text-[7.5px] lg:text-[8px] uppercase tracking-[0.2em] font-semibold text-[#25221F] group-hover:text-[#A94F42] transition-colors"
                  >
                    <span>{dataCenterBottom.ctaLabel || 'DISCOVER MORE'}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <EditableElement
                sectionId={sectionId}
                elementId="slot_2_image"
                elementType="image"
                label="Slot 3 Image"
                isOverridden={dataCenterBottom.isImageOverridden}
                className="relative w-[48%] self-stretch min-h-[175px] overflow-hidden bg-[#EFEAE0] shrink-0"
              >
                <Link href={isEditorMode ? '#' : `/stories/${storyCenterBottom.slug}`} className="block w-full h-full">
                  <Image
                    src={centerBottomImg}
                    alt={dataCenterBottom.imageAlt || dataCenterBottom.title}
                    fill
                    sizes="(max-width: 1280px) 16vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </Link>
              </EditableElement>
            </article>
          </div>

          {/* -----------------------------------------------------------------------
              COLUMN 3: STACKED (Image on Top + Text Below)
              ----------------------------------------------------------------------- */}
          <div className="flex flex-col pl-6 lg:pl-8 group">
            <EditableElement
              sectionId={sectionId}
              elementId="slot_3_image"
              elementType="image"
              label="Slot 4 Image"
              isOverridden={dataRight.isImageOverridden}
              className="relative w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0] block"
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyRight.slug}`} className="block w-full h-full">
                <Image
                  src={rightImg}
                  alt={dataRight.imageAlt || dataRight.title}
                  fill
                  sizes="(max-width: 1280px) 25vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </Link>
            </EditableElement>

            <div className="pt-4 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[7.5px] lg:text-[8px] font-semibold uppercase tracking-[0.22em] text-[#77716A] block">
                  {dataRight.kicker}
                </span>

                <EditableElement
                  sectionId={sectionId}
                  elementId="slot_3_title"
                  elementType="heading"
                  label="Slot 4 Headline"
                  isOverridden={dataRight.isTitleOverridden}
                  allowInlineEdit
                  inlineTextValue={dataRight.title}
                  className="mt-1"
                >
                  <Link href={isEditorMode ? '#' : `/stories/${storyRight.slug}`} className="block">
                    <h3 className="font-serif-editorial text-[20px] lg:text-[22px] leading-[1.12] text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors">
                      {dataRight.title}
                    </h3>
                  </Link>
                </EditableElement>

                <p className="text-[10px] lg:text-[10.5px] xl:text-[11px] text-[#55504A] leading-[1.42] mt-2 line-clamp-2 font-normal">
                  {dataRight.excerpt}
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href={isEditorMode ? '#' : `/stories/${storyRight.slug}`}
                  className="inline-flex items-center text-[8px] lg:text-[8.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F] group-hover:text-[#A94F42] transition-colors"
                >
                  <span>{dataRight.ctaLabel}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE LAYOUT (< md)
            Full mobile editorial sequence showing all 4 featured stories with
            independent mobile card images and clickable editable targets.
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'flex flex-col space-y-6' : (forcedViewport ? 'hidden' : 'md:hidden flex flex-col space-y-6')}>
          {/* Mobile Story 1: Lead Feature */}
          <article className="flex flex-row items-stretch gap-4 group">
            <EditableElement
              sectionId={sectionId}
              elementId="slot_0_image"
              elementType="image"
              label="Slot 1 Image (Mobile)"
              isOverridden={dataLeft.isMobileImageOverridden || dataLeft.isImageOverridden}
              className="relative w-[42%] aspect-[3/4] overflow-hidden bg-[#EFEAE0] shrink-0"
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`} className="block w-full h-full">
                <Image
                  src={mobileLeftImg}
                  alt={dataLeft.mobileImageAlt || dataLeft.imageAlt || dataLeft.title}
                  fill
                  sizes="42vw"
                  className="object-cover object-center"
                />
              </Link>
            </EditableElement>

            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <span className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                  {dataLeft.kicker}
                </span>
                <EditableElement
                  sectionId={sectionId}
                  elementId="slot_0_title"
                  elementType="heading"
                  label="Slot 1 Headline"
                  isOverridden={dataLeft.isTitleOverridden}
                  allowInlineEdit
                  inlineTextValue={dataLeft.title}
                  onCommitInlineText={(val) => {
                    const itemId = items[0]?.id;
                    if (itemId) onCommitInlineText?.(`item_title_${itemId}`, val);
                  }}
                >
                  <Link href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`} className="block mt-1">
                    <h3 className="font-serif-editorial text-lg leading-tight text-[#25221F] font-normal">
                      {dataLeft.title}
                    </h3>
                  </Link>
                </EditableElement>
                <p className="text-[10px] text-[#55504A] leading-[1.4] mt-1.5 line-clamp-2">
                  {dataLeft.excerpt}
                </p>
              </div>
              <Link
                href={isEditorMode ? '#' : `/stories/${storyLeft.slug}`}
                className="text-[7.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F] inline-flex items-center gap-1 mt-2"
              >
                <span>{dataLeft.ctaLabel}</span>
                <ArrowIcon />
              </Link>
            </div>
          </article>

          {/* Mobile Story 2 */}
          <article className="flex flex-row items-center justify-between gap-4 pt-4 border-t border-[#D8D1C5]/60 group">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-[#77716A] block">
                {dataCenterTop.kicker}
              </span>
              <EditableElement
                sectionId={sectionId}
                elementId="slot_1_title"
                elementType="heading"
                label="Slot 2 Headline"
                isOverridden={dataCenterTop.isTitleOverridden}
                allowInlineEdit
                inlineTextValue={dataCenterTop.title}
              >
                <Link href={isEditorMode ? '#' : `/stories/${storyCenterTop.slug}`} className="block mt-1">
                  <h4 className="font-serif-editorial text-[15px] leading-snug text-[#25221F] font-normal line-clamp-2">
                    {dataCenterTop.title}
                  </h4>
                </Link>
              </EditableElement>
            </div>
            <EditableElement
              sectionId={sectionId}
              elementId="slot_1_image"
              elementType="image"
              label="Slot 2 Image (Mobile)"
              isOverridden={dataCenterTop.isMobileImageOverridden || dataCenterTop.isImageOverridden}
              className="relative w-[90px] aspect-[4/3] overflow-hidden bg-[#EFEAE0] shrink-0"
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyCenterTop.slug}`} className="block w-full h-full">
                <Image
                  src={mobileCenterTopImg}
                  alt={dataCenterTop.mobileImageAlt || dataCenterTop.imageAlt || dataCenterTop.title}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </Link>
            </EditableElement>
          </article>

          {/* Mobile Story 3 */}
          <article className="flex flex-row items-center justify-between gap-4 pt-4 border-t border-[#D8D1C5]/60 group">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-[#77716A] block">
                {dataCenterBottom.kicker}
              </span>
              <EditableElement
                sectionId={sectionId}
                elementId="slot_2_title"
                elementType="heading"
                label="Slot 3 Headline"
                isOverridden={dataCenterBottom.isTitleOverridden}
                allowInlineEdit
                inlineTextValue={dataCenterBottom.title}
              >
                <Link href={isEditorMode ? '#' : `/stories/${storyCenterBottom.slug}`} className="block mt-1">
                  <h4 className="font-serif-editorial text-[15px] leading-snug text-[#25221F] font-normal line-clamp-2">
                    {dataCenterBottom.title}
                  </h4>
                </Link>
              </EditableElement>
            </div>
            <EditableElement
              sectionId={sectionId}
              elementId="slot_2_image"
              elementType="image"
              label="Slot 3 Image (Mobile)"
              isOverridden={dataCenterBottom.isMobileImageOverridden || dataCenterBottom.isImageOverridden}
              className="relative w-[90px] aspect-[4/3] overflow-hidden bg-[#EFEAE0] shrink-0"
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyCenterBottom.slug}`} className="block w-full h-full">
                <Image
                  src={mobileCenterBottomImg}
                  alt={dataCenterBottom.mobileImageAlt || dataCenterBottom.imageAlt || dataCenterBottom.title}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </Link>
            </EditableElement>
          </article>

          {/* Mobile Story 4 */}
          <article className="pt-4 border-t border-[#D8D1C5]/60 group">
            <EditableElement
              sectionId={sectionId}
              elementId="slot_3_image"
              elementType="image"
              label="Slot 4 Image (Mobile)"
              isOverridden={dataRight.isMobileImageOverridden || dataRight.isImageOverridden}
              className="relative w-full aspect-[16/9] overflow-hidden bg-[#EFEAE0] block mb-2.5"
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyRight.slug}`} className="block w-full h-full">
                <Image
                  src={mobileRightImg}
                  alt={dataRight.mobileImageAlt || dataRight.imageAlt || dataRight.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </Link>
            </EditableElement>
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-[#77716A] block">
              {dataRight.kicker}
            </span>
            <EditableElement
              sectionId={sectionId}
              elementId="slot_3_title"
              elementType="heading"
              label="Slot 4 Headline"
              isOverridden={dataRight.isTitleOverridden}
              allowInlineEdit
              inlineTextValue={dataRight.title}
            >
              <Link href={isEditorMode ? '#' : `/stories/${storyRight.slug}`} className="block mt-1">
                <h4 className="font-serif-editorial text-[17px] leading-tight text-[#25221F] font-normal">
                  {dataRight.title}
                </h4>
              </Link>
            </EditableElement>
          </article>
        </div>
      </div>
    </section>
  );
}
