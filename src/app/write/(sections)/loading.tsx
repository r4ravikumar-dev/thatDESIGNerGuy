import {VStack} from '@astryxdesign/core/Layout';
import {Skeleton} from '@astryxdesign/core/Skeleton';

/** Shown under the switch the moment a section is chosen, until it loads. */
export default function StudioSectionLoading() {
  return (
    <VStack gap={4} aria-busy aria-label="Loading">
      <Skeleton height={32} width="40%" />
      <Skeleton height={56} index={1} />
      <Skeleton height={56} index={2} />
      <Skeleton height={56} index={3} />
    </VStack>
  );
}
