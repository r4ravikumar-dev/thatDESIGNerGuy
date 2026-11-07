'use client';

import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Reveal} from '@/components/motion/Reveal';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {Lines} from '@/components/storytelling/Lines';
import {useTextReveal} from '@/motion/scroll';
import {contactClosing as copy} from '@/content/contact';
import {typeRole} from '@/theme/typeScale';

/** The Contact page's sign-off: one small label and one short line, centred. */
export function ContactClosing() {
  const lineRef = useTextReveal({delay: 0.05});
  return (
    <VStack gap={8} hAlign="center" style={{textAlign: 'center'}}>
      <Reveal>
        <IndexLabel>{copy.label}</IndexLabel>
      </Reveal>
      <Heading
        ref={lineRef}
        data-text-reveal
        level={2}
        textWrap="balance"
        style={{...typeRole('display-xl'), letterSpacing: '-0.03em', maxInlineSize: '16ch'}}>
        <Lines text={copy.line} />
      </Heading>
    </VStack>
  );
}
