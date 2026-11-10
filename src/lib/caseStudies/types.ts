import type {JSONContent} from '@tiptap/core';

export type CaseStudyStatus = 'draft' | 'published';

/** A downloadable version of the case study, separate from the written story. */
/**
 * The case study's one downloadable version (a PDF, a PowerPoint or a Word
 * file), separate from the written story.
 */
export type CaseStudyDownload = {
  kind: 'pdf' | 'slides' | 'doc';
  /** Storage path in the case-study-media bucket. */
  path: string;
  /** The file's name, used for the downloaded file. */
  name: string;
  size: number;
  mime: string;
};
export type CaseStudyLayout = 'wide' | 'split' | 'split-reverse';

/** One row of public.case_studies (supabase/migrations/0001_case_studies.sql). */
export type CaseStudy = {
  id: string;
  slug: string;
  status: CaseStudyStatus;
  title: string;
  subtitle: string;
  label: string;
  area: string;
  tags: string[];
  summary: string;
  focus: string;
  thumbnail_url: string | null;
  thumbnail_alt: string;
  thumbnail_focus: string;
  cover_url: string | null;
  layout: CaseStudyLayout;
  is_featured: boolean;
  sort_order: number;
  seo_description: string;
  /** The PDF and presentation versions offered for download. */
  downloads: CaseStudyDownload[];
  content: JSONContent;
  /** The live version, taken at publish time (null until first published). */
  published: PublishedSnapshot | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** The fields the editor's settings panel can change. */
export type CaseStudyMeta = Pick<
  CaseStudy,
  | 'slug'
  | 'title'
  | 'subtitle'
  | 'label'
  | 'area'
  | 'tags'
  | 'summary'
  | 'focus'
  | 'thumbnail_url'
  | 'thumbnail_alt'
  | 'thumbnail_focus'
  | 'cover_url'
  | 'layout'
  | 'is_featured'
  | 'sort_order'
  | 'seo_description'
  | 'downloads'
>;

/** Everything the editor saves in one go. */
export type CaseStudyDraft = CaseStudyMeta & {content: JSONContent};

/** The live version of a case study: its fields and body as published. */
export type PublishedSnapshot = CaseStudyDraft;

/** What a published case study needs before it can go live. */
export function missingForPublish(study: CaseStudyMeta): string[] {
  const missing: string[] = [];
  if (!study.title.trim()) missing.push('a headline');
  if (!study.slug.trim()) missing.push('a URL slug');
  if (!study.summary.trim()) missing.push('a summary');
  if (!study.thumbnail_url) missing.push('a thumbnail');
  if (study.thumbnail_url && !study.thumbnail_alt.trim()) missing.push('thumbnail alt text');
  return missing;
}

/** "Mamily: A calmer pregnancy!" → "mamily-a-calmer-pregnancy". */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** The file types a case study's download can be. */
export const DOWNLOAD_EXTENSIONS = ['.pdf', '.pptx', '.doc', '.docx'] as const;

/** The download's format from its file name, or null if it isn't allowed. */
export function downloadKind(name: string): CaseStudyDownload['kind'] | null {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.pptx')) return 'slides';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'doc';
  return null;
}

/** How the site names each format to visitors ("Email me the PDF"). */
export const DOWNLOAD_FORMAT: Record<CaseStudyDownload['kind'], string> = {
  pdf: 'PDF',
  slides: 'presentation',
  doc: 'document',
};

/** The case study's download (the first, for older case studies that had two). */
export function primaryDownload(downloads: CaseStudyDownload[] | undefined | null) {
  return downloads?.[0] ?? null;
}
