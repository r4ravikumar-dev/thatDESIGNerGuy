import {notFound, redirect} from 'next/navigation';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {getOwner} from '@/lib/supabase/server';
import {getCaseStudyForOwner} from '@/lib/caseStudies/queries';
import {CaseStudyPage} from '@/components/caseStudy/CaseStudyPage';
import {NotConfigured} from '@/components/write/NotConfigured';
import {PreviewBar} from '@/components/write/PreviewBar';

/** The case study exactly as it will look on the site, drafts included (owner only). */
export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{id: string}>;
  searchParams: Promise<{embed?: string}>;
}) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  if (!(await getOwner())) redirect('/write/login');
  const {id} = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const study = await getCaseStudyForOwner(id);
  if (!study) notFound();
  // Inside the editor's preview dialog the bar is the dialog's own header.
  const isEmbedded = (await searchParams).embed === '1';
  return (
    <>
      {!isEmbedded && <PreviewBar id={study.id} status={study.status} />}
      <CaseStudyPage study={study} />
    </>
  );
}
