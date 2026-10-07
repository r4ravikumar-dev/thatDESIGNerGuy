/**
 * The eyebrow voice: small uppercase labels that name and number things
 * (section labels, column titles, meta rows, "Layer 01"). Set in IBM Plex
 * Mono so structure reads as quieter and more precise than the content,
 * always in brand blue (the same accessible blue as the serif accent).
 */
export const EYEBROW_STYLE = {
  fontFamily: 'var(--font-family-eyebrow)',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-brand-text)',
} as const;
