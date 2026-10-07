'use client';

import {useId, useState, useSyncExternalStore, type ReactNode} from 'react';
import NextLink from 'next/link';
import {AnimatePresence, motion} from 'framer-motion';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowRight, Minus, Plus} from 'lucide-react';
import {MotionHStack} from '@/components/motion/Motion';
import {Reveal} from '@/components/motion/Reveal';
import {springs} from '@/motion/springs';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

export type IndexItem = {
  title: string;
  /** One short line, shown beside the title on wide screens. */
  summary?: string;
  /** Rows with an href navigate. */
  href?: string;
  /** Rows with detail expand inline. Rows with neither are static. */
  detail?: ReactNode;
  /** Anchor id. An expandable row opens when the URL hash matches it. */
  id?: string;
  /** Overrides the row number, e.g. to keep a capability's homepage number. */
  number?: number;
};

type IndexListProps = {
  items: IndexItem[];
  /** Show 01, 02... before each title. */
  isNumbered?: boolean;
  /** Heading level for row titles. */
  level?: 3 | 4;
  /** "large" rows (Headline XL) for indexes; "medium" (Headline S) for questions and long titles. */
  size?: 'large' | 'medium';
};

type RowConfig = Required<Pick<IndexListProps, 'isNumbered' | 'level' | 'size'>>;

const rowStyle = {
  borderBlockStart: '1px solid var(--color-border)',
  paddingBlock: 'var(--spacing-6)',
} as const;

function RowContent({
  item,
  index,
  config,
  isOpen,
  isHovered,
  kind,
}: {
  item: IndexItem;
  index: number;
  config: RowConfig;
  isOpen?: boolean;
  isHovered: boolean;
  kind: 'link' | 'expand' | 'static';
}) {
  return (
    // Grid areas in globals.css (.index-row-content): number, title and arrow on
    // one line with the summary beneath on phones and tablets; one line from 1024px.
    <HStack
      gap={0}
      width="100%"
      className={config.isNumbered ? 'index-row-content' : 'index-row-content is-unnumbered'}>
      {config.isNumbered && (
        <Text
          type="supporting"
          color="secondary"
          hasTabularNumbers
          className="index-row-number"
          style={{fontFamily: EYEBROW_STYLE.fontFamily}}>
          {String(item.number ?? index + 1).padStart(2, '0')}
        </Text>
      )}
      <MotionHStack
        className="index-row-title"
        animate={{x: isHovered ? 8 : 0}}
        transition={springs.spatial.fast}>
        <Heading
          level={config.level}
          textWrap="balance"
          style={{
            ...typeRole(config.size === 'large' ? 'headline-xl' : 'headline-s'),
            letterSpacing: config.size === 'large' ? '-0.02em' : '-0.01em',
          }}>
          {item.title}
        </Heading>
      </MotionHStack>
      {item.summary && (
        <Text color="secondary" textWrap="pretty" className="index-row-summary">
          {item.summary}
        </Text>
      )}
      {kind !== 'static' && (
        <motion.span
          aria-hidden
          className="index-row-arrow"
          animate={{rotate: isOpen ? 180 : 0, x: isHovered && kind === 'link' ? 4 : 0}}
          transition={springs.spatial.fast}>
          <Icon
            icon={kind === 'link' ? ArrowRight : isOpen ? Minus : Plus}
            size="md"
            color="secondary"
          />
        </motion.span>
      )}
    </HStack>
  );
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** The current URL hash, kept in sync as it changes ("" on the server). */
function useHash() {
  return useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  );
}

function ExpandableRow({
  item,
  index,
  config,
  isOpen,
  onToggle,
}: {
  item: IndexItem;
  index: number;
  config: RowConfig;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const panelId = useId();

  return (
    <VStack gap={0} id={item.id} style={rowStyle}>
      <button
        type="button"
        className="index-row"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <RowContent
          item={item}
          index={index}
          config={config}
          isOpen={isOpen}
          isHovered={isHovered}
          kind="expand"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={panelId}
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={springs.spatial.default}
            style={{overflow: 'hidden'}}>
            <VStack
              paddingBlockStart={6}
              className={config.isNumbered ? 'index-row-detail' : undefined}>
              {item.detail}
            </VStack>
          </motion.section>
        )}
      </AnimatePresence>
    </VStack>
  );
}

function LinkRow({item, index, config}: {item: IndexItem; index: number; config: RowConfig}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <NextLink
      href={item.href!}
      id={item.id}
      className="index-row"
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}>
      <RowContent item={item} index={index} config={config} isHovered={isHovered} kind="link" />
    </NextLink>
  );
}

function StaticRow({item, index, config}: {item: IndexItem; index: number; config: RowConfig}) {
  return (
    <VStack gap={0} id={item.id} style={rowStyle}>
      <RowContent item={item} index={index} config={config} isHovered={false} kind="static" />
    </VStack>
  );
}

/**
 * Large-type rows separated by hairlines, the editorial alternative to a grid
 * of cards. Rows link somewhere, expand to show more, or simply state a point.
 * Expandable rows work as an accordion: opening one closes the others.
 */
export function IndexList({items, isNumbered = true, level = 3, size = 'large'}: IndexListProps) {
  const config = {isNumbered, level, size};
  const hash = useHash();
  // undefined until the visitor opens or closes a row; until then the URL
  // hash decides (so /practice#ux-design arrives with that row open).
  const [openKey, setOpenKey] = useState<string | null | undefined>(undefined);
  const keyOf = (item: IndexItem) => item.id ?? item.title;
  const hashKey = items.find(item => item.id !== undefined && hash === `#${item.id}`)?.id ?? null;
  const currentKey = openKey === undefined ? hashKey : openKey;
  return (
    <VStack gap={0} role="list" style={{borderBlockEnd: '1px solid var(--color-border)'}}>
      {items.map((item, index) => (
        <Reveal key={item.title} role="listitem" delay={0.04 * index} distance={16}>
          {item.href ? (
            <LinkRow item={item} index={index} config={config} />
          ) : item.detail ? (
            <ExpandableRow
              item={item}
              index={index}
              config={config}
              isOpen={currentKey === keyOf(item)}
              onToggle={() => setOpenKey(currentKey === keyOf(item) ? null : keyOf(item))}
            />
          ) : (
            <StaticRow item={item} index={index} config={config} />
          )}
        </Reveal>
      ))}
    </VStack>
  );
}
