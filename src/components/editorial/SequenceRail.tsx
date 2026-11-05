'use client';

import {useRef, type CSSProperties} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Glyph, type GlyphName} from '@/components/illustrations/glyphs';
import {EASE, gsap, useGSAP} from '@/motion/gsap';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

export type SequenceStep = {
  title: string;
  description: string;
  /** A small step illustration from the glyph set. */
  glyph?: GlyphName;
};

type SequenceRailProps = {
  steps: readonly SequenceStep[];
  /** What the sequence shows, for screen readers. */
  label: string;
};

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Shares of the scroll: a card coming in, then the grid lines around it drawing. */
const CARD = 1;
const GRID = 0.7;

/**
 * One step: its glyph, number, title and line, plus the hairlines that make
 * the grid, owned by the step so they can draw in with it: a line along its
 * top and bottom, and a divider down its left side where it has a neighbour
 * in the row (.sequence-rail-line in globals.css).
 */
function Step({step, index}: {step: SequenceStep; index: number}) {
  return (
    <li className="sequence-rail-step">
      <span aria-hidden className="sequence-rail-line sequence-rail-line-top" />
      <span aria-hidden className="sequence-rail-line sequence-rail-line-bottom" />
      <span aria-hidden className="sequence-rail-line sequence-rail-line-divider" />
      <VStack gap={4} className="sequence-rail-card">
        {step.glyph && (
          <VStack hAlign="start" className="sequence-rail-art">
            <Glyph name={step.glyph} size={96} />
          </VStack>
        )}
        <VStack gap={4} className="sequence-rail-text">
          <span
            className="sequence-rail-number"
            style={{...EYEBROW_STYLE, fontSize: 'var(--text-supporting-size)'}}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <Heading
            level={3}
            textWrap="balance"
            style={{...typeRole('headline-s'), letterSpacing: '-0.01em'}}>
            {step.title}
          </Heading>
          <Text color="secondary" textWrap="pretty">
            {step.description}
          </Text>
        </VStack>
      </VStack>
    </li>
  );
}

/**
 * An ordered sequence in the editorial language: columns divided by
 * hairlines, each with a mono number, a headline and one line of context.
 *
 * It builds with the reader's scroll, one step at a time, grid included:
 * the first card appears on its own, then the lines around it draw (its
 * top and bottom, and the divider to the next column), then the next card,
 * then its lines, and so on. Scrolling back takes it apart again. Reduced
 * motion, or no JavaScript, shows the finished grid.
 *
 * Stacked on phones, three columns on tablets and small laptops, one row
 * from 1280px (.sequence-rail in globals.css); the dividers follow.
 */
export function SequenceRail({steps, label}: SequenceRailProps) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const rail = ref.current;
      if (!rail) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>('.sequence-rail-step', rail);
        const timeline = gsap.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {trigger: rail, start: 'top 85%', end: 'bottom 55%', scrub: 0.6},
        });

        items.forEach((item, index) => {
          const q = gsap.utils.selector(item);
          const next = items[index + 1];

          // The card comes in on its own; its number turns brand blue as it lands.
          timeline
            .fromTo(
              q('.sequence-rail-card'),
              {opacity: 0, y: 24},
              {opacity: 1, y: 0, duration: CARD, ease: EASE.arrive},
            )
            .fromTo(
              q('.sequence-rail-number'),
              {color: 'var(--color-text-secondary)'},
              {color: 'var(--color-brand-text)', duration: CARD * 0.2},
              `-=${CARD * 0.2}`,
            );

          // Then its share of the grid: the lines above and below it draw
          // left to right, and the divider to the next column drops down.
          const grid = timeline.duration();
          timeline.fromTo(
            q('.sequence-rail-line-top, .sequence-rail-line-bottom'),
            {scaleX: 0},
            {scaleX: 1, duration: GRID, ease: EASE.wipe},
            grid,
          );
          if (next) {
            timeline.fromTo(
              next.querySelector('.sequence-rail-line-divider'),
              {scaleY: 0},
              {scaleY: 1, duration: GRID, ease: EASE.wipe},
              grid,
            );
          }
        });
      });
    },
    {scope: ref},
  );

  return (
    <ol
      ref={ref}
      aria-label={label}
      className="sequence-rail"
      style={{'--steps': steps.length} as CSSProperties}>
      {steps.map((step, index) => (
        <Step key={step.title} step={step} index={index} />
      ))}
    </ol>
  );
}
