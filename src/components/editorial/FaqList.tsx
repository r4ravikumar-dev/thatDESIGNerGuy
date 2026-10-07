'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Lines} from '@/components/storytelling/Lines';
import {IndexList} from './IndexList';

/**
 * One question and its answer as short paragraphs: the direct answer first
 * (set in ink), then a useful clarification and, where it helps, a next step.
 */
export type Faq = {question: string; answer: readonly string[]};

/** Questions as expandable hairline rows, one open at a time. */
export function FaqList({items}: {items: readonly Faq[]}) {
  return (
    <IndexList
      isNumbered={false}
      size="medium"
      items={items.map(item => ({
        title: item.question,
        detail: (
          <VStack gap={3} style={{maxInlineSize: '60ch'}}>
            {item.answer.map((paragraph, index) => (
              <Text
                key={paragraph}
                type="large"
                color={index === 0 ? 'primary' : 'secondary'}
                textWrap="pretty">
                <Lines text={paragraph} />
              </Text>
            ))}
          </VStack>
        ),
      }))}
    />
  );
}
