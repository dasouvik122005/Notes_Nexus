'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Loader2,
  RotateCw,
} from 'lucide-react';
import NeoButton from '@/components/NeoButton';

export default function SecurePdfViewer({
  pdfUrl,
  documentTitle = 'Academic Study Material',
  viewerEmail = null,
}) {
  const canvasRef = useRef(null);
  const watermarkCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const existingSession = sessionStorage.getItem('notes_nexus_sid');
      if (existingSession) return existingSession;
      const newSid = 'NN-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      sessionStorage.setItem('notes_nexus_sid', newSid);
      return newSid;
    }
    return 'NN-ANON';
  });

  // Anti-download & anti-print keyboard interception
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block Ctrl/Cmd + S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block Ctrl/Cmd + P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen-capture & screen-record deterrence: pause on window blur / tab hide
  useEffect(() => {
    const handleVisibility = () => {
      setIsWindowBlurred(document.hidden);
    };

    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Load PDF using PDF.js via dynamic client import
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import pdfjs-dist in the browser
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          disableRange: true,
          disableStream: false,
          isEvalSupported: false,
        });

        const doc = await loadingTask.promise;

        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
        }
      } catch (err) {
        console.error('[SecurePdfViewer] Error loading document:', err);
        if (!isCancelled) {
          setError('Failed to load PDF document. Please try again.');
          setLoading(false);
        }
      }
    }

    if (pdfUrl) {
      loadPdf();
    }

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Draw tamper-evident dynamic watermark across the rendered page
  const drawWatermark = useCallback(
    (width, height) => {
      const wmCanvas = watermarkCanvasRef.current;
      if (!wmCanvas) return;

      wmCanvas.width = width;
      wmCanvas.height = height;
      const ctx = wmCanvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.rotate((-28 * Math.PI) / 180);

      const watermarkText = `NOTES NEXUS • ${viewerEmail || `VISITOR [${sessionId}]`} • VIEW ONLY`;
      const stepX = 320;
      const stepY = 120;

      for (let x = -width; x < width * 2; x += stepX) {
        for (let y = -height; y < height * 2; y += stepY) {
          ctx.fillText(watermarkText, x, y);
        }
      }
      ctx.restore();
    },
    [sessionId, viewerEmail]
  );

  // Render current page onto HTML5 Canvas
  const renderPage = useCallback(
    async (pageNum) => {
      if (!pdfDoc || !canvasRef.current || !watermarkCanvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Draw dynamic watermark overlay
        drawWatermark(viewport.width, viewport.height);
      } catch (err) {
        console.error('[SecurePdfViewer] Error rendering page:', err);
      }
    },
    [pdfDoc, scale, drawWatermark]
  );

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // Page navigation
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.4));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.7));
  const resetZoom = () => setScale(1.2);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#1E293B',
        border: '3px solid var(--black)',
        boxShadow: '6px 6px 0px 0px var(--black)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Neo-Brutalist Viewer Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--white)',
          borderBottom: '3px solid var(--black)',
        }}
      >
        {/* Title & Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--primary-yellow)',
              border: '2px solid var(--black)',
              padding: '0.2rem 0.6rem',
              fontWeight: 900,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            <ShieldAlert size={14} />
            <span>VIEW ONLY • WATERMARKED</span>
          </span>

          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              maxWidth: '260px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={documentTitle}
          >
            {documentTitle}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Page Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#F3F4F6',
              border: '2px solid var(--black)',
              padding: '0.2rem 0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              style={{
                background: 'none',
                border: 'none',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <span>
              {currentPage} / {totalPages || 1}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              style={{
                background: 'none',
                border: 'none',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom Buttons */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={zoomOut}
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 800,
              }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>

            <button
              onClick={resetZoom}
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={zoomIn}
              style={{
                backgroundColor: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 800,
              }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            style={{
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          padding: '2rem 1rem',
          minHeight: '520px',
          position: 'relative',
        }}
      >
        {/* Loading Spinner */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: 'var(--white)',
              zIndex: 10,
              gap: '1rem',
            }}
          >
            <Loader2 size={36} className="animate-spin" />
            <span style={{ fontWeight: 800 }}>Decrypting and rendering document canvas...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#FEE2E2',
              border: '3px solid var(--black)',
              boxShadow: '4px 4px 0px 0px var(--black)',
              textAlign: 'center',
              maxWidth: '450px',
            }}
          >
            <p style={{ fontWeight: 800, color: '#991B1B', marginBottom: '1rem' }}>{error}</p>
            <NeoButton
              onClick={() => window.location.reload()}
              variant="primary"
              style={{ fontSize: '0.9rem' }}
            >
              <RotateCw size={14} style={{ marginRight: '0.4rem' }} /> Retry
            </NeoButton>
          </div>
        )}

        {/* Canvas Render Container */}
        <div
          style={{
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            border: '2px solid var(--black)',
            backgroundColor: 'var(--white)',
          }}
        >
          {/* Document Content Canvas */}
          <canvas ref={canvasRef} style={{ display: 'block' }} />

          {/* Watermark Canvas Layer (positioned exactly over document) */}
          <canvas
            ref={watermarkCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />

          {/* Anti-Capture Window Blur Shield */}
          {isWindowBlurred && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                textAlign: 'center',
                padding: '2rem',
                zIndex: 20,
              }}
            >
              <ShieldAlert size={42} style={{ marginBottom: '1rem', color: 'var(--primary-yellow)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                DOCUMENT PAUSED
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '320px', color: '#94A3B8' }}>
                Content is hidden while the browser window is out of focus for academic integrity deterrence.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#94A3B8',
          fontSize: '0.75rem',
          fontWeight: 700,
          textAlign: 'center',
          padding: '0.5rem',
          borderTop: '1px solid #334155',
        }}
      >
        <span>
          Notes Nexus Secure Viewer • Downloads & printing disabled • Watermarked with ID {sessionId}
        </span>
      </div>
    </div>
  );
}
