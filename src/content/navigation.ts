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
    hint: "What I've made",
    mobileDescription: 'Selected work and the thinking behind it.',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Who I am, what I believe and how I work.',
    hint: 'Who I am',
    mobileDescription: 'Who I am, what I believe and how I work.',
  },
];

export const brand = {
  homeLabel: 'Back to Ravi Kumar home',
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

export const statusCopy = {
  loading: 'One moment…',
  notFound: {
    title: 'Looks like we lost the *flow.*',
    description: "The page you're looking for isn't here.",
    action: {label: 'Back home', href: '/'},
  },
};
