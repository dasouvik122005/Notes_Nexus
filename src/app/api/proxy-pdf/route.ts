import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, readLimiter } from '@/lib/rate-limit';

// Allowed origins for PDF proxying (OWASP A10: Server-Side Request Forgery Prevention)
const ALLOWED_HOSTS = ['res.cloudinary.com'];

function isAllowedHost(hostname: string): boolean {
  if (ALLOWED_HOSTS.includes(hostname)) return true;
  // Allow Supabase storage subdomains (e.g. *.supabase.co)
  if (hostname.endsWith('.supabase.co')) return true;
  return false;
}

export async function GET(request: NextRequest) {
  // Rate limit: 60 reads per minute per IP
  const rateLimited = await applyRateLimit(readLimiter, request);
  if (rateLimited) return rateLimited;

  const urlParam = request.nextUrl.searchParams.get('url');
  const isDownload = request.nextUrl.searchParams.get('download') === '1';

  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // SSRF Protection: strictly validate the target URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  // Enforce HTTPS
  if (parsedUrl.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 400 });
  }

  // Prevent embedded credentials
  if (parsedUrl.username || parsedUrl.password) {
    return NextResponse.json({ error: 'URLs with embedded credentials are not allowed' }, { status: 400 });
  }

  // Validate hostname against whitelist
  if (!isAllowedHost(parsedUrl.hostname)) {
    return NextResponse.json(
      { error: 'Forbidden. The requested host is not permitted by security policy.' },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      redirect: 'error', // Prevent SSRF via open redirects
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from upstream: ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.includes('application/pdf') && !contentType.includes('octet-stream')) {
      return NextResponse.json({ error: 'Target resource is not a PDF' }, { status: 400 });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('X-Content-Type-Options', 'nosniff');

    if (isDownload) {
      headers.set('Content-Disposition', 'attachment; filename="Notes_Nexus_Document.pdf"');
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Proxy API] Error fetching PDF:', error);
    return NextResponse.json({ error: 'Failed to proxy the PDF file' }, { status: 500 });
  }
}
