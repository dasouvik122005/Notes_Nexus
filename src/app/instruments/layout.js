import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Student Marketplace & Instruments',
  description: `Buy and sell second-hand drafting tools, calculators, lab aprons, textbooks, and engineering instruments at ${siteConfig.university}.`,
  keywords: [
    'Student Marketplace',
    'Buy drafter JIS University',
    'Sell engineering instruments',
    'Lab coat second hand',
    'Scientific calculator buy',
    'Used textbooks JISU',
  ],
  openGraph: {
    title: `Student Marketplace & Instruments | ${siteConfig.name}`,
    description: `Student-to-student noticeboard to buy and sell second-hand academic tools, textbooks, and instruments at ${siteConfig.university}.`,
    url: '/instruments',
  },
  twitter: {
    title: `Student Marketplace & Instruments | ${siteConfig.name}`,
    description: `Student-to-student noticeboard to buy and sell second-hand academic tools, textbooks, and instruments at ${siteConfig.university}.`,
  },
  alternates: {
    canonical: '/instruments',
  },
};

export default function InstrumentsLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Student Instruments & Marketplace - ${siteConfig.name}`,
    description: `Peer-to-peer student marketplace to exchange textbooks, drafters, calculators, and lab supplies at ${siteConfig.university}.`,
    url: `${siteConfig.url}/instruments`,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
