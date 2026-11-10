'use client';

import {usePathname, useRouter} from 'next/navigation';
import {HStack} from '@astryxdesign/core/Layout';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';

const SECTIONS = [
  {label: 'Case studies', href: '/write'},
  {label: 'Side work', href: '/write/side-work'},
];

/** Switches between the studio's sections: a grouped switch at the top of the page. */
export function StudioTabs() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <HStack className="studio-switch">
      <SegmentedControl label="Studio sections" value={pathname} onChange={href => router.push(href)}>
        {SECTIONS.map(section => (
          <SegmentedControlItem key={section.href} value={section.href} label={section.label} />
        ))}
      </SegmentedControl>
    </HStack>
  );
}
