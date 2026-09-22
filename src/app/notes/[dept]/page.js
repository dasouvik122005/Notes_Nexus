import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug } from '@/lib/data/departments';
import { getPapersByDepartment } from '@/lib/data/papers';
import DepartmentNotesCatalog from '@/components/DepartmentNotesCatalog';
import nextDynamic from 'next/dynamic';
const AnimateInView = nextDynamic(() => import('@/components/AnimateInView'));
import { siteConfig } from '@/config/site';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.dept);
  if (!dept) return { title: 'Department Not Found' };

  return {
    title: `${dept.shortCode} Notes | ${siteConfig.name}`,
    description: `Browse semester notes, syllabus guides, and modules for ${dept.name} at ${siteConfig.university}.`,
  };
}

export default async function DepartmentNotesPage({ params }) {
  const resolvedParams = await params;
  const department = await getDepartmentBySlug(resolvedParams.dept);

  if (!department) {
    notFound();
  }

  const papers = await getPapersByDepartment(department.id);

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">

        {/* Breadcrumb Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 800 }}>
          <Link href="/notes" style={{ textDecoration: 'underline' }}>
            Departments
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }}>{department.shortCode}</span>
        </nav>

        {/* Department Title Banner */}
        <AnimateInView delay={0.1} direction="up" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                backgroundColor: 'var(--primary-yellow)',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '0.3rem 0.8rem',
                fontWeight: 900,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
              }}
            >
              {department.shortCode}
            </span>
            <span
              style={{
                backgroundColor: 'var(--primary-pink)',
                border: '2px solid var(--black)',
                padding: '0.3rem 0.8rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
              }}
            >
              {department.degreeType}
            </span>
            <span
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                padding: '0.3rem 0.8rem',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            >
              {department.totalSemesters} Semesters
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(2.25rem, 8vw, 3.25rem)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              margin: '0.5rem 0',
              wordBreak: 'break-word',
            }}
          >
            {department.name}
          </h1>

          {department.description && (
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', maxWidth: '650px', marginTop: '0.5rem' }}>
              {department.description}
            </p>
          )}
        </AnimateInView>

        {/* Interactive Client Catalog */}
        <DepartmentNotesCatalog
          department={department}
          initialPapers={papers}
        />

      </div>
    </div>
  );
}
