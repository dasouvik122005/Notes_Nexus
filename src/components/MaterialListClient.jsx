'use client';

import React, { useState } from 'react';
import { FileText, Star, Eye, ExternalLink, Calendar } from 'lucide-react';
import PdfModal from '@/components/PdfModal';

export default function MaterialListClient({
  materials = [],
  legacyDriveLink = null,
  emptyMessage = 'No peer-uploaded study materials yet for this subject.',
}) {
  const [activeModal, setActiveModal] = useState(null);

  const openViewer = (material) => {
    setActiveModal({
      pdfUrl: `/api/pdf/stream?id=${material.id}${material.storageKey ? `&key=${encodeURIComponent(material.storageKey)}` : ''}`,
      title: material.title,
    });
  };

  return (
    <div>
      {/* Legacy Drive Notice if present */}
      {legacyDriveLink && (
        <div
          className="neo-card"
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#EFF6FF',
            border: '3px solid var(--black)',
            boxShadow: '4px 4px 0px 0px var(--black)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 900, fontSize: '1.05rem' }}>
              Legacy Google Drive Archive Available
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
              This subject has an established Google Drive archive from the previous system.
            </p>
          </div>

          <a
            href={legacyDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-button"
            style={{
              backgroundColor: 'var(--white)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
            }}
          >
            <span>Open Google Drive</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* Materials List */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {mat.examType && (
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
                      {mat.examType === 'mid_sem' ? 'Mid Sem' : 'Final Sem'}
                    </span>
                  )}
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
                      <span>{mat.year}</span>
                    </span>
                  )}
                  <FileText size={18} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                    {mat.title}
                  </h3>
                </div>

                {mat.description && (
                  <p style={{ color: '#444', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {mat.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#666',
                  }}
                >
                  {mat.uploadedByName && <span>Uploaded by: {mat.uploadedByName}</span>}
                  {mat.pageCount > 0 && <span>• {mat.pageCount} Pages</span>}
                  {mat.fileSize > 0 && (
                    <span>• {(mat.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                  )}
                  {mat.ratingAvg > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      • <Star size={14} fill="#F59E0B" color="#B45309" /> {mat.ratingAvg.toFixed(1)} ({mat.ratingCount})
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={() => openViewer(mat)}
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
                  <span>Read In-App →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="neo-card"
          style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'var(--white)',
          }}
        >
          <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            {emptyMessage}
          </h3>
          <p style={{ color: '#666', fontWeight: 600, maxWidth: '400px', margin: '0 auto' }}>
            Be the first student to upload verified handwritten notes or modules for this paper.
          </p>
        </div>
      )}

      {/* Secure In-App PDF Viewer Modal */}
      {activeModal && (
        <PdfModal
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
          pdfUrl={activeModal.pdfUrl}
          title={activeModal.title}
        />
      )}
    </div>
  );
}
