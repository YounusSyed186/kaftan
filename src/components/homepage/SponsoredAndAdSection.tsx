'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import type { PopulatedArticle, PopulatedAdCreative } from '@/types/models';
import type { MediaReferenceOverride } from '@/types/content-overrides';

interface SponsoredAndAdSectionProps {
  sponsoredArticle: PopulatedArticle;
  adCreative: PopulatedAdCreative;
  sectionId?: string;
  isEditorMode?: boolean;
  sponsoredBadge?: string;
  sponsoredTitle?: string;
  sponsoredExcerpt?: string;
  sponsoredImage?: MediaReferenceOverride;
  sponsoredMobileImage?: MediaReferenceOverride;
  adSponsorName?: string;
  adHeadline?: string;
  adCopy?: string;
  adCtaLabel?: string;
  adDestinationUrl?: string;
  adDesktopImage?: MediaReferenceOverride;
  adMobileImage?: MediaReferenceOverride;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
}

function ArrowIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 inline-block ml-1 transition-transform group-hover:translate-x-0.5 shrink-0"
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

export function SponsoredAndAdSection({
  sponsoredArticle,
  adCreative,
  sectionId = 'sponsored_and_advertising',
  isEditorMode = false,
  sponsoredBadge = 'PARTNERSHIP',
  sponsoredTitle,
  sponsoredExcerpt,
  sponsoredImage,
  sponsoredMobileImage,
  adSponsorName,
  adHeadline,
  adCopy,
  adCtaLabel,
  adDestinationUrl,
  adDesktopImage,
  adMobileImage,
  forcedViewport,
  onCommitInlineText,
}: SponsoredAndAdSectionProps) {
  const effectiveSponsoredTitle = sponsoredTitle || sponsoredArticle.title;
  const effectiveSponsoredExcerpt = sponsoredExcerpt || sponsoredArticle.excerpt;
  const effectiveSponsoredImg = buildCloudinaryUrl(
    sponsoredImage?.storage_key ||
      sponsoredArticle.featured_image?.storage_key ||
      'kaftan/editorial/sponsored-resort-living',
    { width: 1200 }
  );

  const effectiveSponsoredMobileImg = buildCloudinaryUrl(
    sponsoredMobileImage?.storage_key ||
      sponsoredImage?.storage_key ||
      sponsoredArticle.featured_image?.storage_key ||
      'kaftan/editorial/sponsored-resort-living',
    { width: 800 }
  );

  const isSlot2Editorial = adCreative.campaign_id === 'editorial';
  const effectiveAdSponsor =
    isSlot2Editorial
      ? (adSponsorName || 'EDITORIAL STORY')
      : (adSponsorName || adCreative.headline || 'FASHION SPECTRUM');
  const effectiveAdHeadline =
    isSlot2Editorial
      ? (adCreative.headline || adHeadline || 'Editorial Feature')
      : (adHeadline || adCreative.headline || adCreative.copy || 'EFFORTLESS KAFTANS FOR EVERY OCCASION');
  const effectiveAdCopy =
    isSlot2Editorial
      ? (adCreative.copy || (adCopy !== undefined ? adCopy : ''))
      : (adCopy !== undefined
          ? adCopy
          : (adCreative.copy || 'Discover handcrafted Australian silk kaftans designed for resort elegance and effortless summer living.'));
  const effectiveAdUrl =
    isSlot2Editorial
      ? (adCreative.destination_url || (adDestinationUrl ?? '#'))
      : (adDestinationUrl ?? adCreative.destination_url ?? 'https://fashionspectrum.com.au/collection');
  const effectiveAdCtaLabel =
    isSlot2Editorial
      ? (adCtaLabel || 'Read Feature')
      : (adCtaLabel || 'Shop The Collection');
  const effectiveAdImg = buildCloudinaryUrl(
    isSlot2Editorial
      ? (adCreative.desktop_image?.storage_key || adDesktopImage?.storage_key || 'kaftan/editorial/ad-fashion-spectrum')
      : (adDesktopImage?.storage_key || adCreative.desktop_image?.storage_key || 'kaftan/editorial/ad-fashion-spectrum'),
    { width: 1200 }
  );

  const effectiveAdMobileImg = buildCloudinaryUrl(
    isSlot2Editorial
      ? (adCreative.mobile_image?.storage_key || adCreative.desktop_image?.storage_key || adMobileImage?.storage_key || 'kaftan/editorial/ad-fashion-spectrum')
      : (adMobileImage?.storage_key || adDesktopImage?.storage_key || adCreative.desktop_image?.storage_key || 'kaftan/editorial/ad-fashion-spectrum'),
    { width: 800 }
  );

  return (
    <section
      aria-label="Sponsored and Advertising"
      className="w-full bg-[#FAF8F5] border-b border-[#D8D1C5]/70 py-6 md:py-8 lg:py-10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* =========================================================================
            DESKTOP: 2-BLOCK ASYMMETRIC LAYOUT (>= md)
            Left (~43%): Sponsored Editorial (Image Left + Text Right)
            Right (~57%): Advertisement Panel (Beige Card: Copy Left + Image Right)
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'hidden' : (forcedViewport ? 'grid md:grid-cols-[4.3fr_5.7fr] gap-6 lg:gap-8 items-stretch' : 'hidden md:grid md:grid-cols-[4.3fr_5.7fr] gap-6 lg:gap-8 items-stretch')}>
          {/* =======================================================================
              LEFT BLOCK: SPONSORED EDITORIAL (SLOT 0)
              ======================================================================= */}
          <EditableElement
            sectionId={sectionId}
            elementId="slot_0"
            elementType="slot"
            label="Slot 1 (Sponsored Editorial)"
            className="flex-1"
          >
            <div className="flex flex-row items-stretch group h-full">
              {/* Portrait Image on Left */}
              <EditableElement
                sectionId={sectionId}
                elementId="sponsored_image"
                elementType="image"
                label="Sponsored Image"
                isOverridden={Boolean(sponsoredImage)}
                className="relative w-[45%] self-stretch min-h-[350px] overflow-hidden bg-[#EFEAE0] block shrink-0"
              >
                <Link
                  href={isEditorMode ? '#' : `/stories/${sponsoredArticle.slug}`}
                  className="block w-full h-full"
                >
                  <Image
                    src={effectiveSponsoredImg}
                    alt={effectiveSponsoredTitle}
                    fill
                    sizes="(max-width: 1280px) 22vw, 280px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                </Link>
              </EditableElement>

              {/* Editorial Copy on Right */}
              <div className="flex-1 flex flex-col justify-between pl-5 lg:pl-6 py-1">
                <div>
                  <EditableElement
                    sectionId={sectionId}
                    elementId="sponsored_badge"
                    elementType="text"
                    label="Sponsored Badge"
                    allowInlineEdit
                    inlineTextValue={sponsoredBadge}
                    onCommitInlineText={(val) => onCommitInlineText?.('sponsored_badge', val)}
                  >
                    <span className="inline-block text-[8px] font-semibold uppercase tracking-[0.22em] text-[#C06050] bg-[#FCECE8] px-2 py-0.5 rounded-2xs mb-2">
                      {sponsoredBadge}
                    </span>
                  </EditableElement>

                  <EditableElement
                    sectionId={sectionId}
                    elementId="sponsored_title"
                    elementType="heading"
                    label="Sponsored Headline"
                    isOverridden={Boolean(sponsoredTitle)}
                    allowInlineEdit
                    inlineTextValue={effectiveSponsoredTitle}
                    onCommitInlineText={(val) => onCommitInlineText?.('sponsored_title', val)}
                  >
                    <Link href={isEditorMode ? '#' : `/stories/${sponsoredArticle.slug}`} className="block">
                      <h3 className="font-serif-editorial text-[22px] lg:text-[24px] xl:text-[26px] leading-[1.1] text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors">
                        {effectiveSponsoredTitle}
                      </h3>
                    </Link>
                  </EditableElement>

                  <EditableElement
                    sectionId={sectionId}
                    elementId="sponsored_excerpt"
                    elementType="text"
                    label="Sponsored Excerpt"
                    isOverridden={Boolean(sponsoredExcerpt)}
                    allowInlineEdit
                    inlineTextValue={effectiveSponsoredExcerpt || ''}
                    onCommitInlineText={(val) => onCommitInlineText?.('sponsored_excerpt', val)}
                    className="mt-2.5"
                  >
                    <p className="text-[10px] lg:text-[10.5px] text-[#55504A] leading-[1.45] line-clamp-4 font-normal">
                      {effectiveSponsoredExcerpt}
                    </p>
                  </EditableElement>
                </div>

                <div className="pt-3">
                  <Link
                    href={isEditorMode ? '#' : `/stories/${sponsoredArticle.slug}`}
                    className="inline-flex items-center text-[8.5px] lg:text-[8.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F] group-hover:text-[#A94F42] transition-colors"
                  >
                    <span>Read Feature</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </EditableElement>

          {/* =======================================================================
              RIGHT BLOCK: ADVERTISEMENT PANEL (SLOT 1)
              ======================================================================= */}
          <EditableElement
            sectionId={sectionId}
            elementId="slot_1"
            elementType="slot"
            label="Slot 2 (Advertisement Panel)"
            className="flex-1"
          >
            <div className="bg-[#FAF8F5] border border-[#D8D1C5]/70 p-5 lg:p-6 flex flex-row items-stretch justify-between relative group shadow-2xs h-full">
              <span className="absolute top-2 right-3 text-[7.5px] uppercase tracking-[0.2em] text-[#88837C] font-mono pointer-events-none">
                {isSlot2Editorial ? 'EDITORIAL' : 'ADVERTISEMENT'}
              </span>

              {/* Left Copy Container */}
              <div className="flex-1 flex flex-col justify-between pr-4 lg:pr-6 py-1">
                <div>
                  <EditableElement
                    sectionId={sectionId}
                    elementId="ad_sponsor_name"
                    elementType="text"
                    label="Ad Sponsor"
                    allowInlineEdit
                    inlineTextValue={effectiveAdSponsor}
                    onCommitInlineText={(val) => onCommitInlineText?.('ad_sponsor_name', val)}
                  >
                    <span className="text-[8.5px] uppercase tracking-[0.24em] font-bold text-[#25221F] block mb-2 font-mono">
                      {effectiveAdSponsor}
                    </span>
                  </EditableElement>

                  <EditableElement
                    sectionId={sectionId}
                    elementId="ad_headline"
                    elementType="heading"
                    label="Ad Headline"
                    allowInlineEdit
                    inlineTextValue={effectiveAdHeadline}
                    onCommitInlineText={(val) => onCommitInlineText?.('ad_headline', val)}
                  >
                    <h4 className="font-serif-editorial text-[20px] lg:text-[23px] xl:text-[25px] leading-[1.12] text-[#25221F] font-normal tracking-[-0.01em]">
                      {effectiveAdHeadline}
                    </h4>
                  </EditableElement>

                  {effectiveAdCopy && (
                    <EditableElement
                      sectionId={sectionId}
                      elementId="ad_copy"
                      elementType="text"
                      label="Ad Description"
                      allowInlineEdit
                      inlineTextValue={effectiveAdCopy}
                      onCommitInlineText={(val) => onCommitInlineText?.('ad_copy', val)}
                      className="mt-2.5"
                    >
                      <p className="text-[10px] lg:text-[10.5px] text-[#605B54] leading-[1.45] line-clamp-3">
                        {effectiveAdCopy}
                      </p>
                    </EditableElement>
                  )}
                </div>

                <div className="pt-4">
                  <EditableElement
                    sectionId={sectionId}
                    elementId="ad_cta"
                    elementType="cta"
                    label="Ad CTA Button"
                  >
                    <a
                      href={isEditorMode ? '#' : effectiveAdUrl}
                      target={isEditorMode ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[8.5px] uppercase tracking-[0.18em] font-semibold text-[#25221F] border border-[#25221F] px-4 py-2 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
                    >
                      <span>{effectiveAdCtaLabel}</span>
                      <ArrowIcon />
                    </a>
                  </EditableElement>
                </div>
              </div>

              {/* Right Product Creative Image */}
              <EditableElement
                sectionId={sectionId}
                elementId="ad_desktop_image"
                elementType="image"
                label="Ad Creative Image"
                isOverridden={Boolean(adDesktopImage)}
                className="relative w-[36%] lg:w-[38%] min-h-[300px] overflow-hidden bg-[#EFEAE0] shrink-0"
              >
                <a
                  href={isEditorMode ? '#' : effectiveAdUrl}
                  target={isEditorMode ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <Image
                    src={effectiveAdImg}
                    alt={effectiveAdHeadline}
                    fill
                    sizes="(max-width: 1280px) 20vw, 240px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </a>
              </EditableElement>
            </div>
          </EditableElement>
        </div>

        {/* =========================================================================
            MOBILE LAYOUT (< md)
            Full mobile presentation of both the sponsored story and the advertisement
            with independent mobile creative images and editable element bindings.
            ========================================================================= */}
        <div className={forcedViewport === 'mobile' ? 'flex flex-col space-y-8' : (forcedViewport ? 'hidden' : 'md:hidden flex flex-col space-y-8')}>
          {/* Mobile Sponsored Story */}
          <EditableElement
            sectionId={sectionId}
            elementId="slot_0"
            elementType="slot"
            label="Slot 1 (Sponsored Editorial)"
          >
            <div className="flex flex-col space-y-3">
              <EditableElement
                sectionId={sectionId}
                elementId="sponsored_badge"
                elementType="text"
                label="Sponsored Badge"
                allowInlineEdit
                inlineTextValue={sponsoredBadge}
                onCommitInlineText={(val) => onCommitInlineText?.('sponsored_badge', val)}
              >
                <span className="inline-block text-[8px] font-semibold uppercase tracking-[0.22em] text-[#C06050] bg-[#FCECE8] px-2 py-0.5 rounded-2xs w-fit">
                  {sponsoredBadge}
                </span>
              </EditableElement>

              <EditableElement
                sectionId={sectionId}
                elementId="sponsored_title"
                elementType="heading"
                label="Sponsored Headline"
                isOverridden={Boolean(sponsoredTitle)}
                allowInlineEdit
                inlineTextValue={effectiveSponsoredTitle}
                onCommitInlineText={(val) => onCommitInlineText?.('sponsored_title', val)}
              >
                <h3 className="font-serif-editorial text-2xl text-[#25221F] font-normal leading-tight">
                  {effectiveSponsoredTitle}
                </h3>
              </EditableElement>

              <EditableElement
                sectionId={sectionId}
                elementId="sponsored_image"
                elementType="image"
                label="Sponsored Image (Mobile)"
                isOverridden={Boolean(sponsoredMobileImage || sponsoredImage)}
                className="relative w-full aspect-[4/3] bg-[#EFEAE0] overflow-hidden"
              >
                <Image
                  src={effectiveSponsoredMobileImg}
                  alt={effectiveSponsoredTitle}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </EditableElement>

              {effectiveSponsoredExcerpt && (
                <p className="text-xs text-[#55504A] leading-relaxed line-clamp-3">
                  {effectiveSponsoredExcerpt}
                </p>
              )}

              <div>
                <Link
                  href={isEditorMode ? '#' : `/stories/${sponsoredArticle.slug}`}
                  className="inline-flex items-center text-[8.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F]"
                >
                  <span>Read Story</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </EditableElement>

          {/* Mobile Advertisement Card */}
          <EditableElement
            sectionId={sectionId}
            elementId="slot_1"
            elementType="slot"
            label="Slot 2 (Advertisement Panel)"
          >
            <div className="p-5 bg-[#F4EFE6] border border-[#D8D1C5] flex flex-col space-y-3.5">
              <EditableElement
                sectionId={sectionId}
                elementId="ad_sponsor_name"
                elementType="text"
                label="Ad Sponsor"
                allowInlineEdit
                inlineTextValue={effectiveAdSponsor}
                onCommitInlineText={(val) => onCommitInlineText?.('ad_sponsor_name', val)}
              >
                <span className="text-[8.5px] uppercase tracking-[0.22em] font-bold text-[#25221F] block font-mono">
                  {effectiveAdSponsor}
                </span>
              </EditableElement>

              <EditableElement
                sectionId={sectionId}
                elementId="ad_headline"
                elementType="heading"
                label="Ad Headline"
                allowInlineEdit
                inlineTextValue={effectiveAdHeadline}
                onCommitInlineText={(val) => onCommitInlineText?.('ad_headline', val)}
              >
                <h4 className="font-serif-editorial text-xl leading-tight text-[#25221F] font-normal">
                  {effectiveAdHeadline}
                </h4>
              </EditableElement>

              <EditableElement
                sectionId={sectionId}
                elementId="ad_desktop_image"
                elementType="image"
                label="Ad Creative Image (Mobile)"
                isOverridden={Boolean(adMobileImage || adDesktopImage)}
                className="relative w-full aspect-[16/9] overflow-hidden bg-[#EFEAE0]"
              >
                <a
                  href={isEditorMode ? '#' : effectiveAdUrl}
                  target={isEditorMode ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <Image
                    src={effectiveAdMobileImg}
                    alt={effectiveAdHeadline}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </a>
              </EditableElement>

              {effectiveAdCopy && (
                <p className="text-xs text-[#605B54] leading-relaxed line-clamp-3">
                  {effectiveAdCopy}
                </p>
              )}

              <div>
                <a
                  href={isEditorMode ? '#' : effectiveAdUrl}
                  target={isEditorMode ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[8.5px] uppercase tracking-[0.18em] font-semibold text-[#25221F] border border-[#25221F] px-4 py-2 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
                >
                  <span>{effectiveAdCtaLabel}</span>
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </EditableElement>
        </div>
      </div>
    </section>
  );
}
