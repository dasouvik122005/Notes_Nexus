import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateUploadSignature, isCloudinaryConfigured } from '@/lib/storage/cloudinary';

/**
 * Generate a signed upload signature so the browser can upload
 * directly to Cloudinary, bypassing Vercel's 4.5MB body limit.
 * Requires authentication to prevent abuse.
 */

const ALLOWED_FOLDERS = [
  'notes-nexus/notes',
  'notes-nexus/pyq',
  'notes-nexus/marketplace',
  'notes-nexus/pending',
];

export async function POST(request: NextRequest) {
  try {
    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured on the server.' },
        { status: 500 }
      );
    }

    // Authentication check — only signed-in users can get upload signatures
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to upload files.' },
        { status: 401 }
      );
    }

    // Check account status
    const { data: profile } = await supabase
      .from('users')
      .select('account_status, role')
      .eq('id', user.id)
      .single();

    if (profile?.account_status === 'blocked') {
      return NextResponse.json(
        { error: 'Your account has been blocked.' },
        { status: 403 }
      );
    }

    if (profile?.account_status === 'pending' && profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Your account must be verified before uploading.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { folder = 'notes-nexus/pending' } = body;

    // Validate folder against whitelist to prevent arbitrary uploads
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid upload folder.' },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000).toString();

    const paramsToSign: Record<string, string> = {
      timestamp,
      folder,
    };

    const signature = generateUploadSignature(paramsToSign);

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (err: any) {
    console.error('[Cloudinary Sign API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate upload signature.' },
      { status: 500 }
    );
  }
}

