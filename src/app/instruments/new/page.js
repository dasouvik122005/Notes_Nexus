'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import NeoButton from '@/components/NeoButton';
import {
  Store,
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Phone,
  Tag,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'instrument', label: 'Engineering Drafter / Tools' },
  { id: 'book', label: 'Academic Textbook' },
  { id: 'calculator', label: 'Scientific Calculator' },
  { id: 'lab_gear', label: 'Lab Apron / Medical Gear' },
  { id: 'other', label: 'Other Academic Item' },
];

const CONDITIONS = [
  { id: 'Like New', label: 'Like New', desc: 'Flawless condition, minimal or no signs of use' },
  { id: 'Good', label: 'Good', desc: 'Minor cosmetic wear, 100% functionally intact' },
  { id: 'Fair', label: 'Fair', desc: 'Visible signs of wear, fully usable' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const { user, profile, isLoading, openAuthModal } = useAuth();

  // Form State
  const [category, setCategory] = useState('instrument');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [department, setDepartment] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState('');

  // Photos State
  const [photos, setPhotos] = useState([]); // array of { file, previewUrl }
  const fileInputRef = useRef(null);

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedListing, setSubmittedListing] = useState(null);

  // Handle Photo Selection
  const handlePhotoSelect = (e) => {
    setError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      setError('You can upload a maximum of 3 photos per listing.');
      return;
    }

    const newPhotos = [...photos];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files (JPG, PNG, WEBP) are supported.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5 MB limit.`);
        continue;
      }
      newPhotos.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setPhotos(newPhotos);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !price || !contactName.trim() || !contactPhone.trim()) {
      setError('Please fill in all required fields (title, price, contact name, and phone).');
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('condition', condition);
      formData.append('price', priceNum.toString());
      formData.append('isNegotiable', isNegotiable ? 'true' : 'false');
      formData.append('department', department.trim());
      formData.append('contactName', contactName.trim());
      formData.append('contactPhone', contactPhone.trim());
      if (user?.email) formData.append('contactEmail', user.email);

      for (const p of photos) {
        formData.append('photos', p.file);
      }

      const res = await fetch('/api/marketplace/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing.');
      }

      // Save locally to reflect in /me immediately
      const newListingRecord = {
        id: data.listing?.id || `list-${Date.now()}`,
        title: title.trim(),
        category,
        price: priceNum,
        condition,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        const stored = JSON.parse(localStorage.getItem('notes_nexus_user_listings') || '[]');
        stored.unshift(newListingRecord);
        localStorage.setItem('notes_nexus_user_listings', JSON.stringify(stored));
      } catch {
        // Storage unavailable
      }

      setSubmittedListing(newListingRecord);
    } catch (err) {
      console.error('[Create Listing] Error:', err);
      setError(err.message || 'An error occurred while creating your listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading state
  if (isLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Checking account status...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state
  if (!user) {
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
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-blue)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <Store size={32} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Sign In to List an Item
            </h1>

            <p style={{ color: '#4B5563', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
              Only verified JIS University students can list second-hand drafters, lab gear, and textbooks for campus exchange.
            </p>

            <NeoButton
              onClick={() => openAuthModal('Sign in with Google to list an item on the marketplace.')}
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

  // 3. Pending Contributor State
  if (profile?.account_status === 'pending' && profile?.role !== 'admin') {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div
            className="neo-card"
            style={{
              padding: '2.5rem 2rem',
              backgroundColor: '#FEF9C3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'var(--primary-yellow)',
                  border: '3px solid var(--black)',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={30} />
              </div>

              <div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--black)',
                    color: 'var(--white)',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Account Under Review
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>
                  Marketplace Privileges Pending
                </h1>

                <p
                  style={{
                    color: '#374151',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  To keep the student marketplace spam-free and safe, first-time student accounts undergo a one-time verification by student moderators before listing second-hand instruments or books.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/me">
                    <NeoButton variant="default">CHECK STATUS IN DASHBOARD</NeoButton>
                  </Link>
                  <Link href="/instruments">
                    <NeoButton variant="secondary">BROWSE MARKETPLACE</NeoButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Success Screen
  if (submittedListing) {
    return (
      <div style={{ padding: '5rem 0 8rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            className="neo-card"
            style={{
              padding: '3rem 2rem',
              backgroundColor: '#F0FDF4',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#22C55E',
                color: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '2px solid var(--black)',
                boxShadow: '2px 2px 0px 0px var(--black)',
                fontWeight: 900,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              LISTING SUBMITTED FOR REVIEW
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Item Queued for Approval!
            </h1>

            <p style={{ color: '#374151', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your listing &quot;<strong>{submittedListing.title}</strong>&quot; for <strong>₹{submittedListing.price}</strong> has been submitted to the moderation queue. It will appear on the public marketplace board once approved by student admins.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/me">
                <NeoButton variant="primary" style={{ padding: '0.75rem 1.5rem' }}>
                  VIEW IN MY DASHBOARD
                </NeoButton>
              </Link>
              <Link href="/instruments">
                <NeoButton variant="default" style={{ padding: '0.75rem 1.5rem' }}>
                  BROWSE ALL LISTINGS
                </NeoButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Unlocked Creation Form
  return (
    <div style={{ padding: '4rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-blue)',
              border: '2px solid var(--black)',
              boxShadow: '2px 2px 0px 0px var(--black)',
              fontWeight: 900,
              fontSize: '0.8rem',
              padding: '0.2rem 0.6rem',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Tag size={14} /> Student Noticeboard
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            List an Item for Sale
          </h1>

          <p style={{ color: '#4B5563', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.5 }}>
            Help fellow JIS University students get affordable drafters, lab aprons, and textbooks. All items are verified by student moderators before going live.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--white)',
              padding: '2.5rem 2rem',
              marginBottom: '2rem',
            }}
          >
            {/* 1. Category Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                1. Select Category *
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    style={{
                      padding: '0.85rem 0.6rem',
                      border: '2px solid var(--black)',
                      backgroundColor:
                        category === c.id ? 'var(--primary-yellow)' : '#F9FAFB',
                      boxShadow:
                        category === c.id
                          ? '3px 3px 0px 0px var(--black)'
                          : '1px 1px 0px 0px var(--black)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Item Title & Condition */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem',
                  }}
                >
                  2. Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omega Mini Drafter with Carrying Case & Compass Set"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '3px solid var(--black)',
                    boxShadow: '3px 3px 0px 0px var(--black)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--white)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Condition */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Condition *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {CONDITIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCondition(c.id)}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid var(--black)',
                        backgroundColor:
                          condition === c.id ? '#DCFCE7' : 'var(--white)',
                        boxShadow:
                          condition === c.id
                            ? '3px 3px 0px 0px var(--black)'
                            : '1px 1px 0px 0px var(--black)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{c.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600, marginTop: '0.2rem' }}>
                        {c.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Negotiable */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Expected Price (₹) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '0.75rem 1rem',
                        border: '3px solid var(--black)',
                        borderRight: 'none',
                        backgroundColor: '#F3F4F6',
                        fontWeight: 900,
                        fontSize: '1rem',
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 450"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '3px solid var(--black)',
                        boxShadow: '3px 3px 0px 0px var(--black)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        backgroundColor: 'var(--white)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ paddingTop: '1.5rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--black)' }}
                    />
                    <span>Price is Negotiable</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Description & Department */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem',
                  }}
                >
                  Description / Item Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the item's condition, included accessories, brand, and when you used it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--black)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--white)',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#4B5563',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Recommended Academic Department (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech 1st Year / B.Pharma / Core Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    border: '2px solid var(--black)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--white)',
                  }}
                />
              </div>
            </div>

            {/* 4. Photos Dropzone (1–3 photos) */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                Photos (Up to 3 images, Max 5 MB each)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />

              {/* Photos List Preview */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {photos.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '110px',
                      height: '110px',
                      border: '3px solid var(--black)',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      overflow: 'hidden',
                      backgroundColor: '#F3F4F6',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.previewUrl}
                      alt={`Item photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#EF4444',
                        color: 'var(--white)',
                        border: '1px solid var(--black)',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '110px',
                      height: '110px',
                      border: '3px dashed var(--black)',
                      backgroundColor: '#F9FAFB',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                    }}
                  >
                    <UploadCloud size={24} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>ADD PHOTO</span>
                  </button>
                )}
              </div>
            </div>

            {/* 5. Contact Information & Anti-Scraping Note */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                3. Seller Contact Details *
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul M."
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '2px solid var(--black)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--white)',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98301 23456"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '2px solid var(--black)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--white)',
                    }}
                  />
                </div>
              </div>

              {/* Anti-Scraping Notice */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '2px solid var(--black)',
                  boxShadow: '2px 2px 0px 0px var(--black)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#1E40AF',
                }}
              >
                🛡️ <strong>Anti-Scraping Protection:</strong> Your phone number is never shown directly in raw page HTML. It is masked behind an interactive click-to-reveal button to stop automated crawlers from harvesting student numbers.
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '3px solid var(--black)',
                  boxShadow: '3px 3px 0px 0px var(--black)',
                  padding: '1rem',
                  color: '#991B1B',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <NeoButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{
                  fontSize: '1.1rem',
                  padding: '0.9rem 2.2rem',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'SUBMITTING LISTING...' : 'POST LISTING FOR REVIEW'}
              </NeoButton>

              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280' }}>
                All listings undergo <strong>moderation review</strong> before publication.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
