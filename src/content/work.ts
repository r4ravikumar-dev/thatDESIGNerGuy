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
  /** True for a published case study from the studio: it opens its page instead of the boarding pass. */
  isLive?: boolean;
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
  /** The link once a project has a published case study. */
  viewCaseStudy: 'View case study',
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

/**
 * The case studies aren't open yet: any project a visitor clicks opens this
 * boarding pass instead (ProjectGate). "{project}" is the project's name and
 * "{code}" its three-letter destination code (MAM, JOY, DEN).
 *
 * Two ways off the pass:
 * - board: the stub tears off at the perforation, the pass is stamped
 *   "Boarded" and the visitor is taken to Contact to book a walkthrough;
 * - wait: the pass flips over to a VIP lounge card.
 */
export const boardingPass = {
  airline: 'RK Airways',
  kind: 'Boarding pass',
  close: 'Close boarding pass',
  from: {label: 'From', code: 'YOU', place: 'Right here'},
  to: {label: 'To'},
  front: {
    eyebrow: 'Now boarding · Case study',
    title: 'Fasten your *seatbelt.*',
    body: "This one is still on its way to its final destination. I'm polishing every screen so the ride is worth the wait.",
    fields: [
      {label: 'Passenger', value: 'You'},
      {label: 'Status', value: 'Final checks'},
      {label: 'Boarding', value: 'Very soon'},
    ],
    note: "Can't wait for landing? Board early and I'll walk you through it live, window seat included.",
    board: 'Book a walkthrough',
    wait: "I'll wait",
  },
  stub: {
    flight: 'Flight',
    seat: {label: 'Seat', value: '1A'},
    cabin: {label: 'Class', value: 'First'},
    tear: 'Tear here to board',
  },
  boarded: {
    stamp: 'Boarded',
    stampNote: 'Gate: Contact',
    title: "You're *boarded.*",
    body: 'Stub torn, seat saved. Taking you to the gate to pick a time for your walkthrough.',
  },
  vip: {
    eyebrow: 'RK Airways · VIP lounge',
    title: "You're on the *VIP* list.",
    body: "Thanks for waiting so gracefully. You're now a VIP member of RK Airways: first in line the moment {project} lands. Until then, the lounge is all yours.",
    fields: [
      {label: 'Member', value: 'You'},
      {label: 'Tier', value: 'First class'},
      {label: 'Perk', value: 'Priority boarding'},
    ],
    card: 'Member no. VIP-0001',
    done: 'Enjoy the lounge',
    flipBack: 'Back to my ticket',
  },
} as const;

/** A case study page's fixed copy (the story itself comes from the studio). */
export const caseStudyPage = {
  /** The downloadable versions, above the story. */
  downloads: {
    label: 'Prefer it offline?',
    /** The button, with the file's format ("Download PDF"). */
    button: 'Download {format}',
  },
  /** The end-of-story offer: the download, emailed to the visitor. {format} is PDF, presentation or document. */
  pdfRequest: {
    label: 'Take it with you',
    title: 'Want this case study as a *{format}?*',
    body: 'Leave your details and I’ll email it to you, ready to read offline or share with your team.',
    open: 'Email me the {format}',
    fields: {name: 'Your name', email: 'Email', phone: 'Mobile number'},
    submit: 'Send me the {format}',
    note: 'Your details only reach me. I use them to send the {format} and, if it helps, to follow up about the work.',
    sentTitle: 'On its *way.*',
    sentBody: 'Check your inbox at {email}. It can take a minute or two, and sometimes lands in spam.',
    preview: 'This form sends emails once the case study is published.',
  },
  next: 'Next case study',
  allWork: 'All work',
  closing: {
    label: 'Want to go deeper?',
    title: 'Happy to walk you through the *details.*',
    intro: 'The decisions, the trade-offs, and the bits that didn’t make it into the final screens.',
    note: 'No polished brief needed.',
    action: {label: 'Let’s talk', href: '/contact'},
  },
} as const;
