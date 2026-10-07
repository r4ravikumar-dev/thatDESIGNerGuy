import type {Metadata, Viewport} from 'next';
import './globals.css';
import {Providers} from './providers';
import {SiteShell} from '@/components/layout/SiteShell';
import {site} from '@/content/site';

/** The tagline without its *accent* markers, for titles and metadata. */
const plainTagline = site.tagline.replaceAll('*', '');
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Splash, splashSeenScript} from '@/components/navigation/Splash';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${plainTagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Product Design',
    'UX Design',
    'UI Design',
    'Interaction Design',
    'UX Flow Revamp',
    'SaaS Product Design',
    'No-code Design',
    'Design Systems',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} · ${plainTagline}`,
    description: site.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · ${plainTagline}`,
    description: site.description,
  },
};

/**
 * The site has no light/dark toggle: it always follows the device setting.
 * These tell the browser both schemes are supported and colour the mobile
 * browser bar to match the page (Stone's --color-background-surface).
 */
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#ffffff'},
    {media: '(prefers-color-scheme: dark)', color: '#1b1b1f'},
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    // The theme attribute is rendered on the server so theme colours apply from
    // the first paint, before JavaScript runs (no flash of the wrong scheme).
    // data-scroll-behavior: keep smooth scrolling for in-page links, but let
    // Next.js jump instantly between pages (see ScrollManager).
    // suppressHydrationWarning: the inline splash script may add the
    // splash-seen class to <html> before React hydrates (this element only).
    <html
      lang="en"
      data-astryx-theme="portfolio"
      data-scroll-behavior="smooth"
      suppressHydrationWarning>
      <head>
        {/* Hide the first-visit splash before the first paint if this session has already seen it. */}
        <script dangerouslySetInnerHTML={{__html: splashSeenScript}} />
        <noscript>
          <style>{'.splash{display:none}'}</style>
        </noscript>
        {/* Typefaces: IBM Plex Sans headings and body (with IBM Plex Sans Devanagari and Noto Sans Kannada for the name), IBM Plex Mono eyebrows, Instrument Serif accent words. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400..700;1,400&family=IBM+Plex+Sans+Devanagari:wght@400;500&family=Noto+Sans+Kannada:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Splash />
          <SiteShell>{children}</SiteShell>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
