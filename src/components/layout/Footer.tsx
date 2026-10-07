'use client';

import type {ReactNode} from 'react';
import NextLink from 'next/link';
import {useReducedMotion} from 'framer-motion';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Icon} from '@astryxdesign/core/Icon';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {ArrowUp, ArrowUpRight} from 'lucide-react';
import {Container} from './Container';
import {Logo} from '@/components/navigation/Logo';
import {Lines} from '@/components/storytelling/Lines';
import {Reveal} from '@/components/motion/Reveal';
import {footer} from '@/content/footer';
import {site} from '@/content/site';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

const labelStyle = EYEBROW_STYLE;

function ColumnTitle({children}: {children: string}) {
  return (
    <Text type="supporting" color="secondary" style={labelStyle}>
      {children}
    </Text>
  );
}

/** One cell of the contact bar: a small label over a larger value, with an arrow. */
function BarCell({label, value, icon}: {label: string; value: string; icon: ReactNode}) {
  return (
    <HStack gap={4} justify="between" vAlign="end" width="100%">
      <VStack gap={1} style={{minInlineSize: 0}}>
        <Text type="supporting" color="secondary" style={labelStyle}>
          {label}
        </Text>
        <Text style={{...typeRole('headline-s'), overflowWrap: 'anywhere'}}>{value}</Text>
      </VStack>
      <span className="footer-bar-arrow" aria-hidden>
        {icon}
      </span>
    </HStack>
  );
}

/**
 * The site-wide footer (copy in content/footer.ts), on the theme's muted
 * surface so it follows light and dark mode: a statement, a contact bar divided by
 * hairlines, quiet columns, a tiny meta row, and the wordmark set huge
 * across the full width as a sign-off.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const reduceMotion = useReducedMotion();
  const {email, linkedin, project, top} = footer.contact;
  const arrowOut = <Icon icon={ArrowUpRight} size="md" color="inherit" />;

  return (
    <VStack as="footer" gap={0} className="site-footer">
      <Container
        gap={0}
        style={{gap: 'var(--space-chapter-gap)', paddingBlockStart: 'var(--space-section)'}}>
        {/* Statement */}
        <Grid columns={{minWidth: 320, max: 2}} gap={8} style={{alignItems: 'end'}}>
          <Reveal distance={32}>
            <Heading level={2} style={{...typeRole('display-l'), letterSpacing: '-0.03em'}}>
              <Lines text={footer.statement} />
            </Heading>
          </Reveal>
          <Reveal delay={0.08}>
            <Text type="large" color="secondary" textWrap="pretty" style={{maxInlineSize: '36ch'}}>
              {footer.description}
            </Text>
          </Reveal>
        </Grid>

        {/* Contact bar: 4 cells on desktop, 2 on tablet, 1 on mobile. */}
        <Grid columns={4} gap={0} className="footer-bar">
          <a className="footer-bar-cell" href={email.href}>
            <BarCell label={email.label} value={email.value} icon={arrowOut} />
          </a>
          {linkedin.href && (
            <a className="footer-bar-cell" href={linkedin.href} target="_blank" rel="noreferrer">
              <BarCell label={linkedin.label} value={linkedin.value} icon={arrowOut} />
              <VisuallyHidden>(opens in new tab)</VisuallyHidden>
            </a>
          )}
          <NextLink className="footer-bar-cell" href={project.href}>
            <BarCell label={project.label} value={project.value} icon={arrowOut} />
          </NextLink>
          <button
            type="button"
            className="footer-bar-cell"
            onClick={() => window.scrollTo({top: 0, behavior: reduceMotion ? 'auto' : 'smooth'})}>
            <BarCell
              label={top.label}
              value={top.value}
              icon={<Icon icon={ArrowUp} size="md" color="inherit" />}
            />
          </button>
        </Grid>

        {/* Columns */}
        <Grid columns={{minWidth: 240, max: 2}} gap={8}>
          <VStack gap={4} as="nav" aria-label={footer.explore.title}>
            <ColumnTitle>{footer.explore.title}</ColumnTitle>
            {footer.explore.links.map(item => (
              <HStack key={item.href} gap={3} vAlign="center" wrap="wrap">
                <Link href={item.href} isStandalone>
                  {item.label}
                </Link>
                <Text type="supporting">{item.hint}</Text>
              </HStack>
            ))}
          </VStack>
          <VStack gap={4}>
            <ColumnTitle>{footer.note.title}</ColumnTitle>
            <Text type="large" textWrap="balance">
              <Lines text={footer.closing} />
            </Text>
          </VStack>
        </Grid>

        {/* Meta */}
        <HStack
          gap={6}
          justify="between"
          vAlign="center"
          wrap="wrap"
          style={{
            borderBlockStart: '1px solid var(--color-border)',
            paddingBlockStart: 'var(--spacing-5)',
          }}>
          <Text type="supporting" style={labelStyle}>
            {site.name} © {year}
          </Text>
          <Text type="supporting" style={labelStyle}>
            {/* The signature, plain: no accent markers in the small caps line. */}
            {site.tagline.replace(/\*/g, '')}
          </Text>
        </HStack>
      </Container>

      {/* Giant wordmark, shown in full as the sign-off. Deliberately not a
          scroll reveal: as the last thing on the page it can't scroll far
          enough into view to trigger one on short (mobile) viewports. */}
      <Container
        gap={0}
        aria-hidden
        style={{marginBlockStart: 'var(--space-block)', paddingBlockEnd: 'var(--space-block)'}}>
        <VStack className="footer-wordmark-fade">
          <Logo isFluid />
        </VStack>
      </Container>
    </VStack>
  );
}
