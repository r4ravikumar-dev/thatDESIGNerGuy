'use client';

import {useEffect, useRef} from 'react';

/** Grid spacing and dot size, in CSS pixels (the site's dot grid). */
const STEP = 24;
const DOT = 1.1;
/** The grid drifts one step diagonally every 8 seconds (seamless). */
const DRIFT_MS = 8000;

/** Ripples: how fast the ring travels, how wide it is, how long it lives. */
const RIPPLE_SPEED = 0.42; // px per ms
const RIPPLE_WIDTH = 46;
const RIPPLE_LIFE = 1300; // ms
const RIPPLE_PUSH = 11; // px a dot is pushed at the crest
/** A new ripple at most every so often, and only once the pointer has moved this far. */
const RIPPLE_GAP_MS = 110;
const RIPPLE_GAP_PX = 36;
/** Dots near the pointer lift a little. */
const HOVER_RADIUS = 90;

type Ripple = {x: number; y: number; born: number};

/** A CSS colour (any syntax the browser knows) as [r, g, b]. */
function toRgb(color: string, probe: HTMLElement): [number, number, number] {
  probe.style.color = color;
  const match = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['128', '128', '128'];
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

/**
 * The welcome's dot grid, drawn on a canvas so each dot can react: it drifts
 * slowly, fades towards the edges, and as the pointer moves ripples spread
 * from it, pushing the dots outward as the ring passes; the dots swell and
 * tint brand blue at the crest. Dots near the pointer lift a little.
 * With reduced motion it is a still grid and the pointer does nothing.
 * Decorative.
 */
export function SplashGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Theme colours, read once (the welcome never outlives a theme change).
    const probe = document.createElement('span');
    probe.style.display = 'none';
    canvas.parentElement?.appendChild(probe);
    const styles = getComputedStyle(canvas);
    const ink = toRgb(styles.getPropertyValue('--color-text-secondary').trim(), probe);
    const brand = toRgb(styles.getPropertyValue('--color-brand-text').trim(), probe);
    probe.remove();

    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const ripples: Ripple[] = [];
    const pointer = {x: -1e4, y: -1e4};
    let lastRipple = {x: -1e4, y: -1e4, at: 0};

    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      const now = performance.now();
      const moved = Math.hypot(pointer.x - lastRipple.x, pointer.y - lastRipple.y);
      if (now - lastRipple.at > RIPPLE_GAP_MS && moved > RIPPLE_GAP_PX) {
        ripples.push({x: pointer.x, y: pointer.y, born: now});
        lastRipple = {x: pointer.x, y: pointer.y, at: now};
      }
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };
    if (!reduceMotion) {
      window.addEventListener('pointermove', onMove, {passive: true});
      window.addEventListener('pointerleave', onLeave);
    }

    let frame = 0;
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      // Drop ripples that have faded out.
      while (ripples.length && now - ripples[0].born > RIPPLE_LIFE) ripples.shift();

      const drift = reduceMotion ? 0 : ((now % DRIFT_MS) / DRIFT_MS) * STEP;
      const cx = width / 2;
      const cy = height / 2;
      const rx = width * 0.62;
      const ry = height * 0.62;

      for (let gy = -STEP + drift; gy < height + STEP; gy += STEP) {
        for (let gx = -STEP + drift; gx < width + STEP; gx += STEP) {
          // Fade towards the edges (an ellipse, like a vignette).
          const edge = Math.hypot((gx - cx) / rx, (gy - cy) / ry);
          const fade = Math.max(0, Math.min(1, (1.15 - edge) / 0.6));
          if (fade <= 0) continue;

          let x = gx;
          let y = gy;
          let lift = 0;
          for (const ripple of ripples) {
            const age = now - ripple.born;
            const dx = gx - ripple.x;
            const dy = gy - ripple.y;
            const distance = Math.hypot(dx, dy) || 1;
            const band = Math.abs(distance - age * RIPPLE_SPEED);
            if (band > RIPPLE_WIDTH) continue;
            const strength =
              Math.cos((band / RIPPLE_WIDTH) * (Math.PI / 2)) * (1 - age / RIPPLE_LIFE);
            x += (dx / distance) * RIPPLE_PUSH * strength;
            y += (dy / distance) * RIPPLE_PUSH * strength;
            lift = Math.max(lift, strength);
          }
          const near = Math.hypot(gx - pointer.x, gy - pointer.y);
          if (near < HOVER_RADIUS) lift = Math.max(lift, (1 - near / HOVER_RADIUS) * 0.55);

          const [r, g, b] = lift
            ? ink.map((value, i) => Math.round(value + (brand[i] - value) * lift))
            : ink;
          context.globalAlpha = fade * (0.42 + 0.58 * lift);
          context.fillStyle = `rgb(${r} ${g} ${b})`;
          context.beginPath();
          context.arc(x, y, DOT + lift * 2.2, 0, Math.PI * 2);
          context.fill();
        }
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="splash-grid" aria-hidden />;
}
