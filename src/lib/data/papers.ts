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

// Complete 59 CSE subjects from Phase 0 audit with legacy drive links preserved
const fallbackCSEPapers: Paper[] = [
  // Semester 1
  { id: 'cse-101', departmentId: 'btech-cse', semester: 1, paperName: 'Engineering Mathematics-1', paperCode: 'M101', isActive: true, ratingAvg: 4.8, ratingCount: 24, fileCount: 4, facultyName: 'Dr. S. K. Roy', driveLink: 'https://drive.google.com/drive/folders/19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC?usp=sharing' },
  { id: 'cse-102', departmentId: 'btech-cse', semester: 1, paperName: 'Engineering Physics', paperCode: 'PH101', isActive: true, ratingAvg: 4.6, ratingCount: 18, fileCount: 3, facultyName: 'Dr. P. Sen', driveLink: 'https://drive.google.com/drive/folders/1PjKnhqgwlWDVfcUkWrhVo59UQlllqhXE?usp=sharing' },
  { id: 'cse-103', departmentId: 'btech-cse', semester: 1, paperName: 'Basic Electrical Engineering', paperCode: 'EE101', isActive: true, ratingAvg: 4.3, ratingCount: 15, fileCount: 2, facultyName: 'Prof. A. Ghosh', driveLink: 'https://drive.google.com/drive/folders/1pALo1iYmINytMzFkzjJHU7yyCpjtHpaM?usp=sharing' },
  { id: 'cse-104', departmentId: 'btech-cse', semester: 1, paperName: 'C programming', paperCode: 'CS101', isActive: true, ratingAvg: 4.9, ratingCount: 38, fileCount: 6, facultyName: 'Prof. R. Banerjee', driveLink: 'https://drive.google.com/drive/folders/14cpebF5l2sjGi_51_JuYwn0RNa5JdEZ4?usp=sharing' },
  { id: 'cse-105', departmentId: 'btech-cse', semester: 1, paperName: 'Professional Communication', paperCode: 'HU101', isActive: true, ratingAvg: 4.2, ratingCount: 11, fileCount: 2, facultyName: 'Dr. M. Dutta' },
  { id: 'cse-106', departmentId: 'btech-cse', semester: 1, paperName: 'Programming for Problem Solving', paperCode: 'CS102', isActive: true, ratingAvg: 4.5, ratingCount: 20, fileCount: 3 },

  // Semester 2
  { id: 'cse-201', departmentId: 'btech-cse', semester: 2, paperName: 'Engineering Mathematics-II', paperCode: 'M201', isActive: true, ratingAvg: 4.7, ratingCount: 22, fileCount: 3 },
  { id: 'cse-202', departmentId: 'btech-cse', semester: 2, paperName: 'Engineering Chemistry', paperCode: 'CH201', isActive: true, ratingAvg: 4.4, ratingCount: 16, fileCount: 2, driveLink: 'https://drive.google.com/drive/folders/1WcYLATUrBVMOr_CAYZmJQCETWgcLKAiO?usp=sharing' },
  { id: 'cse-203', departmentId: 'btech-cse', semester: 2, paperName: 'Basic Electronics', paperCode: 'EC201', isActive: true, ratingAvg: 4.6, ratingCount: 19, fileCount: 3, driveLink: 'https://drive.google.com/drive/folders/1D2OU-9zE-nkKvH7YRc3seo3byAWWuj3W?usp=sharing' },
  { id: 'cse-204', departmentId: 'btech-cse', semester: 2, paperName: 'Environmental Studies', paperCode: 'ES201', isActive: true, ratingAvg: 4.3, ratingCount: 14, fileCount: 2, driveLink: 'https://drive.google.com/drive/folders/1vkFhoYksnMAaQPe0cIaPY-C0rDTtuDBK?usp=sharing' },
  { id: 'cse-205', departmentId: 'btech-cse', semester: 2, paperName: 'Indian Knowledge System', paperCode: 'IKS201', isActive: true, ratingAvg: 4.1, ratingCount: 9, fileCount: 1 },
  { id: 'cse-206', departmentId: 'btech-cse', semester: 2, paperName: 'HTML', paperCode: 'WEB201', isActive: true, ratingAvg: 4.8, ratingCount: 31, fileCount: 4, driveLink: 'https://drive.google.com/drive/folders/11LerP-u-VO534jLXe7UWhBawhEpINK22?usp=sharing' },
  { id: 'cse-207', departmentId: 'btech-cse', semester: 2, paperName: 'CSS', paperCode: 'WEB202', isActive: true, ratingAvg: 4.7, ratingCount: 28, fileCount: 4, driveLink: 'https://drive.google.com/drive/folders/1x5cgIVbjC8NMStu0xnq-v-Moe0RSbyaB?usp=sharing' },

  // Semester 3
  { id: 'cse-301', departmentId: 'btech-cse', semester: 3, paperName: 'Data Structure', paperCode: 'CS301', isActive: true, ratingAvg: 4.9, ratingCount: 45, fileCount: 7, facultyName: 'Prof. T. Das', driveLink: 'https://drive.google.com/drive/folders/1-v40NeVyTZizHmuw-d71Fkn65e8Rruen?usp=sharing' },
  { id: 'cse-302', departmentId: 'btech-cse', semester: 3, paperName: 'Digital Logic and Electronics', paperCode: 'CS302', isActive: true, ratingAvg: 4.5, ratingCount: 19, fileCount: 3 },
  { id: 'cse-303', departmentId: 'btech-cse', semester: 3, paperName: 'Discrete Mathematics', paperCode: 'M301', isActive: true, ratingAvg: 4.6, ratingCount: 23, fileCount: 3 },
  { id: 'cse-304', departmentId: 'btech-cse', semester: 3, paperName: 'Computer Organization and Architecture', paperCode: 'CS303', isActive: true, ratingAvg: 4.7, ratingCount: 26, fileCount: 4 },
  { id: 'cse-305', departmentId: 'btech-cse', semester: 3, paperName: 'Economics for Engineers', paperCode: 'HU301', isActive: true, ratingAvg: 4.2, ratingCount: 12, fileCount: 2 },
  { id: 'cse-306', departmentId: 'btech-cse', semester: 3, paperName: 'Java Script', paperCode: 'WEB301', isActive: true, ratingAvg: 4.8, ratingCount: 34, fileCount: 5, driveLink: 'https://drive.google.com/drive/folders/1Enu4uzASVj2d5jXALZIoAWWtqvVAQFnt?usp=sharing' },

  // Semester 4
  { id: 'cse-401', departmentId: 'btech-cse', semester: 4, paperName: 'Design and Analysis of Algorithms', paperCode: 'CS401', isActive: true, ratingAvg: 4.9, ratingCount: 41, fileCount: 5 },
  { id: 'cse-402', departmentId: 'btech-cse', semester: 4, paperName: 'Operating Systems', paperCode: 'CS402', isActive: true, ratingAvg: 4.8, ratingCount: 36, fileCount: 4 },
  { id: 'cse-403', departmentId: 'btech-cse', semester: 4, paperName: 'Formal Language and Automata Theory', paperCode: 'CS403', isActive: true, ratingAvg: 4.4, ratingCount: 17, fileCount: 3 },
  { id: 'cse-404', departmentId: 'btech-cse', semester: 4, paperName: 'Object Oriented Programming using Java', paperCode: 'CS404', isActive: true, ratingAvg: 4.8, ratingCount: 33, fileCount: 5 },
  { id: 'cse-405', departmentId: 'btech-cse', semester: 4, paperName: 'Principles of Management', paperCode: 'HU401', isActive: true, ratingAvg: 4.1, ratingCount: 10, fileCount: 2 },
  { id: 'cse-406', departmentId: 'btech-cse', semester: 4, paperName: 'Probability and Statistics', paperCode: 'M401', isActive: true, ratingAvg: 4.6, ratingCount: 21, fileCount: 3 },

  // Semester 5
  { id: 'cse-501', departmentId: 'btech-cse', semester: 5, paperName: 'Database Management Systems', paperCode: 'CS501', isActive: true, ratingAvg: 4.9, ratingCount: 39, fileCount: 6 },
  { id: 'cse-502', departmentId: 'btech-cse', semester: 5, paperName: 'Compiler Design', paperCode: 'CS502', isActive: true, ratingAvg: 4.5, ratingCount: 18, fileCount: 3 },
  { id: 'cse-503', departmentId: 'btech-cse', semester: 5, paperName: 'Computer Networks', paperCode: 'CS503', isActive: true, ratingAvg: 4.8, ratingCount: 32, fileCount: 4, driveLink: 'https://drive.google.com/drive/folders/1og3uY1n3jUXPMCKUGwoEaXz4kZDWHJ0B?usp=sharing' },
  { id: 'cse-504', departmentId: 'btech-cse', semester: 5, paperName: 'Artificial Intelligence', paperCode: 'CS504', isActive: true, ratingAvg: 4.8, ratingCount: 27, fileCount: 4, driveLink: 'https://drive.google.com/drive/folders/1v-M963QwhI8GZaOKXhORRMHUFHp56aS-?usp=sharing' },
  { id: 'cse-505', departmentId: 'btech-cse', semester: 5, paperName: 'Web and Internet Technology', paperCode: 'CS505', isActive: true, ratingAvg: 4.6, ratingCount: 24, fileCount: 3 },
  { id: 'cse-506', departmentId: 'btech-cse', semester: 5, paperName: 'Software Engineering', paperCode: 'CS506', isActive: true, ratingAvg: 4.4, ratingCount: 16, fileCount: 2 },
  { id: 'cse-507', departmentId: 'btech-cse', semester: 5, paperName: 'Aptitude', paperCode: 'APT501', isActive: true, ratingAvg: 4.7, ratingCount: 29, fileCount: 3, driveLink: 'https://drive.google.com/drive/folders/1AoOILHs9vFyuMsVuOOHNLR43oAmiTvAi?usp=sharing' },

  // Semester 6
  { id: 'cse-601', departmentId: 'btech-cse', semester: 6, paperName: 'Machine Learning', paperCode: 'CS601', isActive: true, ratingAvg: 4.9, ratingCount: 44, fileCount: 6, driveLink: 'https://drive.google.com/drive/folders/1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE?usp=drive_link' },
  { id: 'cse-602', departmentId: 'btech-cse', semester: 6, paperName: 'Cryptography and Network Security', paperCode: 'CS602', isActive: true, ratingAvg: 4.6, ratingCount: 22, fileCount: 3 },
  { id: 'cse-603', departmentId: 'btech-cse', semester: 6, paperName: 'Computer Graphics', paperCode: 'CS603', isActive: true, ratingAvg: 4.3, ratingCount: 15, fileCount: 2 },
  { id: 'cse-604', departmentId: 'btech-cse', semester: 6, paperName: 'Mobile Computing', paperCode: 'CS604', isActive: true, ratingAvg: 4.5, ratingCount: 19, fileCount: 3 },
  { id: 'cse-605', departmentId: 'btech-cse', semester: 6, paperName: 'Natural Language Processing', paperCode: 'CS605', isActive: true, ratingAvg: 4.7, ratingCount: 25, fileCount: 4 },
  { id: 'cse-606', departmentId: 'btech-cse', semester: 6, paperName: 'Cloud Computing', paperCode: 'CS606', isActive: true, ratingAvg: 4.6, ratingCount: 20, fileCount: 3 },
  { id: 'cse-607', departmentId: 'btech-cse', semester: 6, paperName: 'Cyber Law and Ethics', paperCode: 'HU601', isActive: true, ratingAvg: 4.2, ratingCount: 12, fileCount: 2 },

  // Semester 7
  { id: 'cse-701', departmentId: 'btech-cse', semester: 7, paperName: 'Neural Networks and Deep Learning', paperCode: 'CS701', isActive: true, ratingAvg: 4.9, ratingCount: 35, fileCount: 5 },
  { id: 'cse-702', departmentId: 'btech-cse', semester: 7, paperName: 'Advanced Algorithms', paperCode: 'CS702', isActive: true, ratingAvg: 4.7, ratingCount: 24, fileCount: 3 },
  { id: 'cse-703', departmentId: 'btech-cse', semester: 7, paperName: 'High Performance Computing', paperCode: 'CS703', isActive: true, ratingAvg: 4.4, ratingCount: 15, fileCount: 2 },
  { id: 'cse-704', departmentId: 'btech-cse', semester: 7, paperName: 'Advanced Operating Systems', paperCode: 'CS704', isActive: true, ratingAvg: 4.5, ratingCount: 17, fileCount: 2 },
  { id: 'cse-705', departmentId: 'btech-cse', semester: 7, paperName: 'Information and Coding Theory', paperCode: 'CS705', isActive: true, ratingAvg: 4.3, ratingCount: 13, fileCount: 2 },
  { id: 'cse-706', departmentId: 'btech-cse', semester: 7, paperName: 'Ad-Hoc and Sensor Networks', paperCode: 'CS706', isActive: true, ratingAvg: 4.2, ratingCount: 11, fileCount: 2 },
  { id: 'cse-707', departmentId: 'btech-cse', semester: 7, paperName: 'Data Mining and Data Warehouse', paperCode: 'CS707', isActive: true, ratingAvg: 4.6, ratingCount: 21, fileCount: 3 },
  { id: 'cse-708', departmentId: 'btech-cse', semester: 7, paperName: 'Computer Vision', paperCode: 'CS708', isActive: true, ratingAvg: 4.8, ratingCount: 28, fileCount: 4 },
  { id: 'cse-709', departmentId: 'btech-cse', semester: 7, paperName: 'Parallel Computing', paperCode: 'CS709', isActive: true, ratingAvg: 4.4, ratingCount: 14, fileCount: 2 },
  { id: 'cse-710', departmentId: 'btech-cse', semester: 7, paperName: 'Learning Optimization Techniques', paperCode: 'CS710', isActive: true, ratingAvg: 4.3, ratingCount: 12, fileCount: 2 },
  { id: 'cse-711', departmentId: 'btech-cse', semester: 7, paperName: 'Human Resource Development and Organizational Behavior', paperCode: 'HU701', isActive: true, ratingAvg: 4.1, ratingCount: 9, fileCount: 1 },

  // Semester 8
  { id: 'cse-801', departmentId: 'btech-cse', semester: 8, paperName: 'Real Time Systems', paperCode: 'CS801', isActive: true, ratingAvg: 4.6, ratingCount: 18, fileCount: 3 },
  { id: 'cse-802', departmentId: 'btech-cse', semester: 8, paperName: 'Data Analytics', paperCode: 'CS802', isActive: true, ratingAvg: 4.8, ratingCount: 26, fileCount: 4 },
  { id: 'cse-803', departmentId: 'btech-cse', semester: 8, paperName: 'Soft Computing', paperCode: 'CS803', isActive: true, ratingAvg: 4.5, ratingCount: 16, fileCount: 2 },
  { id: 'cse-804', departmentId: 'btech-cse', semester: 8, paperName: 'VLSI', paperCode: 'EC801', isActive: true, ratingAvg: 4.3, ratingCount: 13, fileCount: 2 },
  { id: 'cse-805', departmentId: 'btech-cse', semester: 8, paperName: 'Bioinformatics', paperCode: 'CS804', isActive: true, ratingAvg: 4.4, ratingCount: 14, fileCount: 2 },
  { id: 'cse-806', departmentId: 'btech-cse', semester: 8, paperName: 'Robotics', paperCode: 'CS805', isActive: true, ratingAvg: 4.7, ratingCount: 23, fileCount: 3 },
  { id: 'cse-807', departmentId: 'btech-cse', semester: 8, paperName: 'Introduction to IoT', paperCode: 'CS806', isActive: true, ratingAvg: 4.6, ratingCount: 20, fileCount: 3 },
  { id: 'cse-808', departmentId: 'btech-cse', semester: 8, paperName: 'Image Processing', paperCode: 'CS807', isActive: true, ratingAvg: 4.5, ratingCount: 19, fileCount: 3 },
  { id: 'cse-809', departmentId: 'btech-cse', semester: 8, paperName: 'Optimization Techniques', paperCode: 'M801', isActive: true, ratingAvg: 4.4, ratingCount: 15, fileCount: 2 }
];

// Sample papers for other departments so all 10 are browseable
const fallbackOtherPapers: Paper[] = [
  // BCA
  { id: 'bca-101', departmentId: 'bca', semester: 1, paperName: 'Digital Fundamentals', paperCode: 'BCA101', isActive: true, ratingAvg: 4.7, ratingCount: 15, fileCount: 3 },
  { id: 'bca-102', departmentId: 'bca', semester: 1, paperName: 'Introduction to Programming in C', paperCode: 'BCA102', isActive: true, ratingAvg: 4.8, ratingCount: 22, fileCount: 4 },
  { id: 'bca-201', departmentId: 'bca', semester: 2, paperName: 'Data Structures with C', paperCode: 'BCA201', isActive: true, ratingAvg: 4.9, ratingCount: 19, fileCount: 4 },
  { id: 'bca-301', departmentId: 'bca', semester: 3, paperName: 'Object Oriented Programming in Java', paperCode: 'BCA301', isActive: true, ratingAvg: 4.8, ratingCount: 24, fileCount: 3 },

  // B.Pharma
  { id: 'bp-101', departmentId: 'bpharma', semester: 1, paperName: 'Human Anatomy and Physiology I', paperCode: 'BP101T', isActive: true, ratingAvg: 4.9, ratingCount: 27, fileCount: 5 },
  { id: 'bp-102', departmentId: 'bpharma', semester: 1, paperName: 'Pharmaceutical Analysis I', paperCode: 'BP102T', isActive: true, ratingAvg: 4.6, ratingCount: 16, fileCount: 3 },
  { id: 'bp-201', departmentId: 'bpharma', semester: 2, paperName: 'Human Anatomy and Physiology II', paperCode: 'BP201T', isActive: true, ratingAvg: 4.8, ratingCount: 21, fileCount: 4 },
  { id: 'bp-301', departmentId: 'bpharma', semester: 3, paperName: 'Physical Pharmaceutics I', paperCode: 'BP301T', isActive: true, ratingAvg: 4.7, ratingCount: 18, fileCount: 3 },

  // M.Pharma
  { id: 'mp-101', departmentId: 'mpharma', semester: 1, paperName: 'Modern Pharmaceutical Analytical Techniques', paperCode: 'MPA101T', isActive: true, ratingAvg: 4.8, ratingCount: 14, fileCount: 3 },
  { id: 'mp-102', departmentId: 'mpharma', semester: 1, paperName: 'Advanced Pharmacology', paperCode: 'MPA102T', isActive: true, ratingAvg: 4.9, ratingCount: 16, fileCount: 4 },

  // BBA LLB
  { id: 'law-101', departmentId: 'bba-llb', semester: 1, paperName: 'Legal Method & Legal System', paperCode: 'LAW101', isActive: true, ratingAvg: 4.7, ratingCount: 20, fileCount: 3 },
  { id: 'law-102', departmentId: 'bba-llb', semester: 1, paperName: 'Law of Torts and Consumer Protection', paperCode: 'LAW102', isActive: true, ratingAvg: 4.8, ratingCount: 25, fileCount: 4 },
  { id: 'law-301', departmentId: 'bba-llb', semester: 3, paperName: 'Constitutional Law I', paperCode: 'LAW301', isActive: true, ratingAvg: 4.9, ratingCount: 30, fileCount: 5 },

  // BBA
  { id: 'bba-101', departmentId: 'bba', semester: 1, paperName: 'Principles of Management', paperCode: 'BBA101', isActive: true, ratingAvg: 4.6, ratingCount: 18, fileCount: 3 },
  { id: 'bba-102', departmentId: 'bba', semester: 1, paperName: 'Business Economics', paperCode: 'BBA102', isActive: true, ratingAvg: 4.5, ratingCount: 15, fileCount: 2 },

  // Bioscience
  { id: 'bio-101', departmentId: 'bioscience', semester: 1, paperName: 'Cell Biology & Genetics', paperCode: 'BIO101', isActive: true, ratingAvg: 4.8, ratingCount: 17, fileCount: 3 },
  { id: 'bio-201', departmentId: 'bioscience', semester: 2, paperName: 'Microbiology & Virology', paperCode: 'BIO201', isActive: true, ratingAvg: 4.7, ratingCount: 19, fileCount: 3 },

  // Physics
  { id: 'phy-101', departmentId: 'physics', semester: 1, paperName: 'Mechanics & Relativity', paperCode: 'PHY101', isActive: true, ratingAvg: 4.7, ratingCount: 16, fileCount: 3 },
  { id: 'phy-201', departmentId: 'physics', semester: 2, paperName: 'Electricity and Magnetism', paperCode: 'PHY201', isActive: true, ratingAvg: 4.8, ratingCount: 18, fileCount: 4 },

  // Mathematics
  { id: 'math-101', departmentId: 'mathematics', semester: 1, paperName: 'Calculus & Analytical Geometry', paperCode: 'MATH101', isActive: true, ratingAvg: 4.8, ratingCount: 21, fileCount: 4 },
  { id: 'math-201', departmentId: 'mathematics', semester: 2, paperName: 'Real Analysis', paperCode: 'MATH201', isActive: true, ratingAvg: 4.7, ratingCount: 19, fileCount: 3 },

  // Education
  { id: 'edu-101', departmentId: 'education', semester: 1, paperName: 'Childhood and Growing Up', paperCode: 'EDU101', isActive: true, ratingAvg: 4.8, ratingCount: 15, fileCount: 3 },
  { id: 'edu-102', departmentId: 'education', semester: 1, paperName: 'Contemporary India and Education', paperCode: 'EDU102', isActive: true, ratingAvg: 4.6, ratingCount: 13, fileCount: 2 }
];

const allFallbackPapers = [...fallbackCSEPapers, ...fallbackOtherPapers];

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
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true);

      if (semester && semester > 0) {
        query = query.eq('semester', semester);
      }

      if (search && search.trim()) {
        query = query.ilike('paper_name', `%${search.trim()}%`);
      }

      const { data, error } = await query.order('semester', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          departmentId: p.department_id,
          semester: p.semester,
          paperName: p.paper_name,
          paperCode: p.paper_code,
          isActive: p.is_active,
          ratingAvg: 4.8,
          ratingCount: 12,
          fileCount: 3,
        }));
      }
    } catch {
      // Fall back to local data
    }
  }

  return allFallbackPapers.filter((p) => {
    if (p.departmentId !== departmentId) return false;
    if (semester && semester > 0 && p.semester !== semester) return false;
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      return p.paperName.toLowerCase().includes(q) || p.paperCode.toLowerCase().includes(q);
    }
    return true;
  });
}

export async function getPaperByCode(departmentId: string, paperCode: string): Promise<Paper | undefined> {
  const papers = await getPapersByDepartment(departmentId);
  return papers.find((p) => p.paperCode.toLowerCase() === paperCode.toLowerCase());
}
