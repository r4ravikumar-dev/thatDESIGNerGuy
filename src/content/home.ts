import type {SequenceStep} from '@/components/editorial/SequenceRail';

/** Homepage copy, in page order. "*word*" sets the italic serif accent. */

export const hero = {
  /** Block 1: one name in three scripts (English, Hindi, Kannada). */
  hello: {
    label: "Hello, I'm",
    names: [
      {text: 'Ravi Kumar', lang: 'en'},
      {text: 'रवि कुमार', lang: 'hi'},
      {text: 'ರವಿ ಕುಮಾರ್', lang: 'kn'},
    ],
    role: 'Product & UX Designer',
    scroll: 'Scroll',
  },
  /** Block 2: "*word*" sets the italic serif accent. */
  intro: {
    label: 'In short',
    text: '*That DESIGNer Guy* who enjoys making complicated things feel simple.',
  },
  /** Block 3: a short headline, then the story. */
  story: {
    label: 'So far',
    title: 'Products, interfaces and design *systems.*',
    paragraphs: [
      'My work so far has taken me through digital products, interfaces, and design systems, giving me the chance to explore different kinds of products and the problems that come with them.',
      'I enjoy getting involved in the process, understanding the problem, and seeing how an idea takes shape.',
    ],
  },
};

export const manifesto = {
  label: 'How I see it',
  text: "People don't experience screens. They experience what happens *between* them. The hesitation, the extra step, the choice that almost works. I look closely at those moments, then make them *simpler.*",
};

export const disciplines = {
  index: 1,
  label: 'What I do',
  title: 'Design that holds up when things get *complicated.*',
  items: [
    {
      title: 'Product Design',
      description: 'Shape a product around what people actually need.',
      glyph: 'product-digital',
    },
    {title: 'UX Design', description: 'Create journeys that are easier to follow.', glyph: 'steps'},
    {
      title: 'UI Design',
      description: 'Build interfaces that feel clear, consistent and intentional.',
      glyph: 'screen',
    },
    {
      title: 'Interaction Design',
      description: 'Make actions, feedback and transitions easier to understand.',
      glyph: 'toggle',
    },
    {
      title: 'UX Flow Revamp',
      description: 'Find the parts of an experience that get in the way, then rethink them.',
      glyph: 'rethink',
    },
    {
      title: 'Design Systems',
      description:
        'Foundations, components and patterns that keep a product consistent as it grows.',
      glyph: 'system',
    },
  ] satisfies SequenceStep[],
  /** The phrases that slide past under the rail as the page scrolls. */
  principles: [
    'Clarity before decoration',
    'People before screens',
    'Questions before answers',
    'Simple, not simplistic',
    'Consistency without sameness',
  ],
};

export const work = {
  index: 2,
  label: 'Selected work',
  title: 'Work worth *slowing down* for.',
  action: {label: 'All work', href: '/work'},
};

export const process = {
  index: 3,
  label: 'How I work',
  title: "I don't rush to make it *look* good.",
  steps: [
    {title: 'Understand', description: 'What are people trying to do?', glyph: 'look'},
    {
      title: 'Question',
      description: 'Where do they stop, wonder or work too hard?',
      glyph: 'ask',
    },
    {
      title: 'Simplify',
      description: 'What can be removed, changed or made clearer?',
      glyph: 'reduce',
    },
    {
      title: 'Shape',
      description: 'Turn the thinking into something people can use.',
      glyph: 'sketch',
    },
    {title: 'Refine', description: 'Keep going until it feels natural.', glyph: 'tune'},
  ] satisfies SequenceStep[],
};

export const closing = {
  label: 'Say hello',
  title: 'Got something that feels *difficult?*',
  note: "Tell me where you are. I'll start from there.",
};
