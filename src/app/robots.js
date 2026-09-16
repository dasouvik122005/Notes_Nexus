export default function robots() {
  const baseUrl = 'https://notes-nexus-jisu.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
