'use client';

import {useEffect, useState} from 'react';
import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
import {HStack} from '@astryxdesign/core/Layout';
import {Icon} from '@astryxdesign/core/Icon';
import {MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';
import {Menu} from 'lucide-react';
import {isActivePath} from './isActivePath';
import {Wordmark} from './Wordmark';
import {openResume} from './resume';
import {brand, mobileMenu} from '@/content/navigation';
import {headerLinks, site} from '@/content/site';

/** A document with "PDF" on it, in the illustration system's line style. */
function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" aria-hidden>
      <path
        d="M14 2.75H7.5a2 2 0 0 0-2 2v14.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7.25zM14 2.75v4.5h4.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <text
        x={12}
        y={17.2}
        textAnchor="middle"
        fontSize={5.6}
        fontWeight={700}
        letterSpacing={0.2}
        fontFamily="'IBM Plex Sans', sans-serif"
        fill="currentColor">
        PDF
      </text>
    </svg>
  );
}

/** The LinkedIn mark as a rounded outline, in the same line style. */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" aria-hidden>
      <rect x={3} y={3} width={18} height={18} rx={5} stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M8.5 10.5v6M8.5 7.6v.1M12 16.5v-3.4a2.1 2.1 0 0 1 4.2 0v3.4M12 10.5v6"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The portfolio header, on the page frame (.page-frame), so its edges line up
 * with the frame lines. Desktop: page links on the left, the "ravikumar"
 * wordmark centred, the résumé and LinkedIn as square icon cells on the right.
 * Below 768px: the wordmark on the left and a Menu cell on the right; links,
 * résumé and LinkedIn move into the drawer (MobileMenu). The bar's glass and
 * bottom rule come from the app shell styles.
 */
/**
 * Whether the visitor has scrolled past the page's opening: past the hero on
 * the homepage, past most of the first screen elsewhere.
 */
function usePastOpening(pathname: string) {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.portfolio-hero');
    if (hero) {
      // The hero has gone once none of it shows below the header.
      const observer = new IntersectionObserver(
        ([entry]) => setIsPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        {rootMargin: '-96px 0px 0px 0px'},
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }
    const update = () => setIsPast(window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  return isPast;
}

export function PortfolioHeader() {
  const pathname = usePathname();
  const {isMobile} = useAppShellMobile();
  const isPastOpening = usePastOpening(pathname);

  if (isMobile) {
    return (
      <HStack
        as="nav"
        aria-label="Main"
        className="portfolio-header"
        vAlign="center"
        justify="between">
        <Wordmark height={26} />
        <HStack gap={0} className="portfolio-header-icons">
          <MobileNavToggle label={mobileMenu.openLabel}>
            <Icon icon={Menu} size="md" color="inherit" />
          </MobileNavToggle>
        </HStack>
      </HStack>
    );
  }

  return (
    <nav aria-label="Main" className="portfolio-header portfolio-header-desktop">
      <HStack as="ul" gap={0} className="portfolio-header-links">
        {headerLinks.map(link => {
          const isActive = !link.href.includes('#') && isActivePath(pathname, link.href);
          return (
            <li key={link.href}>
              <NextLink
                href={link.href}
                className="portfolio-header-link"
                aria-current={isActive ? 'page' : undefined}>
                {link.label}
              </NextLink>
            </li>
          );
        })}
      </HStack>
      {/* The wordmark, centred; once past the opening, the role slides in
        beside it (without moving the name). */}
      <span className="portfolio-header-brand">
        <Wordmark height={30} />
        <span
          className="portfolio-header-role"
          data-shown={isPastOpening || undefined}
          aria-hidden={!isPastOpening}>
          {brand.role}
        </span>
      </span>
      <HStack gap={0} className="portfolio-header-icons">
        <a
          className="portfolio-header-icon"
          href={site.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={openResume}
          aria-label="Résumé (PDF, opens in a new tab and downloads)">
          <PdfIcon />
        </a>
        {site.linkedinUrl && (
          <a
            className="portfolio-header-icon"
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)">
            <LinkedInIcon />
          </a>
        )}
      </HStack>
    </nav>
  );
}
