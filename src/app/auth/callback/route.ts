import {NextResponse, type NextRequest} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';

/**
 * Where the magic-link email lands: swaps the one-time code for a session
 * cookie, then opens the studio. Only paths inside /write are allowed as the
 * destination, so the link can't be used to redirect elsewhere.
 */
export async function GET(request: NextRequest) {
  const {searchParams, origin} = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/write';
  const destination = next.startsWith('/write') ? next : '/write';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const {error} = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destination}`);
  }
  return NextResponse.redirect(`${origin}/write/login?error=link`);
}
