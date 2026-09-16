import React from 'react';
import Link from 'next/link';
import { FileText, Star, User } from 'lucide-react';

export default function PaperCard({ paper, deptSlug, basePath = '/notes' }) {
  const detailUrl = `${basePath}/${deptSlug}/${paper.paperCode}`;

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
      {/* Card Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-color)',
          borderBottom: '3px solid var(--black)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            backgroundColor: 'var(--primary-yellow)',
            border: '2px solid var(--black)',
            padding: '0.2rem 0.6rem',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
          }}
        >
          {paper.paperCode}
        </span>
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
          Semester {paper.semester}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            lineHeight: 1.3,
            marginBottom: '0.75rem',
          }}
        >
          {paper.paperName}
        </h3>

        {paper.facultyName && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#555',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <User size={15} />
            <span>Faculty: {paper.facultyName}</span>
          </div>
        )}

        {/* Stats Row: Rating & File Count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 800,
            paddingTop: '0.5rem',
            marginTop: 'auto',
            borderTop: '2px dashed #ddd',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#B45309' }}>
            {paper.ratingCount > 0 ? (
              <>
                <Star size={16} fill="#F59E0B" color="#B45309" />
                <span>{paper.ratingAvg.toFixed(1)}</span>
                <span style={{ color: '#888', fontWeight: 600 }}>({paper.ratingCount})</span>
              </>
            ) : (
              <span style={{ color: '#888', fontWeight: 700, fontSize: '0.8rem' }}>Unrated</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4B5563' }}>
            <FileText size={16} />
            <span>{paper.fileCount} {paper.fileCount === 1 ? 'file' : 'files'}</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ paddingTop: '1rem' }}>
          <Link
            href={detailUrl}
            className="neo-button"
            style={{
              width: '100%',
              backgroundColor: 'var(--white)',
              fontSize: '0.9rem',
              padding: '0.6rem 1rem',
              textAlign: 'center',
            }}
          >
            Open Materials →
          </Link>
        </div>
      </div>
    </div>
  );
}
