/**
 * Supabase connection settings (public: the URL and the anon key are safe in
 * the browser; row-level security does the guarding). Until both are set the
 * site runs on its static content and /write shows how to connect.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** The storage bucket for case-study media (see supabase/migrations). */
export const MEDIA_BUCKET = 'case-study-media';
