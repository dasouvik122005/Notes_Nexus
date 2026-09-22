'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile
    const checkMobile = () => {
      setIsVisible(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 900,
      width: 'calc(100% - 2rem)',
      maxWidth: '400px',
    }}>
      <Link href="/upload" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--primary-yellow)',
        color: 'var(--black)',
        border: '3px solid var(--black)',
        boxShadow: '4px 4px 0px 0px var(--black)',
        padding: '1rem',
        fontWeight: 900,
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        textDecoration: 'none',
        width: '100%',
        transition: 'all 0.2s ease',
      }}>
        <Upload size={20} />
        <span>Upload Notes & PYQ</span>
      </Link>
    </div>
  );
}
