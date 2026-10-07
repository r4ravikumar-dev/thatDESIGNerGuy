import {ANCHORS, fluid, rem} from './breakpoints';

/**
 * Responsive Typography Scale v1, plus the v2 expressive tier.
 *
 * Desktop base 16px, mobile base 14px. v1 tops out at 56px (Display L). The
 * v2 tier adds Display XL (96px chapter titles) and Display XXL (144px, the
 * homepage hero only), each used at most once per section.
 *
 * How sizes respond across the tiers in breakpoints.ts:
 * - Display and headline roles are fluid: mobile size at 390px growing to the
 *   desktop size at 1440px, then on to the wide size at 1600px, where
 *   scaling stops. Below 390px
 *   they ease down to 85% so long words still fit a 320px screen.
 * - Labels, body and captions step: mobile below 768px, tablet to 1023px,
 *   desktop from 1024px, growing gently to the wide size at 1600px.
 */

export type TypeRole =
  | 'display-xxl'
  | 'display-xl'
  | 'display-l'
  | 'display-m'
  | 'display-s'
  | 'headline-xl'
  | 'headline-l'
  | 'headline-m'
  | 'headline-s'
  | 'label-l'
  | 'label-m'
  | 'label-s'
  | 'body-l'
  | 'body-m'
  | 'body-s'
  | 'caption-l'
  | 'caption-m'
  | 'caption-s';

type RoleSpec = {
  wide: number;
  desktop: number;
  tablet: number;
  mobile: number;
  lineHeight: number;
  /** Scales continuously with the viewport (display and headline roles). */
  isFluid: boolean;
};

/** Line heights by family: display 110%, headline/label 125%, body 135%, small body 140%, caption 150%. */
const LINE_HEIGHT = {
  hero: 0.95,
  chapter: 1,
  display: 1.1,
  headline: 1.25,
  label: 1.25,
  body: 1.35,
  smallBody: 1.4,
  caption: 1.5,
};

const display = (
  wide: number,
  desktop: number,
  tablet: number,
  mobile: number,
  lineHeight: number,
): RoleSpec => ({wide, desktop, tablet, mobile, lineHeight, isFluid: true});
const text = (
  wide: number,
  desktop: number,
  tablet: number,
  mobile: number,
  lineHeight: number,
): RoleSpec => ({wide, desktop, tablet, mobile, lineHeight, isFluid: false});

export const typeScale: Record<TypeRole, RoleSpec> = {
  // v2 expressive tier: used at most once per section.
  'display-xxl': display(153, 144, 104, 64, LINE_HEIGHT.hero),
  'display-xl': display(102, 96, 72, 48, LINE_HEIGHT.chapter),
  // v1 scale.
  'display-l': display(59, 56, 50, 44, LINE_HEIGHT.display),
  'display-m': display(50, 48, 44, 40, LINE_HEIGHT.display),
  'display-s': display(42, 40, 36, 36, LINE_HEIGHT.display),
  'headline-xl': display(37, 36, 34, 32, LINE_HEIGHT.headline),
  'headline-l': display(33, 32, 30, 28, LINE_HEIGHT.headline),
  'headline-m': display(29, 28, 26, 24, LINE_HEIGHT.headline),
  'headline-s': display(25, 24, 22, 20, LINE_HEIGHT.headline),
  'label-l': text(18, 18, 17, 16, LINE_HEIGHT.label),
  'label-m': text(16, 16, 15, 14, LINE_HEIGHT.label),
  'label-s': text(14, 14, 14, 14, LINE_HEIGHT.label),
  'body-l': text(20, 20, 18, 18, LINE_HEIGHT.body),
  'body-m': text(16, 16, 16, 14, LINE_HEIGHT.body),
  'body-s': text(14, 14, 14, 14, LINE_HEIGHT.smallBody),
  'caption-l': text(14, 14, 13, 13, LINE_HEIGHT.caption),
  'caption-m': text(13, 13, 12, 12, LINE_HEIGHT.caption),
  'caption-s': text(12, 12, 12, 12, LINE_HEIGHT.caption),
};

const sizeVar = (role: TypeRole) => `--type-${role}-size`;
const leadingVar = (role: TypeRole) => `--type-${role}-leading`;

/** Where in the theme a set of type tokens applies. */
export type TypeTier = 'base' | 'below-xl' | 'below-lg' | 'below-md' | 'below-sm';

const MOBILE_SM_RATIO = 0.85;

/**
 * Theme-local type tokens for one tier, e.g. {'--type-display-l-size': 'clamp(...)'}.
 * "base" is the root theme (1440px and up); the others are adaptations that
 * apply in order below each breakpoint.
 */
export function typeTokens(tier: TypeTier): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [role, spec] of Object.entries(typeScale) as [TypeRole, RoleSpec][]) {
    const size = (() => {
      switch (tier) {
        case 'base':
          return fluid(spec.desktop, spec.wide, ANCHORS.desktop, ANCHORS.wide);
        case 'below-xl':
          return spec.isFluid
            ? fluid(spec.mobile, spec.desktop, ANCHORS.mobile, ANCHORS.desktop)
            : rem(spec.desktop);
        case 'below-lg':
          return spec.isFluid ? undefined : rem(spec.tablet);
        case 'below-md':
          return spec.isFluid ? undefined : rem(spec.mobile);
        case 'below-sm':
          return spec.isFluid
            ? fluid(
                Math.round(spec.mobile * MOBILE_SM_RATIO),
                spec.mobile,
                ANCHORS.mobileSm,
                ANCHORS.mobile,
              )
            : undefined;
      }
    })();
    if (size) tokens[sizeVar(role)] = size;
    if (tier === 'base') tokens[leadingVar(role)] = String(spec.lineHeight);
  }
  return tokens;
}

/**
 * Inline style for a type role, for headings whose role differs from their
 * element's default (e.g. an <h3> set as Headline L). Values come from the
 * theme, so they follow the breakpoints automatically.
 */
export function typeRole(role: TypeRole) {
  return {fontSize: `var(${sizeVar(role)})`, lineHeight: `var(${leadingVar(role)})`};
}

/**
 * Astryx's built-in text styles, mapped onto scale. Components
 * that use `type="display-1"`, `<Heading level={2}>`, `type="large"` and so
 * on pick up the scale without any extra props.
 */
export const astryxTypeMapping: Record<string, TypeRole> = {
  'display-1': 'display-l',
  'display-2': 'display-m',
  'display-3': 'display-s',
  'heading-1': 'headline-xl',
  'heading-2': 'headline-l',
  'heading-3': 'headline-s',
  'heading-4': 'label-l',
  'heading-5': 'label-m',
  'heading-6': 'label-s',
  large: 'body-l',
  body: 'body-m',
  label: 'label-s',
  supporting: 'caption-m',
  code: 'body-s',
};
