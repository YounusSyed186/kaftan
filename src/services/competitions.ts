import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_COMPETITION } from '@/lib/supabase/fallback-data';
import type { CompetitionRow } from '@/types/models';

export async function getActiveCompetition(): Promise<CompetitionRow | null> {
  if (!hasSupabaseConfigured()) {
    return FALLBACK_COMPETITION;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'active')
      .lte('start_time', now)
      .gte('end_time', now)
      .single();

    if (error || !data) {
      return FALLBACK_COMPETITION;
    }

    return data as CompetitionRow;
  } catch {
    return FALLBACK_COMPETITION;
  }
}
