export const metadata = {
  title: 'Notes & Study Materials',
  description: 'Download comprehensive Computer Science (CSE) study materials, B.Tech lecture notes, and cheat sheets for JIS University students.',
  openGraph: {
    title: 'Notes & Study Materials | Notes Nexus',
    description: 'Download comprehensive Computer Science (CSE) study materials, B.Tech lecture notes, and cheat sheets for JIS University students.',
    url: '/notes',
  },
  twitter: {
    title: 'Notes & Study Materials | Notes Nexus',
    description: 'Download comprehensive Computer Science (CSE) study materials, B.Tech lecture notes, and cheat sheets for JIS University students.',
  },
};

export default function NotesLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Notes & Study Materials - Notes Nexus',
    'description': 'Comprehensive repository of Computer Science study materials and lecture notes.',
    'url': 'https://notes-nexus-jisu.vercel.app/notes',
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'Notes Nexus'
    },
    'about': {
      '@type': 'LearningResource',
      'learningResourceType': 'Study material',
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
