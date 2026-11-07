import type {MetadataRoute} from 'next';
import {site} from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // The writing studio and its sign-in stay out of search (they're noindex too).
    rules: {userAgent: '*', allow: '/', disallow: ['/write', '/auth']},
    sitemap: `${site.url}/sitemap.xml`,
  };
}
