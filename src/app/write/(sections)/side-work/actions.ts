'use server';

import {revalidatePath} from 'next/cache';
import {createSupabaseServerClient, getOwner} from '@/lib/supabase/server';
import {isStoragePath} from '@/lib/caseStudies/media';
import type {SideWorkRow} from '@/lib/sideWork/types';

export type SideWorkResult = {ok: true; row?: SideWorkRow} | {ok: false; error: string};

const MAX_DESCRIPTION = 500;

async function ownerClient() {
  if (!(await getOwner())) throw new Error('Not signed in as the owner.');
  return createSupabaseServerClient();
}

/** Home and Work show the ticker. */
function refreshPublicPages() {
  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/write/side-work');
}

const toError = (error: unknown) => ({ok: false as const, error: error instanceof Error ? error.message : String(error)});

/** Adds an uploaded photo to the side work ticker. */
export async function addSideWork(input: {
  path: string;
  width: number | null;
  height: number | null;
  description?: string;
}): Promise<SideWorkResult> {
  try {
    if (!isStoragePath(input.path)) return {ok: false, error: 'That upload’s path isn’t valid.'};
    const supabase = await ownerClient();
    const {data, error} = await supabase
      .from('side_work')
      .insert({
        image_path: input.path,
        width: Number(input.width) || null,
        height: Number(input.height) || null,
        description: String(input.description ?? '').trim().slice(0, MAX_DESCRIPTION),
      })
      .select('*')
      .single();
    if (error) return {ok: false, error: error.message};
    refreshPublicPages();
    return {ok: true, row: data as SideWorkRow};
  } catch (error) {
    return toError(error);
  }
}

/** Saves a photo's description. */
export async function updateSideWorkDescription(id: string, description: string): Promise<SideWorkResult> {
  try {
    const supabase = await ownerClient();
    const {error} = await supabase
      .from('side_work')
      .update({description: String(description).trim().slice(0, MAX_DESCRIPTION)})
      .eq('id', id);
    if (error) return {ok: false, error: error.message};
    refreshPublicPages();
    return {ok: true};
  } catch (error) {
    return toError(error);
  }
}

/** Takes a photo out of the ticker (the file stays in the media library). */
export async function deleteSideWork(id: string): Promise<SideWorkResult> {
  try {
    const supabase = await ownerClient();
    const {error} = await supabase.from('side_work').delete().eq('id', id);
    if (error) return {ok: false, error: error.message};
    refreshPublicPages();
    return {ok: true};
  } catch (error) {
    return toError(error);
  }
}
