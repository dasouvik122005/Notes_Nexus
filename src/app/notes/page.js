import React from 'react';
import AnimateInView from '@/components/AnimateInView';
import DepartmentCard from '@/components/DepartmentCard';
import { getDepartments } from '@/lib/data/departments';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Notes by Department',
  description: `Browse lecture notes and study materials by department at ${siteConfig.university}.`,
};

export default async function NotesDepartmentPickerPage() {
  const departments = await getDepartments();

  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <AnimateInView delay={0.1} direction="up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary-yellow)',
              padding: '0.4rem 0.9rem',
              fontWeight: 900,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              border: '2px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              marginBottom: '1rem',
            }}
          >
            Academic Departments
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: '3.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            SELECT YOUR <br />
            <span
              style={{
                backgroundColor: 'var(--primary-pink)',
                padding: '0 0.5rem',
                display: 'inline-block',
                border: '4px solid var(--black)',
                transform: 'rotate(-2deg)',
              }}
            >
              DEPARTMENT
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              maxWidth: '600px',
              margin: '0 auto',
              color: '#333',
            }}
          >
            Choose your degree program or department below to access semester-wise lecture notes, module guides, and syllabus materials.
          </p>
        </AnimateInView>

        {/* Departments Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {departments.map((dept, index) => (
            <AnimateInView
              key={dept.id}
              delay={0.08 * (index % 4)}
              direction="up"
              style={{ height: '100%' }}
            >
              <DepartmentCard department={dept} basePath="/notes" />
            </AnimateInView>
          ))}
        </div>

      </div>
    </div>
  );
}
