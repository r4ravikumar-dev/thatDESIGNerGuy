import {site} from './site';

/**
 * Contact page copy (V2), in page order. Written for both recruiters and
 * clients. "*word*" sets the italic serif accent.
 */

export const contactHero = {
  label: 'Say hello · Let’s connect',
  title: 'Got something in mind? Let’s *talk.*',
  description:
    'Whether it’s a product design opportunity, an interesting project, or simply an idea you’d like to discuss, I’d be happy to hear from you.',
};

export const contactForm = {
  index: 1,
  label: 'Let’s start somewhere.',
  title: 'Let’s start *somewhere.*',
  intro: 'A little about you and what brings you here.',
  fields: {
    name: {label: 'Your name', placeholder: 'What should I call you?'},
    email: {label: 'Email address', placeholder: 'Where can I reach you?'},
    topic: {label: 'What’s this about?'},
    message: {label: 'Your message', placeholder: 'Tell me a little about it...'},
  },
  topics: ['A job opportunity', 'A freelance project', 'A collaboration', 'Just saying hello'],
  submit: 'Send it my way',
  sending: 'Sending…',
  success: {
    title: 'Message *received!*',
    body: 'Thanks for reaching out. I’ll get back to you as soon as I can.',
    again: 'Send another message',
  },
  error: 'That didn’t go through. Give it another try.',
  illustration: {
    sent: 'An envelope with a blue tick: your message was sent',
    error: 'An envelope in red with a warning mark: the message wasn’t sent',
  },
  /** Shown under a field left empty or filled in wrongly. */
  required: {
    name: 'Tell me what to call you.',
    email: 'I’ll need an email to reply to.',
    emailFormat: 'That email doesn’t look quite right.',
    message: 'Tell me a little about it first.',
  },
  /** Shown when no form service is set up and the message opens in the visitor's email app. */
  mailFallback: 'Your email app should open with the message ready. Just hit send.',
};

export const contactDirect = {
  index: 2,
  label: 'Prefer the direct route?',
  title: 'No forms, no *fuss.*',
  intro: 'Just drop me an email. I’m happy to take it from there.',
  email: {label: 'Send an email', value: site.email, href: `mailto:${site.email}`},
  linkedin: {label: 'LinkedIn', value: 'Connect with Ravi', href: site.linkedinUrl},
};

/**
 * The sign-off: the closing line, whose "hello" rolls through the three
 * scripts of the site's name (English, Hindi, Kannada), over the rippling dot
 * grid, with two small ways to actually say it.
 */
export const contactClosing = {
  label: 'Good things start somewhere.',
  /**
   * The line before the rolling word, as two lines ("\n"), so the line with
   * the word never re-wraps as it changes. Full sentence: `${lead} hello.`
   */
  lead: 'Sometimes all it takes\nis a',
  hellos: [
    {text: 'hello', lang: 'en', name: 'English'},
    {text: 'नमस्ते', lang: 'hi', name: 'हिन्दी'},
    {text: 'ನಮಸ್ಕಾರ', lang: 'kn', name: 'ಕನ್ನಡ'},
  ],
  languages: 'Say it in',
  /**
   * "Say hello" opens the visitor's email app with this filled in. "{hello}"
   * is the greeting in the script they picked (Hello, नमस्ते, ನಮಸ್ಕಾರ).
   */
  wave: {
    label: 'Say hello',
    subject: 'Hello from your portfolio',
    body: [
      '{hello} Ravi,',
      '',
      "I came across your portfolio and wanted to say hello.",
      '',
      'A little about me',
      'Name:',
      'Role and company:',
      '',
      "What I'd like to talk about",
      '(a role, a project, or simply a chat)',
      '',
      'A good time to talk:',
      '',
      'Looking forward to it,',
    ].join('\n'),
  },
  copy: {label: 'Copy my email', done: 'Copied. Talk soon!'},
  note: 'English, Hindi or Kannada. Whatever feels most like you.',
};
