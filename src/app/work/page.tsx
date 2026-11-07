import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {BigStatement} from '@/components/editorial/BigStatement';
import {WorkFeatures} from '@/components/work/WorkFeatures';
import {workPage} from '@/content/work';

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
export default function WorkPage() {
  return (
    <VStack gap={0}>
      <EditorialHero {...workPage.hero} align="center" />
      <WorkFeatures />
      <BigStatement {...workPage.closing} />
    </VStack>
  );
}
