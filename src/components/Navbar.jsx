"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NeoButton from './NeoButton';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when route changes or window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div style={{ height: '100px' }} /> {/* Spacer to offset fixed header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'var(--white)',
        borderBottom: '3px solid var(--black)',
        boxShadow: '0 6px 0 0 rgba(0,0,0,1)',
        padding: '0.75rem 0'
      }}>
        <div className="container nav-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.75rem',
            fontWeight: 900,
            letterSpacing: '-1px',
            textTransform: 'uppercase'
          }}>
            <div style={{
              backgroundColor: 'var(--primary-yellow)',
              padding: '4px',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Notes Nexus" style={{ height: '32px', objectFit: 'contain' }} />
            </div>
            NOTES NEXUS
          </Link>
          
          <nav className="nav-links" style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            <Link href="/" className="nav-link" style={{ padding: '0.5rem 0', borderBottom: '3px solid transparent' }}>
              HOME
            </Link>
            <Link href="/notes" className="nav-link" style={{ padding: '0.5rem 0', borderBottom: '3px solid transparent' }}>
              NOTES
            </Link>
            <Link href="/about" className="nav-link" style={{ padding: '0.5rem 0', borderBottom: '3px solid transparent' }}>
              ABOUT
            </Link>
            <NeoButton 
              href="https://forms.gle/uJmzLDB4S9EQG4XCA"
              target="_blank" 
              rel="noopener noreferrer"
              variant="secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '1rem' }}
            >
              CONTACT
            </NeoButton>
          </nav>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu">
          <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>
            HOME
          </Link>
          <Link href="/notes" className="nav-link" onClick={() => setIsOpen(false)}>
            NOTES
          </Link>
          <Link href="/about" className="nav-link" onClick={() => setIsOpen(false)}>
            ABOUT
          </Link>
          <NeoButton 
            href="https://forms.gle/uJmzLDB4S9EQG4XCA"
            target="_blank" 
            rel="noopener noreferrer"
            variant="secondary"
            onClick={() => setIsOpen(false)}
            style={{ padding: '0.75rem 2rem', fontSize: '1.25rem', marginTop: '1rem' }}
          >
            CONTACT
          </NeoButton>
        </div>
      )}
    </>
  );
}
