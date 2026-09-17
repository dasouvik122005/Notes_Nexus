import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: materialId } = await params;
    let stars = 0;
    try {
      const body = await request.json();
      stars = Number(body?.stars);
    } catch {
      try {
        const text = await request.text();
        const match = text.match(/"?stars"?\s*[:=]\s*(\d+)/i);
        if (match) stars = parseInt(match[1], 10);
      } catch {
        stars = 0;
      }
    }

    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Stars must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify Supabase auth session
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to rate materials.' }, { status: 401 });
    }

    // Upsert rating in ratings table
    const { error: upsertErr } = await supabase
      .from('ratings')
      .upsert(
        {
          material_id: materialId,
          user_id: user.id,
          stars,
        },
        { onConflict: 'material_id,user_id' }
      );

    if (upsertErr) {
      console.error('[Rate API] Database error:', upsertErr);
      return NextResponse.json({ error: 'Failed to save rating to database.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      materialId,
      stars,
      message: 'Rating successfully recorded.',
    });
  } catch (err) {
    console.error('[Rate API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to process rating' },
      { status: 500 }
    );
  }
}
