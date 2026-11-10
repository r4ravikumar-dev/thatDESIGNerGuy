import {VStack} from '@astryxdesign/core/Layout';

/**
 * Wraps each studio section afresh on every switch (a template re-mounts,
 * unlike the layout), so the new section fades and rises in under the
 * switch while the switch itself stays put.
 */
export default function StudioSectionTemplate({children}: {children: React.ReactNode}) {
  return (
    <VStack gap={6} className="studio-section-enter">
      {children}
    </VStack>
  );
}
