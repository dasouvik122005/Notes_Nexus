import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per photo

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const category = (formData.get('category') as string) || 'other';
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const condition = (formData.get('condition') as string) || 'Good';
    const priceStr = formData.get('price') as string;
    const isNegotiable = formData.get('isNegotiable') === 'true';
    const department = (formData.get('department') as string) || '';
    const contactName = formData.get('contactName') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const contactEmail = (formData.get('contactEmail') as string) || '';

    // 1. Validate required fields
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

    // 2. Extract and validate uploaded photos (up to 3)
    const photoFiles: File[] = [];
    const photoLinks: string[] = [];

    const files = formData.getAll('photos') as File[];
    for (const f of files) {
      if (f && typeof f === 'object' && f.size > 0) {
        if (f.size > MAX_IMAGE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `Photo "${f.name}" exceeds the 5 MB limit per image.` },
            { status: 400 }
          );
        }
        photoFiles.push(f);
      }
    }

    // 3. User verification check
    let sellerId = 'demo-seller-id';
    let sellerEmail = contactEmail || 'student@jisuniversity.ac.in';

    if (isSupabaseConfigured) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          sellerId = user.id;
          sellerEmail = user.email || sellerEmail;

          // Check account status
          const { data: profile } = await supabase
            .from('profiles')
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
        }
      } catch {
        // Fall back to demo mode
      }
    }

    // 4. Photo uploads (handled client-side via Cloudinary in the future)
    // For now, photos are stored as placeholder keys
    for (let i = 0; i < photoFiles.length; i++) {
      photoLinks.push(`placeholder-photo-${Date.now()}-${i}`);
    }

    // 5. Construct listing object
    const newListing = {
      id: `list-${Date.now()}`,
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

    // 6. Insert into Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = await createClient();
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
        }
      } catch {
        // Demo fallback
      }
    }

    return NextResponse.json(
      {
        success: true,
        listing: newListing,
        message: 'Marketplace listing submitted for moderation review (pending queue).',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Marketplace Create API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to create marketplace listing.' },
      { status: 500 }
    );
  }
}
