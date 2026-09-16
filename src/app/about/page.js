"use client";

import React from 'react';
import Image from 'next/image';
import AnimateInView from '@/components/AnimateInView';
import { Target, Info, Sparkles, UserCircle2 } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { teamMembers } from '@/config/team';
import { siteConfig } from '@/config/site';

export default function AboutPage() {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Massive Header */}
        <AnimateInView delay={0.1} direction="up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="hero-title" style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '1rem'
          }}>
            THE STORY BEHIND <br/>
            <span style={{ 
              backgroundColor: 'var(--primary-yellow)',
              padding: '0 0.5rem',
              display: 'inline-block',
              border: '4px solid var(--black)',
              transform: 'rotate(-2deg)'
            }}>
              {siteConfig.name.toUpperCase()}
            </span>
          </h1>

          {/* Unofficial Disclaimer Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FEE2E2',
            border: '2px solid var(--black)',
            boxShadow: '3px 3px 0px 0px var(--black)',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#991B1B',
            marginTop: '1.5rem',
          }}>
            <span>⚠️</span>
            <span>{siteConfig.disclaimer}</span>
          </div>
        </AnimateInView>

        {/* Split Layout About Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          marginBottom: '6rem'
        }}>
          
          <AnimateInView delay={0.2} direction="left" style={{
            backgroundColor: 'var(--white)',
            padding: '2.5rem',
            border: '4px solid var(--black)',
            boxShadow: '6px 6px 0px 0px var(--black)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              backgroundColor: 'var(--primary-pink)',
              border: '3px solid var(--black)',
              padding: '0.5rem',
              borderRadius: '50%'
            }}>
              <Info size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Who We Are
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 600 }}>
              Welcome to <strong>{siteConfig.name}</strong>, a student-run academic hub designed to bring organized notes,
              previous year questions (PYQs), and study resources to university students across all departments — from Engineering and Computer Applications to Pharmacy, Law, and Sciences.
            </p>
          </AnimateInView>

          <AnimateInView delay={0.3} direction="right" style={{
            backgroundColor: 'var(--primary-yellow)',
            padding: '2.5rem',
            border: '4px solid var(--black)',
            boxShadow: '6px 6px 0px 0px var(--black)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              backgroundColor: 'var(--white)',
              border: '3px solid var(--black)',
              padding: '0.5rem',
              borderRadius: '50%'
            }}>
              <Target size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Our Mission
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 600 }}>
              We are passionate about removing friction from student life. By providing a curated, peer-moderated repository of lecture notes and past exams, our goal is to ensure no student is left stranded before an exam.
            </p>
          </AnimateInView>
        </div>

        {/* Team Section (ID Badge Style) */}
        <AnimateInView delay={0.2} direction="up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
            <Sparkles size={40} color="var(--primary-pink)" />
            <h2 className="hero-title" style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              margin: 0
            }}>
              Meet The Team
            </h2>
            <Sparkles size={40} color="var(--primary-pink)" />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {teamMembers.map((member, index) => {
              const panelBg = index % 2 === 0 ? 'var(--white)' : 'var(--accent-blue)';
              
              return (
                <AnimateInView key={member.name} delay={0.1 * (index + 1)} direction="up">
                  <div 
                    className="neo-card" 
                    style={{ 
                      height: '100%', 
                      padding: '0', 
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'var(--white)'
                    }}
                  >
                    {/* Header Panel (Square / Aspect-Ratio Container with Alternating White / Blue) */}
                    <div style={{
                      aspectRatio: '1 / 1',
                      width: '100%',
                      borderBottom: '4px solid var(--black)',
                      position: 'relative',
                      backgroundColor: panelBg,
                      overflow: 'hidden',
                    }}>
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '5.5rem',
                          fontWeight: 900,
                          color: 'var(--black)',
                          letterSpacing: '-2px'
                        }}>
                          {member.initials}
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'var(--white)',
                        border: '2px solid var(--black)',
                        padding: '0.25rem',
                        borderRadius: '50%',
                        zIndex: 2,
                      }}>
                        <UserCircle2 size={24} />
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--white)' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {member.name}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        marginTop: 'auto',
                        paddingTop: '0.5rem',
                      }}>
                        {member.socials.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            style={{ color: 'var(--black)', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <FaLinkedin size={24} />
                          </a>
                        )}
                        {member.socials.github && (
                          <a
                            href={member.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on GitHub`}
                            style={{ color: 'var(--black)', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <FaGithub size={24} />
                          </a>
                        )}
                        {member.socials.instagram && member.socials.instagram[0] && (
                          <a
                            href={member.socials.instagram[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on Instagram`}
                            style={{ color: 'var(--black)', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <FaInstagram size={24} />
                          </a>
                        )}
                      </div>
                      
                      {/* Fake barcode for the ID badge look */}
                      <div style={{ 
                        height: '20px', 
                        marginTop: '1.25rem',
                        backgroundImage: 'repeating-linear-gradient(90deg, var(--black), var(--black) 2px, transparent 2px, transparent 4px, var(--black) 4px, var(--black) 5px, transparent 5px, transparent 8px)',
                        opacity: 0.5
                      }}></div>
                    </div>
                  </div>
                </AnimateInView>
              );
            })}
          </div>
        </AnimateInView>

      </div>
    </div>
  );
}
