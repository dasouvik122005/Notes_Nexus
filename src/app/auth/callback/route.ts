import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/';
  // Prevent open redirects — only allow relative paths, block protocol-relative URLs
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = user.email?.toLowerCase() || '';

      const isAdmin = adminEmails.includes(userEmail);
      
      try {
        const adminClient = createAdminClient();
        await adminClient
          .from('users')
          .upsert(
            {
              id: user.id,
              email: userEmail,
              name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                userEmail.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url || null,
              role: isAdmin ? 'admin' : 'student',
              account_status: isAdmin ? 'verified' : 'pending',
              ...(isAdmin ? { verified_at: new Date().toISOString() } : {}),
            },
            { onConflict: 'id' }
          );
      } catch (adminErr) {
        console.error('Error upserting user profile:', adminErr);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or home with instructions
  return NextResponse.redirect(`${origin}/?error=auth_exchange_failed`);
}
