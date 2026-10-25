import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import {
  FALLBACK_ARTICLES,
  FALLBACK_PRODUCTS,
  FALLBACK_AD_CREATIVE,
} from '@/lib/supabase/fallback-data';
import type { PopulatedHomepageSection } from '@/types/models';

import type { Database } from '@/types/database';

export async function getHomepageSections(): Promise<PopulatedHomepageSection[]> {
  if (!hasSupabaseConfigured()) {
    return getFallbackHomepageSections();
  }

  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const { data: sections, error: secError } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    const sectionRows = (sections || []) as Array<Database['public']['Tables']['homepage_sections']['Row']>;
    if (secError || sectionRows.length === 0) {
      return getFallbackHomepageSections();
    }

    const populatedSections: PopulatedHomepageSection[] = [];

    for (const section of sectionRows) {
      const { data: items } = await supabase
        .from('homepage_items')
        .select(`
          *,
          article:articles(
            *,
            author:authors(*),
            featured_image:media_assets(*),
            sponsor:sponsors(*)
          ),
          product:products(
            *,
            image:media_assets(*)
          ),
          ad_creative:ad_creatives(
            *,
            desktop_image:media_assets!desktop_image_id(*),
            mobile_image:media_assets!mobile_image_id(*)
          )
        `)
        .eq('homepage_section_id', section.id)
        .eq('is_active', true)
        .or(`visibility_start.is.null,visibility_start.lte.${now}`)
        .or(`visibility_end.is.null,visibility_end.gte.${now}`)
        .order('display_order', { ascending: true });

      populatedSections.push({
        ...section,
        items: (items || []) as unknown as PopulatedHomepageSection['items'],
      });
    }

    return populatedSections;
  } catch {
    return getFallbackHomepageSections();
  }
}

function getFallbackHomepageSections(): PopulatedHomepageSection[] {
  return [
    {
      id: 'sec-hero',
      section_key: 'hero_editorial',
      name: 'Hero Editorial',
      title: 'The Kaftan Edit',
      layout_type: 'hero',
      source_mode: 'manual',
      items_limit: 1,
      display_order: 1,
      is_active: true,
      settings: { show_latest_sidebar: true },
      created_at: '',
      updated_at: '',
      items: [
        {
          id: 'item-hero-1',
          homepage_section_id: 'sec-hero',
          article_id: FALLBACK_ARTICLES[0].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[0],
        },
      ],
    },
    {
      id: 'sec-feat-grid',
      section_key: 'featured_editorial_grid',
      name: 'Featured Editorial Grid',
      title: null,
      layout_type: 'grid',
      source_mode: 'manual',
      items_limit: 4,
      display_order: 3,
      is_active: true,
      settings: { layout: 'asymmetric_3col' },
      created_at: '',
      updated_at: '',
      items: [
        {
          id: 'item-feat-1',
          homepage_section_id: 'sec-feat-grid',
          article_id: FALLBACK_ARTICLES[5].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[5],
        },
        {
          id: 'item-feat-2',
          homepage_section_id: 'sec-feat-grid',
          article_id: FALLBACK_ARTICLES[6].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 2,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[6],
        },
        {
          id: 'item-feat-3',
          homepage_section_id: 'sec-feat-grid',
          article_id: FALLBACK_ARTICLES[7].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 3,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[7],
        },
        {
          id: 'item-feat-4',
          homepage_section_id: 'sec-feat-grid',
          article_id: FALLBACK_ARTICLES[8].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 4,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[8],
        },
      ],
    },
    {
      id: 'sec-sponsored-ad',
      section_key: 'sponsored_and_advertising',
      name: 'Sponsored & Advertising Split',
      title: null,
      layout_type: 'banner',
      source_mode: 'manual',
      items_limit: 2,
      display_order: 4,
      is_active: true,
      settings: { split: '50_50' },
      created_at: '',
      updated_at: '',
      items: [
        {
          id: 'item-spon-1',
          homepage_section_id: 'sec-sponsored-ad',
          article_id: FALLBACK_ARTICLES[9].id,
          product_id: null,
          campaign_id: null,
          ad_creative_id: null,
          display_order: 1,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          article: FALLBACK_ARTICLES[9],
        },
        {
          id: 'item-ad-1',
          homepage_section_id: 'sec-sponsored-ad',
          article_id: null,
          product_id: null,
          campaign_id: null,
          ad_creative_id: FALLBACK_AD_CREATIVE.id,
          display_order: 2,
          title_override: null,
          excerpt_override: null,
          visibility_start: null,
          visibility_end: null,
          is_active: true,
          created_at: '',
          updated_at: '',
          ad_creative: FALLBACK_AD_CREATIVE,
        },
      ],
    },
    {
      id: 'sec-clearance',
      section_key: 'clearance_sale',
      name: 'Clearance Sale',
      title: 'CLEARANCE SALE',
      layout_type: 'product_grid',
      source_mode: 'manual',
      items_limit: 4,
      display_order: 5,
      is_active: true,
      settings: { view_all_url: '/sale' },
      created_at: '',
      updated_at: '',
      items: FALLBACK_PRODUCTS.map((prod, idx) => ({
        id: `item-prod-${idx + 1}`,
        homepage_section_id: 'sec-clearance',
        article_id: null,
        product_id: prod.id,
        campaign_id: null,
        ad_creative_id: null,
        display_order: idx + 1,
        title_override: null,
        excerpt_override: null,
        visibility_start: null,
        visibility_end: null,
        is_active: true,
        created_at: '',
        updated_at: '',
        product: prod,
      })),
    },
    {
      id: 'sec-comp',
      section_key: 'competition_banner',
      name: 'Competition Banner',
      title: 'COMPETITION',
      layout_type: 'banner',
      source_mode: 'manual',
      items_limit: 1,
      display_order: 6,
      is_active: true,
      settings: { badge_text: 'WIN a Kaftan' },
      created_at: '',
      updated_at: '',
      items: [],
    },
    {
      id: 'sec-more',
      section_key: 'more_stories',
      name: 'More Stories',
      title: 'MORE STORIES',
      layout_type: 'grid',
      source_mode: 'automatic',
      items_limit: 4,
      display_order: 7,
      is_active: true,
      settings: { columns: 4, view_all_url: '/latest' },
      created_at: '',
      updated_at: '',
      items: FALLBACK_ARTICLES.slice(10, 14).map((art, idx) => ({
        id: `item-more-${idx + 1}`,
        homepage_section_id: 'sec-more',
        article_id: art.id,
        product_id: null,
        campaign_id: null,
        ad_creative_id: null,
        display_order: idx + 1,
        title_override: null,
        excerpt_override: null,
        visibility_start: null,
        visibility_end: null,
        is_active: true,
        created_at: '',
        updated_at: '',
        article: art,
      })),
    },
  ];
}
