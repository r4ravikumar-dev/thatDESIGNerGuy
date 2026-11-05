'use client';

import {useLayoutEffect, useState} from 'react';
import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {typeRole} from '@/theme/typeScale';
import {useVelocitySkew} from '@/motion/scroll';

/** How much faster than the page the line slides: 1.75 means 175px left per 100px scrolled. */
const SPEED = 1.75;

/**
 * A single line of large phrases that slides sideways as the page scrolls,
 * 1.75x faster than the scroll itself, for a parallax feel. It moves only
 * with the reader's scroll, never on its own, so there is nothing to pause.
 * The phrases repeat so the line never runs out. Reduced motion shows the
 * phrases once, as a wrapped list. Fast scrolling leans the line into the
 * motion (GSAP, by scroll velocity) before it settles upright.
 */
export function Marquee({items}: {items: readonly string[]}) {
  // Leans with the scroll's speed, then settles upright (useVelocitySkew).
  const ref = useVelocitySkew<HTMLDivElement>(8);
  const reduceMotion = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  // The scroll range runs from the line entering at the bottom to leaving at
  // the top: one screen plus the line's own height.
  const [range, setRange] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setRange(window.innerHeight + node.offsetHeight);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref]);
  const x = useTransform(scrollYProgress, [0, 1], [0, -SPEED * range]);
  const copies = reduceMotion ? 1 : 3;

  return (
    <VStack
      ref={ref}
      gap={0}
      role="list"
      style={{
        overflow: 'hidden',
        // A quiet line between sections. Above: block spacing, in place of the
        // chapter's larger gap.
        marginBlockStart: 'calc(var(--space-block) - var(--space-chapter-gap))',
        // Below: the chapter gap to the next section's label, absorbing this
        // chapter's closing padding and the next one's opening padding.
        marginBlockEnd: 'calc(var(--space-chapter-gap) - 2 * var(--space-section))',
      }}>
      <motion.span
        style={{
          x: reduceMotion ? 0 : x,
          display: 'flex',
          flexWrap: reduceMotion ? 'wrap' : 'nowrap',
          gap: 'var(--spacing-8)',
          whiteSpace: reduceMotion ? 'normal' : 'nowrap',
        }}>
        {Array.from({length: copies}, (_, copy) =>
          items.map((item, index) => (
            <Text
              key={`${copy}-${item}`}
              role={copy === 0 ? 'listitem' : undefined}
              aria-hidden={copy === 0 ? undefined : true}
              style={{...typeRole('label-xl'), fontWeight: 500, letterSpacing: '-0.01em'}}
              color={(copy * items.length + index) % 2 === 0 ? 'primary' : 'secondary'}>
              {item}
            </Text>
          )),
        )}
      </motion.span>
    </VStack>
  );
}
