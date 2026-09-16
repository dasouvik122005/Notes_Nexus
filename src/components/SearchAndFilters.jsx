"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchAndFilters({
  totalSemesters = 8,
  selectedSemester,
  onSemesterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  const semesters = Array.from({ length: totalSemesters }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}
    >
      {/* Top Search Bar & Sort Row */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Box */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 320px',
            maxWidth: '550px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--black)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search size={20} strokeWidth={2.5} />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by paper name or code..."
            style={{
              width: '100%',
              padding: '0.85rem 2.75rem 0.85rem 3rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              backgroundColor: 'var(--white)',
              border: '3px solid var(--black)',
              boxShadow: '4px 4px 0px 0px var(--black)',
              outline: 'none',
            }}
          />

          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
              }}
            >
              <X size={18} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        {onSortChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                backgroundColor: 'var(--white)',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="rating">Highest Rated</option>
              <option value="name">Paper Name</option>
              <option value="code">Paper Code</option>
              <option value="semester">Semester</option>
            </select>
          </div>
        )}
      </div>

      {/* Semester Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.9rem', marginRight: '0.25rem' }}>
          Semester:
        </span>

        {/* 'All' Chip */}
        <button
          onClick={() => onSemesterChange(0)}
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            backgroundColor: selectedSemester === 0 ? 'var(--black)' : 'var(--white)',
            color: selectedSemester === 0 ? 'var(--white)' : 'var(--black)',
            border: '2px solid var(--black)',
            boxShadow: selectedSemester === 0 ? 'none' : '2px 2px 0px 0px var(--black)',
            cursor: 'pointer',
            borderRadius: '4px',
            transform: selectedSemester === 0 ? 'translate(2px, 2px)' : 'none',
            transition: 'all 0.1s',
          }}
        >
          All
        </button>

        {/* Semester Chips */}
        {semesters.map((sem) => {
          const isSelected = selectedSemester === sem;
          return (
            <button
              key={sem}
              onClick={() => onSemesterChange(sem)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                backgroundColor: isSelected ? 'var(--primary-yellow)' : 'var(--white)',
                color: 'var(--black)',
                border: '2px solid var(--black)',
                boxShadow: isSelected ? 'none' : '2px 2px 0px 0px var(--black)',
                cursor: 'pointer',
                borderRadius: '4px',
                transform: isSelected ? 'translate(2px, 2px)' : 'none',
                transition: 'all 0.1s',
              }}
            >
              Sem {sem}
            </button>
          );
        })}
      </div>
    </div>
  );
}
