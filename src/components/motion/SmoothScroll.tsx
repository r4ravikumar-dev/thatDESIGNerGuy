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
  if (typeof target === 'number') window.scrollTo({top: target, left: 0, behavior: 'instant'});
  else target.scrollIntoView({block: 'start', behavior: 'instant'});
  // Re-sync Lenis to where the page now is, which also cancels any smooth
  // scroll in flight.
  lenis?.scrollTo(window.scrollY, {immediate: true, force: true});
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
      allowNestedScroll: true,
      autoRaf: false,
    });
    lenis = instance;

    // Pause while an overlay (a dialog, the mobile menu) locks the page's
    // scroll, and carry on when it unlocks. Watched here rather than with
    // Lenis' autoToggle, which waits for an overflow transition that doesn't
    // always fire when the lock is released, leaving the page stuck.
    const root = document.documentElement;
    const syncLock = () => {
      // The lock's inline style only: Lenis' own .lenis-stopped also clips
      // the page, and reading that back would keep it stopped for good.
      const locked = [root, document.body].some(el =>
        ['hidden', 'clip'].includes(el.style.overflowY || el.style.overflow),
      );
      if (locked) instance.stop();
      else instance.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(root, {attributes: true, attributeFilter: ['style']});
    lockObserver.observe(document.body, {attributes: true, attributeFilter: ['style']});
    syncLock();

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    // Keep scroll in step with the wheel even after a dropped frame.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lockObserver.disconnect();
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
