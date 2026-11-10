'use client';

import {createSupabaseBrowserClient} from '@/lib/supabase/client';
import {MEDIA_BUCKET} from '@/lib/supabase/env';
import type {Asset} from '@/lib/caseStudies/media';

/** The storage bucket's per-file ceiling (Supabase free plan). */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export type MediaKind = 'image' | 'video' | 'file';

export const ACCEPT: Record<MediaKind, string> = {
  image: 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml',
  video: 'video/mp4,video/webm,video/quicktime',
  file: '.pdf,.pptx,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function kindOfFile(file: File): MediaKind | null {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (/\.(pdf|pptx|docx?)$/i.test(file.name)) return 'file';
  return null;
}

/** Reads an image's or video's pixel size before upload (for layout without shifts). */
async function measure(file: File, kind: MediaKind): Promise<{width: number | null; height: number | null}> {
  const url = URL.createObjectURL(file);
  try {
    if (kind === 'image') {
      const image = new Image();
      image.src = url;
      await image.decode();
      return {width: image.naturalWidth || null, height: image.naturalHeight || null};
    }
    if (kind === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Unreadable video'));
      });
      return {width: video.videoWidth || null, height: video.videoHeight || null};
    }
  } catch {
    // Unknown size: the page still lays it out, just without a reserved ratio.
  } finally {
    URL.revokeObjectURL(url);
  }
  return {width: null, height: null};
}

/**
 * Uploads a file to the case study's folder in storage and records it in
 * public.assets (path, type, size, pixel size, original name). Returns the
 * asset row. Row-level security refuses anyone but the owner. With no case
 * study (null), it goes in a shared folder such as side-work/.
 */
export async function uploadAsset(caseStudyId: string | null, file: File, folder = caseStudyId ?? 'shared'): Promise<Asset> {
  const kind = kindOfFile(file);
  if (!kind) throw new Error(`${file.name} isn’t a supported image, video or document.`);
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is over 50 MB. For long videos, upload to YouTube, Vimeo or Loom and embed the link.`);
  }
  const {width, height} = await measure(file, kind);
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'file';
  const path = `${folder}/${Date.now()}-${safeName}`;

  const supabase = createSupabaseBrowserClient();
  const {error: uploadError} = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const {data, error} = await supabase
    .from('assets')
    .insert({
      path,
      kind,
      mime: file.type,
      size: file.size,
      width,
      height,
      alt: kind === 'file' ? '' : file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      original_name: file.name,
      case_study_id: caseStudyId,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as Asset;
}

/** Every upload of a kind, newest first, for the media library. */
export async function listAssets(kind?: MediaKind): Promise<Asset[]> {
  const supabase = createSupabaseBrowserClient();
  let query = supabase.from('assets').select('*').order('created_at', {ascending: false}).limit(200);
  if (kind) query = query.eq('kind', kind);
  const {data, error} = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Asset[];
}

/** Saves an asset's alt text, so it's filled in next time it's chosen. */
export async function updateAssetAlt(id: string, alt: string) {
  const supabase = createSupabaseBrowserClient();
  await supabase.from('assets').update({alt}).eq('id', id);
}

/** Opens the file picker and resolves with the chosen file (or null). */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}
