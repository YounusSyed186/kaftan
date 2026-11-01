import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_COMPETITION } from '@/lib/supabase/fallback-data';
import type { CompetitionRow, CompetitionPrizeRow, PopulatedCompetition } from '@/types/models';

export const FALLBACK_PRIZES: CompetitionPrizeRow[] = [
  {
    id: 'prize-1',
    competition_id: 'comp-1',
    title: 'Grand Prize: Luxury Silk Kaftan of Choice',
    description:
      'Winner selects any full-length silk kaftan or resort tunic from the current Fashion Spectrum collection (valued up to $350 AUD).',
    quantity: 1,
    display_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prize-2',
    competition_id: 'comp-1',
    title: 'Runner-Up: Handcrafted Pure Silk Resort Scarf',
    description:
      'Two runners-up receive a pure silk printed resort scarf valued at $95 AUD each.',
    quantity: 2,
    display_order: 2,
    created_at: '',
    updated_at: '',
  },
];

export async function getActiveCompetition(): Promise<PopulatedCompetition | null> {
  if (!hasSupabaseConfigured()) {
    return {
      ...FALLBACK_COMPETITION,
      prizes: FALLBACK_PRIZES,
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('competitions')
      .select('*, competition_prizes(*)')
      .eq('status', 'active')
      .lte('start_time', now)
      .gte('end_time', now)
      .single();

    if (error || !data) {
      return {
        ...FALLBACK_COMPETITION,
        prizes: FALLBACK_PRIZES,
      };
    }

    const comp = data as CompetitionRow & { competition_prizes?: CompetitionPrizeRow[] };
    return {
      ...comp,
      prizes:
        comp.competition_prizes && comp.competition_prizes.length > 0
          ? comp.competition_prizes
          : FALLBACK_PRIZES,
    };
  } catch {
    return {
      ...FALLBACK_COMPETITION,
      prizes: FALLBACK_PRIZES,
    };
  }
}

export async function getAllCompetitions(): Promise<PopulatedCompetition[]> {
  if (!hasSupabaseConfigured()) {
    return [{ ...FALLBACK_COMPETITION, prizes: FALLBACK_PRIZES }];
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('competitions')
      .select('*, competition_prizes(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [{ ...FALLBACK_COMPETITION, prizes: FALLBACK_PRIZES }];
    }

    return (data as any[]).map((comp) => ({
      ...comp,
      prizes:
        comp.competition_prizes && comp.competition_prizes.length > 0
          ? comp.competition_prizes
          : FALLBACK_PRIZES,
    }));
  } catch {
    return [{ ...FALLBACK_COMPETITION, prizes: FALLBACK_PRIZES }];
  }
}
