'use client';

import {createBrowserClient} from '@supabase/ssr';
import {SUPABASE_ANON_KEY, SUPABASE_URL} from './env';

/**
 * A Supabase client in the browser, signed in as the owner through the same
 * session cookies. Used by the editor to upload media straight to storage.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
