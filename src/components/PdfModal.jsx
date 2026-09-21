'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  Layers,
  Monitor,
} from 'lucide-react';
import Image from 'next/image';

/**
 * Builds high-resolution page image URLs for Cloudinary-hosted PDFs.
 * Cloudinary natively renders individual PDF pages with crisp typography
 * and zero horizontal clipping across mobile screens.
 */
function getCloudinaryPageUrl(pdfUrl, pageNum, zoom = 100) {
  if (!pdfUrl || typeof pdfUrl !== 'string') return null;
  if (!pdfUrl.includes('cloudinary.com') || !pdfUrl.includes('/upload/')) return null;

  const [base, rest] = pdfUrl.split('/upload/');
  if (!base || !rest) return null;

  const cleanRest = rest.replace(/\.pdf$/i, '.jpg');
  // High-DPI width: 1400px ensures crisp handwriting even on zoom/retina displays
  const widthParam = zoom > 100 ? `w_${Math.min(2200, Math.round(1400 * (zoom / 100)))}` : 'w_1400';
  return `${base}/upload/pg_${pageNum},f_auto,q_auto,${widthParam}/${cleanRest}`;
}

export default function PdfModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
  contributorName = null,
  viewerEmail = null,
  initialPageCount = 0,
}) {
  const isCloudinary = Boolean(
    pdfUrl && typeof pdfUrl === 'string' && pdfUrl.includes('cloudinary.com') && pdfUrl.includes('/upload/')
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialPageCount > 0 ? initialPageCount : null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' (continuous) | 'single'
  const [isNativeEmbed, setIsNativeEmbed] = useState(!isCloudinary);
  const [isDetectingPages, setIsDetectingPages] = useState(false);
  const [pageErrors, setPageErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      const { PDFDocument, rgb, degrees } = await import('pdf-lib');
      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error('Fetch failed');
      const buffer = await res.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      const pages = doc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        const text = Array(15).fill("NOTES NEXUS").join("        ");
        
        // Draw multiple lines to cover the page diagonally
        for (let i = -4; i <= 4; i++) {
          page.drawText(text, {
            x: -600,
            y: (height / 2) + (i * 250),
            size: 40,
            color: rgb(0, 0, 0),
            opacity: 0.08,
            rotate: degrees(-45),
          });
        }
      }
      
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = title ? `${title}.pdf` : 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      
    } catch (error) {
      console.error('Error adding watermark for download:', error);
      // Fallback: normal download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = title || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset & detect total pages when modal opens
  useEffect(() => {
    let isMounted = true;

    if (isOpen && pdfUrl) {
      setCurrentPage(1);
      setZoomLevel(100);
      setPageErrors({});
      setIsNativeEmbed(!isCloudinary);

      if (initialPageCount && initialPageCount > 0) {
        setTotalPages(initialPageCount);
      } else {
        // Detect page count using pdf-lib in background
        async function detectPageCount() {
          try {
            setIsDetectingPages(true);
            const { PDFDocument } = await import('pdf-lib');
            const res = await fetch(pdfUrl);
            if (!res.ok) throw new Error('Fetch failed');
            const buffer = await res.arrayBuffer();
            const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
            if (isMounted) {
              const count = doc.getPageCount();
              setTotalPages(count);
              setIsDetectingPages(false);
            }
          } catch {
            if (isMounted) {
              setIsDetectingPages(false);
            }
          }
        }
        detectPageCount();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfUrl, initialPageCount, isCloudinary]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => (totalPages ? Math.min(totalPages, prev + 1) : prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
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
  }, [isOpen, onClose, totalPages]);

  const handlePageError = useCallback((page) => {
    setPageErrors((prev) => ({ ...prev, [page]: true }));
    if (!totalPages || totalPages >= page) {
      setTotalPages(Math.max(1, page - 1));
    }
  }, [totalPages]);

  const zoomIn = () => setZoomLevel((z) => Math.min(200, z + 25));
  const zoomOut = () => setZoomLevel((z) => Math.max(100, z - 25));
  const zoomReset = () => setZoomLevel(100);

  if (!isOpen || !pdfUrl) return null;

  // Pages to render in scroll view: either known totalPages or default to first 3 then discovered
  const pagesToRender = totalPages
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3];

  return (
    <div
      className="pdf-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="pdf-modal-container">
        {/* Modal Header Bar */}
        <div className="pdf-modal-header">
          {/* Left Side: Document Details */}
          <div className="pdf-header-left">
            <span className="pdf-viewer-badge">PDF</span>
            <h3 className="pdf-title" title={title}>
              {title}
            </h3>
            {contributorName && (
              <span className="pdf-contributor-badge">
                BY {contributorName.toUpperCase()}
              </span>
            )}
          </div>

          {/* Right Side: Action Buttons (Guaranteed flex-shrink: 0, NEVER pushed off screen) */}
          <div className="pdf-header-actions">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="pdf-action-btn pdf-download-btn"
              title="Download PDF"
              style={{ opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? 'not-allowed' : 'pointer' }}
            >
              <Download size={14} />
              <span className="pdf-btn-label">{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>

            <button
              onClick={onClose}
              className="pdf-action-btn pdf-close-btn"
              title="Close PDF viewer (Esc)"
              aria-label="Close PDF viewer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Secondary Toolbar (Controls & Zoom) */}
        <div className="pdf-modal-toolbar">
          {/* Page Navigation Group */}
          <div className="pdf-toolbar-group">
            {isCloudinary && !isNativeEmbed && viewMode === 'single' && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="pdf-tool-btn"
                  title="Previous Page"
                >
                  <ChevronLeft size={15} />
                </button>
                <span>
                  Page <strong>{currentPage}</strong> of{' '}
                  <strong>{totalPages || (isDetectingPages ? '...' : '?')}</strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
                  }
                  disabled={totalPages ? currentPage >= totalPages : false}
                  className="pdf-tool-btn"
                  title="Next Page"
                >
                  <ChevronRight size={15} />
                </button>
              </>
            )}

            {isCloudinary && !isNativeEmbed && viewMode === 'scroll' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} />
                <span>
                  All Pages ({totalPages ? `${totalPages} pages` : isDetectingPages ? 'Detecting...' : 'Document'})
                </span>
              </span>
            )}

            {(!isCloudinary || isNativeEmbed) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4B5563' }}>
                <Monitor size={14} />
                <span>Native Browser PDF Embed</span>
              </span>
            )}
          </div>

          {/* View Mode & Zoom Controls */}
          <div className="pdf-toolbar-group">
            {isCloudinary && !isNativeEmbed && (
              <>
                {/* View Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setViewMode((m) => (m === 'scroll' ? 'single' : 'scroll'))}
                  className="pdf-tool-btn"
                  title={viewMode === 'scroll' ? 'Switch to Single Page view' : 'Switch to Continuous Scroll'}
                >
                  {viewMode === 'scroll' ? (
                    <>
                      <FileText size={13} />
                      <span>Single</span>
                    </>
                  ) : (
                    <>
                      <Layers size={13} />
                      <span>Scroll</span>
                    </>
                  )}
                </button>

                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoomLevel <= 100}
                    className="pdf-tool-btn"
                    title="Zoom out"
                  >
                    <ZoomOut size={13} />
                  </button>

                  <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: '36px', textAlign: 'center' }}>
                    {zoomLevel}%
                  </span>

                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoomLevel >= 200}
                    className="pdf-tool-btn"
                    title="Zoom in"
                  >
                    <ZoomIn size={13} />
                  </button>

                  {zoomLevel !== 100 && (
                    <button
                      type="button"
                      onClick={zoomReset}
                      className="pdf-tool-btn"
                      title="Reset to Fit Width"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                </div>
              </>
            )}


          </div>
        </div>

        {/* Viewer Body Area */}
        <div className="pdf-viewer-body">
          {/* Mode 1: Cloudinary High-Res Mobile-Optimized Rendering */}
          {isCloudinary && !isNativeEmbed ? (
            <div
              style={{
                width: zoomLevel === 100 ? '100%' : `${zoomLevel}%`,
                maxWidth: zoomLevel === 100 ? '900px' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'width 0.15s ease',
              }}
            >
              {viewMode === 'scroll' ? (
                /* Continuous Scroll Mode */
                pagesToRender.map((page) => {
                  if (pageErrors[page]) return null;
                  const pageUrl = getCloudinaryPageUrl(pdfUrl, page, zoomLevel);

                  return (
                    <div key={page} className="pdf-page-card" style={{ width: '100%' }}>
                      <div className="pdf-page-indicator">
                        Page {page} {totalPages ? `/ ${totalPages}` : ''}
                      </div>

                      <Image
                        src={pageUrl}
                        alt={`Page ${page}`}
                        width={800}
                        height={1131}
                        priority={page <= 2}
                        onError={() => handlePageError(page)}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          objectFit: 'contain',
                        }}
                      />

                      {/* Diagonal Watermark Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                          userSelect: 'none',
                          zIndex: 10,
                        }}
                      >
                        <div
                          style={{
                            transform: 'rotate(-45deg)',
                            whiteSpace: 'nowrap',
                            fontSize: '3rem',
                            fontWeight: 900,
                            color: 'rgba(0, 0, 0, 0.08)',
                            letterSpacing: '0.15em',
                          }}
                        >
                          {Array(15).fill("NOTES NEXUS").join("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Single Page Mode */
                <div className="pdf-page-card" style={{ width: '100%' }}>
                  <div className="pdf-page-indicator">
                    Page {currentPage} {totalPages ? `/ ${totalPages}` : ''}
                  </div>

                  <Image
                    src={getCloudinaryPageUrl(pdfUrl, currentPage, zoomLevel)}
                    alt={`Page ${currentPage}`}
                    width={800}
                    height={1131}
                    priority
                    onError={() => handlePageError(currentPage)}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                    }}
                  />

                  {/* Diagonal Watermark Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        transform: 'rotate(-45deg)',
                        whiteSpace: 'nowrap',
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: 'rgba(0, 0, 0, 0.08)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {Array(15).fill("NOTES NEXUS").join("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation for Single Page Mode */}
              {viewMode === 'single' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="pdf-action-btn"
                    style={{ backgroundColor: 'var(--white)' }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem' }}>
                    Page {currentPage} of {totalPages || '?'}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))
                    }
                    disabled={totalPages ? currentPage >= totalPages : false}
                    className="pdf-action-btn"
                    style={{ backgroundColor: 'var(--primary-yellow)' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Native Browser PDF Embed Fallback */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #3B82F6',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                }}
              >
                <span>Viewing via native browser PDF plugin. Use the Download button above to save a copy.</span>
              </div>

              <iframe
                src={pdfUrl}
                style={{ width: '100%', flex: 1, minHeight: '400px', border: 'none', backgroundColor: '#FFFFFF' }}
                title={title}
                allow="autoplay"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
