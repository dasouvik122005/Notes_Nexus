import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cloudinary, isCloudinaryConfigured } from '@/lib/storage/cloudinary';
import { applyRateLimit, adminActionLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 30 admin actions per minute per IP
    const rateLimited = await applyRateLimit(adminActionLimiter, request);
    if (rateLimited) return rateLimited;

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

    const adminClient = createAdminClient();
    // Verify the user has admin role
    const { data: profile } = await adminClient
            .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    

    // Perform live DB update based on action
        if (action === 'approve_material') {
          const { data: updatedMaterial } = await adminClient
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
            await adminClient
            .from('papers')
              .update({ is_active: true })
              .eq('id', updatedMaterial.paper_id);
          } else if (updatedMaterial?.department_id && updatedMaterial?.paper_code) {
            await adminClient
            .from('papers')
              .update({ is_active: true })
              .eq('department_id', updatedMaterial.department_id)
              .eq('semester', updatedMaterial.semester)
              .ilike('paper_code', updatedMaterial.paper_code);
          }
        } else if (action === 'hide_material') {
          const { error: hideErr } = await adminClient
            .from('materials')
            .update({
              status: 'rejected',
              reject_reason: 'HIDDEN_BY_ADMIN',
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', id);
            
          if (hideErr) {
            console.error('[Admin Action] Error hiding material:', hideErr);
            return NextResponse.json({ error: 'Failed to hide material.' }, { status: 500 });
          }
        } else if (action === 'unhide_material') {
          const { error: unhideErr } = await adminClient
            .from('materials')
            .update({
              status: 'approved',
              reject_reason: null,
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', id);

          if (unhideErr) {
             console.error('[Admin Action] Error unhiding material:', unhideErr);
             return NextResponse.json({ error: 'Failed to unhide material.' }, { status: 500 });
          }
        } else if (action === 'reject_material') {
          await adminClient
            .from('materials')
            .update({
              status: 'rejected',
              reject_reason: reason.trim(),
              reviewed_by: user.id,
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', id);
        } else if (action === 'delete_material') {
          // 1. Fetch material to get storage_key
          const { data: material, error: fetchErr } = await adminClient
            .from('materials')
            .select('storage_key')
            .eq('id', id)
            .single();

          if (fetchErr || !material) {
            console.error('[Admin Action] Error fetching material for deletion:', fetchErr);
            return NextResponse.json({ error: 'Material not found.' }, { status: 404 });
          }

          // 2. Extract Cloudinary Public ID from URL
          // Example: https://res.cloudinary.com/cloudname/image/upload/v12345/folder/filename.pdf
          const storageKey = material.storage_key;
          let publicId = '';
          
          try {
            const urlParts = storageKey.split('/');
            const uploadIndex = urlParts.findIndex((part: string) => part === 'upload');
            if (uploadIndex !== -1) {
              // The public ID is everything after the version number (e.g. v12345)
              const partsAfterUpload = urlParts.slice(uploadIndex + 2);
              // Remove file extension for raw/image files
              const fullPath = partsAfterUpload.join('/');
              publicId = fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;
            }
          } catch (e) {
            console.error('Failed to parse Cloudinary URL for public ID:', e);
          }

          // 3. Delete from Cloudinary
          if (publicId && isCloudinaryConfigured) {
            try {
              // We try deleting as both 'image' and 'raw' since PDFs can sometimes be classified as either
              await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
              await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            } catch (cloudErr) {
              console.error('[Admin Action] Cloudinary deletion error:', cloudErr);
              // We don't block the DB deletion if Cloudinary fails, but we log it.
            }
          }

          // 4. Delete from Supabase Database
          const { error: delErr } = await adminClient
            .from('materials')
            .delete()
            .eq('id', id);

          if (delErr) {
            console.error('[Admin Action] Error deleting material from DB:', delErr);
            return NextResponse.json({ error: 'Failed to delete material.' }, { status: 500 });
          }
        } else if (action === 'approve_user' || action === 'verify_user') {
          await adminClient
            .from('users')
            .update({
              account_status: 'verified',
              verified_by: user.id,
              verified_at: new Date().toISOString(),
            })
            .eq('id', id);
        } else if (action === 'block_user') {
          await adminClient
            .from('users')
            .update({
              account_status: 'blocked',
            })
            .eq('id', id);
        } else if (action === 'approve_listing') {
          await adminClient
            .from('listings')
            .update({
              status: 'approved',
            })
            .eq('id', id);
        } else if (action === 'reject_listing') {
          await adminClient
            .from('listings')
            .update({
              status: 'rejected',
              reject_reason: reason.trim(),
            })
            .eq('id', id);
        } else if (action === 'mark_sold_listing') {
          await adminClient
            .from('listings')
            .update({
              status: 'sold',
            })
            .eq('id', id);
        } else if (action === 'approve_community') {
          await adminClient
            .from('communities')
            .update({
              status: 'approved',
              is_verified: true,
            })
            .eq('id', id);
        } else if (action === 'hide_community') {
          await adminClient
            .from('communities')
            .update({
              status: 'rejected',
              reject_reason: 'HIDDEN_BY_ADMIN',
            })
            .eq('id', id);
        } else if (action === 'unhide_community') {
          await adminClient
            .from('communities')
            .update({
              status: 'approved',
              reject_reason: null,
            })
            .eq('id', id);
        } else if (action === 'reject_community') {
          await adminClient
            .from('communities')
            .update({
              status: 'rejected',
              reject_reason: reason?.trim() || null,
            })
            .eq('id', id);
        } else if (action === 'delete_community') {
          // 1. Fetch community to get logo_url
          const { data: community, error: fetchErr } = await adminClient
            .from('communities')
            .select('logo_url')
            .eq('id', id)
            .single();

          if (fetchErr || !community) {
            console.error('[Admin Action] Error fetching community for deletion:', fetchErr);
            return NextResponse.json({ error: 'Community not found.' }, { status: 404 });
          }

          // 2. Extract Cloudinary Public ID from URL
          const logoUrl = community.logo_url;
          let publicId = '';
          
          try {
            const urlParts = logoUrl.split('/');
            const uploadIndex = urlParts.findIndex((part: string) => part === 'upload');
            if (uploadIndex !== -1) {
              const partsAfterUpload = urlParts.slice(uploadIndex + 2);
              const fullPath = partsAfterUpload.join('/');
              publicId = fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;
            }
          } catch (e) {
            console.error('Failed to parse Cloudinary URL for public ID:', e);
          }

          // 3. Delete from Cloudinary
          if (publicId && isCloudinaryConfigured) {
            try {
              await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            } catch (cloudErr) {
              console.error('[Admin Action] Cloudinary deletion error:', cloudErr);
            }
          }

          // 4. Delete from Supabase Database
          await adminClient
            .from('communities')
            .delete()
            .eq('id', id);
        }

        // Insert audit log
        await adminClient.from('audit_log').insert({
          actor_id: user.id,
          action,
          entity_type: action.includes('material')
            ? 'material'
            : action.includes('user')
            ? 'user'
            : action.includes('community')
            ? 'community'
            : 'listing',
          entity_id: id,
          meta: {
            reason: reason ? reason.trim() : null,
            targetSummary: targetSummary || null,
          },
          created_at: new Date().toISOString(),
        });

        // Revalidate the public pages so new materials show up instantly
        if (action.includes('material')) {
          revalidatePath('/notes', 'layout');
          revalidatePath('/pyq', 'layout');
          revalidatePath('/', 'layout');
        } else if (action.includes('listing')) {
          revalidatePath('/instruments', 'layout');
        } else if (action.includes('community')) {
          revalidatePath('/community', 'layout');
        }

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
