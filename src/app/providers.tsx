'use client';

import Link from 'next/link';
import {MotionConfig} from 'framer-motion';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {portfolioTheme} from '@/theme/portfolio';
import {springs} from '@/motion/springs';
import {ScrollManager} from '@/components/navigation/ScrollManager';
import {SmoothScroll} from '@/components/motion/SmoothScroll';
import {ProjectGateProvider} from '@/components/work/ProjectGate';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    // mode="system": always follow the device's light/dark setting. There is no toggle.
    <Theme theme={portfolioTheme} mode="system">
      <LinkProvider component={Link}>
        <MotionConfig reducedMotion="user" transition={springs.spatial.default}>
          {/* Lenis smooth scrolling on GSAP's ticker (off with reduced motion). */}
          <SmoothScroll />
          <ScrollManager />
          {/* Case studies are locked for now: project links open a popup. */}
          <ProjectGateProvider>{children}</ProjectGateProvider>
        </MotionConfig>
      </LinkProvider>
    </Theme>
  );
}
