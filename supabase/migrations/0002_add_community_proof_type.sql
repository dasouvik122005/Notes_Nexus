-- ==============================================================================
-- Notes Nexus Database Schema Migration
-- Migration: 0002_add_community_proof_type.sql
-- Description: Adds proof_type to communities table to distinguish link vs upload
-- ==============================================================================

-- 1. Add proof_type column
alter table if exists public.communities 
add column if not exists proof_type text default 'link' check (proof_type in ('link', 'upload'));

-- 2. Add "proofType" quoted alias column for camelCase compatibility
alter table if exists public.communities 
add column if not exists "proofType" text default 'link' check ("proofType" in ('link', 'upload'));

-- 3. Backfill existing rows: if verification_proof contains res.cloudinary.com, mark as upload, otherwise link
update public.communities 
set proof_type = case 
  when verification_proof like '%res.cloudinary.com%' then 'upload' 
  else 'link' 
end
where proof_type is null or proof_type = '';

update public.communities 
set "proofType" = proof_type
where "proofType" is null or "proofType" = '';
