import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Chapter} from '@/components/editorial/Chapter';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {SequenceRail} from '@/components/editorial/SequenceRail';
import {Marquee} from '@/components/editorial/Marquee';
import {BigStatement} from '@/components/editorial/BigStatement';
import {WorkList} from '@/components/editorial/WorkList';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {ThinkingLens} from '@/components/illustrations/scenes';
import {PortfolioHero} from '@/components/home/PortfolioHero';
import {closing, disciplines, process, work} from '@/content/home';
import {caseStudies} from '@/content/work';

export default function HomePage() {
  return (
    <VStack gap={0}>
      {/* Hero: the name, the intro and the story, with the photo pinned beside them. */}
      <PortfolioHero />

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

      {/* 02 Selected work */}
      <Chapter tone="muted" label={work.label}>
        <Grid columns={1} gap={10} className="section-split">
          <ChapterHeader
            index={work.index}
            label={work.label}
            title={work.title}
            size="display-l"
          />
          <Reveal hAlign="end" className="section-art">
            <ThinkingLens maxWidth={340} />
          </Reveal>
        </Grid>
        <WorkList limit={3} />
        {caseStudies.length > 0 && (
          <Reveal>
            <HStack>
              <CtaButton {...work.action} variant="secondary" />
            </HStack>
          </Reveal>
        )}
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
