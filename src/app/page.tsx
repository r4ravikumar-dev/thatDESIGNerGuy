import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {SequenceRail} from '@/components/editorial/SequenceRail';
import {DisciplineDeck} from '@/components/home/DisciplineDeck';
import {BigStatement} from '@/components/editorial/BigStatement';
import {PortfolioHero} from '@/components/home/PortfolioHero';
import {WorkShowcase} from '@/components/home/WorkShowcase';
import {AboutSection} from '@/components/home/AboutSection';
import {Timeline} from '@/components/home/Timeline';
import {closing, disciplines, process} from '@/content/home';

export default function HomePage() {
  return (
    <VStack gap={0}>
      {/* Hero: the name, the intro and the story, with the photo pinned beside them. */}
      <PortfolioHero />

      {/* Work: the pinned 30/70 showcase. */}
      <WorkShowcase />

      {/* About: who's behind the screens. */}
      <AboutSection />

      {/* How I got here: the timeline. */}
      <Timeline />

      {/* 01 What I do */}
      <Chapter label={disciplines.label}>
        {/* Full-screen cards, pinned, sliding in sideways one after another,
          with the title pinned above them like the timeline's. */}
        <DisciplineDeck
          items={disciplines.items}
          label="What I do, by discipline"
          head={
            <ChapterHeader
              index={disciplines.index}
              label={disciplines.label}
              title={disciplines.title}
            />
          }
        />
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
