import {redirect} from 'next/navigation';
import {VStack} from '@astryxdesign/core/Layout';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {getOwner} from '@/lib/supabase/server';
import {NotConfigured} from '@/components/write/NotConfigured';
import {StudioHeader} from '@/components/write/StudioHeader';
import {StudioTabs} from '@/components/write/StudioTabs';

/**
 * The studio's sections (Case studies, Side work) share this frame: the top
 * bar and the switch stay put while only the section below changes, so
 * switching is instant and the switch's highlight slides across.
 */
export default async function StudioSectionsLayout({children}: {children: React.ReactNode}) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  if (!(await getOwner())) redirect('/write/login');
  return (
    <VStack gap={0} className="studio">
      <StudioHeader />
      <VStack gap={6} className="studio-body">
        <StudioTabs />
        {children}
      </VStack>
    </VStack>
  );
}
