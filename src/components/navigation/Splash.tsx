'use client';

import {useEffect, useId, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Text} from '@astryxdesign/core/Text';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Lines} from '@/components/storytelling/Lines';
import {LOGO_VIEWBOX, LOGO_WIDTH, LogoText} from './Logo';
import {site} from '@/content/site';

/** Remembered for the browsing session, so the splash plays once per visit. */
export const SPLASH_KEY = 'ravikumar-splash-seen';
/** The splash plays for at least this long, then waits for the page to load. */
const MIN_MS = 1600;
/** On very slow connections, give the page back after this long regardless. */
const MAX_MS = 8000;

/** The logo outline's height in viewBox units: the fill rises through it. */
const TOP = 0;
const BOTTOM = 48;

/**
 * Marks the session as having seen the splash before the first paint, so it
 * is hidden on every later page load (the splash is server-rendered, so it
 * would otherwise flash). Runs inline in <head>.
 */
export const splashSeenScript = `try{if(sessionStorage.getItem('${SPLASH_KEY}'))document.documentElement.classList.add('splash-seen')}catch(e){}`;

function pageLoaded() {
  return new Promise<void>(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), {once: true});
  });
}

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

/**
 * The first-visit splash. The outlined logo fills from the bottom up
 * in the theme's logo colours on a spring (about 1s), then the tagline
 * rises in beneath it, all within the 1.6s. It plays for at least 1.6s and stays until the page has fully
 * loaded (up to 8s), so slower connections see it longer, then fades away.
 * Once per browsing session; with reduced motion the logo and line appear
 * already in place. Hidden without JavaScript (see the noscript style).
 */
export function Splash() {
  const clipId = useId();
  const reduceMotion = useReducedMotion();
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    // Already seen this session: CSS hid it before paint; unmount it now.
    const isSeen = document.documentElement.classList.contains('splash-seen');
    if (!isSeen) {
      try {
        sessionStorage.setItem(SPLASH_KEY, '1');
      } catch {
        // Private mode or blocked storage: the splash simply plays again next time.
      }
    }
    let isCancelled = false;
    const ready = isSeen
      ? Promise.resolve()
      : Promise.race([Promise.all([wait(MIN_MS), pageLoaded()]), wait(MAX_MS)]);
    ready.then(() => {
      if (!isCancelled) setIsShown(false);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const fill = reduceMotion
    ? {initial: false as const}
    : {
        // attrY animates the rect's y attribute; plain y would be a transform.
        initial: {attrY: BOTTOM, height: 0},
        animate: {attrY: TOP, height: BOTTOM - TOP},
        transition: {type: 'spring' as const, duration: 0.95, bounce: 0.2, delay: 0.05},
      };
  const tagline = reduceMotion
    ? {initial: false as const}
    : {
        initial: {opacity: 0, y: 10},
        animate: {opacity: 1, y: 0},
        transition: {type: 'spring' as const, duration: 0.6, bounce: 0.25, delay: 0.8},
      };

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          key="splash"
          className="splash"
          role="status"
          aria-live="polite"
          exit={{opacity: 0, transition: {duration: 0.4, ease: [0.4, 0, 1, 1]}}}>
          <VisuallyHidden>Loading {site.name}</VisuallyHidden>
          <motion.div
            className="splash-mark"
            aria-hidden
            exit={{scale: 0.96, transition: {duration: 0.4, ease: [0.4, 0, 1, 1]}}}>
            <svg viewBox={LOGO_VIEWBOX} className="splash-logo" fill="none">
              <defs>
                <clipPath id={clipId}>
                  <motion.rect x={0} width={LOGO_WIDTH} y={TOP} height={BOTTOM - TOP} {...fill} />
                </clipPath>
              </defs>
              {/* The outline */}
              <g className="splash-outline">
                <LogoText paint="outline" />
              </g>
              {/* The fill, rising from the bottom */}
              <g clipPath={`url(#${clipId})`}>
                <LogoText />
              </g>
            </svg>
            <motion.div {...tagline}>
              <Text type="large" color="secondary" className="splash-tagline">
                <Lines text={site.tagline} />
              </Text>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
