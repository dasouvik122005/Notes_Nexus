import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function CommunityPreviewModal({ community, onClose }) {
  if (!community) return null;

  const off = community.official_links || {};
  const join = community.join_links || {};

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="neo-card"
        style={{
          backgroundColor: 'var(--white)',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          cursor: 'default',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={24} color="#1F2937" />
        </button>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              border: '3px solid var(--black)',
              boxShadow: '3px 3px 0px 0px var(--black)',
              position: 'relative',
              backgroundColor: '#F3F4F6',
              flexShrink: 0,
            }}
          >
            {community.logo_url && (
              <Image src={community.logo_url} alt="Logo" fill style={{ objectFit: 'cover' }} unoptimized />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', lineHeight: 1.1 }}>
              {community.name}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--primary-yellow)', border: '2px solid var(--black)', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                {community.category}
              </span>
              <span style={{ backgroundColor: '#E5E7EB', border: '2px solid var(--black)', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                {community.community_type}
              </span>
              <span style={{ backgroundColor: '#F3F4F6', border: '2px solid var(--black)', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 800 }}>
                {community.department_id || 'Open to All'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* About */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid var(--black)', paddingBottom: '0.25rem' }}>
              About
            </h3>
            <p style={{ fontWeight: 600, color: '#374151', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
              {community.description}
            </p>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#F9FAFB', border: '2px solid var(--black)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Target Audience</div>
              <div style={{ fontWeight: 700 }}>{community.target_audience}</div>
            </div>
            {community.membership_fee && (
              <div style={{ backgroundColor: '#F9FAFB', border: '2px solid var(--black)', padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Membership Fee</div>
                <div style={{ fontWeight: 700 }}>{community.membership_fee}</div>
              </div>
            )}
          </div>

          {/* Focus & Activities */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid var(--black)', paddingBottom: '0.25rem' }}>
              Focus & Activities
            </h3>
            {community.focus_areas && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Focus Areas:</strong>
                {community.focus_areas}
              </div>
            )}
            {community.major_activities && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Major Activities:</strong>
                {community.major_activities}
              </div>
            )}
            {community.events_workshops && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Events/Workshops:</strong>
                {community.events_workshops}
              </div>
            )}
            {community.member_benefits && (
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Member Benefits:</strong>
                {community.member_benefits}
              </div>
            )}
          </div>

          {/* Links & Contacts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid var(--black)', paddingBottom: '0.25rem' }}>
                Official Links
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                {off.website && <li><a href={off.website} target="_blank" rel="noreferrer">Website</a></li>}
                {off.linkedin && <li><a href={off.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
                {off.instagram && <li><a href={off.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
                {off.facebook && <li><a href={off.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
                {off.github && <li><a href={off.github} target="_blank" rel="noreferrer">GitHub</a></li>}
                {off.twitter && <li><a href={off.twitter} target="_blank" rel="noreferrer">Twitter</a></li>}
                {off.other && <li><a href={off.other} target="_blank" rel="noreferrer">Other</a></li>}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid var(--black)', paddingBottom: '0.25rem' }}>
                Join Links
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                {join.whatsapp && <li><a href={join.whatsapp} target="_blank" rel="noreferrer">WhatsApp Group</a></li>}
                {join.discord && <li><a href={join.discord} target="_blank" rel="noreferrer">Discord Server</a></li>}
                {join.telegram && <li><a href={join.telegram} target="_blank" rel="noreferrer">Telegram Group</a></li>}
                {join.google_group && <li><a href={join.google_group} target="_blank" rel="noreferrer">Google Group / Mailing List</a></li>}
                {join.registration_form && <li><a href={join.registration_form} target="_blank" rel="noreferrer">Registration Form</a></li>}
                {join.other && <li><a href={join.other} target="_blank" rel="noreferrer">Other Join Link</a></li>}
              </ul>
            </div>

          </div>

          {/* Verification & Leads */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid var(--black)', paddingBottom: '0.25rem' }}>
              Verification Proof
            </h3>
            <a href={community.verification_proof} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#2563EB' }}>
              View Provided Proof Document / Link
            </a>
            {community.representative_linkedin && (
              <div style={{ marginTop: '0.5rem' }}>
                <a href={community.representative_linkedin} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#0A66C2' }}>
                  Representative's LinkedIn
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
