'use client';

import {useEditorState, type Editor} from '@tiptap/react';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Text} from '@astryxdesign/core/Text';
import {Selector} from '@astryxdesign/core/Selector';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Popover} from '@astryxdesign/core/Popover';
import {Divider} from '@astryxdesign/core/Divider';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Icon} from '@astryxdesign/core/Icon';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Baseline,
} from 'lucide-react';
import type {InsertCommand} from './insertCommands';

/** Paragraph styles, font families and sizes on offer (the site's own type). */
const BLOCKS = [
  {value: 'p', label: 'Paragraph'},
  {value: 'h1', label: 'Title'},
  {value: 'h2', label: 'Section heading'},
  {value: 'h3', label: 'Subheading'},
  {value: 'h4', label: 'Small heading'},
  {value: 'quote', label: 'Quote'},
  {value: 'code', label: 'Code'},
];

export const FONTS = [
  {value: 'default', label: 'Sans (IBM Plex Sans)'},
  {value: 'var(--font-family-accent)', label: 'Serif (Instrument Serif)'},
  {value: 'var(--font-family-eyebrow)', label: 'Mono (IBM Plex Mono)'},
];

const SIZES = ['default', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px'];

/** Text and highlight colours as theme tokens, so they adapt to light and dark mode. */
export const COLORS = [
  {label: 'Default', value: ''},
  {label: 'Brand blue', value: 'var(--color-brand-text)'},
  {label: 'Secondary', value: 'var(--color-text-secondary)'},
  {label: 'Blue', value: 'var(--color-text-blue)'},
  {label: 'Teal', value: 'var(--color-text-teal)'},
  {label: 'Green', value: 'var(--color-text-green)'},
  {label: 'Yellow', value: 'var(--color-text-yellow)'},
  {label: 'Orange', value: 'var(--color-text-orange)'},
  {label: 'Red', value: 'var(--color-text-red)'},
  {label: 'Pink', value: 'var(--color-text-pink)'},
  {label: 'Purple', value: 'var(--color-text-purple)'},
];

export const HIGHLIGHTS = [
  {label: 'None', value: ''},
  {label: 'Blue', value: 'var(--color-background-blue)'},
  {label: 'Teal', value: 'var(--color-background-teal)'},
  {label: 'Green', value: 'var(--color-background-green)'},
  {label: 'Yellow', value: 'var(--color-background-yellow)'},
  {label: 'Orange', value: 'var(--color-background-orange)'},
  {label: 'Red', value: 'var(--color-background-red)'},
  {label: 'Pink', value: 'var(--color-background-pink)'},
  {label: 'Purple', value: 'var(--color-background-purple)'},
  {label: 'Gray', value: 'var(--color-background-gray)'},
];

function blockOf(editor: Editor) {
  for (const level of [1, 2, 3, 4] as const) if (editor.isActive('heading', {level})) return `h${level}`;
  if (editor.isActive('blockquote')) return 'quote';
  if (editor.isActive('codeBlock')) return 'code';
  return 'p';
}

function setBlock(editor: Editor, value: string) {
  const chain = editor.chain().focus();
  if (value === 'p') chain.setParagraph().run();
  else if (value === 'quote') chain.setParagraph().toggleBlockquote().run();
  else if (value === 'code') chain.toggleCodeBlock().run();
  else chain.setHeading({level: Number(value.slice(1)) as 1 | 2 | 3 | 4}).run();
}

/** A row of swatches for picking a text or highlight colour. */
export function Swatches({
  label,
  options,
  current,
  onPick,
  kind,
}: {
  label: string;
  options: {label: string; value: string}[];
  current: string;
  onPick: (value: string) => void;
  kind: 'text' | 'highlight';
}) {
  return (
    <VStack gap={2}>
      <Text type="supporting" color="secondary">
        {label}
      </Text>
      <Grid columns={6} gap={1}>
        {options.map(option => (
          <IconButton
            key={option.label}
            label={option.label}
            tooltip={option.label}
            size="sm"
            variant={current === option.value ? 'secondary' : 'ghost'}
            onClick={() => onPick(option.value)}
            icon={
              <span
                aria-hidden
                className="write-swatch"
                data-kind={kind}
                data-empty={option.value ? undefined : true}
                style={{['--swatch' as string]: option.value || 'transparent'}}
              />
            }
          />
        ))}
      </Grid>
    </VStack>
  );
}

/**
 * The editor's formatting bar: paragraph style, font, size, bold / italic /
 * underline / strike, text colour and highlight, alignment, lists, link,
 * insert (images, video, files, Figma…) and undo / redo.
 */
export function Toolbar({
  editor,
  onLink,
  inserts,
}: {
  editor: Editor;
  onLink: () => void;
  inserts: InsertCommand[];
}) {
  const state = useEditorState({
    editor,
    selector: ({editor: e}) => ({
      block: blockOf(e),
      font: (e.getAttributes('textStyle').fontFamily as string | undefined) ?? 'default',
      size: (e.getAttributes('textStyle').fontSize as string | undefined) ?? 'default',
      color: (e.getAttributes('textStyle').color as string | undefined) ?? '',
      highlight: (e.getAttributes('highlight').color as string | undefined) ?? '',
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      link: e.isActive('link'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      align: (['center', 'right', 'justify'] as const).find(a => e.isActive({textAlign: a})) ?? 'left',
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const mark = (label: string, icon: typeof Bold, isActive: boolean, run: () => void, shortcut?: string) => (
    <IconButton
      label={label}
      tooltip={shortcut ? `${label} (${shortcut})` : label}
      icon={<Icon icon={icon} size="sm" color="inherit" />}
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
      onClick={run}
    />
  );

  return (
    <HStack gap={1} vAlign="center" wrap="wrap" className="write-toolbar" role="toolbar" aria-label="Formatting">
      <DropdownMenu
        button={{label: 'Insert', size: 'sm', variant: 'primary', icon: <Icon icon={Plus} size="sm" color="inherit" />}}
        items={(['Visual', 'Media', 'Text'] as const).map(group => ({
          type: 'section' as const,
          title: group === 'Visual' ? 'Visual blocks' : group,
          items: inserts
            .filter(item => item.group === group)
            .map(item => ({
              label: item.label,
              description: item.description,
              icon: <Icon icon={item.icon} size="sm" color="inherit" />,
              onClick: () => item.run(),
            })),
        }))}
        menuWidth={280}
        menuMaxHeight={560}
      />
      <Divider orientation="vertical" />
      <Selector
        label="Paragraph style"
        isLabelHidden
        options={BLOCKS}
        value={state.block}
        onChange={value => setBlock(editor, value)}
        size="sm"
        variant="ghost"
      />
      <Selector
        label="Font"
        isLabelHidden
        options={FONTS}
        value={state.font}
        onChange={value =>
          value === 'default'
            ? editor.chain().focus().unsetFontFamily().run()
            : editor.chain().focus().setFontFamily(value).run()
        }
        size="sm"
        variant="ghost"
      />
      <Selector
        label="Size"
        isLabelHidden
        options={SIZES.map(size => ({value: size, label: size === 'default' ? 'Size' : size.replace('px', '')}))}
        value={state.size}
        onChange={value =>
          value === 'default'
            ? editor.chain().focus().unsetFontSize().run()
            : editor.chain().focus().setFontSize(value).run()
        }
        size="sm"
        variant="ghost"
      />
      <Divider orientation="vertical" />
      {mark('Bold', Bold, state.bold, () => editor.chain().focus().toggleBold().run(), '⌘B')}
      {mark('Italic', Italic, state.italic, () => editor.chain().focus().toggleItalic().run(), '⌘I')}
      {mark('Underline', Underline, state.underline, () => editor.chain().focus().toggleUnderline().run(), '⌘U')}
      {mark('Strikethrough', Strikethrough, state.strike, () => editor.chain().focus().toggleStrike().run())}
      <Popover
        label="Text colour"
        content={
          <VStack gap={4}>
            <Swatches
              label="Text colour"
              kind="text"
              options={COLORS}
              current={state.color}
              onPick={value =>
                value
                  ? editor.chain().focus().setColor(value).run()
                  : editor.chain().focus().unsetColor().run()
              }
            />
            <Swatches
              label="Highlight"
              kind="highlight"
              options={HIGHLIGHTS}
              current={state.highlight}
              onPick={value =>
                value
                  ? editor.chain().focus().setHighlight({color: value}).run()
                  : editor.chain().focus().unsetHighlight().run()
              }
            />
          </VStack>
        }>
        <IconButton
          label="Colour and highlight"
          tooltip="Colour and highlight"
          icon={<Icon icon={state.highlight ? Highlighter : Baseline} size="sm" color="inherit" />}
          variant={state.color || state.highlight ? 'secondary' : 'ghost'}
          size="sm"
        />
      </Popover>
      {mark('Link', Link2, state.link, onLink, '⌘K')}
      <Divider orientation="vertical" />
      {mark('Align left', AlignLeft, state.align === 'left', () => editor.chain().focus().setTextAlign('left').run())}
      {mark('Align centre', AlignCenter, state.align === 'center', () => editor.chain().focus().setTextAlign('center').run())}
      {mark('Align right', AlignRight, state.align === 'right', () => editor.chain().focus().setTextAlign('right').run())}
      {mark('Justify', AlignJustify, state.align === 'justify', () => editor.chain().focus().setTextAlign('justify').run())}
      <Divider orientation="vertical" />
      {mark('Bulleted list', List, state.bullet, () => editor.chain().focus().toggleBulletList().run())}
      {mark('Numbered list', ListOrdered, state.ordered, () => editor.chain().focus().toggleOrderedList().run())}
      <Divider orientation="vertical" />
      <IconButton
        label="Undo"
        tooltip="Undo (⌘Z)"
        icon={<Icon icon={Undo2} size="sm" color="inherit" />}
        variant="ghost"
        size="sm"
        isDisabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <IconButton
        label="Redo"
        tooltip="Redo (⇧⌘Z)"
        icon={<Icon icon={Redo2} size="sm" color="inherit" />}
        variant="ghost"
        size="sm"
        isDisabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </HStack>
  );
}
