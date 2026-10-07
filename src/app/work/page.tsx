import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {BigStatement} from '@/components/editorial/BigStatement';
import {WorkList} from '@/components/editorial/WorkList';
import {JourneyScreens} from '@/components/illustrations/scenes';
import {workPage} from '@/content/work';

export const metadata: Metadata = {
  title: 'Work',
  description: workPage.hero.description,
  alternates: {canonical: '/work'},
};

export default function WorkPage() {
  return (
    <VStack gap={0}>
      <EditorialHero {...workPage.hero} illustration={<JourneyScreens />} />
      <Chapter label="Selected work">
        <WorkList />
      </Chapter>
      <BigStatement {...workPage.closing} />
    </VStack>
  );
}
