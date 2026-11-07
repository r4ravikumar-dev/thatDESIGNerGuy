'use client';

import {Fragment} from 'react';
import NextLink from 'next/link';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Chapter} from '@/components/editorial/Chapter';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowUpRight} from 'lucide-react';
import {useProjectGate} from '@/components/work/ProjectGate';
import {Reveal} from '@/components/motion/Reveal';
import {Lines} from '@/components/storytelling/Lines';
import {useMediaReveal, useTextReveal} from '@/motion/scroll';
import {workPage, type WorkFeature} from '@/content/work';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

const QUIET_EYEBROW = {...EYEBROW_STYLE, color: 'var(--color-text-secondary)'} as const;

/** Where a project opens: its case study once there is one, Contact until then. */
const hrefOf = (project: WorkFeature) => project.href ?? '/contact';

/**
 * The project's picture: the frame wipes open as it scrolls in and the image
 * settles from a zoom, then drifts inside it (useMediaReveal). The whole
 * picture opens the project, with the Figma-style "Explore project" pointer
 * over it (data-cursor, CustomCursor).
 */
function Picture({project, isFirst}: {project: WorkFeature; isFirst: boolean}) {
  const ref = useMediaReveal<HTMLDivElement>();
  const gate = useProjectGate();
  return (
    <VStack ref={ref} className="work-feature-frame" data-layout={project.layout}>
      <NextLink
        href={hrefOf(project)}
        {...gate.linkProps(project.label, project.isLive)}
        className="work-showcase-link"
        aria-label={`${workPage.exploreLabel}: ${project.label}`}
        data-cursor="project"
        data-cursor-label={project.isLive ? workPage.viewCaseStudy : workPage.exploreLabel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="work-showcase-image"
          src={project.image.src}
          alt={project.image.alt}
          loading={isFirst ? 'eager' : 'lazy'}
          decoding="async"
          style={{objectPosition: project.image.focus ?? 'center'}}
        />
      </NextLink>
    </VStack>
  );
}

/** "01 —— Mamily × Visit Health", then the area and disciplines in one quiet line. */
function Eyebrow({project, index}: {project: WorkFeature; index: number}) {
  return (
    <VStack gap={3}>
      <IndexLabel index={index + 1}>{project.label}</IndexLabel>
      <Text type="supporting" style={QUIET_EYEBROW}>
        {/* Each item keeps its dot, so a wrap never leaves one dangling. */}
        {project.tags.map((tag, i) => (
          <Fragment key={tag}>
            <span style={{whiteSpace: 'nowrap'}}>
              {tag}
              {i < project.tags.length - 1 && ' ·'}
            </span>
            {i < project.tags.length - 1 && ' '}
          </Fragment>
        ))}
      </Text>
    </VStack>
  );
}

function Title({project}: {project: WorkFeature}) {
  const ref = useTextReveal({delay: 0.05});
  return (
    <Heading
      ref={ref}
      data-text-reveal
      level={2}
      textWrap="balance"
      style={{...typeRole('section-title'), letterSpacing: '-0.03em', maxInlineSize: '20ch'}}>
      <Lines text={project.title} />
    </Heading>
  );
}

/** Description, what it centred on, and the way in. */
function Details({project}: {project: WorkFeature}) {
  const gate = useProjectGate();
  return (
    <Reveal delay={0.12}>
      <VStack gap={6}>
        <Text type="large" color="secondary" textWrap="pretty" style={{maxInlineSize: '44ch'}}>
          {project.description}
        </Text>
        <Text type="supporting" style={EYEBROW_STYLE}>
          {project.focus}
        </Text>
        <HStack>
          <Button
            label={project.isLive ? workPage.viewCaseStudy : workPage.exploreLabel}
            variant="secondary"
            size="md"
            href={project.isLive ? hrefOf(project) : undefined}
            onClick={project.isLive ? undefined : () => gate.open(project.label)}
            endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />}
          />
        </HStack>
      </VStack>
    </Reveal>
  );
}

/**
 * One project, in its own composition so the three don't read as identical
 * cards (.work-feature in globals.css):
 * - wide: the picture runs the full width, the text in two columns beneath;
 * - split: text on the left, the picture on the right;
 * - split-reverse: the picture on the left, text on the right.
 * Below 1024px every one stacks: picture, eyebrow, then the text.
 */
function Feature({project, index}: {project: WorkFeature; index: number}) {
  const isFirst = index === 0;
  if (project.layout === 'wide') {
    return (
      <VStack gap={0} className="work-feature" data-layout="wide">
        <Reveal>
          <Eyebrow project={project} index={index} />
        </Reveal>
        <Picture project={project} isFirst={isFirst} />
        <Grid columns={1} className="work-feature-wide-text">
          <Title project={project} />
          <Details project={project} />
        </Grid>
      </VStack>
    );
  }
  return (
    <Grid columns={1} className="work-feature" data-layout={project.layout}>
      <VStack gap={0} className="work-feature-text">
        <Reveal>
          <Eyebrow project={project} index={index} />
        </Reveal>
        <Title project={project} />
        <Details project={project} />
      </VStack>
      <Picture project={project} isFirst={isFirst} />
    </Grid>
  );
}

/**
 * The three featured projects, each a chapter of its own with an anchor
 * (/work#mamily, …) that the homepage's project banners open.
 */
export function WorkFeatures({projects = workPage.projects}: {projects?: readonly WorkFeature[]}) {
  return (
    <>
      {projects.map((project, index) => (
        <Chapter key={project.slug} id={project.slug} label={project.label}>
          <Feature project={project} index={index} />
        </Chapter>
      ))}
    </>
  );
}
