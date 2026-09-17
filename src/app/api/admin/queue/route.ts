import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Query live Supabase if credentials exist
    if (isSupabaseConfigured) {
      try {
        const supabase = await createClient();

        // Fetch pending materials
        const { data: dbMaterials } = await supabase
          .from('materials')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        const { data: dbUsers } = await supabase
          .from('profiles')
          .select('*')
          .eq('account_status', 'pending')
          .order('created_at', { ascending: false });

        const { data: dbListings } = await supabase
          .from('marketplace_items')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        const { data: dbLogs } = await supabase
          .from('audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

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
      } catch {
        // Return empty queue on DB error
      }
    }

    // Return clean empty queue if unconfigured or error
    return NextResponse.json({
      success: true,
      materials: [],
      accounts: [],
      listings: [],
      auditLogs: [],
      stats: {
        pendingMaterialsCount: 0,
        pendingAccountsCount: 0,
        pendingListingsCount: 0,
        totalAuditCount: 0,
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
