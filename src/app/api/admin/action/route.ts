import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, reason, targetSummary } = body;

    if (!action || !id) {
      return NextResponse.json(
        { error: 'Parameters "action" and "id" are required.' },
        { status: 400 }
      );
    }

    if (action.startsWith('reject_') && (!reason || !reason.trim())) {
      return NextResponse.json(
        { error: 'A specific rejection reason is mandatory when rejecting items.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // Perform live DB update based on action
        if (action === 'approve_material') {
          const { data: updatedMaterial } = await supabase
            .from('materials')
            .update({
              status: 'approved',
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select('paper_id, department_id, semester, paper_code')
            .single();

          if (updatedMaterial?.paper_id) {
            await supabase
              .from('papers')
              .update({ is_active: true })
              .eq('id', updatedMaterial.paper_id);
          } else if (updatedMaterial?.department_id && updatedMaterial?.paper_code) {
            await supabase
              .from('papers')
              .update({ is_active: true })
              .eq('department_id', updatedMaterial.department_id)
              .eq('semester', updatedMaterial.semester)
              .ilike('paper_code', updatedMaterial.paper_code);
          }
        } else if (action === 'reject_material') {
          await supabase
            .from('materials')
            .update({
              status: 'rejected',
              reject_reason: reason.trim(),
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', id);
        } else if (action === 'approve_user' || action === 'verify_user') {
          await supabase
            .from('users')
            .update({
              account_status: 'verified',
              verified_by: user.id,
              verified_at: new Date().toISOString(),
            })
            .eq('id', id);
        } else if (action === 'block_user') {
          await supabase
            .from('users')
            .update({
              account_status: 'blocked',
            })
            .eq('id', id);
        } else if (action === 'approve_listing') {
          await supabase
            .from('listings')
            .update({
              status: 'approved',
            })
            .eq('id', id);
        } else if (action === 'reject_listing') {
          await supabase
            .from('listings')
            .update({
              status: 'rejected',
              reject_reason: reason.trim(),
            })
            .eq('id', id);
        }

        // Insert audit log
        await supabase.from('audit_log').insert({
          actor_id: user.id,
          action,
          entity_type: action.includes('material')
            ? 'material'
            : action.includes('user')
            ? 'user'
            : 'listing',
          entity_id: id,
          meta: {
            reason: reason ? reason.trim() : null,
            targetSummary: targetSummary || null,
          },
          created_at: new Date().toISOString(),
        });

    return NextResponse.json({
      success: true,
      action,
      id,
      message: `Action ${action} executed successfully.`,
    });
  } catch (err) {
    console.error('[Admin Action API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to process moderation action' },
      { status: 500 }
    );
  }
}
