'use client';

import {useEffect, useLayoutEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';

/** Waits two frames so it runs after Next.js has finished its own scroll handling. */
function afterNextScroll(callback: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function scrollInstantly(top: number) {
  window.scrollTo({top, left: 0, behavior: 'instant'});
}

/** Scrolls to the element named by the URL hash. Returns false if there is none. */
function scrollToHash(): boolean {
  if (!window.location.hash) return false;
  const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  target?.scrollIntoView({block: 'start', behavior: 'instant'});
  return target !== null;
}

/**
 * Page-to-page scroll behaviour:
 *
 * - Following a link opens the new page at the very top (or at its #section,
 *   if the link points to one).
 * - Loading a page with a #section re-aligns to it after the load event and
 *   fonts, since the browser's own jump can land before layout settles.
 * - Back and Forward return to exactly where the visitor was on that page,
 *   e.g. the card they clicked.
 *
 * The browser's own restoration is turned off because it runs before the
 * client-rendered page is in place and lands in the wrong spot.
 */
export function ScrollManager() {
  const pathname = usePathname();
  const positions = useRef(new Map<string, number>());
  /** Set on Back/Forward: where to return to. Null for ordinary link navigation. */
  const restoreTo = useRef<number | null>(null);
  const currentPath = useRef(pathname);
  const previousPath = useRef(pathname);

  // Keep the path the scroll position belongs to in step with what is on screen.
  useLayoutEffect(() => {
    currentPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!window.location.hash) return;
    // After the load event (when the browser makes its own jump) and fonts.
    const align = () => document.fonts.ready.then(() => afterNextScroll(scrollToHash));
    if (document.readyState === 'complete') align();
    else window.addEventListener('load', align, {once: true});
    return () => window.removeEventListener('load', align);
  }, []);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const remember = () => {
      // While returning to a page, ignore the interim scrolls of the page swap.
      if (restoreTo.current !== null) return;
      positions.current.set(currentPath.current, window.scrollY);
    };
    // The URL has already changed when popstate fires, so read the saved
    // position now, before the page swap can scroll and overwrite it.
    const onPopState = () => {
      // Back/Forward between #sections of the same page is left to the browser.
      if (window.location.pathname === currentPath.current) return;
      restoreTo.current = positions.current.get(window.location.pathname) ?? 0;
    };

    window.addEventListener('scroll', remember, {passive: true});
    window.addEventListener('popstate', onPopState);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener('scroll', remember);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    afterNextScroll(() => {
      if (restoreTo.current !== null) {
        // Back/Forward: return to where the visitor left this page.
        scrollInstantly(restoreTo.current);
        restoreTo.current = null;
        return;
      }

      // New page: honour a #section link, otherwise start at the top.
      if (!scrollToHash()) scrollInstantly(0);
    });
  }, [pathname]);

  return null;
}
