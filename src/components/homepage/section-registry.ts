import type { PopulatedHomepageSection } from '@/types/models';

export type HomepageSectionType =
  | 'hero_editorial'
  | 'featured_editorial_grid'
  | 'sponsored_and_advertising'
  | 'clearance_sale'
  | 'competition_banner'
  | 'more_stories';

export interface SectionDefinition {
  type: HomepageSectionType;
  name: string;
  category: 'Editorial' | 'Commercial' | 'Commerce' | 'Engagement';
  description: string;
  defaultLayout: 'hero' | 'grid' | 'banner' | 'product_grid';
  defaultTitle: string;
  defaultSettings: Record<string, unknown>;
}

export const SUPPORTED_SECTION_REGISTRY: SectionDefinition[] = [
  {
    type: 'hero_editorial',
    name: 'Hero Editorial & Latest Stories',
    category: 'Editorial',
    description: 'High-impact split hero image with left text overlay, accompanied by 4 latest stories column.',
    defaultLayout: 'hero',
    defaultTitle: 'The Kaftan Edit',
    defaultSettings: { show_latest_sidebar: true },
  },
  {
    type: 'featured_editorial_grid',
    name: 'Featured Editorial Stories (3-Column)',
    category: 'Editorial',
    description: 'Asymmetric 3-column curated stories grid with vertical hair-line dividers.',
    defaultLayout: 'grid',
    defaultTitle: 'Featured Stories',
    defaultSettings: { layout: 'asymmetric_3col' },
  },
  {
    type: 'sponsored_and_advertising',
    name: 'Sponsored Feature & Partner Creative',
    category: 'Commercial',
    description: 'Dual-block split layout combining editorial brand story with high-fashion ad placement.',
    defaultLayout: 'banner',
    defaultTitle: 'Partner Feature',
    defaultSettings: { brand_name: 'Fashion Spectrum' },
  },
  {
    type: 'clearance_sale',
    name: 'Clearance Sale & Luxury Catalog',
    category: 'Commerce',
    description: 'Curated 4-column showcase of resortwear, kaftans, and accessories with instant shop links.',
    defaultLayout: 'product_grid',
    defaultTitle: 'Clearance Sale',
    defaultSettings: { view_all_url: '/sale' },
  },
  {
    type: 'competition_banner',
    name: 'Exclusive Competition & Giveaway',
    category: 'Engagement',
    description: 'Full-bleed photographic banner with golden seal badge and registration entry modal.',
    defaultLayout: 'banner',
    defaultTitle: 'COMPETITION',
    defaultSettings: { badge_text: 'WIN a Kaftan' },
  },
  {
    type: 'more_stories',
    name: 'More Stories Editorial Quad',
    category: 'Editorial',
    description: 'Refined 4-card horizontal editorial sequence featuring 16:10 photography and timestamps.',
    defaultLayout: 'grid',
    defaultTitle: 'MORE STORIES',
    defaultSettings: { columns: 4, view_all_url: '/latest' },
  },
];

export function createNewSection(type: HomepageSectionType, displayOrder: number): PopulatedHomepageSection {
  const def = SUPPORTED_SECTION_REGISTRY.find((s) => s.type === type) || SUPPORTED_SECTION_REGISTRY[0];
  const uniqueId = `sec-${type}-${Date.now()}`;

  return {
    id: uniqueId,
    section_key: def.type,
    name: def.name,
    title: def.defaultTitle,
    layout_type: def.defaultLayout,
    source_mode: 'manual',
    items_limit: 4,
    display_order: displayOrder,
    is_active: true,
    settings: { ...def.defaultSettings } as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [],
  };
}
