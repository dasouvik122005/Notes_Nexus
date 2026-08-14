import React from 'react';

export default function NeoCard({ title, icon: Icon, actionLink, actionText = 'View Notes', children }) {
  return (
    <div className="neo-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {Icon && (
        <div style={{ 
          borderBottom: '3px solid var(--black)', 
          height: '160px', 
          backgroundColor: 'var(--primary-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={64} strokeWidth={2.5} color="var(--black)" />
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
