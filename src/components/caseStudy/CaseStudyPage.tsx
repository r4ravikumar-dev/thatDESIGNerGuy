import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Chapter} from '@/components/editorial/Chapter';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {BigStatement} from '@/components/editorial/BigStatement';
import {CtaButton} from '@/components/navigation/CtaButton';
import {CaseStudyArticle} from './CaseStudyArticle';
import {CaseStudyDownloads} from './CaseStudyDownloads';
import {CaseStudyPdfRequest} from './CaseStudyPdfRequest';
import {caseStudyPage} from '@/content/work';
import {DOWNLOAD_FORMAT, primaryDownload, type CaseStudy} from '@/lib/caseStudies/types';
import {mediaUrl} from '@/lib/caseStudies/media';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/**
 * A whole case study page: the opening (label, headline, subheadline and the
 * opening visual), the story written in the studio, the next case study, and
 * an invitation to talk. Shared by /work/[slug] and the studio's preview.
 */
export function CaseStudyPage({
  study,
  next,
  isPreview = false,
}: {
  study: CaseStudy;
  next?: Pick<CaseStudy, 'slug' | 'title' | 'label'> | null;
  /** The studio's preview: the request form shows but doesn't send. */
  isPreview?: boolean;
}) {
  const download = primaryDownload(study.downloads);
  const label = [study.label, study.area].filter(Boolean).join(' · ');
  return (
    <VStack gap={0}>
      <EditorialHero
        label={label || undefined}
        title={study.title}
        description={study.subtitle || study.summary}
        meta={study.tags}
        width="narrow"
      />

      {/* The opening visual sits at the top of the story's column, before
        its first section, at the same width as everything below it. */}
      <Chapter width="narrow" label="Case study" className="cs-article-chapter">
        <CaseStudyDownloads downloads={study.downloads ?? []} />
        {study.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="cs-cover"
            src={mediaUrl(study.cover_url)}
            alt={study.thumbnail_alt}
            fetchPriority="high"
          />
        )}
        <CaseStudyArticle content={study.content} />
      </Chapter>

      {/* The end of the story: the download, emailed on request. */}
      {download && (
        <Chapter width="narrow" label="Get a copy">
          <CaseStudyPdfRequest slug={study.slug} format={DOWNLOAD_FORMAT[download.kind]} isPreview={isPreview} />
        </Chapter>
      )}

      {next && (
        <Chapter label={caseStudyPage.next}>
          <HStack justify="between" vAlign="end" gap={6} wrap="wrap">
            <VStack gap={2}>
              <Text type="supporting" style={EYEBROW_STYLE}>
                {caseStudyPage.next}
              </Text>
              <Text type="large">{next.label || next.title.replace(/\*/g, '')}</Text>
            </VStack>
            <HStack gap={3}>
              <CtaButton label={caseStudyPage.allWork} href="/work" variant="ghost" size="md" />
              <CtaButton label={next.title.replace(/\*/g, '')} href={`/work/${next.slug}`} variant="secondary" size="md" />
            </HStack>
          </HStack>
        </Chapter>
      )}

      <BigStatement {...caseStudyPage.closing} />
    </VStack>
  );
}
