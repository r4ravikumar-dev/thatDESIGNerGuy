import type {SequenceStep} from '@/components/editorial/SequenceRail';

/** About page copy, in page order. "*word*" sets the italic serif accent. */

export const aboutHero = {
  label: 'About',
  title: 'Curious by habit. Designer by *choice.*',
  description:
    'I’ve always been curious about why some things feel easy to use while others make you stop and think. That curiosity is what led me to design. Since then, I’ve found myself exploring different products, working through problems, and figuring out what makes an experience work.',
};

export const profile = {
  label: 'Ravi Kumar',
  name: 'Ravi Kumar',
  role: 'Product Designer · UI/UX Designer',
  quote: 'I like taking things apart, not to break them, but to understand what makes them *work.*',
  bio: 'I’m currently working as a UI/UX Designer at Visit Health, where I’ve been involved in building new features and rethinking existing experiences across mobile products.',
  team: 'My work has taken me through women’s wellness, emotional wellness, dental care, and design systems. I enjoy getting into the details, exploring different possibilities, and working with people who aren’t afraid to ask one more question.',
};

export const beliefs = {
  index: 2,
  label: 'What I believe',
  title: 'A few things I keep *coming back* to.',
  /** Built like How I work: cards in a grid that builds as it scrolls in (SequenceRail). */
  items: [
    {
      title: 'People first',
      description:
        'A product should make sense to the person using it, not just the person building it.',
      glyph: 'interaction',
    },
    {
      title: 'Make it clear',
      description: 'People shouldn’t have to guess what happens next.',
      glyph: 'ux',
    },
    {
      title: 'Keep what matters',
      description:
        'Simpler doesn’t mean less useful. It’s about knowing what belongs and what doesn’t.',
      glyph: 'reduce',
    },
    {
      title: 'Stay curious',
      description: 'Ask another question. The first answer isn’t always the whole story.',
      glyph: 'ask',
    },
  ] satisfies SequenceStep[],
};

export const aboutClosing = {
  label: 'Say hello',
  title: 'Good work starts with a *conversation.*',
  intro:
    'Have a role in mind, a project to discuss, or an interesting problem to figure out? I’d like to hear about it.',
  note: 'Tell me a little about it. We’ll take it from there.',
};
