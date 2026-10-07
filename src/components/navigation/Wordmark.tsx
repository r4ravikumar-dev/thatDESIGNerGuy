'use client';

import type {MouseEvent} from 'react';
import {usePathname} from 'next/navigation';
import {Link} from '@astryxdesign/core/Link';
import {brand} from '@/content/navigation';
import {Logo} from './Logo';

/**
 * The logo, linking home. Always takes the visitor back to the very top of the
 * homepage, including when they are already on it.
 */
export function Wordmark({height}: {height?: number}) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent) {
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({top: 0});
  }

  return (
    <Link href="/" label={brand.homeLabel} onClick={handleClick}>
      <Logo height={height} />
    </Link>
  );
}
