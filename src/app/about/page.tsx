import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {SequenceRail} from '@/components/editorial/SequenceRail';
import {BigStatement} from '@/components/editorial/BigStatement';
import {ProfileNote} from '@/components/studio/ProfileNote';
import {Timeline} from '@/components/home/Timeline';
import {aboutClosing, aboutHero, beliefs, profile} from '@/content/about';

export const metadata: Metadata = {
  title: 'About',
  description: aboutHero.description,
  alternates: {canonical: '/about'},
};

export default function AboutPage() {
  return (
    <VStack gap={0}>
      {/* Full width and centred: the title and introduction on their own. */}
      <EditorialHero {...aboutHero} align="center" hasBackdrop />

      {/* 01 The person */}
      <Chapter label={profile.label}>
        <ProfileNote index={1} {...profile} />
      </Chapter>

      {/* How I got here: the same career timeline as the homepage, with its
        sticky heading and stops that build as they scroll in. */}
      <Timeline />

      {/* 02 What I believe: built like How I work on the homepage, a grid of
        cards that builds card by card as it scrolls in. */}
      <Chapter label={beliefs.label}>
        <ChapterHeader index={beliefs.index} label={beliefs.label} title={beliefs.title} />
        <SequenceRail steps={beliefs.items} label="What I believe, one by one" />
      </Chapter>

      <BigStatement {...aboutClosing} />
    </VStack>
  );
}
