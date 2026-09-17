import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand & Purpose */}
          <div className="footer-brand">
            <div className="footer-logo-badge">
              {siteConfig.name}
            </div>
            <p className="footer-desc">
              {siteConfig.description}
            </p>
          </div>

          {/* Links Grid: Navigation & Get Involved */}
          <div className="footer-links-wrapper">
            {/* Quick Navigation */}
            <div className="footer-col">
              <h4 className="footer-heading">
                Navigation
              </h4>
              <ul className="footer-list">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* External / Contribution */}
            <div className="footer-col">
              <h4 className="footer-heading">
                Get Involved
              </h4>
              <ul className="footer-list">
                <li>
                  <Link href="/upload" className="footer-link">
                    Upload Notes & PYQ →
                  </Link>
                </li>
                <li>
                  <a
                    href={siteConfig.links.feedback}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Feedback Form →
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    GitHub Repository →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} {siteConfig.name}. Built with care by students, for students.
          </div>
          <div className="footer-legal">
            <Link href="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <span className="footer-legal-sep">•</span>
            <Link href="/terms" className="footer-legal-link">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

