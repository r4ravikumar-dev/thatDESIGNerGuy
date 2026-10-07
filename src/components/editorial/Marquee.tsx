'use client';

import {useRef} from 'react';
import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {typeRole} from '@/theme/typeScale';

/**
 * A single line of large phrases that slides sideways as the page scrolls.
 * It moves only with the reader's scroll, never on its own, so there is
 * nothing to pause. Reduced motion shows the phrases as a wrapped list.
 */
export function Marquee({items}: {items: readonly string[]}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-46%']);

  return (
    <VStack ref={ref} gap={0} style={{overflow: 'hidden'}} role="list">
      <motion.span
        style={{
          x: reduceMotion ? 0 : x,
          display: 'flex',
          flexWrap: reduceMotion ? 'wrap' : 'nowrap',
          gap: 'var(--spacing-10)',
          whiteSpace: reduceMotion ? 'normal' : 'nowrap',
        }}>
        {items.map((item, index) => (
          <Text
            key={item}
            role="listitem"
            style={{...typeRole('display-l'), letterSpacing: '-0.02em'}}
            color={index % 2 === 0 ? 'primary' : 'secondary'}>
            {item}
          </Text>
        ))}
      </motion.span>
    </VStack>
  );
}
