import 'server-only';
import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
import {SUPABASE_ANON_KEY, SUPABASE_URL} from './env';

/**
 * A Supabase client for the signed-in owner (server components, server
 * actions and route handlers in /write). Reads and refreshes the session from
 * cookies, so pages that use it render per request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: list => {
        try {
          list.forEach(({name, value, options}) => cookieStore.set(name, value, options));
        } catch {
          // Called from a server component, where cookies are read-only. The
          // proxy (src/proxy.ts) refreshes the session instead.
        }
      },
    },
  });
}

/**
 * A Supabase client with no session, for the public site: it only ever sees
 * published case studies (row-level security). Uses no cookies, so pages that
 * read with it can stay static and revalidate.
 */
export function createSupabasePublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {persistSession: false, autoRefreshToken: false},
  });
}

/** The one email allowed to sign in to /write (ADMIN_EMAIL, server only). */
export function ownerEmail() {
  return (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
}

/** The signed-in user if it is the owner, otherwise null. */
export async function getOwner() {
  const supabase = await createSupabaseServerClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  const owner = ownerEmail();
  if (!user?.email || !owner || user.email.toLowerCase() !== owner) return null;
  return user;
}
