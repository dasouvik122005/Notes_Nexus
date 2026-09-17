-- ==============================================================================
-- Notes Nexus v2 Seed Data
-- File: supabase/seed.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED DEPARTMENTS
-- ------------------------------------------------------------------------------
insert into public.departments (id, name, short_code, degree_type, total_semesters, icon, description, sort_order, is_active)
values
  ('btech-cse', 'B.Tech Computer Science & Engineering', 'CSE', 'B.Tech', 8, 'Laptop', 'Core computing, data structures, artificial intelligence, software engineering.', 1, true),
  ('bca', 'Bachelor of Computer Applications', 'BCA', 'BCA', 8, 'Code', 'Application development, web technologies, and database administration.', 2, true),
  ('bpharma', 'Bachelor of Pharmacy', 'B.Pharma', 'B.Pharma', 8, 'FlaskConical', 'Pharmaceutical sciences, pharmacology, medicinal chemistry, and clinical research.', 3, true),
  ('mpharma', 'Master of Pharmacy', 'M.Pharma', 'M.Pharma', 4, 'Atom', 'Advanced pharmaceutics, pharmacology research, and regulatory affairs.', 4, true),
  ('bba-llb', 'BBA LL.B (Hons.)', 'BBA LLB', 'Law', 10, 'Scale', 'Corporate law, constitutional law, business administration, and criminal jurisprudence.', 5, true),
  ('bba', 'Bachelor of Business Administration', 'BBA', 'BBA', 6, 'Briefcase', 'Management principles, financial accounting, marketing, and business strategy.', 6, true),
  ('bioscience', 'Bioscience & Biotechnology', 'Bio', 'B.Sc / M.Sc', 6, 'Dna', 'Molecular biology, genetics, microbiology, and bioinformatics.', 7, true),
  ('physics', 'Department of Physics', 'PHY', 'B.Sc / M.Sc', 6, 'Atom', 'Classical mechanics, quantum physics, electromagnetism, and optics.', 8, true),
  ('mathematics', 'Department of Mathematics', 'MATH', 'B.Sc / M.Sc', 6, 'Sigma', 'Calculus, linear algebra, discrete structures, and mathematical modeling.', 9, true),
  ('education', 'Department of Education', 'EDU', 'B.Ed', 4, 'GraduationCap', 'Pedagogy, educational psychology, curriculum planning, and classroom teaching.', 10, true)
on conflict (id) do update set
  name = excluded.name,
  short_code = excluded.short_code,
  degree_type = excluded.degree_type,
  total_semesters = excluded.total_semesters,
  icon = excluded.icon,
  description = excluded.description,
  sort_order = excluded.sort_order;


