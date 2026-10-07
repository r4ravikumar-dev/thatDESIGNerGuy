'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

export type RailItem = {
  title: string;
  description: string;
  action?: {label: string; href: string};
};

/**
 * A row of open questions or explorations, side by side and divided by
 * hairlines: four across on desktop, two on tablet, stacked on phones
 * (.question-rail in globals.css).
 */
export function QuestionRail({items}: {items: readonly RailItem[]}) {
  return (
    <Grid columns={1} gap={0} className="question-rail" role="list">
      {items.map((item, index) => (
        <Reveal
          key={item.title}
          role="listitem"
          delay={0.06 * index}
          className="question-rail-item">
          <VStack gap={4} style={{blockSize: '100%'}}>
            <Text type="supporting" color="secondary" hasTabularNumbers style={EYEBROW_STYLE}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Heading
              level={3}
              textWrap="balance"
              style={{...typeRole('headline-m'), letterSpacing: '-0.01em'}}>
              {item.title}
            </Heading>
            <Text color="secondary" textWrap="pretty">
              {item.description}
            </Text>
            {item.action && (
              <VStack hAlign="start" style={{marginBlockStart: 'auto'}}>
                <CtaButton {...item.action} variant="secondary" size="md" />
              </VStack>
            )}
          </VStack>
        </Reveal>
      ))}
    </Grid>
  );
}
