'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {createSupabaseServerClient, getOwner} from '@/lib/supabase/server';
import {caseStudyTemplate} from '@/content/caseStudyTemplate';
import {validateDocument} from '@/lib/caseStudies/validate';
import {isStoragePath} from '@/lib/caseStudies/media';
import {
  downloadKind,
  missingForPublish,
  slugify,
  type CaseStudyDraft,
  type PublishedSnapshot,
  type CaseStudyLayout,
} from '@/lib/caseStudies/types';

export type ActionResult = {ok: true; updatedAt?: string} | {ok: false; error: string};

const LAYOUTS: CaseStudyLayout[] = ['wide', 'split', 'split-reverse'];

/** One stored upload (.pdf, .pptx, .doc or .docx) with tidy fields. */
function cleanDownloads(downloads: CaseStudyDraft['downloads'] | undefined): CaseStudyDraft['downloads'] {
  return (downloads ?? [])
    .filter(item => isStoragePath(item.path) && downloadKind(String(item.name ?? '')))
    .slice(0, 1)
    .map(item => ({
      kind: downloadKind(String(item.name))!,
      path: item.path,
      name: String(item.name ?? '').slice(0, 200) || 'Case study',
      size: Number(item.size) || 0,
      mime: String(item.mime ?? ''),
    }));
}

/** Every action checks the owner first (row-level security checks again). */
async function ownerClient() {
  const owner = await getOwner();
  if (!owner) throw new Error('Not signed in as the owner.');
  return createSupabaseServerClient();
}

/** Refreshes every public page a case study appears on. */
function refreshPublicPages(slug?: string) {
  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/work/${slug}`);
}

/** Starts a new case study from the template and opens it. */
export async function createCaseStudy() {
  const supabase = await ownerClient();
  const slug = `untitled-${crypto.randomUUID().slice(0, 6)}`;
  const {data, error} = await supabase
    .from('case_studies')
    .insert({slug, title: 'Untitled case study', content: caseStudyTemplate()})
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  redirect(`/write/${data.id}`);
}

/**
 * Saves the working draft (autosave). The live page doesn't change: a
 * published case study keeps showing its published snapshot until Update.
 */
export async function saveCaseStudy(id: string, draft: CaseStudyDraft): Promise<ActionResult> {
  try {
    const supabase = await ownerClient();
    const slug = slugify(draft.slug || draft.title);
    if (!slug) return {ok: false, error: 'Add a headline or a URL slug.'};

    const {data, error} = await supabase
      .from('case_studies')
      .update({
        slug,
        title: draft.title.trim() || 'Untitled case study',
        subtitle: draft.subtitle.trim(),
        label: draft.label.trim(),
        area: draft.area.trim(),
        tags: draft.tags.map(tag => tag.trim()).filter(Boolean),
        summary: draft.summary.trim(),
        focus: draft.focus.trim(),
        thumbnail_url: draft.thumbnail_url || null,
        thumbnail_alt: draft.thumbnail_alt.trim(),
        thumbnail_focus: draft.thumbnail_focus || 'center',
        cover_url: draft.cover_url || null,
        layout: LAYOUTS.includes(draft.layout) ? draft.layout : 'split',
        is_featured: Boolean(draft.is_featured),
        sort_order: Number.isFinite(draft.sort_order) ? Math.round(draft.sort_order) : 0,
        seo_description: draft.seo_description.trim(),
        downloads: cleanDownloads(draft.downloads),
        content: draft.content,
      })
      .eq('id', id)
      .select('updated_at')
      .single();

    if (error) {
      if (error.code === '23505') return {ok: false, error: 'Another case study already uses that URL slug.'};
      return {ok: false, error: error.message};
    }
    return {ok: true, updatedAt: data.updated_at};
  } catch (error) {
    return {ok: false, error: error instanceof Error ? error.message : 'Couldn’t save.'};
  }
}

/**
 * Puts the current draft live: checks it has everything the Work section
 * needs and that every block is valid, saves it, then copies it into the
 * published snapshot the site reads. The previous live slug is refreshed too,
 * in case the URL changed.
 */
export async function publishCaseStudy(id: string, draft: CaseStudyDraft): Promise<ActionResult> {
  const missing = missingForPublish(draft);
  if (missing.length) return {ok: false, error: `Add ${missing.join(', ')} before publishing.`};
  const problems = validateDocument(draft.content);
  if (problems.length) {
    return {ok: false, error: `Fix ${problems.length === 1 ? 'this' : 'these'} before publishing: ${problems.slice(0, 4).join(' · ')}`};
  }

  const saved = await saveCaseStudy(id, draft);
  if (!saved.ok) return saved;

  try {
    const supabase = await ownerClient();
    const {data: current} = await supabase.from('case_studies').select('*').eq('id', id).single();
    if (!current) return {ok: false, error: 'Case study not found.'};
    const snapshot: PublishedSnapshot = {
      slug: current.slug,
      title: current.title,
      subtitle: current.subtitle,
      label: current.label,
      area: current.area,
      tags: current.tags,
      summary: current.summary,
      focus: current.focus,
      thumbnail_url: current.thumbnail_url,
      thumbnail_alt: current.thumbnail_alt,
      thumbnail_focus: current.thumbnail_focus,
      cover_url: current.cover_url,
      layout: current.layout,
      is_featured: current.is_featured,
      sort_order: current.sort_order,
      seo_description: current.seo_description,
      downloads: current.downloads ?? [],
      content: current.content,
    };
    const previousSlug = (current.published as PublishedSnapshot | null)?.slug;
    const {data, error} = await supabase
      .from('case_studies')
      .update({status: 'published', published: snapshot, published_at: new Date().toISOString()})
      .eq('id', id)
      .select('slug, updated_at')
      .single();
    if (error) return {ok: false, error: error.message};
    refreshPublicPages(data.slug);
    if (previousSlug && previousSlug !== data.slug) revalidatePath(`/work/${previousSlug}`);
    revalidatePath('/write');
    return {ok: true, updatedAt: data.updated_at};
  } catch (error) {
    return {ok: false, error: error instanceof Error ? error.message : 'Couldn’t publish.'};
  }
}

/** Takes a case study off the site (it stays as a draft). */
export async function unpublishCaseStudy(id: string): Promise<ActionResult> {
  try {
    const supabase = await ownerClient();
    const {data, error} = await supabase
      .from('case_studies')
      .update({status: 'draft'})
      .eq('id', id)
      .select('slug, published, updated_at')
      .single();
    if (error) return {ok: false, error: error.message};
    refreshPublicPages((data.published as PublishedSnapshot | null)?.slug ?? data.slug);
    revalidatePath('/write');
    return {ok: true, updatedAt: data.updated_at};
  } catch (error) {
    return {ok: false, error: error instanceof Error ? error.message : 'Couldn’t unpublish.'};
  }
}

/** Deletes a case study for good (its uploaded files stay in storage). */
export async function deleteCaseStudy(id: string): Promise<ActionResult> {
  try {
    const supabase = await ownerClient();
    const {data, error} = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id)
      .select('slug, status')
      .single();
    if (error) return {ok: false, error: error.message};
    if (data.status === 'published') refreshPublicPages(data.slug);
    revalidatePath('/write');
    return {ok: true};
  } catch (error) {
    return {ok: false, error: error instanceof Error ? error.message : 'Couldn’t delete.'};
  }
}

/** Signs the owner out of the studio. */
export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/write/login');
}
