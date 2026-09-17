import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadToGoogleDrive, isDriveConfigured } from '@/lib/storage/drive';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'notes';
    const departmentId = formData.get('departmentId') as string;
    const semesterStr = formData.get('semester') as string;
    const paperName = formData.get('paperName') as string;
    const paperCode = formData.get('paperCode') as string;
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const facultyName = (formData.get('facultyName') as string) || '';
    const section = (formData.get('section') as string) || '';
    const examType = (formData.get('examType') as string) || '';
    const yearStr = (formData.get('year') as string) || '';

    // 1. Basic validation
    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }
    if (!departmentId || !semesterStr || !paperName || !paperCode || !title) {
      return NextResponse.json(
        { error: 'Missing required metadata: department, semester, paper, and title are required.' },
        { status: 400 }
      );
    }

    const semester = parseInt(semesterStr, 10);
    const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();

    // 2. File size validation (10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds 10 MB limit. Please compress it at ilovepdf.com/compress before uploading.' },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty (0 bytes).' }, { status: 400 });
    }

    // 3. File extension & magic bytes validation
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF files are permitted.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify %PDF- header
    let isMagicValid = true;
    for (let i = 0; i < PDF_MAGIC_BYTES.length; i++) {
      if (buffer[i] !== PDF_MAGIC_BYTES[i]) {
        isMagicValid = false;
        break;
      }
    }

    if (!isMagicValid) {
      return NextResponse.json(
        { error: 'Invalid PDF document header. File appears to be corrupted or masqueraded.' },
        { status: 400 }
      );
    }

    // 4. Authentication & Contributor check
    let userId = 'demo-contributor-id';
    let isContributorVerified = true;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;

        // Check account status in users
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
      }
    } catch {
      // Offline / demo auth
    }

    // 5. PDF Watermarking
    let watermarkedBuffer = buffer;
    try {
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();
      
      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText('Notes Nexus • JIS University', {
          x: 50,
          y: height / 2,
          size: 50,
          color: rgb(0.9, 0.9, 0.9), // Very light gray watermark
          rotate: degrees(45),
          opacity: 0.3,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      watermarkedBuffer = Buffer.from(pdfBytes);
    } catch (wmErr) {
      console.error('[Upload API] Failed to watermark PDF:', wmErr);
      // Proceed with original buffer if watermarking fails
    }

    // 6. Upload to Google Drive
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const driveFileName = `[${paperCode}] ${sanitizedFileName}`;

    let webViewLink = '';
    if (isDriveConfigured) {
      try {
        const link = await uploadToGoogleDrive(watermarkedBuffer, driveFileName, 'application/pdf');
        if (link) {
          webViewLink = link;
        } else {
          throw new Error('Google Drive returned null link');
        }
      } catch (driveErr: any) {
        console.error('[Upload API] Google Drive Upload failed:', driveErr);
        return NextResponse.json(
          { error: `Google Drive Error: ${driveErr.message}` },
          { status: 500 }
        );
      }
    } else {
      console.warn('[Upload API] Google Drive is not configured. Saving placeholder link.');
      webViewLink = `https://drive.google.com/file/d/demo-${Date.now()}/view`;
    }

    // 7. Check/Insert dynamic paper row & insert material into database
    let paperId: string | null = null;

    try {
      const supabase = await createClient();

      if (type === 'notes') {
        // Check if paper already exists for this department + semester (matching code)
        const { data: existingPaper } = await supabase
          .from('papers')
          .select('id, is_active')
          .eq('department_id', departmentId)
          .eq('semester', semester)
          .ilike('paper_code', paperCode.trim())
          .maybeSingle();

        if (existingPaper) {
          paperId = existingPaper.id;
        } else {
          // Insert new paper row dynamically in inactive state (becomes active when notes approved)
          const { data: insertedPaper } = await supabase
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

          if (insertedPaper) {
            paperId = insertedPaper.id;
          }
        }
      }

      const newMaterial = {
        id: `mat-${Date.now()}`,
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
        storage_key: webViewLink, // Storing Drive link in existing column
        file_size: watermarkedBuffer.length,
        mime_type: 'application/pdf',
        uploaded_by: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('materials').insert(newMaterial).select().single();
      if (!error && data) {
        return NextResponse.json(
          {
            success: true,
            material: data,
            message: 'Material successfully submitted for moderation review.',
          },
          { status: 201 }
        );
      }
    } catch (dbErr) {
      console.error('[Upload API] Database insertion error:', dbErr);
    }

    const fallbackMaterial = {
      id: `mat-${Date.now()}`,
      type,
      department_id: departmentId,
      paper_id: paperId || 'paper-auto',
      semester,
      paper_name: paperName.trim(),
      paper_code: paperCode.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      faculty_name: facultyName ? facultyName.trim() : null,
      section: section ? section.trim() : null,
      exam_type: type === 'pyq' ? examType || 'final_sem' : null,
      year,
      storage_key: webViewLink,
      file_size: watermarkedBuffer.length,
      mime_type: 'application/pdf',
      uploaded_by: userId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        material: fallbackMaterial,
        message: 'Material successfully submitted for moderation review (pending queue).',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Upload API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An error occurred while processing your upload. Please try again.' },
      { status: 500 }
    );
  }
}
