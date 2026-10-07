import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {IndexList} from '@/components/editorial/IndexList';
import {BigStatement} from '@/components/editorial/BigStatement';
import {ProfileNote} from '@/components/studio/ProfileNote';
import {OriginRings} from '@/components/illustrations/scenes';
import {aboutClosing, aboutHero, beliefs, profile} from '@/content/about';

export const metadata: Metadata = {
  title: 'About',
  description: aboutHero.description,
  alternates: {canonical: '/about'},
};

export default function AboutPage() {
  return (
    <VStack gap={0}>
      <EditorialHero {...aboutHero} illustration={<OriginRings />} />

      {/* 01 The person */}
      <Chapter label={profile.label}>
        <ProfileNote index={1} {...profile} />
      </Chapter>

      {/* 02 What I believe */}
      <Chapter tone="muted" label={beliefs.label}>
        <ChapterHeader index={beliefs.index} label={beliefs.label} title={beliefs.title} />
        <IndexList items={beliefs.items} />
      </Chapter>

      <BigStatement {...aboutClosing} />
    </VStack>
  );
}
