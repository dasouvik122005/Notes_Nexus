import { NextRequest, NextResponse } from 'next/server';
import { getR2ObjectStream, isR2Configured } from '@/lib/storage/r2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Headers that block external download prompts and caching
  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="study-material.pdf"',
    'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
  });

  // 1. If R2 is configured and key is provided, stream from R2
  if (isR2Configured && key) {
    try {
      const stream = await getR2ObjectStream(key);
      if (stream) {
        // @ts-expect-error stream is compatible with Response Body
        return new NextResponse(stream, { headers });
      }
    } catch (err) {
      console.error('[PDF Stream] Error fetching from R2:', err);
    }
  }

  // If no object was found in R2 storage, return 404
  return NextResponse.json(
    { error: 'PDF file not found in storage.' },
    { status: 404 }
  );
}
