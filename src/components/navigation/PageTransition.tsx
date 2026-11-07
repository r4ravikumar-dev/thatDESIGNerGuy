'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import {Text} from '@astryxdesign/core/Text';
import {IdCard} from '@/components/illustrations/IdCard';
import {setCovered} from '@/motion/gsap';
import {statusCopy} from '@/content/navigation';

/** A page that arrives within this long changes with no loader at all. */
const SHOW_AFTER_MS = 400;
/** Once shown, the loader stays at least this long, so it never just flickers. */
const MIN_VISIBLE_MS = 700;
/** If a page never arrives (failed navigation), give the screen back anyway. */
const SAFETY_MS = 10000;

/**
 * The page-change loader, only for slow connections. When an internal link to
 * another page is followed (or Back/Forward changes the page), it waits:
 * if the new page arrives within 0.4s nothing is shown at all; if not, Ravi's
 * ID card appears, swinging on its lanyard with its details still loading
 * (IdCard "loading"), until the page is in. Hash links, new tabs and
 * modified clicks are ignored. With reduced motion the card is still.
 */
export function PageTransition() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const isPending = useRef(false);
  const shownAt = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const previousPath = useRef(pathname);

  const clearTimers = () => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
  };

  const hide = useCallback(() => {
    shownAt.current = null;
    setIsVisible(false);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    isPending.current = true;
    timers.current.push(
      // Still waiting after a moment: the connection is slow, so show the card.
      window.setTimeout(() => {
        if (!isPending.current) return;
        shownAt.current = performance.now();
        setIsVisible(true);
      }, SHOW_AFTER_MS),
      window.setTimeout(() => {
        isPending.current = false;
        hide();
      }, SAFETY_MS),
    );
  }, [hide]);

  // Start on clicks that will change the page. Capture phase, because
  // Next.js links prevent the default before a bubbling listener would run.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.hasAttribute('download')) return;
      // Links that open something in place instead of a page (the locked
      // projects open their boarding pass) never start the loader.
      if (anchor.hasAttribute('data-stays-on-page')) return;
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

  // Scroll reveals already on screen wait until the loader has gone (motion/gsap).
  useEffect(() => {
    setCovered('data-page-transition', isVisible);
  }, [isVisible]);

  // The new page has arrived: no loader if it never showed; otherwise hide it
  // once it has been up for its minimum.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    isPending.current = false;
    clearTimers();
    if (shownAt.current === null) return;
    const remaining = MIN_VISIBLE_MS - (performance.now() - shownAt.current);
    timers.current.push(window.setTimeout(hide, Math.max(0, remaining)));
  }, [pathname, hide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-transition"
          className="page-transition"
          role="status"
          aria-live="polite"
          initial={{opacity: 0}}
          animate={{opacity: 1, transition: {duration: 0.25, ease: [0.2, 0, 0, 1]}}}
          exit={{opacity: 0, transition: {duration: 0.3, ease: [0.4, 0, 1, 1]}}}>
          <IdCard variant="loading" className="page-transition-card" />
          <Text color="secondary" className="page-transition-label">
            {statusCopy.loading}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
