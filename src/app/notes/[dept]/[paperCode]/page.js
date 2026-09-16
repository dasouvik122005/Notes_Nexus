import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug } from '@/lib/data/departments';
import { getPaperByCode } from '@/lib/data/papers';
import { getMaterialsByPaper } from '@/lib/data/materials';
import { FileText, Star, User, Upload, ExternalLink, ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/config/site';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(resolvedParams.dept, resolvedParams.paperCode);

  if (!dept || !paper) return { title: 'Subject Not Found' };

  return {
    title: `${paper.paperName} (${paper.paperCode}) Notes | ${siteConfig.name}`,
    description: `Study materials, module guides, and lecture notes for ${paper.paperName} (${paper.paperCode}) at ${siteConfig.university}.`,
  };
}

export default async function PaperDetailPage({ params }) {
  const resolvedParams = await params;
  const department = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(resolvedParams.dept, resolvedParams.paperCode);

  if (!department || !paper) {
    notFound();
  }

  const materials = await getMaterialsByPaper(department.id, paper.paperCode, 'notes');

  return (
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
              <Star size={18} fill="#F59E0B" color="#B45309" />
              <span>{paper.ratingAvg.toFixed(1)} / 5.0</span>
              <span style={{ color: '#777', fontWeight: 600 }}>({paper.ratingCount} student votes)</span>
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

          {/* Legacy Drive Link Fallback if Available */}
          {paper.driveLink && (
            <div
              className="neo-card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#EFF6FF',
                border: '3px solid var(--black)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--primary-blue)',
                      border: '2px solid var(--black)',
                      padding: '0.1rem 0.5rem',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Legacy Drive Folder
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Original University Notes Archive</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
                  This subject has an established Google Drive archive from the previous system.
                </p>
              </div>

              <a
                href={paper.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button"
                style={{
                  backgroundColor: 'var(--white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <span>Open Google Drive</span>
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Uploaded Materials List */}
          {materials.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="neo-card"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--white)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <FileText size={20} />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                        {mat.title}
                      </h3>
                    </div>

                    {mat.description && (
                      <p style={{ color: '#444', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {mat.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>
                      {mat.uploadedByName && <span>Uploaded by: {mat.uploadedByName}</span>}
                      {mat.pageCount > 0 && <span>• {mat.pageCount} Pages</span>}
                      {mat.fileSize > 0 && <span>• {(mat.fileSize / (1024 * 1024)).toFixed(1)} MB</span>}
                    </div>
                  </div>

                  <div>
                    <a
                      href={mat.driveLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-button primary"
                    >
                      View Document →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state when no peer uploads exist yet */
            !paper.driveLink && (
              <div
                className="neo-card"
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--white)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  No materials uploaded yet for this subject
                </h3>
                <p style={{ color: '#555', fontWeight: 600, maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  Be the first student to share lecture notes or study guides for {paper.paperName}!
                </p>
                <Link href="/upload" className="neo-button primary">
                  Upload Notes Now
                </Link>
              </div>
            )
          )}
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
  );
}
