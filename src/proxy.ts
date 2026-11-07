import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';
import {SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured} from '@/lib/supabase/env';

/**
 * Guards the private writing studio. Every /write request refreshes the
 * Supabase session cookie, and anyone who isn't the signed-in owner is sent
 * to /write/login. (Server actions check the owner again, and the database's
 * row-level security a third time.)
 *
 * Until Supabase is configured the pages show how to connect it instead.
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({request});
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: list => {
        list.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({request});
        list.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const owner = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const isOwner = Boolean(user?.email && owner && user.email.toLowerCase() === owner);
  const isLogin = request.nextUrl.pathname === '/write/login';

  if (!isOwner && !isLogin) {
    const login = request.nextUrl.clone();
    login.pathname = '/write/login';
    login.search = '';
    return NextResponse.redirect(login);
  }
  if (isOwner && isLogin) {
    const studio = request.nextUrl.clone();
    studio.pathname = '/write';
    studio.search = '';
    return NextResponse.redirect(studio);
  }
  return response;
}

export const config = {
  matcher: ['/write', '/write/:path*'],
};
