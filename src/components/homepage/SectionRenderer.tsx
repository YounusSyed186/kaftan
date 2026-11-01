import React from 'react';
import { HeroEditorialSection } from './HeroEditorialSection';
import { FeaturedEditorialGrid } from './FeaturedEditorialGrid';
import { SponsoredAndAdSection } from './SponsoredAndAdSection';
import { ClearanceSaleSection } from './ClearanceSaleSection';
import { CompetitionBanner } from './CompetitionBanner';
import { MoreStoriesSection } from './MoreStoriesSection';
import type {
  PopulatedHomepageSection,
  PopulatedArticle,
  PopulatedProduct,
  CompetitionRow,
} from '@/types/models';

interface SectionRendererProps {
  section: PopulatedHomepageSection;
  allArticles: PopulatedArticle[];
  activeCompetition: CompetitionRow | null;
}

export function SectionRenderer({
  section,
  allArticles,
  activeCompetition,
}: SectionRendererProps) {
  // Safe mapping based on section_key and layout_type
  switch (section.section_key) {
    case 'hero_editorial': {
      const sectionArticles = section.items
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
      const latestArticles = allArticles
        .filter((a) => a.id !== heroArticle.id)
        .slice(0, 4);
      return (
        <HeroEditorialSection
          heroArticle={heroArticle}
          heroArticles={heroArticles}
          latestArticles={latestArticles}
        />
      );
    }

    case 'featured_editorial_grid': {
      const articles = section.items
        .map((it) => it.article)
        .filter(Boolean) as PopulatedArticle[];
      const gridArticles = articles.length >= 4 ? articles : allArticles.slice(5, 9);
      return <FeaturedEditorialGrid articles={gridArticles} />;
    }

    case 'sponsored_and_advertising': {
      const sponsoredArticle =
        section.items.find((it) => it.article)?.article || allArticles[9];
      const adCreative =
        section.items.find((it) => it.ad_creative)?.ad_creative;

      if (!sponsoredArticle || !adCreative) return null;
      return (
        <SponsoredAndAdSection
          sponsoredArticle={sponsoredArticle}
          adCreative={adCreative}
        />
      );
    }

    case 'clearance_sale': {
      const products = section.items
        .map((it) => it.product)
        .filter(Boolean) as PopulatedProduct[];
      if (products.length === 0) return null;
      return <ClearanceSaleSection products={products} />;
    }

    case 'competition_banner': {
      if (!activeCompetition) return null;
      return <CompetitionBanner competition={activeCompetition} />;
    }

    case 'more_stories': {
      const moreStories =
        section.items.length > 0
          ? (section.items
              .map((it) => it.article)
              .filter(Boolean) as PopulatedArticle[])
          : allArticles.slice(10, 14);
      return <MoreStoriesSection articles={moreStories} />;
    }

    default:
      // Fallback for custom configured sections according to layout_type
      if (section.layout_type === 'product_grid') {
        const products = section.items
          .map((it) => it.product)
          .filter(Boolean) as PopulatedProduct[];
        return products.length > 0 ? (
          <ClearanceSaleSection products={products} />
        ) : null;
      }
      return null;
  }
}
