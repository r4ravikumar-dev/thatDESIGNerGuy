'use client';

import {useTransition} from 'react';
import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {LogOut, Plus} from 'lucide-react';
import {createCaseStudy, signOut} from '@/app/write/actions';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

const SECTIONS = [
  {label: 'Case studies', href: '/write'},
  {label: 'Side work', href: '/write/side-work'},
];

/** The studio's top bar: its name, its sections, New case study, and sign out. */
export function StudioHeader({children}: {children?: React.ReactNode}) {
  const [isCreating, startCreate] = useTransition();
  const pathname = usePathname();
  return (
    <HStack className="studio-bar" justify="between" vAlign="center" gap={4}>
      <HStack gap={4} vAlign="center">
        <NextLink href="/write" className="studio-home">
          <Text type="supporting" style={EYEBROW_STYLE}>
            Studio
          </Text>
        </NextLink>
        <HStack as="nav" aria-label="Studio sections" className="studio-nav" vAlign="center">
          {SECTIONS.map(section => (
            <NextLink
              key={section.href}
              href={section.href}
              className="studio-nav-link"
              aria-current={pathname === section.href ? 'page' : undefined}>
              <Text type="supporting" color="inherit" style={EYEBROW_STYLE}>
                {section.label}
              </Text>
            </NextLink>
          ))}
        </HStack>
        {children}
      </HStack>
      <HStack gap={2} vAlign="center">
        <Button
          label="New case study"
          variant="primary"
          size="sm"
          isLoading={isCreating}
          onClick={() => startCreate(() => createCaseStudy())}
          icon={<Icon icon={Plus} size="sm" color="inherit" />}
        />
        <Button
          label="Sign out"
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          icon={<Icon icon={LogOut} size="sm" color="inherit" />}
        />
      </HStack>
    </HStack>
  );
}
