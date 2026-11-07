'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {ToggleButton, ToggleButtonGroup} from '@astryxdesign/core/ToggleButton';
import {Icon} from '@astryxdesign/core/Icon';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {Check, Copy, Hand} from 'lucide-react';
import {Reveal} from '@/components/motion/Reveal';
import {IndexLabel} from '@/components/editorial/IndexLabel';
import {RippleGrid} from '@/components/illustrations/RippleGrid';
import {accentStyle} from '@/components/storytelling/Lines';
import {contactClosing as copy} from '@/content/contact';
import {site} from '@/content/site';
import {springs} from '@/motion/springs';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/** How long each "hello" rests before the next script rolls in. */
const ROLL_MS = 2600;
/** How long the "Copied" confirmation stays. */
const COPIED_MS = 2200;

/**
 * The Contact page's sign-off, a small moment rather than a line of text:
 *
 * - the rippling dot grid behind it answers the pointer (RippleGrid);
 * - the accent word rolls through "hello" in the three scripts of the site's
 *   name (English, Hindi, Kannada). Hovering the line or choosing a script
 *   from the chips below holds it on that one;
 * - "Say hello" (its hand waves on hover) opens an email with the subject
 *   filled in, and "Copy my email" copies the address and says so.
 *
 * Screen readers hear the line once, as "…is a hello."; the rolling word is
 * visual only. With reduced motion the word swaps without rolling and never
 * changes by itself.
 */
export function ContactClosing() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isHeld, setIsHeld] = useState(false);
  const [isPicked, setIsPicked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);

  // Roll on to the next script, unless the line is hovered or a chip chose one.
  useEffect(() => {
    if (reduceMotion || isHeld || isPicked) return;
    const timer = window.setInterval(
      () => setIndex(current => (current + 1) % copy.hellos.length),
      ROLL_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion, isHeld, isPicked]);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const hello = copy.hellos[index];
  const isLatin = hello.lang === 'en';
  // The email "Say hello" opens: greeting in the chosen script, then a short
  // outline to fill in.
  const greeting = isLatin ? 'Hello' : hello.text;
  const helloMail = `mailto:${site.email}?subject=${encodeURIComponent(copy.wave.subject)}&body=${encodeURIComponent(copy.wave.body.replace('{hello}', greeting))}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // No clipboard access (an old browser or an insecure origin): open the
      // email app instead, which is what the visitor wanted anyway.
      window.location.href = `mailto:${site.email}`;
      return;
    }
    setIsCopied(true);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setIsCopied(false), COPIED_MS);
  };

  return (
    <>
      {/* The dot grid, filling the whole section (.closing-section). */}
      <span aria-hidden className="closing-grid">
        <RippleGrid />
      </span>

      <VStack gap={10} hAlign="center" className="closing" style={{textAlign: 'center'}}>
        <Reveal>
          <IndexLabel>{copy.label}</IndexLabel>
        </Reveal>

        <Reveal delay={0.05} distance={32}>
          <Heading
            level={2}
            textWrap="balance"
            onPointerEnter={() => setIsHeld(true)}
            onPointerLeave={() => setIsHeld(false)}
            style={{...typeRole('section-title'), letterSpacing: '-0.03em', maxInlineSize: 'none'}}>
            {copy.lead.split('\n').map((part, i) => (
              <span key={part}>
                {i > 0 && <br />}
                {part}
              </span>
            ))}{' '}
            <VisuallyHidden>{copy.hellos[0].text}.</VisuallyHidden>
            {/* The rolling word: each script slides up out of a mask. Its
              box eases to the new word's width, so the line re-centres
              smoothly instead of jumping. */}
            <motion.span
              aria-hidden
              className="closing-word"
              layout={!reduceMotion}
              transition={springs.spatial.default}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={hello.lang}
                  lang={hello.lang}
                  className="closing-word-text"
                  style={
                    isLatin
                      ? accentStyle
                      : {color: 'var(--color-brand-text)', letterSpacing: '-0.01em'}
                  }
                  initial={reduceMotion ? {opacity: 0} : {y: '100%', opacity: 0}}
                  animate={{y: '0%', opacity: 1}}
                  exit={reduceMotion ? {opacity: 0} : {y: '-100%', opacity: 0}}
                  transition={reduceMotion ? {duration: 0.15} : springs.spatial.default}>
                  {hello.text}
                </motion.span>
              </AnimatePresence>
              <span style={isLatin ? accentStyle : {color: 'var(--color-brand-text)'}}>.</span>
            </motion.span>
          </Heading>
        </Reveal>

        {/* Pick a script: holds the word on it. */}
        <Reveal delay={0.12}>
          <HStack gap={3} vAlign="center" hAlign="center" wrap="wrap" className="contact-topics closing-scripts">
            <Text type="supporting" style={{...EYEBROW_STYLE, color: 'var(--color-text-secondary)'}}>
              {copy.languages}
            </Text>
            <ToggleButtonGroup
              label={copy.languages}
              type="single"
              value={copy.hellos[index].lang}
              onChange={value => {
                const next = copy.hellos.findIndex(item => item.lang === value);
                if (next === -1) return;
                setIndex(next);
                setIsPicked(true);
              }}
              size="md">
              {copy.hellos.map(item => (
                <ToggleButton key={item.lang} value={item.lang} label={item.name} />
              ))}
            </ToggleButtonGroup>
          </HStack>
        </Reveal>

        <Reveal delay={0.18}>
          <VStack gap={4} hAlign="center">
            <HStack gap={3} hAlign="center" vAlign="center" wrap="wrap">
              <Button
                label={copy.wave.label}
                href={helloMail}
                variant="primary"
                size="lg"
                className="closing-wave"
                icon={<Icon icon={Hand} size="sm" color="inherit" />}
              />
              <Button
                label={isCopied ? copy.copy.done : copy.copy.label}
                variant="secondary"
                size="lg"
                onClick={copyEmail}
                icon={<Icon icon={isCopied ? Check : Copy} size="sm" color="inherit" />}
              />
            </HStack>
            <Text type="supporting" color="secondary" aria-live="polite">
              {isCopied ? `${site.email}` : copy.note}
            </Text>
          </VStack>
        </Reveal>
      </VStack>
    </>
  );
}
