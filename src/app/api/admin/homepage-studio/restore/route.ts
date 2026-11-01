import { NextResponse } from 'next/server';
import { restoreHistoricalRevision } from '@/services/homepage-revisions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { revisionId } = body;

    if (!revisionId) {
      return NextResponse.json(
        { success: false, error: 'Missing revisionId' },
        { status: 400 }
      );
    }

    const res = await restoreHistoricalRevision(revisionId);
    return NextResponse.json({
      success: true,
      data: {
        sections: res.sections,
        version: res.version,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Restore failed' },
      { status: 500 }
    );
  }
}

