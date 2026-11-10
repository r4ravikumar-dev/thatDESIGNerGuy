import 'server-only';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {createSupabasePublicClient, createSupabaseServerClient} from '@/lib/supabase/server';
import {mediaUrl} from '@/lib/caseStudies/media';
import type {SideWorkPhoto, SideWorkRow} from './types';

const FIELDS = 'id, image_path, width, height, description, created_at';

/** The API's answer when a table doesn't exist (yet). */
function isMissingTable(error: {code?: string; message: string}) {
  return error.code === 'PGRST205' || error.code === '42P01' || /schema cache|does not exist/i.test(error.message);
}

/**
 * Side work photos for the ticker, newest first. [] when Supabase isn't
 * connected, the table isn't there yet, or nothing has been added, and the
 * section then stays off the page.
 */
export async function getSideWork(): Promise<SideWorkPhoto[]> {
  if (!isSupabaseConfigured) return [];
  const {data, error} = await createSupabasePublicClient()
    .from('side_work')
    .select(FIELDS)
    .order('created_at', {ascending: false});
  if (error) {
    // Before 0003_side_work.sql has run there's no table yet: expected, so
    // the section just stays hidden. Anything else is a real problem.
    if (!isMissingTable(error)) console.error('[side work] list failed:', error.message);
    return [];
  }
  return ((data ?? []) as SideWorkRow[])
    .map(row => ({
      id: row.id,
      src: mediaUrl(row.image_path),
      alt: row.description,
      width: row.width,
      height: row.height,
    }))
    .filter(photo => photo.src);
}

/** Every row, for the studio (signed in as the owner). */
export async function listSideWorkForOwner(): Promise<{rows: SideWorkRow[]; error: string}> {
  const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase.from('side_work').select(FIELDS).order('created_at', {ascending: false});
  return {rows: (data ?? []) as SideWorkRow[], error: error?.message ?? ''};
}
