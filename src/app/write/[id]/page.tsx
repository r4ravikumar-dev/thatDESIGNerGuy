import {notFound, redirect} from 'next/navigation';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {getOwner} from '@/lib/supabase/server';
import {getCaseStudyForOwner} from '@/lib/caseStudies/queries';
import {NotConfigured} from '@/components/write/NotConfigured';
import {Editor} from '@/components/write/Editor';

/** Writing one case study. */
export default async function WritePage({params}: {params: Promise<{id: string}>}) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  if (!(await getOwner())) redirect('/write/login');
  const {id} = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const study = await getCaseStudyForOwner(id);
  if (!study) notFound();
  return <Editor study={study} />;
}
