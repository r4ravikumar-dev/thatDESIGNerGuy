'use client';

import {usePathname} from 'next/navigation';
import {isStudioPath} from '@/lib/studio';

/** Renders its children everywhere except the private writing studio (/write). */
export function NotInStudio({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  return isStudioPath(pathname) ? null : children;
}
