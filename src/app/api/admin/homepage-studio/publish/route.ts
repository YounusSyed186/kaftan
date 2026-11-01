import { NextResponse } from 'next/server';
import { publishHomepageDraft } from '@/services/homepage-revisions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sections, notes } = body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot publish an empty homepage' },
        { status: 400 }
      );
    }

    const res = await publishHomepageDraft(sections, notes || '');
    return NextResponse.json({
      success: true,
      data: { revisionNumber: res.revisionNumber },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Publish failed' },
      { status: 500 }
    );
  }
}

