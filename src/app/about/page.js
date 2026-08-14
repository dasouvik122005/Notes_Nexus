import React from 'react';

const teamMembers = [
  { name: 'Rajdip Garai', image: '/profilepic1.jpg' },
  { name: 'Souvik Das', image: '/profilepic2.jpg' },
  { name: 'Saikat Das', image: '/profilepic3.jpg' },
  { name: 'Pritam Bhattacharjee', image: '/profilepic4.jpg' }
];

export default function AboutPage() {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* About Section */}
        <div className="animate-fade-in-up" style={{
          backgroundColor: 'var(--white)',
          padding: '3rem',
          border: '4px solid var(--black)',
          boxShadow: '8px 8px 0px 0px var(--black)',
          marginBottom: '5rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-2rem',
            left: '2rem',
            backgroundColor: 'var(--primary-yellow)',
            padding: '0.5rem 1.5rem',
            border: '4px solid var(--black)',
            fontSize: '2rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            transform: 'rotate(-2deg)'
          }}>
            ABOUT US
          </div>
          
          <p style={{ fontSize: '1.25rem', lineHeight: 1.8, fontWeight: 600, marginTop: '1rem' }}>
            Welcome to <strong>Notes Nexus</strong>, your ultimate resource hub for comprehensive study materials, notes,
            and cheatsheets tailored for the Computer Science and Engineering (CSE) Department at JIS University.
            Our mission is to make learning accessible, organized, and engaging for students, empowering them to
            excel in their academic pursuits.
          </p>
          
          <p style={{ fontSize: '1.25rem', lineHeight: 1.8, fontWeight: 600, marginTop: '1rem' }}>
            We are committed to providing you the best of Education, with a focus on reliability and Engineering student's notes. 
            We strive to turn our passion for Education into a thriving website. We hope you enjoy our Education as much as we enjoy giving them to you. 
            We will keep on posting such valuable and knowledgeable information on our Website for all of you. 
            Your love and support matters a lot.
          </p>
        </div>

        {/* Team Section */}
        <div className="animate-fade-in-up delay-200">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            marginBottom: '3rem',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '-1px'
          }}>
            Meet Our <span style={{ color: 'var(--primary-pink)' }}>Team</span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '3px solid var(--black)',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--primary-yellow)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{member.name}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
