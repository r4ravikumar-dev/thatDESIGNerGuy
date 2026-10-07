'use client';

import type {ReactNode} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {Lines} from '@/components/storytelling/Lines';
import {Container} from '@/components/layout/Container';
import {typeRole} from '@/theme/typeScale';
import {IndexLabel} from './IndexLabel';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type HeroAction = {label: string; href: string; direction?: 'forward' | 'down' | 'out'};

type EditorialHeroProps = {
  label?: string;
  /** "*word*" sets one word in the italic serif accent; "\n" breaks a line. */
  title: string;
  description?: string;
  action?: HeroAction;
  /** Short facts along the bottom edge, e.g. disciplines. */
  meta?: readonly string[];
  /** An illustration shown beside the description on wide screens. */
  illustration?: ReactNode;
  /** Display XXL for the homepage, Display XL for inner pages. */
  size?: 'display-xxl' | 'display-xl';
  /** Fill the viewport (homepage) or sit at natural height (inner pages). */
  isFullHeight?: boolean;
};

/**
 * Left-aligned editorial hero: one very large title, one sentence, one
 * action, and a quiet meta row along the bottom. Space does the work. With
 * an illustration, the text block (label, title, description, action) sits
 * on the left and the illustration on the right, vertically centred against
 * each other from 1024px (.hero-split in globals.css); below that they stack.
 */
export function EditorialHero({
  label,
  title,
  description,
  action,
  meta,
  illustration,
  size = 'display-xl',
  isFullHeight = false,
}: EditorialHeroProps) {
  return (
    <VStack
      as="header"
      gap={0}
      justify="between"
      style={{
        minHeight: isFullHeight
          ? 'calc(100svh - var(--nav-padding-block) * 2 - var(--size-element-lg))'
          : undefined,
        paddingBlockStart: 'var(--space-chapter-gap)',
        paddingBlockEnd: 'var(--space-block)',
      }}>
      <Container gap={0} style={{flex: 1}}>
        <Grid
          columns={1}
          className={illustration ? 'hero-split' : undefined}
          style={{flex: 1, alignContent: 'center', gap: 'var(--space-block)'}}>
          <VStack gap={0} style={{gap: 'var(--space-block)'}}>
            {label && (
              <Reveal>
                <IndexLabel>{label}</IndexLabel>
              </Reveal>
            )}
            <Reveal delay={0.05} distance={40}>
              <Heading
                level={1}
                textWrap="balance"
                style={{...typeRole(size), letterSpacing: '-0.04em', maxInlineSize: '14ch'}}>
                <Lines text={title} />
              </Heading>
            </Reveal>
            {(description || action) && (
              <VStack gap={6}>
                {description && (
                  <Reveal delay={0.15}>
                    <Text
                      type="large"
                      color="secondary"
                      textWrap="pretty"
                      style={{maxInlineSize: '36ch'}}>
                      <Lines text={description} />
                    </Text>
                  </Reveal>
                )}
                {action && (
                  <Reveal delay={0.22}>
                    <HStack>
                      <CtaButton {...action} />
                    </HStack>
                  </Reveal>
                )}
              </VStack>
            )}
          </VStack>
          {illustration && (
            <Reveal delay={0.1} hAlign="end">
              {illustration}
            </Reveal>
          )}
        </Grid>
      </Container>
      {meta && meta.length > 0 && (
        <Container gap={0}>
          <Reveal delay={0.3}>
            <HStack
              gap={6}
              wrap="wrap"
              justify="between"
              className="hero-meta"
              style={{
                borderBlockStart: '1px solid var(--color-border)',
                paddingBlockStart: 'var(--spacing-4)',
                marginBlockStart: 'var(--space-block)',
              }}>
              {meta.map(item => (
                <Text key={item} type="supporting" color="secondary" style={EYEBROW_STYLE}>
                  {item}
                </Text>
              ))}
            </HStack>
          </Reveal>
        </Container>
      )}
    </VStack>
  );
}
