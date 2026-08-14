import React from 'react';

export default function NeoCard({ title, imageSrc, actionLink, actionText = 'View Notes', children }) {
  return (
    <div className="neo-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {imageSrc && (
        <div style={{ borderBottom: '3px solid var(--black)', overflow: 'hidden', height: '200px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageSrc} 
            alt={title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      )}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
        {children && <div style={{ marginBottom: '1rem', color: '#444' }}>{children}</div>}
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <a 
            href={actionLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="neo-button primary"
            style={{ width: '100%' }}
          >
            {actionText}
          </a>
        </div>
      </div>
    </div>
  );
}
