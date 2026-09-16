-- ==============================================================================
-- Notes Nexus v2 Database Schema Migration
-- Migration: 0001_init.sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ------------------------------------------------------------------------------
create table if not exists public.departments (
  id text primary key,
  name text not null,
  short_code text not null,
  degree_type text not null,
  total_semesters int not null default 8,
  icon text not null default 'BookOpen',
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 2. PAPERS (SUBJECTS)
-- ------------------------------------------------------------------------------
create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  department_id text not null references public.departments(id) on delete cascade,
  semester int not null,
  paper_name text not null,
  paper_code text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint unique_dept_sem_paper_code unique (department_id, semester, paper_code)
);

create index if index not exists idx_papers_dept_sem on public.papers (department_id, semester);

-- ------------------------------------------------------------------------------
-- 3. USERS (Profiles synced from auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  google_id text,
  email text not null unique,
  name text not null,
  avatar_url text,
  role text not null default 'contributor' check (role in ('visitor', 'contributor', 'admin')),
  account_status text not null default 'pending' check (account_status in ('pending', 'verified', 'blocked')),
  created_at timestamptz not null default now(),
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz
);

create index if not exists idx_users_email on public.users (email);
create index if not exists idx_users_status on public.users (account_status);

-- ------------------------------------------------------------------------------
-- 4. MATERIALS (Notes and PYQs)
-- ------------------------------------------------------------------------------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('notes', 'pyq')),
  department_id text not null references public.departments(id) on delete cascade,
  paper_id uuid references public.papers(id) on delete set null,
  semester int not null,
  paper_name text not null,
  paper_code text not null,
  section text,                     -- notes only, nullable
  faculty_name text,                -- notes only, nullable
  exam_type text check (exam_type in ('mid_sem', 'final_sem')), -- pyq only
  year int,                         -- required for pyq, optional for notes
  title text not null,
  description text,
  storage_key text not null,
  file_size bigint not null default 0,
  page_count int not null default 0,
  mime_type text not null default 'application/pdf',
  original_size bigint,
  compressed_size bigint,
  uploaded_by uuid references public.users(id) on delete set null,
  status text not null default 'pending' check (status in ('processing', 'pending', 'approved', 'rejected')),
  reject_reason text,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  view_count int not null default 0,
  rating_avg numeric(3, 2) not null default 0.00,
  rating_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_materials_lookup on public.materials (department_id, semester, type, status);
create index if not exists idx_materials_paper on public.materials (paper_id, status);
create index if not exists idx_materials_uploader on public.materials (uploaded_by);

-- ------------------------------------------------------------------------------
-- 5. RATINGS
-- ------------------------------------------------------------------------------
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materials(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  stars int not null check (stars >= 1 and stars <= 5),
  created_at timestamptz not null default now(),
  constraint unique_material_user_rating unique (material_id, user_id)
);

create index if not exists idx_ratings_material on public.ratings (material_id);

-- ------------------------------------------------------------------------------
-- 6. LISTINGS (Marketplace / Instruments)
-- ------------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.users(id) on delete cascade,
  category text not null check (category in ('book', 'instrument', 'other')),
  title text not null,
  description text not null,
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair')),
  expected_price numeric(10, 2) not null default 0.00,
  is_negotiable boolean not null default false,
  photo_keys text[] not null default '{}',
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'sold')),
  reject_reason text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '60 days')
);

create index if not exists idx_listings_feed on public.listings (category, status, created_at desc);
create index if not exists idx_listings_seller on public.listings (seller_id);

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOG
-- ------------------------------------------------------------------------------
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_created on public.audit_log (created_at desc);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Trigger: Automatically recalculate material rating_avg and rating_count
create or replace function public.recalculate_material_rating()
returns trigger as $$
declare
  target_material_id uuid;
begin
  if (TG_OP = 'DELETE') then
    target_material_id := OLD.material_id;
  else
    target_material_id := NEW.material_id;
  end if;

  update public.materials
  set
    rating_avg = coalesce((select round(avg(stars)::numeric, 2) from public.ratings where material_id = target_material_id), 0.00),
    rating_count = coalesce((select count(*) from public.ratings where material_id = target_material_id), 0)
  where id = target_material_id;

  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_ratings_aggregate on public.ratings;
create trigger trigger_ratings_aggregate
after insert or update or delete on public.ratings
for each row execute function public.recalculate_material_rating();

-- Trigger: Synchronize auth.users on Google OAuth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    google_id,
    email,
    name,
    avatar_url,
    role,
    account_status
  ) values (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    NEW.email,
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'contributor',
    'pending'
  )
  on conflict (id) do update set
    email = EXCLUDED.email,
    name = coalesce(EXCLUDED.name, public.users.name),
    avatar_url = coalesce(EXCLUDED.avatar_url, public.users.avatar_url);

  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.departments enable row level security;
alter table public.papers enable row level security;
alter table public.users enable row level security;
alter table public.materials enable row level security;
alter table public.ratings enable row level security;
alter table public.listings enable row level security;
alter table public.audit_log enable row level security;

-- Helper function: Check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin' and account_status = 'verified'
  );
end;
$$ language plpgsql security definer;

-- Helper function: Check if current user is verified contributor or admin
create or replace function public.is_verified_contributor()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid() and account_status = 'verified'
  );
end;
$$ language plpgsql security definer;

-- 1. Departments RLS
create policy "Departments are viewable by everyone"
  on public.departments for select
  using (is_active = true or public.is_admin());

create policy "Departments manageable by admins"
  on public.departments for all
  using (public.is_admin());

-- 2. Papers RLS
create policy "Papers are viewable by everyone"
  on public.papers for select
  using (is_active = true or public.is_admin());

create policy "Papers insertable by verified contributors"
  on public.papers for insert
  with check (public.is_verified_contributor());

create policy "Papers manageable by admins"
  on public.papers for all
  using (public.is_admin());

-- 3. Users RLS
create policy "Users can view public profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.users where id = auth.uid()));

create policy "Admins can manage all users"
  on public.users for all
  using (public.is_admin());

-- 4. Materials RLS
create policy "Approved materials are viewable by everyone"
  on public.materials for select
  using (status = 'approved' or auth.uid() = uploaded_by or public.is_admin());

create policy "Verified contributors can upload materials"
  on public.materials for insert
  with check (public.is_verified_contributor() and auth.uid() = uploaded_by);

create policy "Admins can manage materials"
  on public.materials for all
  using (public.is_admin());

-- 5. Ratings RLS
create policy "Ratings are viewable by everyone"
  on public.ratings for select
  using (true);

create policy "Authenticated users can rate once per material"
  on public.ratings for insert
  with check (auth.uid() = user_id and auth.uid() is not null);

create policy "Users can update own ratings"
  on public.ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete own ratings"
  on public.ratings for delete
  using (auth.uid() = user_id or public.is_admin());

-- 6. Listings RLS
create policy "Approved listings are viewable by everyone"
  on public.listings for select
  using (status = 'approved' or auth.uid() = seller_id or public.is_admin());

create policy "Verified contributors can create listings"
  on public.listings for insert
  with check (public.is_verified_contributor() and auth.uid() = seller_id);

create policy "Sellers can update own listings"
  on public.listings for update
  using (auth.uid() = seller_id or public.is_admin());

create policy "Admins can manage listings"
  on public.listings for all
  using (public.is_admin());

-- 7. Audit Log RLS
create policy "Admins can view audit logs"
  on public.audit_log for select
  using (public.is_admin());

create policy "Service can write audit logs"
  on public.audit_log for insert
  with check (true);
