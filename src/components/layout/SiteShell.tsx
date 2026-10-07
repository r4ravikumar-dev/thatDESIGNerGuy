'use client';

import {AppShell} from '@astryxdesign/core/AppShell';
import {VStack} from '@astryxdesign/core/Layout';
import {PortfolioHeader} from '@/components/navigation/PortfolioHeader';
import {MobileMenu} from '@/components/navigation/MobileMenu';
import {PageTransition} from '@/components/navigation/PageTransition';
import {CustomCursor} from '@/components/navigation/CustomCursor';
import {Footer} from './Footer';

/**
 * Page frame from the Astryx "shell-top-nav" template: AppShell with the
 * portfolio header. AppShell provides the skip link and the <main> landmark.
 * Below the md breakpoint (768px) the header shows its own "Menu" toggle and
 * MobileMenu fills the drawer.
 * The page frame draws two hairlines along the content column, the full
 * height of the page (.page-frame in globals.css).
 */
export function SiteShell({children}: {children: React.ReactNode}) {
  return (
    <>
      <AppShell
        variant="surface"
        height="auto"
        topNav={<PortfolioHeader />}
        mobileNav={{hasToggle: false, content: <MobileMenu />}}>
        <VStack gap={0}>
          {children}
          <Footer />
        </VStack>
      </AppShell>
      {/* The page frame: two hairlines along the content column's edges. */}
      <span aria-hidden className="page-frame" />
      <PageTransition />
      <CustomCursor />
    </>
  );
}
