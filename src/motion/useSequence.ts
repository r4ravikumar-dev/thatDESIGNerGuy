'use client';

import {useEffect, useRef, useState} from 'react';
import {useInView, useReducedMotion} from 'framer-motion';

type SequenceOptions = {
  /**
   * Repeat the sequence forever (hold, reset, play again). Off by default:
   * sequences play once and stay put.
   */
  loop?: boolean;
  /** Time between one item appearing and the next. */
  stepMs?: number;
  /** When looping, how long the complete sequence holds before it restarts. */
  holdMs?: number;
  /** Pause before the first item (and, when looping, between loops). */
  restMs?: number;
};

/**
 * Drives a build-up: once the element scrolls into view, items appear one at
 * a time. By default it plays once and stays complete.
 *
 * With `loop`, it holds, resets and plays again. It runs only while on
 * screen, and pauses while hovered or focused so people can stop motion to
 * read (WCAG 2.2.2 Pause, Stop, Hide).
 *
 * With reduced motion, everything is shown at once.
 *
 * Returns `visible`, the number of items currently shown (0…count). Spread
 * `pauseProps` on the same element as `ref`.
 */
export function useSequence<T extends Element = HTMLDivElement>(
  count: number,
  {loop = false, stepMs = 450, holdMs = 3500, restMs = 300}: SequenceOptions = {},
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, {amount: 0.3, once: !loop});
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isComplete = step >= count;

  useEffect(() => {
    if (reduceMotion || !isInView) return;
    if (!loop && isComplete) return;
    if (loop && isPaused) return;
    const delay = step === 0 ? restMs : isComplete ? holdMs : stepMs;
    const timer = setTimeout(() => setStep(current => (current >= count ? 0 : current + 1)), delay);
    return () => clearTimeout(timer);
  }, [reduceMotion, isInView, loop, isComplete, isPaused, step, count, stepMs, holdMs, restMs]);

  const pauseProps = loop
    ? {
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        onFocus: () => setIsPaused(true),
        onBlur: () => setIsPaused(false),
      }
    : {};

  return {ref, visible: reduceMotion ? count : step, pauseProps};
}
