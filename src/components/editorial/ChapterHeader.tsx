'use client';

import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Reveal} from '@/components/motion/Reveal';
import {Lines} from '@/components/storytelling/Lines';
import {useTextReveal} from '@/motion/scroll';
import {typeRole, type TypeRole} from '@/theme/typeScale';
import {IndexLabel} from './IndexLabel';

type ChapterHeaderProps = {
  index?: number;
  label?: string;
  /** Use "\n" for a line break and "*word*" for the italic serif accent. */
  title: string;
  /** A short intro, set to the right of the page on wide screens. */
  intro?: string;
  /** 1 when this header opens the page. */
  level?: 1 | 2;
  /** The shared section headline size by default (section-title). */
  size?: Extract<TypeRole, 'section-title' | 'display-xxl' | 'display-xl' | 'display-l' | 'display-m'>;
};

/**
 * Opens a chapter: index label, one very large title, and an optional short
 * intro pushed to the right. The scale contrast is the point.
 */
export function ChapterHeader({
  index,
  label,
  title,
  intro,
  level = 2,
  size = 'section-title',
}: ChapterHeaderProps) {
  const titleRef = useTextReveal({delay: 0.05});
  return (
    <VStack gap={6}>
      {label && (
        <Reveal>
          <IndexLabel index={index}>{label}</IndexLabel>
        </Reveal>
      )}
      {/* The title rises line by line out of its masks (useTextReveal). */}
      <Heading
        ref={titleRef}
        data-text-reveal
        level={level}
        textWrap="balance"
        style={{...typeRole(size), letterSpacing: '-0.03em', maxInlineSize: '30ch'}}>
        <Lines text={title} />
      </Heading>
      {intro && (
        <HStack justify="end">
          <Reveal delay={0.12} maxWidth={520}>
            <Text type="large" color="secondary" textWrap="pretty">
              <Lines text={intro} />
            </Text>
          </Reveal>
        </HStack>
      )}
    </VStack>
  );
}
