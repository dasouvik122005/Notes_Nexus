import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Previous Year Questions (PYQ)',
  description: `Access Mid Sem and End Sem previous year questions for all departments and semesters at ${siteConfig.university}.`,
  openGraph: {
    title: `Previous Year Questions | ${siteConfig.name}`,
    description: `Access Mid Sem and End Sem previous year questions for all departments and semesters at ${siteConfig.university}.`,
    url: '/pyq',
  },
  twitter: {
    title: `Previous Year Questions | ${siteConfig.name}`,
    description: `Access Mid Sem and End Sem previous year questions for all departments and semesters at ${siteConfig.university}.`,
  },
};

export default function PYQLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Previous Year Questions (PYQ) - ${siteConfig.name}`,
    description: `Archive of Mid Sem and End Sem previous year questions across all departments at ${siteConfig.university}.`,
    url: `${siteConfig.url}/pyq`,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.name,
    },
    about: {
      '@type': 'LearningResource',
      learningResourceType: 'Past Exam Paper',
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
