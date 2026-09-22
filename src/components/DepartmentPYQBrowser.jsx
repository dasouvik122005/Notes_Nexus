'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const PdfModal = dynamic(() => import('@/components/PdfModal'), { ssr: false });
import StarRating from '@/components/StarRating';
import NeoButton from '@/components/NeoButton';
import {
  BookOpen,
  Calendar,
  FileText,
  Eye,
  Upload,
  GraduationCap,
  User,
} from 'lucide-react';

export default function DepartmentPYQBrowser({ department, initialMaterials = [] }) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedExamType, setSelectedExamType] = useState('mid_sem'); // 'mid_sem' | 'final_sem'
  const [activeModal, setActiveModal] = useState(null);

  // Group materials by semester and exam type
  const availableMaterials = useMemo(() => {
    return initialMaterials.filter(
      (m) =>
        m.semester === selectedSemester &&
        (m.examType === selectedExamType || (!m.examType && selectedExamType === 'final_sem'))
    );
  }, [initialMaterials, selectedSemester, selectedExamType]);

  // Open in-app secure viewer
  const handleOpenViewer = (material) => {
    setActiveModal({
      pdfUrl: material.storageKey || '',
      title: material.title,
      contributorName: material.uploadedByName,
      pageCount: material.pageCount || 0,
    });
  };

  return (
    <div>
      {/* 1. Semester Cards (1 to N, strictly no filter chips, no search) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <label
            style={{
              fontWeight: 900,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Step 1: Choose Semester
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280' }}>
            {department.totalSemesters} Semesters Available
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: department.totalSemesters }, (_, i) => i + 1).map((sem) => {
            const isSelected = selectedSemester === sem;
            const count = initialMaterials.filter((m) => m.semester === sem).length;

            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                type="button"
                style={{
                  padding: '1.1rem 0.75rem',
                  border: '3px solid var(--black)',
                  backgroundColor: isSelected ? 'var(--primary-yellow)' : 'var(--white)',
                  boxShadow: isSelected
                    ? '2px 2px 0px 0px var(--black)'
                    : '4px 4px 0px 0px var(--black)',
                  transform: isSelected ? 'translate(2px, 2px)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#4B5563',
                  }}
                >
                  Sem
                </span>
                <span
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    lineHeight: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  {sem}
                </span>
                {count > 0 ? (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: isSelected ? 'var(--black)' : '#DCFCE7',
                      color: isSelected ? 'var(--white)' : '#15803D',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '2px',
                    }}
                  >
                    {count} {count === 1 ? 'Paper' : 'Papers'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#9CA3AF',
                    }}
                  >
                    0 Papers
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Exam Type Choice (Mid Sem vs Final Sem) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <label
          style={{
            display: 'block',
            fontWeight: 900,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          Step 2: Choose Exam Session for Semester {selectedSemester}
        </label>

        <div className="pyq-exam-grid">
          <button
            type="button"
            onClick={() => setSelectedExamType('mid_sem')}
            className={`pyq-exam-card ${selectedExamType === 'mid_sem' ? 'selected' : ''}`}
          >
            <div className="pyq-exam-icon-box">
              <FileText size={20} />
            </div>
            <div className="pyq-exam-title">
              Mid Semester Exam
            </div>
            <div className="pyq-exam-desc">
              Internal & mid-term evaluation papers
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedExamType('final_sem')}
            className={`pyq-exam-card ${selectedExamType === 'final_sem' ? 'selected' : ''}`}
          >
            <div className="pyq-exam-icon-box">
              <GraduationCap size={22} />
            </div>
            <div className="pyq-exam-title">
              Final / End Semester Exam
            </div>
            <div className="pyq-exam-desc">
              Official University End-Semester papers
            </div>
          </button>
        </div>
      </div>

      {/* 3. Contributed Papers List by Year */}
      <div>
        <div className="pyq-papers-header">
          <h2 className="pyq-papers-heading">
            Semester {selectedSemester} •{' '}
            {selectedExamType === 'mid_sem' ? 'Mid Semester' : 'Final Semester'} Papers
          </h2>

          <div className="pyq-papers-actions-row">
            <span className="pyq-contributed-badge">
              {availableMaterials.length} Contributed
            </span>

            <Link href="/upload" className="pyq-upload-link">
              <NeoButton
                variant="default"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.45rem 0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Upload size={14} /> Upload Semester {selectedSemester} PYQ
              </NeoButton>
            </Link>
          </div>
        </div>

        {availableMaterials.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {availableMaterials.map((material) => (
              <div
                key={material.id}
                className="neo-card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                {/* Left details */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'var(--primary-yellow)',
                        border: '2px solid var(--black)',
                        boxShadow: '2px 2px 0px 0px var(--black)',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        padding: '0.2rem 0.6rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Calendar size={14} />
                      {(() => {
                        const titleYearMatch = material.title?.match(/\b(20[1-2][0-9])\b/);
                        return titleYearMatch ? titleYearMatch[1] : (material.year || 'Unknown Year');
                      })()}
                    </span>

                    <span
                      style={{
                        backgroundColor: '#F3F4F6',
                        border: '1px solid var(--black)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Combined Exam Paper
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      marginBottom: '0.35rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {material.title}
                  </h3>

                  {material.description && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#4B5563',
                        margin: '0 0 0.5rem 0',
                      }}
                    >
                      {material.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#6B7280',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#FEF9C3',
                        border: '1.5px solid var(--black)',
                        padding: '0.2rem 0.6rem',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: 'var(--black)',
                      }}
                    >
                      <User size={13} />
                      <span>Contributor: <strong>{material.uploadedByName || 'Verified Student'}</strong></span>
                    </span>
                    {material.pageCount > 0 && <span>{material.pageCount} Pages</span>}
                    {material.fileSize > 0 && (
                      <span>{(material.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                    )}
                    {material.createdAt && (
                      <span>Contributed: {material.createdAt.split('T')[0]}</span>
                    )}
                    <StarRating
                      materialId={material.id}
                      initialAvg={material.ratingAvg || 0}
                      initialCount={material.ratingCount || 0}
                    />
                  </div>
                </div>

                {/* Right CTA */}
                <div>
                        <button
                          onClick={() => handleOpenViewer(material)}
                          className="neo-button primary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.25rem',
                            fontSize: '0.95rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={16} />
                          <span>Read →</span>
                        </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State: Never show placeholder years */
          <div
            className="neo-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--white)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-yellow)',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <BookOpen size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              No {selectedExamType === 'mid_sem' ? 'Mid Semester' : 'Final Semester'} Papers
              Yet
            </h3>

            <p
              style={{
                color: '#4B5563',
                fontWeight: 600,
                maxWidth: '480px',
                margin: '0 auto 1.75rem auto',
                lineHeight: 1.5,
              }}
            >
              No student has contributed a question paper for{' '}
              <strong>
                Semester {selectedSemester} (
                {selectedExamType === 'mid_sem' ? 'Mid Sem' : 'Final Sem'})
              </strong>{' '}
              yet. Papers appear here only after a real student contribution is approved.
            </p>

            <Link href="/upload">
              <NeoButton
                variant="primary"
                style={{
                  fontSize: '1rem',
                  padding: '0.75rem 1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Upload size={18} />
                <span>Upload Semester {selectedSemester} PYQ</span>
              </NeoButton>
            </Link>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {activeModal && (
        <PdfModal
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
          pdfUrl={activeModal.pdfUrl}
          title={activeModal.title}
          contributorName={activeModal.contributorName}
          initialPageCount={activeModal.pageCount || 0}
        />
      )}
    </div>
  );
}
