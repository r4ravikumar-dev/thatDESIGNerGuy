'use client';

import {Fragment, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {ScriptNames} from '@/components/editorial/ScriptNames';
import {accentStyle} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {workShowcase, type WorkProject} from '@/content/home';

/** A project: numbered eyebrow, title (the italic serif, in brand blue), description and meta. */
function ProjectText({project, index}: {project: WorkProject; index: number}) {
  return (
    <VStack gap={3}>
      <span style={{marginBlockEnd: 'var(--spacing-2)'}}>
        <IndexLabel index={index + 1}>{project.label}</IndexLabel>
      </span>
      <Heading
        level={3}
        textWrap="balance"
        style={{...typeRole('headline-xl'), ...accentStyle, letterSpacing: '-0.01em'}}>
        {project.title}
      </Heading>
      <Text
        type="large"
        color="secondary"
        textWrap="pretty"
        style={{maxInlineSize: '36ch', fontWeight: 400}}>
        {project.description}
      </Text>
      <Text type="supporting" style={{...EYEBROW_STYLE, marginBlockStart: 'var(--spacing-2)'}}>
        {/* Each item keeps its dot, so a wrap never leaves one dangling. */}
        {project.meta.map((item, i) => (
          <Fragment key={item}>
            <span style={{whiteSpace: 'nowrap'}}>
              {item}
              {i < project.meta.length - 1 && '\u00a0·'}
            </span>
            {i < project.meta.length - 1 && ' '}
          </Fragment>
        ))}
      </Text>
    </VStack>
  );
}

/** The project's picture, or a labelled placeholder panel until there is one. */
function Thumbnail({project, index}: {project: WorkProject; index: number}) {
  if (project.thumbnail) {
    return (
      // The cover in the brand two-tone (like the hero portrait), filling the panel.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="work-showcase-image"
        src={project.thumbnail.src}
        alt={project.thumbnail.alt}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        style={{objectPosition: project.thumbnail.focus ?? 'center'}}
      />
    );
  }
  return (
    <VStack className="work-showcase-placeholder" hAlign="center" vAlign="center" aria-hidden>
      <Text type="supporting" color="secondary" style={EYEBROW_STYLE}>
        Project thumbnail {String(index + 1).padStart(2, '0')}
      </Text>
    </VStack>
  );
}

/**
 * Work, right after the hero. From 1024px a 30/70 split on the page frame:
 * the left column pins under the header for the whole section, with the
 * headline ("Work" in three scripts) and supporting line at its top and the
 * current project's eyebrow, title, description and meta at its foot; the
 * right column is a stack of project thumbnails, each a full screen tall. As a thumbnail crosses the middle of
 * the screen, the left column switches to that project. Below 1024px it
 * stacks: headline, then each thumbnail followed by its text.
 */
export function WorkShowcase() {
  const {names, supporting, projects, label} = workShowcase;
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // The current project is the thumbnail covering the middle of the
    // screen, checked on scroll (at most once a frame) and on resize.
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      const index = panels.current.findIndex(panel => {
        const rect = panel?.getBoundingClientRect();
        return rect !== undefined && rect.top <= middle && rect.bottom > middle;
      });
      if (index !== -1) setActive(index);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const current = projects[active] ?? projects[0];

  return (
    <Container gap={0}>
      <section aria-label={label} className="work-showcase-section" id="work">
        <div className="work-showcase">
          <VStack className="work-showcase-side" justify="between">
            <VStack gap={6} className="work-showcase-header">
              <Reveal delay={0.05} distance={32}>
                <ScriptNames names={names} />
              </Reveal>
              <Reveal delay={0.1}>
                <Text
                  type="large"
                  color="secondary"
                  textWrap="pretty"
                  style={{maxInlineSize: '36ch', fontWeight: 400}}>
                  {supporting}
                </Text>
              </Reveal>
            </VStack>
            {/* Desktop: the current project, swapping as the thumbnails pass.
              Screen readers get every project in order from the list instead. */}
            <VStack className="work-showcase-current" aria-hidden>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduceMotion ? false : {opacity: 0, y: 16}}
                  animate={{opacity: 1, y: 0}}
                  exit={reduceMotion ? undefined : {opacity: 0, y: -16}}
                  transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}>
                  <ProjectText project={current} index={active} />
                </motion.div>
              </AnimatePresence>
            </VStack>
          </VStack>

          <ol className="work-showcase-list">
            {projects.map((project, index) => (
              <li
                key={index}
                ref={node => {
                  panels.current[index] = node;
                }}
                data-index={index}
                className="work-showcase-item">
                <Reveal distance={40} className="work-showcase-frame">
                  <Thumbnail project={project} index={index} />
                </Reveal>
                {/* Phones and tablets: the text sits under its thumbnail. On
                  desktop it is visually hidden (the pinned column shows it). */}
                <VStack className="work-showcase-item-text">
                  <ProjectText project={project} index={index} />
                </VStack>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Container>
  );
}
