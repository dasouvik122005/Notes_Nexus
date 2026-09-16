import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'About Us',
  description: `Meet the team behind ${siteConfig.name} and learn about our mission to provide open study materials for ${siteConfig.university} students.`,
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description: `Meet the team behind ${siteConfig.name} and learn about our mission to provide open study materials for ${siteConfig.university} students.`,
    url: '/about',
  },
  twitter: {
    title: `About Us | ${siteConfig.name}`,
    description: `Meet the team behind ${siteConfig.name} and learn about our mission to provide open study materials for ${siteConfig.university} students.`,
  },
};

export default function AboutLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteConfig.name}`,
    description: `Learn about the mission and team behind ${siteConfig.name}.`,
    url: `${siteConfig.url}/about`,
    publisher: {
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
