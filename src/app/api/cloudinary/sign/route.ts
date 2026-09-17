import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature, isCloudinaryConfigured } from '@/lib/storage/cloudinary';

/**
 * Generate a signed upload signature so the browser can upload
 * directly to Cloudinary, bypassing Vercel's 4.5MB body limit.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { folder = 'notes-nexus/pending' } = body;

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
      { error: err.message || 'Failed to generate upload signature.' },
      { status: 500 }
    );
  }
}
