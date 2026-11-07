'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Link} from '@astryxdesign/core/Link';
import {Icon} from '@astryxdesign/core/Icon';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {ArrowUpRight} from 'lucide-react';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {Reveal} from '@/components/motion/Reveal';
import {BarCell} from '@/components/layout/Footer';
import {contactDirect as copy} from '@/content/contact';
import {typeRole} from '@/theme/typeScale';

/**
 * The form-free way in: the email as a giant link, then email and LinkedIn
 * as a pair of hairline cells, the same as the footer's contact bar.
 */
export function ContactDirect() {
  const arrow = <Icon icon={ArrowUpRight} size="md" color="inherit" />;
  return (
    <VStack gap={0} style={{gap: 'var(--space-block)'}}>
      <ChapterHeader
        index={copy.index}
        label={copy.label}
        title={copy.title}
        intro={copy.intro}
        size="display-l"
      />
      <Reveal delay={0.1}>
        <Link
          href={copy.email.href}
          className="giant-email"
          style={{
            ...typeRole('display-l'),
            // Shrinks on narrow screens so the address stays on one line.
            fontSize: 'min(var(--type-display-l-size), 5.6vw)',
            letterSpacing: '-0.03em',
            overflowWrap: 'anywhere',
          }}>
          {copy.email.value}
        </Link>
      </Reveal>
      <Reveal delay={0.16}>
        <Grid columns={2} gap={0} className="footer-bar contact-direct-bar">
          <a className="footer-bar-cell" href={copy.email.href}>
            <BarCell label="Email" value={copy.email.label} icon={arrow} />
          </a>
          <a className="footer-bar-cell" href={copy.linkedin.href} target="_blank" rel="noreferrer">
            <BarCell label={copy.linkedin.label} value={copy.linkedin.value} icon={arrow} />
            <VisuallyHidden>(opens in new tab)</VisuallyHidden>
          </a>
        </Grid>
      </Reveal>
    </VStack>
  );
}
