'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function PdfModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
  contributorName = null,
  viewerEmail = null,
}) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="neo-card"
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--white)',
          padding: 0,
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-in-out',
        }}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            backgroundColor: 'var(--primary-pink)',
            borderBottom: '3px solid var(--black)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.15rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 900,
              }}
            >
              PDF VIEWER
            </span>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--black)',
                maxWidth: contributorName ? '450px' : '650px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h3>
            {contributorName && (
              <span
                style={{
                  backgroundColor: 'var(--primary-yellow)',
                  border: '2px solid var(--black)',
                  boxShadow: '2px 2px 0px 0px var(--black)',
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                BY {contributorName.toUpperCase()}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--primary-yellow)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.4rem 0.8rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'var(--black)',
                textTransform: 'uppercase',
                marginRight: '0.5rem',
              }}
            >
              Download
            </a>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={title}
            allow="autoplay"
          >
            <div style={{ padding: '2rem', textAlign: 'center', margin: 'auto' }}>
              <p style={{ fontWeight: 600 }}>Your browser does not support native PDF viewing.</p>
            </div>
          </iframe>
        </div>
      </div>
    </div>
  );
}
