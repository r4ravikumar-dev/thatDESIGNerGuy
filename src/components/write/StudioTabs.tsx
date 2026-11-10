'use client';

import {useEffect, useState, useTransition} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {HStack} from '@astryxdesign/core/Layout';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';

const SECTIONS = [
  {label: 'Case studies', href: '/write'},
  {label: 'Side work', href: '/write/side-work'},
];

/**
 * Switches between the studio's sections: a grouped switch at the top of
 * the page, in the sections' shared layout so it stays mounted. A choice
 * shows at once (the highlight slides over while the section loads under
 * it), and both sections are prefetched so the switch is quick.
 */
export function StudioTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [chosen, setChosen] = useState(pathname);
  const [shownPath, setShownPath] = useState(pathname);

  // Follow the address when it changes another way (back, forward, a link).
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setChosen(pathname);
  }

  useEffect(() => {
    for (const section of SECTIONS) router.prefetch(section.href);
  }, [router]);

  return (
    <HStack className="studio-switch">
      <SegmentedControl
        label="Studio sections"
        value={chosen}
        onChange={href => {
          setChosen(href);
          startTransition(() => router.push(href));
        }}>
        {SECTIONS.map(section => (
          <SegmentedControlItem key={section.href} value={section.href} label={section.label} />
        ))}
      </SegmentedControl>
    </HStack>
  );
}
