import {redirect} from 'next/navigation';
import {getOwner} from '@/lib/supabase/server';
import {listCaseStudiesForOwner} from '@/lib/caseStudies/queries';
import {CaseStudyTable} from '@/components/write/CaseStudyTable';

/** The studio's home: every case study, draft or live, and a way to start a new one. */
export default async function StudioPage() {
  if (!(await getOwner())) redirect('/write/login');
  const studies = await listCaseStudiesForOwner();
  return <CaseStudyTable studies={studies} />;
}
