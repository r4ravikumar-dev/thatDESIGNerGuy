import {projectCta} from './site';

/**
 * Navigation copy, in the brand voice: clear, quiet, human, confident.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Announced to screen readers on desktop. */
  description: string;
  /** The small serif line that appears on hover. */
  hint: string;
  /** Shown under the label in the mobile menu. */
  mobileDescription: string;
};

export const navLinks: NavLink[] = [
  {
    label: 'Work',
    href: '/work',
    description: 'Selected work and the thinking behind it.',
    hint: 'Things I’ve worked on.',
    mobileDescription: 'Selected work and the thinking behind it.',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Who I am, what I believe and how I work.',
    hint: 'A little about me.',
    mobileDescription: 'Who I am, what I believe and how I work.',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Say hello, about a role, a project or an idea.',
    hint: 'Sometimes all it takes is a hello.',
    mobileDescription: 'Say hello, about a role, a project or an idea.',
  },
];

export const brand = {
  homeLabel: 'Back to Ravi Kumar home',
  /** Beside the header's wordmark once the visitor is past the hero. */
  role: 'Product Designer',
};

export const projectAction = {
  ...projectCta,
  description: 'Have something worth figuring out?',
  hint: 'Bring me the problem',
};

export const mobileMenu = {
  openLabel: 'Menu',
  title: 'Explore',
  prompt: 'Something on your mind?',
};

/** The first-visit welcome: Ravi's ID card, then the way in. */
export const welcome = {
  name: 'Ravi Kumar',
  role: 'Product & UX Designer',
  currentLabel: 'Currently at',
  current: 'Visit Health',
  /** The company's logo, beside its name on the card (add the file at this path). */
  currentLogo: '/brands/visit-health.svg',
  action: 'Get to know Ravi',
};

export const statusCopy = {
  loading: 'One moment…',
  notFound: {
    title: 'Looks like we lost the *flow.*',
    description: "The page you're looking for isn't here.",
    action: {label: 'Back home', href: '/'},
  },
};
