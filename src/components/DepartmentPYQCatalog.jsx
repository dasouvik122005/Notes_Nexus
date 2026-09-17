"use client";

import React, { useState, useMemo } from 'react';
import SearchAndFilters from '@/components/SearchAndFilters';
import PaperCard from '@/components/PaperCard';
import dynamic from 'next/dynamic';
const AnimateInView = dynamic(() => import('@/components/AnimateInView'));

export default function DepartmentPYQCatalog({ department, initialPapers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(0); // 0 = All
  const [examType, setExamType] = useState('all'); // 'all' | 'mid_sem' | 'final_sem'
  const [sortBy, setSortBy] = useState('rating');

  const filteredPapers = useMemo(() => {
    let result = [...initialPapers];

    // Filter by semester
    if (selectedSemester > 0) {
      result = result.filter((p) => p.semester === selectedSemester);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.paperName.toLowerCase().includes(q) ||
          p.paperCode.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
      if (sortBy === 'name') return a.paperName.localeCompare(b.paperName);
      if (sortBy === 'code') return a.paperCode.localeCompare(b.paperCode);
      if (sortBy === 'semester') return a.semester - b.semester;
      return 0;
    });

    return result;
  }, [initialPapers, selectedSemester, searchTerm, sortBy]);

  return (
    <div>
      {/* Exam Type Toggle Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.95rem', marginRight: '0.5rem' }}>
          Exam Session:
        </span>
        {[
          { id: 'all', label: 'All Exam Papers' },
          { id: 'mid_sem', label: 'Mid Semester Only' },
          { id: 'final_sem', label: 'Final / End Semester Only' },
        ].map((tab) => {
          const isSelected = examType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setExamType(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                backgroundColor: isSelected ? 'var(--primary-pink)' : 'var(--white)',
                border: '2px solid var(--black)',
                boxShadow: isSelected ? 'none' : '2px 2px 0px 0px var(--black)',
                cursor: 'pointer',
                borderRadius: '4px',
                transform: isSelected ? 'translate(2px, 2px)' : 'none',
                transition: 'all 0.1s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Semester Filters */}
      <SearchAndFilters
        totalSemesters={department.totalSemesters}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          fontWeight: 800,
        }}
      >
        <span>
          Showing {filteredPapers.length} {filteredPapers.length === 1 ? 'subject paper' : 'subject papers'}
          {selectedSemester > 0 ? ` for Semester ${selectedSemester}` : ' across all semesters'}
        </span>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {filteredPapers.map((paper, index) => (
            <AnimateInView
              key={paper.id || paper.paperCode}
              delay={0.05 * (index % 4)}
              direction="up"
              style={{ height: '100%' }}
            >
              <PaperCard
                paper={paper}
                deptSlug={department.id}
                basePath="/pyq"
              />
            </AnimateInView>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className="neo-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--white)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            No question papers found
          </h3>
          <p style={{ color: '#555', fontWeight: 600, maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            We could not find any question papers matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSemester(0);
              setExamType('all');
            }}
            className="neo-button primary"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
