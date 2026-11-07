import {Node, mergeAttributes, type Extensions} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {TextStyleKit} from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import {mediaUrl} from '@/lib/caseStudies/media';
import {
  defaultComparison,
  defaultDeviceMockup,
  defaultImageGrid,
  defaultMetrics,
  defaultQuote,
  defaultShowcase,
  defaultSplit,
} from '@/lib/caseStudies/blocks';

/**
 * The case-study document schema, shared by the editor (with React node views
 * added on top) and the published page (static renderer), so a document always
 * renders the way it was written.
 */

/** A downloadable file: PDF, PowerPoint or Word, optionally previewed inline. */
export const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {default: ''},
      name: {default: 'File'},
      size: {default: 0},
      mime: {default: ''},
      preview: {default: false},
    };
  },
  parseHTML() {
    return [{tag: 'div[data-file-attachment]'}];
  },
  renderHTML({HTMLAttributes}) {
    return ['div', mergeAttributes({'data-file-attachment': ''}, HTMLAttributes)];
  },
});

/** An uploaded video file. */
export const VideoFile = Node.create({
  name: 'videoFile',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {src: {default: ''}, caption: {default: ''}};
  },
  parseHTML() {
    return [{tag: 'div[data-video-file]'}];
  },
  renderHTML({HTMLAttributes}) {
    return ['div', mergeAttributes({'data-video-file': ''}, HTMLAttributes)];
  },
});

/** A Figma file or prototype, or a YouTube, Vimeo or Loom video, by URL. */
export const Embed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {src: {default: ''}, caption: {default: ''}};
  },
  parseHTML() {
    return [{tag: 'div[data-embed]'}];
  },
  renderHTML({HTMLAttributes}) {
    return ['div', mergeAttributes({'data-embed': ''}, HTMLAttributes)];
  },
});

/** A highlighted note that holds paragraphs, with a tone and an icon. */
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  defining: true,
  addAttributes() {
    return {tone: {default: 'brand'}, icon: {default: 'lightbulb'}};
  },
  parseHTML() {
    return [{tag: 'aside[data-callout]'}];
  },
  renderHTML({HTMLAttributes}) {
    return ['aside', mergeAttributes({'data-callout': ''}, HTMLAttributes), 0];
  },
});

/** A JSON attribute: a block's whole configuration, stored as one object. */
function configAttribute<T>(defaults: () => T) {
  return {
    config: {
      default: defaults(),
      parseHTML: (element: HTMLElement) => {
        try {
          return {...defaults(), ...JSON.parse(element.getAttribute('data-config') ?? '{}')};
        } catch {
          return defaults();
        }
      },
      renderHTML: (attributes: {config: T}) => ({'data-config': JSON.stringify(attributes.config)}),
    },
  };
}

/** An atom block whose layout is all in its config (grid, comparison, showcase, devices, metrics). */
function visualAtom<T>(name: string, defaults: () => T) {
  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,
    addAttributes: () => configAttribute(defaults),
    parseHTML: () => [{tag: `div[data-block="${name}"]`}],
    renderHTML: ({HTMLAttributes}) => ['div', mergeAttributes({'data-block': name}, HTMLAttributes)],
  });
}

export const ImageGridNode = visualAtom('imageGrid', defaultImageGrid);
export const ComparisonNode = visualAtom('comparison', defaultComparison);
export const ShowcaseNode = visualAtom('showcase', defaultShowcase);
export const DeviceMockupNode = visualAtom('deviceMockup', defaultDeviceMockup);
export const MetricsNode = visualAtom('metrics', defaultMetrics);

/** Media beside editable text: the text is ordinary content inside the block. */
export const SplitLayoutNode = Node.create({
  name: 'splitLayout',
  group: 'block',
  content: '(paragraph | heading | bulletList | orderedList | blockquote)+',
  defining: true,
  isolating: true,
  draggable: true,
  addAttributes: () => configAttribute(defaultSplit),
  parseHTML: () => [{tag: 'section[data-block="splitLayout"]'}],
  renderHTML: ({HTMLAttributes}) => ['section', mergeAttributes({'data-block': 'splitLayout'}, HTMLAttributes), 0],
});

/** A pull quote: the quote is editable inline text; attribution is in its config. */
export const PullQuoteNode = Node.create({
  name: 'pullQuote',
  group: 'block',
  content: 'inline*',
  defining: true,
  draggable: true,
  addAttributes: () => configAttribute(defaultQuote),
  parseHTML: () => [{tag: 'figure[data-block="pullQuote"]'}],
  renderHTML: ({HTMLAttributes}) => ['figure', mergeAttributes({'data-block': 'pullQuote'}, HTMLAttributes), 0],
});

/** Images hold a storage path; shown through its public URL, with their pixel size. */
const StoredImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {default: null, renderHTML: (attributes: {src?: string}) => ({src: mediaUrl(attributes.src)})},
      width: {default: null},
      height: {default: null},
    };
  },
});

/** The extensions every case study is written and rendered with. */
export const caseStudyExtensions: Extensions = [
  StarterKit.configure({
    heading: {levels: [1, 2, 3, 4]},
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {rel: 'noopener noreferrer', target: '_blank'},
    },
  }),
  TextStyleKit,
  Highlight.configure({multicolor: true}),
  TextAlign.configure({types: ['heading', 'paragraph']}),
  StoredImage.configure({allowBase64: false}),
  FileAttachment,
  VideoFile,
  Embed,
  Callout,
  ImageGridNode,
  ComparisonNode,
  ShowcaseNode,
  DeviceMockupNode,
  MetricsNode,
  SplitLayoutNode,
  PullQuoteNode,
];
