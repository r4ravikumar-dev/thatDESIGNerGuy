'use client';

import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {caseStudies, workEmpty} from '@/content/work';
import {typeRole} from '@/theme/typeScale';
import {IndexList} from './IndexList';

/**
 * Case studies as editorial rows. Until there is at least one, an honest
 * note and a link to the thinking stand in, rather than placeholder work.
 */
export function WorkList({limit}: {limit?: number}) {
  const items = limit ? caseStudies.slice(0, limit) : caseStudies;

  if (items.length === 0) {
    return (
      <Reveal>
        <VStack
          gap={4}
          style={{
            borderBlockStart: '1px solid var(--color-border)',
            paddingBlockStart: 'var(--spacing-8)',
            maxInlineSize: '44rem',
          }}>
          <Heading level={3} style={typeRole('headline-l')}>
            {workEmpty.title}
          </Heading>
          <Text type="large" color="secondary" textWrap="pretty">
            {workEmpty.description}
          </Text>
          <HStack>
            <CtaButton {...workEmpty.action} variant="secondary" direction="out" isExternal />
          </HStack>
        </VStack>
      </Reveal>
    );
  }

  return (
    <IndexList
      items={items.map(item => ({title: item.title, summary: item.summary, href: item.href}))}
    />
  );
}
