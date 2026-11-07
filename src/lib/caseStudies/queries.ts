import 'server-only';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {createSupabasePublicClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {CaseStudy} from './types';
import {mediaUrl} from './media';
import type {WorkFeature} from '@/content/work';
import type {WorkProject} from '@/content/home';

/** The card fields the studio's list needs (the body stays out). */
const CARD_FIELDS =
  'id, slug, status, title, subtitle, label, area, tags, summary, focus, thumbnail_url, thumbnail_alt, thumbnail_focus, cover_url, layout, is_featured, sort_order, seo_description, published_at, created_at, updated_at';

type CaseStudyCard = Omit<CaseStudy, 'content' | 'published'>;

type PublishedRow = Pick<CaseStudy, 'id' | 'status' | 'published' | 'published_at' | 'created_at' | 'updated_at'>;

/** A published row as the case study visitors see: its snapshot, not the draft. */
function fromSnapshot(row: PublishedRow): CaseStudy | null {
  if (!row.published) return null;
  return {
    ...row.published,
    id: row.id,
    status: 'published',
    published: row.published,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.published_at ?? row.updated_at,
  };
}

/**
 * Published case studies (their live versions), in the order set in the
 * studio. Returns [] when Supabase isn't connected or can't be reached, so
 * the site falls back to its static projects instead of breaking.
 */
export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  if (!isSupabaseConfigured) return [];
  const {data, error} = await createSupabasePublicClient()
    .from('case_studies')
    .select('id, status, published, published_at, created_at, updated_at')
    .eq('status', 'published')
    .not('published', 'is', null);
  if (error) {
    console.error('[case studies] list failed:', error.message);
    return [];
  }
  return ((data ?? []) as PublishedRow[])
    .map(fromSnapshot)
    .filter((study): study is CaseStudy => study !== null)
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order ||
        (b.published_at ?? '').localeCompare(a.published_at ?? ''),
    );
}

/** Published case studies marked "Show on Home". */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  return (await getPublishedCaseStudies()).filter(study => study.is_featured);
}

/** One published case study (its live version), or null. */
export async function getPublishedCaseStudy(slug: string): Promise<CaseStudy | null> {
  if (!isSupabaseConfigured) return null;
  const {data, error} = await createSupabasePublicClient()
    .from('case_studies')
    .select('id, status, published, published_at, created_at, updated_at')
    .eq('status', 'published')
    .eq('published->>slug', slug)
    .maybeSingle();
  if (error) console.error('[case studies] read failed:', error.message);
  return data ? fromSnapshot(data as PublishedRow) : null;
}

/** Every case study, drafts included, for the signed-in owner (row-level security). */
export async function listCaseStudiesForOwner(): Promise<(CaseStudyCard & {has_changes: boolean})[]> {
  const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase
    .from('case_studies')
    .select(CARD_FIELDS)
    .order('updated_at', {ascending: false});
  if (error) throw new Error(error.message);
  // A live case study edited since it was published has changes not yet on the site.
  return ((data ?? []) as CaseStudyCard[]).map(study => ({
    ...study,
    has_changes:
      study.status === 'published' &&
      Boolean(study.published_at) &&
      new Date(study.updated_at).getTime() - new Date(study.published_at!).getTime() > 2000,
  }));
}

/** One case study, draft or published, for the signed-in owner. */
export async function getCaseStudyForOwner(id: string): Promise<CaseStudy | null> {
  const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase.from('case_studies').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as CaseStudy | null) ?? null;
}

/** A case study as a project on the Work page (WorkFeatures). */
export function toWorkFeature(study: CaseStudy): WorkFeature {
  return {
    slug: study.slug,
    label: study.label || study.title,
    area: study.area,
    tags: study.tags,
    title: study.title,
    description: study.summary,
    focus: study.focus,
    image: {
      src: mediaUrl(study.thumbnail_url),
      alt: study.thumbnail_alt,
      focus: study.thumbnail_focus,
    },
    href: `/work/${study.slug}`,
    layout: study.layout,
    isLive: true,
  };
}

/** A case study as a project in the Home showcase (WorkShowcase). */
export function toWorkProject(study: CaseStudy): WorkProject {
  return {
    label: study.label || study.title,
    title: study.title.replace(/\*/g, ''),
    description: study.summary,
    meta: study.tags,
    thumbnail: study.thumbnail_url
      ? {src: mediaUrl(study.thumbnail_url), alt: study.thumbnail_alt, focus: study.thumbnail_focus}
      : undefined,
    href: `/work/${study.slug}`,
    isLive: true,
  };
}
