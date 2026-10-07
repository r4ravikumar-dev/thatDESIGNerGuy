'use client';

import {usePathname} from 'next/navigation';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';
import {ArrowUpRight} from 'lucide-react';
import {mobileMenu, navLinks, projectAction} from '@/content/navigation';
import {CONTENT_GUTTER, CONTENT_MAX_WIDTH} from '@/components/layout/Container';
import {HoverHint} from './HoverHint';
import {Wordmark} from './Wordmark';
import {isActivePath} from './isActivePath';

/**
 * Site header: wordmark, the four sections, and Start a project ↗.
 * Hovering an item reveals a quiet hint ("What we make"); the active page gets
 * a small dot. Vertical padding is 24px on desktop, 20px on tablet and 16px
 * on mobile (--nav-padding-block in globals.css).
 * On mobile it collapses to the wordmark and a "Menu" toggle.
 */
export function MainNav() {
  const pathname = usePathname();
  const {isMobile} = useAppShellMobile();

  return (
    <TopNav
      label="Main navigation"
      style={{
        // Centred and capped to the content column, so on wide screens the
        // items don't drift to the far edges. The bar's background stays full width.
        inlineSize: '100%',
        maxInlineSize: CONTENT_MAX_WIDTH,
        marginInline: 'auto',
        paddingInline: CONTENT_GUTTER,
        boxSizing: 'border-box',
        paddingBlock: 'var(--nav-padding-block)',
      }}
      heading={<Wordmark />}
      centerContent={navLinks.map(item => {
        const isActive = isActivePath(pathname, item.href);
        return (
          <HoverHint key={item.href} hint={item.hint}>
            <TopNavItem
              label={item.label}
              href={item.href}
              isSelected={isActive}
              aria-description={item.description}>
              <HStack gap={1} vAlign="center" as="span">
                {item.label}
                {isActive && (
                  <Text type="label" color="accent" aria-hidden>
                    ·
                  </Text>
                )}
              </HStack>
            </TopNavItem>
          </HoverHint>
        );
      })}
      endContent={
        isMobile ? (
          <MobileNavToggle label={mobileMenu.openLabel}>
            <Text type="label">{mobileMenu.openLabel}</Text>
          </MobileNavToggle>
        ) : (
          <HoverHint hint={projectAction.hint}>
            <Button
              label={projectAction.label}
              href={projectAction.href}
              variant="primary"
              aria-description={projectAction.description}
              endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />}
            />
          </HoverHint>
        )
      }
    />
  );
}
