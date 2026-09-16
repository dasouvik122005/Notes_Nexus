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

const fallbackMaterials: Material[] = [
  {
    id: 'mat-1',
    type: 'notes',
    departmentId: 'btech-cse',
    semester: 3,
    paperName: 'Data Structure',
    paperCode: 'CS301',
    section: 'A & B',
    facultyName: 'Prof. T. Das',
    title: 'Complete Trees, Graphs & Dynamic Programming Module',
    description: 'Comprehensive handwritten lecture notes covering Binary Search Trees, AVL, and Graph Algorithms.',
    driveLink: 'https://drive.google.com/drive/folders/1-v40NeVyTZizHmuw-d71Fkn65e8Rruen?usp=sharing',
    fileSize: 14200000,
    pageCount: 68,
    ratingAvg: 4.9,
    ratingCount: 38,
    uploadedByName: 'Souvik Das',
    createdAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'mat-2',
    type: 'notes',
    departmentId: 'btech-cse',
    semester: 6,
    paperName: 'Machine Learning',
    paperCode: 'CS601',
    section: 'CSE Core',
    facultyName: 'Dr. R. Sen',
    title: 'Supervised Learning & Neural Net Foundations',
    description: 'Detailed cheat sheet with gradient descent, loss functions, and backpropagation walkthroughs.',
    driveLink: 'https://drive.google.com/drive/folders/1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE?usp=drive_link',
    fileSize: 8500000,
    pageCount: 42,
    ratingAvg: 4.8,
    ratingCount: 29,
    uploadedByName: 'Rajdip Garai',
    createdAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'mat-3',
    type: 'pyq',
    departmentId: 'btech-cse',
    semester: 1,
    paperName: 'Engineering Mathematics-1',
    paperCode: 'M101',
    examType: 'final_sem',
    year: 2024,
    title: 'End Sem Question Paper 2024 (Official)',
    description: 'Scanned official question paper with matrix rank, partial differentiation, and multiple integrals.',
    driveLink: 'https://drive.google.com/drive/folders/19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC?usp=sharing',
    fileSize: 4200000,
    pageCount: 4,
    ratingAvg: 4.7,
    ratingCount: 19,
    uploadedByName: 'Kumaresh Jana',
    createdAt: '2026-09-14T09:15:00Z',
  },
  {
    id: 'mat-4',
    type: 'notes',
    departmentId: 'bpharma',
    semester: 1,
    paperName: 'Human Anatomy and Physiology I',
    paperCode: 'BP101T',
    facultyName: 'Dr. Mukherjee',
    title: 'Cellular Physiology and Tissue Histology',
    description: 'Illustrated clinical study guide for first-year pharmacy students.',
    fileSize: 11800000,
    pageCount: 55,
    ratingAvg: 4.9,
    ratingCount: 21,
    uploadedByName: 'Ananya S.',
    createdAt: '2026-09-15T16:45:00Z',
  },
];

export async function getLatestMaterials(limit = 4): Promise<Material[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
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
          createdAt: m.created_at,
        }));
      }
    } catch {
      // Fall back to local items
    }
  }

  return fallbackMaterials.slice(0, limit);
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
        .select('*')
        .eq('department_id', departmentId)
        .eq('paper_code', paperCode)
        .eq('status', 'approved');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((m) => ({
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
        createdAt: m.created_at,
      }));
    }
    } catch {
      // Fall back to local
    }
  }

  return fallbackMaterials.filter(
    (m) =>
      m.departmentId === departmentId &&
      m.paperCode.toLowerCase() === paperCode.toLowerCase() &&
      (!type || m.type === type)
  );
}

export function getMaterialById(id: string): Material | undefined {
  return fallbackMaterials.find((m) => m.id === id);
}

