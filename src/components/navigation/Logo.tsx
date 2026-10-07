'use client';

/** The wordmark's drawing area. */
export const LOGO_WIDTH = 232;
export const LOGO_HEIGHT = 48;
export const LOGO_VIEWBOX = `0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`;

type Paint = 'fill' | 'outline';

/**
 * "Ravi Kumar" in the brand's italic serif (Instrument Serif), in brand blue
 * like every serif on the site. Set at its natural width, sized to fill the
 * viewBox. "outline" draws strokes only (the splash outline before the fill
 * rises).
 */
export function LogoText({paint = 'fill'}: {paint?: Paint}) {
  const tone =
    paint === 'fill'
      ? {fill: 'var(--color-brand-text)'}
      : {fill: 'none', stroke: 'var(--color-brand-text)', strokeWidth: 0.6};
  return (
    <text
      x={1}
      y={40}
      fontFamily="'Instrument Serif', Georgia, serif"
      fontStyle="italic"
      fontWeight={400}
      fontSize={52}
      {...tone}>
      Ravi Kumar
    </text>
  );
}

type LogoProps = {
  /** Rendered height in px; width follows the logo's proportions. */
  height?: number;
  /** Fill the width of the container instead (for the giant footer wordmark). */
  isFluid?: boolean;
};

/**
 * Ravi Kumar's wordmark: the name in the italic serif, in brand blue.
 *
 * Decorative: the link around it carries the accessible name.
 */
export function Logo({height = 26, isFluid = false}: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      height={isFluid ? undefined : height}
      width={isFluid ? '100%' : (height * LOGO_WIDTH) / LOGO_HEIGHT}
      aria-hidden
      focusable="false"
      style={{display: 'block', overflow: 'visible'}}>
      <LogoText />
    </svg>
  );
}
