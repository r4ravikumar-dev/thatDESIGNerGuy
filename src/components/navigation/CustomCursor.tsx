'use client';

import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {motion, useMotionValue, useReducedMotion, useSpring} from 'framer-motion';
import {springs} from '@/motion/springs';

/** Only for a real mouse or trackpad; touch screens keep their own behaviour. */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

const INTERACTIVE =
  'a, button, [role="button"], [role="tab"], summary, label, select, input[type="checkbox"], input[type="radio"]';
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

type Mode = 'default' | 'interactive' | 'text' | 'project' | 'hidden';

/**
 * Areas that open a project (the Work showcase's banners and details card):
 * the lens gives way to a Figma-style pointer whose tag reads the area's
 * data-cursor-label ("Open project" by default).
 */
const PROJECT = '[data-cursor="project"]';
const PROJECT_LABEL = 'Open project';

/** The pointer: a multiplayer cursor arrow, its tip at (0, 0), in a 24 × 24 box. */
const POINTER = 'M2 2 L20.5 9 L11.6 11.6 L9 20.5 Z';

/** Only the calls to action (primary and secondary buttons) grow under the lens. */
const MAGNIFY = '.astryx-button[data-variant="primary"], .astryx-button[data-variant="secondary"]';
const MAGNIFY_ATTRIBUTE = 'data-cursor-magnify';

/** A squircle (superellipse) in a 100 × 100 box: softer than a circle, rounder than a square. */
const SQUIRCLE = 'M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z';

/**
 * The cursor: a liquid-glass squircle lens that inverts whatever it
 * passes over, with the header's glass treatment (a slight blur, a colour
 * boost, a specular rim and a sheen), so it reads on light and dark surfaces
 * alike. It follows the pointer on a quick spring and presses in on click.
 * Over links and buttons the lens clears (no blur, so labels stay legible)
 * but keeps its size; only a call to action (primary or secondary button)
 * beneath it grows, to 1.1×. Nothing else scales. Over text fields it
 * steps aside for the native text cursor. Pointer events pass straight through,
 * keyboard use is untouched, and touch devices never see it.
 *
 * Over a project (PROJECT) the lens steps aside for a Figma-style pointer:
 * a brand-blue arrow with a white edge, its tip on the pointer, and a tag
 * below and to the right in the primary CTA's liquid glass, reading
 * "Open project".
 */
export function CustomCursor() {
  const isFinePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>('hidden');
  const [isPressed, setIsPressed] = useState(false);
  const [label, setLabel] = useState(PROJECT_LABEL);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // A quick spring keeps it fluid without lagging; reduced motion follows exactly.
  const springX = useSpring(x, reduceMotion ? {duration: 0} : springs.spatial.fast);
  const springY = useSpring(y, reduceMotion ? {duration: 0} : springs.spatial.fast);

  useEffect(() => {
    if (!isFinePointer) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    // The control currently magnified under the lens, if any.
    let magnified: Element | null = null;

    function magnify(element: Element | null) {
      if (element === magnified) return;
      magnified?.removeAttribute(MAGNIFY_ATTRIBUTE);
      magnified = null;
      if (!element || reduceMotion || !element.matches(MAGNIFY)) return;
      element.setAttribute(MAGNIFY_ATTRIBUTE, '');
      magnified = element;
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      const project = target?.closest(PROJECT);
      if (project) {
        magnify(null);
        setLabel(project.getAttribute('data-cursor-label') || PROJECT_LABEL);
        setMode('project');
        return;
      }
      const control = target?.closest(TEXT_FIELD) ? null : (target?.closest(INTERACTIVE) ?? null);
      magnify(control);
      setMode(target?.closest(TEXT_FIELD) ? 'text' : control ? 'interactive' : 'default');
    }
    const onLeave = () => {
      magnify(null);
      setMode('hidden');
    };
    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);

    window.addEventListener('pointermove', onMove, {passive: true});
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      magnify(null);
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isFinePointer, reduceMotion, x, y]);

  // A popup (a modal <dialog>) sits in the browser's top layer, above any
  // z-index, so the cursor would vanish behind it while the native one is
  // hidden. The cursor is a popover in that top layer too, and is lifted
  // back above each popup as it opens (the newest top-layer element is on top).
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!isFinePointer || !cursor || typeof cursor.showPopover !== 'function') return;
    const raise = () => {
      if (cursor.matches(':popover-open')) cursor.hidePopover();
      cursor.showPopover();
    };
    raise();
    const observer = new MutationObserver(records => {
      const opened = records.some(
        record =>
          record.target instanceof HTMLDialogElement && record.target.hasAttribute('open'),
      );
      if (opened) raise();
    });
    observer.observe(document.body, {subtree: true, attributes: true, attributeFilter: ['open']});
    return () => {
      observer.disconnect();
      if (cursor.matches(':popover-open')) cursor.hidePopover();
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  const isProject = mode === 'project';
  const isVisible = mode !== 'hidden' && mode !== 'text' && !isProject;
  // The lens keeps its size over controls (only the CTA under it grows).
  const scale = !isVisible ? 0.4 : isPressed ? 0.8 : 1;

  return (
    <motion.span
      ref={cursorRef}
      aria-hidden
      popover="manual"
      className="cursor-squircle"
      style={{x: springX, y: springY}}>
      {/* The lens: liquid glass that inverts what is beneath (globals.css). */}
      <motion.span
        className={mode === 'interactive' ? 'cursor-lens is-interactive' : 'cursor-lens'}
        initial={false}
        animate={{scale, opacity: isVisible ? 1 : 0}}
        transition={springs.spatial.fast}>
        {/* Fallback shape for browsers without backdrop filters. */}
        <svg viewBox="0 0 100 100">
          <path d={SQUIRCLE} />
        </svg>
      </motion.span>
      {/* The project pointer: arrow and glass tag, growing out from the tip. */}
      <motion.span
        className="cursor-project"
        initial={false}
        animate={{scale: isProject ? (isPressed ? 0.92 : 1) : 0.5, opacity: isProject ? 1 : 0}}
        transition={springs.spatial.fast}>
        <svg className="cursor-project-arrow" viewBox="0 0 24 24">
          <path d={POINTER} />
        </svg>
        <span className="cursor-project-tag-anchor">
          <span className="cursor-project-tag">{label}</span>
        </span>
      </motion.span>
    </motion.span>
  );
}
