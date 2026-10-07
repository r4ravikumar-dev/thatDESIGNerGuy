'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';

/** How long the loader plays on every page change. */
const DURATION_MS = 1400;
/** If a page never arrives (failed navigation), give the screen back anyway. */
const SAFETY_MS = 8000;

/** The loader, kept minimal: one ring and one dot slowly orbiting a brand-blue core. */
function Orbit() {
  return (
    <svg className="loader-orbits" viewBox="-50 -50 100 100" aria-hidden>
      <circle className="loader-ring" r={30} />
      <g className="loader-orbit">
        <circle cx={0} cy={-30} r={3.5} className="loader-planet" />
      </g>
      <circle r={6} className="loader-core" />
    </svg>
  );
}

/**
 * The page-change loader. It starts the moment an internal link to another
 * page is followed (or Back/Forward changes the page), plays for 1.4s, and
 * stays until the new page has arrived. Hash links, new tabs and modified
 * clicks are ignored; reduced-motion visitors skip it entirely.
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const startedAt = useRef<number | null>(null);
  const hasArrived = useRef(false);
  const timers = useRef<number[]>([]);
  const previousPath = useRef(pathname);

  const clearTimers = () => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
  };

  /** Hides the loader once it has played for 1.4s and the new page is in. */
  const hideWhenReady = useCallback(() => {
    if (startedAt.current === null || !hasArrived.current) return;
    const remaining = DURATION_MS - (performance.now() - startedAt.current);
    timers.current.push(
      window.setTimeout(
        () => {
          startedAt.current = null;
          setIsVisible(false);
        },
        Math.max(0, remaining),
      ),
    );
  }, []);

  const start = useCallback(() => {
    if (reduceMotion) return;
    clearTimers();
    startedAt.current = performance.now();
    hasArrived.current = false;
    setIsVisible(true);
    timers.current.push(
      window.setTimeout(() => {
        startedAt.current = null;
        setIsVisible(false);
      }, SAFETY_MS),
    );
  }, [reduceMotion]);

  // Start on clicks that will change the page. Capture phase, because
  // Next.js links prevent the default before a bubbling listener would run.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname)
        return;
      start();
    }
    function onPopState() {
      if (window.location.pathname !== previousPath.current) start();
    }
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      clearTimers();
    };
  }, [start]);

  // The new page has arrived: hide once the full 1.4s has played.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    hasArrived.current = true;
    hideWhenReady();
  }, [pathname, hideWhenReady]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-transition"
          className="page-transition"
          role="status"
          aria-live="polite"
          initial={{opacity: 0}}
          animate={{opacity: 1, transition: {duration: 0.2, ease: [0.2, 0, 0, 1]}}}
          exit={{opacity: 0, transition: {duration: 0.3, ease: [0.4, 0, 1, 1]}}}>
          <VisuallyHidden>Loading page</VisuallyHidden>
          <Orbit />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
