import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug } from '@/lib/data/departments';
import { getPaperByCode } from '@/lib/data/papers';
import { getMaterialsByPaper } from '@/lib/data/materials';
import { FileText, Calendar, Upload, ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/config/site';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(resolvedParams.dept, resolvedParams.paperCode);

  if (!dept || !paper) return { title: 'Subject Not Found' };

  return {
    title: `${paper.paperName} (${paper.paperCode}) PYQs | ${siteConfig.name}`,
    description: `Download and view previous year questions for ${paper.paperName} (${paper.paperCode}) at ${siteConfig.university}.`,
  };
}

export default async function PYQPaperDetailPage({ params }) {
  const resolvedParams = await params;
  const department = await getDepartmentBySlug(resolvedParams.dept);
  const paper = await getPaperByCode(resolvedParams.dept, resolvedParams.paperCode);

  if (!department || !paper) {
    notFound();
  }

  const pyqMaterials = await getMaterialsByPaper(department.id, paper.paperCode, 'pyq');

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 800 }}>
          <Link href="/pyq" style={{ textDecoration: 'underline' }}>
            PYQ Departments
          </Link>
          <span>/</span>
          <Link href={`/pyq/${department.id}`} style={{ textDecoration: 'underline' }}>
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
                backgroundColor: 'var(--primary-pink)',
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
                backgroundColor: 'var(--primary-yellow)',
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
            className="hero-title"
            style={{
              fontSize: '2.75rem',
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {paper.paperName} — Past Papers
          </h1>

          <p style={{ fontWeight: 600, color: '#444', fontSize: '1.05rem', margin: 0 }}>
            Archive of Mid Semester and End Semester examination questions submitted by university peers and verified by moderators.
          </p>
        </div>

        {/* Available Question Papers */}
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
              Examination Papers Archive
            </h2>

            <Link
              href="/upload"
              className="neo-button"
              style={{
                backgroundColor: 'var(--primary-pink)',
                color: 'var(--black)',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Upload size={16} />
              <span>Upload Past Paper</span>
            </Link>
          </div>

          {/* List of PYQ Papers */}
          {pyqMaterials.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pyqMaterials.map((mat) => (
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
                      <span
                        style={{
                          backgroundColor: mat.examType === 'mid_sem' ? 'var(--primary-yellow)' : 'var(--primary-pink)',
                          border: '2px solid var(--black)',
                          padding: '0.15rem 0.5rem',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {mat.examType === 'mid_sem' ? 'Mid Semester' : 'Final Semester'}
                      </span>
                      {mat.year && (
                        <span
                          style={{
                            backgroundColor: 'var(--white)',
                            border: '2px solid var(--black)',
                            padding: '0.15rem 0.5rem',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Calendar size={12} />
                          <span>Year {mat.year}</span>
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
                      {mat.title}
                    </h3>

                    {mat.description && (
                      <p style={{ color: '#444', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                        {mat.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <a
                      href={mat.driveLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-button primary"
                    >
                      View Question Paper →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
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
                No question papers uploaded yet for {paper.paperName}
              </h3>
              <p style={{ color: '#555', fontWeight: 600, maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Help your classmates by contributing Mid Sem or Final Sem question papers from previous years!
              </p>
              <Link href="/upload" className="neo-button primary">
                Upload Question Paper
              </Link>
            </div>
          )}
        </div>

        {/* Security / Watermark Notice */}
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
            Question papers are view-only archives provided for personal exam revision and practice.
          </span>
        </div>

      </div>
    </div>
  );
}
