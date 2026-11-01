'use client';

import React from 'react';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import type { CompetitionRow } from '@/types/models';
import type { MediaReferenceOverride } from '@/types/content-overrides';

interface CompetitionBannerProps {
  competition: CompetitionRow;
  sectionId?: string;
  isEditorMode?: boolean;
  badgeText?: string;
  competitionTitle?: string;
  competitionDescription?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  bannerImage?: MediaReferenceOverride;
  mobileBannerImage?: MediaReferenceOverride;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
}

export function CompetitionBanner({
  competition,
  sectionId = 'competition_banner',
  isEditorMode = false,
  badgeText = 'WIN a Kaftan',
  competitionTitle,
  competitionDescription,
  ctaLabel = 'ENTER NOW',
  ctaUrl = '/competitions',
  bannerImage,
  mobileBannerImage,
  forcedViewport,
  onCommitInlineText,
}: CompetitionBannerProps) {
  const effectiveTitle = competitionTitle || competition.title;
  const effectiveDescription = competitionDescription || competition.description;
  const effectiveImg = buildCloudinaryUrl(
    bannerImage?.storage_key || 'kaftan/editorial/competition-strawhat-beach',
    { width: 1400 }
  );

  const effectiveMobileImg = buildCloudinaryUrl(
    mobileBannerImage?.storage_key ||
      bannerImage?.storage_key ||
      'kaftan/editorial/competition-strawhat-beach',
    { width: 800 }
  );

  const isMobile = forcedViewport === 'mobile';
  const displayImg = isMobile ? effectiveMobileImg : effectiveImg;
  const activeImageOverride = isMobile ? (mobileBannerImage || bannerImage) : bannerImage;

  return (
    <section
      aria-label="Fashion Competition"
      className="w-full bg-[#F7F4ED] py-6 sm:py-8 lg:py-10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className={`w-full border border-[#D8D1C5] bg-[#FCFAF6] overflow-hidden relative shadow-xs flex items-center ${forcedViewport === 'mobile' ? 'min-h-[280px]' : 'min-h-[290px] sm:min-h-[320px] lg:min-h-[350px]'}`}>
          {/* Background Photo with Gradient Fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 overflow-hidden pointer-events-none select-none z-0 ${forcedViewport === 'mobile' ? 'w-[55%]' : 'w-[60%] sm:w-[56%] lg:w-[58%]'}`}
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.7) 32%, black 50%, black 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.7) 32%, black 50%, black 100%)',
            }}
          >
            <EditableElement
              sectionId={sectionId}
              elementId={isMobile ? 'mobile_banner_image' : 'banner_image'}
              elementType="image"
              label={isMobile ? 'Mobile Banner Image' : 'Competition Banner Image'}
              isOverridden={Boolean(activeImageOverride)}
              className="w-full h-full"
            >
              <Image
                src={displayImg}
                alt={activeImageOverride?.alt_text || effectiveTitle}
                fill
                sizes="(max-width: 1024px) 70vw, 58vw"
                className="object-cover object-center pointer-events-auto"
                priority
              />
            </EditableElement>
          </div>

          {/* Soft overlay gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#FCFAF6] via-[#FCFAF6]/90 sm:via-[#FCFAF6]/70 to-transparent w-[65%] sm:w-[48%] pointer-events-none z-1"
            aria-hidden="true"
          />

          {/* Circular Badge */}
          <div className={`absolute z-2 ${forcedViewport === 'mobile' ? 'right-3 top-3' : 'right-[12%] sm:right-[15%] md:right-[16%] lg:right-[17%] top-[12%] sm:top-[14%]'}`}>
            <EditableElement
              sectionId={sectionId}
              elementId="badge_text"
              elementType="text"
              label="Badge Text"
              allowInlineEdit
              inlineTextValue={badgeText}
              onCommitInlineText={(val) => onCommitInlineText?.('badge_text', val)}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-full flex flex-col items-center justify-center text-center shadow-md select-none pointer-events-auto"
                style={{
                  background: 'linear-gradient(135deg, #A48356 0%, #7E6139 100%)',
                  boxShadow: '0 4px 14px rgba(126, 97, 57, 0.35)',
                }}
              >
                <span className="font-serif-editorial text-[13px] sm:text-[14px] lg:text-[15px] font-normal leading-tight text-[#FAF7F2] uppercase tracking-wider">
                  {badgeText.split(' ')[0]}
                </span>
                <span className="text-[7px] sm:text-[7.5px] lg:text-[8px] font-mono tracking-widest text-[#FAF7F2]/90 uppercase mt-0.5">
                  {badgeText.split(' ').slice(1).join(' ')}
                </span>
              </div>
            </EditableElement>
          </div>

          {/* Foreground Editorial Copy */}
          <div className={`relative z-10 w-full flex flex-col items-start ${forcedViewport === 'mobile' ? 'max-w-[320px] pl-4 pr-2 py-6' : 'max-w-[500px] lg:max-w-[560px] pl-6 sm:pl-8 lg:pl-12 pr-4 py-8 sm:py-10'}`}>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A756D] font-bold block mb-2 sm:mb-2.5">
              COMPETITION &mdash;
            </span>

            <EditableElement
              sectionId={sectionId}
              elementId="competition_title"
              elementType="heading"
              label="Competition Title"
              isOverridden={Boolean(competitionTitle)}
              allowInlineEdit
              inlineTextValue={effectiveTitle}
              onCommitInlineText={(val) => onCommitInlineText?.('competition_title', val)}
            >
              <h2 className="font-serif-editorial text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[1.05] text-[#25221F] font-normal tracking-[-0.01em]">
                {effectiveTitle}
              </h2>
            </EditableElement>

            <EditableElement
              sectionId={sectionId}
              elementId="competition_description"
              elementType="text"
              label="Competition Description"
              isOverridden={Boolean(competitionDescription)}
              allowInlineEdit
              inlineTextValue={effectiveDescription || ''}
              onCommitInlineText={(val) => onCommitInlineText?.('competition_description', val)}
              className="mt-3 sm:mt-3.5"
            >
              <p className="text-[11px] sm:text-xs text-[#524E48] leading-[1.5] max-w-[420px] font-normal">
                {effectiveDescription}
              </p>
            </EditableElement>

            <div className="mt-5 sm:mt-6">
              <EditableElement
                sectionId={sectionId}
                elementId="competition_cta"
                elementType="cta"
                label="Competition CTA"
              >
                <a
                  href={isEditorMode ? '#' : ctaUrl}
                  className="inline-flex items-center text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#25221F] border border-[#25221F] px-4 sm:px-5 py-2 sm:py-2.5 bg-transparent hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
                >
                  <span>{ctaLabel}</span>
                  <span className="ml-2 font-mono">&rarr;</span>
                </a>
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
