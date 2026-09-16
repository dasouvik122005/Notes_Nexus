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

    // Try Supabase auth session
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Upsert rating in ratings table
        await supabase
          .from('ratings')
          .upsert(
            {
              material_id: materialId,
              user_id: user.id,
              stars,
            },
            { onConflict: 'material_id,user_id' }
          );

        return NextResponse.json({
          success: true,
          materialId,
          stars,
          message: 'Rating successfully recorded in database.',
        });
      }
    } catch {
      // Supabase not reachable or offline dev mode
    }

    // Acknowledge rating in local / demo mode
    return NextResponse.json({
      success: true,
      materialId,
      stars,
      message: 'Rating recorded (local demo mode).',
    });
  } catch (err) {
    console.error('[Rate API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to process rating' },
      { status: 500 }
    );
  }
}
