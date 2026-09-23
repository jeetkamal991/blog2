import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://blog3-mauve.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
