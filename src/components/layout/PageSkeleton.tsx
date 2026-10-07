import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Container} from './Container';

/**
 * Shown while a page is still arriving on a slow connection, after the page
 * change loader has played. Shaped like the page hero (label, headline,
 * description, action and illustration) with the design system's staggered
 * shimmer, so the layout doesn't jump when the page lands.
 */
export function PageSkeleton() {
  return (
    <VStack
      gap={0}
      role="status"
      aria-live="polite"
      style={{
        paddingBlock: 'var(--space-chapter-gap) var(--space-section)',
        minHeight: '70svh',
      }}>
      <VisuallyHidden>Loading page</VisuallyHidden>
      <Container gap={0}>
        <Grid columns={1} className="hero-split" style={{gap: 'var(--space-block)'}}>
          <VStack gap={0} style={{gap: 'var(--space-block)'}}>
            <Skeleton width={140} height={12} radius="rounded" index={0} />
            <VStack gap={3}>
              <Skeleton width="78%" height="var(--type-display-xl-size)" index={1} />
              <Skeleton width="56%" height="var(--type-display-xl-size)" index={2} />
            </VStack>
            <VStack gap={2} style={{maxInlineSize: '36ch'}}>
              <Skeleton width="100%" height={16} index={3} />
              <Skeleton width="86%" height={16} index={4} />
              <Skeleton width="62%" height={16} index={5} />
            </VStack>
            <HStack>
              <Skeleton width={148} height="var(--size-element-lg)" radius="rounded" index={6} />
            </HStack>
          </VStack>
          <Skeleton width="100%" height="min(42vw, 340px)" radius={4} index={3} />
        </Grid>
      </Container>
    </VStack>
  );
}
