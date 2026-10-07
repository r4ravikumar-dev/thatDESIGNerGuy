'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {ScriptNames} from '@/components/editorial/ScriptNames';
import {DesignerDesk} from '@/components/illustrations/scenes';
import {Lines} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {aboutSection} from '@/content/home';

/**
 * About, after Work: "About" in three scripts and the supporting line, a
 * lead paragraph (its accent word in the serif) and the story, beside the
 * desk illustration. From 1024px text left, illustration right;
 * below that the illustration leads, as on every section.
 */
export function AboutSection() {
  const {label, names, supporting, lead, body} = aboutSection;
  return (
    <Container gap={0}>
      <section aria-label={label} id="about" className="about-section">
        <VStack gap={6} className="about-section-text">
          <Reveal>
            <ScriptNames names={names} role="display-l" />
          </Reveal>
          <Reveal delay={0.05}>
            <Text
              type="large"
              color="secondary"
              textWrap="pretty"
              style={{maxInlineSize: '40ch', fontWeight: 400}}>
              {supporting}
            </Text>
          </Reveal>
          <Reveal delay={0.1} distance={32}>
            <Text
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
          </Reveal>
          <Reveal delay={0.15}>
            <Text
              type="large"
              color="secondary"
              textWrap="pretty"
              style={{maxInlineSize: '52ch', fontWeight: 400}}>
              {body}
            </Text>
          </Reveal>
        </VStack>
        <Reveal className="about-section-art" hAlign="center">
          <DesignerDesk label="A desk with a phone, a coffee and a sticky note with a question mark" />
        </Reveal>
      </section>
    </Container>
  );
}
