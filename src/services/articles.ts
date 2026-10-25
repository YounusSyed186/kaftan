import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_ARTICLES } from '@/lib/supabase/fallback-data';
import type { PopulatedArticle } from '@/types/models';

export async function getLatestArticles(limit = 4): Promise<PopulatedArticle[]> {
  if (!hasSupabaseConfigured()) {
    // Return articles 2-5 for latest sidebar
    return FALLBACK_ARTICLES.slice(1, 1 + limit);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        featured_image:media_assets(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return FALLBACK_ARTICLES.slice(1, 1 + limit);
    }

    return data as unknown as PopulatedArticle[];
  } catch {
    return FALLBACK_ARTICLES.slice(1, 1 + limit);
  }
}

export async function getArticleBySlug(slug: string): Promise<PopulatedArticle | null> {
  if (!hasSupabaseConfigured()) {
    const found = FALLBACK_ARTICLES.find((a) => a.slug === slug);
    return found || null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        featured_image:media_assets(*),
        sponsor:sponsors(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
      return fallback || null;
    }

    return data as unknown as PopulatedArticle;
  } catch {
    return FALLBACK_ARTICLES.find((a) => a.slug === slug) || null;
  }
}

export async function getAllPublishedArticles(): Promise<PopulatedArticle[]> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_ARTICLES;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        featured_image:media_assets(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_ARTICLES;
    }

    return data as unknown as PopulatedArticle[];
  } catch {
    return FALLBACK_ARTICLES;
  }
}
