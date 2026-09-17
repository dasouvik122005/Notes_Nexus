import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import jisImg from '../../public/jis.png';
import dynamic from 'next/dynamic';
const AnimateInView = dynamic(() => import('@/components/AnimateInView'));
const AnimateFloat = dynamic(() => import('@/components/AnimateFloat'));
import NeoButton from '@/components/NeoButton';
import { siteConfig } from '@/config/site';
import { getLatestMaterials } from '@/lib/data/materials';
import { BookOpen, GraduationCap, Store, Star, ArrowRight } from 'lucide-react';

export const metadata = {
  title: `Home | ${siteConfig.name}`,
  description: `${siteConfig.name} - Free comprehensive study materials, notes, and previous year questions across all departments at ${siteConfig.university}.`,
};

export default async function Home() {
  const latestUploads = await getLatestMaterials(4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.png`,
        description: `Providing free comprehensive study materials, notes, and previous year questions across all departments at ${siteConfig.university}.`,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: {
          '@id': `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ padding: '3rem 0 5rem 0' }}>
        <div className="container">
        
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <div
          className="hero-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '3.5rem',
            marginBottom: '5rem',
          }}
        >
          {/* Left Hero Content */}
          <AnimateInView delay={0.1} direction="up" style={{ flex: '1 1 100%', maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--primary-pink)',
                padding: '0.4rem 0.9rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                border: '3px solid var(--black)',
                boxShadow: '4px 4px 0px 0px var(--black)',
                marginBottom: '1.25rem',
                transform: 'rotate(-2deg)',
              }}
            >
              {siteConfig.university} • All Departments
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: '4.5rem',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1.25rem',
                letterSpacing: '-2px',
              }}
            >
              WELCOME TO <br />
              <span
                style={{
                  backgroundColor: 'var(--primary-yellow)',
                  padding: '0 0.5rem',
                  display: 'inline-block',
                  border: '4px solid var(--black)',
                  boxShadow: '6px 6px 0px 0px var(--black)',
                  marginTop: '0.5rem',
                  transform: 'rotate(1deg)',
                }}
              >
                {siteConfig.name.toUpperCase()}
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                lineHeight: 1.6,
                fontWeight: 600,
                marginBottom: '1.75rem',
                maxWidth: '520px',
                color: '#222',
              }}
            >
              {siteConfig.description} Everything you need to prepare for semester exams, peer-shared and open.
            </p>


            {/* Action CTA Buttons */}
            <div
              className="hero-buttons"
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <NeoButton
                href="/notes"
                variant="primary"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  padding: '0.85rem 1.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                GET NOTES
              </NeoButton>

              <NeoButton
                href="/pyq"
                variant="blue"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  padding: '0.85rem 1.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                PYQ PAPERS
              </NeoButton>

              <NeoButton
                href="/instruments"
                variant="secondary"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  padding: '0.85rem 1.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                MARKETPLACE
              </NeoButton>
            </div>
          </AnimateInView>

          {/* Right Hero Illustration with Campus Image */}
          <div style={{ flex: '1 1 380px', display: 'flex', justifyContent: 'center' }}>
            <AnimateInView delay={0.2} direction="left">
              <AnimateFloat>
                <div
                  className="neo-card"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--white)',
                    transform: 'rotate(2.5deg)',
                    maxWidth: '440px',
                    width: '100%',
                  }}
                >
                  <Image
                    src={jisImg}
                    alt={siteConfig.university}
                    width={450}
                    height={300}
                    priority
                    placeholder="blur"
                    style={{ width: '100%', height: 'auto', border: '3px solid var(--black)' }}
                  />
                  <div
                    style={{
                      marginTop: '1.25rem',
                      borderTop: '3px solid var(--black)',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>CAMPUS RESOURCE NETWORK</span>
                    <span
                      style={{
                        backgroundColor: 'var(--primary-green)',
                        border: '2px solid var(--black)',
                        padding: '0.15rem 0.5rem',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      LIVE V2
                    </span>
                  </div>
                </div>
              </AnimateFloat>
            </AnimateInView>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THREE PRIMARY ENTRY CARDS                                                 */}
        {/* ========================================================================= */}
        <div style={{ marginBottom: '5rem' }}>
          <AnimateInView delay={0.1} direction="up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-1px',
              }}
            >
              Where would you like to go?
            </h2>
          </AnimateInView>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Card 1: Study Notes */}
            <AnimateInView delay={0.15} direction="up">
              <div
                className="neo-card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--white)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--primary-yellow)',
                    padding: '2rem 1.5rem',
                    borderBottom: '3px solid var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '3px solid var(--black)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookOpen size={36} color="var(--black)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Module Notes</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>GET NOTES</h3>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#333', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Browse organized lecture notes, module summaries, and faculty cheat sheets across all departments and semesters.
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href="/notes"
                      className="neo-button primary"
                      style={{ width: '100%', textDecoration: 'none' }}
                    >
                      Browse All Notes →
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateInView>

            {/* Card 2: PYQ */}
            <AnimateInView delay={0.2} direction="up">
              <div
                className="neo-card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--white)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--primary-pink)',
                    padding: '2rem 1.5rem',
                    borderBottom: '3px solid var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '3px solid var(--black)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GraduationCap size={36} color="var(--black)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Exam Archive</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>PYQ PAPERS</h3>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#333', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Ace your examinations with official previous year question papers. Filter easily by Mid Sem and Final Sem papers.
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href="/pyq"
                      className="neo-button"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--primary-yellow)',
                        textDecoration: 'none',
                      }}
                    >
                      Explore PYQs →
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateInView>

            {/* Card 3: Instruments / Marketplace */}
            <AnimateInView delay={0.25} direction="up">
              <div
                className="neo-card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--white)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    padding: '2rem 1.5rem',
                    borderBottom: '3px solid var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '3px solid var(--black)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      boxShadow: '3px 3px 0px 0px var(--black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Store size={36} color="var(--black)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Marketplace</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>INSTRUMENTS</h3>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#333', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Student second-hand board: buy and sell engineering drafters, lab aprons, medical kits, and semester textbooks.
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href="/instruments"
                      className="neo-button"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--white)',
                        textDecoration: 'none',
                      }}
                    >
                      Visit Marketplace →
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateInView>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE LATEST UPLOADS FEED                                                  */}
        {/* ========================================================================= */}
        <div className="latest-uploads-section hidden md:block" style={{ marginBottom: '4rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--primary-yellow)',
                  border: '2px solid var(--black)',
                  padding: '0.2rem 0.6rem',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span>COMMUNITY REPOSITORY</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
                LATEST UPLOADS
              </h2>
            </div>

            <Link
              href="/notes"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                fontSize: '1.1rem',
                textDecoration: 'underline',
              }}
            >
              <span>View full catalog</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          {latestUploads && latestUploads.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {latestUploads.map((item) => (
                <div
                  key={item.id}
                  className="neo-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--white)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: item.type === 'notes' ? 'var(--primary-yellow)' : 'var(--primary-pink)',
                        border: '2px solid var(--black)',
                        padding: '0.15rem 0.5rem',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.type}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 800 }}>
                      <Star size={14} fill={item.ratingCount > 0 ? "#F59E0B" : "none"} color={item.ratingCount > 0 ? "#B45309" : "#888"} />
                      <span>{item.ratingCount > 0 ? item.ratingAvg.toFixed(1) : 'Unrated'}</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                    {item.title}
                  </h4>

                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', marginBottom: '1rem' }}>
                    {item.paperName} ({item.paperCode}) • Sem {item.semester}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '2px dashed #eee' }}>
                    <Link
                      href={`/notes/${item.departmentId}/${item.paperCode}`}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>Read file</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="neo-card"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: 'var(--white)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                No Uploads in Community Repository Yet
              </h3>
              <p style={{ color: '#555', fontWeight: 600, marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                Be the first contributor to share lecture notes or previous year question papers for your department.
              </p>
              <NeoButton href="/upload" variant="primary">
                Upload First Material →
              </NeoButton>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}
