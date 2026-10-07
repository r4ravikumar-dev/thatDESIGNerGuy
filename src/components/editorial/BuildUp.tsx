'use client';

import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Reveal} from '@/components/motion/Reveal';
import {Lines} from '@/components/storytelling/Lines';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type BuildUpProps = {
  /** The layers, in the order they pile up. */
  layers: readonly string[];
  /** The answer once the layers are named, one line per "\n"; "*word*" sets the accent. */
  resolution: string;
  /** The eyebrow before each row number, e.g. "Layer" or "Question". */
  label?: string;
};

const labelStyle = EYEBROW_STYLE;

/**
 * Complexity told as layers: each line arrives as a hairline row, stepped a
 * little further in than the last so the text itself stacks up (the step
 * size is --layer-indent in globals.css). Then one large answer.
 */
export function BuildUp({layers, resolution, label = 'Layer'}: BuildUpProps) {
  const resolutionLines = resolution.split('\n');
  return (
    <VStack gap={0} style={{gap: 'var(--space-chapter-gap)'}}>
      <VStack gap={0} role="list" className="build-up">
        {layers.map((layer, index) => (
          <Reveal
            key={layer}
            role="listitem"
            delay={0.08 * index}
            distance={24}
            style={{
              marginInlineStart: `calc(${index} * var(--layer-indent))`,
              borderBlockStart: '1px solid var(--color-border)',
              paddingBlock: 'var(--spacing-6)',
            }}>
            <HStack gap={0} className="build-up-row">
              <Text
                type="supporting"
                color="secondary"
                hasTabularNumbers
                style={{...labelStyle, flexShrink: 0}}>
                {label} {String(index + 1).padStart(2, '0')}
              </Text>
              <Text
                textWrap="balance"
                style={{...typeRole('headline-l'), letterSpacing: '-0.02em'}}>
                {layer}
              </Text>
            </HStack>
          </Reveal>
        ))}
      </VStack>
      <Reveal distance={32}>
        <Heading level={3} style={{...typeRole('display-m'), letterSpacing: '-0.03em'}}>
          {/* Earlier lines recede; the last line carries the weight. */}
          {resolutionLines.map((line, index) => (
            <span
              key={line}
              style={{
                display: 'block',
                color:
                  index < resolutionLines.length - 1 ? 'var(--color-text-secondary)' : undefined,
              }}>
              <Lines text={line} />
            </span>
          ))}
        </Heading>
      </Reveal>
    </VStack>
  );
}
