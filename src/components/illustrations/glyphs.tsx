'use client';

import type {ReactNode} from 'react';
import {ACCENT, Dot, Illustration, MUTED, Pulse, Stroke, Surface, Travel} from './Illustration';

/**
 * Small step illustrations for the sequence rails, in the same language as
 * the large scenes: line art on the dot grid, a soft surface, one brand-blue
 * accent and a slow loop that pauses off screen. Each is drawn on a 96 × 72
 * canvas.
 */
export type GlyphName =
  | 'foundation'
  | 'tokens'
  | 'components'
  | 'patterns'
  | 'experiences'
  | 'product'
  | 'ux'
  | 'ui'
  | 'interaction'
  | 'build'
  | 'evolve'
  | 'product-digital'
  | 'steps'
  | 'screen'
  | 'toggle'
  | 'rethink'
  | 'system'
  | 'look'
  | 'ask'
  | 'reduce'
  | 'sketch'
  | 'tune';

const VIEW_BOX = '0 0 96 72';

const rect = (x: number, y: number, w: number, h: number, r = 4) =>
  `M${x + r} ${y} h${w - 2 * r} a${r} ${r} 0 0 1 ${r} ${r} v${h - 2 * r} a${r} ${r} 0 0 1 -${r} ${r} h-${w - 2 * r} a${r} ${r} 0 0 1 -${r} -${r} v-${h - 2 * r} a${r} ${r} 0 0 1 ${r} -${r} Z`;

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

/** Floats a group gently, offset by `delay` so neighbours move out of step. */
function Float({
  children,
  delay = 0,
  distance = 3,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
}) {
  return (
    <g
      className="ill-loop ill-float"
      style={{animationDelay: `${delay}s`, ['--float' as string]: `${distance}px`}}>
      {children}
    </g>
  );
}

const glyphs: Record<GlyphName, () => ReactNode> = {
  /** Slabs laid one on another, the blue point resting on top. */
  foundation: () => (
    <>
      <Surface d={rect(18, 48, 60, 10, 3)} />
      <Stroke d={rect(18, 48, 60, 10, 3)} />
      <Stroke order={1} d={rect(24, 36, 48, 10, 3)} />
      <Float>
        <Stroke order={2} stroke={ACCENT} d={rect(30, 24, 36, 10, 3)} />
      </Float>
      <Pulse cx={48} cy={14} r={3} />
      <Dot order={3} cx={48} cy={14} r={3} />
    </>
  ),
  /** A row of swatches, one value lit in blue. */
  tokens: () => (
    <>
      <Surface d={circle(26, 36, 10)} />
      <Stroke d={circle(26, 36, 10)} />
      <Float delay={-1.5}>
        <Stroke order={1} stroke={ACCENT} d={circle(48, 36, 10)} />
        <Dot order={3} cx={48} cy={36} r={4} />
      </Float>
      <Stroke order={2} d={circle(70, 36, 10)} />
      <Stroke order={3} weight="fine" stroke={MUTED} d="M16 58 h64" />
    </>
  ),
  /** Two building blocks that snap together. */
  components: () => (
    <>
      <Surface d={rect(16, 22, 30, 30, 6)} />
      <Stroke d={rect(16, 22, 30, 30, 6)} />
      <Float delay={-2} distance={4}>
        <Stroke order={1} stroke={ACCENT} d={rect(50, 22, 30, 30, 6)} />
      </Float>
      <Stroke order={2} weight="fine" stroke={MUTED} d="M46 37 h4" />
      <Pulse cx={65} cy={37} r={3} delay={0.6} />
      <Dot order={3} cx={65} cy={37} r={2.5} />
    </>
  ),
  /** Blocks arranged into a repeatable grid; a pulse travels the pattern. */
  patterns: () => (
    <>
      {[
        [22, 14],
        [52, 14],
        [22, 40],
      ].map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <Surface order={index} d={rect(x, y, 22, 18, 4)} />
          <Stroke order={index} d={rect(x, y, 22, 18, 4)} />
        </g>
      ))}
      <Stroke order={3} stroke={ACCENT} d={rect(52, 40, 22, 18, 4)} />
      <Travel d="M33 23 H63 V49" duration={6} thickness={2.5} />
    </>
  ),
  /** A screen with content and one clear action. */
  experiences: () => (
    <>
      <Surface d={rect(20, 10, 56, 52, 6)} />
      <Stroke d={rect(20, 10, 56, 52, 6)} />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M28 22 h26 M28 30 h40 M28 38 h32" />
      <Stroke order={2} stroke={ACCENT} d={rect(28, 46, 24, 8, 4)} />
      <Pulse cx={40} cy={50} r={4} delay={0.4} />
    </>
  ),
  /** An idea given a shape: a box, with the point inside. */
  product: () => (
    <>
      <Surface d="M48 10 L72 22 L72 48 L48 60 L24 48 L24 22 Z" />
      <Stroke d="M48 10 L72 22 L72 48 L48 60 L24 48 L24 22 Z" />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M24 22 L48 34 L72 22 M48 34 V60" />
      <Float>
        <Pulse cx={48} cy={34} r={3} />
        <Dot order={2} cx={48} cy={34} r={3.5} />
      </Float>
    </>
  ),
  /** A journey from one point to the next. */
  ux: () => (
    <>
      <Stroke
        weight="fine"
        stroke={MUTED}
        strokeDasharray="2 5"
        d="M18 52 C 30 20, 50 60, 60 30 S 74 18, 78 20"
      />
      <Travel
        d="M18 52 C 30 20, 50 60, 60 30 S 74 18, 78 20"
        duration={6}
        shape="dot"
        thickness={6}
      />
      <Stroke order={1} d={circle(18, 52, 4)} />
      <Stroke order={2} stroke={ACCENT} d={circle(78, 20, 6)} />
      <Dot order={3} cx={78} cy={20} r={2.5} />
    </>
  ),
  /** A layout taking shape: header, content and a blue heading bar. */
  ui: () => (
    <>
      <Surface d={rect(16, 12, 64, 48, 6)} />
      <Stroke d={rect(16, 12, 64, 48, 6)} />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M16 22 h64" />
      <Float delay={-1}>
        <Stroke order={2} stroke={ACCENT} d={rect(24, 30, 30, 6, 3)} />
      </Float>
      <Stroke order={3} weight="fine" stroke={MUTED} d="M24 44 h40 M24 51 h28" />
      <Dot order={3} cx={22} cy={17} r={1.5} fill="currentColor" />
    </>
  ),
  /** A pointer tapping, the response rippling out. */
  interaction: () => (
    <>
      <Surface d={rect(18, 18, 44, 24, 12)} />
      <Stroke d={rect(18, 18, 44, 24, 12)} />
      <Pulse cx={40} cy={30} r={6} />
      <Pulse cx={40} cy={30} r={6} delay={1.5} />
      <Float distance={2}>
        <Stroke order={1} stroke={ACCENT} d="M52 34 L52 58 L58 52 L63 62 L67 60 L62 50 L70 50 Z" />
      </Float>
    </>
  ),
  /** Blocks stacking up into something real. */
  build: () => (
    <>
      <Surface d={rect(20, 46, 26, 14, 3)} />
      <Stroke d={rect(20, 46, 26, 14, 3)} />
      <Stroke order={1} d={rect(50, 46, 26, 14, 3)} />
      <Stroke order={2} d={rect(34, 30, 28, 14, 3)} />
      <Float distance={5}>
        <Stroke order={3} stroke={ACCENT} d={rect(38, 10, 20, 14, 3)} />
      </Float>
    </>
  ),
  /** Growth over time, a pulse climbing the line. */
  evolve: () => (
    <>
      <Stroke weight="fine" stroke={MUTED} d="M16 60 H80 M16 60 V12" />
      <Stroke order={1} d="M20 54 C 36 52, 44 44, 52 36 S 66 18, 76 16" />
      <Travel d="M20 54 C 36 52, 44 44, 52 36 S 66 18, 76 16" duration={7} thickness={2.5} />
      <Stroke order={2} stroke={ACCENT} d="M68 14 L76 16 L72 23" />
      <Pulse cx={76} cy={16} r={3} delay={0.8} />
    </>
  ),

  /* The portfolio's own set ("What I do"): same line language, new subjects. */

  /** Product design: one digital product, on a desktop screen and a phone. */
  'product-digital': () => (
    <>
      <Surface d={rect(10, 10, 58, 40, 5)} />
      <Stroke d={rect(10, 10, 58, 40, 5)} />
      <Stroke
        order={1}
        weight="fine"
        stroke={MUTED}
        d="M10 19 h58 M17 27 h22 M17 34 h30 M17 41 h16 M39 50 v8 M30 59 h18"
      />
      <Float delay={-1}>
        <Surface order={2} d={rect(60, 24, 24, 40, 5)} />
        <Stroke order={2} stroke={ACCENT} d={rect(60, 24, 24, 40, 5)} />
        <Stroke order={3} weight="fine" stroke={MUTED} d="M65 33 h14 M65 39 h10" />
        <Stroke order={3} stroke={ACCENT} d={rect(65, 49, 14, 7, 3.5)} />
      </Float>
    </>
  ),
  /** UX design: a flow of three screens, one clear step to the next. */
  steps: () => (
    <>
      {[10, 39].map((x, index) => (
        <g key={x}>
          <Surface order={index} d={rect(x, 22, 18, 26, 3)} />
          <Stroke order={index} d={rect(x, 22, 18, 26, 3)} />
          <Stroke
            order={index}
            weight="fine"
            stroke={MUTED}
            d={`M${x + 4} 30 h10 M${x + 4} 36 h7`}
          />
        </g>
      ))}
      <Stroke order={2} stroke={ACCENT} d={rect(68, 22, 18, 26, 3)} />
      <Stroke order={2} weight="fine" stroke={ACCENT} d="M72 30 h10 M72 36 h7" />
      <Stroke
        order={3}
        weight="fine"
        stroke={MUTED}
        d="M30 35 h7 M34 32 l3 3 l-3 3 M59 35 h7 M63 32 l3 3 l-3 3"
      />
      <Pulse cx={77} cy={35} r={4} delay={0.6} />
    </>
  ),
  /** UI design: a phone screen laid out clearly, one blue action. */
  screen: () => (
    <>
      <Surface d={rect(30, 4, 36, 64, 7)} />
      <Stroke d={rect(30, 4, 36, 64, 7)} />
      <Stroke order={1} d={rect(36, 12, 24, 16, 3)} />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M36 26 l7 -7 l5 5 l4 -3 l8 6" />
      <Stroke order={2} weight="fine" stroke={MUTED} d="M37 35 h22 M37 41 h15" />
      <Float delay={-1}>
        <Stroke order={3} stroke={ACCENT} d={rect(37, 50, 22, 9, 4.5)} />
      </Float>
    </>
  ),
  /** Interaction design: a pointer flips a switch on, the feedback ripples out. */
  toggle: () => (
    <>
      <Surface d={rect(14, 20, 46, 26, 13)} />
      <Stroke stroke={ACCENT} d={rect(14, 20, 46, 26, 13)} />
      <Pulse cx={47} cy={33} r={9} />
      <Stroke order={1} stroke={ACCENT} d={circle(47, 33, 9)} />
      <Dot order={1} cx={47} cy={33} r={3} />
      <Float distance={2}>
        <Stroke order={2} d="M58 40 L58 63 L63 58 L67 67 L71 65 L67 56 L74 56 Z" />
      </Float>
    </>
  ),
  /** UX flow revamp: the long way round, faded, and the straight route that replaces it. */
  rethink: () => (
    <>
      <Stroke
        weight="fine"
        stroke={MUTED}
        strokeDasharray="3 4"
        d="M18 42 V28 a8 8 0 0 1 8 -8 H70 a8 8 0 0 1 8 8 V42"
      />
      <Stroke order={1} stroke={ACCENT} d="M22 46 H74" />
      <Travel d="M22 46 H74" duration={4} thickness={2.5} />
      <Stroke order={2} d={circle(18, 46, 4)} />
      <Stroke order={2} stroke={ACCENT} d={circle(78, 46, 4)} />
      <Dot order={3} cx={78} cy={46} r={1.8} />
    </>
  ),
  /** Design systems: one main component, and every copy follows it. */
  system: () => (
    <>
      <Surface d={rect(36, 4, 24, 20, 4)} />
      <Stroke stroke={ACCENT} d={rect(36, 4, 24, 20, 4)} />
      <Dot cx={48} cy={14} r={3} />
      <Stroke
        order={1}
        weight="fine"
        stroke={MUTED}
        d="M48 24 V32 M20 32 H76 M20 32 V42 M48 32 V42 M76 32 V42"
      />
      {[10, 38, 66].map((x, index) => (
        <g key={x}>
          <Stroke order={2 + index * 0.3} d={rect(x, 42, 20, 18, 4)} />
          <Dot order={2 + index * 0.3} cx={x + 10} cy={51} r={2.5} fill="currentColor" />
        </g>
      ))}
    </>
  ),

  /* "How I work", step by step. */

  /** Understand: a lens held over the problem. */
  look: () => (
    <>
      <Stroke weight="fine" stroke={MUTED} d="M18 24 h28 M18 34 h20 M18 44 h26" />
      <Float distance={2}>
        <Surface d={circle(54, 34, 13)} />
        <Stroke order={1} stroke={ACCENT} d={circle(54, 34, 13)} />
        <Stroke order={2} stroke={ACCENT} d="M63 43 L74 54" />
      </Float>
    </>
  ),
  /** Question: a speech bubble holding the question. */
  ask: () => (
    <>
      <Surface d="M26 14 h44 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 h-24 l-10 10 v-10 h-10 a6 6 0 0 1 -6 -6 v-24 a6 6 0 0 1 6 -6 Z" />
      <Stroke d="M26 14 h44 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 h-24 l-10 10 v-10 h-10 a6 6 0 0 1 -6 -6 v-24 a6 6 0 0 1 6 -6 Z" />
      <Stroke order={1} stroke={ACCENT} d="M42 26 a6 6 0 1 1 8 5.6 c-2 0.8 -2 2 -2 4" />
      <Pulse cx={48} cy={42} r={2} delay={0.5} />
      <Dot order={2} cx={48} cy={42} r={2} />
    </>
  ),
  /** Simplify: many lines narrowed down to one blue one. */
  reduce: () => (
    <>
      <Stroke weight="fine" stroke={MUTED} d="M16 18 h28 M16 30 h22 M16 42 h30 M16 54 h18" />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M50 36 h8 M54 32 l4 4 l-4 4" />
      <Float delay={-1}>
        <Stroke order={2} stroke={ACCENT} d="M64 36 h16" />
      </Float>
    </>
  ),
  /** Shape: a rough outline being drawn into a clean form. */
  sketch: () => (
    <>
      <Stroke weight="fine" stroke={MUTED} strokeDasharray="3 4" d={rect(18, 16, 44, 40, 6)} />
      <Stroke order={1} stroke={ACCENT} d={rect(30, 26, 44, 34, 6)} />
      <Travel d="M30 32 V54 a6 6 0 0 0 6 6 H68" duration={6} thickness={2.5} />
    </>
  ),
  /** Refine: sliders nudged until it feels right. */
  tune: () => (
    <>
      <Stroke weight="fine" stroke={MUTED} d="M18 22 H78 M18 36 H78 M18 50 H78" />
      <Stroke order={1} d={circle(34, 22, 5)} />
      <Float delay={-1.5}>
        <Stroke order={2} stroke={ACCENT} d={circle(62, 36, 5)} />
      </Float>
      <Stroke order={3} d={circle(46, 50, 5)} />
    </>
  ),
};

/** One step illustration, sized for a rail column (`size` is its widest, in px; null leaves sizing to CSS). */
export function Glyph({name, size = 96}: {name: GlyphName; size?: number | null}) {
  return (
    <Illustration viewBox={VIEW_BOX} maxWidth={size ?? undefined}>
      {glyphs[name]()}
    </Illustration>
  );
}
