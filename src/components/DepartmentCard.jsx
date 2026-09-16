import React from 'react';
import Link from 'next/link';
import { 
  Laptop, Code, FlaskConical, Atom, Scale, 
  Briefcase, Dna, Sigma, GraduationCap, BookOpen 
} from 'lucide-react';

const iconMap = {
  Laptop,
  Code,
  FlaskConical,
  Atom,
  Scale,
  Briefcase,
  Dna,
  Sigma,
  GraduationCap,
  BookOpen,
};

export default function DepartmentCard({ department, basePath = '/notes' }) {
  const IconComponent = iconMap[department.icon] || BookOpen;

  return (
    <div
      className="neo-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* Header Bar with Tags */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--primary-yellow)',
          borderBottom: '3px solid var(--black)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              padding: '0.4rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent size={22} color="var(--black)" strokeWidth={2.5} />
          </div>
          <span
            style={{
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              padding: '0.2rem 0.5rem',
              fontWeight: 900,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
            }}
          >
            {department.shortCode}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <span
            style={{
              backgroundColor: 'var(--primary-pink)',
              border: '2px solid var(--black)',
              padding: '0.2rem 0.5rem',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            {department.degreeType}
          </span>
          <span
            style={{
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              padding: '0.2rem 0.5rem',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}
          >
            {department.totalSemesters} Sems
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '0.75rem',
          }}
        >
          {department.name}
        </h3>
        
        {department.description && (
          <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem', fontWeight: 600 }}>
            {department.description}
          </p>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <Link
            href={`${basePath}/${department.id}`}
            className="neo-button primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            {basePath.includes('pyq') ? 'View Past Papers →' : 'Browse Notes →'}
          </Link>
        </div>
      </div>
    </div>
  );
}
