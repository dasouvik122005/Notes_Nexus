import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  // If Supabase is not configured yet in local environment, pass through immediately
  if (supabaseUrl.includes('placeholder')) {
    return response;
  }

  // If request has an OAuth authorization code and is not on /auth/callback, forward it for session exchange
  if (request.nextUrl.searchParams.has('code') && !pathname.startsWith('/auth/callback')) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = '/auth/callback';
    return NextResponse.redirect(callbackUrl);
  }

  const isAdminRoute = pathname.startsWith('/admin');

  // Check if cookies contain any active Supabase auth tokens
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes('sb-') && (c.name.includes('-auth-token') || c.name.includes('access-token'))
  );

  // BOTTLENECK FIX: Public routes with no auth cookies bypass remote network calls to Supabase completely.
  // This eliminates 200-600ms network delay per page navigation and prefetch request.
  if (!isAdminRoute && !hasAuthCookie) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Only the admin portal requires server-side blocking redirect
  if (isAdminRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      url.searchParams.set('auth_required', 'true');
      return NextResponse.redirect(url);
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = user.email?.toLowerCase() || '';
    const isAdmin = adminEmails.includes(userEmail);

    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  } else if (hasAuthCookie) {
    // For authenticated users visiting public pages, refresh session token softly
    try {
      await supabase.auth.getUser();
    } catch {
      // Ignore background network errors on public routes
    }
  }

  return response;
}

