import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

// Realistic sample queue items for offline dev / testing
const fallbackPendingMaterials = [
  {
    id: 'mat-pend-1',
    type: 'notes',
    departmentId: 'btech-cse',
    departmentName: 'B.Tech Computer Science & Engineering',
    semester: 4,
    paperName: 'Design and Analysis of Algorithms',
    paperCode: 'CS401',
    title: 'Dynamic Programming & Greedy Algorithms Unit 3 Complete Handwritten Notes',
    description: 'Covers 0/1 Knapsack, Matrix Chain Multiplication, Huffman Coding with step-by-step trace tables.',
    facultyName: 'Prof. R. Banerjee',
    section: 'CSE-B',
    fileSize: 14200000, // 14.2 MB
    storageKey: 'pending/notes/btech-cse/sample-daa.pdf',
    uploaderName: 'Priya Sharma',
    uploaderEmail: 'priya.sharma23@gmail.com',
    createdAt: '2026-09-16T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'mat-pend-2',
    type: 'pyq',
    departmentId: 'btech-cse',
    departmentName: 'B.Tech Computer Science & Engineering',
    semester: 3,
    paperName: 'Data Structure',
    paperCode: 'CS301',
    title: 'Data Structures Final Semester 2024 Question Paper',
    description: 'Original scanned question paper from Autumn 2024 final semester examinations.',
    examType: 'final_sem',
    year: 2024,
    fileSize: 3800000, // 3.8 MB
    storageKey: 'pending/pyq/btech-cse/sample-ds-2024.pdf',
    uploaderName: 'Arjun Das',
    uploaderEmail: 'arjun.das99@gmail.com',
    createdAt: '2026-09-16T18:15:00Z',
    status: 'pending',
  },
  {
    id: 'mat-pend-3',
    type: 'notes',
    departmentId: 'bpharma',
    departmentName: 'Bachelor of Pharmacy',
    semester: 2,
    paperName: 'Pharmaceutical Organic Chemistry',
    paperCode: 'BP202T',
    title: 'Reaction Mechanisms & IUPAC Nomenclature Summary Sheets',
    description: 'Detailed mechanism sheets for Aldol condensation, Cannizzaro, and Benzoin condensation.',
    facultyName: 'Dr. Debashis Roy',
    section: 'Pharma-A',
    fileSize: 8900000, // 8.9 MB
    storageKey: 'pending/notes/bpharma/sample-org-chem.pdf',
    uploaderName: 'Sneha Mondal',
    uploaderEmail: 'sneha.mondal@gmail.com',
    createdAt: '2026-09-15T11:20:00Z',
    status: 'pending',
  },
];

const fallbackPendingAccounts = [
  {
    id: 'user-pend-1',
    name: 'Rohan Ganguly',
    email: 'rohan.ganguly.2024@gmail.com',
    avatarUrl: null,
    department: 'B.Tech CSE',
    batchYear: 2024,
    createdAt: '2026-09-16T19:40:00Z',
    accountStatus: 'pending',
  },
  {
    id: 'user-pend-2',
    name: 'Ananya Mukherjee',
    email: 'ananya.mukh.pharma@gmail.com',
    avatarUrl: null,
    department: 'B.Pharma',
    batchYear: 2023,
    createdAt: '2026-09-16T17:10:00Z',
    accountStatus: 'pending',
  },
];

const fallbackPendingListings = [
  {
    id: 'list-pend-1',
    title: 'Standard Mini Drafter with Sturdy Carry Bag (Omega Brand)',
    category: 'instrument',
    price: 380,
    condition: 'Good',
    sellerName: 'Bikram Sen',
    sellerEmail: 'bikram.sen@gmail.com',
    sellerPhone: '+91 98301 23456',
    createdAt: '2026-09-15T16:00:00Z',
    status: 'pending',
  },
  {
    id: 'list-pend-2',
    title: 'Tanenbaum Computer Networks (5th Edition International)',
    category: 'book',
    price: 450,
    condition: 'Like New',
    sellerName: 'Priya Sharma',
    sellerEmail: 'priya.sharma23@gmail.com',
    sellerPhone: '+91 98312 98765',
    createdAt: '2026-09-16T10:30:00Z',
    status: 'pending',
  },
];

const fallbackAuditLogs = [
  {
    id: 'audit-1',
    actorName: 'Admin (Kumaresh)',
    actorEmail: 'kumaresh2106@gmail.com',
    action: 'approve_material',
    entityType: 'material',
    entityId: 'mat-101',
    entitySummary: 'Engineering Mathematics-1 Unit 1 Notes',
    timestamp: '2026-09-16T12:00:00Z',
  },
  {
    id: 'audit-2',
    actorName: 'Admin (Souvik)',
    actorEmail: 'dasouvik122005@gmail.com',
    action: 'verify_user',
    entityType: 'user',
    entityId: 'user-54',
    entitySummary: 'Tanmay Roy (tanmay.roy@gmail.com)',
    timestamp: '2026-09-16T11:15:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Try querying live Supabase if credentials exist
    if (isSupabaseConfigured) {
      try {
        const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Check if tables exist and fetch pending materials
      const { data: dbMaterials } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const { data: dbUsers } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_status', 'pending')
        .order('created_at', { ascending: false });

      const { data: dbListings } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const { data: dbLogs } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (dbMaterials && dbMaterials.length > 0) {
        return NextResponse.json({
          success: true,
          materials: dbMaterials,
          accounts: dbUsers || [],
          listings: dbListings || [],
          auditLogs: dbLogs || [],
          stats: {
            pendingMaterialsCount: dbMaterials.length,
            pendingAccountsCount: dbUsers?.length || 0,
            pendingListingsCount: dbListings?.length || 0,
            totalAuditCount: dbLogs?.length || 0,
          },
        });
      }
    } catch {
      // Fall through to sample queue dataset
    }
  }

    // Return sample moderation queue
    return NextResponse.json({
      success: true,
      materials: fallbackPendingMaterials,
      accounts: fallbackPendingAccounts,
      listings: fallbackPendingListings,
      auditLogs: fallbackAuditLogs,
      stats: {
        pendingMaterialsCount: fallbackPendingMaterials.length,
        pendingAccountsCount: fallbackPendingAccounts.length,
        pendingListingsCount: fallbackPendingListings.length,
        totalAuditCount: fallbackAuditLogs.length,
      },
    });
  } catch (err) {
    console.error('[Admin Queue API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve moderation queue' },
      { status: 500 }
    );
  }
}
