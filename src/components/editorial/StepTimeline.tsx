'use client';

import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Reveal} from '@/components/motion/Reveal';
import {typeRole} from '@/theme/typeScale';

type Step = {title: string; description: string};

/**
 * An ordered process, one step per screen-ish row: a large outlined numeral,
 * the step name and one line. Each step springs in as it is reached, so the
 * sequence is paced by scrolling rather than a timer.
 */
export function StepTimeline({steps}: {steps: Step[]}) {
  return (
    <VStack gap={0} role="list">
      {steps.map((step, index) => (
        <Reveal key={step.title} role="listitem" distance={40}>
          <HStack
            gap={0}
            vAlign="start"
            className="step-row"
            style={{
              borderBlockStart: '1px solid var(--color-border)',
              paddingBlock: 'var(--space-block)',
            }}>
            <Text aria-hidden hasTabularNumbers className="step-numeral">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <VStack gap={3} style={{flex: '1 1 0', minInlineSize: 0}}>
              <Heading level={3} style={{...typeRole('display-s'), letterSpacing: '-0.02em'}}>
                {step.title}
              </Heading>
              <Text
                type="large"
                color="secondary"
                textWrap="pretty"
                style={{maxInlineSize: '40ch'}}>
                {step.description}
              </Text>
            </VStack>
          </HStack>
        </Reveal>
      ))}
    </VStack>
  );
}
