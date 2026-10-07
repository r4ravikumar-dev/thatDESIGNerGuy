'use client';

import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Reveal} from '@/components/motion/Reveal';
import {Portrait} from '@/components/illustrations/scenes';
import {CtaButton} from '@/components/navigation/CtaButton';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Lines, accentStyle} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type ProfileNoteProps = {
  index: number;
  label: string;
  name: string;
  role: string;
  /** "*word*" sets the italic serif accent. */
  quote: string;
  bio: string;
  team: string;
  /** A link to know more about me; hidden while href is empty. */
  profile?: {label: string; href: string};
};

/**
 * A profile, editorial style: a large pull quote on the left; on the right
 * Ravi's photo in the brand duotone, then name, role and a short bio. When
 * stacked below 1024px the photo leads, then the quote, then the bio
 * (.profile-grid in globals.css).
 */
export function ProfileNote({
  index,
  label,
  name,
  role,
  quote,
  bio,
  team,
  profile,
}: ProfileNoteProps) {
  return (
    <Grid columns={1} gap={10} className="profile-grid">
      <VStack gap={6} className="profile-quote">
        <Reveal>
          <IndexLabel index={index}>{label}</IndexLabel>
        </Reveal>
        <Reveal delay={0.05} distance={32}>
          <figure style={{margin: 0}}>
            <blockquote style={{margin: 0}}>
              <Heading
                level={2}
                textWrap="balance"
                style={{...typeRole('display-m'), letterSpacing: '-0.02em'}}>
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
        <VStack hAlign="start">
          <Portrait label={`Portrait of ${name}`} maxWidth={360} />
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
