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

export const contactClosing = {
  label: 'Good things start somewhere.',
  line: 'Sometimes all it takes is a *hello.*',
};
