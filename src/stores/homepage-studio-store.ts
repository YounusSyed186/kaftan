import { create } from 'zustand';
import type {
  PopulatedHomepageSection,
  PopulatedArticle,
  PopulatedProduct,
  PopulatedAdCreative,
} from '@/types/models';
import { createNewSection, type HomepageSectionType } from '@/components/homepage/section-registry';
import type { ItemContentOverrides, SectionCustomSettings } from '@/types/content-overrides';

const MAX_HISTORY = 30;

export interface HomepageStudioState {
  sections: PopulatedHomepageSection[];
  selectedSectionId: string | null;
  selectedElementId: string | null;
  selectedElementType: string | null;
  viewport: 'desktop' | 'tablet' | 'mobile';
  mode: 'edit' | 'preview';
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  version: number;
  lastSaved: string | null;
  past: PopulatedHomepageSection[][];
  future: PopulatedHomepageSection[][];

  // Actions
  setSections: (sections: PopulatedHomepageSection[], version?: number) => void;
  selectSection: (id: string | null) => void;
  selectElement: (elementId: string | null, elementType?: string | null) => void;
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  setMode: (mode: 'edit' | 'preview') => void;
  updateSection: (id: string, updates: Partial<PopulatedHomepageSection>) => void;
  updateSectionSettings: (id: string, settings: Record<string, unknown>) => void;
  setItemOverride: (sectionId: string, itemId: string, field: string, value: unknown) => void;
  resetItemOverride: (sectionId: string, itemId: string, field: string) => void;
  setSectionFieldOverride: (sectionId: string, field: string, value: unknown) => void;
  resetSectionFieldOverride: (sectionId: string, field: string) => void;
  setSlotArticle: (sectionId: string, slotIndex: number, article: PopulatedArticle, preserveOverrides?: boolean) => void;
  setSlotProduct: (sectionId: string, slotIndex: number, product: PopulatedProduct) => void;
  setSlotAdCreative: (sectionId: string, slotIndex: number, adCreative: PopulatedAdCreative, customSettings?: Record<string, unknown>) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleVisibility: (id: string) => void;
  addSection: (type: HomepageSectionType, targetIndex?: number) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  undo: () => void;
  redo: () => void;
  markSaved: (newVersion: number) => void;
  setSaving: (isSaving: boolean) => void;
  setPublishing: (isPublishing: boolean) => void;
}

export const useHomepageStudioStore = create<HomepageStudioState>((set, get) => ({
  sections: [],
  selectedSectionId: null,
  selectedElementId: null,
  selectedElementType: null,
  viewport: 'desktop',
  mode: 'preview',
  isDirty: false,
  isSaving: false,
  isPublishing: false,
  version: 1,
  lastSaved: null,
  past: [],
  future: [],

  setSections: (sections, version) => {
    set({
      sections,
      version: version ?? get().version,
      selectedSectionId: sections[0]?.id || null,
      selectedElementId: null,
      selectedElementType: null,
      isDirty: false,
      past: [],
      future: [],
    });
  },

  selectSection: (id) => set({ selectedSectionId: id }),
  selectElement: (elementId, elementType = null) =>
    set({ selectedElementId: elementId, selectedElementType: elementType }),
  setViewport: (viewport) => set({ viewport }),
  setMode: (mode) => set({ mode }),

  updateSection: (id, updates) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== id) return s;
      return { ...s, ...updates, updated_at: new Date().toISOString() };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  updateSectionSettings: (id, settingsUpdates) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== id) return s;
      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? (s.settings as Record<string, unknown>)
          : {};
      return {
        ...s,
        settings: { ...currentSettings, ...settingsUpdates } as any,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  setItemOverride: (sectionId, itemId, field, value) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};

      const itemOverrides = {
        ...((currentSettings.item_overrides as Record<string, any>) || {}),
      };
      const thisItemOverrides = { ...(itemOverrides[itemId] || {}) };
      thisItemOverrides[field] = { enabled: true, value };
      itemOverrides[itemId] = thisItemOverrides;

      // Also update item directly if title or excerpt
      const updatedItems = (s.items || []).map((it) => {
        if (it.id !== itemId) return it;
        const itUpdates: Record<string, any> = {};
        if (field === 'title' && typeof value === 'string') {
          itUpdates.title_override = value;
        }
        if (field === 'excerpt' && typeof value === 'string') {
          itUpdates.excerpt_override = value;
        }
        return { ...it, ...itUpdates };
      });

      return {
        ...s,
        settings: { ...currentSettings, item_overrides: itemOverrides } as any,
        items: updatedItems,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  resetItemOverride: (sectionId, itemId, field) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};

      const itemOverrides = {
        ...((currentSettings.item_overrides as Record<string, any>) || {}),
      };
      if (itemOverrides[itemId]) {
        const thisItemOverrides = { ...itemOverrides[itemId] };
        delete thisItemOverrides[field];
        if (Object.keys(thisItemOverrides).length === 0) {
          delete itemOverrides[itemId];
        } else {
          itemOverrides[itemId] = thisItemOverrides;
        }
      }

      // Also reset direct item fields
      const updatedItems = (s.items || []).map((it) => {
        if (it.id !== itemId) return it;
        const itUpdates: Record<string, any> = {};
        if (field === 'title') itUpdates.title_override = null;
        if (field === 'excerpt') itUpdates.excerpt_override = null;
        return { ...it, ...itUpdates };
      });

      return {
        ...s,
        settings: { ...currentSettings, item_overrides: itemOverrides } as any,
        items: updatedItems,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  setSectionFieldOverride: (sectionId, field, value) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};

      return {
        ...s,
        settings: { ...currentSettings, [field]: value } as any,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  resetSectionFieldOverride: (sectionId, field) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};

      delete currentSettings[field];

      return {
        ...s,
        settings: { ...currentSettings } as any,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  setSlotArticle: (sectionId, slotIndex, article, preserveOverrides = false) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const items = [...(s.items || [])];

      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};
      const itemOverrides = {
        ...((currentSettings.item_overrides as Record<string, any>) || {}),
      };

      // In sponsored_and_advertising, changing slot 0 or slot 1 clears overriding fields so the new story shows immediately
      if (s.section_key === 'sponsored_and_advertising' && !preserveOverrides) {
        if (slotIndex === 0) {
          delete currentSettings.sponsored_title;
          delete currentSettings.sponsored_excerpt;
          delete currentSettings.sponsored_image;
          delete currentSettings.sponsored_mobile_image;
        } else if (slotIndex === 1) {
          delete currentSettings.ad_headline;
          delete currentSettings.ad_copy;
          delete currentSettings.ad_sponsor_name;
          delete currentSettings.ad_destination_url;
          delete currentSettings.ad_desktop_image;
          delete currentSettings.ad_mobile_image;
        }
      }

      if (items[slotIndex]) {
        const oldItemId = items[slotIndex].id;
        if (!preserveOverrides && itemOverrides[oldItemId]) {
          delete itemOverrides[oldItemId];
        }

        items[slotIndex] = {
          ...items[slotIndex],
          article_id: article.id,
          article,
          product_id: null,
          product: undefined,
          ad_creative_id: null,
          ad_creative: undefined,
          title_override: preserveOverrides ? items[slotIndex].title_override : null,
          excerpt_override: preserveOverrides ? items[slotIndex].excerpt_override : null,
          updated_at: new Date().toISOString(),
        };
      } else {
        items.push({
          id: `item-${Date.now()}-${article.id}`,
          homepage_section_id: s.id,
          article_id: article.id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: items.length + 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          article,
        });
      }

      return {
        ...s,
        items,
        settings: { ...currentSettings, item_overrides: itemOverrides } as any,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  setSlotProduct: (sectionId, slotIndex, product) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const items = [...(s.items || [])];

      if (items[slotIndex]) {
        items[slotIndex] = {
          ...items[slotIndex],
          product_id: product.id,
          product,
          article_id: null,
          article: undefined,
          ad_creative_id: null,
          ad_creative: undefined,
          updated_at: new Date().toISOString(),
        };
      } else {
        items.push({
          id: `item-${Date.now()}-${product.id}`,
          homepage_section_id: s.id,
          article_id: null,
          product_id: product.id,
          campaign_id: null,
          ad_creative_id: null,
          display_order: items.length + 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product,
        });
      }

      return {
        ...s,
        items,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  setSlotAdCreative: (sectionId, slotIndex, adCreative, customSettings) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== sectionId) return s;
      const items = [...(s.items || [])];

      const currentSettings =
        typeof s.settings === 'object' && s.settings !== null && !Array.isArray(s.settings)
          ? { ...(s.settings as Record<string, unknown>) }
          : {};

      delete currentSettings.ad_headline;
      delete currentSettings.ad_copy;
      delete currentSettings.ad_sponsor_name;
      delete currentSettings.ad_destination_url;
      delete currentSettings.ad_desktop_image;
      delete currentSettings.ad_mobile_image;

      const mergedSettings = {
        ...currentSettings,
        ...(customSettings || {}),
      };

      if (items[slotIndex]) {
        items[slotIndex] = {
          ...items[slotIndex],
          ad_creative_id: adCreative.id,
          ad_creative: adCreative,
          article_id: null,
          article: undefined,
          product_id: null,
          product: undefined,
          updated_at: new Date().toISOString(),
        };
      } else {
        items.push({
          id: `item-${Date.now()}-${adCreative.id}`,
          homepage_section_id: s.id,
          article_id: null,
          product_id: null,
          campaign_id: adCreative.campaign_id,
          ad_creative_id: adCreative.id,
          display_order: items.length + 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ad_creative: adCreative,
        });
      }

      return {
        ...s,
        items,
        settings: mergedSettings as any,
        updated_at: new Date().toISOString(),
      };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  reorderSections: (fromIndex, toIndex) => {
    const current = get().sections;
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      fromIndex >= current.length ||
      toIndex < 0 ||
      toIndex >= current.length
    ) {
      return;
    }

    const past = [...get().past, current].slice(-MAX_HISTORY);
    const reordered = [...current];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const updated = reordered.map((sec, idx) => ({
      ...sec,
      display_order: idx + 1,
    }));

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  toggleVisibility: (id) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const updated = current.map((s) => {
      if (s.id !== id) return s;
      return { ...s, is_active: !s.is_active, updated_at: new Date().toISOString() };
    });

    set({
      sections: updated,
      isDirty: true,
      past,
      future: [],
    });
  },

  addSection: (type, targetIndex) => {
    const current = get().sections;
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const insertAt = targetIndex !== undefined ? targetIndex : current.length;
    const newSec = createNewSection(type, insertAt + 1);

    const reordered = [...current];
    reordered.splice(insertAt, 0, newSec);

    const updated = reordered.map((sec, idx) => ({
      ...sec,
      display_order: idx + 1,
    }));

    set({
      sections: updated,
      selectedSectionId: newSec.id,
      selectedElementId: null,
      selectedElementType: null,
      isDirty: true,
      past,
      future: [],
    });
  },

  duplicateSection: (id) => {
    const current = get().sections;
    const index = current.findIndex((s) => s.id === id);
    if (index === -1) return;

    const source = current[index];
    const past = [...get().past, current].slice(-MAX_HISTORY);

    const clone: PopulatedHomepageSection = {
      ...source,
      id: `${source.section_key}-copy-${Date.now()}`,
      name: `${source.name} (Copy)`,
      display_order: index + 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: (source.items || []).map((it, idx) => ({
        ...it,
        id: `item-clone-${Date.now()}-${idx}`,
        homepage_section_id: `${source.section_key}-copy-${Date.now()}`,
      })),
    };

    const reordered = [...current];
    reordered.splice(index + 1, 0, clone);

    const updated = reordered.map((sec, idx) => ({
      ...sec,
      display_order: idx + 1,
    }));

    set({
      sections: updated,
      selectedSectionId: clone.id,
      selectedElementId: null,
      selectedElementType: null,
      isDirty: true,
      past,
      future: [],
    });
  },

  deleteSection: (id) => {
    const current = get().sections;
    if (current.length <= 1) {
      alert('The homepage must retain at least one section.');
      return;
    }

    const past = [...get().past, current].slice(-MAX_HISTORY);
    const updated = current
      .filter((s) => s.id !== id)
      .map((sec, idx) => ({
        ...sec,
        display_order: idx + 1,
      }));

    const nextSelectedId =
      get().selectedSectionId === id
        ? updated[0]?.id || null
        : get().selectedSectionId;

    set({
      sections: updated,
      selectedSectionId: nextSelectedId,
      selectedElementId: null,
      selectedElementType: null,
      isDirty: true,
      past,
      future: [],
    });
  },

  undo: () => {
    const { past, sections, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      sections: previous,
      past: newPast,
      future: [sections, ...future],
      isDirty: true,
    });
  },

  redo: () => {
    const { future, sections, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      sections: next,
      past: [...past, sections],
      future: newFuture,
      isDirty: true,
    });
  },

  markSaved: (newVersion: number) => {
    set({
      version: newVersion,
      isDirty: false,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  },

  setSaving: (isSaving) => set({ isSaving }),
  setPublishing: (isPublishing) => set({ isPublishing }),
}));
