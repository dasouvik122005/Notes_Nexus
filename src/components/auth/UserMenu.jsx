'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { User, LogOut, FileText, ShieldCheck, ChevronDown, Upload } from 'lucide-react';
import NeoButton from '@/components/NeoButton';

export default function UserMenu() {
  const { user, profile, openAuthModal, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal()}
        className="neo-button primary"
        style={{
          fontSize: '0.9rem',
          padding: '0.45rem 1rem',
          fontWeight: 900,
          cursor: 'pointer',
        }}
      >
        SIGN IN
      </button>
    );
  }

  const initials = (profile?.name || user.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isVerified = profile?.account_status === 'verified';
  const isAdmin = profile?.role === 'admin';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* User Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--white)',
          border: '2px solid var(--black)',
          boxShadow: '3px 3px 0px 0px var(--black)',
          padding: '0.35rem 0.65rem',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: '0.85rem',
        }}
      >
        {/* Initials Avatar */}
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
          }}
        >
          {initials}
        </div>

        <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {profile?.name?.split(' ')[0] || 'Account'}
        </span>

        {/* Status indicator dot */}
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isVerified ? '#22C55E' : '#EAB308',
            border: '1px solid var(--black)',
          }}
          title={isVerified ? 'Verified Account' : 'Pending Verification'}
        />

        <ChevronDown size={14} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="neo-card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '230px',
            backgroundColor: 'var(--white)',
            padding: '0.75rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            boxShadow: '5px 5px 0px 0px var(--black)',
          }}
        >
          {/* User Details Header */}
          <div
            style={{
              padding: '0.5rem',
              borderBottom: '2px solid var(--black)',
              marginBottom: '0.25rem',
            }}
          >
            <p style={{ margin: '0 0 0.2rem 0', fontWeight: 900, fontSize: '0.9rem' }}>
              {profile?.name}
            </p>
            <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.email}
            </p>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '0.1rem 0.4rem',
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
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    padding: '0.1rem 0.4rem',
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

          {/* Links */}
          <Link
            href="/me"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              color: 'var(--black)',
            }}
            className="hover:bg-gray-100"
          >
            <FileText size={16} />
            <span>My Submissions & Listings</span>
          </Link>

          <Link
            href="/upload"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              color: 'var(--black)',
            }}
            className="hover:bg-gray-100"
          >
            <Upload size={16} />
            <span>Upload Notes / PYQ</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                textDecoration: 'none',
                color: 'var(--black)',
                backgroundColor: '#FEF3C7',
                border: '1px solid var(--black)',
              }}
            >
              <ShieldCheck size={16} />
              <span>Admin Queue</span>
            </Link>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#DC2626',
              borderTop: '1px solid #E5E7EB',
              marginTop: '0.25rem',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
