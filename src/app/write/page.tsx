import {redirect} from 'next/navigation';
import {VStack} from '@astryxdesign/core/Layout';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {getOwner} from '@/lib/supabase/server';
import {listCaseStudiesForOwner} from '@/lib/caseStudies/queries';
import {NotConfigured} from '@/components/write/NotConfigured';
import {StudioHeader} from '@/components/write/StudioHeader';
import {CaseStudyTable} from '@/components/write/CaseStudyTable';

/** The studio's home: every case study, draft or live, and a way to start a new one. */
export default async function StudioPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  if (!(await getOwner())) redirect('/write/login');
  const studies = await listCaseStudiesForOwner();
  return (
    <VStack gap={0} className="studio">
      <StudioHeader />
      <VStack gap={6} className="studio-body">
        <CaseStudyTable studies={studies} />
      </VStack>
    </VStack>
  );
}
