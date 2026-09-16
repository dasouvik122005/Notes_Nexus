export const metadata = {
  title: 'About Us',
  description: 'Meet the team behind Notes Nexus and learn about our mission to provide the best free study materials for JIS University CSE students.',
  openGraph: {
    title: 'About Us | Notes Nexus',
    description: 'Meet the team behind Notes Nexus and learn about our mission to provide the best free study materials for JIS University CSE students.',
    url: '/about',
  },
  twitter: {
    title: 'About Us | Notes Nexus',
    description: 'Meet the team behind Notes Nexus and learn about our mission to provide the best free study materials for JIS University CSE students.',
  },
};

export default function AboutLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Notes Nexus',
    'description': 'Learn about the mission and team behind Notes Nexus.',
    'url': 'https://notes-nexus-jisu.vercel.app/about',
    'publisher': {
      '@type': 'EducationalOrganization',
      'name': 'Notes Nexus'
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
