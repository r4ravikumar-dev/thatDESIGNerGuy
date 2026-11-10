import {redirect} from 'next/navigation';
import {VStack} from '@astryxdesign/core/Layout';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {getOwner} from '@/lib/supabase/server';
import {listSideWorkForOwner} from '@/lib/sideWork/queries';
import {NotConfigured} from '@/components/write/NotConfigured';
import {StudioHeader} from '@/components/write/StudioHeader';
import {StudioTabs} from '@/components/write/StudioTabs';
import {SideWorkManager} from '@/components/write/SideWorkManager';

/** The studio's Side work page: the photos in the ticker on Home and Work. */
export default async function SideWorkStudioPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  if (!(await getOwner())) redirect('/write/login');
  const {rows, error} = await listSideWorkForOwner();
  return (
    <VStack gap={0} className="studio">
      <StudioHeader />
      <VStack gap={6} className="studio-body">
        <StudioTabs />
        <SideWorkManager rows={rows} loadError={error} />
      </VStack>
    </VStack>
  );
}
