import { NextResponse } from 'next/server';
import { signUploadRequest } from '@/lib/cloudinary/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { hasCloudinaryConfigured } from '@/lib/validation/env';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Verify authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Staff session required for media uploads.' },
        { status: 401 }
      );
    }

    if (!hasCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary server credentials are not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const folder = body.folder || 'kaftan/editorial';

    const signatureData = await signUploadRequest(folder);

    return NextResponse.json({
      success: true,
      data: signatureData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to sign media upload';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
