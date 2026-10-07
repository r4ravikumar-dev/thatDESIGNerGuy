'use client';

import {useRef} from 'react';
import {motion, useReducedMotion, useScroll, useTransform, type MotionValue} from 'framer-motion';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {typeRole} from '@/theme/typeScale';
import {accentStyle} from '@/components/storytelling/Lines';

type ManifestoProps = {
  /** "*words*" mark the italic serif accent (one or more words), in brand blue once lit. "\n" breaks a line. */
  text: string;
  /** A heading level, or "p" for a paragraph (the hero intro). */
  level?: 2 | 3 | 'p';
  align?: 'center' | 'start';
  /** Measure, in ch. */
  maxWidth?: number;
  /** Fully lit once its end reaches this point of the viewport (e.g. "45%"). */
  litBy?: `${number}%`;
};

type Token = {word: string; isKeyword: boolean; position: number} | {lineBreak: true};

/** Keywords: the italic serif accent used across the site (brand blue). */
const keywordStyle = accentStyle;

/**
 * Splits text into words (with their position among all words) and line
 * breaks. An accent can span several words: "*That DESIGNer Guy*".
 */
function tokenize(text: string): Token[] {
  let position = 0;
  let inAccent = false;
  return text.split('\n').flatMap((line, lineIndex) => {
    const words: Token[] = line
      .split(/\s+/)
      .filter(Boolean)
      .map(raw => {
        const opens = raw.startsWith('*');
        const closes = /\*[.,!?]?$/.test(raw);
        const isKeyword = inAccent || opens;
        if (opens) inAccent = true;
        if (closes) inAccent = false;
        return {word: raw.replace(/\*/g, ''), isKeyword, position: position++};
      });
    return lineIndex === 0 ? words : [{lineBreak: true}, ...words];
  });
}

function Word({
  word,
  isKeyword,
  progress,
  range,
}: {
  word: string;
  isKeyword: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span
      style={{
        opacity,
        ...(isKeyword ? keywordStyle : undefined),
      }}>
      {word}{' '}
    </motion.span>
  );
}

/**
 * A large paragraph whose words light up one by one as it scrolls through the
 * viewport, so the reader's pace sets the rhythm. Nothing plays on its own.
 * Screen readers and reduced-motion users get the plain, fully lit text.
 * Centred by default; align="start" sets it flush left (the hero intro).
 */
export function Manifesto({
  text,
  level = 2,
  align = 'center',
  maxWidth = 24,
  litBy = '45%',
}: ManifestoProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 85%', `end ${litBy}`]});
  const tokens = tokenize(text);
  const wordCount = tokens.filter(token => !('lineBreak' in token)).length;

  const style = {
    ...typeRole('display-m'),
    fontWeight: 700,
    letterSpacing: '-0.02em',
    maxInlineSize: `${maxWidth}ch`,
    textAlign: align,
    marginInline: align === 'center' ? 'auto' : undefined,
  } as const;

  const words = tokens.map((token, index) => {
    if ('lineBreak' in token) return <br key={`br-${index}`} />;
    const start = token.position / wordCount;
    if (reduceMotion) {
      return (
        <span key={index} style={token.isKeyword ? keywordStyle : undefined}>
          {token.word}{' '}
        </span>
      );
    }
    return (
      <Word
        key={index}
        word={token.word}
        isKeyword={token.isKeyword}
        progress={scrollYProgress}
        range={[start, Math.min(1, start + 1.5 / wordCount)]}
      />
    );
  });

  return level === 'p' ? (
    <Text as="p" ref={ref} textWrap="pretty" style={style}>
      {words}
    </Text>
  ) : (
    <Heading ref={ref} level={level} textWrap="pretty" style={style}>
      {words}
    </Heading>
  );
}
