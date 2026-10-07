import type {MetadataRoute} from 'next';
import {site} from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/work', '/about'].map(path => ({url: `${site.url}${path}`}));
}
