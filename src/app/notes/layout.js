import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Notes & Study Materials',
  description: `Browse comprehensive study materials and lecture notes across all departments at ${siteConfig.university}.`,
  openGraph: {
    title: `Notes & Study Materials | ${siteConfig.name}`,
    description: `Browse comprehensive study materials and lecture notes across all departments at ${siteConfig.university}.`,
    url: '/notes',
  },
  twitter: {
    title: `Notes & Study Materials | ${siteConfig.name}`,
    description: `Browse comprehensive study materials and lecture notes across all departments at ${siteConfig.university}.`,
  },
};

export default function NotesLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Notes & Study Materials - ${siteConfig.name}`,
    description: `Comprehensive repository of university study materials and lecture notes at ${siteConfig.university}.`,
    url: `${siteConfig.url}/notes`,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.name,
    },
    about: {
      '@type': 'LearningResource',
      learningResourceType: 'Study material',
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
