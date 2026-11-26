import { siteConfig } from '@/config/site';

export default function robots() {
  const baseUrl = siteConfig.url || 'https://notes-nexus-jisu.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/me', '/auth/', '/community/register', '/community/*/edit', '/instruments/new'],
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'Anthropic-ai', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/admin', '/api/admin', '/me', '/auth/', '/community/register', '/community/*/edit', '/instruments/new'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
