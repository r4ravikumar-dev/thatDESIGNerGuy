'use client';

import {Fragment} from 'react';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowDown} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {Portrait} from '@/components/illustrations/scenes';
import {Lines} from '@/components/storytelling/Lines';
import {Manifesto} from '@/components/editorial/Manifesto';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {hero} from '@/content/home';
import {typeRole} from '@/theme/typeScale';

/**
 * The portfolio hero, on the page frame. Left: three blocks, each a full
 * screen tall with its content centred and built like a chapter:
 * an eyebrow label (no number), one headline on the type scale (one serif accent), then
 * supporting text. 01 the name in three scripts, 02 the one-line intro
 * (its words light up as it scrolls),
 * 03 the story. Right: Ravi's photo in the brand duotone,
 * pinned while the three blocks scroll past, then the hero scrolls away.
 * Below 1024px the photo leads and the blocks stack (.portfolio-hero in
 * globals.css).
 */
export function PortfolioHero() {
  const {hello, intro, story} = hero;

  return (
    <Container gap={0}>
      <section className="portfolio-hero" aria-label="Introduction">
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
              <Reveal delay={0.1}>
                <Text type="large" color="secondary">
                  {hello.role}
                </Text>
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

          {/* 02 In short: one display line, its accent in the serif. */}
          <VStack className="portfolio-hero-block" vAlign="center">
            <VStack gap={6}>
              <Reveal>
                <IndexLabel>{intro.label}</IndexLabel>
              </Reveal>
              <Manifesto text={intro.text} level="p" align="start" maxWidth={16} litBy="72%" />
            </VStack>
          </VStack>

          {/* 03 So far: a headline, then the story. */}
          <VStack className="portfolio-hero-block" vAlign="center">
            <VStack gap={6}>
              <Reveal>
                <IndexLabel>{story.label}</IndexLabel>
              </Reveal>
              <Reveal delay={0.05} distance={32}>
                <Heading
                  level={2}
                  textWrap="balance"
                  style={{
                    ...typeRole('headline-xl'),
                    letterSpacing: '-0.02em',
                    maxInlineSize: '18ch',
                  }}>
                  <Lines text={story.title} />
                </Heading>
              </Reveal>
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
        <VStack className="portfolio-hero-photo" hAlign="center" vAlign="center">
          <Portrait label="Portrait of Ravi Kumar" maxWidth={720} />
        </VStack>
      </section>
    </Container>
  );
}
