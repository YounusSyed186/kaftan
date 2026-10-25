import { describe, it, expect } from 'vitest';
import type { ArticleRow, CompetitionRow, HomepageItemRow } from '@/types/models';

describe('Editorial Business Rules', () => {
  it('validates article publication eligibility', () => {
    const isArticleEligible = (article: Partial<ArticleRow>): boolean => {
      if (article.status !== 'published') return false;
      if (!article.published_at) return false;
      return new Date(article.published_at).getTime() <= Date.now();
    };

    const draftArticle: Partial<ArticleRow> = {
      status: 'draft',
      published_at: null,
    };
    expect(isArticleEligible(draftArticle)).toBe(false);

    const scheduledFutureArticle: Partial<ArticleRow> = {
      status: 'scheduled',
      published_at: new Date(Date.now() + 86400000).toISOString(),
    };
    expect(isArticleEligible(scheduledFutureArticle)).toBe(false);

    const publishedArticle: Partial<ArticleRow> = {
      status: 'published',
      published_at: new Date(Date.now() - 3600000).toISOString(),
    };
    expect(isArticleEligible(publishedArticle)).toBe(true);
  });

  it('validates slug format compliance', () => {
    const isValidSlug = (slug: string): boolean => {
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    };

    expect(isValidSlug('a-new-season-of-modern-elegance')).toBe(true);
    expect(isValidSlug('5-resortwear-trends-defining-summer-2026')).toBe(true);
    expect(isValidSlug('Invalid Slug With Spaces')).toBe(false);
    expect(isValidSlug('slug_with_underscores')).toBe(false);
    expect(isValidSlug('trailing-dash-')).toBe(false);
  });

  it('enforces single content reference rule on homepage items', () => {
    const isValidHomepageItem = (item: Partial<HomepageItemRow>): boolean => {
      const populated = [
        item.article_id,
        item.product_id,
        item.campaign_id,
        item.ad_creative_id,
      ].filter(Boolean);
      return populated.length === 1;
    };

    expect(
      isValidHomepageItem({
        article_id: '123',
        product_id: null,
        campaign_id: null,
        ad_creative_id: null,
      })
    ).toBe(true);

    // Invalid if multiple populated
    expect(
      isValidHomepageItem({
        article_id: '123',
        product_id: '456',
        campaign_id: null,
        ad_creative_id: null,
      })
    ).toBe(false);

    // Invalid if none populated
    expect(
      isValidHomepageItem({
        article_id: null,
        product_id: null,
        campaign_id: null,
        ad_creative_id: null,
      })
    ).toBe(false);
  });

  it('validates competition schedule eligibility', () => {
    const isCompetitionOpen = (comp: Partial<CompetitionRow>): boolean => {
      if (comp.status !== 'active') return false;
      const now = Date.now();
      const start = new Date(comp.start_time || '').getTime();
      const end = new Date(comp.end_time || '').getTime();
      return now >= start && now <= end;
    };

    const activeComp: Partial<CompetitionRow> = {
      status: 'active',
      start_time: '2026-10-01T00:00:00Z',
      end_time: '2026-12-31T23:59:59Z',
    };
    expect(isCompetitionOpen(activeComp)).toBe(true);

    const closedComp: Partial<CompetitionRow> = {
      status: 'closed',
      start_time: '2026-01-01T00:00:00Z',
      end_time: '2026-02-01T00:00:00Z',
    };
    expect(isCompetitionOpen(closedComp)).toBe(false);
  });
});
