'use client';

import {useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Lines} from '@/components/storytelling/Lines';
import {Glyph} from '@/components/illustrations/glyphs';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {timeline} from '@/content/home';

type Stop = (typeof timeline.stops)[number];

/** Above this width the timeline pins and slides sideways (.timeline-sliding). */

const SLIDING = '(min-width: 811px)';

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
 * The pinned scroll is split into equal beats: card 0 holds in the centre,
 * the row moves, card 1 holds in the centre, and so on. Card `index` is
 * centred from `hold[0]` to `hold[1]`; `beat` is one beat's share.
 */
function beats(index: number, count: number) {
  const beat = 1 / (2 * count - 1);
  return {beat, hold: [2 * index * beat, (2 * index + 1) * beat] as const};
}

/** The card's contents: its glyph, date, title, story, then its short list. */
function StopText({stop}: {stop: Stop}) {
  return (
    <VStack gap={3} className="timeline-card">
      <VStack
        hAlign="start"
        className="timeline-card-art"
        style={{marginBlockEnd: 'var(--spacing-3)'}}>
        <Glyph name={stop.glyph} size={112} />
      </VStack>
      <Text type="supporting" style={EYEBROW_STYLE}>
        {stop.date}
      </Text>
      <Heading
        level={3}
        textWrap="balance"
        style={{...typeRole('headline-m'), letterSpacing: '-0.01em'}}>
        {stop.title}
      </Heading>
      <Text
        type="large"
        color="secondary"
        textWrap="pretty"
        style={{fontWeight: 400, maxInlineSize: '36ch'}}>
        {stop.story}
      </Text>
      <Text type="supporting" style={{...EYEBROW_STYLE, marginBlockStart: 'var(--spacing-4)'}}>
        {stop.listLabel}
      </Text>
      <ul className="timeline-list">
        {stop.items.map(item => (
          <li key={item}>
            <Text color="secondary">{item}</Text>
          </li>
        ))}
      </ul>
    </VStack>
  );
}

/**
 * One stop. Stacked (phones): its dot sits on the shared line down the left
 * and the card fades in as it scrolls into view. Sliding: it draws its own
 * stretch of line along the top, which fills in brand blue as the next card
 * arrives, and the card fades in during its share of the pinned scroll.
 */
function TimelineStop({
  stop,
  index,
  count,
  progress,
  isSliding,
}: {
  stop: Stop;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isSliding: boolean;
}) {
  const {beat, hold} = beats(index, count);
  // Computed straight from the scroll (no keyframes), so the first card's
  // windows can start before 0 without upsetting the animation engine.
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  // Only the current card shows: it fades in as it moves to the centre and
  // out as it moves on.
  const opacity = useTransform(progress, p => {
    if (!isSliding) return 1;
    if (p < hold[0]) return clamp01(1 - (hold[0] - p) / beat);
    if (p > hold[1]) return clamp01(1 - (p - hold[1]) / beat);
    return 1;
  });
  const y = useTransform(progress, p => (isSliding ? 16 * clamp01((hold[0] - p) / beat) : 0));
  // This card's stretch of line fills while the row moves on to the next card.
  const segment = useTransform(progress, p => clamp01((p - hold[1]) / beat));
  // The dot lights as its card arrives (the first is lit from the start).
  const lit = isSliding ? hold[0] - beat / 2 : index / count;
  const dotColor = useTransform(progress, p =>
    index === 0 || p >= lit ? 'var(--color-brand-text)' : 'var(--color-border-emphasized)',
  );

  // The current stop's dot beeps: a ring pulses out from it while its card holds.
  const ring = useTransform(progress, p =>
    isSliding && p >= hold[0] - beat / 2 && p <= hold[1] + beat / 2 ? 1 : 0,
  );

  return (
    <li className="timeline-stop">
      <span aria-hidden className="timeline-seg" />
      <motion.span
        aria-hidden
        className="timeline-seg timeline-seg-fill"
        style={{scaleX: segment}}
      />
      <motion.span aria-hidden className="timeline-dot" style={{backgroundColor: dotColor}}>
        <motion.span className="timeline-dot-ring" style={{opacity: ring}} />
      </motion.span>
      {isSliding ? (
        <motion.div style={{opacity, y}}>
          <StopText stop={stop} />
        </motion.div>
      ) : (
        <Reveal distance={24}>
          <StopText stop={stop} />
        </Reveal>
      )}
    </li>
  );
}

/**
 * How I got here, after About. On every screen the timeline pins under the
 * header and moves one card at a time into the centre: above 810px
 * header and slides sideways: each card is 60% of the width and holds in
 * the centre while it's current (the others hidden); then the
 * row slides the next one into the centre, the line between them filling in
 * blue and the new dot lighting up. At 810px and below it is a
 * vertical timeline with the line down the left, filling as the page
 * scrolls. Reduced motion shows everything at once.
 */
export function Timeline() {
  const {label, title, stops} = timeline;
  const trackRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  // Desktop and tablets (above 810px) pin and slide sideways; phones scroll
  // normally.
  const isSliding = useMediaQuery(SLIDING, true) && !reduceMotion;
  const isPinned = isSliding;

  // Reduced motion: 0 when the list's top nears the bottom of the screen, 1 when its end passes the middle.
  const {scrollYProgress: inView} = useScroll({target: listRef, offset: ['start 80%', 'end 60%']});
  // Pinned: 0 when the stage pins, 1 when it lets go.
  const {scrollYProgress: pinned} = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const full = useTransform(inView, () => 1);
  const progress = isPinned ? pinned : reduceMotion ? full : inView;

  // Where the row sits for each card: that card centred in the window while it holds.
  const [positions, setPositions] = useState<number[]>(stops.map(() => 0));
  useLayoutEffect(() => {
    const list = listRef.current;
    const frame = windowRef.current;
    if (!isPinned || !list || !frame) return;
    const measure = () => {
      const cards = [...list.querySelectorAll<HTMLElement>('.timeline-stop')];
      setPositions(cards.map(card => (frame.clientWidth - card.offsetWidth) / 2 - card.offsetLeft));
    };
    measure();
    // Re-measure whenever a card changes size (text wrapping on resize), and
    // once the web fonts have loaded, since they change every card's height.
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    observer.observe(frame);
    list.querySelectorAll('.timeline-stop').forEach(card => observer.observe(card));
    let isCurrent = true;
    document.fonts?.ready.then(() => {
      if (isCurrent) measure();
    });
    window.addEventListener('resize', measure);
    return () => {
      isCurrent = false;
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isPinned, isSliding]);
  const inputs: number[] = [];
  const outputs: number[] = [];
  stops.forEach((_, index) => {
    const {hold} = beats(index, stops.length);
    inputs.push(hold[0], hold[1]);
    outputs.push(positions[index] ?? 0, positions[index] ?? 0);
  });
  const offset = useTransform(pinned, inputs, outputs);

  const list = (
    <ol
      ref={listRef}
      className={isSliding ? 'timeline timeline-sliding' : 'timeline'}
      style={{'--stops': stops.length} as CSSProperties}>
      <span aria-hidden className="timeline-track" />
      <motion.span
        aria-hidden
        className="timeline-progress"
        style={{'--p': progress} as MotionStyle}
      />
      {stops.map((stop, index) => (
        <TimelineStop
          key={stop.date}
          stop={stop}
          index={index}
          count={stops.length}
          progress={progress}
          isSliding={isSliding}
        />
      ))}
    </ol>
  );

  return (
    <Container gap={0}>
      <section aria-label={label} id="journey" className="timeline-section">
        <VStack gap={6}>
          <Reveal>
            <IndexLabel>{label}</IndexLabel>
          </Reveal>
          <Reveal delay={0.05} distance={32}>
            <Heading
              level={2}
              textWrap="balance"
              style={{...typeRole('display-l'), letterSpacing: '-0.03em'}}>
              <Lines text={title} />
            </Heading>
          </Reveal>
        </VStack>
        {isPinned ? (
          // The track is taller than the screen; the stage sticks under the
          // header while the track scrolls by, moving each card to the centre.
          <div
            ref={trackRef}
            className="sequence-pin"
            style={{'--steps': stops.length} as CSSProperties}>
            <VStack gap={0} className="sequence-pin-stage">
              <div ref={windowRef} data-direction="across" className="timeline-window">
                {/* The line runs the full width behind the cards; it stays put while they slide. */}
                <span aria-hidden className="timeline-rail" />
                <motion.div style={{x: offset}}>{list}</motion.div>
              </div>
            </VStack>
          </div>
        ) : (
          <div ref={trackRef}>{list}</div>
        )}
      </section>
    </Container>
  );
}
