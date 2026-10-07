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
   * Sticky scroll: the rail pins in the middle of the screen and the steps
   * slide in from the right one by one as the reader scrolls, then it lets go.
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
  isSliding = false,
  window,
}: {
  step: SequenceStep;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isSingleRow: boolean;
  hasColumns: boolean;
  isStatic: boolean;
  isSliding?: boolean;
  /** Sliding rails: the share of the pinned scroll over which this step fades in. */
  window?: [number, number];
}) {
  const ref = useRef<HTMLLIElement>(null);
  const {scrollYProgress: ownProgress} = useScroll({
    target: ref,
    offset: ['start 95%', 'start 60%'],
  });
  const full = useTransform(ownProgress, () => 1);
  const column = hasColumns ? index % 3 : 0;
  const source = isStatic ? full : isSingleRow ? progress : ownProgress;
  const start = window ? window[0] : isSingleRow ? index / count : column * 0.15;
  const end = window ? window[1] : isSingleRow ? Math.min(1, start + 0.8 / count) : start + 0.6;
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
      {/* Sliding cards wider than 810px: illustration left, text right
          (.sequence-rail-card in globals.css). Otherwise stacked. */}
      <MotionVStack gap={4} className="sequence-rail-card" style={{opacity, y}}>
        {step.glyph && (
          <VStack hAlign="start" className="sequence-rail-art">
            <Glyph name={step.glyph} size={isSliding ? null : 96} />
          </VStack>
        )}
        <VStack gap={4} className="sequence-rail-text">
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
        </VStack>
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

/**
 * The sliding row's travel (so its last card ends at the stage's edge) and
 * how many cards fit on screen at once.
 */
function useSlideMetrics(railRef: React.RefObject<HTMLOListElement | null>, isSliding: boolean) {
  const [metrics, setMetrics] = useState({distance: 0, visible: 1});
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!isSliding || !rail) return;
    const measure = () => {
      const card = rail.firstElementChild?.getBoundingClientRect().width ?? rail.clientWidth;
      setMetrics({
        distance: Math.max(0, rail.scrollWidth - rail.clientWidth),
        visible: Math.max(1, Math.floor(rail.clientWidth / card + 0.05)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [railRef, isSliding]);
  return metrics;
}

/** Share of the reveal spent bringing in the cards already on screen, before the row moves. */
const INTRO_SHARE = 0.16;

/**
 * When each step of a sliding rail fades in: the cards that start on screen
 * come in one after another while the row holds still; then the row slides
 * and each later card fades in as it enters from the right.
 */
function slideWindow(index: number, count: number, visible: number): [number, number] {
  if (index < visible) {
    const step = INTRO_SHARE / visible;
    return [index * step, (index + 1) * step];
  }
  const span = (1 - INTRO_SHARE) / Math.max(1, count - visible);
  const start = INTRO_SHARE + (index - visible) * span;
  return [start, start + span];
}

export function SequenceRail({steps, label, isPinned: canPin = false}: SequenceRailProps) {
  const ref = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isSingleRow = useMediaQuery(SINGLE_ROW, true);
  const hasColumns = useMediaQuery(COLUMNS, true);
  const isPinned = canPin && !reduceMotion;
  // A pinned rail always slides: the cards sit in one sideways row (half the
  // rail wide on desktop) that moves left as the reader scrolls down, each
  // card fading in as it arrives and the next one peeking in.
  const isSliding = isPinned;
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
  const {distance, visible} = useSlideMetrics(ref, isSliding);
  const slideX = useTransform(pinnedReveal, [0, INTRO_SHARE, 1], [0, 0, -distance]);

  const rail = (
    <VStack
      gap={0}
      className={isSliding ? 'sequence-rail-window' : undefined}
      style={{position: 'relative', overflow: isSliding ? 'hidden' : undefined}}>
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
            isSliding={isSliding}
            window={isSliding ? slideWindow(index, steps.length, visible) : undefined}
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
