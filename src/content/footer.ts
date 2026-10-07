import {navLinks, projectAction} from './navigation';
import {site} from './site';

/** The one footer used on every page. "*word*" sets the italic serif accent. */
export const footer = {
  statement: site.tagline,
  description:
    'Product and UX designer, designing products, interfaces and systems that are easier to understand.',
  explore: {
    title: 'Explore',
    links: navLinks.map(({label, href, hint}) => ({label, href, hint})),
  },
  contact: {
    email: {label: 'Email', value: site.email, href: `mailto:${site.email}`},
    linkedin: {label: 'LinkedIn', value: 'Ravi Kumar', href: site.linkedinUrl},
    project: {label: 'Work with me', value: projectAction.label, href: projectAction.href},
    top: {label: 'Back to', value: 'Top'},
  },
  note: {title: 'Lately'},
  closing: 'Still figuring things out.\nThat’s where good things start.',
};
