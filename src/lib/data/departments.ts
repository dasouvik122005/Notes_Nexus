import { departments as fallbackDepartments, type Department } from '@/config/departments';
import { createClient } from '@/lib/supabase/server';

export async function getDepartments(): Promise<Department[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        name: d.name,
        shortCode: d.short_code,
        degreeType: d.degree_type,
        totalSemesters: d.total_semesters,
        icon: d.icon,
        description: d.description || undefined,
        isActive: d.is_active,
      }));
    }
  } catch {
    // Fall back to local config
  }

  return fallbackDepartments.filter((d) => d.isActive);
}

export async function getDepartmentBySlug(id: string): Promise<Department | undefined> {
  const allDepts = await getDepartments();
  return allDepts.find((d) => d.id === id);
}
