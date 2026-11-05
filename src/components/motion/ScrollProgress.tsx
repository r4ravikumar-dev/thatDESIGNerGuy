'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/motion/gsap';

/**
 * Reading progress: a brand-blue hairline along the top of the screen that
 * fills left to right as the page scrolls (.scroll-progress in globals.css).
 * It follows the scroll exactly, never moving on its own, so it stays on
 * with reduced motion. Decorative: the scrollbar already says the same.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        {scaleX: 0},
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {start: 0, end: 'max', scrub: 0.3, invalidateOnRefresh: true},
        },
      );
    },
    {scope: ref},
  );

  return <span ref={ref} aria-hidden className="scroll-progress" />;
}
