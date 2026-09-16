'use client';

import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function StarRating({
  materialId,
  initialAvg = 0,
  initialCount = 0,
  userRating = null,
  size = 18,
}) {
  const { user, openAuthModal } = useAuth();

  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [currentRating, setCurrentRating] = useState(userRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRated, setJustRated] = useState(false);

  const handleRate = async (stars) => {
    if (!user) {
      openAuthModal('Sign in with Google to rate this study material.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Optimistic update
      const prevUserRating = currentRating;
      setCurrentRating(stars);
      setJustRated(true);

      if (!prevUserRating) {
        const newCount = count + 1;
        const newAvg = ((avg * count) + stars) / newCount;
        setAvg(Number(newAvg.toFixed(1)));
        setCount(newCount);
      } else {
        const newAvg = ((avg * count) - prevUserRating + stars) / count;
        setAvg(Number(newAvg.toFixed(1)));
      }

      // API call to record vote
      await fetch(`/api/materials/${materialId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars }),
      });

      setTimeout(() => setJustRated(false), 2500);
    } catch (err) {
      console.error('[StarRating] Error saving rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStars = hoverRating || Math.round(avg);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
      onMouseLeave={() => setHoverRating(0)}
    >
      {/* 5 Interactive Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= (hoverRating || Math.round(currentRating || avg));
          return (
            <button
              key={starIndex}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRate(starIndex)}
              onMouseEnter={() => setHoverRating(starIndex)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease',
                transform: hoverRating === starIndex ? 'scale(1.2)' : 'none',
              }}
              title={user ? `Rate ${starIndex} star${starIndex > 1 ? 's' : ''}` : 'Sign in to rate'}
            >
              <Star
                size={size}
                fill={isFilled ? '#F59E0B' : 'transparent'}
                color={isFilled ? '#B45309' : '#9CA3AF'}
                strokeWidth={isFilled ? 2 : 1.5}
              />
            </button>
          );
        })}
      </div>

      {/* Aggregate Score & Vote Count */}
      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2937' }}>
        {avg > 0 ? avg.toFixed(1) : 'Unrated'}
      </span>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280' }}>
        ({count})
      </span>

      {/* Just Rated Success Pill */}
      {justRated && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            backgroundColor: '#DCFCE7',
            border: '1px solid var(--black)',
            padding: '0.1rem 0.4rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#15803D',
            animation: 'fadeIn 0.2s',
          }}
        >
          <Check size={12} />
          <span>Voted!</span>
        </span>
      )}
    </div>
  );
}
