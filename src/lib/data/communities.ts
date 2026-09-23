import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export interface CommunityLinks {
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  twitter?: string;
  other?: string;
}

export interface JoinLinks {
  whatsapp?: string;
  discord?: string;
  telegram?: string;
  google_group?: string;
  registration_form?: string;
  other?: string;
}

export interface Community {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  category: string;
  department_id: string | null;
  official_links: CommunityLinks;
  join_links: JoinLinks;
  target_audience: string;
  community_type: string;
  focus_areas: string;
  major_activities: string | null;
  events_workshops: string | null;
  member_benefits: string | null;
  membership_fee: string;
  lead_name: string;
  lead_role: string;
  official_email: string;
  contact_number: string | null;
  faculty_coordinator: string | null;
  verification_proof: string;
  representative_linkedin: string | null;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  created_at: string;
}

/**
 * Retrieves all approved communities
 */
export async function getApprovedCommunities(): Promise<Community[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Community[];
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
    }
  }
  return [];
}

/**
 * Retrieves a single community by ID
 */
export async function getCommunityById(id: string): Promise<Community | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Community;
      }
    } catch (err) {
      console.error(`Error fetching community ${id}:`, err);
    }
  }
  return null;
}
