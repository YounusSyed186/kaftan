import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_PRODUCTS } from '@/lib/supabase/fallback-data';
import type { PopulatedProduct } from '@/types/models';

export async function getFeaturedProducts(limit = 4): Promise<PopulatedProduct[]> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_PRODUCTS.slice(0, limit);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        image:media_assets(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS.slice(0, limit);
    }

    return data as unknown as PopulatedProduct[];
  } catch {
    return FALLBACK_PRODUCTS.slice(0, limit);
  }
}

export async function getProductBySlug(slug: string): Promise<PopulatedProduct | null> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        image:media_assets(*)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    return data as unknown as PopulatedProduct;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
