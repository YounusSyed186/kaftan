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

export async function getAllProducts(options?: {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  search?: string;
  sort?: string;
  limit?: number;
}): Promise<PopulatedProduct[]> {
  let list = FALLBACK_PRODUCTS;

  if (hasSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      let query = supabase
        .from('products')
        .select(`
          *,
          image:media_assets(*)
        `)
        .eq('status', 'active');

      if (options?.brand) {
        query = query.eq('brand_name', options.brand);
      }
      if (options?.sort === 'price_asc') {
        query = query.order('sale_price', { ascending: true });
      } else if (options?.sort === 'price_desc') {
        query = query.order('sale_price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        list = data as unknown as PopulatedProduct[];
      }
    } catch {
      // Fallback to FALLBACK_PRODUCTS
    }
  }

  // Filter in memory for search, price, onSale, sort if needed
  let filtered = [...list];

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand_name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (options?.brand && options.brand !== 'all') {
    filtered = filtered.filter((p) => p.brand_name.toLowerCase() === options.brand?.toLowerCase());
  }

  if (options?.minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.sale_price ?? p.original_price ?? 0) >= options.minPrice!);
  }

  if (options?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.sale_price ?? p.original_price ?? 0) <= options.maxPrice!);
  }

  if (options?.onSale) {
    filtered = filtered.filter((p) => Boolean(p.sale_price && p.original_price && p.sale_price < p.original_price));
  }

  if (options?.sort === 'price_asc') {
    filtered.sort((a, b) => (a.sale_price ?? a.original_price ?? 0) - (b.sale_price ?? b.original_price ?? 0));
  } else if (options?.sort === 'price_desc') {
    filtered.sort((a, b) => (b.sale_price ?? b.original_price ?? 0) - (a.sale_price ?? a.original_price ?? 0));
  } else if (options?.sort === 'discount') {
    filtered.sort((a, b) => {
      const discA = a.original_price && a.sale_price ? (a.original_price - a.sale_price) / a.original_price : 0;
      const discB = b.original_price && b.sale_price ? (b.original_price - b.sale_price) / b.original_price : 0;
      return discB - discA;
    });
  }

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getRelatedProducts(currentSlug: string, limit = 4): Promise<PopulatedProduct[]> {
  const all = await getAllProducts();
  const filtered = all.filter((p) => p.slug !== currentSlug);
  return filtered.slice(0, limit);
}

export async function getUniqueBrands(): Promise<string[]> {
  const all = await getAllProducts();
  const brands = Array.from(new Set(all.map((p) => p.brand_name)));
  return brands.sort();
}
