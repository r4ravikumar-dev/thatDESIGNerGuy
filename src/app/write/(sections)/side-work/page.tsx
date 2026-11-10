import {redirect} from 'next/navigation';
import {getOwner} from '@/lib/supabase/server';
import {listSideWorkForOwner} from '@/lib/sideWork/queries';
import {SideWorkManager} from '@/components/write/SideWorkManager';

/** The studio's Side work page: the photos in the ticker on Home and Work. */
export default async function SideWorkStudioPage() {
  if (!(await getOwner())) redirect('/write/login');
  const {rows, error} = await listSideWorkForOwner();
  return <SideWorkManager rows={rows} loadError={error} />;
}
