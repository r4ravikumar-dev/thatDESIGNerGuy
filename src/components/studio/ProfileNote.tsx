'use client';

import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Reveal} from '@/components/motion/Reveal';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Download} from 'lucide-react';
import {CtaButton} from '@/components/navigation/CtaButton';
import {openResume} from '@/components/navigation/resume';
import {site} from '@/content/site';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Lines, accentStyle} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type ProfileNoteProps = {
  /** Section number. No longer shown: section labels read as words only. */
  index?: number;
  label: string;
  name: string;
  role: string;
  /** "*word*" sets the italic serif accent. */
  quote: string;
  bio: string;
  team: string;
  /** A link to know more about me; hidden while href is empty. */
  profile?: {label: string; href: string};
  /** The resume download under the bio. */
  resume?: {label: string};
};

/**
 * A profile, editorial style. From 1024px: the text on the left (a large
 * pull quote, then name, role and a short bio beneath it) and Ravi's
 * portrait on the right, centred against it. Stacked below 1024px: the
 * portrait leads, then the quote, then the bio (.profile-grid in
 * globals.css).
 */
export function ProfileNote({
  label,
  name,
  role,
  quote,
  bio,
  team,
  profile,
  resume,
}: ProfileNoteProps) {
  return (
    <Grid columns={1} gap={10} className="profile-grid">
      <VStack gap={6} className="profile-quote">
        <Reveal>
          <IndexLabel>{label}</IndexLabel>
        </Reveal>
        <Reveal delay={0.05} distance={32}>
          <figure style={{margin: 0}}>
            <blockquote style={{margin: 0}}>
              <Heading
                level={2}
                textWrap="balance"
                style={{
                  ...typeRole('section-title'),
                  letterSpacing: '-0.02em',
                  maxInlineSize: '26ch',
                }}>
                <span aria-hidden style={accentStyle}>
                  “
                </span>
                <Lines text={quote} />
                <span aria-hidden style={accentStyle}>
                  ”
                </span>
              </Heading>
            </blockquote>
            <figcaption>
              <VisuallyHidden>
                {name}, {role}
              </VisuallyHidden>
            </figcaption>
          </figure>
        </Reveal>
      </VStack>
      <Reveal delay={0.08} className="profile-art">
        <VStack hAlign="center">
          {/* The same portrait as the hero, blended into the page (.hero-portrait). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-portrait profile-portrait"
            src="/ravi-portrait-hero.webp"
            alt={`Portrait of ${name}`}
            width={1309}
            height={1201}
            loading="lazy"
            decoding="async"
          />
        </VStack>
      </Reveal>
      <Reveal delay={0.12} className="profile-bio">
        <VStack
          gap={5}
          style={{
            borderBlockStart: '1px solid var(--color-border)',
            paddingBlockStart: 'var(--spacing-6)',
          }}>
          <VStack gap={1}>
            <Heading level={3} style={typeRole('headline-m')}>
              {name}
            </Heading>
            <Text type="supporting" color="secondary" style={EYEBROW_STYLE}>
              {role}
            </Text>
          </VStack>
          <Text type="large" color="secondary" textWrap="pretty">
            {bio}
          </Text>
          <Text color="secondary" textWrap="pretty">
            {team}
          </Text>
          {resume && site.resumeUrl && (
            <HStack
              gap={4}
              vAlign="center"
              wrap="wrap"
              style={{paddingBlockStart: 'var(--spacing-2)'}}>
              <Button
                label={resume.label}
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openResume}
                variant="primary"
                size="lg"
                aria-label={`${resume.label} (PDF, opens in a new tab and downloads)`}
                endContent={<Icon icon={Download} size="sm" color="inherit" />}
              />
            </HStack>
          )}
          {profile?.href && (
            <HStack>
              <CtaButton
                label={profile.label}
                href={profile.href}
                variant="secondary"
                direction="out"
                isExternal
              />
            </HStack>
          )}
        </VStack>
      </Reveal>
    </Grid>
  );
}
