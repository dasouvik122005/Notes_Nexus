import React from 'react';
import NeoButton from '@/components/NeoButton';

export default function Home() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)', // subtracting approx navbar height
      display: 'flex',
      alignItems: 'center',
      padding: '4rem 0'
    }}>
      <div className="container hero-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '4rem'
      }}>
        {/* Left Content */}
        <div className="animate-fade-in-up" style={{ flex: '1 1 100%', maxWidth: '600px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--primary-pink)',
            padding: '0.5rem 1rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            border: '3px solid var(--black)',
            boxShadow: '4px 4px 0px 0px var(--black)',
            marginBottom: '2rem',
            transform: 'rotate(-2deg)'
          }}>
            JIS University CSE Dept.
          </div>
          
          <h1 className="hero-title" style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-2px'
          }}>
            WELCOME TO <br/>
            <span style={{ 
              backgroundColor: 'var(--primary-yellow)',
              padding: '0 0.5rem',
              display: 'inline-block',
              border: '4px solid var(--black)',
              boxShadow: '6px 6px 0px 0px var(--black)',
              marginTop: '0.5rem',
              transform: 'rotate(1deg)'
            }}>
              NOTES NEXUS
            </span>
          </h1>
          
          <p className="animate-fade-in-up delay-100" style={{
            fontSize: '1.25rem',
            lineHeight: 1.6,
            fontWeight: 600,
            marginBottom: '2.5rem',
            maxWidth: '500px'
          }}>
            Confused on where you can get your department notes? We have got you covered. 
            Browse here and find out the notes for you. It's free! Notes Nexus is here to help you.
          </p>
          
          <div className="hero-buttons animate-fade-in-up delay-200" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <NeoButton href="/notes" variant="primary" style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
              GET NOTES
            </NeoButton>
            <NeoButton href="/about" style={{ fontSize: '1.25rem', padding: '1rem 2rem', backgroundColor: 'var(--white)' }}>
              LEARN MORE
            </NeoButton>
          </div>
        </div>
        
        {/* Right Content / Illustration */}
        <div className="animate-fade-in-up delay-300" style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div className="neo-card" style={{
            padding: '2rem',
            backgroundColor: 'var(--white)',
            transform: 'rotate(3deg)',
            maxWidth: '450px',
            width: '100%'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/jis.png" 
              alt="JIS University" 
              style={{ width: '100%', height: 'auto', border: '3px solid var(--black)' }} 
            />
            <div style={{ marginTop: '1.5rem', borderTop: '3px solid var(--black)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--primary-pink)', borderRadius: '50%', border: '2px solid var(--black)' }}></div>
                <span style={{ fontWeight: 800 }}>LATEST UPLOADS</span>
              </div>
              <ul style={{ listStyleType: 'none', paddingLeft: '2rem', fontWeight: 600 }}>
                <li style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <span style={{ position: 'absolute', left: '-1.5rem', top: '2px' }}>✓</span> Engineering Mathematics-1
                </li>
                <li style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '-1.5rem', top: '2px' }}>✓</span> Machine Learning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
