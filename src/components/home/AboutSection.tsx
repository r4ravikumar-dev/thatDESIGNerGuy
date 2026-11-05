'use client';

import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {Parallax} from '@/components/motion/Parallax';
import {useTextReveal} from '@/motion/scroll';
import {ScriptNames} from '@/components/editorial/ScriptNames';
import {DesignerDesk} from '@/components/illustrations/scenes';
import {Lines} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {aboutSection} from '@/content/home';

/**
 * About, after Work: "About" in three scripts and the supporting line, a
 * lead paragraph (its accent word in the serif) and the story, beside the
 * desk illustration, then the way on to the About page. From 1024px text
 * left, illustration right, half and half; below that the illustration
 * leads, as on every section.
 */
export function AboutSection() {
  const {label, names, supporting, lead, body, action} = aboutSection;
  const leadRef = useTextReveal<HTMLParagraphElement>({delay: 0.1, stagger: 0.07});
  return (
    <Container gap={0}>
      <section aria-label={label} id="about" className="about-section">
        <VStack gap={6} className="about-section-text">
          <Reveal>
            <ScriptNames names={names} role="display-l" />
          </Reveal>
          <Reveal delay={0.05}>
            <Text type="large" color="secondary" textWrap="pretty" style={{maxInlineSize: '40ch'}}>
              {supporting}
            </Text>
          </Reveal>
          {/* The lead rises line by line out of its masks (useTextReveal). */}
          <Text
            ref={leadRef}
            data-text-reveal
            as="p"
            textWrap="pretty"
            style={{
              ...typeRole('headline-m'),
              fontWeight: 500,
              letterSpacing: '-0.01em',
              maxInlineSize: '30ch',
              marginBlockStart: 'var(--spacing-6)',
            }}>
            <Lines text={lead} />
          </Text>
          <Reveal delay={0.15}>
            <Text type="large" color="secondary" textWrap="pretty" style={{maxInlineSize: '52ch'}}>
              {body}
            </Text>
          </Reveal>
          {/* On to the full story. */}
          <Reveal delay={0.2} style={{marginBlockStart: 'var(--spacing-4)'}}>
            <HStack>
              <CtaButton {...action} variant="secondary" direction="forward" />
            </HStack>
          </Reveal>
        </VStack>
        <Reveal className="about-section-art" hAlign="center">
          <Parallax amount={10} style={{inlineSize: '100%'}}>
            <DesignerDesk
              label="A desk with a phone, a coffee and a sticky note with a question mark"
              maxWidth={600}
            />
          </Parallax>
        </Reveal>
      </section>
    </Container>
  );
}
