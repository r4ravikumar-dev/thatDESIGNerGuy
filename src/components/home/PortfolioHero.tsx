'use client';

import {Fragment, useRef, useState} from 'react';
import NextLink from 'next/link';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowDown} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {DesignStory} from '@/components/illustrations/DesignStory';
import {gsap, ScrollTrigger, useGSAP} from '@/motion/gsap';
import {Lines} from '@/components/storytelling/Lines';
import {Manifesto} from '@/components/editorial/Manifesto';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {hero} from '@/content/home';
import {typeRole} from '@/theme/typeScale';
import {useTextReveal} from '@/motion/scroll';

/**
 * The portfolio hero, on the page frame. Left: three blocks, each a full
 * screen tall with its content centred and built like a chapter:
 * an eyebrow label (no number), one headline on the type scale (one serif accent), then
 * supporting text. 01 the name in three scripts, 02 the one-line intro
 * (its words light up as it scrolls),
 * 03 the story. Right, pinned while the three blocks scroll past: Ravi's
 * portrait for the first fold, blending into the panel; as the intro scrolls in it
 * cross-fades to the design story (DesignStory, a Lottie animation of
 * Ravi's cursor turning scattered ideas into a finished screen), which then
 * plays on its own from the start and loops; scrolling back up brings the
 * photo back.
 *
 * Below 1024px the photo leads, the blocks stack and the design story sits
 * above the intro, playing while it is on screen (.portfolio-hero in
 * globals.css). With reduced motion the story holds its finished screen.
 */
const DESKTOP = '(min-width: 1024px)';
const STORY_LABEL =
  "Ravi's cursor arrives on a design canvas, gathers scattered ideas into a structured row, then builds a finished screen from them";

export function PortfolioHero() {
  const {hello, intro, story} = hero;
  const storyTitleRef = useTextReveal({delay: 0.05});
  const heroRef = useRef<HTMLElement>(null);

  // Desktop: the panel shows the photo for the first fold, then the design
  // story once the intro scrolls in (and the photo again on the way back).
  // The scroll only makes the swap; the story then plays on its own.
  const [isStory, setIsStory] = useState(false);

  useGSAP(
    () => {
      const section = heroRef.current;
      const intro = section?.querySelector('[data-hero-block="intro"]');
      if (!intro) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        ScrollTrigger.create({
          trigger: intro,
          start: 'top 60%',
          onEnter: () => setIsStory(true),
          onLeaveBack: () => setIsStory(false),
        });
        return () => setIsStory(false);
      });
    },
    {scope: heroRef},
  );

  return (
    <Container gap={0}>
      <section ref={heroRef} className="portfolio-hero" aria-label="Introduction">
        <VStack gap={0} className="portfolio-hero-text">
          {/* 01 Hello: the name in three scripts, the role and a scroll cue. */}
          <VStack className="portfolio-hero-block" vAlign="center">
            <VStack gap={6}>
              <Reveal>
                <IndexLabel>{hello.label}</IndexLabel>
              </Reveal>
              <Reveal delay={0.05} distance={32}>
                <Heading
                  level={1}
                  className="portfolio-hero-names"
                  style={{
                    ...typeRole('display-l'),
                    // 64px on desktop (.portfolio-hero-names), the scale's display-l below.
                    fontSize: 'var(--hero-name-size, var(--type-display-l-size))',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.3,
                  }}>
                  {hello.names.map((name, index) => (
                    <Fragment key={name.lang}>
                      {/* Each name stays in one piece with its dot, so lines
                          only break after a dot, never before one. */}
                      <span className="portfolio-hero-name" lang={name.lang}>
                        {/* Desktop splits the Hindi name across the two lines:
                            "Ravi Kumar • रवि" / "कुमार • ರವಿ ಕುಮಾರ್"
                            (.portfolio-hero-break). Elsewhere it stays whole. */}
                        {name.lang === 'hi' ? (
                          <>
                            {name.text.split(' ')[0]} <br className="portfolio-hero-break" />
                            {name.text.split(' ').slice(1).join(' ')}
                          </>
                        ) : (
                          name.text
                        )}
                        {index < hello.names.length - 1 && (
                          <span aria-hidden className="portfolio-hero-dot">
                            {'\u00a0•'}
                          </span>
                        )}
                      </span>
                      {index < hello.names.length - 1 && ' '}
                    </Fragment>
                  ))}
                </Heading>
              </Reveal>
              {/* The signature line and what Ravi works on. */}
              <Reveal delay={0.1}>
                <VStack gap={3}>
                  <Text
                    as="p"
                    textWrap="balance"
                    style={{
                      ...typeRole('headline-m'),
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      maxInlineSize: '22ch',
                    }}>
                    <Lines text={hello.headline} />
                  </Text>
                  <Text
                    type="large"
                    color="secondary"
                    textWrap="pretty"
                    style={{maxInlineSize: '40ch'}}>
                    {hello.supporting}
                  </Text>
                </VStack>
              </Reveal>
              <Reveal delay={0.2}>
                <HStack vAlign="center" className="portfolio-hero-scroll" aria-hidden>
                  {/* The arrow keeps nudging down. */}
                  <HStack gap={2} vAlign="center">
                    <Text type="supporting" style={{...EYEBROW_STYLE, color: 'inherit'}}>
                      {hello.scroll}
                    </Text>
                    <span className="portfolio-hero-scroll-arrow">
                      <Icon icon={ArrowDown} size="sm" color="inherit" />
                    </span>
                  </HStack>
                </HStack>
              </Reveal>
            </VStack>
          </VStack>

          {/* 02 In short: one display line, its accent in the serif. Phones
            and tablets: the design story leads it. */}
          <VStack className="portfolio-hero-block" vAlign="center" data-hero-block="intro">
            <VStack className="hero-story-inline" hAlign="center">
              <DesignStory label={STORY_LABEL} />
            </VStack>
            <VStack gap={6}>
              <Reveal>
                <IndexLabel>{intro.label}</IndexLabel>
              </Reveal>
              <Manifesto text={intro.text} level="p" align="start" maxWidth={16} litBy="72%" />
            </VStack>
          </VStack>

          {/* 03 So far: a headline, then the story. */}
          <VStack className="portfolio-hero-block" vAlign="center" data-hero-block="story">
            <VStack gap={6}>
              <Reveal>
                <IndexLabel>{story.label}</IndexLabel>
              </Reveal>
              {/* The title rises line by line out of its masks (useTextReveal). */}
              <Heading
                ref={storyTitleRef}
                data-text-reveal
                level={2}
                textWrap="balance"
                style={{
                  ...typeRole('headline-xl'),
                  letterSpacing: '-0.02em',
                  maxInlineSize: '18ch',
                }}>
                <Lines text={story.title} />
              </Heading>
              <Reveal delay={0.1}>
                <VStack gap={4} style={{maxInlineSize: '44ch'}}>
                  {story.paragraphs.map(paragraph => (
                    <Text key={paragraph} type="large" color="secondary" textWrap="pretty">
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Reveal>
            </VStack>
          </VStack>
        </VStack>
        {/* The pinned panel: the photo, then (from 1024px) the design story in its place. */}
        <VStack
          className={isStory ? 'portfolio-hero-photo is-story' : 'portfolio-hero-photo'}
          hAlign="center"
          vAlign="center">
          <VStack className="hero-art hero-art-photo" hAlign="center" vAlign="center">
            {/* Ravi's portrait, blending into the panel (.hero-portrait). It
              leads to the About page; over it the cursor becomes the
              Figma-style pointer reading "Know more about Ravi". */}
            <NextLink
              href={hello.portraitAction.href}
              className="hero-portrait-link"
              aria-label={hello.portraitAction.label}
              data-cursor="project"
              data-cursor-label={hello.portraitAction.label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-portrait"
                src="/ravi-portrait-hero.webp"
                alt="Portrait of Ravi Kumar"
                width={1309}
                height={1201}
                fetchPriority="high"
                decoding="async"
              />
            </NextLink>
          </VStack>
          <VStack className="hero-art hero-art-story" hAlign="center" vAlign="center">
            <DesignStory label={STORY_LABEL} isShown={isStory} />
          </VStack>
        </VStack>
      </section>
    </Container>
  );
}
