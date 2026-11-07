import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {BigStatement} from '@/components/editorial/BigStatement';
import {WorkFeatures} from '@/components/work/WorkFeatures';
import {workPage} from '@/content/work';
import {getPublishedCaseStudies, toWorkFeature} from '@/lib/caseStudies/queries';

export const metadata: Metadata = {
  title: 'Work',
  description: workPage.hero.description,
  alternates: {canonical: '/work'},
};

/**
 * Work (V2): a short introduction, the three featured projects (each in its
 * own composition) and an invitation to talk through the work. Visually
 * bold, textually restrained: the product pictures carry the page.
 */
/** Published case studies refresh within five minutes (and at once on publish). */
export const revalidate = 300;

export default async function WorkPage() {
  // Published case studies from the studio; the static projects until there are any.
  const studies = await getPublishedCaseStudies();
  const projects = studies.length ? studies.map(toWorkFeature) : undefined;
  return (
    <VStack gap={0}>
      <EditorialHero {...workPage.hero} align="center" />
      <WorkFeatures projects={projects} />
      <BigStatement {...workPage.closing} />
    </VStack>
  );
}
