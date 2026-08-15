export default function robots() {
  const baseUrl = 'https://notes-nexus-jisu.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
