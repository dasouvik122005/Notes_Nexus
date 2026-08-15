import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  metadataBase: new URL('https://notes-nexus-jisu.vercel.app'),
  title: {
    template: '%s | Notes Nexus',
    default: 'Notes Nexus',
  },
  description: 'Notes Nexus - Free comprehensive study materials, notes, and previous year questions for JIS University CSE Department.',
  keywords: ['Notes Nexus', 'JIS University', 'CSE Notes', 'B.Tech Notes', 'Previous Year Questions', 'PYQ', 'Engineering Notes', 'Computer Science Notes'],
  authors: [{ name: 'Notes Nexus Team' }],
  creator: 'Notes Nexus',
  publisher: 'Notes Nexus Team',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Notes Nexus',
    description: 'Free notes and study materials for JIS University CSE Department',
    url: '/',
    siteName: 'Notes Nexus',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes Nexus',
    description: 'Free notes and study materials for JIS University CSE Department',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
