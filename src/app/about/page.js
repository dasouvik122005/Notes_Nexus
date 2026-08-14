"use client";
import React from 'react';
import AnimateInView from '@/components/AnimateInView';
import { Target, Info, Sparkles, UserCircle2 } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const teamMembers = [
  { name: 'Rajdip Garai', linkedin: 'https://www.linkedin.com/in/rajdip-garai', github: 'https://github.com/rajdipgarai', image: '/profilepic1.jpg', color: 'var(--primary-pink)' },
  { name: 'Souvik Das', linkedin: 'https://www.linkedin.com/in/souvikdas12102005/', github: 'https://github.com/dasouvik122005', image: '/profilepic2.jpg', color: 'var(--primary-yellow)' },
  { name: 'Saikat Das', linkedin: 'https://www.linkedin.com/in/i-am-saikat-das/', github: 'https://github.com', image: '/profilepic3.jpg', color: 'var(--primary-green)' },
  { name: 'Pritam Bhattacharjee', linkedin: 'https://linkedin.com', github: 'https://github.com', image: '/profilepic4.jpg', color: 'var(--primary-blue)' }
];

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
              NOTES NEXUS
            </span>
          </h1>
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
              Welcome to <strong>Notes Nexus</strong>, your ultimate resource hub for comprehensive study materials, notes,
              and cheatsheets tailored for the Computer Science and Engineering (CSE) Department at JIS University.
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
              We are committed to providing you the best of Education. We strive to turn our passion for learning into a thriving platform. 
              Our mission is to make studying accessible, organized, and engaging for all students.
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem'
          }}>
            {teamMembers.map((member, index) => (
              <AnimateInView key={index} delay={0.1 * (index + 1)} direction="up">
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
                  <div style={{
                    height: '250px',
                    borderBottom: '4px solid var(--black)',
                    position: 'relative',
                    backgroundColor: member.color
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '6rem',
                      fontWeight: 900,
                      color: 'var(--black)',
                      letterSpacing: '-2px'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'var(--white)',
                      border: '2px solid var(--black)',
                      padding: '0.25rem',
                      borderRadius: '50%'
                    }}>
                      <UserCircle2 size={24} />
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--white)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {member.name}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: 'auto' 
                    }}>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--black)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaLinkedin size={24} />
                      </a>
                      <a href={member.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--black)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaGithub size={24} />
                      </a>
                    </div>
                    {/* Fake barcode for the ID badge look */}
                    <div style={{ 
                      height: '20px', 
                      marginTop: '1rem',
                      backgroundImage: 'repeating-linear-gradient(90deg, var(--black), var(--black) 2px, transparent 2px, transparent 4px, var(--black) 4px, var(--black) 5px, transparent 5px, transparent 8px)',
                      opacity: 0.5
                    }}></div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </AnimateInView>

      </div>
    </div>
  );
}
