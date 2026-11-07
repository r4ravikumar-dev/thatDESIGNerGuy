'use client';

import {useRef, type CSSProperties} from 'react';
import {
  BookOpen,
  ClipboardCheck,
  Component,
  GitBranch,
  Layers,
  LayoutGrid,
  Lightbulb,
  MousePointerClick,
  Network,
  Palette,
  Route,
  ScanSearch,
  Search,
  Shapes,
  Smartphone,
  Sparkles,
  ToggleRight,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {Glyph} from '@/components/illustrations/glyphs';
import {EASE, gsap, useGSAP} from '@/motion/gsap';
import {typeRole} from '@/theme/typeScale';
import type {CoverIcon, Discipline} from '@/content/home';

const ICONS: Record<CoverIcon, LucideIcon> = {
  search: Search,
  idea: Lightbulb,
  layers: Layers,
  route: Route,
  network: Network,
  check: ClipboardCheck,
  palette: Palette,
  grid: LayoutGrid,
  phone: Smartphone,
  pointer: MousePointerClick,
  toggle: ToggleRight,
  sparkles: Sparkles,
  scan: ScanSearch,
  branch: GitBranch,
  workflow: Workflow,
  shapes: Shapes,
  component: Component,
  book: BookOpen,
};

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Scroll shares in the pinned timeline: sliding to the next card, then resting on it. */
const MOVE = 1;
const HOLD = 0.6;

/**
 * One full-screen card, built like a spec sheet:
 * - the big numeral cropped by the first hairline
 * - the title and the description
 * - a second hairline, then what the discipline covers: icon over label
 * - the discipline's illustration, large, filling the other half
 * Phones and tablets: illustration on top, content under it.
 */
function DeckCard({item, index}: {item: Discipline; index: number}) {
  const number = String(index + 1).padStart(2, '0');
  return (
    <li className="deck-card" aria-label={`${number} ${item.title}`}>
      <VStack className="deck-card-content" gap={0} justify="center">
        <span aria-hidden className="deck-numeral">
          <span className="deck-numeral-digits">{number}</span>
        </span>
        <span aria-hidden className="deck-rule" />

        <VStack gap={4} className="deck-card-text">
          <Heading
            level={3}
            textWrap="balance"
            data-appear
            style={{
              ...typeRole('headline-xl'),
              fontWeight: 400,
              letterSpacing: '-0.02em',
              // The discipline's name in the brand blue (the accessible text blue).
              color: 'var(--color-brand-text)',
            }}>
            {item.title}
          </Heading>
          <Text
            type="large"
            color="secondary"
            textWrap="pretty"
            data-appear
            style={{maxInlineSize: '34ch'}}>
            {item.description}
          </Text>
        </VStack>

        <span aria-hidden className="deck-rule" />

        <HStack gap={6} vAlign="start" className="deck-covers">
          <Text type="supporting" color="secondary" className="deck-covers-label" data-appear>
            Covers
          </Text>
          <ul className="deck-covers-list">
            {item.covers.map(cover => (
              <li key={cover.label} data-appear>
                <VStack gap={2} hAlign="center">
                  <Icon icon={ICONS[cover.icon]} size="md" color="inherit" />
                  <Text type="supporting" color="secondary" style={{textAlign: 'center'}}>
                    {cover.label}
                  </Text>
                </VStack>
              </li>
            ))}
          </ul>
        </HStack>
      </VStack>

      <VStack className="deck-card-art" hAlign="center" vAlign="center">
        <Glyph name={item.glyph} size={null} />
      </VStack>
    </li>
  );
}

/**
 * What I do, as a deck of full-screen cards. The stage pins under the site
 * header (position: sticky inside a tall track, .deck in globals.css) and
 * the vertical scroll slides the cards in from the right, one after another,
 * resting on each before the next arrives.
 *
 * Each card builds as it arrives, tied to the scroll: the numeral rises out
 * of its hairline, the rules draw, the illustration settles in, then the
 * text and the covers row rise in turn. Scrolling back plays it in reverse.
 *
 * The horizontal deck needs motion-ok (set on <html> before paint); with
 * reduced motion or without JavaScript the cards simply stack, one per row.
 */
export function DisciplineDeck({items, label}: {items: readonly Discipline[]; label: string}) {
  const deckRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const deck = deckRef.current;
      if (!deck) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const stage = deck.querySelector<HTMLElement>('.deck-stage');
        const track = deck.querySelector<HTMLElement>('.deck-track');
        const cards = gsap.utils.toArray<HTMLElement>('.deck-card', deck);
        if (!stage || !track) return;

        /** Builds one card's entrance into `timeline`, starting at `at`. */
        const build = (card: HTMLElement, timeline: gsap.core.Timeline, at: number) => {
          const q = gsap.utils.selector(card);
          timeline
            .from(q('.deck-numeral-digits'), {yPercent: 105, duration: 0.6, ease: EASE.arrive}, at)
            .from(
              q('.deck-rule'),
              {scaleX: 0, duration: 0.6, stagger: 0.08, ease: EASE.wipe},
              at + 0.05,
            )
            .from(
              q('.deck-card-art'),
              {opacity: 0, scale: 0.86, duration: 0.7, ease: EASE.arrive},
              at + 0.1,
            )
            .from(
              q('[data-appear]'),
              {opacity: 0, y: 24, duration: 0.5, stagger: 0.04, ease: EASE.arrive},
              at + 0.2,
            );
        };

        // The first card builds once, as the deck comes into view.
        const first = gsap.timeline({
          scrollTrigger: {trigger: stage, start: 'top 70%', once: true},
        });
        if (cards[0]) build(cards[0], first, 0);
        first.timeScale(0.55);

        // The pinned scroll: rest, slide, rest, slide… tied to the scroll.
        const headerOffset = () => parseFloat(getComputedStyle(stage).top) || 0;
        const deckTimeline = gsap.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: deck,
            start: () => `top ${headerOffset()}px`,
            end: 'bottom bottom',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        deckTimeline.to({}, {duration: HOLD / 2});
        cards.forEach((card, index) => {
          if (index === 0) return;
          const at = deckTimeline.duration();
          deckTimeline.to(
            track,
            {x: () => -index * stage.clientWidth, duration: MOVE, ease: 'power2.inOut'},
            at,
          );
          build(card, deckTimeline, at + MOVE * 0.35);
          deckTimeline.to({}, {duration: HOLD}, at + MOVE);
        });
      });
    },
    {scope: deckRef},
  );

  return (
    <section
      ref={deckRef}
      aria-label={label}
      className="deck"
      style={{'--deck-count': items.length} as CSSProperties}>
      <VStack gap={0} className="deck-stage">
        <ol className="deck-track">
          {items.map((item, index) => (
            <DeckCard key={item.title} item={item} index={index} />
          ))}
        </ol>
      </VStack>
    </section>
  );
}
