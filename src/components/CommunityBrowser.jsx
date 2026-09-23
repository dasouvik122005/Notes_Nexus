'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import CommunityCard from './CommunityCard';
import { departments } from '@/config/departments';

export default function CommunityBrowser({ initialCommunities }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Filter logic
  const filteredCommunities = useMemo(() => {
    return initialCommunities.filter((community) => {
      const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            community.description.toLowerCase().includes(searchQuery.toLowerCase());
                            
      // If community department_id is null, it's open to all, so it shows up everywhere unless specifically filtered out?
      // Actually, if a user selects a specific dept, show communities mapped to that dept PLUS open communities.
      // Or maybe just strict filtering. Let's do strict filtering:
      const matchesDept = selectedDept === 'all' || community.department_id === selectedDept || community.department_id === null;

      return matchesSearch && matchesDept;
    });
  }, [initialCommunities, searchQuery, selectedDept]);

  return (
    <div>
      {/* Filters Section */}
      <div
        className="neo-card"
        style={{
          backgroundColor: 'var(--white)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Search */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.8rem', color: '#4B5563', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Search Groups
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#6B7280' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="E.g. Web Dev Club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                fontWeight: 800,
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.8rem', color: '#4B5563', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Department
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#6B7280' }}>
              <Filter size={18} />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                fontWeight: 800,
                fontSize: '0.9rem',
                outline: 'none',
                appearance: 'none',
                backgroundColor: 'var(--white)',
              }}
            >
              <option value="all">All Departments & Open Groups</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.shortCode})
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Results */}
      <div style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.1rem', color: '#374151' }}>
        Showing {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
      </div>

      {filteredCommunities.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div
          className="neo-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#F3F4F6',
            borderStyle: 'dashed',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>No communities found</h3>
          <p style={{ color: '#6B7280', fontWeight: 600 }}>Try adjusting your filters or search query to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
