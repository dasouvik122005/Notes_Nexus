import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--white)',
        borderTop: '3px solid var(--black)',
        boxShadow: '0 -4px 0 0 rgba(0,0,0,1)',
        padding: '3rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2.5rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid var(--black)',
          }}
        >
          {/* Brand & Purpose */}
          <div style={{ maxWidth: '400px' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--primary-yellow)',
                border: '3px solid var(--black)',
                boxShadow: '3px 3px 0px 0px var(--black)',
                padding: '0.25rem 0.75rem',
                fontWeight: 900,
                fontSize: '1.25rem',
                marginBottom: '1rem',
                letterSpacing: '-0.5px',
              }}
            >
              {siteConfig.name}
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5, color: '#222' }}>
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '1rem',
                letterSpacing: '-0.5px',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: 'var(--black)',
                      transition: 'color 0.15s',
                    }}
                    className="nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External / Contribution */}
          <div>
            <h4
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '1rem',
                letterSpacing: '-0.5px',
              }}
            >
              Get Involved
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a
                  href={siteConfig.links.feedback}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 700,
                    color: 'var(--black)',
                  }}
                  className="nav-link"
                >
                  Submit Feedback & Notes →
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 700,
                    color: 'var(--black)',
                  }}
                  className="nav-link"
                >
                  GitHub Repository →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. Built with care by students, for students.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" className="nav-link" style={{ color: 'var(--black)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="nav-link" style={{ color: 'var(--black)', textDecoration: 'none' }}>
              Terms of Use
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
