import { NextResponse } from 'next/server';
import { getHomepageRevisionsList } from '@/services/homepage-revisions';

export async function GET() {
  try {
    const revisions = await getHomepageRevisionsList();
    return NextResponse.json({ success: true, data: revisions });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch revisions' },
      { status: 500 }
    );
  }
}

