'use client';

import React from 'react';
import { HeroEditorialSection } from './HeroEditorialSection';
import { FeaturedEditorialGrid } from './FeaturedEditorialGrid';
import { SponsoredAndAdSection } from './SponsoredAndAdSection';
import { ClearanceSaleSection } from './ClearanceSaleSection';
import { CompetitionBanner } from './CompetitionBanner';
import { MoreStoriesSection } from './MoreStoriesSection';
import { FALLBACK_AD_CREATIVE } from '@/lib/supabase/fallback-data';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import { StudioModeProvider } from '@/components/admin/homepage-studio/StudioModeContext';
import type {
  PopulatedHomepageSection,
  PopulatedArticle,
  PopulatedProduct,
  PopulatedAdCreative,
  CompetitionRow,
} from '@/types/models';
import { EyeOff, Edit3 } from 'lucide-react';

export interface SectionRendererProps {
  section: PopulatedHomepageSection;
  allArticles: PopulatedArticle[];
  activeCompetition: CompetitionRow | null;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onSelect?: (sectionId: string) => void;
}

export function SectionRenderer({
  section,
  allArticles,
  activeCompetition,
  isEditorMode = false,
  isSelected = false,
  onSelect,
}: SectionRendererProps) {
  // If not in editor mode and section is disabled, do not render on live site
  if (!section.is_active && !isEditorMode) {
    return null;
  }

  const setSectionFieldOverride = useHomepageStudioStore(
    (state) => state.setSectionFieldOverride
  );
  const setItemOverride = useHomepageStudioStore(
    (state) => state.setItemOverride
  );
  const viewport = useHomepageStudioStore((state) => state.viewport);
  const forcedViewport = isEditorMode ? viewport : undefined;

  const settings =
    typeof section.settings === 'object' &&
    section.settings !== null &&
    !Array.isArray(section.settings)
      ? (section.settings as Record<string, any>)
      : {};

  const renderContent = () => {
    switch (section.section_key) {
      case 'hero_editorial': {
        const sectionArticles = (section.items || [])
          .map((it) => it.article)
          .filter(Boolean) as PopulatedArticle[];
        const heroArticle = sectionArticles[0] || allArticles[0];
        if (!heroArticle) return null;
        const heroArticles =
          sectionArticles.length > 1
            ? sectionArticles
            : allArticles.length >= 4
            ? allArticles.slice(0, 4)
            : [heroArticle];

        const defaultLatest = allArticles
          .filter((a) => a.id !== heroArticle.id)
          .slice(0, 4);

        const latestIds: (string | undefined)[] = Array.isArray(settings.latest_article_ids)
          ? settings.latest_article_ids
          : [];

        const latestArticles: PopulatedArticle[] = [0, 1, 2, 3].map((idx) => {
          const customId = latestIds[idx];
          if (customId) {
            const found = allArticles.find((a) => a.id === customId);
            if (found) return found;
          }
          return defaultLatest[idx] || allArticles[idx] || heroArticle;
        });

        return (
          <HeroEditorialSection
            heroArticle={heroArticle}
            heroArticles={heroArticles}
            latestArticles={latestArticles}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            desktopHeroImage={settings.desktop_hero_image}
            mobileHeroImage={settings.mobile_hero_image}
            eyebrow={settings.eyebrow}
            headingOverride={settings.heading_override}
            descriptionOverride={settings.description_override}
            ctaLabel={settings.cta_label}
            ctaUrl={settings.cta_url}
            latestTitleOverrides={settings.latest_title_overrides}
            onCommitInlineText={(field, val) => {
              if (field.startsWith('latest_title_')) {
                const idx = field.replace('latest_title_', '');
                const currentTitles = { ...(settings.latest_title_overrides || {}) };
                currentTitles[idx] = val;
                setSectionFieldOverride?.(section.id, 'latest_title_overrides', currentTitles);
              } else {
                setSectionFieldOverride?.(section.id, field, val);
              }
            }}
          />
        );
      }

      case 'featured_editorial_grid': {
        const articles = (section.items || [])
          .map((it) => it.article)
          .filter(Boolean) as PopulatedArticle[];
        const gridArticles = articles.length >= 4 ? articles : allArticles.slice(5, 9);
        return (
          <FeaturedEditorialGrid
            articles={gridArticles}
            items={section.items}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            heading={settings.heading || section.title || 'Featured Stories'}
            subtitle={settings.subtitle}
            viewAllLabel={settings.view_all_label || 'View All'}
            viewAllUrl={settings.view_all_url || '/latest'}
            itemOverrides={settings.item_overrides}
            onCommitInlineText={(field, val) => {
              if (field.startsWith('item_title_')) {
                const itemId = field.replace('item_title_', '');
                setItemOverride?.(section.id, itemId, 'title', val);
              } else {
                setSectionFieldOverride?.(section.id, field, val);
              }
            }}
          />
        );
      }

      case 'sponsored_and_advertising': {
        const slot1Item = section.items?.[0];
        const sponsoredArticle =
          slot1Item?.article ||
          section.items?.find((it) => it.article)?.article ||
          allArticles[9];

        const slot2Item = section.items?.[1];
        const slot2Article = slot2Item?.article;
        const slot2AdCreative = slot2Item?.ad_creative;

        // If slot 2 was assigned an article in the visual editor, adapt it into adCreative format for the second card!
        const adCreative: PopulatedAdCreative = slot2Article
          ? {
              id: slot2Article.id,
              campaign_id: 'editorial',
              ad_placement_id: 'mid_split',
              headline: slot2Article.title,
              copy: slot2Article.excerpt || '',
              destination_url: `/stories/${slot2Article.slug}`,
              desktop_image_id: slot2Article.featured_image_id || 'img-default',
              mobile_image_id: null,
              desktop_image: slot2Article.featured_image,
              mobile_image: slot2Article.featured_image,
              start_date: '',
              end_date: '',
              status: 'active' as const,
              created_at: '',
              updated_at: '',
            }
          : slot2AdCreative ||
            section.items?.find((it) => it.ad_creative)?.ad_creative ||
            FALLBACK_AD_CREATIVE;

        if (!sponsoredArticle) return null;

        return (
          <SponsoredAndAdSection
            sponsoredArticle={sponsoredArticle}
            adCreative={adCreative}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            sponsoredBadge={settings.sponsored_badge}
            sponsoredTitle={settings.sponsored_title}
            sponsoredExcerpt={settings.sponsored_excerpt}
            sponsoredImage={settings.sponsored_image}
            sponsoredMobileImage={settings.sponsored_mobile_image}
            adSponsorName={settings.ad_sponsor_name}
            adHeadline={settings.ad_headline}
            adCopy={settings.ad_copy}
            adCtaLabel={settings.ad_cta_label}
            adDestinationUrl={settings.ad_destination_url}
            adDesktopImage={settings.ad_desktop_image}
            adMobileImage={settings.ad_mobile_image}
            onCommitInlineText={(field, val) =>
              setSectionFieldOverride?.(section.id, field, val)
            }
          />
        );
      }

      case 'clearance_sale': {
        const products = (section.items || [])
          .map((it) => it.product)
          .filter(Boolean) as PopulatedProduct[];
        return products.length > 0 ? (
          <ClearanceSaleSection
            products={products}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            clearanceTitle={settings.clearance_title}
            clearanceSubtitle={settings.clearance_subtitle}
            clearanceViewAllLabel={settings.clearance_view_all_label}
            clearanceViewAllUrl={settings.clearance_view_all_url}
            onCommitInlineText={(field, val) =>
              setSectionFieldOverride?.(section.id, field, val)
            }
          />
        ) : null;
      }

      case 'competition_banner': {
        if (!activeCompetition) return null;
        return (
          <CompetitionBanner
            competition={activeCompetition}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            badgeText={settings.badge_text}
            competitionTitle={settings.competition_title}
            competitionDescription={settings.competition_description}
            ctaLabel={settings.cta_label}
            ctaUrl={settings.cta_url}
            bannerImage={settings.banner_image}
            mobileBannerImage={settings.mobile_banner_image}
            onCommitInlineText={(field, val) =>
              setSectionFieldOverride?.(section.id, field, val)
            }
          />
        );
      }

      case 'more_stories': {
        const moreStories =
          section.items && section.items.length > 0
            ? (section.items
                .map((it) => it.article)
                .filter(Boolean) as PopulatedArticle[])
            : allArticles.slice(10, 14);
        return (
          <MoreStoriesSection
            articles={moreStories}
            items={section.items}
            sectionId={section.id}
            isEditorMode={isEditorMode}
            forcedViewport={forcedViewport}
            moreStoriesTitle={settings.more_stories_title}
            moreStoriesViewAllLabel={settings.more_stories_view_all_label}
            moreStoriesViewAllUrl={settings.more_stories_view_all_url}
            itemOverrides={settings.item_overrides}
            onCommitInlineText={(field, val) =>
              setSectionFieldOverride?.(section.id, field, val)
            }
          />
        );
      }

      default:
        if (section.layout_type === 'product_grid') {
          const products = (section.items || [])
            .map((it) => it.product)
            .filter(Boolean) as PopulatedProduct[];
          return products.length > 0 ? (
            <ClearanceSaleSection
              products={products}
              sectionId={section.id}
              isEditorMode={isEditorMode}
            />
          ) : null;
        }
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  if (!isEditorMode) {
    return (
      <StudioModeProvider isEditorMode={false}>
        {content}
      </StudioModeProvider>
    );
  }

  return (
    <StudioModeProvider isEditorMode={true}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(section.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelect?.(section.id);
          }
        }}
        className={`relative group cursor-pointer transition-all ${
          isSelected
            ? 'ring-2 ring-[#A94F42] shadow-sm z-30'
            : 'hover:ring-1 hover:ring-[#A94F42]/60'
        } ${!section.is_active ? 'opacity-50 grayscale-25' : ''}`}
      >
        {/* Editorial Studio Hover / Selected Badge */}
        <div
          className={`absolute top-2 left-4 z-40 flex items-center gap-2 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-xs pointer-events-none transition-opacity ${
            isSelected
              ? 'bg-[#A94F42] text-white opacity-100 shadow-sm'
              : 'bg-[#25221F] text-[#F7F4ED] opacity-0 group-hover:opacity-90'
          }`}
        >
          <Edit3 className="w-3 h-3" />
          <span>{section.name || section.section_key}</span>
          {!section.is_active && (
            <span className="flex items-center gap-1 text-amber-300 ml-1 border-l border-white/20 pl-1.5">
              <EyeOff className="w-2.5 h-2.5" />
              <span>Hidden</span>
            </span>
          )}
        </div>

        {content}
      </div>
    </StudioModeProvider>
  );
}
