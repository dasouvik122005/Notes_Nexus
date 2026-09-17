"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoImg from '../../public/icon2.png';
import NeoButton from './NeoButton';
import UserMenu from './auth/UserMenu';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/lib/auth/AuthContext';
import { FileText, Upload, ShieldCheck, LogOut, ArrowLeft, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { user, profile, openAuthModal, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState('main'); // 'main' | 'account'
  const pathname = usePathname();

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      setMobileMenuTab('main');
    } else {
      setIsOpen(true);
      setMobileMenuTab('main');
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMobileMenuTab('main');
  };

  // Close menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
        setMobileMenuTab('main');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initials = (profile?.name || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isVerified = profile?.account_status === 'verified';
  const isAdmin = profile?.role === 'admin';

  return (
    <>
      <div className="nav-spacer" /> {/* Responsive spacer to offset fixed header */}
      <header className="main-navbar">
        <div className="container nav-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" onClick={closeMenu} style={{
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

      {/* Mobile Menu Dropdown & Backdrop */}
      {isOpen && (
        <>
          <div
            className="mobile-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="mobile-menu" style={{ minWidth: '220px', maxWidth: '270px', width: 'auto' }}>
            {mobileMenuTab === 'main' ? (
              <>
                {siteConfig.nav.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      style={{ color: 'var(--black)' }}
                      onClick={closeMenu}
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
                  onClick={closeMenu}
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.85rem',
                    marginTop: '0.25rem',
                    fontWeight: 900,
                    alignSelf: 'center',
                  }}
                >
                  FEEDBACK
                </NeoButton>

                <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--black)', margin: '0.4rem 0' }} />

                {!user ? (
                  <button
                    onClick={() => {
                      closeMenu();
                      openAuthModal();
                    }}
                    className="neo-button primary"
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.85rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    SIGN IN
                  </button>
                ) : (
                  <button
                    onClick={() => setMobileMenuTab('account')}
                    className="user-menu-trigger"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: 'var(--white)',
                      border: '2px solid var(--black)',
                      boxShadow: '2px 2px 0px 0px var(--black)',
                      padding: '0.35rem 0.6rem',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s ease',
                    }}
                    aria-label="Account menu"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: isAdmin ? 'var(--primary-pink)' : 'var(--primary-yellow)',
                          border: '2px solid var(--black)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.72rem',
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {profile?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <div
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: isVerified ? '#22C55E' : '#EAB308',
                          border: '1px solid var(--black)',
                          flexShrink: 0,
                        }}
                        title={isVerified ? 'Verified Account' : 'Pending Verification'}
                      />
                    </div>
                    <ChevronRight size={15} />
                  </button>
                )}
              </>
            ) : (
              /* Drill-down Account View In-Place */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                <button
                  onClick={() => setMobileMenuTab('main')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    padding: '0.2rem 0',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    color: 'var(--black)',
                    textTransform: 'uppercase',
                    marginBottom: '0.2rem',
                  }}
                  aria-label="Back to main navigation"
                >
                  <ArrowLeft size={14} /> Back to menu
                </button>

                {/* User Info Header */}
                <div
                  style={{
                    padding: '0.45rem',
                    border: '2px solid var(--black)',
                    backgroundColor: '#F9FAFB',
                    boxShadow: '2px 2px 0px 0px var(--black)',
                    marginBottom: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        backgroundColor: isAdmin ? 'var(--primary-pink)' : 'var(--primary-yellow)',
                        border: '2px solid var(--black)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {profile?.name || user?.email}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '0.1rem 0.35rem',
                        border: '1px solid var(--black)',
                        backgroundColor: isVerified ? '#DCFCE7' : '#FEF9C3',
                        color: isVerified ? '#166534' : '#854D0E',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isVerified ? 'Verified' : 'Pending Review'}
                    </span>
                    {isAdmin && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '0.1rem 0.35rem',
                          border: '1px solid var(--black)',
                          backgroundColor: 'var(--primary-pink)',
                          textTransform: 'uppercase',
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Account Action Links */}
                <Link
                  href="/me"
                  onClick={closeMenu}
                  className="user-menu-item"
                >
                  <FileText size={15} />
                  <span>My Submissions & Listings</span>
                </Link>

                <Link
                  href="/upload"
                  onClick={closeMenu}
                  className="user-menu-item"
                >
                  <Upload size={15} />
                  <span>Upload Notes / PYQ</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="user-menu-item admin-item"
                  >
                    <ShieldCheck size={15} />
                    <span>Admin Queue</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                  className="user-menu-item danger-item"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
