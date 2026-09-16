'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AnimateInView from '@/components/AnimateInView';
import {
  Tag,
  Plus,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

import { createClient } from '@/lib/supabase/client';

export default function InstrumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'instrument' | 'book' | 'calculator' | 'lab_gear'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_low' | 'price_high'
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadListings() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('marketplace_items')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            category: item.category,
            title: item.title,
            description: item.description,
            condition: item.condition,
            expectedPrice: item.expected_price,
            isNegotiable: item.is_negotiable,
            contactName: item.contact_name,
            contactPhone: item.contact_phone,
            department: item.department,
            photos: item.photo_keys || [],
            createdAt: new Date(item.created_at).toLocaleDateString(),
          }));
          if (isMounted) {
            setListings(mapped);
            setIsLoading(false);
          }
          return;
        }
      } catch {
        // Fall back to client storage
      }

      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('notes_nexus_user_listings') || '[]');
          const approvedStored = stored.filter((s) => s.status === 'approved' || s.status === 'active');
          if (isMounted) {
            setListings(approvedStored);
          }
        } catch {
          if (isMounted) setListings([]);
        }
      }

      if (isMounted) setIsLoading(false);
    }

    loadListings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'instrument' && item.category !== 'instrument') return false;
          if (selectedCategory === 'book' && item.category !== 'book') return false;
          if (selectedCategory === 'calculator' && item.category !== 'calculator') return false;
          if (selectedCategory === 'lab_gear' && item.category !== 'lab_gear') return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchDept = item.department?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchDept) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.expectedPrice - b.expectedPrice;
        if (sortBy === 'price_high') return b.expectedPrice - a.expectedPrice;
        return 0; // default order
      });
  }, [listings, selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ padding: '4rem 0 7rem 0' }}>
      <div className="container">
        {/* Header Banner */}
        <AnimateInView delay={0.1} direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            Student Peer Noticeboard
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
              fontSize: '1.15rem',
              fontWeight: 600,
              maxWidth: '620px',
              margin: '0 auto 1.75rem auto',
              color: '#333',
              lineHeight: 1.6,
            }}
          >
            Buy and sell pre-loved university equipment, lab coats, mini drafters, calculators, and semester textbooks from fellow JIS University students.
          </p>

          <Link
            href="/instruments/new"
            className="neo-button primary"
            style={{
              fontSize: '1rem',
              padding: '0.85rem 2rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={20} />
            <span>POST A LISTING</span>
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
            border: '3px solid var(--black)',
            boxShadow: '3px 3px 0px 0px var(--black)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '2.5rem',
          }}
        >
          <ShieldAlert size={20} color="#92400E" style={{ flexShrink: 0 }} />
          <span style={{ color: '#92400E' }}>
            Disclaimer: {siteConfig.name} is a student-to-student noticeboard and is not a party to any monetary transactions. Meet in safe on-campus public locations for handovers.
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="neo-card"
          style={{
            backgroundColor: 'var(--white)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {/* Search Input */}
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280',
                }}
              />
              <input
                type="text"
                placeholder="Search drafters, textbooks, calculators, aprons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.75rem',
                  border: '2px solid var(--black)',
                  boxShadow: '2px 2px 0px 0px var(--black)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  backgroundColor: '#F9FAFB',
                  outline: 'none',
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} />
              <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  border: '2px solid var(--black)',
                  boxShadow: '2px 2px 0px 0px var(--black)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--white)',
                  outline: 'none',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
              borderTop: '2px dashed #E5E7EB',
              paddingTop: '1rem',
            }}
          >
            <span style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280' }}>
              Category:
            </span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'instrument', label: '📐 Drafters & Tools' },
              { id: 'book', label: '📚 Textbooks' },
              { id: 'calculator', label: '🧮 Calculators' },
              { id: 'lab_gear', label: '🥼 Lab Gear' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id ? 'var(--primary-yellow)' : 'var(--white)',
                  border: '2px solid var(--black)',
                  boxShadow:
                    selectedCategory === cat.id
                      ? '2px 2px 0px 0px var(--black)'
                      : '1px 1px 0px 0px var(--black)',
                  padding: '0.35rem 0.75rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--white)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              Loading marketplace listings...
            </h3>
            <p style={{ color: '#6B7280', fontWeight: 600 }}>Fetching latest student items from database</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div
            className="neo-card"
            style={{
              backgroundColor: 'var(--white)',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <Tag size={40} style={{ margin: '0 auto 1rem auto', color: '#9CA3AF' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              No Listings Found
            </h3>
            <p style={{ color: '#6B7280', fontWeight: 600, marginBottom: '1.5rem' }}>
              No student items matched your search filter. Have something to sell?
            </p>
            <Link href="/instruments/new" className="neo-button primary">
              <Plus size={16} style={{ marginRight: '0.3rem' }} />
              <span>POST FIRST LISTING</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredListings.map((item, index) => (
              <AnimateInView
                key={item.id}
                delay={0.05 * (index + 1)}
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
                    transition: 'transform 0.15s ease',
                  }}
                >
                  {/* Card Tag Banner */}
                  <div
                    style={{
                      backgroundColor:
                        item.category === 'instrument'
                          ? 'var(--primary-yellow)'
                          : item.category === 'book'
                          ? 'var(--primary-pink)'
                          : 'var(--primary-cyan)',
                      padding: '0.85rem 1.15rem',
                      borderBottom: '3px solid var(--black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {item.category === 'instrument' ? (
                        <Wrench size={16} />
                      ) : (
                        <BookOpen size={16} />
                      )}
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                        }}
                      >
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
                  <div
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.6rem',
                        fontWeight: 900,
                        marginBottom: '0.5rem',
                        color: '#15803D',
                      }}
                    >
                      ₹{item.expectedPrice}{' '}
                      {item.isNegotiable && (
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>
                          (Negotiable)
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        lineHeight: 1.3,
                        marginBottom: '0.65rem',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        color: '#4B5563',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        marginBottom: '1.25rem',
                      }}
                    >
                      {item.description}
                    </p>

                    <div
                      style={{
                        marginTop: 'auto',
                        borderTop: '2px dashed #E5E7EB',
                        paddingTop: '1rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#6B7280',
                          marginBottom: '0.85rem',
                        }}
                      >
                        <span>Seller: {item.contactName}</span>
                        <span>{item.createdAt}</span>
                      </div>

                      <Link
                        href={`/instruments/${item.id}`}
                        className="neo-button"
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--primary-yellow)',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span>View Details & Contact</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
