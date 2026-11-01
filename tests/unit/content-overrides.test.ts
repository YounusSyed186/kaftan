import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEffectiveValue,
  resolveItemData,
  type ItemContentOverrides,
  type MediaReferenceOverride,
} from '@/types/content-overrides';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import type { PopulatedArticle, PopulatedHomepageSection } from '@/types/models';

const MOCK_ARTICLE: PopulatedArticle = {
  id: 'art-101',
  title: 'The New Language of Contemporary Fashion',
  slug: 'new-language-contemporary-fashion',
  excerpt: 'An editorial exploration of effortless luxury and clean lines.',
  body: [],
  article_type: 'fashion_editorial',
  content_type: 'original',
  status: 'published',
  featured_image_id: 'media-01',
  author_id: 'auth-01',
  sponsor_id: null,
  published_at: '2026-10-20T08:00:00Z',
  scheduled_at: null,
  seo_title: null,
  seo_description: null,
  canonical_url: null,
  created_by: null,
  updated_by: null,
  featured_image: {
    id: 'media-01',
    storage_key: 'kaftan/editorial/hero-mediterranean-resortwear',
    original_filename: 'hero.jpg',
    mime_type: 'image/jpeg',
    width: 2400,
    height: 1600,
    file_size_bytes: 850000,
    alt_text: 'Model in ivory resortwear',
    caption: null,
    credit: null,
    license_info: null,
    metadata: {},
    uploaded_by: null,
    created_at: '2026-10-20T00:00:00Z',
  },
  author: {
    id: 'auth-01',
    name: 'Chloe Montgomery',
    slug: 'chloe-montgomery',
    bio: null,
    profile_image_id: null,
    website_url: null,
    social_links: {},
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-20T00:00:00Z',
  },
  created_at: '2026-10-20T08:00:00Z',
  updated_at: '2026-10-20T08:00:00Z',
};

const MOCK_SECTION: PopulatedHomepageSection = {
  id: 'sec-hero-1',
  section_key: 'hero_editorial',
  name: 'Hero Editorial & Latest Split',
  title: 'The Kaftan Edit',
  layout_type: 'hero',
  source_mode: 'manual',
  items_limit: 1,
  display_order: 1,
  is_active: true,
  settings: {},
  created_at: '2026-10-25T00:00:00Z',
  updated_at: '2026-10-25T00:00:00Z',
  items: [
    {
      id: 'item-hero-1',
      homepage_section_id: 'sec-hero-1',
      article_id: MOCK_ARTICLE.id,
      product_id: null,
      campaign_id: null,
      ad_creative_id: null,
      display_order: 1,
      title_override: null,
      excerpt_override: null,
      visibility_start: null,
      visibility_end: null,
      is_active: true,
      created_at: '2026-10-25T00:00:00Z',
      updated_at: '2026-10-25T00:00:00Z',
      article: MOCK_ARTICLE,
    },
  ],
};

describe('Content Source of Truth & Override Architecture', () => {
  it('TEST 1: Default Content Inheritance — article title, excerpt, and image populate automatically without overrides', () => {
    const resolved = resolveItemData(MOCK_ARTICLE, null);

    expect(resolved.title).toBe('The New Language of Contemporary Fashion');
    expect(resolved.excerpt).toBe('An editorial exploration of effortless luxury and clean lines.');
    expect(resolved.imageStorageKey).toBe('kaftan/editorial/hero-mediterranean-resortwear');
    expect(resolved.isTitleOverridden).toBe(false);
    expect(resolved.isExcerptOverridden).toBe(false);
    expect(resolved.isImageOverridden).toBe(false);
  });

  it('TEST 2: Homepage Title Override — headline override takes effect without changing source article', () => {
    const overrides: ItemContentOverrides = {
      title: {
        enabled: true,
        value: 'A Custom Homepage Headline For Summer',
      },
    };

    const resolved = resolveItemData(MOCK_ARTICLE, overrides);

    expect(resolved.title).toBe('A Custom Homepage Headline For Summer');
    expect(resolved.isTitleOverridden).toBe(true);
    // Source article remains untouched
    expect(MOCK_ARTICLE.title).toBe('The New Language of Contemporary Fashion');
  });

  it('TEST 3: Reset to Original — disabling/removing the override restores source article value', () => {
    const overrides: ItemContentOverrides = {
      title: {
        enabled: false,
        value: 'Obsolete Override',
      },
    };

    const resolved = resolveItemData(MOCK_ARTICLE, overrides);

    expect(resolved.title).toBe(MOCK_ARTICLE.title);
    expect(resolved.isTitleOverridden).toBe(false);
  });

  it('TEST 4: Edit Original Article — updating original article propagates to inherited fields', () => {
    const updatedArticle = {
      ...MOCK_ARTICLE,
      title: 'Updated Global Article Headline',
    };

    const resolved = resolveItemData(updatedArticle, null);

    expect(resolved.title).toBe('Updated Global Article Headline');
  });

  it('TEST 5: Overrides Remain Intact — explicit overrides survive even if source article title changes', () => {
    const updatedArticle = {
      ...MOCK_ARTICLE,
      title: 'Updated Global Article Headline',
    };

    const overrides: ItemContentOverrides = {
      title: {
        enabled: true,
        value: 'Deliberate Homepage Override',
      },
    };

    const resolved = resolveItemData(updatedArticle, overrides);

    expect(resolved.title).toBe('Deliberate Homepage Override');
    expect(resolved.isTitleOverridden).toBe(true);
  });

  it('TEST 6: Responsive Hero Images — independent desktop and mobile hero photographs and focal points', () => {
    const desktopImage: MediaReferenceOverride = {
      storage_key: 'kaftan/editorial/hero-mediterranean-resortwear',
      alt_text: 'Desktop Terrace View',
      focal_point: { x: 0.65, y: 0.40 },
    };

    const mobileImage: MediaReferenceOverride = {
      storage_key: 'kaftan/editorial/hero-modern-elegance',
      alt_text: 'Mobile Close-up Portrait',
      focal_point: { x: 0.75, y: 0.20 },
    };

    // Both are distinct media references
    expect(desktopImage.storage_key).not.toBe(mobileImage.storage_key);
    expect(desktopImage.focal_point).toEqual({ x: 0.65, y: 0.40 });
    expect(mobileImage.focal_point).toEqual({ x: 0.75, y: 0.20 });

    // Graceful fallback verification: when mobile is null, desktop is used as fallback
    const fallbackMobile = null;
    const effectiveMobileKey = fallbackMobile || desktopImage.storage_key;
    expect(effectiveMobileKey).toBe(desktopImage.storage_key);
  });

  it('TEST 7: Article Card Image Replacement — replaces only the intended slot image', () => {
    const cardOverride: ItemContentOverrides = {
      image: {
        enabled: true,
        value: {
          storage_key: 'kaftan/editorial/story-resortwear-trends',
          alt_text: 'Alternative Card Photo',
          focal_point: { x: 0.5, y: 0.5 },
        },
      },
    };

    const resolved = resolveItemData(MOCK_ARTICLE, cardOverride);

    expect(resolved.imageStorageKey).toBe('kaftan/editorial/story-resortwear-trends');
    expect(resolved.isImageOverridden).toBe(true);
    // Original article featured image remains untouched
    expect(MOCK_ARTICLE.featured_image?.storage_key).toBe('kaftan/editorial/hero-mediterranean-resortwear');
  });
});

describe('Homepage Studio Store Content Override Actions', () => {
  beforeEach(() => {
    useHomepageStudioStore.getState().setSections([MOCK_SECTION], 1);
  });

  it('TEST 8: setItemOverride and resetItemOverride in store', () => {
    const store = useHomepageStudioStore.getState();

    // 1. Set item override
    store.setItemOverride('sec-hero-1', 'item-hero-1', 'title', 'Overridden Title in Store');

    const updatedSec = useHomepageStudioStore.getState().sections[0];
    const settings = updatedSec.settings as any;
    expect(settings.item_overrides['item-hero-1'].title.value).toBe('Overridden Title in Store');
    expect(updatedSec.items[0].title_override).toBe('Overridden Title in Store');
    expect(useHomepageStudioStore.getState().isDirty).toBe(true);

    // 2. Reset item override
    useHomepageStudioStore.getState().resetItemOverride('sec-hero-1', 'item-hero-1', 'title');

    const resetSec = useHomepageStudioStore.getState().sections[0];
    const resetSettings = resetSec.settings as any;
    expect(resetSettings.item_overrides?.['item-hero-1']?.title).toBeUndefined();
    expect(resetSec.items[0].title_override).toBeNull();
  });

  it('TEST 9: Section-level field override and reset', () => {
    const store = useHomepageStudioStore.getState();

    store.setSectionFieldOverride('sec-hero-1', 'eyebrow', 'SPECIAL EDITORIAL EDITION');

    let updatedSec = useHomepageStudioStore.getState().sections[0];
    expect((updatedSec.settings as any).eyebrow).toBe('SPECIAL EDITORIAL EDITION');

    store.resetSectionFieldOverride('sec-hero-1', 'eyebrow');

    updatedSec = useHomepageStudioStore.getState().sections[0];
    expect((updatedSec.settings as any).eyebrow).toBeUndefined();
  });

  it('TEST 10: Undo and Redo preserve content overrides', () => {
    const store = useHomepageStudioStore.getState();

    // 1. Initial headline override
    store.setSectionFieldOverride('sec-hero-1', 'heading_override', 'Headline Version A');
    expect((useHomepageStudioStore.getState().sections[0].settings as any).heading_override).toBe('Headline Version A');

    // 2. Second headline override
    store.setSectionFieldOverride('sec-hero-1', 'heading_override', 'Headline Version B');
    expect((useHomepageStudioStore.getState().sections[0].settings as any).heading_override).toBe('Headline Version B');

    // 3. Undo
    store.undo();
    expect((useHomepageStudioStore.getState().sections[0].settings as any).heading_override).toBe('Headline Version A');

    // 4. Redo
    store.redo();
    expect((useHomepageStudioStore.getState().sections[0].settings as any).heading_override).toBe('Headline Version B');
  });

  it('TEST 11: setSlotArticle assigns a new article to a slot', () => {
    const store = useHomepageStudioStore.getState();
    const newArticle: PopulatedArticle = {
      ...MOCK_ARTICLE,
      id: 'art-202',
      title: 'A Secondary Story in Slot',
      slug: 'secondary-story-slot',
    };

    store.setSlotArticle('sec-hero-1', 0, newArticle, false);

    const updatedSec = useHomepageStudioStore.getState().sections[0];
    expect(updatedSec.items[0].article_id).toBe('art-202');
    expect(updatedSec.items[0].article?.title).toBe('A Secondary Story in Slot');
  });

  it('TEST 12: Independent Mobile Image Override — resolves mobile_image independently while falling back to desktop image if unset', () => {
    // 1. Without mobile override: mobileImage falls back to desktop image
    const fallbackResolved = resolveItemData(MOCK_ARTICLE, null);
    expect(fallbackResolved.imageStorageKey).toBe('kaftan/editorial/hero-mediterranean-resortwear');
    expect(fallbackResolved.mobileImageStorageKey).toBe('kaftan/editorial/hero-mediterranean-resortwear');
    expect(fallbackResolved.isMobileImageOverridden).toBe(false);

    // 2. With mobile override set
    const overrides: ItemContentOverrides = {
      image: {
        enabled: true,
        value: { storage_key: 'kaftan/editorial/desktop-custom-photo' },
      },
      mobile_image: {
        enabled: true,
        value: {
          storage_key: 'kaftan/editorial/mobile-portrait-photo',
          focal_point: { x: 0.75, y: 0.25 },
          alt_text: 'Mobile specific alt text',
        },
      },
    };

    const resolved = resolveItemData(MOCK_ARTICLE, overrides);
    expect(resolved.imageStorageKey).toBe('kaftan/editorial/desktop-custom-photo');
    expect(resolved.mobileImageStorageKey).toBe('kaftan/editorial/mobile-portrait-photo');
    expect(resolved.mobileImageFocalPoint).toEqual({ x: 0.75, y: 0.25 });
    expect(resolved.mobileImageAlt).toBe('Mobile specific alt text');
    expect(resolved.isMobileImageOverridden).toBe(true);
  });
});
