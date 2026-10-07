import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {SequenceRail} from '@/components/editorial/SequenceRail';
import {Marquee} from '@/components/editorial/Marquee';
import {BigStatement} from '@/components/editorial/BigStatement';
import {PortfolioHero} from '@/components/home/PortfolioHero';
import {WorkShowcase} from '@/components/home/WorkShowcase';
import {closing, disciplines, process} from '@/content/home';

export default function HomePage() {
  return (
    <VStack gap={0}>
      {/* Hero: the name, the intro and the story, with the photo pinned beside them. */}
      <PortfolioHero />

      {/* Work: the pinned 30/70 showcase. */}
      <WorkShowcase />

      {/* 01 What I do */}
      <Chapter label={disciplines.label}>
        <ChapterHeader
          index={disciplines.index}
          label={disciplines.label}
          title={disciplines.title}
        />
        <SequenceRail steps={disciplines.items} label="What I do, by discipline" isPinned />
        <Marquee items={disciplines.principles} />
      </Chapter>

      {/* 03 How I work */}
      <Chapter label={process.label}>
        <ChapterHeader index={process.index} label={process.label} title={process.title} />
        <SequenceRail steps={process.steps} label="How I work, step by step" />
      </Chapter>

      <BigStatement {...closing} />
    </VStack>
  );
}
