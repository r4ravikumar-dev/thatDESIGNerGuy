/** True when `pathname` is `href` or a page inside it (e.g. /thinking/some-article). */
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
