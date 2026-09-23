import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCommunityById } from '@/lib/data/communities';
import { departments } from '@/config/departments';
import NeoButton from '@/components/NeoButton';
import {
  ShieldCheck,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Github,
  Twitter,
  Link as LinkIcon,
  MessageCircle,
  Users,
  Send,
  Mail,
  FileText,
  Calendar,
  Star,
  CheckCircle,
  Info,
  Building2,
  ChevronLeft,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import EditCommunityButton from '@/components/EditCommunityButton';

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }) {
  const { id } = await params;
  const community = await getCommunityById(id);
  
  if (!community || community.status !== 'approved') {
    return { title: 'Community Not Found' };
  }
  
  return {
    title: `${community.name} | ${siteConfig.name}`,
    description: community.description,
  };
}

export default async function CommunityProfilePage({ params }) {
  const { id } = await params;
  const community = await getCommunityById(id);

  if (!community || community.status !== 'approved') {
    notFound();
  }

  // Helper to map department id to name
  const deptName = community.department_id 
    ? departments.find(d => d.id === community.department_id)?.name || community.department_id 
    : 'Open to All Departments';

  // Extract Links
  const off = community.official_links || {};
  const join = community.join_links || {};

  const hasOfficialLinks = Object.values(off).some(link => link);
  const hasJoinLinks = Object.values(join).some(link => link);

  return (
    <div style={{ padding: '3rem 0 8rem 0', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Back Link & Edit Button */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem', color: '#4B5563', textDecoration: 'none' }}>
            <ChevronLeft size={16} /> BACK TO DIRECTORY
          </Link>
          <EditCommunityButton communityId={community.id} submittedBy={community.submitted_by} />
        </div>

        {/* Header Profile Section */}
        <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Logo */}
            <div
              style={{
                width: '140px',
                height: '140px',
                flexShrink: 0,
                border: '4px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                backgroundColor: '#F3F4F6',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={community.logo_url}
                alt={`${community.name} Logo`}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>

            {/* Title & Badges */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: 'var(--primary-yellow)', border: '2px solid var(--black)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', boxShadow: '2px 2px 0px 0px var(--black)' }}>
                  {community.category}
                </span>
                <span style={{ backgroundColor: '#E5E7EB', border: '2px solid var(--black)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', boxShadow: '2px 2px 0px 0px var(--black)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={12} /> {community.community_type}
                </span>
                {community.is_verified && (
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', border: '2px solid #1D4ED8', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', boxShadow: '2px 2px 0px 0px #1D4ED8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} /> Official Verified
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '1rem', wordBreak: 'break-word' }}>
                {community.name}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#4B5563', fontWeight: 700, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} /> {community.target_audience}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} /> {deptName}
                </div>
                {community.membership_fee && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: community.membership_fee.toLowerCase() === 'free' ? '#16A34A' : 'inherit' }}>
                    <Star size={16} /> {community.membership_fee}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Join Actions Row (Top Prominent) */}
          {hasJoinLinks && (
            <div style={{ borderTop: '3px solid var(--black)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {join.whatsapp && (
                <a href={join.whatsapp} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton style={{ width: '100%', backgroundColor: '#25D366', color: 'var(--white)', justifyContent: 'center' }}>
                    <MessageCircle size={18} /> JOIN WHATSAPP
                  </NeoButton>
                </a>
              )}
              {join.discord && (
                <a href={join.discord} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton style={{ width: '100%', backgroundColor: '#5865F2', color: 'var(--white)', justifyContent: 'center' }}>
                    <MessageCircle size={18} /> JOIN DISCORD
                  </NeoButton>
                </a>
              )}
              {join.telegram && (
                <a href={join.telegram} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton style={{ width: '100%', backgroundColor: '#229ED9', color: 'var(--white)', justifyContent: 'center' }}>
                    <Send size={18} /> JOIN TELEGRAM
                  </NeoButton>
                </a>
              )}
              {join.google_group && (
                <a href={join.google_group} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Mail size={18} /> MAILING LIST
                  </NeoButton>
                </a>
              )}
              {join.registration_form && (
                <a href={join.registration_form} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <FileText size={18} /> FILL JOIN FORM
                  </NeoButton>
                </a>
              )}
              {join.other && (
                <a href={join.other} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 200px' }}>
                  <NeoButton variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    <LinkIcon size={18} /> JOIN COMMUNITY
                  </NeoButton>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* About */}
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={24} /> About Us
              </h3>
              <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2rem' }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', fontWeight: 600, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {community.description}
                </p>
              </div>
            </div>

            {/* Activities & Focus */}
            {(community.focus_areas || community.major_activities) && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={24} /> What We Do
                </h3>
                <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2rem' }}>
                  
                  {community.focus_areas && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.75rem' }}>Focus Areas</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {community.focus_areas.split(',').map((area, idx) => (
                          <span key={idx} style={{ backgroundColor: '#F3F4F6', border: '2px solid var(--black)', padding: '0.2rem 0.6rem', fontSize: '0.85rem', fontWeight: 700 }}>
                            {area.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {community.major_activities && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.5rem' }}>Major Activities</h4>
                      <p style={{ fontWeight: 600, lineHeight: 1.6, color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>{community.major_activities}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events & Benefits */}
            {(community.events_workshops || community.member_benefits) && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={24} /> Events & Benefits
                </h3>
                <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '2rem' }}>
                  
                  {community.events_workshops && (
                    <div style={{ marginBottom: community.member_benefits ? '1.5rem' : 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.5rem' }}>Events & Workshops</h4>
                      <p style={{ fontWeight: 600, lineHeight: 1.6, color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>{community.events_workshops}</p>
                    </div>
                  )}

                  {community.member_benefits && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.5rem' }}>Member Benefits</h4>
                      <div style={{ backgroundColor: '#FEF9C3', border: '2px dashed var(--black)', padding: '1rem', fontWeight: 600, color: '#374151', whiteSpace: 'pre-wrap' }}>
                        {community.member_benefits}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Official Links */}
            {hasOfficialLinks && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={20} /> Official Presence
                </h3>
                <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {off.website && (
                    <a href={off.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#1F2937', textDecoration: 'none' }}>
                      <Globe size={18} /> Website
                    </a>
                  )}
                  {off.linkedin && (
                    <a href={off.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#0A66C2', textDecoration: 'none' }}>
                      <Linkedin size={18} /> LinkedIn
                    </a>
                  )}
                  {off.instagram && (
                    <a href={off.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#E1306C', textDecoration: 'none' }}>
                      <Instagram size={18} /> Instagram
                    </a>
                  )}
                  {off.facebook && (
                    <a href={off.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#1877F2', textDecoration: 'none' }}>
                      <Facebook size={18} /> Facebook
                    </a>
                  )}
                  {off.github && (
                    <a href={off.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#181717', textDecoration: 'none' }}>
                      <Github size={18} /> GitHub
                    </a>
                  )}
                  {off.twitter && (
                    <a href={off.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#1DA1F2', textDecoration: 'none' }}>
                      <Twitter size={18} /> X / Twitter
                    </a>
                  )}
                  {off.other && (
                    <a href={off.other} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: '#4B5563', textDecoration: 'none' }}>
                      <LinkIcon size={18} /> Other Page
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Leadership & Contact */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} /> Leadership & Contact
              </h3>
              <div className="neo-card" style={{ backgroundColor: 'var(--white)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.2rem' }}>{community.lead_role}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{community.lead_name}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.2rem' }}>Official Email</div>
                  <a href={`mailto:${community.official_email}`} style={{ fontWeight: 700, color: '#2563EB', textDecoration: 'none', wordBreak: 'break-all' }}>{community.official_email}</a>
                </div>

                {community.contact_number && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.2rem' }}>Contact Number</div>
                    <div style={{ fontWeight: 700, color: '#374151' }}>{community.contact_number}</div>
                  </div>
                )}

                {community.faculty_coordinator && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280', marginBottom: '0.2rem' }}>Faculty Coordinator</div>
                    <div style={{ fontWeight: 700, color: '#374151' }}>{community.faculty_coordinator}</div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
