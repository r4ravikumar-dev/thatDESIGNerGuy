import type {Metadata} from 'next';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Container} from '@/components/layout/Container';
import {Reveal} from '@/components/motion/Reveal';
import {CtaButton} from '@/components/navigation/CtaButton';
import {MissingPage} from '@/components/illustrations/scenes';
import {Lines} from '@/components/storytelling/Lines';
import {statusCopy} from '@/content/navigation';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/**
 * 404, centred, in the page-hero language: the missing-page illustration on top, a
 * giant "404" whose 0 is the brand's italic serif in blue, then the headline
 * (its own serif accent, "flow."), one line of context and the way back.
 * The numerals are decorative; the headline carries "Error 404" for screen
 * readers.
 */
export const metadata: Metadata = {title: 'Page not found'};

export default function NotFound() {
  const {title, description, action} = statusCopy.notFound;

  return (
    <Container gap={0} style={{paddingBlock: 'var(--space-chapter-gap) var(--space-section)'}}>
      <VStack gap={0} hAlign="center" style={{gap: 'var(--space-block)', textAlign: 'center'}}>
        <Reveal hAlign="center">
          <MissingPage label="A flow of pages that breaks off at a missing page" />
        </Reveal>
        <VStack gap={6} hAlign="center">
          <Reveal delay={0.05} hAlign="center">
            <Text type="supporting" color="secondary" style={EYEBROW_STYLE}>
              Error 404
            </Text>
          </Reveal>
          <Reveal delay={0.08} distance={40} hAlign="center">
            <Text
              aria-hidden
              className="not-found-numerals"
              style={{...typeRole('display-xxl'), letterSpacing: '-0.05em'}}>
              4<span className="not-found-zero">0</span>4
            </Text>
          </Reveal>
          <Reveal delay={0.12} hAlign="center">
            <Heading
              level={1}
              textWrap="balance"
              style={{
                ...typeRole('display-m'),
                letterSpacing: '-0.02em',
                maxInlineSize: '20ch',
                marginInline: 'auto',
              }}>
              <VisuallyHidden>Error 404: </VisuallyHidden>
              <Lines text={title} />
            </Heading>
          </Reveal>
          <Reveal delay={0.16} hAlign="center">
            <Text
              type="large"
              color="secondary"
              textWrap="pretty"
              style={{maxInlineSize: '36ch', marginInline: 'auto'}}>
              {description}
            </Text>
          </Reveal>
          <Reveal delay={0.2} hAlign="center">
            <HStack justify="center">
              <CtaButton {...action} />
            </HStack>
          </Reveal>
        </VStack>
      </VStack>
    </Container>
  );
}
