import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpe842p8v',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (!hasSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = (await createServerSupabaseClient()) as any;
    }
    let dbQuery = supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (query) {
      dbQuery = dbQuery.or(
        `original_filename.ilike.%${query}%,alt_text.ilike.%${query}%,storage_key.ilike.%${query}%`
      );
    }

    const { data, error } = await dbQuery;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch media assets';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt_text') as string) || '';
    const folder = (formData.get('folder') as string) || 'kaftan/uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using base64 data URI
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
      overwrite: true,
    });

    // Save to Supabase media_assets
    if (hasSupabaseConfigured()) {
      let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = (await createServerSupabaseClient()) as any;
    }
      const { data: asset, error: dbError } = await supabase
        .from('media_assets')
        .insert({
          storage_key: uploadResponse.public_id,
          original_filename: file.name,
          mime_type: uploadResponse.format ? `image/${uploadResponse.format}` : mimeType,
          width: uploadResponse.width,
          height: uploadResponse.height,
          file_size_bytes: uploadResponse.bytes,
          alt_text: altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: altText || null,
          metadata: {
            cloudinary_url: uploadResponse.secure_url,
          },
        })
        .select()
        .single();

      if (dbError) {
        return NextResponse.json(
          { success: false, error: `Asset uploaded to Cloudinary but failed to insert in DB: ${dbError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: asset,
      });
    }

    // Fallback if DB not configured
    return NextResponse.json({
      success: true,
      data: {
        id: `media-${Date.now()}`,
        storage_key: uploadResponse.public_id,
        original_filename: file.name,
        mime_type: mimeType,
        width: uploadResponse.width,
        height: uploadResponse.height,
        file_size_bytes: uploadResponse.bytes,
        alt_text: altText,
        metadata: { cloudinary_url: uploadResponse.secure_url },
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Media upload failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

