import { describe, it, expect, beforeEach } from 'vitest';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import { createNewSection } from '@/components/homepage/section-registry';
import type { PopulatedHomepageSection } from '@/types/models';

function createMockSection(id: string, key: string, order: number): PopulatedHomepageSection {
  return {
    id,
    section_key: key,
    name: `Section ${key}`,
    title: `Title ${key}`,
    layout_type: 'grid',
    source_mode: 'manual',
    items_limit: 4,
    display_order: order,
    is_active: true,
    settings: {},
    created_at: '',
    updated_at: '',
    items: [],
  };
}

describe('Homepage Studio Store Unit Tests', () => {
  beforeEach(() => {
    useHomepageStudioStore.setState({
      sections: [
        createMockSection('sec-1', 'hero_editorial', 1),
        createMockSection('sec-2', 'featured_editorial_grid', 2),
        createMockSection('sec-3', 'clearance_sale', 3),
      ],
      selectedSectionId: 'sec-1',
      viewport: 'desktop',
      mode: 'edit',
      isDirty: false,
      isSaving: false,
      isPublishing: false,
      version: 1,
      past: [],
      future: [],
    });
  });

  it('correctly sets initial sections and resets dirty state', () => {
    const store = useHomepageStudioStore.getState();
    expect(store.sections).toHaveLength(3);
    expect(store.isDirty).toBe(false);
    expect(store.selectedSectionId).toBe('sec-1');
  });

  it('updates section properties and marks draft as dirty', () => {
    const { updateSection } = useHomepageStudioStore.getState();
    updateSection('sec-1', { title: 'Updated Editorial Headline' });

    const state = useHomepageStudioStore.getState();
    expect(state.isDirty).toBe(true);
    expect(state.sections[0].title).toBe('Updated Editorial Headline');
    expect(state.past).toHaveLength(1);
  });

  it('toggles section visibility without deleting section content', () => {
    const { toggleVisibility } = useHomepageStudioStore.getState();
    toggleVisibility('sec-2');

    const state = useHomepageStudioStore.getState();
    expect(state.isDirty).toBe(true);
    expect(state.sections[1].is_active).toBe(false);
    expect(state.sections[1].section_key).toBe('featured_editorial_grid');

    // Toggle back
    toggleVisibility('sec-2');
    expect(useHomepageStudioStore.getState().sections[1].is_active).toBe(true);
  });

  it('reorders sections and updates display_order sequentially', () => {
    const { reorderSections } = useHomepageStudioStore.getState();
    // Move index 0 ('sec-1') to index 2
    reorderSections(0, 2);

    const state = useHomepageStudioStore.getState();
    expect(state.isDirty).toBe(true);
    expect(state.sections[0].id).toBe('sec-2');
    expect(state.sections[0].display_order).toBe(1);
    expect(state.sections[1].id).toBe('sec-3');
    expect(state.sections[1].display_order).toBe(2);
    expect(state.sections[2].id).toBe('sec-1');
    expect(state.sections[2].display_order).toBe(3);
  });

  it('supports undo and redo operations across edits', () => {
    const { updateSection, undo, redo } = useHomepageStudioStore.getState();

    // 1. Initial title
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('Title hero_editorial');

    // 2. Perform edit
    updateSection('sec-1', { title: 'First Change' });
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('First Change');

    // 3. Undo
    undo();
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('Title hero_editorial');

    // 4. Redo
    redo();
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('First Change');
  });

  it('adds a new section from the supported registry', () => {
    const { addSection } = useHomepageStudioStore.getState();
    addSection('competition_banner');

    const state = useHomepageStudioStore.getState();
    expect(state.sections).toHaveLength(4);
    expect(state.sections[3].section_key).toBe('competition_banner');
    expect(state.selectedSectionId).toBe(state.sections[3].id);
    expect(state.isDirty).toBe(true);
  });

  it('duplicates a section while generating unique IDs', () => {
    const { duplicateSection } = useHomepageStudioStore.getState();
    duplicateSection('sec-2');

    const state = useHomepageStudioStore.getState();
    expect(state.sections).toHaveLength(4);
    expect(state.sections[2].section_key).toBe('featured_editorial_grid');
    expect(state.sections[2].id).not.toBe('sec-2');
    expect(state.sections[2].name).toContain('(Copy)');
  });

  it('deletes a section and safely selects remaining section', () => {
    const { deleteSection } = useHomepageStudioStore.getState();
    deleteSection('sec-1');

    const state = useHomepageStudioStore.getState();
    expect(state.sections).toHaveLength(2);
    expect(state.sections[0].id).toBe('sec-2');
    expect(state.selectedSectionId).toBe('sec-2');
  });

  it('switches viewports correctly without resetting editor content', () => {
    const { setViewport, updateSection } = useHomepageStudioStore.getState();
    updateSection('sec-1', { title: 'Preserved Headline' });

    setViewport('tablet');
    expect(useHomepageStudioStore.getState().viewport).toBe('tablet');
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('Preserved Headline');

    setViewport('mobile');
    expect(useHomepageStudioStore.getState().viewport).toBe('mobile');
    expect(useHomepageStudioStore.getState().sections[0].title).toBe('Preserved Headline');
  });

  it('updates slot article and resets conflicting overrides in sponsored_and_advertising', () => {
    const { setSlotArticle, setSectionFieldOverride } = useHomepageStudioStore.getState();

    // Set an override on sec-1
    setSectionFieldOverride('sec-1', 'ad_headline', 'Old Overridden Ad Title');

    const mockArticle: any = {
      id: 'art-999',
      title: 'Newly Assigned Luxury Story',
      slug: 'newly-assigned-luxury-story',
      excerpt: 'Story excerpt',
    };

    useHomepageStudioStore.setState((state) => ({
      ...state,
      sections: state.sections.map((s) =>
        s.id === 'sec-1'
          ? {
              ...s,
              section_key: 'sponsored_and_advertising',
              items: [
                { id: 'it-0', homepage_section_id: 'sec-1', article_id: 'art-1', display_order: 1, is_active: true } as any,
                { id: 'it-1', homepage_section_id: 'sec-1', article_id: null, display_order: 2, is_active: true } as any,
              ],
            }
          : s
      ),
    }));

    // Replace slot 1 with mockArticle
    setSlotArticle('sec-1', 1, mockArticle, false);

    const state = useHomepageStudioStore.getState();
    const updatedSec = state.sections.find((s) => s.id === 'sec-1');
    expect(updatedSec?.items[1].article_id).toBe('art-999');
    expect(updatedSec?.items[1].article?.title).toBe('Newly Assigned Luxury Story');
    // Stale ad_headline should have been cleared so the new story's headline renders
    expect((updatedSec?.settings as any)?.ad_headline).toBeUndefined();
  });

  it('updates slot product in product catalog sections', () => {
    const { setSlotProduct } = useHomepageStudioStore.getState();

    const mockProduct: any = {
      id: 'prod-888',
      name: 'Midnight Silk Kaftan',
      brand_name: 'Fashion Spectrum',
      original_price: 299,
      currency: 'AUD',
    };

    setSlotProduct('sec-3', 0, mockProduct);

    const state = useHomepageStudioStore.getState();
    const updatedSec = state.sections.find((s) => s.id === 'sec-3');
    expect(updatedSec?.items[0].product_id).toBe('prod-888');
    expect(updatedSec?.items[0].product?.name).toBe('Midnight Silk Kaftan');
  });

  it('updates slot ad creative and resets manual field overrides', () => {
    const { setSlotAdCreative, setSectionFieldOverride } = useHomepageStudioStore.getState();

    useHomepageStudioStore.setState((state) => ({
      ...state,
      sections: state.sections.map((s) =>
        s.id === 'sec-1'
          ? {
              ...s,
              items: [
                { id: 'it-0', homepage_section_id: 'sec-1', display_order: 1, is_active: true } as any,
                { id: 'it-1', homepage_section_id: 'sec-1', display_order: 2, is_active: true } as any,
              ],
            }
          : s
      ),
    }));

    setSectionFieldOverride('sec-1', 'ad_headline', 'Manual Headline');

    const mockAd: any = {
      id: 'ad-555',
      campaign_id: 'camp-555',
      headline: 'DAVID JONES SPRING RESORT',
      copy: 'Explore luxury kaftans',
      destination_url: 'https://davidjones.com',
    };

    setSlotAdCreative('sec-1', 1, mockAd);

    const state = useHomepageStudioStore.getState();
    const updatedSec = state.sections.find((s) => s.id === 'sec-1');
    expect(updatedSec?.items[1].ad_creative_id).toBe('ad-555');
    expect(updatedSec?.items[1].ad_creative?.headline).toBe('DAVID JONES SPRING RESORT');
    expect((updatedSec?.settings as any)?.ad_headline).toBeUndefined();
  });
});

