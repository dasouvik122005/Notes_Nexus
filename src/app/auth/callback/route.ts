import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

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

      // If user is in ADMIN_EMAILS allowlist, elevate to admin role and verified status
      if (adminEmails.includes(userEmail)) {
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
                role: 'admin',
                account_status: 'verified',
                verified_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );
        } catch (adminErr) {
          console.error('Error promoting admin user:', adminErr);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or home with instructions
  return NextResponse.redirect(`${origin}/?error=auth_exchange_failed`);
}
