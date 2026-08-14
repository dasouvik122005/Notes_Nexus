import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: {
    template: '%s | Notes Nexus',
    default: 'Notes Nexus',
  },
  description: 'Notes Nexus - Free comprehensive study materials, notes, and previous year questions for JIS University CSE Department.',
  keywords: ['Notes Nexus', 'JIS University', 'CSE Notes', 'B.Tech Notes', 'Previous Year Questions', 'PYQ', 'Engineering Notes', 'Computer Science Notes'],
  authors: [{ name: 'Notes Nexus Team' }],
  creator: 'Notes Nexus',
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
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
