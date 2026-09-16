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
  ('bca', 'Bachelor of Computer Applications', 'BCA', 'BCA', 6, 'Code', 'Application development, web technologies, and database administration.', 2, true),
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

-- ------------------------------------------------------------------------------
-- 2. SEED PAPERS (59 Legacy CSE Subjects)
-- ------------------------------------------------------------------------------
insert into public.papers (department_id, semester, paper_name, paper_code, is_active)
values
  -- Semester 1
  ('btech-cse', 1, 'Engineering Mathematics-1', 'M101', true),
  ('btech-cse', 1, 'Engineering Physics', 'PH101', true),
  ('btech-cse', 1, 'Basic Electrical Engineering', 'EE101', true),
  ('btech-cse', 1, 'C programming', 'CS101', true),
  ('btech-cse', 1, 'Professional Communication', 'HU101', true),
  ('btech-cse', 1, 'Programming for Problem Solving', 'CS102', true),

  -- Semester 2
  ('btech-cse', 2, 'Engineering Mathematics-II', 'M201', true),
  ('btech-cse', 2, 'Engineering Chemistry', 'CH201', true),
  ('btech-cse', 2, 'Basic Electronics', 'EC201', true),
  ('btech-cse', 2, 'Environmental Studies', 'ES201', true),
  ('btech-cse', 2, 'Indian Knowledge System', 'IKS201', true),
  ('btech-cse', 2, 'HTML', 'WEB201', true),
  ('btech-cse', 2, 'CSS', 'WEB202', true),

  -- Semester 3
  ('btech-cse', 3, 'Data Structure', 'CS301', true),
  ('btech-cse', 3, 'Digital Logic and Electronics', 'CS302', true),
  ('btech-cse', 3, 'Discrete Mathematics', 'M301', true),
  ('btech-cse', 3, 'Computer Organization and Architecture', 'CS303', true),
  ('btech-cse', 3, 'Economics for Engineers', 'HU301', true),
  ('btech-cse', 3, 'Java Script', 'WEB301', true),

  -- Semester 4
  ('btech-cse', 4, 'Design and Analysis of Algorithms', 'CS401', true),
  ('btech-cse', 4, 'Operating Systems', 'CS402', true),
  ('btech-cse', 4, 'Formal Language and Automata Theory', 'CS403', true),
  ('btech-cse', 4, 'Object Oriented Programming using Java', 'CS404', true),
  ('btech-cse', 4, 'Principles of Management', 'HU401', true),
  ('btech-cse', 4, 'Probability and Statistics', 'M401', true),

  -- Semester 5
  ('btech-cse', 5, 'Database Management Systems', 'CS501', true),
  ('btech-cse', 5, 'Compiler Design', 'CS502', true),
  ('btech-cse', 5, 'Computer Networks', 'CS503', true),
  ('btech-cse', 5, 'Artificial Intelligence', 'CS504', true),
  ('btech-cse', 5, 'Web and Internet Technology', 'CS505', true),
  ('btech-cse', 5, 'Software Engineering', 'CS506', true),
  ('btech-cse', 5, 'Aptitude', 'APT501', true),

  -- Semester 6
  ('btech-cse', 6, 'Machine Learning', 'CS601', true),
  ('btech-cse', 6, 'Cryptography and Network Security', 'CS602', true),
  ('btech-cse', 6, 'Computer Graphics', 'CS603', true),
  ('btech-cse', 6, 'Mobile Computing', 'CS604', true),
  ('btech-cse', 6, 'Natural Language Processing', 'CS605', true),
  ('btech-cse', 6, 'Cloud Computing', 'CS606', true),
  ('btech-cse', 6, 'Cyber Law and Ethics', 'HU601', true),

  -- Semester 7
  ('btech-cse', 7, 'Neural Networks and Deep Learning', 'CS701', true),
  ('btech-cse', 7, 'Advanced Algorithms', 'CS702', true),
  ('btech-cse', 7, 'High Performance Computing', 'CS703', true),
  ('btech-cse', 7, 'Advanced Operating Systems', 'CS704', true),
  ('btech-cse', 7, 'Information and Coding Theory', 'CS705', true),
  ('btech-cse', 7, 'Ad-Hoc and Sensor Networks', 'CS706', true),
  ('btech-cse', 7, 'Data Mining and Data Warehouse', 'CS707', true),
  ('btech-cse', 7, 'Computer Vision', 'CS708', true),
  ('btech-cse', 7, 'Parallel Computing', 'CS709', true),
  ('btech-cse', 7, 'Learning Optimization Techniques', 'CS710', true),
  ('btech-cse', 7, 'Human Resource Development and Organizational Behavior', 'HU701', true),

  -- Semester 8
  ('btech-cse', 8, 'Real Time Systems', 'CS801', true),
  ('btech-cse', 8, 'Data Analytics', 'CS802', true),
  ('btech-cse', 8, 'Soft Computing', 'CS803', true),
  ('btech-cse', 8, 'VLSI', 'EC801', true),
  ('btech-cse', 8, 'Bioinformatics', 'CS804', true),
  ('btech-cse', 8, 'Robotics', 'CS805', true),
  ('btech-cse', 8, 'Introduction to IoT', 'CS806', true),
  ('btech-cse', 8, 'Image Processing', 'CS807', true),
  ('btech-cse', 8, 'Optimization Techniques', 'M801', true)
on conflict (department_id, semester, paper_code) do update set
  paper_name = excluded.paper_name,
  is_active = excluded.is_active;
