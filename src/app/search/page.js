'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, BookOpen, GraduationCap, Store, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import NeoButton from '@/components/NeoButton';

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'btech-cse', label: 'B.Tech CSE' },
  { id: 'btech-ds', label: 'B.Tech Data Science' },
  { id: 'btech-aiml', label: 'B.Tech AI & ML' },
  { id: 'bca', label: 'BCA' },
  { id: 'mca', label: 'MCA' },
  { id: 'bba', label: 'BBA' },
  { id: 'mba', label: 'MBA' },
  { id: 'bsc-biotech', label: 'B.Sc Biotechnology' },
  { id: 'msc-biotech', label: 'M.Sc Biotechnology' },
  { id: 'b-pharm', label: 'B.Pharm' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'notes', label: 'Lecture Notes', icon: <BookOpen size={16} /> },
  { id: 'pyq', label: 'Previous Year Papers', icon: <GraduationCap size={16} /> },
  { id: 'instruments', label: 'Marketplace', icon: <Store size={16} /> },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [type, setType] = useState('all');
  const [dept, setDept] = useState('all');
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search
  const performSearch = useCallback(async () => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&type=${type}&dept=${dept}`);
      if (!res.ok) throw new Error('Search failed to load.');
      
      const data = await res.json();
      setResults(data.results || []);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, type, dept]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const getIconForType = (resType) => {
    switch (resType) {
      case 'notes': return <BookOpen size={20} style={{ color: 'var(--primary-yellow)' }} />;
      case 'pyq': return <GraduationCap size={20} style={{ color: 'var(--primary-pink)' }} />;
      case 'instruments': return <Store size={20} style={{ color: '#22C55E' }} />;
      default: return <FileText size={20} />;
    }
  };

  const getBadgeColor = (resType) => {
    switch (resType) {
      case 'notes': return 'var(--primary-yellow)';
      case 'pyq': return 'var(--primary-pink)';
      case 'instruments': return '#22C55E';
      default: return '#E5E7EB';
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>
          Global Search
        </h1>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <div style={{
            position: 'absolute',
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Search size={24} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for subjects, paper codes, or instruments..."
            style={{
              width: '100%',
              padding: '1.25rem 1.25rem 1.25rem 3.5rem',
              fontSize: '1.2rem',
              fontWeight: 800,
              backgroundColor: 'var(--white)',
              border: '3px solid var(--black)',
              boxShadow: '4px 4px 0px 0px var(--black)',
              outline: 'none',
              borderRadius: '0'
            }}
            autoFocus
          />
          {isLoading && (
            <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
              <Loader2 className="spin" size={24} />
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap', 
          marginBottom: '3rem',
          backgroundColor: '#F9FAFB',
          padding: '1rem',
          border: '2px solid var(--black)',
          boxShadow: '2px 2px 0px 0px var(--black)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <Filter size={18} /> Filters:
          </div>
          
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem',
              fontWeight: 700,
              border: '2px solid var(--black)',
              backgroundColor: 'var(--white)',
              cursor: 'pointer'
            }}
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          <select 
            value={dept} 
            onChange={(e) => setDept(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem',
              fontWeight: 700,
              border: '2px solid var(--black)',
              backgroundColor: 'var(--white)',
              cursor: 'pointer'
            }}
            disabled={type === 'instruments'}
          >
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>

        {/* Results Area */}
        <div>
          {error && (
            <div style={{ 
              backgroundColor: '#FEE2E2', 
              color: '#991B1B', 
              padding: '1rem', 
              border: '2px solid var(--black)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem'
            }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <Search size={48} style={{ color: '#9CA3AF', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>No results found</h3>
              <p style={{ color: '#4B5563', fontWeight: 600 }}>Try adjusting your search terms or filters.</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </h2>
              
              {results.map((result) => (
                <Link key={result.id} href={result.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="neo-card" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    backgroundColor: 'var(--white)',
                    transition: 'transform 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#F3F4F6',
                        border: '2px solid var(--black)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getIconForType(result.type)}
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            textTransform: 'uppercase',
                            backgroundColor: getBadgeColor(result.type),
                            padding: '0.1rem 0.4rem',
                            border: '1px solid var(--black)',
                            color: result.type === 'instruments' ? 'var(--white)' : 'var(--black)'
                          }}>
                            {result.type}
                          </span>
                          {result.code && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4B5563' }}>
                              {result.code}
                            </span>
                          )}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{result.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>{result.subtitle}</p>
                      </div>
                    </div>
                    
                    <div style={{ color: '#9CA3AF' }}>
                      <ArrowRight size={24} strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!hasSearched && !isLoading && debouncedQuery.length < 2 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6B7280' }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Enter at least 2 characters to start searching...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Loader2 className="spin" size={32} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
