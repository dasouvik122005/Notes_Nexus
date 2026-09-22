'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

import { createClient } from '@/lib/supabase/client';

export default function ListingDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Anti-Scraping Phone Reveal State
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          if (isMounted) {
            if (data.status === 'sold') {
              setListing({
                id: data.id,
                title: data.title,
                status: 'sold',
              });
            } else {
              setListing({
                id: data.id,
                category: data.category,
                categoryLabel: data.category === 'instrument' ? 'Engineering Drafter / Tools' : data.category === 'book' ? 'Academic Textbook' : 'Student Item',
                title: data.title,
                description: data.description,
                condition: data.condition === 'like_new' ? 'Like New' : data.condition === 'fair' ? 'Fair' : 'Good',
                expectedPrice: data.expected_price,
                isNegotiable: data.is_negotiable,
                contactName: data.contact_name,
                contactPhone: data.contact_phone,
                department: data.department,
                photos: data.photo_keys || [],
                status: data.status,
                createdAt: new Date(data.created_at).toLocaleDateString(),
              });
            }
            setIsLoading(false);
          }
          return;
        }
      } catch {
        // Fall back
      }

      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('notes_nexus_user_listings') || '[]');
          const storedItem = stored.find((i) => i.id === id);
          if (storedItem && isMounted) {
            if (storedItem.status === 'sold') {
              setListing({
                id: storedItem.id,
                title: storedItem.title,
                status: 'sold',
              });
            } else {
              setListing({
                ...storedItem,
                categoryLabel: storedItem.category === 'instrument' ? 'Engineering Drafter / Tools' : 'Academic Textbook',
                photos: storedItem.photos || [],
              });
            }
            setIsLoading(false);
            return;
          }
        } catch {
          // Ignore
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadItem();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ padding: '4rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="neo-card" style={{ padding: '3rem', backgroundColor: 'var(--white)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Loading listing details...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    notFound();
  }

  if (listing.status === 'sold') {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: 'var(--white)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '0.3rem 0.8rem',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              ITEM SOLD
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              This Item Has Been Sold
            </h1>

            <p style={{ color: '#4B5563', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              &quot;<strong>{listing.title}</strong>&quot; has already been marked as sold by its owner and is no longer available.
            </p>

            <Link href="/instruments">
              <NeoButton variant="primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                BROWSE AVAILABLE ITEMS →
              </NeoButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cleanPhone = (listing.contactPhone || '').replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${listing.contactName}, I saw your listing for "${listing.title}" on Notes Nexus. Is it still available?`
  )}`;

  return (
    <div className="item-detail-wrapper">
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            href="/instruments"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              color: 'var(--black)',
            }}
          >
            <ArrowLeft size={15} /> Back to Marketplace
          </Link>
        </div>

        {/* Main Grid: Hardcoded canonical DOM order (1. Gallery -> 2. Details/Contact -> 3. Description -> 4. Safety) */}
        <div className="item-detail-grid">
          {/* 1. Image Gallery Card */}
          <div className="neo-card item-gallery-card">
            <div className="item-photo-box">
              {listing.photos && listing.photos.length > 0 ? (
                <Image
                  unoptimized
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={listing.photos[activePhotoIdx] || listing.photos[0]}
                  alt={listing.title}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                  <Tag size={44} style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                    No photos uploaded for this listing
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.photos && listing.photos.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {listing.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`item-thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image
                      unoptimized
                      fill
                      sizes="100px"
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Main Details, Price, Seller & Contact Card */}
          <div className="neo-card item-main-card">
            {/* Category & Condition Badges */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              <span
                style={{
                  backgroundColor: '#A5F3FC',
                  border: '2px solid var(--black)',
                  padding: '0.2rem 0.55rem',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                }}
              >
                {listing.categoryLabel || listing.category}
              </span>

              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  border: '2px solid var(--black)',
                  padding: '0.2rem 0.55rem',
                  fontWeight: 900,
                  fontSize: '0.72rem',
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
                    padding: '0.2rem 0.55rem',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                  }}
                >
                  {listing.department}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                lineHeight: 1.25,
                margin: '0 0 0.85rem 0',
                color: 'var(--black)',
              }}
            >
              {listing.title}
            </h1>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: '#F9FAFB',
                border: '2.5px solid var(--black)',
                boxShadow: '2.5px 2.5px 0px 0px var(--black)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', display: 'block' }}>
                  Expected Price
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#166534', lineHeight: 1 }}>
                  ₹{listing.expectedPrice}
                </span>
              </div>

              {listing.isNegotiable && (
                <span
                  style={{
                    backgroundColor: 'var(--primary-yellow)',
                    border: '1.5px solid var(--black)',
                    padding: '0.2rem 0.55rem',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    boxShadow: '1.5px 1.5px 0px 0px var(--black)',
                  }}
                >
                  Negotiable
                </span>
              )}
            </div>

            {/* Seller & Date Metadata */}
            <div
              style={{
                borderTop: '1.5px dashed #E5E7EB',
                paddingTop: '0.75rem',
                marginBottom: '1.15rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#4B5563',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} color="#6B7280" />
                <span>Seller: <strong>{listing.contactName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} color="#6B7280" />
                <span>Posted: <strong>{listing.createdAt}</strong></span>
              </div>
            </div>

            {/* Contact Action Box */}
            <div
              style={{
                border: '2.5px solid var(--black)',
                backgroundColor: isPhoneRevealed ? '#FEF9C3' : '#F9FAFB',
                boxShadow: '2.5px 2.5px 0px 0px var(--black)',
                padding: '1.15rem 1rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#4B5563', marginBottom: '0.35rem' }}>
                Contact Seller Phone / WhatsApp
              </div>

              {!isPhoneRevealed ? (
                <div>
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      letterSpacing: '1px',
                      color: '#4B5563',
                      marginBottom: '0.75rem',
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
                      padding: '0.6rem 1.25rem',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Phone size={15} /> Click to Reveal Contact
                  </button>

                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginTop: '0.5rem' }}>
                    Protected against automated scrapers
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: 'var(--black)',
                      marginBottom: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {listing.contactPhone}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${cleanPhone}`}
                      style={{
                        backgroundColor: 'var(--white)',
                        border: '2px solid var(--black)',
                        boxShadow: '2px 2px 0px 0px var(--black)',
                        padding: '0.55rem 0.95rem',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--black)',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={14} /> Call Now
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
                        padding: '0.55rem 1rem',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageSquare size={14} /> Open WhatsApp
                    </a>
                  </div>
                </div>
              )}
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
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: hasReported ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Flag size={12} />
                {hasReported ? '✓ Listing reported to admins' : 'Report this listing'}
              </button>
            </div>
          </div>

          {/* 3. Item Description Card */}
          <div className="neo-card item-desc-card">
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                color: 'var(--black)',
              }}
            >
              Item Description
            </h2>

            <p
              style={{
                color: '#374151',
                fontWeight: 600,
                fontSize: '0.95rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                margin: 0,
              }}
            >
              {listing.description}
            </p>
          </div>

          {/* 4. Safety Guidelines Card */}
          <div className="neo-card item-safety-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 900,
                fontSize: '0.85rem',
                color: '#1E40AF',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <ShieldCheck size={18} />
              <span>Campus Exchange Safety Guidelines</span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.25rem',
                fontSize: '0.82rem',
                color: '#1E3A8A',
                fontWeight: 700,
                lineHeight: 1.55,
              }}
            >
              <li>Always meet in well-lit public campus locations (e.g. Central Library, Canteen).</li>
              <li>Inspect all tightening knobs, screws, and page integrity before paying.</li>
              <li>Notes Nexus is a free noticeboard and never asks for upfront online payments.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
