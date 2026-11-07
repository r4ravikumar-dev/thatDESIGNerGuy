'use client';

import {useRef} from 'react';
import {Plane} from 'lucide-react';
import {gsap, useGSAP} from '@/motion/gsap';

/** The plane's size, in CSS pixels. */
const PLANE = 12;

/**
 * Reading progress as a flight: a brand-blue hairline along the top of the
 * screen fills left to right as the page scrolls, with a small plane flying
 * at its tip, so the line reads as the distance covered so far
 * (.scroll-progress in globals.css). It follows the scroll exactly, never
 * moving on its own, so it stays on with reduced motion. Decorative: the
 * scrollbar already says the same.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const line = root?.querySelector('.scroll-progress-line');
      const plane = root?.querySelector('.scroll-progress-plane');
      if (!root || !line || !plane) return;
      const timeline = gsap.timeline({
        defaults: {ease: 'none'},
        scrollTrigger: {start: 0, end: 'max', scrub: 0.3, invalidateOnRefresh: true},
      });
      timeline
        .fromTo(line, {scaleX: 0}, {scaleX: 1}, 0)
        // The plane's nose sits on the line's tip, from the left edge to the right.
        .fromTo(plane, {x: 0}, {x: () => root.clientWidth - PLANE}, 0);
    },
    {scope: ref},
  );

  return (
    <span ref={ref} aria-hidden className="scroll-progress">
      <span className="scroll-progress-line" />
      <span className="scroll-progress-plane">
        <Plane size={PLANE} strokeWidth={1.75} />
      </span>
    </span>
  );
}
