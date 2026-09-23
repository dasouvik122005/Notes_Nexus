import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const isDownload = request.nextUrl.searchParams.get('download') === '1';

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from upstream: ${response.statusText}`);
    }

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/pdf');
    headers.set('Cache-Control', 'public, max-age=3600');
    
    if (isDownload) {
      headers.set('Content-Disposition', 'attachment; filename="Notes_Nexus_Document.pdf"');
    }

    // Return the stream directly to the client, bypassing CORS restrictions
    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Proxy API] Error fetching PDF:', error);
    return NextResponse.json({ error: 'Failed to proxy the PDF file' }, { status: 500 });
  }
}
