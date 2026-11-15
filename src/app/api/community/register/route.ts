import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { applyRateLimit, uploadLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const rateLimited = await applyRateLimit(uploadLimiter, request);
    if (rateLimited) return rateLimited;

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
      leadership_team,
      faculty_coordinator,
      verification_proof,
      proof_type,
      proofType,
      representative_linkedin,
    } = body;

    // 1. Basic validation
    if (!name || !logo_url || !description || !category || !department_id || !target_audience || !community_type || !focus_areas || !verification_proof) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // OWASP A03 / A08: Validate Cloudinary asset URLs for uploaded logos
    if (!logo_url.startsWith('https://res.cloudinary.com/')) {
      return NextResponse.json({ error: 'Invalid logo URL. Only Cloudinary URLs are accepted.' }, { status: 400 });
    }

    // Verification proof validation (accepts Cloudinary uploads OR valid public https links)
    const rawProof = typeof verification_proof === 'string' ? verification_proof.trim() : '';
    if (!rawProof) {
      return NextResponse.json({ error: 'Verification proof is required.' }, { status: 400 });
    }

    const lowerProof = rawProof.toLowerCase();
    if (
      lowerProof.startsWith('javascript:') ||
      lowerProof.startsWith('data:') ||
      lowerProof.startsWith('file:') ||
      lowerProof.startsWith('vbscript:')
    ) {
      return NextResponse.json({ error: 'Dangerous URL scheme detected. Only valid https:// links or Cloudinary uploads are accepted.' }, { status: 400 });
    }

    if (!rawProof.startsWith('https://')) {
      return NextResponse.json({ error: 'Please paste a valid https:// link to your official community page.' }, { status: 400 });
    }

    try {
      const parsedProof = new URL(rawProof);
      if (!parsedProof.hostname || !parsedProof.hostname.includes('.') || parsedProof.hostname.length < 3) {
        return NextResponse.json({ error: 'Please paste a valid https:// link with a complete domain name.' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Please paste a valid https:// link to your official community page.' }, { status: 400 });
    }

    const inferredProofType: 'link' | 'upload' =
      rawProof.includes('res.cloudinary.com') || proofType === 'upload' || proof_type === 'upload'
        ? 'upload'
        : 'link';

    if (!leadership_team || !Array.isArray(leadership_team) || leadership_team.length === 0) {
      return NextResponse.json({ error: 'At least one community lead is required.' }, { status: 400 });
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
    
    const newCommunity: Record<string, any> = {
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
      leadership_team: leadership_team,
      faculty_coordinator: faculty_coordinator ? faculty_coordinator.trim() : null,
      verification_proof: rawProof,
      proof_type: inferredProofType,
      representative_linkedin: representative_linkedin ? representative_linkedin.trim() : null,
      submitted_by: user.id,
      status: 'pending',
      is_verified: false,
    };

    let { data, error } = await adminClient
      .from('communities')
      .insert(newCommunity)
      .select()
      .single();

    // Fallback if proof_type column is not yet present in the live database
    if (error && (error.message?.includes('proof_type') || error.code === '42703')) {
      const { proof_type: _discard, ...fallbackCommunity } = newCommunity;
      const retryResult = await adminClient
        .from('communities')
        .insert(fallbackCommunity)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('[Community Registration] Insert error:', error);
      return NextResponse.json({ error: 'Database error. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Community successfully submitted for review.',
      community: {
        ...data,
        proofType: data?.proof_type || inferredProofType,
      }
    }, { status: 201 });

  } catch (err) {
    console.error('[Community Registration] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
