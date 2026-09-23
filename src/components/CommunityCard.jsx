'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Users, ExternalLink } from 'lucide-react';

export default function CommunityCard({ community }) {
  const {
    id,
    name,
    logo_url,
    description,
    category,
    is_verified,
    community_type,
    target_audience,
  } = community;

  return (
    <div
      className="neo-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
        border: '3px solid var(--black)',
        boxShadow: '4px 4px 0px 0px var(--black)',
        padding: '1.5rem',
        height: '100%',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--black)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--black)';
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            flexShrink: 0,
            border: '2px solid var(--black)',
            backgroundColor: '#F3F4F6',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src={logo_url}
            alt={`${name} Logo`}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized // Cloudinary handles optimization via url usually, but unoptimized works universally
          />
        </div>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={name}
            >
              {name}
            </h3>
            {is_verified && (
              <ShieldCheck size={18} color="#2563EB" style={{ flexShrink: 0 }} title="Verified Official Community" />
            )}
          </div>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary-yellow)',
              border: '1.5px solid var(--black)',
              padding: '0.1rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginTop: '0.4rem',
            }}
          >
            {category}
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.9rem',
          color: '#4B5563',
          lineHeight: 1.5,
          fontWeight: 600,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description}
      </p>

      <div
        style={{
          borderTop: '2px dashed var(--black)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6B7280', fontSize: '0.8rem', fontWeight: 700 }}>
          <Users size={14} />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }} title={target_audience}>
            {target_audience}
          </span>
        </div>

        <Link href={`/community/${id}`}>
          <button
            style={{
              backgroundColor: 'var(--black)',
              color: 'var(--white)',
              border: '2px solid var(--black)',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--black)')}
          >
            VIEW PROFILE <ExternalLink size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
}
