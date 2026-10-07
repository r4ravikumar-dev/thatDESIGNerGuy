'use client';

import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Grid} from '@astryxdesign/core/Grid';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {Lines} from '@/components/storytelling/Lines';
import {LetsTalk} from '@/components/illustrations/scenes';
import {typeRole} from '@/theme/typeScale';
import {site, callCta} from '@/content/site';
import {Chapter} from './Chapter';
import {IndexLabel} from './IndexLabel';

type BigStatementProps = {
  label?: string;
  /** "*word*" sets one word in the italic serif accent. */
  title: string;
  /** One line under the title. */
  intro?: string;
  /** A small closing line after the button. */
  note?: string;
  /** Show the Start a project button. Off on the Start a Project page itself. */
  hasProjectAction?: boolean;
};

/**
 * The closing chapter of every page, written to get a recruiter to call: one
 * large statement, the email as a giant link, the Let's talk button (a direct call
 * once a phone number is set) and the LetsTalk illustration: beside the
 * email on desktop, above the whole section on phones and tablets
 * (.big-statement-grid in globals.css).
 * No form, so the end of every page stays calm.
 */
export function BigStatement({
  label = 'Start a project',
  title,
  intro,
  note,
  hasProjectAction = true,
}: BigStatementProps) {
  return (
    <Chapter id="contact" label={label} isFullHeight>
      <Grid columns={1} gap={8} className="big-statement-grid">
        <Reveal className="big-statement-label">
          <IndexLabel>{label}</IndexLabel>
        </Reveal>
        <Reveal delay={0.05} distance={32} className="big-statement-title">
          <Heading
            level={2}
            textWrap="balance"
            style={{...typeRole('display-xl'), letterSpacing: '-0.03em', maxInlineSize: '16ch'}}>
            <Lines text={title} />
          </Heading>
          {intro && (
            <Text
              type="large"
              color="secondary"
              textWrap="pretty"
              style={{
                maxInlineSize: '40ch',
                fontWeight: 400,
                marginBlockStart: 'var(--spacing-6)',
                display: 'block',
              }}>
              {intro}
            </Text>
          )}
        </Reveal>
        <VStack gap={8} className="big-statement-text">
          <Reveal delay={0.12}>
            <Link
              href={`mailto:${site.email}`}
              className="giant-email"
              style={{
                ...typeRole('display-l'),
                // Shrinks on narrow screens so the address stays on one line.
                fontSize: 'min(var(--type-display-l-size), 5.6vw)',
                letterSpacing: '-0.03em',
                overflowWrap: 'anywhere',
              }}>
              {site.email}
            </Link>
          </Reveal>
          <Reveal delay={0.18}>
            <HStack gap={6} vAlign="center" wrap="wrap">
              {hasProjectAction && <CtaButton {...callCta} direction="out" />}
              {note && (
                <Text color="secondary" textWrap="pretty">
                  {note}
                </Text>
              )}
            </HStack>
          </Reveal>
        </VStack>
        {/* A conversation starting: first on phones and tablets, beside the email on desktop. */}
        <Reveal delay={0.1} className="big-statement-art">
          <LetsTalk label="Two speech bubbles: a message, and a reply being typed" maxWidth={340} />
        </Reveal>
      </Grid>
    </Chapter>
  );
}
