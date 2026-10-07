'use client';

import type {ReactNode} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';

type StickySplitProps = {
  /** Stays pinned on the left while the right side scrolls past (desktop only). */
  aside: ReactNode;
  children: ReactNode;
};

/**
 * Two-column editorial layout: a heading pinned on the left (5 of 12 columns)
 * while the story scrolls on the right (7 of 12). Stacks below 1024px.
 * Column widths and the sticky offset live in .sticky-split in globals.css.
 */
export function StickySplit({aside, children}: StickySplitProps) {
  return (
    <Grid columns={1} className="sticky-split" style={{gap: 'var(--space-chapter-gap)'}}>
      <VStack className="sticky-split-aside" gap={6}>
        {aside}
      </VStack>
      <VStack gap={0} style={{gap: 'var(--space-block)'}}>
        {children}
      </VStack>
    </Grid>
  );
}
