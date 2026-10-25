import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_NAVIGATION } from '@/lib/supabase/fallback-data';
import type { NavigationItemRow } from '@/types/models';

export async function getNavigationItems(): Promise<NavigationItemRow[]> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_NAVIGATION;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_NAVIGATION;
    }

    return data as NavigationItemRow[];
  } catch {
    return FALLBACK_NAVIGATION;
  }
}
