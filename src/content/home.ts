import type {GlyphName} from '@/components/illustrations/glyphs';
import type {SequenceStep} from '@/components/editorial/SequenceRail';

/** Homepage copy, in page order. "*word*" sets the italic serif accent. */

export const hero = {
  /** Block 1: one name in three scripts (English, Hindi, Kannada). */
  hello: {
    label: 'Product Designer · UI/UX Designer',
    names: [
      {text: 'Ravi Kumar', lang: 'en'},
      {text: 'रवि कुमार', lang: 'hi'},
      {text: 'ರವಿ ಕುಮಾರ್', lang: 'kn'},
    ],
    /** The signature line, under the name ("*word*" sets the serif accent). */
    headline: 'Making complicated things *feel* simpler.',
    supporting: 'Mobile apps, digital products, and the details that make them work.',
    scroll: 'Scroll to explore',
    /** The portrait leads to the About page (the cursor's tag over it). */
    portraitAction: {label: 'Know more about Ravi', href: '/about'},
  },
  /** Block 2: "*word*" sets the italic serif accent. */
  intro: {
    label: 'In short',
    text: '*That DESIGNer Guy* who likes figuring things out.',
  },
  /** Block 3: a short headline, then the story. */
  story: {
    label: 'So far',
    title: 'From mobile apps to the details that make them *work.*',
    paragraphs: [
      'I’m Ravi Kumar, a product designer. My work so far has taken me across mobile apps, digital products, interfaces, and design systems.',
      'I enjoy getting involved in the process, understanding what’s needed, and working through the details that help an idea take shape.',
    ],
  },
};

/**
 * The Work section, right after the hero. Add a project to `projects` and it
 * gets its own full-height thumbnail; `thumbnail: {src, alt}` (an image in
 * /public) replaces the placeholder panel.
 */
export const workShowcase = {
  label: 'Work',
  /** One word in three scripts, like the hero name. */
  names: [
    {text: 'Work', lang: 'en'},
    {text: 'काम', lang: 'hi'},
    {text: 'ಕೆಲಸ', lang: 'kn'},
  ],
  supporting: 'A few things I’ve had a hand in.',
  /** The cursor's tag over a project. */
  viewLabel: 'View project',
  projects: [
    {
      label: 'Mamily × Visit Health',
      thumbnail: {
        src: '/work/mamily.webp',
        focus: 'left center',
        alt: 'Womenhood Care Program banner from the Mamily integration in the Visit Health app',
      },
      title: 'Making women’s wellness easier to reach.',
      description:
        'Worked on bringing Mamily into the Visit Health app, shaping how people discover and access women’s wellness support through the product.',
      meta: ['Women’s Wellness', 'Mobile App', 'Visit Health'],
    },
    {
      label: 'Joye × Visit Health',
      thumbnail: {
        src: '/work/joye.webp',
        alt: 'Welcome to Joye screen with three hand-drawn blue mascots',
      },
      title: 'Making space for emotional wellness.',
      description:
        'Worked on integrating Joye into Visit Health and shaping the emotional assessment journey for corporate employees, with clear steps and guidance throughout.',
      meta: ['Emotional Wellness', 'Mobile App', 'Visit Health'],
    },
    {
      label: 'Dental Care Service Line',
      thumbnail: {
        src: '/work/dental.webp',
        focus: '12% center',
        alt: 'Visit Dental mobile app screens: cashless dental booking, pre-auth approval and appointment details',
      },
      title: 'Taking the guesswork out of dental care.',
      description:
        'Reworked the dental journey to make each step easier to follow, with clearer information so users know what’s happening and what comes next.',
      meta: ['Dental Care', 'UX/UI', 'Mobile App'],
    },
  ] as WorkProject[],
};

/**
 * About, after Work. The copy avoids em dashes (house style): the two in the
 * supplied text became a colon and a pair of commas.
 */
export const aboutSection = {
  label: 'About',
  names: [
    {text: 'About', lang: 'en'},
    {text: 'मेरे बारे में', lang: 'hi'},
    {text: 'ನನ್ನ ಬಗ್ಗೆ', lang: 'kn'},
  ],
  supporting: 'A little more about the guy behind the screens.',
  /** "*word*" sets the italic serif accent. */
  lead: 'I’m Ravi Kumar: a product designer, occasional *overthinker*, and someone who likes figuring out why things work the way they do.',
  /** The way on to the About page. */
  action: {label: 'Get to know me', href: '/about'},
  body: 'I found my way into design through that curiosity, and somewhere along the way it became what I do. Since then, I’ve worked across mobile apps, digital products, and design systems, picking up a few lessons, and a lot of screens, along the way.',
};

/** How I got here: the timeline after About. Dates use en dashes (house style). */
export const timeline = {
  label: 'How I got here',
  title: 'A few stops along the *way.*',
  /** The sub-headline, pinned under the title with it. */
  supporting: 'From writing code to designing what people use, one stop at a time.',
  stops: [
    {
      date: '2021–2025',
      glyph: 'code' as GlyphName,
      title: 'B.Tech · Computer Science',
      story:
        'Started with computer science and gradually found myself exploring the design side of technology. Along the way, I began learning UX/UI principles and experimenting with digital interfaces.',
      listLabel: '',
      items: [] as string[],
    },
    {
      date: 'Aug 2025–Present',
      glyph: 'idcard' as GlyphName,
      title: 'UI/UX Designer · Visit Health',
      story:
        'Stepped into the world of real products and healthcare experiences, working on new features, existing journeys, and the design system behind them.',
      listLabel: 'A few things along the way',
      items: [
        'Explored different Visit Health products and user journeys',
        'Designed new features and reworked existing flows',
        'Worked on Mamily and Joye integrations',
        'Contributed to the dental care experience',
        'Worked on design systems and reusable components',
      ],
    },
  ],
};

export type WorkProject = {
  /** The client or product, shown as the numbered eyebrow ("01 — Dental Care"). */
  label: string;
  title: string;
  description: string;
  /** Who, what and when, e.g. ['Visit Health', 'Product Design', '2025–26']. */
  meta: string[];
  /** `focus` is the CSS object-position kept in view when the panel crops it. */
  thumbnail?: {src: string; alt: string; focus?: string};
  /** Where the project opens (its case study). Until there is one: the Work page. */
  href?: string;
};

/** Icon keys for a discipline's "covers" row (mapped to icons in DisciplineDeck). */
export type CoverIcon =
  | 'search'
  | 'idea'
  | 'layers'
  | 'route'
  | 'network'
  | 'check'
  | 'palette'
  | 'grid'
  | 'phone'
  | 'pointer'
  | 'toggle'
  | 'sparkles'
  | 'scan'
  | 'branch'
  | 'workflow'
  | 'shapes'
  | 'component'
  | 'book';

export type Discipline = {
  title: string;
  description: string;
  glyph: GlyphName;
  /** Three short things the discipline covers, shown as an icon row. */
  covers: {label: string; icon: CoverIcon}[];
};

export const manifesto = {
  label: 'How I see it',
  text: "People don't experience screens. They experience what happens *between* them. The hesitation, the extra step, the choice that almost works. I look closely at those moments, then make them *simpler.*",
};

export const disciplines = {
  index: 1,
  label: 'What I do',
  title: 'I make sense of the messy *bits.*',
  /** Each discipline is a full-screen card in the pinned deck (DisciplineDeck). */
  items: [
    {
      title: 'Product Design',
      description:
        'Working through what a product needs, from the first idea to the details people use.',
      glyph: 'product-digital',
      covers: [
        {label: 'User research', icon: 'search'},
        {label: 'Product thinking', icon: 'idea'},
        {label: 'Prototyping', icon: 'layers'},
      ],
    },
    {
      title: 'UX Design',
      description: 'Making journeys easier to follow, one step at a time.',
      glyph: 'steps',
      covers: [
        {label: 'User journeys', icon: 'route'},
        {label: 'Information architecture', icon: 'network'},
        {label: 'Usability testing', icon: 'check'},
      ],
    },
    {
      title: 'UI Design',
      description: 'Making screens clear, useful, and easy to understand.',
      glyph: 'screen',
      covers: [
        {label: 'Visual design', icon: 'palette'},
        {label: 'Layout & type', icon: 'grid'},
        {label: 'Responsive screens', icon: 'phone'},
      ],
    },
    {
      title: 'Interaction Design',
      description: 'Thinking through what happens after every tap, click, and action.',
      glyph: 'toggle',
      covers: [
        {label: 'Micro-interactions', icon: 'pointer'},
        {label: 'Feedback & states', icon: 'toggle'},
        {label: 'Motion', icon: 'sparkles'},
      ],
    },
    {
      title: 'Flow Improvements',
      description: 'Finding where a journey gets confusing and making the next step clearer.',
      glyph: 'rethink',
      covers: [
        {label: 'Flow audits', icon: 'scan'},
        {label: 'Friction mapping', icon: 'branch'},
        {label: 'Simpler flows', icon: 'workflow'},
      ],
    },
    {
      title: 'Design Systems',
      description: 'Creating reusable pieces that help a product stay consistent as it grows.',
      glyph: 'system',
      covers: [
        {label: 'Foundations & tokens', icon: 'shapes'},
        {label: 'Components', icon: 'component'},
        {label: 'Documentation', icon: 'book'},
      ],
    },
  ] satisfies Discipline[],
  /** The phrases that slide past under the rail as the page scrolls. */
  principles: [
    'Clarity before decoration',
    'People before screens',
    'Questions before answers',
    'Simple, not simplistic',
    'Consistency without sameness',
  ],
};

export const process = {
  index: 3,
  label: 'How I work',
  title: 'Make it work. Then make it *worth* looking at.',
  steps: [
    {
      title: 'Understand',
      description: 'Get clear on what people are actually trying to do.',
      glyph: 'look',
    },
    {
      title: 'Question',
      description: 'Look for the parts that slow them down or leave them guessing.',
      glyph: 'ask',
    },
    {
      title: 'Simplify',
      description: 'Keep what helps. Rethink what gets in the way.',
      glyph: 'reduce',
    },
    {
      title: 'Shape',
      description: 'Turn the thinking into something people can follow and use.',
      glyph: 'sketch',
    },
    {
      title: 'Refine',
      description: 'Adjust the details until the whole thing feels right.',
      glyph: 'tune',
    },
  ] satisfies SequenceStep[],
};

/** The closing nudge: written for recruiters, ending in a conversation. */
export const closing = {
  label: 'Say hello',
  title: 'Got a role in mind? Let’s *talk.*',
  intro:
    'Hiring for a product design role or looking for a hand with a digital product? I’d be glad to hear what you’re working on. Drop me a message, and we can take it from there.',
  note: 'Email me and we can set up a call.',
};
