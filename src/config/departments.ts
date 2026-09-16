/**
 * Department taxonomy and metadata.
 * Semester count is a property of each department, not a global constant.
 */
export interface Department {
  id: string;
  name: string;
  shortCode: string;
  degreeType: string;
  totalSemesters: number;
  icon: string;
  description?: string;
  isActive: boolean;
}

export const departments: Department[] = [
  {
    id: "btech-cse",
    name: "B.Tech Computer Science & Engineering",
    shortCode: "CSE",
    degreeType: "B.Tech",
    totalSemesters: 8,
    icon: "Laptop",
    description: "Core computing, data structures, artificial intelligence, software engineering.",
    isActive: true,
  },
  {
    id: "bca",
    name: "Bachelor of Computer Applications",
    shortCode: "BCA",
    degreeType: "BCA",
    totalSemesters: 6,
    icon: "Code",
    description: "Application development, web technologies, and database administration.",
    isActive: true,
  },
  {
    id: "bpharma",
    name: "Bachelor of Pharmacy",
    shortCode: "B.Pharma",
    degreeType: "B.Pharma",
    totalSemesters: 8,
    icon: "FlaskConical",
    description: "Pharmaceutical sciences, pharmacology, medicinal chemistry, and clinical research.",
    isActive: true,
  },
  {
    id: "mpharma",
    name: "Master of Pharmacy",
    shortCode: "M.Pharma",
    degreeType: "M.Pharma",
    totalSemesters: 4,
    icon: "Atom",
    description: "Advanced pharmaceutics, pharmacology research, and regulatory affairs.",
    isActive: true,
  },
  {
    id: "bba-llb",
    name: "BBA LL.B (Hons.)",
    shortCode: "BBA LLB",
    degreeType: "Law",
    totalSemesters: 10,
    icon: "Scale",
    description: "Corporate law, constitutional law, business administration, and criminal jurisprudence.",
    isActive: true,
  },
  {
    id: "bba",
    name: "Bachelor of Business Administration",
    shortCode: "BBA",
    degreeType: "BBA",
    totalSemesters: 6,
    icon: "Briefcase",
    description: "Management principles, financial accounting, marketing, and business strategy.",
    isActive: true,
  },
  {
    id: "bioscience",
    name: "Bioscience & Biotechnology",
    shortCode: "Bio",
    degreeType: "B.Sc / M.Sc",
    totalSemesters: 6,
    icon: "Dna",
    description: "Molecular biology, genetics, microbiology, and bioinformatics.",
    isActive: true,
  },
  {
    id: "physics",
    name: "Department of Physics",
    shortCode: "PHY",
    degreeType: "B.Sc / M.Sc",
    totalSemesters: 6,
    icon: "Atom",
    description: "Classical mechanics, quantum physics, electromagnetism, and optics.",
    isActive: true,
  },
  {
    id: "mathematics",
    name: "Department of Mathematics",
    shortCode: "MATH",
    degreeType: "B.Sc / M.Sc",
    totalSemesters: 6,
    icon: "Sigma",
    description: "Calculus, linear algebra, discrete structures, and mathematical modeling.",
    isActive: true,
  },
  {
    id: "education",
    name: "Department of Education",
    shortCode: "EDU",
    degreeType: "B.Ed",
    totalSemesters: 4,
    icon: "GraduationCap",
    description: "Pedagogy, educational psychology, curriculum planning, and classroom teaching.",
    isActive: true,
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((dept) => dept.id === id);
}
