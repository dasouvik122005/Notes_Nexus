'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  User,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Upload,
  Store,
  AlertTriangle,
  Eye,
  Trash2,
} from 'lucide-react';
import NeoButton from '@/components/NeoButton';

// Sample mock submissions for user dashboard visualization
const sampleUserMaterials = [
  {
    id: 'sub-1',
    title: 'Computer Networks - Unit 3 (Routing Algorithms & OSPF)',
    paperName: 'Computer Networks',
    paperCode: 'CS502',
    semester: 5,
    type: 'notes',
    status: 'approved',
    createdAt: '2026-09-12',
    viewCount: 142,
    ratingAvg: 4.8,
  },
  {
    id: 'sub-2',
    title: 'Operating Systems - Process Scheduling Handwritten Notes',
    paperName: 'Operating System',
    paperCode: 'CS402',
    semester: 4,
    type: 'notes',
    status: 'pending',
    createdAt: '2026-09-16',
    viewCount: 0,
    ratingAvg: 0,
  },
  {
    id: 'sub-3',
    title: 'Engineering Mathematics-1 Mid Sem 2024 Question Paper',
    paperName: 'Engineering Mathematics-1',
    paperCode: 'M101',
    semester: 1,
    type: 'pyq',
    status: 'rejected',
    rejectReason: 'Page 2 scan is cut off and blurry. Please rescan with adequate lighting.',
    createdAt: '2026-09-08',
    viewCount: 0,
    ratingAvg: 0,
  },
];

const sampleUserListings = [
  {
    id: 'list-1',
    title: 'Drafter & Engineering Graphics Kit with Compass',
    category: 'instrument',
    price: 450,
    status: 'active',
    createdAt: '2026-09-14',
  },
  {
    id: 'list-2',
    title: 'Galvin Operating System Concepts (9th Edition)',
    category: 'book',
    price: 320,
    status: 'sold',
    createdAt: '2026-08-28',
  },
];

export default function MyDashboardPage() {
  const { user, profile, isLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  const [materials, setMaterials] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('notes_nexus_user_materials') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          return [...stored, ...sampleUserMaterials];
        }
      } catch {
        // Fall back
      }
    }
    return sampleUserMaterials;
  });

  const [listings, setListings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('notes_nexus_user_listings') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          return [...stored, ...sampleUserListings];
        }
      } catch {
        // Fall back
      }
    }
    return sampleUserListings;
  });

  if (isLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Loading contributor profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '6rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: 'var(--white)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-yellow)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <User size={32} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Contributor Dashboard
            </h1>

            <p style={{ color: '#555', fontWeight: 600, lineHeight: 1.5, marginBottom: '2rem' }}>
              Please sign in with your Google account to track your submitted study materials, check verification status, and manage your marketplace listings.
            </p>

            <NeoButton
              onClick={() => openAuthModal('Sign in to view your profile and submissions.')}
              variant="primary"
              style={{ fontSize: '1.1rem', padding: '0.85rem 2rem' }}
            >
              SIGN IN WITH GOOGLE
            </NeoButton>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = profile?.account_status === 'verified';
  const isPending = profile?.account_status === 'pending';

  const markAsSold = (id) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 'sold' ? 'active' : 'sold' } : item
      )
    );
  };

  const deleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Profile Card Header */}
        <div
          className="neo-card"
          style={{
            padding: '2rem',
            backgroundColor: 'var(--white)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: profile?.role === 'admin' ? 'var(--primary-pink)' : 'var(--primary-yellow)',
                  border: '3px solid var(--black)',
                  boxShadow: '4px 4px 0px 0px var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                }}
              >
                {(profile?.name || user.email || 'U')[0].toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0 }}>
                    {profile?.name}
                  </h1>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      border: '2px solid var(--black)',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      backgroundColor: isVerified ? '#DCFCE7' : '#FEF9C3',
                      color: isVerified ? '#166534' : '#854D0E',
                    }}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Verified Account</span>
                      </>
                    ) : (
                      <>
                        <Clock size={13} />
                        <span>Pending Review</span>
                      </>
                    )}
                  </span>

                  {profile?.role === 'admin' && (
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        border: '2px solid var(--black)',
                        backgroundColor: 'var(--primary-pink)',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>

                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: '#666', fontSize: '0.95rem' }}>
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <NeoButton
                href="/upload"
                variant="primary"
                style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem' }}
              >
                <Upload size={16} style={{ marginRight: '0.4rem' }} />
                <span>Upload Material</span>
              </NeoButton>

              <NeoButton
                href="/instruments"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--white)',
                }}
              >
                <Store size={16} style={{ marginRight: '0.4rem' }} />
                <span>List Item</span>
              </NeoButton>
            </div>
          </div>

          {/* Pending Account Notice Box */}
          {isPending && (
            <div
              style={{
                marginTop: '1.75rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#FEF9C3',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={22} color="#854D0E" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 900, fontSize: '0.95rem', color: '#854D0E' }}>
                  First-Time Account Verification Pending
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#713F12', lineHeight: 1.5 }}>
                  Your contributor profile is currently in the admin approval queue. As a safety measure against spam, upload privileges will unlock once verified. You can still rate materials and browse all notes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '0.65rem 1.5rem',
              fontWeight: 900,
              fontSize: '1rem',
              backgroundColor: activeTab === 'submissions' ? 'var(--primary-yellow)' : 'var(--white)',
              border: '3px solid var(--black)',
              boxShadow: activeTab === 'submissions' ? '4px 4px 0px 0px var(--black)' : '2px 2px 0px 0px var(--black)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={18} />
            <span>My Submissions ({materials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            style={{
              padding: '0.65rem 1.5rem',
              fontWeight: 900,
              fontSize: '1rem',
              backgroundColor: activeTab === 'marketplace' ? 'var(--primary-pink)' : 'var(--white)',
              border: '3px solid var(--black)',
              boxShadow: activeTab === 'marketplace' ? '4px 4px 0px 0px var(--black)' : '2px 2px 0px 0px var(--black)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Store size={18} />
            <span>My Marketplace Items ({listings.length})</span>
          </button>
        </div>

        {/* Tab 1: Submissions */}
        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {materials.map((item) => (
              <div
                key={item.id}
                className="neo-card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <div style={{ flex: '1 1 350px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {/* Status Pill */}
                    {item.status === 'approved' && (
                      <span
                        style={{
                          backgroundColor: '#DCFCE7',
                          border: '2px solid var(--black)',
                          color: '#166534',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        ✓ Approved & Live
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span
                        style={{
                          backgroundColor: '#FEF9C3',
                          border: '2px solid var(--black)',
                          color: '#854D0E',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        ⏳ Pending Review
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span
                        style={{
                          backgroundColor: '#FEE2E2',
                          border: '2px solid var(--black)',
                          color: '#991B1B',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        ✕ Rejected
                      </span>
                    )}

                    <span
                      style={{
                        backgroundColor: 'var(--white)',
                        border: '2px solid var(--black)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                      }}
                    >
                      {item.paperCode} • Sem {item.semester}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                    {item.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>
                    {item.paperName} • Submitted on {item.createdAt}
                  </p>

                  {/* Rejection Reason Notice */}
                  {item.status === 'rejected' && item.rejectReason && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#FEE2E2',
                        border: '2px solid #EF4444',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#991B1B',
                      }}
                    >
                      <strong>Moderator note:</strong> {item.rejectReason}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.status === 'approved' && (
                    <Link
                      href={`/notes/btech-cse/${item.paperCode}`}
                      className="neo-button"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--white)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Eye size={15} />
                      <span>View Page</span>
                    </Link>
                  )}

                  <button
                    onClick={() => deleteMaterial(item.id)}
                    style={{
                      background: 'none',
                      border: '2px solid var(--black)',
                      padding: '0.45rem',
                      cursor: 'pointer',
                      color: '#DC2626',
                    }}
                    title="Delete submission"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Marketplace Listings */}
        {activeTab === 'marketplace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {listings.map((item) => (
              <div
                key={item.id}
                className="neo-card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: item.status === 'active' ? 'var(--primary-yellow)' : '#E5E7EB',
                        border: '2px solid var(--black)',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.status === 'active' ? '● Active' : '✓ Sold'}
                    </span>

                    <span
                      style={{
                        backgroundColor: 'var(--white)',
                        border: '2px solid var(--black)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                    {item.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--black)' }}>
                    ₹{item.price}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => markAsSold(item.id)}
                    className="neo-button"
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: item.status === 'sold' ? 'var(--white)' : 'var(--primary-green)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.status === 'sold' ? 'Re-list Item' : 'Mark as Sold'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
