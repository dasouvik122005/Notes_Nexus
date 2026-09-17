'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck2, AlertCircle, X, CheckCircle2 } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function PdfDropzone({
  file,
  onFileSelect,
  onFileClear,
  disabled = false,
  error,
  setError,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef(null);

  const validateAndSetFile = async (selectedFile) => {
    setError(null);

    if (!selectedFile) return;

    // 1. Extension & MIME check
    const isPdfExt = selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdfExt) {
      setError('Invalid file format. Only PDF documents (.pdf) are permitted.');
      return;
    }

    // 2. 10 MB hard cap check
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setError(
        `File size (${sizeMb} MB) exceeds the 10 MB limit. Please compress your PDF at ilovepdf.com/compress before uploading, or split it into chapters.`
      );
      return;
    }

    if (selectedFile.size === 0) {
      setError('The selected file is empty (0 bytes). Please select a valid PDF.');
      return;
    }

    // 3. Client-side Magic Bytes check (%PDF- = 0x25 0x50 0x44 0x46 0x2D)
    setIsValidating(true);
    try {
      const slice = selectedFile.slice(0, 5);
      const arrayBuffer = await slice.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      let isMagicValid = true;
      for (let i = 0; i < PDF_MAGIC_BYTES.length; i++) {
        if (uint8[i] !== PDF_MAGIC_BYTES[i]) {
          isMagicValid = false;
          break;
        }
      }

      if (!isMagicValid) {
        setError(
          'Corrupted or spoofed PDF detected. The file does not start with standard %PDF- header.'
        );
        setIsValidating(false);
        return;
      }
    } catch (err) {
      console.error('[PdfDropzone] Error inspecting magic bytes:', err);
      // Fallback: accept if browser file inspection failed
    } finally {
      setIsValidating(false);
    }

    // Passed all client-side checks
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosenFile = e.target.files[0];
      validateAndSetFile(chosenFile);
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* When no file is selected yet */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            border: `3px dashed ${isDragOver ? 'var(--primary-yellow)' : 'var(--black)'}`,
            backgroundColor: isDragOver ? '#FEF9C3' : '#F9FAFB',
            boxShadow: isDragOver
              ? '6px 6px 0px 0px var(--black)'
              : '4px 4px 0px 0px var(--black)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--primary-yellow)',
              border: '3px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <UploadCloud size={28} />
          </div>

          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            {isValidating
              ? 'Inspecting PDF magic bytes...'
              : 'Drag & Drop PDF Here or Click to Browse'}
          </h3>

          <p
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#4B5563',
              marginBottom: '0.75rem',
            }}
          >
            Strictly PDF format only • Maximum 10 MB per file
          </p>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--white)',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            SELECT PDF FILE
          </span>
        </div>
      ) : (
        /* File selected card */
        <div
          style={{
            border: '3px solid var(--black)',
            backgroundColor: '#F0FDF4',
            boxShadow: '4px 4px 0px 0px var(--black)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#22C55E',
                color: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileCheck2 size={24} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: '1rem',
                  wordBreak: 'break-word',
                  maxWidth: '380px',
                }}
              >
                {file.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginTop: '0.2rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ color: '#4B5563' }}>{formatBytes(file.size)}</span>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    border: '1px solid #86EFAC',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <CheckCircle2 size={12} /> Verified PDF
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = '';
              onFileClear();
            }}
            disabled={disabled}
            style={{
              backgroundColor: '#FEE2E2',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              padding: '0.4rem 0.8rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              textTransform: 'uppercase',
            }}
          >
            <X size={16} /> Remove
          </button>
        </div>
      )}

      {/* Error alert box */}
      {error && (
        <div
          style={{
            marginTop: '0.75rem',
            border: '3px solid var(--black)',
            backgroundColor: '#FEF2F2',
            boxShadow: '3px 3px 0px 0px var(--black)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            color: '#991B1B',
            fontSize: '0.85rem',
            fontWeight: 800,
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}
