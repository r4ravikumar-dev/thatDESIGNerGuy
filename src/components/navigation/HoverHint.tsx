'use client';

import {useState, type ReactNode} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Text} from '@astryxdesign/core/Text';
import {MotionHStack} from '@/components/motion/Motion';
import {accentStyle} from '@/components/storytelling/Lines';
import {expressive, springs} from '@/motion/springs';

type HoverHintProps = {
  /** The quiet line shown on hover or keyboard focus, e.g. "What we make". */
  hint: string;
  children: ReactNode;
};

/**
 * Shows a small supporting line under a navigation item while it is hovered or
 * focused, in the brand's italic serif accent and brand blue. The label never changes; only this hint springs in beneath it.
 * The hint is decorative (aria-hidden); items carry their own description.
 */
export function HoverHint({hint, children}: HoverHintProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <MotionHStack
      onHoverStart={() => setIsShown(true)}
      onHoverEnd={() => setIsShown(false)}
      onFocus={() => setIsShown(true)}
      onBlur={() => setIsShown(false)}
      style={{position: 'relative'}}>
      {children}
      <AnimatePresence>
        {isShown && (
          <motion.span
            aria-hidden
            initial={{opacity: 0, y: -4}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -4, transition: springs.effects.fast}}
            transition={expressive('fast')}
            style={{
              position: 'absolute',
              insetBlockStart: '100%',
              insetInlineStart: '50%',
              translate: '-50% 0',
              paddingBlockStart: 'var(--spacing-0-5)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
            <Text
              type="supporting"
              style={{
                ...accentStyle,
                // The serif's smaller x-height reads a size down; nudge it up.
                fontSize: 'calc(var(--text-supporting-size) * 1.15)',
              }}>
              {hint}
            </Text>
          </motion.span>
        )}
      </AnimatePresence>
    </MotionHStack>
  );
}
