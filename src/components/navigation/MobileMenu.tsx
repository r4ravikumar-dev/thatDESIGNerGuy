'use client';

import type {MouseEvent} from 'react';
import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {MobileNav} from '@astryxdesign/core/MobileNav';
import {Text} from '@astryxdesign/core/Text';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Button} from '@astryxdesign/core/Button';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';
import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {Reveal} from '@/components/motion/Reveal';
import {accentStyle} from '@/components/storytelling/Lines';
import {mobileMenu, navLinks, projectAction} from '@/content/navigation';
import {site} from '@/content/site';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';
import {Wordmark} from './Wordmark';
import {isActivePath} from './isActivePath';

/**
 * The mobile menu, in the editorial language of the site: the wordmark as
 * the header, large numbered rows on hairlines (like the Practice and
 * Thinking lists), and the project action with contact details pinned to
 * the bottom of the drawer.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const {closeMobileNav} = useAppShellMobile();

  // Any link inside the drawer navigates, so close the drawer when one is clicked.
  function closeOnLinkClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('a')) closeMobileNav();
  }

  return (
    <MobileNav header={<Wordmark />} width={480}>
      <VStack
        gap={0}
        justify="between"
        onClickCapture={closeOnLinkClick}
        style={{
          minBlockSize: '100%',
          gap: 'var(--spacing-10)',
          paddingBlock: 'var(--spacing-4) var(--spacing-6)',
        }}>
        <VStack gap={4} as="nav" aria-label="Menu">
          <Text type="supporting" color="secondary" style={EYEBROW_STYLE}>
            {mobileMenu.title}
          </Text>
          <VStack
            gap={0}
            as="ul"
            role="list"
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              borderBlockEnd: '1px solid var(--color-border)',
            }}>
            {navLinks.map((item, index) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <Reveal key={item.href} as="li" delay={0.04 * index} distance={16} speed="fast">
                  <NextLink
                    href={item.href}
                    className="menu-row"
                    aria-current={isActive ? 'page' : undefined}>
                    <HStack gap={4} style={{alignItems: 'baseline'}} width="100%">
                      <Text
                        type="supporting"
                        hasTabularNumbers
                        style={{
                          fontFamily: EYEBROW_STYLE.fontFamily,
                          minInlineSize: '3ch',
                          color: isActive
                            ? 'var(--color-brand-text)'
                            : 'var(--color-text-secondary)',
                        }}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                      <VStack gap={1} style={{flex: 1, minInlineSize: 0}}>
                        <HStack gap={3} style={{alignItems: 'baseline'}}>
                          <Heading
                            level={2}
                            style={{...typeRole('headline-xl'), letterSpacing: '-0.02em'}}>
                            {item.label}
                          </Heading>
                          {isActive && (
                            <Text color="secondary" style={accentStyle}>
                              Here
                            </Text>
                          )}
                        </HStack>
                        <Text color="secondary" textWrap="pretty">
                          {item.mobileDescription}
                        </Text>
                      </VStack>
                      <span className="menu-row-arrow" aria-hidden>
                        <Icon icon={ArrowRight} size="md" color="inherit" />
                      </span>
                    </HStack>
                  </NextLink>
                </Reveal>
              );
            })}
          </VStack>
        </VStack>

        <Reveal delay={0.2} distance={16} speed="fast">
          <VStack gap={5}>
            <VStack gap={3}>
              <Text type="large" style={accentStyle}>
                {mobileMenu.prompt}
              </Text>
              <Button
                label={projectAction.label}
                href={projectAction.href}
                variant="primary"
                size="lg"
                width="100%"
                endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />}
              />
            </VStack>
            <HStack
              gap={5}
              wrap="wrap"
              style={{
                borderBlockStart: '1px solid var(--color-border)',
                paddingBlockStart: 'var(--spacing-4)',
              }}>
              <a className="menu-contact" href={`mailto:${site.email}`}>
                <Text
                  type="supporting"
                  color="inherit"
                  style={{...EYEBROW_STYLE, color: 'inherit'}}>
                  {site.email}
                </Text>
              </a>
              <a className="menu-contact" href={site.resumeUrl} target="_blank" rel="noreferrer">
                <Text
                  type="supporting"
                  color="inherit"
                  style={{...EYEBROW_STYLE, color: 'inherit'}}>
                  Résumé ↗
                </Text>
                <VisuallyHidden>(PDF, opens in new tab)</VisuallyHidden>
              </a>
              {site.linkedinUrl && (
                <a
                  className="menu-contact"
                  href={site.linkedinUrl}
                  target="_blank"
                  rel="noreferrer">
                  <Text
                    type="supporting"
                    color="inherit"
                    style={{...EYEBROW_STYLE, color: 'inherit'}}>
                    LinkedIn ↗
                  </Text>
                  <VisuallyHidden>(opens in new tab)</VisuallyHidden>
                </a>
              )}
            </HStack>
          </VStack>
        </Reveal>
      </VStack>
    </MobileNav>
  );
}
