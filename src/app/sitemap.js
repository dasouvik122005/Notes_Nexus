import { departments } from '@/config/departments';
import { siteConfig } from '@/config/site';

export default async function sitemap() {
  const baseUrl = siteConfig.url || 'https://notes-nexus-jisu.vercel.app';
  const currentDate = new Date().toISOString();

  // Core static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pyq`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instruments`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Department notes routes (10 departments)
  const deptNotesRoutes = departments.map((dept) => ({
    url: `${baseUrl}/notes/${dept.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Department PYQ routes (10 departments)
  const deptPyqRoutes = departments.map((dept) => ({
    url: `${baseUrl}/pyq/${dept.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // High-traffic sample subject detail routes
  const paperDetailRoutes = [
    {
      url: `${baseUrl}/notes/btech-cse/CS301`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/notes/btech-cse/M101`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pyq/btech-cse/CS301`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...deptNotesRoutes, ...deptPyqRoutes, ...paperDetailRoutes];
}
