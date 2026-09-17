import { siteConfig } from '@/config/site';

export default function robots() {
  const baseUrl = siteConfig.url || 'https://notes-nexus-jisu.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/me'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
