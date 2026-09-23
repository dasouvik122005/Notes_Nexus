import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in as admin.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // 1. Fetch all papers
    const { data: papers, error: papersErr } = await adminClient
      .from('papers')
      .select('*');

    if (papersErr || !papers) {
      return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
    }

    // 2. Group papers by normalized paper code
    const groups: Record<string, any[]> = {};
    for (const paper of papers) {
      // Group by department, semester, and normalized paper code
      const normCode = paper.paper_code.replace(/\s+/g, '').toUpperCase();
      const key = `${paper.department_id}_${paper.semester}_${normCode}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(paper);
    }

    const mergedLog = [];

    // 3. Process groups and merge
    for (const key in groups) {
      const group = groups[key];
      
      if (group.length > 1) {
        // If there are duplicates, pick the first one as primary
        const primary = group[0];
        const duplicates = group.slice(1);
        const normCode = primary.paper_code.replace(/\s+/g, '').toUpperCase();

        for (const dup of duplicates) {
          // Re-link all materials from the duplicate to the primary paper
          await adminClient
            .from('materials')
            .update({ paper_id: primary.id, paper_code: normCode })
            .eq('paper_id', dup.id);
          
          // Delete the duplicate paper
          await adminClient
            .from('papers')
            .delete()
            .eq('id', dup.id);
            
          mergedLog.push({
            action: 'merged',
            deleted_duplicate: dup.paper_code,
            kept_primary: normCode,
          });
        }

        // Normalize the primary paper's code as well
        if (primary.paper_code !== normCode) {
           await adminClient
            .from('papers')
            .update({ paper_code: normCode })
            .eq('id', primary.id);
        }
      } else {
        // If there's only 1 paper, just ensure its code is normalized
        const single = group[0];
        const normCode = single.paper_code.replace(/\s+/g, '').toUpperCase();
        
        if (single.paper_code !== normCode) {
           await adminClient
            .from('papers')
            .update({ paper_code: normCode })
            .eq('id', single.id);

           await adminClient
            .from('materials')
            .update({ paper_code: normCode })
            .eq('paper_id', single.id);
            
           mergedLog.push({
             action: 'normalized',
             from: single.paper_code,
             to: normCode
           });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database cleanup complete! Papers have been normalized and duplicates merged.', 
      mergedLog 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
