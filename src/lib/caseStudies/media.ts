import {MEDIA_BUCKET, SUPABASE_URL} from '@/lib/supabase/env';

/**
 * How a block points at an uploaded file: its storage path in the
 * case-study-media bucket plus what the page needs to lay it out (never the
 * file itself, never base64). Rows for each upload live in public.assets.
 */
export type MediaRef = {
  path: string;
  kind: 'image' | 'video';
  mime?: string;
  width?: number | null;
  height?: number | null;
  alt: string;
  caption?: string;
  /** CSS object-position kept in view when cropped. */
  focus?: string;
};

/** A row of public.assets. */
export type Asset = {
  id: string;
  path: string;
  kind: 'image' | 'video' | 'file';
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  original_name: string;
  case_study_id: string | null;
  created_at: string;
};

/** A storage path is relative, inside the bucket, with no tricks in it. */
export function isStoragePath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length < 400 &&
    !value.includes('..') &&
    !value.startsWith('/') &&
    !/^[a-z]+:/i.test(value)
  );
}

/**
 * The public URL of a stored file. Older documents may hold a full https URL,
 * which is passed through; anything else (data:, javascript:, http:) gives ''.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('https://')) return path;
  if (!isStoragePath(path) || !SUPABASE_URL) return '';
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${encoded}`;
}

/** An asset as a block's media reference. */
export function toMediaRef(asset: Asset): MediaRef {
  return {
    path: asset.path,
    kind: asset.kind === 'video' ? 'video' : 'image',
    mime: asset.mime,
    width: asset.width,
    height: asset.height,
    alt: asset.alt,
  };
}
