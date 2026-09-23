'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import NeoButton from '@/components/NeoButton';
import { Edit2 } from 'lucide-react';

export default function EditCommunityButton({ communityId, submittedBy }) {
  const { user, profile } = useAuth();

  // Show if user is the submitter or an admin
  if (user && (user.id === submittedBy || profile?.role === 'admin')) {
    return (
      <Link href={`/community/${communityId}/edit`} style={{ textDecoration: 'none' }}>
        <NeoButton style={{ backgroundColor: 'var(--primary-pink)', color: 'var(--white)', padding: '0.4rem 0.85rem' }}>
          <Edit2 size={16} style={{ marginRight: '0.35rem' }} /> EDIT
        </NeoButton>
      </Link>
    );
  }

  return null;
}
