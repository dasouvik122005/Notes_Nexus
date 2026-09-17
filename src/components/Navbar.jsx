"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoImg from '../../public/icon2.png';
import NeoButton from './NeoButton';
import UserMenu from './auth/UserMenu';
import { siteConfig } from '@/config/site';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
      <div className="nav-spacer" /> {/* Responsive spacer to offset fixed header */}
      <header className="main-navbar">
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
              alt={`${siteConfig.name} - Official Logo and Home Link`}
              width={220}
              height={54}
              priority
              placeholder="blur"
              className="navbar-logo"
            />
          </Link>

          <nav className="nav-links">
            {siteConfig.nav.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{ color: 'var(--black)' }}
                >
                  {item.label}
                </Link>
              );
            })}
            <NeoButton
              href={siteConfig.links.feedback}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.95rem' }}
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="square">
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
          {siteConfig.nav.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{ color: 'var(--black)' }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
          })}
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
