import React from 'react';
import Link from 'next/link';
import NeoButton from '@/components/NeoButton';
import { Home, BookOpen, GraduationCap, Store, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ padding: '6rem 0 9rem 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div
          className="neo-card"
          style={{
            backgroundColor: 'var(--white)',
            padding: '3.5rem 2rem',
          }}
        >
          {/* Giant 404 Badge */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary-yellow)',
              border: '4px solid var(--black)',
              boxShadow: '6px 6px 0px 0px var(--black)',
              padding: '0.5rem 2rem',
              fontSize: '4.5rem',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1,
              marginBottom: '1.5rem',
              transform: 'rotate(-2deg)',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Lost on Campus?
          </h1>

          <p
            style={{
              color: '#4B5563',
              fontWeight: 600,
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}
          >
            The page or study material you are looking for does not exist, has been reorganized, or is awaiting moderator approval.
          </p>

          {/* Quick Shortcuts Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <Link
              href="/notes"
              style={{
                backgroundColor: 'var(--primary-yellow)',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '1rem 0.75rem',
                fontWeight: 900,
                fontSize: '0.85rem',
                color: 'var(--black)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              <BookOpen size={20} />
              <span>Notes Catalog</span>
            </Link>

            <Link
              href="/pyq"
              style={{
                backgroundColor: 'var(--primary-pink)',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '1rem 0.75rem',
                fontWeight: 900,
                fontSize: '0.85rem',
                color: 'var(--black)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              <GraduationCap size={20} />
              <span>PYQ Archives</span>
            </Link>

            <Link
              href="/instruments"
              style={{
                backgroundColor: 'var(--primary-cyan)',
                border: '2px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '1rem 0.75rem',
                fontWeight: 900,
                fontSize: '0.85rem',
                color: 'var(--black)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              <Store size={20} />
              <span>Marketplace</span>
            </Link>
          </div>

          <Link href="/">
            <NeoButton variant="default" style={{ padding: '0.8rem 2rem' }}>
              <Home size={16} style={{ marginRight: '0.4rem' }} />
              <span>RETURN TO HOME</span>
            </NeoButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
