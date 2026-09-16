import { NextRequest, NextResponse } from 'next/server';
import { getPapersByDepartment } from '@/lib/data/papers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const semesterParam = searchParams.get('semester');
    const search = searchParams.get('search') || undefined;

    if (!department) {
      return NextResponse.json(
        { error: 'Query parameter "department" is required' },
        { status: 400 }
      );
    }

    const semester = semesterParam ? parseInt(semesterParam, 10) : undefined;
    const papers = await getPapersByDepartment(department, semester, search);

    return NextResponse.json({
      success: true,
      department,
      semester: semester || null,
      papers,
      count: papers.length,
    });
  } catch (err) {
    console.error('[Papers API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve papers' },
      { status: 500 }
    );
  }
}
