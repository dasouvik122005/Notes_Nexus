"use client";
import React from 'react';
import AnimateInView from '@/components/AnimateInView';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';

const semesters = [
  { id: 1, name: 'Semester 1', color: 'var(--primary-yellow)' },
  { id: 2, name: 'Semester 2', color: 'var(--primary-pink)' },
  { id: 3, name: 'Semester 3', color: 'var(--primary-green)' },
  { id: 4, name: 'Semester 4', color: 'var(--primary-blue)' },
  { id: 5, name: 'Semester 5', color: 'var(--primary-yellow)' },
  { id: 6, name: 'Semester 6', color: 'var(--primary-pink)' },
  { id: 7, name: 'Semester 7', color: 'var(--primary-green)' },
  { id: 8, name: 'Semester 8', color: 'var(--primary-blue)' }
];

export default function PYQPage() {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Header Section */}
        <AnimateInView delay={0.1} direction="down" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-pink)', padding: '1rem', border: '3px solid var(--black)', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '4px 4px 0px 0px var(--black)' }}>
            <GraduationCap size={48} />
          </div>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '1rem'
          }}>
            PREVIOUS YEAR <br/>
            <span style={{ 
              backgroundColor: 'var(--primary-yellow)',
              padding: '0 0.5rem',
              display: 'inline-block',
              border: '4px solid var(--black)',
              transform: 'rotate(2deg)'
            }}>
              QUESTIONS
            </span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            maxWidth: '600px',
            margin: '0 auto',
            color: 'var(--black)'
          }}>
            Ace your exams with our comprehensive collection of past papers. Select your semester below to find Mid Sem and End Sem questions.
          </p>
        </AnimateInView>

        {/* Semesters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {semesters.map((sem, index) => (
            <AnimateInView key={sem.id} delay={0.1 * (index % 4)} direction="up">
              <div 
                className="neo-card"
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  backgroundColor: 'var(--white)',
                  position: 'relative'
                }}
              >
                {/* Card Header (Semester Title) */}
                <div style={{ 
                  backgroundColor: sem.color, 
                  padding: '1.5rem',
                  borderBottom: '4px solid var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: 'var(--white)',
                    border: '2px solid var(--black)',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>
                    {sem.name}
                  </h2>
                </div>

                {/* Card Body (Buttons) */}
                <div style={{ 
                  padding: '2rem 1.5rem', 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  justifyContent: 'center' 
                }}>
                  
                  {/* Mid Sem Button */}
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neo-button"
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--white)',
                      fontSize: '1.1rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={20} />
                      Mid Sem
                    </span>
                    <span>→</span>
                  </a>

                  {/* End Sem Button */}
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neo-button"
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--white)',
                      fontSize: '1.1rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={20} />
                      End Sem
                    </span>
                    <span>→</span>
                  </a>

                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
        
      </div>
    </div>
  );
}
