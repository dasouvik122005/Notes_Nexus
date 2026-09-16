import React from 'react';
import Link from 'next/link';
import AnimateInView from '@/components/AnimateInView';
import { Tag, Plus, PhoneCall, ShieldAlert, BookOpen, Wrench } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Instruments & Book Marketplace',
  description: `Peer-to-peer student marketplace for second-hand textbooks, engineering drafters, and lab instruments at ${siteConfig.university}.`,
};

// Seed sample listings for initial browse experience
const sampleListings = [
  {
    id: 'inst-1',
    category: 'instrument',
    title: 'Mini Drafter (Omega) + T-Square with Carrying Case',
    description: 'Used for one semester in Engineering Drawing. Excellent smooth condition with all tightening screws intact.',
    condition: 'Like New',
    expectedPrice: 450,
    isNegotiable: true,
    contactName: 'Rahul M.',
    contactPhone: '+91 98765 43210',
    createdAt: '2 days ago',
    department: 'B.Tech CSE / Core',
  },
  {
    id: 'inst-2',
    category: 'book',
    title: 'Higher Engineering Mathematics by B.S. Grewal (44th Ed.)',
    description: 'Clean textbook, no pencil markings or torn pages. Covers Engineering Math 1 and 2.',
    condition: 'Good',
    expectedPrice: 380,
    isNegotiable: false,
    contactName: 'Priya K.',
    contactPhone: '+91 98234 56789',
    createdAt: '3 days ago',
    department: 'B.Tech / Mathematics',
  },
  {
    id: 'inst-3',
    category: 'instrument',
    title: 'Clinical Stethoscope & Laboratory Apron (Size M)',
    description: 'Pharmacy laboratory coat and standard dual-head stethoscope. Cleaned and sanitized.',
    condition: 'Good',
    expectedPrice: 600,
    isNegotiable: true,
    contactName: 'Subhajit D.',
    contactPhone: '+91 91234 56780',
    createdAt: '5 days ago',
    department: 'B.Pharma',
  },
  {
    id: 'inst-4',
    category: 'book',
    title: 'Data Structures and Algorithms in C by Reema Thareja',
    description: 'Essential textbook for Semester 3 CSE/IT. Includes code walkthroughs and diagrams.',
    condition: 'Like New',
    expectedPrice: 290,
    isNegotiable: false,
    contactName: 'Anik B.',
    contactPhone: '+91 97654 32109',
    createdAt: '1 week ago',
    department: 'B.Tech CSE / BCA',
  },
];

export default function InstrumentsPage() {
  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container">
        
        {/* Header Banner */}
        <AnimateInView delay={0.1} direction="up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary-blue)',
              padding: '0.4rem 0.9rem',
              fontWeight: 900,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              border: '2px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              marginBottom: '1rem',
            }}
          >
            Student Marketplace
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: '3.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            INSTRUMENTS & <br />
            <span
              style={{
                backgroundColor: 'var(--primary-yellow)',
                padding: '0 0.5rem',
                display: 'inline-block',
                border: '4px solid var(--black)',
                transform: 'rotate(-1.5deg)',
              }}
            >
              TEXTBOOKS
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              maxWidth: '620px',
              margin: '0 auto 1.75rem auto',
              color: '#333',
            }}
          >
            Buy and sell pre-loved university equipment, lab coats, mini drafters, calculators, and semester textbooks from fellow students.
          </p>

          <Link
            href="/instruments/new"
            className="neo-button primary"
            style={{
              fontSize: '1rem',
              padding: '0.75rem 1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={20} />
            <span>List an Item for Sale</span>
          </Link>
        </AnimateInView>

        {/* Disclaimer Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#FEF3C7',
            border: '2px solid var(--black)',
            boxShadow: '3px 3px 0px 0px var(--black)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '3rem',
          }}
        >
          <ShieldAlert size={20} color="#92400E" />
          <span style={{ color: '#92400E' }}>
            Disclaimer: {siteConfig.name} is a student-to-student noticeboard and is not a party to any monetary transactions. Meet in safe on-campus public locations for handovers.
          </span>
        </div>

        {/* Listings Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {sampleListings.map((item, index) => (
            <AnimateInView
              key={item.id}
              delay={0.08 * (index + 1)}
              direction="up"
              style={{ height: '100%' }}
            >
              <div
                className="neo-card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--white)',
                }}
              >
                {/* Card Tag Banner */}
                <div
                  style={{
                    backgroundColor: item.category === 'instrument' ? 'var(--primary-yellow)' : 'var(--primary-pink)',
                    padding: '1rem 1.25rem',
                    borderBottom: '3px solid var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.category === 'instrument' ? <Wrench size={18} /> : <BookOpen size={18} />}
                    <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                  </div>

                  <span
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '2px solid var(--black)',
                      padding: '0.15rem 0.5rem',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    {item.condition}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#15803D' }}>
                    ₹{item.expectedPrice}{' '}
                    {item.isNegotiable && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>(Negotiable)</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: '#444', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {item.description}
                  </p>

                  <div style={{ marginTop: 'auto', borderTop: '2px dashed #ddd', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#666', marginBottom: '1rem' }}>
                      <span>Seller: {item.contactName}</span>
                      <span>{item.createdAt}</span>
                    </div>

                    <a
                      href={`tel:${item.contactPhone}`}
                      className="neo-button"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--white)',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <PhoneCall size={16} />
                      <span>Contact Seller</span>
                    </a>
                  </div>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>

      </div>
    </div>
  );
}
