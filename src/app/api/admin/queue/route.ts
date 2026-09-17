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
      .select('*, users!uploaded_by(name, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (matErr) console.error('[Admin Queue] Materials query error:', matErr);

    const formattedMaterials = (dbMaterials || []).map((m: any) => ({
      id: m.id,
      type: m.type,
      semester: m.semester,
      paperCode: m.paper_code,
      departmentId: m.department_id,
      title: m.title,
      description: m.description,
      uploaderName: m.users?.name || 'Unknown User',
      uploaderEmail: m.users?.email || 'N/A',
      fileSize: m.file_size,
      facultyName: m.faculty_name,
      storageKey: m.storage_key,
      status: m.status,
      createdAt: m.created_at,
    }));

        if (matErr) console.error('[Admin Queue] Materials query error:', matErr);

        const { data: dbUsers, error: usrErr } = await supabase
          .from('users')
          .select('*')
          .eq('account_status', 'pending')
          .order('created_at', { ascending: false });

        if (usrErr) console.error('[Admin Queue] Users query error:', usrErr);

    // Fetch pending listings
    const { data: dbListings, error: lstErr } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (lstErr) console.error('[Admin Queue] Listings query error:', lstErr);

    const formattedListings = (dbListings || []).map((l: any) => ({
      id: l.id,
      category: l.category,
      condition: l.condition,
      title: l.title,
      description: l.description,
      price: l.expected_price,
      sellerName: l.contact_name || 'Unknown',
      sellerPhone: l.contact_phone || 'N/A',
      sellerEmail: l.contact_email || 'N/A',
      department: l.department,
      status: l.status,
      createdAt: l.created_at,
    }));

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
      materials: formattedMaterials,
      accounts: dbUsers || [],
      listings: formattedListings,
      auditLogs: dbLogs || [],
      stats: {
        pendingMaterialsCount: formattedMaterials.length,
        pendingAccountsCount: (dbUsers || []).length,
        pendingListingsCount: formattedListings.length,
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
