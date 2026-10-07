/**
 * responsive tiers, measured against the reference studios
 * (Studio RS, Havu, Visuvate, Creativeans, Levo):
 *
 * | Tier        | Width        | What changes                                      |
 * |-------------|--------------|---------------------------------------------------|
 * | mobile-sm   | < 390        | display type eases down so long words still fit   |
 * | mobile-lg   | 390 – 767    | the v1 mobile sizes; single column, menu toggle   |
 * | tablet      | 768 – 1023   | two-column grids; stacked split layouts           |
 * | desktop-sm  | 1024 – 1439  | sticky split layouts; horizontal diagrams         |
 * | desktop-lg  | 1440 – 1599  | the v1 desktop sizes; display type keeps growing  |
 * | max         | 1600 +       | snaps: nothing scales further; a 1600px frame     |
 *
 * Display and headline sizes, gutters and section spacing are fluid between
 * anchor widths; body text steps and stays steady, as on every reference.
 * From 1600px the site stops scaling and the content frame (header included)
 * holds at 1600px, centred, so actions never drift to the far edges.
 *
 * These are the Astryx theme width breakpoints (portfolioTheme.ts), so theme
 * adaptations use the same names: sm, md, lg, xl, 2xl.
 */
export const BREAKPOINTS = {sm: 390, md: 768, lg: 1024, xl: 1440, '2xl': 1600} as const;

/** Viewport widths where fluid values hit their named size. "max" is where scaling stops. */
export const ANCHORS = {mobileSm: 320, mobile: 390, desktop: 1440, wide: 1600} as const;

const round = (value: number) => Math.round(value * 10000) / 10000;
const rem = (px: number) => `${round(px / 16)}rem`;

/**
 * A size that grows linearly from `fromPx` at `fromVw` to `toPx` at `toVw`,
 * held at those sizes outside the range. Emitted in rem so it respects the
 * reader's browser font size.
 */
export function fluid(fromPx: number, toPx: number, fromVw: number, toVw: number): string {
  if (fromPx === toPx) return rem(fromPx);
  const slope = (toPx - fromPx) / (toVw - fromVw);
  const intercept = fromPx - slope * fromVw;
  const min = Math.min(fromPx, toPx);
  const max = Math.max(fromPx, toPx);
  return `clamp(${rem(min)}, ${rem(intercept)} + ${round(slope * 100)}vw, ${rem(max)})`;
}

export {rem};
