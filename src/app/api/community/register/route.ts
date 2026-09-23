import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      logo_url,
      description,
      category,
      department_id,
      official_links,
      join_links,
      target_audience,
      community_type,
      focus_areas,
      major_activities,
      events_workshops,
      member_benefits,
      membership_fee,
      lead_name,
      lead_role,
      official_email,
      contact_number,
      faculty_coordinator,
      verification_proof,
      representative_linkedin,
    } = body;

    // 1. Basic validation
    if (!name || !logo_url || !description || !category || !department_id || !target_audience || !community_type || !focus_areas || !lead_name || !lead_role || !official_email || !verification_proof) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure at least one join link is provided
    const hasJoinLink = Object.values(join_links || {}).some((link) => link && typeof link === 'string' && link.trim() !== '');
    if (!hasJoinLink) {
      return NextResponse.json({ error: 'At least one Join Link is required' }, { status: 400 });
    }

    // 2. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to register a community.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('account_status, role')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.account_status === 'blocked') {
        return NextResponse.json({ error: 'Your account is blocked.' }, { status: 403 });
      }
    }

    // 3. Insert into database
    const adminClient = createAdminClient();
    
    const newCommunity = {
      name: name.trim(),
      logo_url,
      description: description.trim(),
      category: category.trim(),
      department_id: department_id === 'all' ? null : department_id,
      official_links: official_links || {},
      join_links: join_links || {},
      target_audience: target_audience.trim(),
      community_type: community_type.trim(),
      focus_areas: focus_areas.trim(),
      major_activities: major_activities ? major_activities.trim() : null,
      events_workshops: events_workshops ? events_workshops.trim() : null,
      member_benefits: member_benefits ? member_benefits.trim() : null,
      membership_fee: membership_fee || 'Free',
      lead_name: lead_name.trim(),
      lead_role: lead_role.trim(),
      official_email: official_email.trim(),
      contact_number: contact_number ? contact_number.trim() : null,
      faculty_coordinator: faculty_coordinator ? faculty_coordinator.trim() : null,
      verification_proof: verification_proof.trim(),
      representative_linkedin: representative_linkedin ? representative_linkedin.trim() : null,
      submitted_by: user.id,
      status: 'pending',
      is_verified: false,
    };

    const { data, error } = await adminClient
      .from('communities')
      .insert(newCommunity)
      .select()
      .single();

    if (error) {
      console.error('[Community Registration] Insert error:', error);
      return NextResponse.json({ error: 'Database error. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Community successfully submitted for review.',
      community: data
    }, { status: 201 });

  } catch (err) {
    console.error('[Community Registration] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
