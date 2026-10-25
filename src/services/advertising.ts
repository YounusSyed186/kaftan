import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_AD_CREATIVE } from '@/lib/supabase/fallback-data';
import type { PopulatedAdCreative } from '@/types/models';

export async function getEligibleAdCreative(placementKey = 'homepage_mid_split'): Promise<PopulatedAdCreative | null> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_AD_CREATIVE;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const { data: placement } = (await supabase
      .from('ad_placements')
      .select('id')
      .eq('placement_key', placementKey)
      .eq('is_active', true)
      .single()) as { data: { id: string } | null };

    if (!placement?.id) {
      return FALLBACK_AD_CREATIVE;
    }

    const { data, error } = await supabase
      .from('ad_creatives')
      .select(`
        *,
        desktop_image:media_assets!desktop_image_id(*),
        mobile_image:media_assets!mobile_image_id(*),
        campaign:campaigns(*)
      `)
      .eq('ad_placement_id', placement.id)
      .eq('status', 'active')
      .lte('start_date', now)
      .gte('end_date', now)
      .limit(1)
      .single();

    if (error || !data) {
      return FALLBACK_AD_CREATIVE;
    }

    return data as unknown as PopulatedAdCreative;
  } catch {
    return FALLBACK_AD_CREATIVE;
  }
}
