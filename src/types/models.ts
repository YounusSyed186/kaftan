// Domain Models and Populated View Types for KAFTAN
import type { Database } from './database';

export type ArticleRow = Database['public']['Tables']['articles']['Row'];
export type AuthorRow = Database['public']['Tables']['authors']['Row'];
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type MediaAssetRow = Database['public']['Tables']['media_assets']['Row'];
export type HomepageSectionRow = Database['public']['Tables']['homepage_sections']['Row'];
export type HomepageItemRow = Database['public']['Tables']['homepage_items']['Row'];
export type NavigationItemRow = Database['public']['Tables']['navigation_items']['Row'];
export type AdPlacementRow = Database['public']['Tables']['ad_placements']['Row'];
export type AdCreativeRow = Database['public']['Tables']['ad_creatives']['Row'];
export type CompetitionRow = Database['public']['Tables']['competitions']['Row'];
export type SponsorRow = Database['public']['Tables']['sponsors']['Row'];
export type CampaignRow = Database['public']['Tables']['campaigns']['Row'];

export interface PopulatedArticle extends ArticleRow {
  author?: AuthorRow | null;
  featured_image?: MediaAssetRow | null;
  sponsor?: SponsorRow | null;
  contributors?: Array<{
    author: AuthorRow;
    contribution_type: string;
    display_order: number;
  }>;
}

export interface PopulatedProduct extends ProductRow {
  image?: MediaAssetRow | null;
}

export interface PopulatedAdCreative extends AdCreativeRow {
  desktop_image?: MediaAssetRow | null;
  mobile_image?: MediaAssetRow | null;
  campaign?: CampaignRow | null;
}

export interface PopulatedHomepageItem extends HomepageItemRow {
  article?: PopulatedArticle | null;
  product?: PopulatedProduct | null;
  ad_creative?: PopulatedAdCreative | null;
  campaign?: CampaignRow | null;
}

export interface PopulatedHomepageSection extends HomepageSectionRow {
  items: PopulatedHomepageItem[];
}

export interface PopulatedNavigationItem extends NavigationItemRow {
  children?: PopulatedNavigationItem[];
}
