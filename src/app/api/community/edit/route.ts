import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Community ID is required for editing.' }, { status: 400 });
    }

    // 1. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('account_status, role')
      .eq('id', user.id)
      .single();

    if (profile?.account_status === 'blocked') {
      return NextResponse.json({ error: 'Your account is blocked.' }, { status: 403 });
    }

    // 2. Fetch existing community to check ownership
    const adminClient = createAdminClient();
    const { data: existingCommunity, error: fetchErr } = await adminClient
      .from('communities')
      .select('submitted_by')
      .eq('id', id)
      .single();

    if (fetchErr || !existingCommunity) {
      return NextResponse.json({ error: 'Community not found.' }, { status: 404 });
    }

    // Check if the user is the owner OR an admin
    if (existingCommunity.submitted_by !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to edit this community.' }, { status: 403 });
    }

    // 3. Validate minimum fields if they are provided
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return NextResponse.json({ error: 'Community name cannot be empty.' }, { status: 400 });
    }
    
    if (updateData.join_links) {
      const hasJoinLink = Object.values(updateData.join_links).some((link) => link && typeof link === 'string' && link.trim() !== '');
      if (!hasJoinLink) {
        return NextResponse.json({ error: 'At least one Join Link is required.' }, { status: 400 });
      }
    }

    // 4. Update the database
    // Clean up data before update
    const cleanedData = { ...updateData };
    if (cleanedData.name) cleanedData.name = cleanedData.name.trim();
    if (cleanedData.description) cleanedData.description = cleanedData.description.trim();
    if (cleanedData.category) cleanedData.category = cleanedData.category.trim();
    if (cleanedData.department_id === 'all') cleanedData.department_id = null;

    const { data, error } = await adminClient
      .from('communities')
      .update(cleanedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Community Edit] Update error:', error);
      return NextResponse.json({ error: 'Database error. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Community successfully updated.',
      community: data
    }, { status: 200 });

  } catch (err) {
    console.error('[Community Edit] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
