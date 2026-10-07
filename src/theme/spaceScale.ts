import {ANCHORS, fluid} from './breakpoints';

/**
 * space scale: the generous rhythm that makes pages read as one idea
 * per screen. Every value is fluid between the anchor widths in
 * breakpoints.ts, the way the reference studios let space breathe with the
 * screen: 320px (mobile-sm), 390px (mobile), 1440px (desktop), 1600px (wide,
 * where scaling stops).
 */
type SpaceSpec = {mobileSm: number; mobile: number; desktop: number; wide: number};

export const spaceScale: Record<string, SpaceSpec> = {
  /** Top and bottom padding of every section. */
  '--space-section': {mobileSm: 72, mobile: 96, desktop: 160, wide: 169},
  /** Between a chapter's title block and its content. */
  '--space-chapter-gap': {mobileSm: 32, mobile: 40, desktop: 96, wide: 101},
  /** Between related blocks inside a section. */
  '--space-block': {mobileSm: 24, mobile: 32, desktop: 48, wide: 50},
  /** Side gutter between content and the edge of the screen. */
  '--space-gutter': {mobileSm: 16, mobile: 20, desktop: 64, wide: 71},
};

export type SpaceTier = 'base' | 'below-xl' | 'below-sm';

/** Theme-local space tokens for one tier ("base" is 1440px and up). */
export function spaceTokens(tier: SpaceTier): Record<string, string> {
  return Object.fromEntries(
    Object.entries(spaceScale).map(([name, spec]) => [
      name,
      tier === 'base'
        ? fluid(spec.desktop, spec.wide, ANCHORS.desktop, ANCHORS.wide)
        : tier === 'below-xl'
          ? fluid(spec.mobile, spec.desktop, ANCHORS.mobile, ANCHORS.desktop)
          : fluid(spec.mobileSm, spec.mobile, ANCHORS.mobileSm, ANCHORS.mobile),
    ]),
  );
}

/**
 * Widest the content column gets: a 1600px frame, gutters included. Below
 * 1600px content fills the screen minus the gutters; beyond it the frame
 * snaps and centres.
 */
export const CONTENT_MAX = 'calc(1600px - 2 * var(--space-gutter))';

/** Illustrations scale up a little on large screens: 1 below 1440px, 1.2 from there. */
export const ILLUSTRATION_SCALE = {base: '1.2', belowXl: '1'} as const;
