import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export interface Paper {
  id: string;
  departmentId: string;
  semester: number;
  paperName: string;
  paperCode: string;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  fileCount: number;
  facultyName?: string;
  driveLink?: string;
}

/**
 * Retrieves papers for a given department and semester.
 * A paper only appears in the system and UI after real materials have been uploaded and approved.
 */
export async function getPapersByDepartment(
  departmentId: string,
  semester?: number,
  search?: string
): Promise<Paper[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('papers')
        .select('id, department_id, semester, paper_name, paper_code, is_active')
        .eq('department_id', departmentId);

      if (semester && semester > 0) {
        query = query.eq('semester', semester);
      }

      if (search && search.trim()) {
        query = query.ilike('paper_name', `%${search.trim()}%`);
      }

      const { data, error } = await query.order('semester', { ascending: true });

      if (!error && data && data.length > 0) {
        // Fetch real approved material counts for this department
        let materialMap = new Map();
        try {
          const { data: materialsData } = await supabase
            .from('materials')
            .select('paper_code, rating_avg, rating_count')
            .eq('department_id', departmentId)
            .eq('status', 'approved');

          if (materialsData) {
            materialsData.forEach((m) => {
              const existing = materialMap.get(m.paper_code) || { count: 0, totalRating: 0, ratingsCount: 0 };
              existing.count += 1;
              if (m.rating_avg > 0) {
                existing.totalRating += Number(m.rating_avg);
                existing.ratingsCount += (m.rating_count || 1);
              }
              materialMap.set(m.paper_code, existing);
            });
          }
        } catch {
          // ignore
        }

        // Return only papers that have at least one approved contribution
        return data
          .map((p) => {
            const stats = materialMap.get(p.paper_code) || { count: 0, totalRating: 0, ratingsCount: 0 };
            return {
              id: p.id,
              departmentId: p.department_id,
              semester: p.semester,
              paperName: p.paper_name,
              paperCode: p.paper_code,
              isActive: p.is_active,
              ratingAvg: stats.count > 0 && stats.totalRating > 0 ? Number((stats.totalRating / stats.count).toFixed(1)) : 0,
              ratingCount: stats.ratingsCount,
              fileCount: stats.count,
            };
          })
          .filter((p) => p.fileCount > 0);
      }
    } catch {
      // Fall back to empty array
    }
  }

  return [];
}

export async function getPaperByCode(departmentId: string, paperCode: string): Promise<Paper | undefined> {
  const papers = await getPapersByDepartment(departmentId);
  return papers.find((p) => p.paperCode.toLowerCase() === paperCode.toLowerCase());
}
