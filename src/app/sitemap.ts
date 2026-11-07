import type {MetadataRoute} from 'next';
import {site} from '@/content/site';
import {getPublishedCaseStudies} from '@/lib/caseStudies/queries';

/** Refreshes within five minutes (and at once when a case study is published). */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/work', '/about', '/contact'].map(path => ({url: `${site.url}${path}`}));
  const studies = (await getPublishedCaseStudies()).map(study => ({
    url: `${site.url}/work/${study.slug}`,
    lastModified: study.updated_at,
  }));
  return [...pages, ...studies];
}
