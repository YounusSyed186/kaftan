import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasSupabaseConfigured } from '@/lib/validation/env';

const entrySchema = z.object({
  competition_id: z.string().min(1, 'Competition ID is required'),
  participant_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  form_answers: z.record(z.string(), z.any()).default({}),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = entrySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { competition_id, participant_name, email, phone, form_answers } =
      parsed.data;

    if (!hasSupabaseConfigured()) {
      // In local dev without live database, return successful mock confirmation
      return NextResponse.json({
        success: true,
        message: 'Entry received in development mode.',
        entry_id: 'mock-entry-id',
      });
    }

    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(competition_id);
    let resolvedCompId = competition_id;

    if (!isUuid) {
      const { data: rawActiveComp } = await supabase
        .from('competitions')
        .select('id')
        .eq('status', 'active')
        .lte('start_time', now)
        .gte('end_time', now)
        .limit(1)
        .maybeSingle();

      const activeComp = rawActiveComp as { id: string } | null;
      if (activeComp?.id) {
        resolvedCompId = activeComp.id;
      }
    }

    // Verify competition is active
    const { data: rawComp, error: compError } = await supabase
      .from('competitions')
      .select('id, status, start_time, end_time')
      .eq('id', resolvedCompId)
      .single();

    const comp = rawComp as { id: string; status: string; start_time: string; end_time: string } | null;

    if (
      compError ||
      !comp ||
      comp.status !== 'active' ||
      comp.start_time > now ||
      comp.end_time < now
    ) {
      return NextResponse.json(
        { error: 'This competition is not currently accepting entries.' },
        { status: 400 }
      );
    }

    // Insert entry
    const entriesTable = supabase.from('competition_entries') as unknown as {
      insert: (record: Record<string, unknown>) => {
        select: (cols: string) => {
          single: () => Promise<{ data: { id: string; submitted_at: string } | null; error: unknown }>;
        };
      };
    };

    const { data: entry, error: insertError } = await entriesTable
      .insert({
        competition_id: resolvedCompId,
        participant_name,
        email,
        phone: phone || null,
        form_answers,
        verification_status: 'pending',
        is_eligible: true,
      })
      .select('id, submitted_at')
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to record competition entry.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your entry!',
      entry,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error processing competition entry';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
