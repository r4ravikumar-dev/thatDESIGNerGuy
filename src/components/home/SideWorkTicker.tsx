'use client';

import {useEffect, useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Pause, Play} from 'lucide-react';
import {Container} from '@/components/layout/Container';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Reveal} from '@/components/motion/Reveal';
import {Lines} from '@/components/storytelling/Lines';
import {useTextReveal} from '@/motion/scroll';
import {typeRole} from '@/theme/typeScale';
import {sideWork} from '@/content/sideWork';
import type {SideWorkPhoto} from '@/lib/sideWork/types';

/** Seconds each photo takes to pass, so a longer list doesn't speed up. */
const SECONDS_PER_CARD = 5;
/** A short list repeats until it has this many photos, so it fills a wide screen. */
const MIN_LOOP = 8;
/** Speed while the pointer is over the ticker: a quarter of normal. */
const HOVER_RATE = 0.25;
/** How quickly the speed eases toward its target each frame (0 to 1). */
const RATE_EASE = 0.08;

/** One photo, at the ticker's height, as wide as its proportions need. */
function SideWorkCard({photo, isRepeat = false}: {photo: SideWorkPhoto; isRepeat?: boolean}) {
  const ratio = photo.width && photo.height ? `${photo.width} / ${photo.height}` : '4 / 3';
  return (
    <VStack as="li" className="side-work-card" style={{aspectRatio: ratio}} aria-hidden={isRepeat || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width ?? undefined}
        height={photo.height ?? undefined}
        loading="lazy"
        decoding="async"
      />
    </VStack>
  );
}

/**
 * Side work: AI tools, graphics and small design pieces, outside the main
 * case studies. The cards run past in an endless loop (two copies of the
 * list sliding by half their width), slowing to a crawl under the pointer,
 * pausing while keyboard focus is on them, and with a pause button for
 * anyone who wants it still.
 * Reduced motion turns the loop into a row you scroll yourself.
 */
export function SideWorkTicker({photos}: {photos: SideWorkPhoto[]}) {
  const [isPaused, setIsPaused] = useState(false);
  const titleRef = useTextReveal({delay: 0.05});
  const trackRef = useRef<HTMLDivElement>(null);
  const rateFrame = useRef(0);

  // Eases the loop's speed toward a target, from wherever it is now, so
  // slowing down and speeding back up never jumps.
  const easeRate = (target: number) => {
    const loop = trackRef.current?.getAnimations()[0];
    if (!loop) return;
    cancelAnimationFrame(rateFrame.current);
    const step = () => {
      const rate = loop.playbackRate + (target - loop.playbackRate) * RATE_EASE;
      if (Math.abs(target - rate) < 0.005) {
        loop.updatePlaybackRate(target);
        return;
      }
      loop.updatePlaybackRate(rate);
      rateFrame.current = requestAnimationFrame(step);
    };
    step();
  };
  useEffect(() => () => cancelAnimationFrame(rateFrame.current), []);
  // Repeats a short list so the row is always wider than the screen. Repeats
  // are hidden from screen readers, so each photo is announced once.
  const loop = Array.from({length: Math.max(1, Math.ceil(MIN_LOOP / photos.length))}, (_, round) =>
    photos.map(photo => ({photo, isRepeat: round > 0, key: `${round}-${photo.id}`})),
  ).flat();
  const duration = `${loop.length * SECONDS_PER_CARD}s`;

  return (
    <VStack as="section" aria-label={sideWork.label} gap={0} className="side-work">
      <Container>
        {/* Label, headline, then the intro right under it. */}
        <VStack gap={6}>
          <Reveal>
            <IndexLabel>{sideWork.label}</IndexLabel>
          </Reveal>
          <VStack gap={4}>
            <Heading
              ref={titleRef}
              data-text-reveal
              level={2}
              textWrap="balance"
              style={{...typeRole('section-title'), letterSpacing: '-0.03em', maxInlineSize: '30ch'}}>
              <Lines text={sideWork.title} />
            </Heading>
            <Reveal delay={0.12} maxWidth={760}>
              <Text type="large" color="secondary" textWrap="balance">
                {sideWork.intro}
              </Text>
            </Reveal>
          </VStack>
        </VStack>
      </Container>

      <VStack
        className="side-work-ticker"
        data-paused={isPaused || undefined}
        // Mouse and pen only: a tap on a phone shouldn't leave it crawling.
        onPointerEnter={(event: PointerEvent) => {
          if (event.pointerType !== 'touch') easeRate(HOVER_RATE);
        }}
        onPointerLeave={(event: PointerEvent) => {
          if (event.pointerType !== 'touch') easeRate(1);
        }}>
        <HStack
          ref={trackRef}
          className="side-work-track"
          gap={0}
          style={{'--side-work-duration': duration} as CSSProperties}>
          <HStack as="ul" className="side-work-group" gap={0}>
            {loop.map(({photo, isRepeat, key}) => (
              <SideWorkCard key={key} photo={photo} isRepeat={isRepeat} />
            ))}
          </HStack>
          {/* The second copy closes the loop; hidden from screen readers and the tab order. */}
          <HStack as="ul" className="side-work-group side-work-copy" gap={0} aria-hidden inert>
            {loop.map(({photo, key}) => (
              <SideWorkCard key={key} photo={photo} />
            ))}
          </HStack>
        </HStack>
      </VStack>

      <Container>
        <HStack justify="end" className="side-work-controls">
          <IconButton
            label={isPaused ? sideWork.play : sideWork.pause}
            tooltip={isPaused ? 'Play' : 'Pause'}
            variant="secondary"
            onClick={() => setIsPaused(paused => !paused)}
            icon={<Icon icon={isPaused ? Play : Pause} size="sm" color="inherit" />}
          />
        </HStack>
      </Container>
    </VStack>
  );
}
