'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Star, Upload, Store, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import NeoButton from '@/components/NeoButton';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authPromptMessage,
    signInWithGoogle,
  } = useAuth();

  const [authError, setAuthError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError('');
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="neo-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--white)',
          padding: '2rem',
          position: 'relative',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--white)',
            border: '2px solid var(--black)',
            boxShadow: '2px 2px 0px 0px var(--black)',
            padding: '0.35rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--primary-yellow)',
            border: '2px solid var(--black)',
            boxShadow: '3px 3px 0px 0px var(--black)',
            padding: '0.25rem 0.65rem',
            fontWeight: 900,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Student Authentication
        </div>

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '0.75rem',
            letterSpacing: '-1px',
          }}
        >
          Sign in to Notes Nexus
        </h2>

        {authPromptMessage ? (
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '2px solid var(--black)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1E40AF',
            }}
          >
            {authPromptMessage}
          </div>
        ) : (
          <p
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#444',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            Sign in with any personal Google account. No college email required.
          </p>
        )}

        {authError && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '2px solid var(--black)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#991B1B',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '2px 2px 0px 0px var(--black)',
            }}
          >
            <AlertTriangle size={18} />
            {authError}
          </div>
        )}

        {/* Perks Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              border: '2px solid var(--black)',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <span>Rate Notes</span>
          </div>

          <div
            style={{
              padding: '0.75rem',
              border: '2px solid var(--black)',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Upload size={16} />
            <span>Share Materials</span>
          </div>

          <div
            style={{
              padding: '0.75rem',
              border: '2px solid var(--black)',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Store size={16} />
            <span>Sell Instruments</span>
          </div>

          <div
            style={{
              padding: '0.75rem',
              border: '2px solid var(--black)',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <ShieldCheck size={16} color="#10B981" />
            <span>Track Status</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            backgroundColor: 'var(--white)',
            color: 'var(--black)',
            border: '3px solid var(--black)',
            boxShadow: '4px 4px 0px 0px var(--black)',
            padding: '0.85rem',
            fontSize: '1.1rem',
            fontWeight: 900,
            cursor: isSigningIn ? 'not-allowed' : 'pointer',
            transition: 'transform 0.1s',
            opacity: isSigningIn ? 0.7 : 1,
          }}
          onMouseDown={(e) => {
            if (isSigningIn) return;
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--black)';
          }}
          onMouseUp={(e) => {
            if (isSigningIn) return;
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--black)';
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          {isSigningIn ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
        </button>
      </div>
    </div>
  );
}
