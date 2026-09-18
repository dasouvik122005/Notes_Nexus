import { departments } from '@/config/departments';
import { siteConfig } from '@/config/site';
import { getPapersByDepartment } from '@/lib/data/papers';

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

  // Deep Paper Routes (The actual content pages)
  const paperRoutes = [];
  try {
    for (const dept of departments) {
      if (dept.isActive) {
        const papers = await getPapersByDepartment(dept.id);
        for (const paper of papers) {
          if (paper.isActive && paper.fileCount > 0) {
            // Add to notes
            paperRoutes.push({
              url: `${baseUrl}/notes/${dept.id}/${paper.paperCode}`,
              lastModified: currentDate,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating deep paper routes for sitemap:', error);
  }

  return [...staticRoutes, ...deptNotesRoutes, ...deptPyqRoutes, ...paperRoutes];
}
