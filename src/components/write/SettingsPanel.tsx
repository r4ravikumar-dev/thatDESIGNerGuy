'use client';

import {useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Switch} from '@astryxdesign/core/Switch';
import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';
import {ImageUp, Trash2} from 'lucide-react';
import {slugify, type CaseStudyMeta} from '@/lib/caseStudies/types';
import {useMedia} from './MediaLibrary';
import {mediaUrl} from '@/lib/caseStudies/media';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

const LAYOUTS = [
  {value: 'wide', label: 'Wide', description: 'Full-width picture, text beneath'},
  {value: 'split', label: 'Split', description: 'Text left, picture right'},
  {value: 'split-reverse', label: 'Split, reversed', description: 'Picture left, text right'},
];

const FOCUS = [
  {value: 'center', label: 'Centre'},
  {value: 'top', label: 'Top'},
  {value: 'bottom', label: 'Bottom'},
  {value: 'left center', label: 'Left'},
  {value: 'right center', label: 'Right'},
];

function Group({title, hint, children}: {title: string; hint?: string; children: React.ReactNode}) {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Text type="supporting" style={EYEBROW_STYLE}>
          {title}
        </Text>
        {hint && (
          <Text type="supporting" color="secondary">
            {hint}
          </Text>
        )}
      </VStack>
      {children}
    </VStack>
  );
}

/** An image field: shows the picture, chooses one from the media library (or uploads), or clears it. */
function ImageField({
  label,
  url,
  focus,
  onChange,
}: {
  label: string;
  /** The stored image's path. */
  url: string | null;
  focus?: string;
  onChange: (path: string | null, alt?: string) => void;
}) {
  const media = useMedia();
  const choose = async () => {
    const asset = await media.pick('image');
    if (asset) onChange(asset.path, asset.alt);
  };
  return (
    <VStack gap={2}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl(url)} alt="" className="write-image-field" style={{objectPosition: focus ?? 'center'}} />
      ) : (
        <VStack className="write-image-field write-image-empty" hAlign="center" vAlign="center">
          <Text type="supporting" color="secondary">
            No {label.toLowerCase()} yet
          </Text>
        </VStack>
      )}
      <HStack gap={2}>
        <Button
          label={url ? `Replace ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`}
          variant="secondary"
          size="sm"
          onClick={choose}
          icon={<Icon icon={ImageUp} size="sm" color="inherit" />}
        />
        {url && (
          <Button
            label="Remove"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            icon={<Icon icon={Trash2} size="sm" color="inherit" />}
          />
        )}
      </HStack>
    </VStack>
  );
}

/**
 * Everything the site needs besides the story itself: the thumbnail and how
 * the project appears on the Work page and Home, its URL, and its search
 * description.
 */
export function SettingsPanel({
  meta,
  onChange,
}: {
  meta: CaseStudyMeta;
  onChange: (patch: Partial<CaseStudyMeta>) => void;
}) {
  const [tags, setTags] = useState(meta.tags.join(', '));
  const [isSlugEdited, setIsSlugEdited] = useState(!meta.slug.startsWith('untitled-'));

  return (
    <VStack gap={8} className="write-settings">
      <Heading level={2} style={{fontSize: 'var(--type-headline-s-size)'}}>
        Case study settings
      </Heading>

      <Group title="Thumbnail" hint="Shown on the Work page and Home. Needed to publish.">
        <ImageField
          label="Thumbnail"
          url={meta.thumbnail_url}
          focus={meta.thumbnail_focus}
          onChange={(path, alt) =>
            onChange(path && alt && !meta.thumbnail_alt ? {thumbnail_url: path, thumbnail_alt: alt} : {thumbnail_url: path})
          }
        />
        <TextInput
          label="Alt text"
          description="Describe the picture for screen readers."
          value={meta.thumbnail_alt}
          onChange={value => onChange({thumbnail_alt: value})}
          width="100%"
        />
        <Selector
          label="Keep in view when cropped"
          options={FOCUS}
          value={meta.thumbnail_focus}
          onChange={value => onChange({thumbnail_focus: value})}
        />
      </Group>

      <Divider />

      <Group title="Headline">
        <TextInput
          label="Headline"
          description="Wrap one word in *asterisks* for the serif accent."
          value={meta.title}
          onChange={value => {
            onChange(isSlugEdited ? {title: value} : {title: value, slug: slugify(value)});
          }}
          width="100%"
        />
        <TextInput
          label="Subheadline"
          value={meta.subtitle}
          onChange={value => onChange({subtitle: value})}
          width="100%"
        />
        <TextArea
          label="Summary"
          description="Two or three sentences for the Work page and Home. Needed to publish."
          value={meta.summary}
          onChange={value => onChange({summary: value})}
          rows={4}
          width="100%"
        />
      </Group>

      <Divider />

      <Group title="On the Work page">
        <TextInput
          label="Project label"
          description="e.g. Mamily × Visit Health"
          value={meta.label}
          onChange={value => onChange({label: value})}
          width="100%"
        />
        <TextInput
          label="Area"
          description="e.g. Women's wellness"
          value={meta.area}
          onChange={value => onChange({area: value})}
          width="100%"
        />
        <TextInput
          label="Tags"
          description="Comma-separated, e.g. Mobile app, UX/UI, 2025"
          value={tags}
          onChange={value => {
            setTags(value);
            onChange({tags: value.split(',').map(tag => tag.trim()).filter(Boolean)});
          }}
          width="100%"
        />
        <TextInput
          label="Focus"
          description="e.g. Mamily integration · Mobile experience"
          value={meta.focus}
          onChange={value => onChange({focus: value})}
          width="100%"
        />
        <Selector
          label="Layout on the Work page"
          options={LAYOUTS}
          value={meta.layout}
          onChange={value => onChange({layout: value as CaseStudyMeta['layout']})}
        />
        <NumberInput
          label="Order"
          description="Lower numbers come first."
          value={meta.sort_order}
          onChange={value => onChange({sort_order: typeof value === 'number' ? value : 0})}
          step={1}
        />
        <Switch
          label="Show on Home"
          description="Adds it to the Work showcase on the homepage."
          value={meta.is_featured}
          onChange={checked => onChange({is_featured: checked})}
        />
      </Group>

      <Divider />

      <Group title="Opening visual" hint="The large picture at the top of the case study page (optional).">
        <ImageField label="Cover" url={meta.cover_url} onChange={path => onChange({cover_url: path})} />
      </Group>

      <Divider />

      <Group title="Address and search">
        <TextInput
          label="URL slug"
          description={`ravi.graphikx.in/work/${meta.slug || '…'}`}
          value={meta.slug}
          onChange={value => {
            setIsSlugEdited(true);
            onChange({slug: slugify(value)});
          }}
          width="100%"
        />
        <TextArea
          label="Search description"
          description="Shown by Google and link previews. Falls back to the summary."
          value={meta.seo_description}
          onChange={value => onChange({seo_description: value})}
          rows={3}
          width="100%"
        />
      </Group>
    </VStack>
  );
}
