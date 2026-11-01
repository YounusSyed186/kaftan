import { NextResponse } from 'next/server';
import { getActiveDraft, saveWorkingDraft } from '@/services/homepage-revisions';

export async function GET() {
  try {
    const draft = await getActiveDraft();
    return NextResponse.json({ success: true, data: draft });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sections, expectedVersion } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: sections must be an array' },
        { status: 400 }
      );
    }

    const res = await saveWorkingDraft(sections, expectedVersion || 1);
    if (res.conflict) {
      return NextResponse.json(
        { success: false, conflict: true, currentVersion: res.version },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, data: { version: res.version } });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Save draft failed' },
      { status: 500 }
    );
  }
}

