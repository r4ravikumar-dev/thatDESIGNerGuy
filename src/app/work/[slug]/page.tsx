import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {CaseStudyPage} from '@/components/caseStudy/CaseStudyPage';
import {getPublishedCaseStudies, getPublishedCaseStudy} from '@/lib/caseStudies/queries';
import {mediaUrl} from '@/lib/caseStudies/media';

/** Pages refresh within five minutes of an edit (and at once on publish). */
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublishedCaseStudies()).map(study => ({slug: study.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const study = await getPublishedCaseStudy(slug);
  if (!study) return {};
  const title = study.title.replace(/\*/g, '');
  const description = study.seo_description || study.summary;
  const image = mediaUrl(study.cover_url ?? study.thumbnail_url) || undefined;
  return {
    title,
    description,
    alternates: {canonical: `/work/${study.slug}`},
    openGraph: {title, description, type: 'article', images: image ? [{url: image}] : undefined},
  };
}

/** A published case study, written in the studio (/write). */
export default async function CaseStudyRoute({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const [study, all] = await Promise.all([getPublishedCaseStudy(slug), getPublishedCaseStudies()]);
  if (!study) notFound();
  const index = all.findIndex(item => item.slug === study.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;
  return <CaseStudyPage study={study} next={next} />;
}
