import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export interface Material {
  id: string;
  type: 'notes' | 'pyq';
  departmentId: string;
  paperId?: string;
  semester: number;
  paperName: string;
  paperCode: string;
  section?: string;
  facultyName?: string;
  examType?: 'mid_sem' | 'final_sem';
  year?: number;
  title: string;
  description?: string;
  storageKey?: string;
  driveLink?: string;
  fileSize: number;
  pageCount: number;
  ratingAvg: number;
  ratingCount: number;
  uploadedByName?: string;
  createdAt: string;
}

export async function getLatestMaterials(limit = 4): Promise<Material[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('materials')
        .select('*, users!uploaded_by(name, email)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          type: m.type,
          departmentId: m.department_id,
          paperId: m.paper_id,
          semester: m.semester,
          paperName: m.paper_name,
          paperCode: m.paper_code,
          section: m.section,
          facultyName: m.faculty_name,
          examType: m.exam_type,
          year: m.year,
          title: m.title,
          description: m.description,
          storageKey: m.storage_key,
          fileSize: m.file_size,
          pageCount: m.page_count,
          ratingAvg: Number(m.rating_avg) || 0,
          ratingCount: m.rating_count || 0,
          uploadedByName: m.users?.name || (m.uploaded_by ? 'Verified Student' : undefined),
          createdAt: m.created_at,
        }));
      }
    } catch {
      // Return empty array
    }
  }

  return [];
}

export async function getMaterialsByPaper(
  departmentId: string,
  paperCode: string,
  type?: 'notes' | 'pyq'
): Promise<Material[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('materials')
        .select('*, users!uploaded_by(name, email)')
        .eq('department_id', departmentId)
        .eq('paper_code', paperCode)
        .eq('status', 'approved');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          type: m.type,
          departmentId: m.department_id,
          paperId: m.paper_id,
          semester: m.semester,
          paperName: m.paper_name,
          paperCode: m.paper_code,
          section: m.section,
          facultyName: m.faculty_name,
          examType: m.exam_type,
          year: m.year,
          title: m.title,
          description: m.description,
          storageKey: m.storage_key,
          fileSize: m.file_size,
          pageCount: m.page_count,
          ratingAvg: Number(m.rating_avg) || 0,
          ratingCount: m.rating_count || 0,
          uploadedByName: m.users?.name || (m.uploaded_by ? 'Verified Student' : undefined),
          createdAt: m.created_at,
        }));
      }
    } catch {
      // Return empty array
    }
  }

  return [];
}

export async function getMaterialById(id: string): Promise<Material | undefined> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('materials')
        .select('*, users!uploaded_by(name, email)')
        .eq('id', id)
        .single();

      if (!error && data) {
        const d = data as any;
        return {
          id: d.id,
          type: d.type,
          departmentId: d.department_id,
          paperId: d.paper_id,
          semester: d.semester,
          paperName: d.paper_name,
          paperCode: d.paper_code,
          section: d.section,
          facultyName: d.faculty_name,
          examType: d.exam_type,
          year: d.year,
          title: d.title,
          description: d.description,
          storageKey: d.storage_key,
          fileSize: d.file_size,
          pageCount: d.page_count,
          ratingAvg: Number(d.rating_avg) || 0,
          ratingCount: d.rating_count || 0,
          uploadedByName: d.users?.name || (d.uploaded_by ? 'Verified Student' : undefined),
          createdAt: d.created_at,
        };
      }
    } catch {
      // Ignore
    }
  }
  return undefined;
}

export async function getPYQMaterialsByDepartment(
  departmentId: string,
  semester?: number,
  examType?: 'mid_sem' | 'final_sem'
): Promise<Material[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('materials')
        .select('*, users!uploaded_by(name, email)')
        .eq('department_id', departmentId)
        .eq('type', 'pyq')
        .eq('status', 'approved');

      if (semester && semester > 0) {
        query = query.eq('semester', semester);
      }

      if (examType) {
        query = query.eq('exam_type', examType);
      }

      const { data, error } = await query.order('year', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          type: m.type,
          departmentId: m.department_id,
          paperId: m.paper_id,
          semester: m.semester,
          paperName: m.paper_name,
          paperCode: m.paper_code,
          section: m.section,
          facultyName: m.faculty_name,
          examType: m.exam_type,
          year: m.year,
          title: m.title,
          description: m.description,
          storageKey: m.storage_key,
          fileSize: m.file_size,
          pageCount: m.page_count,
          ratingAvg: Number(m.rating_avg) || 0,
          ratingCount: m.rating_count || 0,
          uploadedByName: m.users?.name || (m.uploaded_by ? 'Verified Student' : undefined),
          createdAt: m.created_at,
        }));
      }
    } catch {
      // Return empty array
    }
  }

  return [];
}


