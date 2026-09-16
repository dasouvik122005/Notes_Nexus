"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '../../public/icon2.png';
import NeoButton from './NeoButton';
import UserMenu from './auth/UserMenu';
import { siteConfig } from '@/config/site';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when window resizes
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
            alignItems: 'center'
          }}>
            <Image
              src={logoImg}
              alt={siteConfig.name}
              width={250}
              height={60}
              priority
              placeholder="blur"
              style={{ width: 'auto', height: '60px', objectFit: 'contain' }}
            />
          </Link>

          <nav className="nav-links" style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{ padding: '0.5rem 0', borderBottom: '3px solid transparent' }}
              >
                {item.label}
              </Link>
            ))}
            <NeoButton
              href={siteConfig.links.feedback}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '1rem' }}
            >
              FEEDBACK
            </NeoButton>
            <UserMenu />
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
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
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <NeoButton
            href={siteConfig.links.feedback}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            onClick={() => setIsOpen(false)}
            style={{ padding: '0.75rem 2rem', fontSize: '1.25rem', marginTop: '1rem' }}
          >
            FEEDBACK
          </NeoButton>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <UserMenu />
          </div>
        </div>
      )}
    </>
  );
}
