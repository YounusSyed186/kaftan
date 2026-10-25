// Database TypeScript Definitions for KAFTAN
// Generated from Supabase PostgreSQL Schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ArticleType =
  | 'fashion_editorial'
  | 'interview'
  | 'trend_report'
  | 'style_guide'
  | 'designer_profile'
  | 'news';

export type ContentType = 'original' | 'sponsored' | 'affiliate';

export type ArticleStatus =
  | 'draft'
  | 'in_review'
  | 'scheduled'
  | 'published'
  | 'archived';

export type UserRole = 'admin' | 'editor' | 'author';

export type AccountStatus = 'active' | 'suspended' | 'invited';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed';

export type LinkType = 'external' | 'affiliate';

export type ProductStatus = 'active' | 'inactive';

export type CompetitionStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'closed'
  | 'completed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type LayoutType =
  | 'hero'
  | 'grid'
  | 'carousel'
  | 'banner'
  | 'product_grid';

export type SourceMode = 'manual' | 'automatic';

export type ImagePlacement =
  | 'hero'
  | 'thumbnail'
  | 'banner'
  | 'inline'
  | 'card'
  | 'category_strip';

export type FitMode = 'cover' | 'contain';

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role_id: string;
          account_status: AccountStatus;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role_id?: string;
          account_status?: AccountStatus;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role_id?: string;
          account_status?: AccountStatus;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_assets: {
        Row: {
          id: string;
          storage_key: string;
          original_filename: string;
          mime_type: string;
          width: number;
          height: number;
          file_size_bytes: number;
          alt_text: string | null;
          caption: string | null;
          credit: string | null;
          license_info: string | null;
          metadata: Json;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_key: string;
          original_filename: string;
          mime_type: string;
          width: number;
          height: number;
          file_size_bytes: number;
          alt_text?: string | null;
          caption?: string | null;
          credit?: string | null;
          license_info?: string | null;
          metadata?: Json;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          storage_key?: string;
          original_filename?: string;
          mime_type?: string;
          width?: number;
          height?: number;
          file_size_bytes?: number;
          alt_text?: string | null;
          caption?: string | null;
          credit?: string | null;
          license_info?: string | null;
          metadata?: Json;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      media_variants: {
        Row: {
          id: string;
          media_asset_id: string;
          storage_key: string;
          variant_name: string;
          width: number;
          height: number;
          format: string;
          file_size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          media_asset_id: string;
          storage_key: string;
          variant_name: string;
          width: number;
          height: number;
          format: string;
          file_size_bytes: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          media_asset_id?: string;
          storage_key?: string;
          variant_name?: string;
          width?: number;
          height?: number;
          format?: string;
          file_size_bytes?: number;
          created_at?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          bio: string | null;
          profile_image_id: string | null;
          website_url: string | null;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          bio?: string | null;
          profile_image_id?: string | null;
          website_url?: string | null;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          bio?: string | null;
          profile_image_id?: string | null;
          website_url?: string | null;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_image_id: string | null;
          website_url: string | null;
          description: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_image_id?: string | null;
          website_url?: string | null;
          description?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_image_id?: string | null;
          website_url?: string | null;
          description?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          sponsor_id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          status: CampaignStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sponsor_id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          body: Json;
          article_type: ArticleType;
          content_type: ContentType;
          status: ArticleStatus;
          featured_image_id: string | null;
          author_id: string | null;
          sponsor_id: string | null;
          published_at: string | null;
          scheduled_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          canonical_url: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          body?: Json;
          article_type: ArticleType;
          content_type?: ContentType;
          status?: ArticleStatus;
          featured_image_id?: string | null;
          author_id?: string | null;
          sponsor_id?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          body?: Json;
          article_type?: ArticleType;
          content_type?: ContentType;
          status?: ArticleStatus;
          featured_image_id?: string | null;
          author_id?: string | null;
          sponsor_id?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      article_authors: {
        Row: {
          id: string;
          article_id: string;
          author_id: string;
          contribution_type: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          article_id: string;
          author_id: string;
          contribution_type?: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          article_id?: string;
          author_id?: string;
          contribution_type?: string;
          display_order?: number;
        };
      };
      sponsored_content: {
        Row: {
          id: string;
          article_id: string;
          campaign_id: string;
          disclosure_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          campaign_id: string;
          disclosure_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          campaign_id?: string;
          disclosure_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          brand_name: string;
          image_id: string | null;
          original_price: number | null;
          sale_price: number | null;
          currency: string;
          product_url: string;
          link_type: LinkType;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          brand_name: string;
          image_id?: string | null;
          original_price?: number | null;
          sale_price?: number | null;
          currency?: string;
          product_url: string;
          link_type?: LinkType;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          brand_name?: string;
          image_id?: string | null;
          original_price?: number | null;
          sale_price?: number | null;
          currency?: string;
          product_url?: string;
          link_type?: LinkType;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      competitions: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          prize_summary: string;
          terms: string | null;
          start_time: string;
          end_time: string;
          status: CompetitionStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          prize_summary: string;
          terms?: string | null;
          start_time: string;
          end_time: string;
          status?: CompetitionStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          prize_summary?: string;
          terms?: string | null;
          start_time?: string;
          end_time?: string;
          status?: CompetitionStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      competition_entries: {
        Row: {
          id: string;
          competition_id: string;
          participant_name: string;
          email: string;
          phone: string | null;
          form_answers: Json;
          submitted_at: string;
          verification_status: VerificationStatus;
          is_eligible: boolean;
        };
        Insert: {
          id?: string;
          competition_id: string;
          participant_name: string;
          email: string;
          phone?: string | null;
          form_answers?: Json;
          submitted_at?: string;
          verification_status?: VerificationStatus;
          is_eligible?: boolean;
        };
        Update: {
          id?: string;
          competition_id?: string;
          participant_name?: string;
          email?: string;
          phone?: string | null;
          form_answers?: Json;
          submitted_at?: string;
          verification_status?: VerificationStatus;
          is_eligible?: boolean;
        };
      };
      competition_prizes: {
        Row: {
          id: string;
          competition_id: string;
          title: string;
          description: string | null;
          quantity: number;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          competition_id: string;
          title: string;
          description?: string | null;
          quantity?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          competition_id?: string;
          title?: string;
          description?: string | null;
          quantity?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ad_placements: {
        Row: {
          id: string;
          name: string;
          placement_key: string;
          description: string | null;
          supported_layouts: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          placement_key: string;
          description?: string | null;
          supported_layouts?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          placement_key?: string;
          description?: string | null;
          supported_layouts?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ad_creatives: {
        Row: {
          id: string;
          campaign_id: string | null;
          ad_placement_id: string;
          headline: string;
          copy: string | null;
          destination_url: string;
          desktop_image_id: string;
          mobile_image_id: string | null;
          start_date: string;
          end_date: string;
          status: CampaignStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          ad_placement_id: string;
          headline: string;
          copy?: string | null;
          destination_url: string;
          desktop_image_id: string;
          mobile_image_id?: string | null;
          start_date: string;
          end_date: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          ad_placement_id?: string;
          headline?: string;
          copy?: string | null;
          destination_url?: string;
          desktop_image_id?: string;
          mobile_image_id?: string | null;
          start_date?: string;
          end_date?: string;
          status?: CampaignStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          name: string;
          title: string | null;
          layout_type: LayoutType;
          source_mode: SourceMode;
          items_limit: number | null;
          display_order: number;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          name: string;
          title?: string | null;
          layout_type: LayoutType;
          source_mode?: SourceMode;
          items_limit?: number | null;
          display_order?: number;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          name?: string;
          title?: string | null;
          layout_type?: LayoutType;
          source_mode?: SourceMode;
          items_limit?: number | null;
          display_order?: number;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_items: {
        Row: {
          id: string;
          homepage_section_id: string;
          article_id: string | null;
          product_id: string | null;
          campaign_id: string | null;
          ad_creative_id: string | null;
          display_order: number;
          title_override: string | null;
          excerpt_override: string | null;
          visibility_start: string | null;
          visibility_end: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          homepage_section_id: string;
          article_id?: string | null;
          product_id?: string | null;
          campaign_id?: string | null;
          ad_creative_id?: string | null;
          display_order?: number;
          title_override?: string | null;
          excerpt_override?: string | null;
          visibility_start?: string | null;
          visibility_end?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          homepage_section_id?: string;
          article_id?: string | null;
          product_id?: string | null;
          campaign_id?: string | null;
          ad_creative_id?: string | null;
          display_order?: number;
          title_override?: string | null;
          excerpt_override?: string | null;
          visibility_start?: string | null;
          visibility_end?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      navigation_items: {
        Row: {
          id: string;
          label: string;
          url: string;
          parent_id: string | null;
          display_order: number;
          is_active: boolean;
          open_in_new_tab: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          url: string;
          parent_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          open_in_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          url?: string;
          parent_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          open_in_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_images: {
        Row: {
          id: string;
          article_id: string | null;
          product_id: string | null;
          homepage_item_id: string | null;
          campaign_id: string | null;
          placement: ImagePlacement;
          desktop_image_id: string;
          tablet_image_id: string | null;
          mobile_image_id: string | null;
          alt_text: string | null;
          focal_point_x: number | null;
          focal_point_y: number | null;
          fit_mode: FitMode;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id?: string | null;
          product_id?: string | null;
          homepage_item_id?: string | null;
          campaign_id?: string | null;
          placement: ImagePlacement;
          desktop_image_id: string;
          tablet_image_id?: string | null;
          mobile_image_id?: string | null;
          alt_text?: string | null;
          focal_point_x?: number | null;
          focal_point_y?: number | null;
          fit_mode?: FitMode;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string | null;
          product_id?: string | null;
          homepage_item_id?: string | null;
          campaign_id?: string | null;
          placement?: ImagePlacement;
          desktop_image_id?: string;
          tablet_image_id?: string | null;
          mobile_image_id?: string | null;
          alt_text?: string | null;
          focal_point_x?: number | null;
          focal_point_y?: number | null;
          fit_mode?: FitMode;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
