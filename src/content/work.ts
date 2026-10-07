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

export const workPage = {
  hero: {
    label: 'Work',
    title: "Things I've made, and how I *thought* about them.",
    description: 'Selected projects across product design, UX, interfaces and design systems.',
  },
  closing: {
    label: 'Say hello',
    title: 'Something worth *figuring out?*',
    note: 'No perfect brief required.',
  },
};
