'use client';

import {useRef} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Lines} from '@/components/storytelling/Lines';
import {Glyph} from '@/components/illustrations/glyphs';
import {EASE, gsap, ScrollTrigger, useGSAP} from '@/motion/gsap';
import {useTextReveal} from '@/motion/scroll';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {timeline} from '@/content/home';

type Stop = (typeof timeline.stops)[number];

/** Where the layout changes from the left-hand line to the centred, alternating one. */
const DESKTOP = '(min-width: 1024px)';
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * One stop on the line. Three parts, placed by grid areas
 * (.timeline-stop in globals.css):
 * - the node: a ring on the line with a dot at its centre; the latest
 *   stop's ring beeps, since it is where things are now
 * - the aside: the big cropped numeral sitting on a hairline, the date,
 *   then the stop's illustration, large, filling the rest of the row
 * - the card: title, story and the short list, centred in the row's height
 * Every stop is as tall as the tallest one (grid-auto-rows: 1fr), with the
 * panel and the card stretching to fill it, so the rows match.
 * Phones and tablets: node on the left-hand line; numeral, date, panel and
 * card stacked beside it. From 1024px: aside | node | card, swapping sides
 * on every other stop.
 */
function TimelineStop({stop, index, isLatest}: {stop: Stop; index: number; isLatest: boolean}) {
  const number = String(index + 1).padStart(2, '0');
  return (
    <li className="timeline-stop" data-side={index % 2 === 0 ? 'end' : 'start'}>
      <span aria-hidden className="timeline-node" data-latest={isLatest || undefined}>
        <span className="timeline-node-dot" />
      </span>

      <VStack gap={3} className="timeline-aside">
        {/* Only the top of the numeral shows above its hairline. */}
        <span aria-hidden className="timeline-numeral">
          <span className="timeline-numeral-digits">{number}</span>
        </span>
        <span aria-hidden className="timeline-rule" />
        <Text type="supporting" style={EYEBROW_STYLE} data-appear>
          {stop.date}
        </Text>
        {/* The stop's illustration, large, in the space beside the card. */}
        <VStack className="timeline-art" hAlign="center" vAlign="center">
          <Glyph name={stop.glyph} size={null} />
        </VStack>
      </VStack>

      <VStack gap={3} justify="center" className="timeline-card">
        <span aria-hidden className="timeline-card-rule" />
        <Heading
          level={3}
          textWrap="balance"
          data-appear
          style={{...typeRole('headline-m'), letterSpacing: '-0.01em'}}>
          {stop.title}
        </Heading>
        <Text
          type="large"
          color="secondary"
          textWrap="pretty"
          data-appear
          style={{maxInlineSize: '36ch'}}>
          {stop.story}
        </Text>
        {/* The short list, for stops that have one. */}
        {stop.items.length > 0 && (
          <>
            <Text
              type="supporting"
              data-appear
              style={{...EYEBROW_STYLE, marginBlockStart: 'var(--spacing-4)'}}>
              {stop.listLabel}
            </Text>
            <ul className="timeline-list">
              {stop.items.map(item => (
                <li key={item} data-appear>
                  <Text color="secondary">{item}</Text>
                </li>
              ))}
            </ul>
          </>
        )}
      </VStack>
    </li>
  );
}

/**
 * How I got here. The eyebrow, headline and sub-headline stay pinned under
 * the site header while the stops scroll up beneath them (.timeline-head is
 * sticky within the section, so it leaves with the section).
 *
 * The line runs down the left on phones and tablets, and down the centre
 * from 1024px with the stops alternating either side of it.
 *
 * Scroll choreography (GSAP, motion-ok only):
 * - the line fills in brand blue as the page scrolls past it
 * - each stop appears as it arrives, in order: the node pops onto the
 *   line, the numeral rises out of its hairline, the hairlines draw out from
 *   the node, the illustration panel wipes open and the card rises, then the
 *   date, title, story and list rise in one after another
 * - the stop crossing the middle of the screen is in focus (filled numeral,
 *   lit node); the others step back a little
 * With reduced motion or without JavaScript everything is simply shown.
 */
export function Timeline() {
  const {label, title, supporting, stops} = timeline;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useTextReveal({delay: 0.05});

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add({isDesktop: DESKTOP, isMotionOk: MOTION_OK}, context => {
        const {isDesktop, isMotionOk} = context.conditions as {
          isDesktop: boolean;
          isMotionOk: boolean;
        };
        if (!isMotionOk) return;

        const list = section.querySelector<HTMLElement>('.timeline');
        const fill = section.querySelector('.timeline-spine-fill');
        if (!list) return;
        list.setAttribute('data-focus', '');

        // The line fills as the stops pass the middle of the screen.
        gsap.fromTo(
          fill,
          {scaleY: 0},
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.4},
          },
        );

        gsap.utils.toArray<HTMLElement>('.timeline-stop', section).forEach(stop => {
          const q = gsap.utils.selector(stop);
          // Content slides in from the side it sits on (always from the right on phones).
          const fromSide = isDesktop && stop.dataset.side === 'start' ? -1 : 1;

          gsap
            .timeline({
              defaults: {ease: EASE.arrive},
              scrollTrigger: {trigger: stop, start: 'top 80%', once: true},
            })
            .from(q('.timeline-node'), {
              scale: 0.4,
              opacity: 0,
              duration: 0.9,
              ease: 'back.out(1.7)',
            })
            .from(q('.timeline-numeral-digits'), {yPercent: 105, duration: 1.2}, 0.1)
            .from(
              q('.timeline-rule, .timeline-card-rule'),
              {scaleX: 0, duration: 1.2, ease: EASE.wipe},
              0.15,
            )
            // The illustration wipes open downwards from the hairline; the card
            // rises into place under it.
            .fromTo(
              q('.timeline-art'),
              {clipPath: 'inset(0% 0% 100% 0%)'},
              {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: EASE.wipe},
              0.25,
            )
            // Clip, not opacity: the focus state transitions the card's opacity in CSS.
            .fromTo(
              q('.timeline-card'),
              {clipPath: 'inset(0% 0% 100% 0%)', y: 40},
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                y: 0,
                duration: 1.2,
                ease: EASE.wipe,
                // Cleared after, or the clip would hide the connector outside the card's edge.
                clearProps: 'clipPath',
              },
              0.2,
            )
            .from(
              q('[data-appear]'),
              {opacity: 0, y: 28, x: 24 * fromSide, duration: 1, stagger: 0.07},
              0.3,
            );

          // In focus while it crosses the middle of the screen.
          ScrollTrigger.create({
            trigger: stop,
            start: 'top 60%',
            end: 'bottom 45%',
            toggleClass: {targets: stop, className: 'is-active'},
          });
        });

        return () => list.removeAttribute('data-focus');
      });
    },
    {scope: sectionRef},
  );

  return (
    <Container gap={0}>
      <section ref={sectionRef} aria-label={label} id="journey" className="timeline-section">
        <VStack gap={4} className="timeline-head">
          <Reveal>
            <IndexLabel>{label}</IndexLabel>
          </Reveal>
          {/* The title rises line by line out of its masks (useTextReveal). */}
          <Heading
            ref={titleRef}
            data-text-reveal
            level={2}
            textWrap="balance"
            style={{...typeRole('display-m'), letterSpacing: '-0.03em'}}>
            <Lines text={title} />
          </Heading>
          <Reveal delay={0.15}>
            <Text type="large" color="secondary" textWrap="pretty" style={{maxInlineSize: '44ch'}}>
              {supporting}
            </Text>
          </Reveal>
        </VStack>

        <VStack gap={0} className="timeline-body">
          {/* The line: a quiet track, and the blue fill that follows the scroll. */}
          <span aria-hidden className="timeline-spine" />
          <span aria-hidden className="timeline-spine timeline-spine-fill" />
          <ol className="timeline">
            {stops.map((stop, index) => (
              <TimelineStop
                key={stop.title}
                stop={stop}
                index={index}
                isLatest={index === stops.length - 1}
              />
            ))}
          </ol>
        </VStack>
      </section>
    </Container>
  );
}
