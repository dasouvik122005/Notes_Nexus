'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or dismissed the banner
    const cookieConsent = localStorage.getItem('notes_nexus_cookie_consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('notes_nexus_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div className="neo-card" style={{
        backgroundColor: 'var(--white)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '6px 6px 0px 0px var(--black)',
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
          🍪 We use cookies
        </div>
        <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.5, margin: 0 }}>
          Notes Nexus uses analytics to improve your experience. 
          By continuing to use this site, you agree to our <Link href="/privacy" style={{ textDecoration: 'underline', fontWeight: 700 }}>Privacy Policy</Link>.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button 
            onClick={handleAccept}
            style={{
              backgroundColor: 'var(--primary-green)',
              color: 'var(--black)',
              border: '2px solid var(--black)',
              padding: '0.5rem 1.5rem',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px 0px var(--black)',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '0px 0px 0px 0px var(--black)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--black)';
            }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
