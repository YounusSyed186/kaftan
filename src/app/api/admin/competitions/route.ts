import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { FALLBACK_COMPETITION } from '@/lib/supabase/fallback-data';
import type { CompetitionRow } from '@/types/models';

export async function GET() {
  if (!hasSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      data: [FALLBACK_COMPETITION],
    });
  }

  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = (await createServerSupabaseClient()) as any;
    }

    const { data, error } = await supabase
      .from('competitions')
      .select('*, competition_prizes(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [FALLBACK_COMPETITION],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch competitions';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      description,
      prize_summary,
      terms,
      start_time,
      end_time,
      status = 'active',
      prize_title,
      prize_description,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!prize_summary || !prize_summary.trim()) {
      return NextResponse.json({ error: 'Prize summary is required' }, { status: 400 });
    }

    const cleanSlug =
      slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const effectiveStartTime = start_time || new Date().toISOString();
    const effectiveEndTime =
      end_time || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    if (!hasSupabaseConfigured()) {
      // Return simulated saved competition for local development
      const savedCompetition: CompetitionRow = {
        id: id || `comp-${Date.now()}`,
        title: title.trim(),
        slug: cleanSlug,
        description: description?.trim() || null,
        prize_summary: prize_summary.trim(),
        terms: terms?.trim() || null,
        start_time: effectiveStartTime,
        end_time: effectiveEndTime,
        status: status as any,
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: 'Competition saved successfully',
        data: savedCompetition,
      });
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = (await createServerSupabaseClient()) as any;
    }

    // If making this competition active, close any currently active competition to respect unique constraint
    if (status === 'active') {
      let closeQuery = supabase
        .from('competitions')
        .update({ status: 'closed' })
        .eq('status', 'active');

      if (id) {
        closeQuery = closeQuery.neq('id', id);
      }
      await closeQuery;
    }

    let savedCompetition: CompetitionRow;

    if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      // Update existing
      const { data, error } = await supabase
        .from('competitions')
        .update({
          title: title.trim(),
          slug: cleanSlug,
          description: description?.trim() || null,
          prize_summary: prize_summary.trim(),
          terms: terms?.trim() || null,
          start_time: effectiveStartTime,
          end_time: effectiveEndTime,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedCompetition = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('competitions')
        .insert({
          title: title.trim(),
          slug: cleanSlug,
          description: description?.trim() || null,
          prize_summary: prize_summary.trim(),
          terms: terms?.trim() || null,
          start_time: effectiveStartTime,
          end_time: effectiveEndTime,
          status,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedCompetition = data;

      // Also create prize if provided
      if (prize_title && savedCompetition.id) {
        await supabase.from('competition_prizes').insert({
          competition_id: savedCompetition.id,
          title: prize_title.trim(),
          description: prize_description?.trim() || null,
          quantity: 1,
          display_order: 1,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Competition saved successfully',
      data: savedCompetition,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error saving competition';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

