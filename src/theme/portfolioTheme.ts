import {defineTheme} from '@astryxdesign/core/theme';
import {stoneTheme} from '@astryxdesign/theme-stone';
import {astryxTypeMapping, typeTokens} from './typeScale';
import {CONTENT_MAX, ILLUSTRATION_SCALE, spaceTokens} from './spaceScale';
import {BREAKPOINTS} from './breakpoints';

/** Points each Astryx text style's size and line height at type role. */
const mappedTextTokens = Object.fromEntries(
  Object.entries(astryxTypeMapping).flatMap(([astryxType, role]) => [
    [`--text-${astryxType}-size`, `var(--type-${role}-size)`],
    [`--text-${astryxType}-leading`, `var(--type-${role}-leading)`],
  ]),
);

/** Form fields that Stone styles with its own error colour. */
const FIELD_COMPONENTS = [
  'text-input',
  'text-area',
  'selector',
  'multi-selector',
  'number-input',
  'date-input',
  'time-input',
  'typeahead',
  'tokenizer',
] as const;

const SYSTEM_SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
/** Headings, body and interface text. */
const BODY_FONT = `"IBM Plex Sans", ${SYSTEM_SANS}`;
/** Eyebrows, index numbers and code. */
const EYEBROW_FONT = '"IBM Plex Mono", "SF Mono", Menlo, Consolas, monospace';

/**
 * Everything the site's text styles depend on: sizes and line heights from
 * the type scale, the weights, and the IBM Plex families. Applied at the
 * root, and again on touch screens below 1024px, where Stone's "Mobile
 * Type" rule would otherwise swap in its own sizes, weights and fonts
 * (Figtree, Montserrat).
 */
const TEXT_TOKENS = {
  ...mappedTextTokens,
  '--font-family-body': BODY_FONT,
  '--font-family-heading': BODY_FONT,
  '--font-family-code': EYEBROW_FONT,
  // Body text and sub-headlines are set in medium (500).
  '--text-body-weight': 'var(--font-weight-medium)',
  '--text-large-weight': 'var(--font-weight-medium)',
  '--text-heading-1-weight': 'var(--font-weight-semibold)',
  '--text-heading-2-weight': 'var(--font-weight-semibold)',
  '--text-heading-3-weight': 'var(--font-weight-bold)',
  '--text-heading-4-weight': 'var(--font-weight-bold)',
  '--text-heading-5-weight': 'var(--font-weight-semibold)',
  '--text-heading-6-weight': 'var(--font-weight-semibold)',
  '--text-label-weight': 'var(--font-weight-medium)',
  '--text-code-weight': 'var(--font-weight-normal)',
  '--text-supporting-weight': 'var(--font-weight-normal)',
  '--text-display-1-weight': 'var(--font-weight-normal)',
  '--text-display-2-weight': 'var(--font-weight-normal)',
  '--text-display-3-weight': 'var(--font-weight-normal)',
};

/**
 * The theme: Astryx Stone (warm stone and slate) with IBM Plex Sans
 * for headings and body text, IBM Plex Mono for eyebrows, and:
 * - type scale (v1 plus the v2 expressive tier, typeScale.ts)
 * - space scale (spaceScale.ts)
 * - the brand blue from the logo, used sparingly: the primary action and
 *   accent keywords only
 * - an italic serif (Instrument Serif) for single accent words
 *
 * Responds across six tiers (breakpoints.ts): display type, gutters and
 * spacing are fluid; body text steps at 768px and 1024px.
 * After editing, rebuild the CSS with `npm run theme:build`.
 */
export const portfolioTheme = defineTheme({
  name: 'portfolio',
  extends: stoneTheme,
  localTokens: {
    ...typeTokens('base'),
    ...spaceTokens('base'),
    '--content-max': CONTENT_MAX,
    '--illustration-scale': ILLUSTRATION_SCALE.base,
    // Brand blue from the logo. Fill stays the same in both modes (white text on
    // it passes contrast); keyword text uses a lighter blue in dark mode.
    '--color-brand': '#2059DF',
    '--color-on-brand': '#FFFFFF',
    '--color-brand-text': ['#2059DF', '#8EAEFF'],
    '--font-family-accent': '"Instrument Serif", Georgia, "Times New Roman", serif',
    '--font-family-eyebrow': EYEBROW_FONT,
    // The logo: the original two brand blues in light mode; in dark mode the
    // text colours, which read as white and grey on the dark surface.
    '--color-logo-primary': ['#2059DF', 'var(--color-text-primary)'],
    '--color-logo-secondary': ['#0D39A0', 'var(--color-text-secondary)'],
    // Liquid glass (the header): a bright specular top edge, a soft lower
    // glint and a sheen, strong on light surfaces and restrained on dark.
    '--glass-highlight': ['rgb(255 255 255 / 0.9)', 'rgb(255 255 255 / 0.14)'],
    '--glass-edge': ['rgb(0 0 0 / 0.08)', 'rgb(255 255 255 / 0.07)'],
    '--glass-sheen': ['rgb(255 255 255 / 0.55)', 'rgb(255 255 255 / 0.06)'],
    '--glass-shadow': ['rgb(15 15 30 / 0.12)', 'rgb(0 0 0 / 0.45)'],
  },
  tokens: {
    ...TEXT_TOKENS,
    // Control heights on desktop: inputs and buttons both 36px.
    '--size-element-md': '36px',
    '--size-element-lg': '36px',

    // Errors: a true red (Stone's default is a muted brown). Text and icons
    // meet 4.5:1 on the page and on the muted form panel in both modes.
    '--color-error': ['hsl(0 72% 44%)', 'hsl(0 85% 72%)'],
    '--color-text-red': ['hsl(0 72% 44%)', 'hsl(0 85% 72%)'],
    '--color-icon-red': ['hsl(0 72% 44%)', 'hsl(0 85% 72%)'],
    '--color-on-error': ['hsl(0 70% 32%)', 'hsl(0 90% 88%)'],
    '--color-error-muted': ['hsl(0 86% 96%)', 'hsl(0 42% 18%)'],
    '--color-background-red': ['hsl(0 86% 96%)', 'hsl(0 42% 18%)'],
    '--color-border-red': ['hsl(0 70% 85%)', 'hsl(0 45% 32%)'],
  },
  components: {
    // Stone gives each form field its own muted-brown error colour; point
    // them all at red instead.
    ...Object.fromEntries(
      FIELD_COMPONENTS.map(component => [
        component,
        {'status:error': {'--color-error': 'var(--color-text-red)'}},
      ]),
    ),
    button: {
      // Every button size shares the large control height: 36px on
      // desktop, 48px on tablets and phones (see the below-lg rule).
      'size:sm': {height: 'var(--size-element-lg)', minHeight: 'var(--size-element-lg)'},
      'size:md': {height: 'var(--size-element-lg)', minHeight: 'var(--size-element-lg)'},
      'variant:primary': {
        backgroundColor: 'var(--color-brand)',
        color: 'var(--color-on-brand)',
      },
    },
  },
  adaptations: {
    widthBreakpoints: BREAKPOINTS,
    // Later rules win, so each narrower tier refines the one above it.
    rules: [
      // Touch screens below 1024px: undo Stone's Mobile Type rule so phones
      // and tablets keep the site's own type (sizes still step with the
      // width rules below).
      {
        when: {pointer: 'coarse', width: {below: 'lg'}},
        value: {tokens: TEXT_TOKENS},
      },
      // desktop-sm and below: fluid from the mobile to the desktop sizes.
      {
        when: {width: {below: 'xl'}},
        value: {
          localTokens: {
            ...typeTokens('below-xl'),
            ...spaceTokens('below-xl'),
            '--illustration-scale': ILLUSTRATION_SCALE.belowXl,
          },
        },
      },
      // tablet and phones: body text steps down, and touch-sized controls:
      // inputs 44px, buttons 48px.
      {
        when: {width: {below: 'lg'}},
        value: {
          localTokens: typeTokens('below-lg'),
          tokens: {'--size-element-md': '44px', '--size-element-lg': '48px'},
        },
      },
      // mobile-lg: body text steps down again.
      {when: {width: {below: 'md'}}, value: {localTokens: typeTokens('below-md')}},
      // mobile-sm: display type and spacing ease down so everything fits 320px.
      {
        when: {width: {below: 'sm'}},
        value: {localTokens: {...typeTokens('below-sm'), ...spaceTokens('below-sm')}},
      },
    ],
  },
});
