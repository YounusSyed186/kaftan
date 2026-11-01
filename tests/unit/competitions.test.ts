import { describe, it, expect } from 'vitest';
import { getActiveCompetition, FALLBACK_PRIZES } from '@/services/competitions';
import { FALLBACK_COMPETITION } from '@/lib/supabase/fallback-data';
import type { CompetitionRow } from '@/types/models';

describe('Competitions Service & Rules', () => {
  it('returns active fallback competition when supabase is not configured', async () => {
    const competition = await getActiveCompetition();
    expect(competition).toBeDefined();
    expect(competition?.title).toBe(FALLBACK_COMPETITION.title);
    expect(competition?.prize_summary).toContain('valued at up to $350 AUD');
    expect(competition?.prizes).toBeDefined();
    expect(competition?.prizes?.length).toBeGreaterThan(0);
  });

  it('validates competition eligibility based on time windows and status', () => {
    const isCompetitionOpen = (comp: Partial<CompetitionRow>): boolean => {
      if (comp.status !== 'active') return false;
      const now = Date.now();
      const start = new Date(comp.start_time || '').getTime();
      const end = new Date(comp.end_time || '').getTime();
      return now >= start && now <= end;
    };

    const activeComp: Partial<CompetitionRow> = {
      status: 'active',
      start_time: new Date(Date.now() - 100000).toISOString(),
      end_time: new Date(Date.now() + 10000000).toISOString(),
    };
    expect(isCompetitionOpen(activeComp)).toBe(true);

    const closedComp: Partial<CompetitionRow> = {
      status: 'closed',
      start_time: new Date(Date.now() - 100000).toISOString(),
      end_time: new Date(Date.now() + 10000000).toISOString(),
    };
    expect(isCompetitionOpen(closedComp)).toBe(false);

    const expiredComp: Partial<CompetitionRow> = {
      status: 'active',
      start_time: new Date(Date.now() - 2000000).toISOString(),
      end_time: new Date(Date.now() - 100000).toISOString(),
    };
    expect(isCompetitionOpen(expiredComp)).toBe(false);
  });

  it('verifies prize fallback list has expected grand prize structure', () => {
    expect(FALLBACK_PRIZES.length).toBe(2);
    expect(FALLBACK_PRIZES[0].title).toContain('Grand Prize');
    expect(FALLBACK_PRIZES[0].quantity).toBe(1);
    expect(FALLBACK_PRIZES[1].title).toContain('Runner-Up');
  });
});

