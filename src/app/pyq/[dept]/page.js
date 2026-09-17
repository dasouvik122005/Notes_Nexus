import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug } from '@/lib/data/departments';
import { getPYQMaterialsByDepartment } from '@/lib/data/materials';
import DepartmentPYQBrowser from '@/components/DepartmentPYQBrowser';
import dynamic from 'next/dynamic';
const AnimateInView = dynamic(() => import('@/components/AnimateInView'));
import { siteConfig } from '@/config/site';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.dept);
  if (!dept) return { title: 'Department Not Found' };

  const title = `${dept.shortCode} Previous Year Questions | ${siteConfig.name}`;
  const description = `Access Mid Sem and Final Sem previous year questions for ${dept.name} at ${siteConfig.university}.`;
  const url = `${siteConfig.url}/pyq/${dept.id}`;

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
      type: 'website',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DepartmentPYQPage({ params }) {
  const resolvedParams = await params;
  const department = await getDepartmentBySlug(resolvedParams.dept);

  if (!department) {
    notFound();
  }

  const pyqMaterials = await getPYQMaterialsByDepartment(department.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${department.name} Previous Year Questions`,
    description: `Official past examination question papers for ${department.name}.`,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.university,
      sameAs: siteConfig.url,
    },
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
          <Link href="/pyq" style={{ textDecoration: 'underline' }}>
            PYQ Departments
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }}>{department.shortCode}</span>
        </nav>

        {/* Department Title Banner */}
        <AnimateInView delay={0.1} direction="up" style={{ marginBottom: '2.5rem' }}>
          <h1
            className="hero-title"
            style={{
              fontSize: '3.25rem',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              margin: '0.5rem 0',
            }}
          >
            {department.name} PYQs
          </h1>

          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', maxWidth: '650px', marginTop: '0.5rem' }}>
            Official past examination question papers sorted by semester, exam type, and academic session.
          </p>
        </AnimateInView>

        {/* Interactive Semester & Exam Session PYQ Browser */}
        <DepartmentPYQBrowser
          department={department}
          initialMaterials={pyqMaterials}
        />

      </div>
    </div>
    </>
  );
}
