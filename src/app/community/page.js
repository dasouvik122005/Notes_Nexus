import React from 'react';
import Link from 'next/link';
import { getApprovedCommunities } from '@/lib/data/communities';
import CommunityBrowser from '@/components/CommunityBrowser';
import NeoButton from '@/components/NeoButton';
import { Users, Plus, ShieldCheck } from 'lucide-react';
import nextDynamic from 'next/dynamic';
import { siteConfig } from '@/config/site';

const AnimateInView = nextDynamic(() => import('@/components/AnimateInView'));

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: `Communities & Clubs | ${siteConfig.name}`,
  description: `Discover official student clubs, department communities, and independent groups at ${siteConfig.university}.`,
};

export default async function CommunityDirectoryPage() {
  const communities = await getApprovedCommunities();

  return (
    <div style={{ padding: '4rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Banner */}
        <AnimateInView delay={0.1} direction="up" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'var(--primary-yellow)',
                  border: '2px solid var(--black)',
                  boxShadow: '2px 2px 0px 0px var(--black)',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.6rem',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                <Users size={14} /> Student Network
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '1rem',
                }}
              >
                Communities
              </h1>

              <p style={{ color: '#4B5563', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px' }}>
                Discover, join, and collaborate with student clubs, department groups, and technical societies across {siteConfig.university}.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link href="/community/register">
                <NeoButton variant="primary" style={{ padding: '0.8rem 1.5rem', width: '100%', justifyContent: 'center' }}>
                  <Plus size={18} /> REGISTER A COMMUNITY
                </NeoButton>
              </Link>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
                <ShieldCheck size={14} /> Admin verified listings
              </div>
            </div>
          </div>
        </AnimateInView>

        {/* Browser Component */}
        <CommunityBrowser initialCommunities={communities} />
        
      </div>
    </div>
  );
}
