'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {TextArea} from '@astryxdesign/core/TextArea';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {Icon} from '@astryxdesign/core/Icon';
import {ImagePlus, Trash2} from 'lucide-react';
import {ACCEPT, uploadAsset} from '@/components/write/upload';
import {addSideWork, deleteSideWork, updateSideWorkDescription} from '@/app/write/(sections)/side-work/actions';
import {mediaUrl} from '@/lib/caseStudies/media';
import type {SideWorkRow} from '@/lib/sideWork/types';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/** Opens the file picker for one or more images. */
function pickImages(): Promise<File[]> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPT.image;
    input.multiple = true;
    input.onchange = () => resolve([...(input.files ?? [])]);
    input.oncancel = () => resolve([]);
    input.click();
  });
}

/** One photo: the picture, its description (saved when you click away) and Remove. */
function SideWorkItem({row, onRemove}: {row: SideWorkRow; onRemove: () => void}) {
  const [description, setDescription] = useState(row.description);
  const [saved, setSaved] = useState(row.description);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const save = async () => {
    if (description.trim() === saved.trim()) return;
    setStatus('saving');
    const result = await updateSideWorkDescription(row.id, description);
    if (result.ok) {
      setSaved(description);
      setStatus('saved');
    } else {
      setStatus('error');
    }
  };

  return (
    <VStack gap={3} className="side-work-studio-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="side-work-studio-image"
        src={mediaUrl(row.image_path)}
        alt={description || 'Side work photo'}
        width={row.width ?? undefined}
        height={row.height ?? undefined}
        loading="lazy"
      />
      <TextArea
        label="Description"
        placeholder="What is it? For example: a poster series for local festivals."
        value={description}
        onChange={value => {
          setDescription(value);
          setStatus('idle');
        }}
        onBlur={save}
        rows={3}
        maxLength={500}
        width="100%"
        isLoading={status === 'saving'}
        status={
          status === 'error'
            ? {type: 'error', message: 'Couldn’t save. Try again.'}
            : status === 'saved'
              ? {type: 'success', message: 'Saved'}
              : undefined
        }
        statusVariant="detached"
      />
      <HStack>
        <Button
          label="Remove"
          size="sm"
          variant="ghost"
          className="side-work-remove"
          onClick={onRemove}
          icon={<Icon icon={Trash2} size="sm" color="inherit" />}
        />
      </HStack>
    </VStack>
  );
}

/**
 * The studio's Side work page: the photos in the ticker on Home and Work,
 * newest first. Add photos (several at once), describe each one, remove any.
 * Changes reach the site straight away.
 */
export function SideWorkManager({rows: initialRows, loadError}: {rows: SideWorkRow[]; loadError: string}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [error, setError] = useState(loadError);
  const [isUploading, setIsUploading] = useState(false);
  const [toRemove, setToRemove] = useState<SideWorkRow | null>(null);
  const [isRemoving, startRemove] = useTransition();

  const addPhotos = async () => {
    const files = await pickImages();
    if (!files.length) return;
    setIsUploading(true);
    setError('');
    try {
      const added: SideWorkRow[] = [];
      for (const file of files) {
        const asset = await uploadAsset(null, file, 'side-work');
        const result = await addSideWork({path: asset.path, width: asset.width, height: asset.height});
        if (!result.ok) throw new Error(result.error);
        if (result.row) added.push(result.row);
      }
      setRows(current => [...added.reverse(), ...current]);
      router.refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setIsUploading(false);
    }
  };

  const missingTable = /side_work/.test(error) && /(schema cache|does not exist|Could not find)/i.test(error);

  return (
    <VStack gap={8}>
      <HStack justify="between" vAlign="end" gap={6} wrap="wrap">
        <VStack gap={2}>
          <Text type="supporting" color="secondary" style={EYEBROW_STYLE}>
            {rows.length} {rows.length === 1 ? 'photo' : 'photos'}
          </Text>
          <Heading level={1}>Side work</Heading>
          <Text color="secondary" style={{maxInlineSize: '60ch'}}>
            The photos that loop past in the Side work section on Home and Work, newest first. The section stays hidden
            until there’s at least one photo.
          </Text>
        </VStack>
        <Button
          label="Add photos"
          variant="primary"
          isLoading={isUploading}
          isDisabled={missingTable}
          onClick={addPhotos}
          icon={<Icon icon={ImagePlus} size="sm" color="inherit" />}
        />
      </HStack>

      {error && (
        <Text role="alert" color="secondary" className="side-work-studio-error">
          {missingTable
            ? 'The side work table isn’t set up yet. Run supabase/migrations/0003_side_work.sql in the Supabase SQL editor, then reload this page.'
            : error}
        </Text>
      )}

      {rows.length ? (
        <Grid columns={{minWidth: 240, max: 4}} gap={6}>
          {rows.map(row => (
            <SideWorkItem key={row.id} row={row} onRemove={() => setToRemove(row)} />
          ))}
        </Grid>
      ) : (
        !missingTable && (
          <VStack gap={3} className="studio-empty">
            <Heading level={2}>No side work yet</Heading>
            <Text color="secondary">Add photos of AI tools, graphics or small designs, and they start looping on the site.</Text>
          </VStack>
        )
      )}

      <AlertDialog
        isOpen={toRemove !== null}
        onOpenChange={open => {
          if (!open) setToRemove(null);
        }}
        title="Remove this photo?"
        description="It comes out of the Side work ticker straight away. The file stays in your media library."
        actionLabel="Remove"
        cancelLabel="Keep it"
        isActionLoading={isRemoving}
        onAction={() =>
          startRemove(async () => {
            if (!toRemove) return;
            const result = await deleteSideWork(toRemove.id);
            if (result.ok) {
              setRows(current => current.filter(row => row.id !== toRemove.id));
              router.refresh();
            } else {
              setError(result.error);
            }
            setToRemove(null);
          })
        }
      />
    </VStack>
  );
}
