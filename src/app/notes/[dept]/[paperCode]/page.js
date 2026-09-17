import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug } from '@/lib/data/departments';
import { getPaperByCode } from '@/lib/data/papers';
import { getMaterialsByPaper } from '@/lib/data/materials';
import MaterialListClient from '@/components/MaterialListClient';
import { FileText, Star, User, Upload, ExternalLink, ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(dept.id, resolvedParams.paperCode);

  if (!dept || !paper) return { title: 'Subject Not Found' };

  const title = `${paper.paperName} (${paper.paperCode}) Notes | ${siteConfig.name}`;
  const description = `Study materials, module guides, and lecture notes for ${paper.paperName} (${paper.paperCode}) at ${siteConfig.university}.`;
  const url = `${siteConfig.url}/notes/${dept.id}/${paper.paperCode}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PaperDetailPage({ params }) {
  const resolvedParams = await params;
  const department = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(department.id, resolvedParams.paperCode);

  if (!department || !paper) {
    notFound();
  }

  const materials = await getMaterialsByPaper(department.id, paper.paperCode, 'notes');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: paper.paperName,
    description: `Study materials and lecture notes for ${paper.paperName} (${paper.paperCode}).`,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.university,
      sameAs: siteConfig.url,
    },
    courseCode: paper.paperCode,
    educationalCredentialAwarded: 'Degree',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ padding: '3rem 0 6rem 0' }}>
        <div className="container">
          
          {/* Breadcrumb Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 800 }}>
          <Link href="/notes" style={{ textDecoration: 'underline' }}>
            Departments
          </Link>
          <span>/</span>
          <Link href={`/notes/${department.id}`} style={{ textDecoration: 'underline' }}>
            {department.shortCode}
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }}>{paper.paperCode}</span>
        </nav>

        {/* Paper Summary Card */}
        <div
          className="neo-card"
          style={{
            padding: '2rem',
            backgroundColor: 'var(--white)',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span
              style={{
                backgroundColor: 'var(--primary-yellow)',
                border: '2px solid var(--black)',
                padding: '0.25rem 0.75rem',
                fontWeight: 900,
                fontSize: '0.9rem',
              }}
            >
              {paper.paperCode}
            </span>
            <span
              style={{
                backgroundColor: 'var(--primary-pink)',
                border: '2px solid var(--black)',
                padding: '0.25rem 0.75rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
              }}
            >
              Semester {paper.semester}
            </span>
            <span
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                padding: '0.25rem 0.75rem',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            >
              {department.name}
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {paper.paperName}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#333',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={18} fill={paper.ratingCount > 0 ? "#F59E0B" : "none"} color={paper.ratingCount > 0 ? "#B45309" : "#888"} />
              {paper.ratingCount > 0 ? (
                <>
                  <span>{paper.ratingAvg.toFixed(1)} / 5.0</span>
                  <span style={{ color: '#777', fontWeight: 600 }}>({paper.ratingCount} student {paper.ratingCount === 1 ? 'vote' : 'votes'})</span>
                </>
              ) : (
                <span style={{ color: '#777', fontWeight: 600 }}>No student ratings yet</span>
              )}
            </div>

            {paper.facultyName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={18} />
                <span>Instructor: {paper.facultyName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Available Files Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
              Available Study Materials
            </h2>

            <Link
              href="/upload"
              className="neo-button"
              style={{
                backgroundColor: 'var(--primary-yellow)',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Upload size={16} />
              <span>Upload Notes for this Subject</span>
            </Link>
          </div>

          {/* Interactive Material List with Secure In-App PDF Viewer */}
          <MaterialListClient
            materials={materials}
            legacyDriveLink={paper.driveLink}
            emptyMessage={`No materials uploaded yet for ${paper.paperName}`}
          />
        </div>

        {/* Security & Watermark Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-color)',
            border: '2px solid var(--black)',
            boxShadow: '3px 3px 0px 0px var(--black)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <ShieldAlert size={20} />
          <span>
            Materials are view-only. Inline viewer enforces session watermark traceability to deter unauthorized distribution.
          </span>
        </div>

      </div>
    </div>
    </>
  );
}
