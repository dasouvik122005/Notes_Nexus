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
  applicationName: 'Notes Nexus',
  generator: 'Next.js',
  keywords: ['Notes Nexus', 'JIS University', 'CSE Notes', 'B.Tech Notes', 'Previous Year Questions', 'PYQ', 'Engineering Notes', 'Computer Science Notes'],
  authors: [{ name: 'Notes Nexus Team', url: 'https://notes-nexus-jisu.vercel.app/about' }],
  creator: 'Notes Nexus Team',
  publisher: 'Notes Nexus Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    title: 'Notes Nexus',
    statusBarStyle: 'default',
    capable: true,
  },
  openGraph: {
    title: 'Notes Nexus',
    description: 'Free notes and study materials for JIS University CSE Department',
    url: '/',
    siteName: 'Notes Nexus',
    images: [
      {
        url: '/opengraph-image', 
        width: 1200,
        height: 630,
        alt: 'Notes Nexus - JIS University CSE Notes',
      }
    ],
    locale: 'en_US',
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
