'use client';

import {useId, type ReactNode} from 'react';
import {motion, useReducedMotion, type Transition} from 'framer-motion';
import {welcome} from '@/content/navigation';

/**
 * Ravi's ID card, in the illustration language: line art in the text
 * colour, a soft surface, one brand-blue accent (the avatar and the name),
 * hanging from a lanyard.
 *
 * - "intro" (the first-visit welcome): the card drops in on its lanyard and
 *   settles with a swing, the avatar draws, then the name, the role and
 *   "Currently at Visit Health" arrive one after another.
 * - "loading" (the slow-page loader): the same card with shimmering
 *   placeholders where the details go, a blue arc circling the avatar, and
 *   a gentle swing (.id-card-loading in globals.css).
 *
 * With reduced motion everything is simply in place (the loading shimmer
 * and swing stop too).
 */
type IdCardProps = {variant: 'intro' | 'loading'; className?: string};

/** Seconds into the intro at which each part arrives. */
const AT = {
  card: 0.1,
  avatar: 0.75,
  name: 1.2,
  role: 1.55,
  divider: 1.85,
  current: 2.05,
} as const;

/** A long, soft deceleration for lines and text arriving. */
const ARRIVE = [0.2, 0, 0, 1] as const;

/** The swing the card settles with (underdamped, so it rocks and stops). */
const SWING: Transition = {type: 'spring', stiffness: 90, damping: 7, mass: 1};

export function IdCard({variant, className}: IdCardProps) {
  const reduceMotion = useReducedMotion();
  const isIntro = variant === 'intro';
  const animateIn = isIntro && !reduceMotion;

  /** A line that draws itself in at `delay`. */
  const draw = (delay: number) =>
    animateIn
      ? {
          initial: {pathLength: 0, opacity: 0},
          animate: {pathLength: 1, opacity: 1},
          transition: {
            pathLength: {duration: 0.9, delay, ease: ARRIVE},
            opacity: {duration: 0.01, delay},
          },
        }
      : {};
  /** Text that rises into place at `delay`. */
  const rise = (delay: number) =>
    animateIn
      ? {
          initial: {opacity: 0, y: 8},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.6, delay, ease: ARRIVE},
        }
      : {};

  const details: ReactNode = isIntro ? (
    <>
      <motion.text x={120} y={214} textAnchor="middle" className="id-card-name" {...rise(AT.name)}>
        {welcome.name}
      </motion.text>
      <motion.text x={120} y={238} textAnchor="middle" className="id-card-role" {...rise(AT.role)}>
        {welcome.role}
      </motion.text>
      <motion.path d="M84 256 H156" className="id-card-fine" {...draw(AT.divider)} />
      <motion.text
        x={120}
        y={276}
        textAnchor="middle"
        className="id-card-eyebrow"
        {...rise(AT.current)}>
        {welcome.currentLabel.toUpperCase()}
      </motion.text>
      {/* The company: its logo, then its name, centred together. */}
      <motion.g {...rise(AT.current + 0.15)}>
        <image
          href={welcome.currentLogo}
          x={72}
          y={281}
          width={16}
          height={16}
          preserveAspectRatio="xMidYMid meet"
        />
        <text x={94} y={294} className="id-card-current">
          {welcome.current}
        </text>
      </motion.g>
    </>
  ) : (
    // Placeholders, shimmering one after another while the page loads.
    <g className="id-card-skeleton">
      <rect x={68} y={204} width={104} height={11} rx={5.5} />
      <rect x={82} y={228} width={76} height={7} rx={3.5} />
      <path d="M84 256 H156" className="id-card-fine" />
      <rect x={94} y={269} width={52} height={6} rx={3} />
      <rect x={80} y={285} width={80} height={9} rx={4.5} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 240 330"
      className={['id-card', variant === 'loading' ? 'id-card-loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
      focusable="false">
      <motion.g
        className="id-card-swing"
        style={{originX: '50%', originY: '0%'}}
        {...(animateIn
          ? {
              initial: {y: -70, rotate: -9, opacity: 0},
              animate: {y: 0, rotate: 0, opacity: 1},
              transition: {
                y: {type: 'spring', stiffness: 120, damping: 14, delay: AT.card},
                rotate: {...SWING, delay: AT.card},
                opacity: {duration: 0.3, delay: AT.card},
              },
            }
          : {})}>
        {/* The lanyard and its clip. */}
        <motion.path d="M84 0 L109 60" className="id-card-strap" {...draw(AT.card)} />
        <motion.path d="M156 0 L131 60" className="id-card-strap" {...draw(AT.card)} />
        <rect x={104} y={54} width={32} height={14} rx={4} className="id-card-clip" />

        {/* The card. */}
        <rect x={24} y={64} width={192} height={256} rx={20} className="id-card-body" />
        <path d="M100 88 H140" className="id-card-slot" />

        {/* The avatar, in the brand accent. */}
        <motion.circle cx={120} cy={130} r={22} className="id-card-accent" {...draw(AT.avatar)} />
        <motion.path
          d="M92 178 C92 160 104 152 120 152 C136 152 148 160 148 178"
          className="id-card-accent"
          {...draw(AT.avatar + 0.15)}
        />
        {variant === 'loading' && (
          <circle cx={120} cy={140} r={44} className="id-card-spinner" pathLength={100} />
        )}

        {details}
      </motion.g>
    </svg>
  );
}

/**
 * The back of the ID card: the same lanyard, clip and card, with Ravi's
 * photo (the hero portrait, in the brand duotone) filling the card and his
 * name on a strip along the bottom. Static; the welcome flips to it on hover.
 */
export function IdCardBack({className}: {className?: string}) {
  const clipId = `${useId().replace(/:/g, '')}-photo`;
  return (
    <svg
      viewBox="0 0 240 330"
      className={['id-card', className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x={24} y={64} width={192} height={256} rx={20} />
        </clipPath>
      </defs>
      <path d="M84 0 L109 60" className="id-card-strap" />
      <path d="M156 0 L131 60" className="id-card-strap" />
      <rect x={24} y={64} width={192} height={256} rx={20} className="id-card-body" />
      <g clipPath={`url(#${clipId})`}>
        <image
          href="/ravi-portrait.webp"
          x={24}
          y={84}
          width={192}
          height={236}
          preserveAspectRatio="xMidYMin slice"
        />
        <rect x={24} y={276} width={192} height={44} className="id-card-photo-strip" />
      </g>
      <text x={120} y={304} textAnchor="middle" className="id-card-name">
        {welcome.name}
      </text>
      <rect x={24} y={64} width={192} height={256} rx={20} className="id-card-body id-card-frame" />
      <rect x={104} y={54} width={32} height={14} rx={4} className="id-card-clip" />
    </svg>
  );
}
