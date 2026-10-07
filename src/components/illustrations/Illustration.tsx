'use client';

import {useId, useRef, useState, type ComponentProps, type ReactNode} from 'react';
import {motion, useInView, useReducedMotion, type Variants} from 'framer-motion';

/** Stroke colours: the text colour for line work, brand blue for the moving accent. */
export const INK = 'currentColor';
export const ACCENT = 'var(--color-brand-text)';
export const MUTED = 'var(--color-text-secondary)';

const draw: Variants = {
  off: {pathLength: 0, opacity: 0},
  on: (order: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {duration: 1.4, delay: 0.12 * order, ease: [0.2, 0, 0, 1]},
      opacity: {duration: 0.01, delay: 0.12 * order},
    },
  }),
};

const appear: Variants = {
  off: {scale: 0, opacity: 0},
  on: (order: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {type: 'spring', stiffness: 380, damping: 18, delay: 0.12 * order},
  }),
};

type StrokeProps = Omit<ComponentProps<typeof motion.path>, 'custom' | 'variants'> & {
  /** Draw order: later strokes start a little after earlier ones. */
  order?: number;
  /** Line weight: "regular" for the subject, "fine" for supporting lines. */
  weight?: 'regular' | 'fine';
};

/** A line that draws itself in once, then stays. */
export function Stroke({order = 0, stroke = INK, weight = 'regular', ...props}: StrokeProps) {
  return (
    <motion.path
      variants={draw}
      custom={order}
      fill="none"
      stroke={stroke}
      strokeWidth={weight === 'regular' ? 1.75 : 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

/** A soft tinted surface under line work, for depth. Fades in with the drawing. */
export function Surface({
  order = 0,
  ...props
}: Omit<ComponentProps<typeof motion.path>, 'custom' | 'variants'> & {order?: number}) {
  return (
    <motion.path
      variants={{
        off: {opacity: 0},
        on: {opacity: 1, transition: {duration: 1.2, delay: 0.12 * order}},
      }}
      fill="currentColor"
      fillOpacity={0.05}
      stroke="none"
      {...props}
    />
  );
}

type DotProps = Omit<ComponentProps<typeof motion.circle>, 'custom' | 'variants'> & {
  order?: number;
};

/** A dot that pops in with a small spring overshoot. */
export function Dot({order = 0, fill = ACCENT, ...props}: DotProps) {
  return (
    <motion.circle
      variants={appear}
      custom={order}
      fill={fill}
      style={{transformBox: 'fill-box', transformOrigin: 'center'}}
      {...props}
    />
  );
}

/** A ring that ripples outwards from a point, forever (the .ill-pulse loop). */
export function Pulse({
  cx,
  cy,
  r = 8,
  delay = 0,
}: {
  cx: number;
  cy: number;
  r?: number;
  delay?: number;
}) {
  return (
    <circle
      className="ill-loop ill-pulse"
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={ACCENT}
      strokeWidth={1.5}
      style={{animationDelay: `${delay}s`}}
    />
  );
}

type TravelProps = {
  d: string;
  /** Seconds for one trip. */
  duration?: number;
  delay?: number;
  /** "comet" is a short glowing segment; "dot" is a single round point. */
  shape?: 'comet' | 'dot';
  /** Line thickness, for drawing at smaller sizes. Defaults to 3 (comet) or 9 (dot). */
  thickness?: number;
  /** Constant speed instead of easing in and out, for scenes that sync to it. */
  isLinear?: boolean;
};

/** A blue mark that travels along a path, forever (the .ill-travel loop). */
export function Travel({
  d,
  duration = 9,
  delay = 0,
  shape = 'comet',
  thickness,
  isLinear = false,
}: TravelProps) {
  return (
    <path
      className="ill-loop ill-travel"
      d={d}
      pathLength={1}
      fill="none"
      stroke={ACCENT}
      strokeWidth={thickness ?? (shape === 'dot' ? 9 : 3)}
      strokeLinecap="round"
      strokeDasharray={shape === 'dot' ? '0.0001 1.9999' : '0.08 1.92'}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: isLinear ? 'linear' : undefined,
      }}
    />
  );
}

/** A faint dot grid, like a design canvas, behind the scene. */
function DotGrid({id, viewBox}: {id: string; viewBox: string}) {
  const [x, y, width, height] = viewBox.split(' ').map(Number);
  return (
    <>
      <defs>
        <pattern id={id} width={20} height={20} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={1} fill="currentColor" fillOpacity={0.14} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${id})`} />
    </>
  );
}

type IllustrationProps = {
  viewBox: string;
  /** What the illustration shows. Omit when it is purely decorative. */
  label?: string;
  maxWidth?: number;
  children: ReactNode | ((ids: {clip: string}) => ReactNode);
};

/**
 * Frame for illustration set: minimal 2D line art on a faint dot
 * grid, in the text colour (so it follows light and dark mode) with one
 * brand-blue moving accent.
 *
 * Lines draw in once, then each scene loops slowly (7–12s cycles, CSS
 * keyframes in globals.css). Loops run only while the scene is on screen,
 * pause while hovered or focused, and are off entirely with reduced motion,
 * which shows the finished still.
 */
export function Illustration({viewBox, label, maxWidth, children}: IllustrationProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, {amount: 0.15});
  const [isPaused, setIsPaused] = useState(false);
  const baseId = useId().replace(/:/g, '');

  return (
    <motion.svg
      ref={ref}
      className="illustration"
      data-playing={isInView && !isPaused && !reduceMotion}
      viewBox={viewBox}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      initial={reduceMotion ? 'on' : 'off'}
      whileInView="on"
      viewport={{once: true, amount: 0.4}}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Grows on large screens with --illustration-scale (spaceScale.ts).
      style={{
        maxInlineSize: maxWidth ? `calc(${maxWidth}px * var(--illustration-scale, 1))` : undefined,
      }}>
      <DotGrid id={`${baseId}-grid`} viewBox={viewBox} />
      {typeof children === 'function' ? children({clip: `${baseId}-clip`}) : children}
    </motion.svg>
  );
}
