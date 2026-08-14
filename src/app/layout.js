import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Notes Nexus',
  description: 'Notes Nexus - Free notes for JIS University CSE Department',
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
