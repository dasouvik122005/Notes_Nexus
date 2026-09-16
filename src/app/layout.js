import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Outfit } from 'next/font/google';
import { siteConfig } from '@/config/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: 'Next.js',
  keywords: [
    siteConfig.name,
    siteConfig.university,
    'CSE Notes',
    'B.Tech Notes',
    'BCA Notes',
    'Pharmacy Notes',
    'Previous Year Questions',
    'PYQ',
    'Engineering Notes',
    'Study Materials',
  ],
  authors: [{ name: `${siteConfig.name} Team`, url: `${siteConfig.url}/about` }],
  creator: `${siteConfig.name} Team`,
  publisher: `${siteConfig.name} Team`,
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
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
    siteName: siteConfig.name,
    images: [
      {
        url: '/opengraph-image', 
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.university} Notes & PYQ`,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
