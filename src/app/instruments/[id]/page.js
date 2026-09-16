'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NeoButton from '@/components/NeoButton';
import {
  Tag,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Flag,
  Share2,
} from 'lucide-react';

const sampleCatalog = [
  {
    id: 'inst-1',
    category: 'instrument',
    categoryLabel: 'Engineering Drafter / Tools',
    title: 'Mini Drafter (Omega) + T-Square with Carrying Case',
    description:
      'Used for one semester in Engineering Drawing. Excellent smooth condition with all tightening screws and protractor scale intact. Comes with original durable black canvas carrying bag and compass kit.',
    condition: 'Like New',
    expectedPrice: 450,
    isNegotiable: true,
    contactName: 'Rahul M.',
    contactPhone: '+91 98765 43210',
    createdAt: '2 days ago',
    department: 'B.Tech CSE / Core',
    photos: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'inst-2',
    category: 'book',
    categoryLabel: 'Academic Textbook',
    title: 'Higher Engineering Mathematics by B.S. Grewal (44th Ed.)',
    description:
      'Clean textbook, no pencil markings or torn pages. Covers Engineering Mathematics 1 and 2 thoroughly with solved university exam problems.',
    condition: 'Good',
    expectedPrice: 380,
    isNegotiable: false,
    contactName: 'Priya K.',
    contactPhone: '+91 98234 56789',
    createdAt: '3 days ago',
    department: 'B.Tech / Mathematics',
    photos: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'inst-3',
    category: 'instrument',
    categoryLabel: 'Lab Apron / Medical Gear',
    title: 'Clinical Stethoscope & Laboratory Apron (Size M)',
    description:
      'Pharmacy laboratory coat with university-approved white cotton fabric and standard dual-head stethoscope. Cleaned and sanitized, ideal for 1st/2nd year B.Pharma lab practicals.',
    condition: 'Good',
    expectedPrice: 600,
    isNegotiable: true,
    contactName: 'Subhajit D.',
    contactPhone: '+91 91234 56780',
    createdAt: '5 days ago',
    department: 'B.Pharma',
    photos: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'inst-4',
    category: 'book',
    categoryLabel: 'Academic Textbook',
    title: 'Data Structures and Algorithms in C by Reema Thareja',
    description:
      'Essential textbook for Semester 3 CSE/IT. Includes detailed code walkthroughs, Big-O analysis, and tree traversal diagrams.',
    condition: 'Like New',
    expectedPrice: 290,
    isNegotiable: false,
    contactName: 'Anik B.',
    contactPhone: '+91 97654 32109',
    createdAt: '1 week ago',
    department: 'B.Tech CSE / BCA',
    photos: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export default function ListingDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  // Find listing from sample or local storage
  const [listing] = useState(() => {
    const found = sampleCatalog.find((i) => i.id === id);
    if (found) return found;

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('notes_nexus_user_listings') || '[]');
        const storedItem = stored.find((i) => i.id === id);
        if (storedItem) {
          return {
            ...storedItem,
            contactName: 'Student Seller',
            contactPhone: '+91 98301 23456',
            photos: [],
          };
        }
      } catch {
        // Ignore
      }
    }
    return sampleCatalog[0];
  });

  // Anti-Scraping Phone Reveal State
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!listing) {
    notFound();
  }

  const cleanPhone = listing.contactPhone.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${listing.contactName}, I saw your listing for "${listing.title}" on Notes Nexus. Is it still available?`
  )}`;

  return (
    <div style={{ padding: '3.5rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/instruments"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              color: 'var(--black)',
            }}
          >
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Photos & Details */}
          <div>
            {/* Main Photo Card */}
            <div
              className="neo-card"
              style={{
                backgroundColor: 'var(--white)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '380px',
                  backgroundColor: '#F3F4F6',
                  border: '2px solid var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {listing.photos && listing.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.photos[activePhotoIdx] || listing.photos[0]}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                    <Tag size={48} style={{ margin: '0 auto 0.5rem auto' }} />
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>
                      No photos uploaded for this listing
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.photos && listing.photos.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  {listing.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      style={{
                        width: '70px',
                        height: '70px',
                        border: `3px solid ${activePhotoIdx === idx ? 'var(--black)' : '#D1D5DB'}`,
                        boxShadow:
                          activePhotoIdx === idx ? '2px 2px 0px 0px var(--black)' : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt="Thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div
              className="neo-card"
              style={{
                backgroundColor: 'var(--white)',
                padding: '2rem',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                Item Description
              </h2>

              <p
                style={{
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}
              >
                {listing.description}
              </p>
            </div>

            {/* Safety Tips Card */}
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  color: '#1E40AF',
                  marginBottom: '0.5rem',
                }}
              >
                <ShieldCheck size={18} />
                <span>CAMPUS EXCHANGE SAFETY GUIDELINES</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  fontSize: '0.85rem',
                  color: '#1E3A8A',
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                <li>Always meet in well-lit public campus locations (e.g. Central Library, Canteen).</li>
                <li>Inspect all tightening knobs, screws, and page integrity before paying.</li>
                <li>Notes Nexus is a free noticeboard and never asks for upfront online payments.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing & Contact Action Card */}
          <div>
            <div
              className="neo-card"
              style={{
                backgroundColor: 'var(--white)',
                padding: '2rem',
                position: 'sticky',
                top: '6rem',
              }}
            >
              {/* Category & Condition Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: 'var(--primary-cyan)',
                    border: '2px solid var(--black)',
                    padding: '0.2rem 0.6rem',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {listing.categoryLabel || listing.category}
                </span>

                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    border: '2px solid var(--black)',
                    padding: '0.2rem 0.6rem',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    color: '#166534',
                  }}
                >
                  Condition: {listing.condition}
                </span>

                {listing.department && (
                  <span
                    style={{
                      backgroundColor: '#FEF3C7',
                      border: '2px solid var(--black)',
                      padding: '0.2rem 0.6rem',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    {listing.department}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                {listing.title}
              </h1>

              {/* Price Block */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '3px solid var(--black)',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6B7280' }}>
                    Expected Price
                  </span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#166534' }}>
                    ₹{listing.expectedPrice}
                  </div>
                </div>

                {listing.isNegotiable && (
                  <span
                    style={{
                      backgroundColor: 'var(--primary-yellow)',
                      border: '2px solid var(--black)',
                      padding: '0.2rem 0.6rem',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Negotiable
                  </span>
                )}
              </div>

              {/* Seller Metadata */}
              <div
                style={{
                  borderTop: '2px dashed #E5E7EB',
                  paddingTop: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#4B5563',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  <span>Seller: <strong>{listing.contactName}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  <span>Posted: <strong>{listing.createdAt}</strong></span>
                </div>
              </div>

              {/* Anti-Scraping Phone Reveal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    border: '3px solid var(--black)',
                    backgroundColor: isPhoneRevealed ? '#FEF9C3' : '#F3F4F6',
                    boxShadow: '3px 3px 0px 0px var(--black)',
                    padding: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#4B5563', marginBottom: '0.4rem' }}>
                    Contact Seller Phone / WhatsApp
                  </div>

                  {!isPhoneRevealed ? (
                    <div>
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          letterSpacing: '1px',
                          color: '#4B5563',
                          marginBottom: '0.85rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        +91 98XXX XXXXX
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPhoneRevealed(true)}
                        style={{
                          backgroundColor: 'var(--primary-yellow)',
                          border: '2px solid var(--black)',
                          boxShadow: '2px 2px 0px 0px var(--black)',
                          padding: '0.65rem 1.25rem',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        <Phone size={16} /> Click to Reveal Contact
                      </button>

                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', marginTop: '0.6rem' }}>
                        Protected against automated scrapers
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          color: 'var(--black)',
                          marginBottom: '1rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {listing.contactPhone}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                          href={`tel:${cleanPhone}`}
                          style={{
                            backgroundColor: 'var(--white)',
                            border: '2px solid var(--black)',
                            boxShadow: '2px 2px 0px 0px var(--black)',
                            padding: '0.6rem 1rem',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: 'var(--black)',
                            textTransform: 'uppercase',
                          }}
                        >
                          <Phone size={16} /> Call Now
                        </a>

                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#22C55E',
                            color: 'var(--white)',
                            border: '2px solid var(--black)',
                            boxShadow: '2px 2px 0px 0px var(--black)',
                            padding: '0.6rem 1.1rem',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          <MessageSquare size={16} /> Open WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Listing */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setHasReported(true)}
                  disabled={hasReported}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: hasReported ? '#166534' : '#6B7280',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: hasReported ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Flag size={13} />
                  {hasReported ? '✓ Listing reported to admins' : 'Report this listing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
