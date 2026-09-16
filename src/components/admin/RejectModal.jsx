'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import NeoButton from '@/components/NeoButton';

const PRESET_REASONS = [
  'Pages are blurry or scan quality is too low to read comfortably.',
  'Missing pages or content is abruptly cut off.',
  'Incorrect subject, semester, or department selected.',
  'Duplicate material already present in the catalog.',
  'File contains copyrighted textbook solutions or non-academic material.',
];

export default function RejectModal({
  isOpen,
  title,
  targetType = 'material', // 'material' | 'user' | 'listing'
  onClose,
  onConfirm,
  isProcessing = false,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific reason for rejection.');
      return;
    }
    setError(null);
    onConfirm(reason.trim());
  };

  const handleSelectPreset = (preset) => {
    setReason(preset);
    setError(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="neo-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--white)',
          padding: '2rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#F3F4F6',
            border: '2px solid var(--black)',
            boxShadow: '2px 2px 0px 0px var(--black)',
            padding: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Reject {targetType === 'material' ? 'Submission' : targetType === 'listing' ? 'Listing' : 'Account'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 700 }}>
              {title ? `"${title}"` : 'This item will not be published'}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#374151',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}
        >
          A mandatory rejection reason is required. This feedback will be sent directly to the contributor in their student dashboard so they can make corrections.
        </p>

        {/* Quick Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#4B5563',
              marginBottom: '0.4rem',
            }}
          >
            Quick Feedback Presets:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {PRESET_REASONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                style={{
                  backgroundColor: reason === preset ? 'var(--primary-yellow)' : '#F9FAFB',
                  border: '2px solid var(--black)',
                  boxShadow: '1px 1px 0px 0px var(--black)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  lineHeight: 1.3,
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Reason Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Rejection Reason *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain why this submission cannot be accepted..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: 'var(--white)',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '2px solid var(--black)',
                padding: '0.5rem 0.75rem',
                color: '#991B1B',
                fontSize: '0.8rem',
                fontWeight: 800,
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              style={{
                backgroundColor: '#F3F4F6',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                padding: '0.6rem 1.2rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing || !reason.trim()}
              style={{
                backgroundColor: '#EF4444',
                color: 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '0.6rem 1.4rem',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: isProcessing || !reason.trim() ? 'not-allowed' : 'pointer',
                opacity: isProcessing || !reason.trim() ? 0.6 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              <Send size={14} />
              {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
