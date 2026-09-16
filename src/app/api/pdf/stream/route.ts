import { NextRequest, NextResponse } from 'next/server';
import { getR2ObjectStream, isR2Configured } from '@/lib/storage/r2';
import { getMaterialById } from '@/lib/data/materials';

// Generate a valid minimal PDF buffer with dynamic academic title for offline/local testing
function createSamplePdfBuffer(title: string, paperCode: string, department: string): Uint8Array {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >>
endobj
5 0 obj
<< /Length 260 >>
stream
BT
/F1 22 Tf
50 720 Td
(NOTES NEXUS - STUDY MATERIAL) Tj
/F1 14 Tf
0 -35 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 12 Tf
0 -25 Td
(Paper Code: ${paperCode} | Dept: ${department}) Tj
0 -30 Td
(MODULE 1: INTRODUCTION AND FOUNDATIONS) Tj
/F1 10 Tf
0 -25 Td
(1.1 Overview of Core Principles and Architecture) Tj
0 -18 Td
(1.2 Fundamental Concepts, Axioms, and Definitions) Tj
0 -18 Td
(1.3 Practical Application Scenarios and Problem Formulation) Tj
0 -35 Td
([Academic Verification: Approved Student Study Material]) Tj
ET
endstream
endobj
6 0 obj
<< /Length 250 >>
stream
BT
/F1 16 Tf
50 720 Td
(MODULE 2: ADVANCED ANALYSIS & EXAM REVIEW) Tj
/F1 11 Tf
0 -30 Td
(2.1 In-depth Analysis, Proofs, and Derivations) Tj
0 -20 Td
(2.2 Frequently Asked Exam Problems and Step-by-Step Solutions) Tj
0 -20 Td
(2.3 Key Theorems, Summaries, and Quick Reference Notes) Tj
0 -40 Td
([Notes Nexus Academic Repository - View Only]) Tj
ET
endstream
endobj
7 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000339 00000 n 
0000000652 00000 n 
0000000955 00000 n 
trailer
<< /Size 8 /Root 1 0 R >>
startxref
1025
%%EOF`;

  return new TextEncoder().encode(content);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const materialId = searchParams.get('id') || 'sample';
  const key = searchParams.get('key');

  // Headers that block external download prompts and caching
  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="study-material.pdf"',
    'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
  });

  // 1. If R2 is configured and key is provided, stream from R2
  if (isR2Configured && key) {
    try {
      const stream = await getR2ObjectStream(key);
      if (stream) {
        // @ts-expect-error stream is compatible with Response Body
        return new NextResponse(stream, { headers });
      }
    } catch (err) {
      console.error('[PDF Stream] Error fetching from R2:', err);
    }
  }

  // 2. Fallback / Mock stream for local development & demonstration
  const material = getMaterialById(materialId);
  const title = material?.title || 'Academic Lecture Notes & Modules';
  const paperCode = material?.paperCode || 'CS301';
  const department = material?.departmentId?.toUpperCase() || 'CSE';

  const samplePdfBytes = createSamplePdfBuffer(title, paperCode, department);

  return new NextResponse(samplePdfBytes, { headers });
}
