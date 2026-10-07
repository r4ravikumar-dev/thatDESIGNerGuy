'use client';

import {useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties} from 'react';
import {motion, useReducedMotion, useScroll, useTransform, type MotionValue} from 'framer-motion';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {MotionVStack} from '@/components/motion/Motion';
import {Glyph, type GlyphName} from '@/components/illustrations/glyphs';
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
  /**
   * Sticky scroll: from 1280px (one row) the rail pins in the middle of the
   * screen and each step comes in as the reader scrolls, then it lets go.
   */
  isPinned?: boolean;
};

/** Breakpoints of .sequence-rail in globals.css: three columns from 768px, one row from 1280px. */
const COLUMNS = '(min-width: 768px)';
const SINGLE_ROW = '(min-width: 1280px)';

/** Whether a media query matches, kept in sync as the window resizes. */
function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    onChange => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * One step. In a single row it is revealed as the rail's scroll progress
 * passes its place in the sequence; when the rail wraps or stacks, each step
 * is revealed as it scrolls into view itself, staggered left to right within
 * a row, so no step is ever on screen but still hidden.
 */
function Step({
  step,
  index,
  count,
  progress,
  isSingleRow,
  hasColumns,
  isStatic,
}: {
  step: SequenceStep;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isSingleRow: boolean;
  hasColumns: boolean;
  isStatic: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const {scrollYProgress: ownProgress} = useScroll({
    target: ref,
    offset: ['start 95%', 'start 60%'],
  });
  const full = useTransform(ownProgress, () => 1);
  const column = hasColumns ? index % 3 : 0;
  const source = isStatic ? full : isSingleRow ? progress : ownProgress;
  const start = isSingleRow ? index / count : column * 0.15;
  const end = isSingleRow ? Math.min(1, start + 0.8 / count) : start + 0.6;
  const opacity = useTransform(source, [start, end], [0, 1]);
  const y = useTransform(source, [start, end], [24, 0]);
  // The number turns brand blue once the step is fully in.
  const numberColor = useTransform(
    source,
    [end - 0.001, end],
    ['var(--color-text-secondary)', 'var(--color-brand-text)'],
  );

  return (
    <li ref={ref} className="sequence-rail-step">
      <MotionVStack gap={4} style={{opacity, y}}>
        {step.glyph && (
          <VStack hAlign="start" style={{marginBlockEnd: 'var(--spacing-2)'}}>
            <Glyph name={step.glyph} />
          </VStack>
        )}
        <motion.span
          style={{...EYEBROW_STYLE, color: numberColor, fontSize: 'var(--text-supporting-size)'}}>
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <Heading
          level={3}
          textWrap="balance"
          style={{...typeRole('headline-s'), letterSpacing: '-0.01em'}}>
          {step.title}
        </Heading>
        <Text color="secondary" textWrap="pretty">
          {step.description}
        </Text>
      </MotionVStack>
    </li>
  );
}

/**
 * An ordered sequence in the editorial language: columns divided by
 * hairlines, each with a mono number, a headline and one line of context.
 * It follows the reader's scroll: the steps appear one by one and a
 * brand-blue progress line grows across the top; scrolling back reverses
 * it. Reduced motion shows everything at once.
 * One row from 1280px, three columns on tablets, stacked on phones
 * (.sequence-rail in globals.css).
 */
/** Share of the pinned scroll spent revealing steps; the rest holds the finished row. */
const REVEAL_SHARE = 0.85;

/** How far the sliding row must travel so its last card ends at the stage's edge. */
function useSlideDistance(railRef: React.RefObject<HTMLOListElement | null>, isSliding: boolean) {
  const [distance, setDistance] = useState(0);
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!isSliding || !rail) return;
    const measure = () => setDistance(Math.max(0, rail.scrollWidth - rail.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [railRef, isSliding]);
  return distance;
}

export function SequenceRail({steps, label, isPinned: canPin = false}: SequenceRailProps) {
  const ref = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isSingleRow = useMediaQuery(SINGLE_ROW, true);
  const hasColumns = useMediaQuery(COLUMNS, true);
  const isPinned = canPin && !reduceMotion;
  // Below 1280px a pinned rail can't show every card at once, so the cards
  // sit in one sideways row that slides across as the reader scrolls down.
  const isSliding = isPinned && !isSingleRow;
  // In view: 0 when the rail's top enters the lower part of the screen, 1
  // once its bottom has risen past the middle.
  const {scrollYProgress: inView} = useScroll({target: ref, offset: ['start 85%', 'end 55%']});
  // Pinned: 0 when the stage pins, 1 when it lets go. Only rails that can
  // pin render the track, so the others don't point useScroll at nothing.
  const {scrollYProgress: pinned} = useScroll({
    target: canPin ? trackRef : undefined,
    offset: ['start start', 'end end'],
  });
  const pinnedReveal = useTransform(pinned, [0, REVEAL_SHARE], [0, 1]);
  const full = useTransform(inView, () => 1);
  const progress = reduceMotion ? full : isPinned ? pinnedReveal : inView;
  const distance = useSlideDistance(ref, isSliding);
  const slideX = useTransform(pinnedReveal, [0, 1], [0, -distance]);

  const rail = (
    <VStack gap={0} style={{position: 'relative', overflow: isSliding ? 'hidden' : undefined}}>
      <motion.span aria-hidden className="sequence-rail-progress" style={{scaleX: progress}} />
      <motion.ol
        ref={ref}
        aria-label={label}
        className={isSliding ? 'sequence-rail sequence-rail-sliding' : 'sequence-rail'}
        style={{'--steps': steps.length, x: isSliding ? slideX : 0} as CSSProperties}>
        {steps.map((step, index) => (
          <Step
            key={step.title}
            step={step}
            index={index}
            count={steps.length}
            progress={progress}
            isSingleRow={isSingleRow || isSliding}
            hasColumns={hasColumns}
            isStatic={Boolean(reduceMotion)}
          />
        ))}
      </motion.ol>
    </VStack>
  );

  if (!canPin) return rail;

  // The track is taller than the screen (a third of a screen per step); the
  // stage inside it sticks under the header, the rail centred in the screen
  // below it, while the track scrolls by.
  return (
    <div
      ref={trackRef}
      className={isPinned ? 'sequence-pin' : undefined}
      style={{'--steps': steps.length} as CSSProperties}>
      <VStack gap={0} className={isPinned ? 'sequence-pin-stage' : undefined}>
        {rail}
      </VStack>
    </div>
  );
}
