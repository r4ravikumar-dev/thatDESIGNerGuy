export const site = {
  name: 'Ravi Kumar',
  /** "*word*" sets the italic serif accent (splash, footer). */
  tagline: 'Making complicated things *feel* simpler.',
  description:
    'Ravi Kumar, product and UX designer: product design, user experience, interfaces and design systems.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  /** Change NEXT_PUBLIC_CONTACT_EMAIL to use a personal address. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'r4ravikumar2701@gmail.com',
  /** Phone for recruiters (e.g. +91 98765 43210). Until it's set, the call CTA asks for a call by email. */
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/r4ravikumar/',
  /** The résumé in the header. Put the file at public/Ravi-Kumar-Resume.pdf. */
  resumeUrl: '/Ravi-Kumar-Resume.pdf',
} as const;

export type NavItem = {label: string; href: string};

/**
 * The recruiter nudge on every page's closing section, "Let's talk": a
 * direct call when a phone number is set, otherwise an email.
 */
export const callCta: NavItem = {
  label: 'Let’s talk',
  href: site.phone
    ? `tel:${site.phone.replace(/[^+\d]/g, '')}`
    : `mailto:${site.email}?subject=${encodeURIComponent('Let’s talk')}`,
};

/** The main call to action: an email, so it works without a backend. */
export const projectCta: NavItem = {
  label: 'Let’s talk',
  href: `mailto:${site.email}`,
};

/** The header's page links. Contact jumps to the closing "Say hello" section. */
export const headerLinks: NavItem[] = [
  {label: 'Work', href: '/work'},
  {label: 'About', href: '/about'},
  {label: 'Contact', href: '#contact'},
];
