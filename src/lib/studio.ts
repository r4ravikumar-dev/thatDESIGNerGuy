/**
 * The private writing studio (/write) and its sign-in callback (/auth) run
 * without the portfolio's chrome: no header, footer, splash, custom cursor,
 * page loader or smooth scrolling.
 */
export function isStudioPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === '/write' || pathname.startsWith('/write/') || pathname.startsWith('/auth/');
}
