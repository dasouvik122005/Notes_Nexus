import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { applyRateLimit, markSoldLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 mark-sold requests per minute per IP
    const rateLimited = await applyRateLimit(markSoldLimiter, request);
    if (rateLimited) return rateLimited;

    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Check if the user is the owner or an admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';

    // Fetch the listing to verify ownership
    const { data: listing, error: listingErr } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', listingId)
      .single();

    if (listingErr || !listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    if (listing.seller_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden. You can only mark your own items as sold.' }, { status: 403 });
    }

    // Update status to 'sold'
    const { error: updateErr } = await supabase
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    if (updateErr) {
      console.error('[Mark Sold API] Error updating listing:', updateErr);
      return NextResponse.json({ error: 'Failed to update listing.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Item marked as sold.' });
  } catch (err) {
    console.error('[Mark Sold API] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
