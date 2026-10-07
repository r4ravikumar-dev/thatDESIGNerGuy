import {PageSkeleton} from '@/components/layout/PageSkeleton';

/**
 * Next.js shows this instantly while a page is still arriving. Pages are
 * prefetched, so on a good connection it never appears; on a slow one the
 * page change loader plays first, then this skeleton holds the layout until
 * the page lands.
 */
export default function Loading() {
  return <PageSkeleton />;
}
