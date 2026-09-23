import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Next.js App Router config
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

/**
 * This route now receives the Cloudinary URL (uploaded directly from the browser)
 * along with metadata. No file is sent to this route — bypasses Vercel's 4.5MB limit.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      cloudinaryUrl,
      cloudinaryPublicId,
      fileSize,
      type = 'notes',
      departmentId,
      semester: semesterStr,
      paperName,
      paperCode,
      title,
      description = '',
      facultyName = '',
      section = '',
      examType = '',
      year: yearStr = '',
    } = body;

    // 1. Validate required fields
    if (!cloudinaryUrl) {
      return NextResponse.json({ error: 'Cloudinary upload URL is required.' }, { status: 400 });
    }
    // Validate that the URL is actually from Cloudinary to prevent storing arbitrary/malicious URLs
    if (!cloudinaryUrl.startsWith('https://res.cloudinary.com/')) {
      return NextResponse.json({ error: 'Invalid file URL. Only Cloudinary URLs are accepted.' }, { status: 400 });
    }
    if (!departmentId || !semesterStr || !paperName || !paperCode || !title) {
      return NextResponse.json(
        { error: 'Missing required metadata: department, semester, paper, and title are required.' },
        { status: 400 }
      );
    }

    const semester = parseInt(semesterStr, 10);
    let year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
    if (type === 'pyq') {
      const titleYearMatch = title.match(/\b(20[1-2][0-9])\b/);
      if (titleYearMatch) {
        year = parseInt(titleYearMatch[1], 10);
      }
    }

    // 2. Authentication & Contributor check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to upload.' }, { status: 401 });
    }

    const userId = user.id;

    const { data: profile } = await supabase
      .from('users')
      .select('account_status, role')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.account_status === 'blocked') {
        return NextResponse.json(
          { error: 'Your contributor account has been blocked by administrators.' },
          { status: 403 }
        );
      }
      if (profile.account_status === 'pending' && profile.role !== 'admin') {
        return NextResponse.json(
          {
            error:
              'Your contributor account is pending approval. You must be verified by a student admin before submitting materials.',
          },
          { status: 403 }
        );
      }
    }

    // Create an admin client to bypass RLS for inserts (since we already auth checked above)
    const adminClient = createAdminClient();

    // 3. Check/Insert dynamic paper row & insert material into database
    let paperId: string | null = null;

    if (type === 'notes') {
      const { data: existingPaper } = await adminClient
        .from('papers')
        .select('id, is_active')
        .eq('department_id', departmentId)
        .eq('semester', semester)
        .ilike('paper_code', paperCode.trim())
        .maybeSingle();

      if (existingPaper) {
        paperId = existingPaper.id;
      } else {
        const { data: insertedPaper, error: paperInsertError } = await adminClient
          .from('papers')
          .insert({
            department_id: departmentId,
            semester,
            paper_name: paperName.trim(),
            paper_code: paperCode.trim().toUpperCase(),
            is_active: false,
          })
          .select('id')
          .single();

        if (paperInsertError) {
          console.error('[Upload API] Paper Insert Error:', paperInsertError);
        }

        if (insertedPaper) {
          paperId = insertedPaper.id;
        }
      }
    }

    const newMaterial = {
      type,
      department_id: departmentId,
      paper_id: paperId,
      semester,
      paper_name: paperName.trim(),
      paper_code: paperCode.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      faculty_name: facultyName ? facultyName.trim() : null,
      section: section ? section.trim() : null,
      exam_type: type === 'pyq' ? examType || 'final_sem' : null,
      year,
      storage_key: cloudinaryUrl, // Cloudinary URL stored here
      file_size: fileSize || 0,
      mime_type: 'application/pdf',
      uploaded_by: userId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await adminClient.from('materials').insert(newMaterial).select().single();
    if (!error && data) {
      return NextResponse.json(
        {
          success: true,
          material: data,
          message: 'Material successfully submitted for moderation review.',
        },
        { status: 201 }
      );
    } else {
      console.error('[Upload API] Database insertion error:', error);
      return NextResponse.json({ error: 'Failed to save material to database. Please try again.' }, { status: 500 });
    }
  } catch (err) {
    console.error('[Upload API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An error occurred while processing your upload. Please try again.' },
      { status: 500 }
    );
  }
}
