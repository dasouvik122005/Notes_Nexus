import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per photo

export async function POST(request: NextRequest) {
  try {
    const {
      category = 'other',
      title,
      description = '',
      condition = 'Good',
      price: priceStr,
      isNegotiable,
      department = '',
      contactName,
      contactPhone,
      contactEmail = '',
      photoLinks = []
    } = await request.json();

    if (!title || !priceStr || !contactName || !contactPhone) {
      return NextResponse.json(
        { error: 'Title, expected price, contact name, and contact phone are required.' },
        { status: 400 }
      );
    }

    const price = parseInt(priceStr, 10);
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: 'Expected price must be a valid positive number.' },
        { status: 400 }
      );
    }

    // 3. User verification check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to create a listing.' }, { status: 401 });
    }

    const sellerId = user.id;
    const sellerEmail = user.email || contactEmail || 'student@jisuniversity.ac.in';

    const { data: profile } = await supabase
      .from('users')
      .select('account_status, role')
      .eq('id', user.id)
      .single();

    if (profile?.account_status === 'blocked') {
      return NextResponse.json(
        { error: 'Your account has been blocked from creating marketplace listings.' },
        { status: 403 }
      );
    }
    if (profile?.account_status === 'pending' && profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Your account must be verified by an administrator before listing items.' },
        { status: 403 }
      );
    }

    // 4. Photo uploads (handled client-side via Cloudinary)
    // The client now uploads directly to Cloudinary and passes the URLs in photoLinks array.

    // 5. Construct listing object
    const newListing = {
      seller_id: sellerId,
      category,
      title: title.trim(),
      description: description.trim(),
      condition,
      expected_price: price,
      is_negotiable: isNegotiable,
      department: department.trim() || null,
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      contact_email: sellerEmail,
      photo_keys: photoLinks, // Now storing Drive links instead of R2 keys
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // 6. Insert into Supabase
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert(newListing)
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json(
        {
          success: true,
          listing: data,
          message: 'Marketplace listing submitted for moderation review.',
        },
        { status: 201 }
      );
    } else {
      console.error('[Marketplace API] Database insertion error:', error);
      return NextResponse.json({ error: 'Failed to save listing to database.' }, { status: 500 });
    }
  } catch (err) {
    console.error('[Marketplace Create API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to create marketplace listing.' },
      { status: 500 }
    );
  }
}
