'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowRight} from 'lucide-react';
import {VStack} from '@astryxdesign/core/Layout';
import {IdCard, IdCardBack} from '@/components/illustrations/IdCard';
import {RippleGrid} from '@/components/illustrations/RippleGrid';
import {setCovered} from '@/motion/gsap';
import {welcome} from '@/content/navigation';

/** Remembered for the browsing session, so the welcome shows once per visit. */
export const SPLASH_KEY = 'ravikumar-splash-seen';
/** When the way in appears: once the card has said who Ravi is. */
const ACTION_DELAY_S = 2.6;

/**
 * Marks the session as having seen the welcome before the first paint, so it
 * is hidden on every later page load (the splash is server-rendered, so it
 * would otherwise flash). Runs inline in <head>.
 */
export const splashSeenScript = `try{if(sessionStorage.getItem('${SPLASH_KEY}'))document.documentElement.classList.add('splash-seen')}catch(e){}`;

/**
 * The first-visit welcome: Ravi's ID card drops in on its lanyard and fills
 * in (name, role, "Currently at Visit Health"; IdCard), then "Get to know
 * Ravi" appears, and pressing it enters the site, the card swinging up and
 * away. Once per browsing session (remembered on entering, so a reload
 * before then shows it again). The page behind is still and scroll-locked
 * meanwhile; the button takes focus as it appears. With reduced motion the
 * card and button are simply there. Behind it, the dot grid drifts and
 * ripples out from the pointer as it moves (RippleGrid). Hovering (or
 * tapping) the card flips it over to Ravi's photo. Hidden without JavaScript (see the
 * noscript style in layout.tsx).
 */
export function Splash() {
  const reduceMotion = useReducedMotion();
  const [isShown, setIsShown] = useState(true);
  /** Touch screens flip the card with a tap (pointers flip it on hover, in CSS). */
  const [isFlipped, setIsFlipped] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Already seen this session: CSS hid it before paint; unmount it now.
  useEffect(() => {
    if (!document.documentElement.classList.contains('splash-seen')) return;
    let isCancelled = false;
    Promise.resolve().then(() => {
      if (!isCancelled) setIsShown(false);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Scroll reveals already on screen wait until the welcome has gone (motion/gsap).
  useEffect(() => {
    setCovered('data-splash', isShown);
  }, [isShown]);

  // The button takes focus once it has appeared, so Enter or Space goes in.
  useEffect(() => {
    if (!isShown) return;
    const timer = window.setTimeout(
      () => buttonRef.current?.querySelector('button')?.focus({preventScroll: true}),
      reduceMotion ? 0 : ACTION_DELAY_S * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [isShown, reduceMotion]);

  const enter = () => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      // Private mode or blocked storage: the welcome simply shows again next time.
    }
    setIsShown(false);
  };

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          key="splash"
          className="splash"
          role="dialog"
          aria-modal="true"
          aria-label={`Welcome: ${welcome.name}, ${welcome.role}, currently at ${welcome.current}`}
          exit={{opacity: 0, transition: {duration: 0.5, delay: 0.25, ease: [0.4, 0, 1, 1]}}}>
          {/* The dot grid: drifting, rippling under the pointer (RippleGrid). */}
          <RippleGrid />
          <motion.div
            className="splash-mark"
            exit={
              reduceMotion
                ? undefined
                : {
                    y: '-30vh',
                    rotate: 4,
                    opacity: 0,
                    transition: {duration: 0.6, ease: [0.4, 0, 1, 1]},
                  }
            }>
            {/* The card swings on its lanyard and flips over to Ravi's photo on
              hover (or a tap): front and back are two faces of one card. */}
            <VStack
              className="splash-flip"
              data-flipped={isFlipped || undefined}
              onClick={() => setIsFlipped(flipped => !flipped)}
              onPointerLeave={() => setIsFlipped(false)}>
              <VStack className="splash-flip-inner">
                <IdCard variant="intro" className="splash-face" />
                <IdCardBack className="splash-face splash-face-back" />
              </VStack>
            </VStack>
            <motion.div
              ref={buttonRef}
              className="splash-action"
              initial={reduceMotion ? false : {opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 0.6,
                delay: reduceMotion ? 0 : ACTION_DELAY_S,
                ease: [0.2, 0, 0, 1],
              }}>
              <Button
                label={welcome.action}
                variant="primary"
                size="lg"
                onClick={enter}
                endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
