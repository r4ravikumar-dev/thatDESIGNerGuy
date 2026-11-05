'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import Lenis from 'lenis';
import {gsap, ScrollTrigger, prefersReducedMotion} from '@/motion/gsap';

/** The running Lenis instance, or null (reduced motion, or before mount). */
let lenis: Lenis | null = null;

/**
 * Jumps straight to a position or an element, cancelling any smooth scroll in
 * flight first so Lenis doesn't carry on towards its old target. Used for
 * page-to-page navigation (ScrollManager), where scrolling should be instant.
 */
export function jumpTo(target: number | HTMLElement) {
  if (lenis) {
    // stop() then start() cancels the animation and re-syncs to the page.
    lenis.stop();
    lenis.start();
  }
  if (typeof target === 'number') window.scrollTo({top: target, left: 0, behavior: 'instant'});
  else target.scrollIntoView({block: 'start', behavior: 'instant'});
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so Lenis, ScrollTrigger
 * and Framer Motion all read the same scroll position on the same frame.
 *
 * Lenis animates the real window scroll (no transformed wrapper), so the
 * site's position: sticky pinning, Framer's useScroll and native anchors keep
 * working. Touch devices keep their native scrolling (Lenis' default); in-page
 * #links glide and stop below the header (Lenis reads scroll-padding-top).
 * Off entirely with reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
      // Stops while the page's overflow is hidden (an open drawer or dialog).
      autoToggle: true,
      allowNestedScroll: true,
      autoRaf: false,
    });
    lenis = instance;

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    // Keep scroll in step with the wheel even after a dropped frame.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  // Positions change with each new page and once the web fonts arrive.
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}
