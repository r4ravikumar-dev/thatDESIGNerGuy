'use client';

import NextLink from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {Tab, TabList} from '@astryxdesign/core/TabList';

const SECTIONS = [
  {label: 'Case studies', href: '/write'},
  {label: 'Side work', href: '/write/side-work'},
];

/** Switches between the studio's sections, at the top of the page. */
export function StudioTabs() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    // The tabs are links (open in a new tab, copy the address); a plain
    // click goes there through the router.
    <TabList value={pathname} onChange={href => router.push(href)} hasDivider aria-label="Studio sections">
      {SECTIONS.map(section => (
        <Tab key={section.href} value={section.href} label={section.label} href={section.href} as={NextLink} />
      ))}
    </TabList>
  );
}
