import {site} from './site';

/**
 * Case studies, newest first. Add an entry here and it appears on the
 * homepage and on /work. Until there is at least one, both show an honest
 * "being written up" note instead of placeholder projects.
 */
export type CaseStudy = {
  title: string;
  /** One line: the problem and what changed. */
  summary: string;
  /** e.g. "Product design · 2026". */
  meta: string;
  /** A case study page or an external link. */
  href: string;
};

export const caseStudies: CaseStudy[] = [];

export const workEmpty = {
  title: 'Case studies are being written up.',
  description:
    'Until they are, I am happy to walk you through the work, the problems behind it and how I approached them.',
  action: {label: 'Say hello', href: `mailto:${site.email}`},
};

/** A featured project on /work. */
export type WorkFeature = {
  /** Anchor on /work (the homepage's project banners link here). */
  slug: string;
  /** The product, with the Visit Health association kept consistent. */
  label: string;
  /** The area, after the number: "01 / Women's wellness". */
  area: string;
  /** Disciplines, as a quiet uppercase line. */
  tags: string[];
  /** "*word*" sets the italic serif accent. */
  title: string;
  description: string;
  /** What the project centred on, e.g. "Mamily integration · Mobile experience". */
  focus: string;
  image: {src: string; alt: string; focus?: string};
  /** Its case study once there is one. Until then, Explore project opens /contact. */
  href?: string;
  /** Each project gets its own composition (WorkFeatures). */
  layout: 'wide' | 'split' | 'split-reverse';
};

/** Work page copy (V2), in page order. "*word*" sets the italic serif accent. */
export const workPage = {
  hero: {
    label: 'Selected work · 01–03',
    title: 'A closer look at the things I’ve *worked on.*',
    description:
      'A few projects from my time at Visit Health. Different people, different needs, and different problems to figure out along the way.',
  },
  /** The project link, and the cursor's tag over a project picture. */
  exploreLabel: 'Explore project',
  projects: [
    {
      slug: 'mamily',
      label: 'Mamily × Visit Health',
      area: 'Women’s wellness',
      tags: ['Women’s Wellness', 'Mobile App', 'Product Design'],
      title: 'Making women’s wellness easier to *reach.*',
      description:
        'Bringing Mamily into the Visit Health experience and shaping how users discover and access women’s wellness services through the app.',
      focus: 'Mamily integration · Mobile experience',
      image: {
        src: '/work/mamily.webp',
        focus: 'left center',
        alt: 'Womenhood Care Program banner from the Mamily integration in the Visit Health app',
      },
      layout: 'wide',
    },
    {
      slug: 'joye',
      label: 'Joye × Visit Health',
      area: 'Emotional wellness',
      tags: ['Emotional Wellness', 'Mobile App', 'Product Design'],
      title: 'Making space for emotional *wellness.*',
      description:
        'Working on the Joye integration and shaping a guided emotional assessment experience for corporate employees, making each step easier to understand and follow.',
      focus: 'Joye integration · Assessment experience',
      image: {
        src: '/work/joye.webp',
        alt: 'Welcome to Joye screen with three hand-drawn blue mascots',
      },
      layout: 'split',
    },
    {
      slug: 'dental',
      label: 'Dental Care × Visit Health',
      area: 'Dental care',
      tags: ['Dental Care', 'Mobile App', 'UX/UI Design'],
      title: 'Taking the guesswork out of dental *care.*',
      description:
        'Reworking the dental journey to make it easier to follow, with clearer information and guidance at every step so users know what’s happening and what comes next.',
      focus: 'User journey · Flow improvements',
      image: {
        src: '/work/dental.webp',
        // A squarer crop here than on the homepage: keep the phones in view.
        focus: 'right center',
        alt: 'Visit Dental mobile app screens: cashless dental booking, pre-auth approval and appointment details',
      },
      layout: 'split-reverse',
    },
  ] satisfies WorkFeature[] as WorkFeature[],
  closing: {
    label: 'Want to know what goes into the work?',
    title: 'There’s more to every screen than meets the *eye.*',
    intro:
      'I’m always happy to talk through the thinking, the decisions, and the little details behind a project.',
    note: 'No polished brief needed.',
    action: {label: 'Let’s talk', href: '/contact'},
  },
};
