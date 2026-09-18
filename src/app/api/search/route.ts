import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, notes, pyq, instruments
    const dept = searchParams.get('dept') || 'all';
    
    // Minimum 2 chars for search to avoid heavy queries
    if (query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();
    const results: any[] = [];
    const lowerQuery = query.toLowerCase().trim();

    // 1. Search Subjects (Papers) for Notes/PYQs
    if (type === 'all' || type === 'notes' || type === 'pyq') {
      let paperQuery = supabase
        .from('papers')
        .select('*, departments(short_code, name)')
        .eq('is_active', true);
        
      if (dept !== 'all') {
        paperQuery = paperQuery.eq('department_id', dept);
      }

      const { data: papersData, error: papersError } = await paperQuery;
      
      if (!papersError && papersData) {
        // We do local filtering because we want to check both paper_name and paper_code
        // Supabase `or` with `ilike` is fine, but since papers table is small, this is safe and allows smarter matching.
        const filteredPapers = papersData.filter(
          p => p.paper_name.toLowerCase().includes(lowerQuery) || p.paper_code.toLowerCase().includes(lowerQuery)
        );

        filteredPapers.forEach(paper => {
          // If "all" or "notes" requested, add as a notes result
          if (type === 'all' || type === 'notes') {
            results.push({
              id: `notes_${paper.id}`,
              type: 'notes',
              title: paper.paper_name,
              subtitle: `Semester ${paper.semester} • ${paper.departments?.short_code || paper.department_id}`,
              code: paper.paper_code,
              url: `/notes/${paper.department_id}/${paper.paper_code}`,
              departmentId: paper.department_id
            });
          }
          // If "all" or "pyq" requested, add as a PYQ result
          if (type === 'all' || type === 'pyq') {
            results.push({
              id: `pyq_${paper.id}`,
              type: 'pyq',
              title: paper.paper_name,
              subtitle: `Semester ${paper.semester} • ${paper.departments?.short_code || paper.department_id}`,
              code: paper.paper_code,
              url: `/pyq/${paper.department_id}/${paper.paper_code}`,
              departmentId: paper.department_id
            });
          }
        });
      }

      // Also search individual Materials
      let materialQuery = supabase
        .from('materials')
        .select('id, title, type, department_id, semester, paper_code, departments(short_code)')
        .eq('status', 'approved');
        
      if (dept !== 'all') {
        materialQuery = materialQuery.eq('department_id', dept);
      }
      if (type === 'notes') {
        materialQuery = materialQuery.eq('type', 'notes');
      } else if (type === 'pyq') {
        materialQuery = materialQuery.eq('type', 'pyq');
      }

      const { data: materialsData, error: materialsError } = await materialQuery;

      if (!materialsError && materialsData) {
        const filteredMaterials = materialsData.filter(
          m => m.title.toLowerCase().includes(lowerQuery) || m.paper_code.toLowerCase().includes(lowerQuery)
        );

        filteredMaterials.forEach(mat => {
          results.push({
            id: `material_${mat.id}`,
            type: mat.type,
            title: mat.title,
            subtitle: `Material • Sem ${mat.semester} • ${mat.departments?.short_code || mat.department_id}`,
            code: mat.paper_code,
            url: `/${mat.type}/${mat.department_id}/${mat.paper_code}`,
            departmentId: mat.department_id
          });
        });
      }
    }

    // 2. Search Marketplace Listings
    if (type === 'all' || type === 'instruments') {
      let listQuery = supabase
        .from('listings')
        .select('id, title, description, category, expected_price')
        .eq('status', 'approved');

      const { data: listingsData, error: listingsError } = await listQuery;

      if (!listingsError && listingsData) {
        const filteredListings = listingsData.filter(
          l => l.title.toLowerCase().includes(lowerQuery) || l.description.toLowerCase().includes(lowerQuery)
        );

        filteredListings.forEach(listing => {
          results.push({
            id: `listing_${listing.id}`,
            type: 'instruments',
            title: listing.title,
            subtitle: `₹${listing.expected_price} • ${listing.category}`,
            code: null,
            url: `/instruments`, 
            departmentId: 'all'
          });
        });
      }
    }

    // Sort: prioritise exact matches in title or code
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().startsWith(lowerQuery);
      const bTitleMatch = b.title.toLowerCase().startsWith(lowerQuery);
      const aCodeMatch = a.code?.toLowerCase() === lowerQuery;
      const bCodeMatch = b.code?.toLowerCase() === lowerQuery;
      
      if (aCodeMatch && !bCodeMatch) return -1;
      if (bCodeMatch && !aCodeMatch) return 1;
      if (aTitleMatch && !bTitleMatch) return -1;
      if (bTitleMatch && !aTitleMatch) return 1;
      return 0;
    });

    return NextResponse.json({ results });
  } catch (err) {
    console.error('Search API Error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
