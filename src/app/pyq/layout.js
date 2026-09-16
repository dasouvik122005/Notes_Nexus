export const metadata = {
  title: 'Previous Year Questions (PYQ)',
  description: 'Prepare for exams with our extensive archive of Mid Semester and End Semester Previous Year Questions (PYQs) for JIS University CSE.',
  openGraph: {
    title: 'Previous Year Questions | Notes Nexus',
    description: 'Prepare for exams with our extensive archive of Mid Semester and End Semester Previous Year Questions (PYQs) for JIS University CSE.',
    url: '/pyq',
  },
  twitter: {
    title: 'Previous Year Questions | Notes Nexus',
    description: 'Prepare for exams with our extensive archive of Mid Semester and End Semester Previous Year Questions (PYQs) for JIS University CSE.',
  },
};

export default function PYQLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Previous Year Questions (PYQ) - Notes Nexus',
    'description': 'Archive of Mid Sem and End Sem previous year questions for exam preparation.',
    'url': 'https://notes-nexus-jisu.vercel.app/pyq',
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'Notes Nexus'
    },
    'about': {
      '@type': 'LearningResource',
      'learningResourceType': 'Past Exam Paper',
      'educationalAlignment': {
        '@type': 'AlignmentObject',
        'alignmentType': 'educationalLevel',
        'educationalFramework': 'B.Tech Computer Science'
      }
    }
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
