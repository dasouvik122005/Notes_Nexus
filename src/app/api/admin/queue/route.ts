import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    // Fetch pending materials
        const { data: dbMaterials, error: matErr } = await supabase
          .from('materials')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (matErr) console.error('[Admin Queue] Materials query error:', matErr);

        const { data: dbUsers, error: usrErr } = await supabase
          .from('users')
          .select('*')
          .eq('account_status', 'pending')
          .order('created_at', { ascending: false });

        if (usrErr) console.error('[Admin Queue] Users query error:', usrErr);

        const { data: dbListings, error: lstErr } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        if (lstErr) console.error('[Admin Queue] Listings query error:', lstErr);

        let dbLogs: any[] = [];
        try {
          const { data: logData } = await supabase
            .from('audit_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
          dbLogs = logData || [];
        } catch {
          // audit_log table may not exist yet
        }

    return NextResponse.json({
      success: true,
      materials: dbMaterials || [],
      accounts: dbUsers || [],
      listings: dbListings || [],
      auditLogs: dbLogs || [],
      stats: {
        pendingMaterialsCount: (dbMaterials || []).length,
        pendingAccountsCount: (dbUsers || []).length,
        pendingListingsCount: (dbListings || []).length,
        totalAuditCount: (dbLogs || []).length,
      },
    });
  } catch (err) {
    console.error('[Admin Queue API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve moderation queue' },
      { status: 500 }
    );
  }
}
