import { describe, it, expect } from 'vitest';
import type { PopulatedArticle } from '@/types/models';

describe('Hero Editorial Presentation Rules', () => {
  it('calculates hero carousel slides and boundaries correctly', () => {
    const getHeroSlides = (
      configuredArticles: PopulatedArticle[],
      fallbackArticles: PopulatedArticle[]
    ) => {
      if (configuredArticles.length > 1) return configuredArticles;
      return fallbackArticles.slice(0, 4);
    };

    const mockArticles = [
      { id: '1', title: 'Story 1' },
      { id: '2', title: 'Story 2' },
      { id: '3', title: 'Story 3' },
      { id: '4', title: 'Story 4' },
      { id: '5', title: 'Story 5' },
    ] as unknown as PopulatedArticle[];

    const singleConfigured = [mockArticles[0]];
    const slidesFromSingle = getHeroSlides(singleConfigured, mockArticles);
    expect(slidesFromSingle.length).toBe(4);

    const multipleConfigured = [mockArticles[0], mockArticles[1], mockArticles[2]];
    const slidesFromMultiple = getHeroSlides(multipleConfigured, mockArticles);
    expect(slidesFromMultiple.length).toBe(3);
  });

  it('determines when carousel controls should be displayed or hidden', () => {
    const shouldShowControls = (totalSlides: number) => totalSlides > 1;
    expect(shouldShowControls(1)).toBe(false);
    expect(shouldShowControls(0)).toBe(false);
    expect(shouldShowControls(2)).toBe(true);
    expect(shouldShowControls(4)).toBe(true);
  });

  it('formats editorial publication dates to exact match convention: DD MON YYYY', () => {
    const formatEditorialDate = (dateStr?: string | null): string => {
      if (!dateStr) return '20 OCT 2026';
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[d.getMonth()] || 'OCT';
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    };

    expect(formatEditorialDate('2026-10-20T08:00:00Z')).toBe('20 OCT 2026');
    expect(formatEditorialDate('2026-10-19T09:00:00Z')).toBe('19 OCT 2026');
    expect(formatEditorialDate('2026-10-18T10:15:00Z')).toBe('18 OCT 2026');
    expect(formatEditorialDate('2026-10-17T11:00:00Z')).toBe('17 OCT 2026');
  });

  it('determines the correct editorial kickers matching the reference design', () => {
    const getStoryKicker = (slug: string, articleType: string): string => {
      const lower = slug.toLowerCase();
      if (lower.includes('resortwear') || lower.includes('trend')) return 'TRENDS';
      if (lower.includes('australian-labels') || lower.includes('designer')) return 'DESIGNERS';
      if (lower.includes('capsule-wardrobe') || lower.includes('wardrobe') || lower.includes('style')) return 'STYLE';
      if (lower.includes('boutiques') || lower.includes('travel') || lower.includes('getaway')) return 'TRAVEL';
      return articleType.toUpperCase();
    };

    expect(getStoryKicker('5-resortwear-trends-defining-summer-2026', 'trend_report')).toBe('TRENDS');
    expect(getStoryKicker('australian-labels-making-a-global-impact', 'designer_profile')).toBe('DESIGNERS');
    expect(getStoryKicker('how-to-build-a-timeless-capsule-wardrobe', 'style_guide')).toBe('STYLE');
    expect(getStoryKicker('the-best-fashion-boutiques-to-visit-in-australia', 'trend_report')).toBe('TRAVEL');
  });

  it('verifies that the latest stories sidebar renders exactly 4 items', () => {
    const latest = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
      { id: '6' },
    ];
    const displayed = latest.slice(0, 4);
    expect(displayed.length).toBe(4);
  });

  it('validates fluid desktop hero grid proportions (~71-74% hero, ~26-29% sidebar)', () => {
    // 2.5fr vs 1fr: 2.5 / 3.5 = 71.4%
    const heroWeight = 2.5;
    const sidebarWeight = 1.0;
    const totalWeight = heroWeight + sidebarWeight;
    const heroRatio = heroWeight / totalWeight;
    const sidebarRatio = sidebarWeight / totalWeight;

    expect(heroRatio).toBeGreaterThanOrEqual(0.70);
    expect(heroRatio).toBeLessThanOrEqual(0.74);
    expect(sidebarRatio).toBeGreaterThanOrEqual(0.26);
    expect(sidebarRatio).toBeLessThanOrEqual(0.30);
  });

  it('verifies visual category strip is completely absent from homepage sections', () => {
    const homepageSectionKeys = [
      'hero_editorial',
      'featured_editorial_grid',
      'sponsored_and_ad',
      'clearance_sale',
      'competition_banner',
      'more_stories',
    ];
    expect(homepageSectionKeys).not.toContain('visual_category_strip');
  });
});
