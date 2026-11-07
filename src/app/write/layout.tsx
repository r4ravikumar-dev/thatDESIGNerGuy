import type {Metadata} from 'next';

/**
 * The private writing studio. Never indexed, never linked from the site, and
 * signed-in only (src/proxy.ts). The portfolio's header, footer and effects
 * stay out of it (isStudioPath).
 */
export const metadata: Metadata = {
  title: 'Studio',
  robots: {index: false, follow: false, nocache: true},
};

export default function WriteLayout({children}: {children: React.ReactNode}) {
  return children;
}
