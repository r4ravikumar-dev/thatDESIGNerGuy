'use client';

import {useEffect, useRef} from 'react';
import type {AnimationItem} from 'lottie-web';
import {VStack} from '@astryxdesign/core/Layout';
import animationData from './lottie/design-story.json';
import {RippleGrid} from './RippleGrid';

/** The frame that shows the finished screen (used with reduced motion). */
const FINISHED_FRAME = 326;

type DesignStoryProps = {
  label: string;
  /**
   * Controlled by the parent (the desktop hero panel): play from the start
   * each time it turns true, pause while false. Leave it out to play
   * whenever the animation is on screen.
   */
  isShown?: boolean;
};

/**
 * The hero's design story, a Lottie animation (lottie/design-story.json,
 * built by scripts/lottie/design-story.py): Ravi's cursor drags out a
 * frame, gathers scattered app ideas into a tidy row and builds a complete
 * mobile app from them, then it all fades and begins again. About 12
 * seconds, looping.
 *
 * It plays on its own (not with the scroll) while it is on screen and
 * shown; hovering it doesn't pause it. With
 * reduced motion it holds the finished screen. The placeholder colours in
 * the file are mapped onto theme tokens in globals.css
 * (.design-story-lottie), so it follows light and dark mode. Behind it, the
 * dot grid ripples under the pointer (RippleGrid).
 */
export function DesignStory({label, isShown}: DesignStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const player = useRef<AnimationItem | null>(null);
  const state = useRef({inView: false, isShown: isShown ?? true});
  /** Applies the current state to the player. */
  const sync = useRef(() => {});

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isCancelled = false;

    sync.current = () => {
      const anim = player.current;
      if (!anim) return;
      if (reduceMotion) {
        anim.goToAndStop(FINISHED_FRAME, true);
        return;
      }
      const {inView, isShown: shown} = state.current;
      if (shown && inView) anim.play();
      else anim.pause();
    };

    import('lottie-web/build/player/lottie_light').then(({default: lottie}) => {
      if (isCancelled) return;
      player.current = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData,
        rendererSettings: {preserveAspectRatio: 'xMidYMid meet'},
      });
      player.current.addEventListener('DOMLoaded', () => sync.current());
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.current.inView = entry.isIntersecting;
        sync.current();
      },
      {threshold: 0.2},
    );
    observer.observe(container);

    return () => {
      isCancelled = true;
      observer.disconnect();
      player.current?.destroy();
      player.current = null;
    };
  }, []);

  // Shown again: start the story from the top, so the cursor's arrival is seen.
  useEffect(() => {
    const shown = isShown ?? true;
    const wasShown = state.current.isShown;
    state.current.isShown = shown;
    if (shown && !wasShown) player.current?.goToAndStop(0, true);
    sync.current();
  }, [isShown]);

  return (
    <VStack ref={ref} role="img" aria-label={label} className="design-story-lottie">
      {/* The dot grid behind the scene, rippling under the pointer. */}
      <RippleGrid />
    </VStack>
  );
}
