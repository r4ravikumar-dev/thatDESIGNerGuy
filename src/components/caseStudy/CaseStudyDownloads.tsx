'use client';

import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Download} from 'lucide-react';
import {mediaUrl} from '@/lib/caseStudies/media';
import {formatBytes} from '@/lib/caseStudies/embeds';
import {DOWNLOAD_FORMAT, primaryDownload, type CaseStudyDownload} from '@/lib/caseStudies/types';
import {caseStudyPage} from '@/content/work';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/**
 * The case study's downloadable version (a PDF, presentation or document),
 * separate from the written story. The button downloads the file under its
 * own name (Supabase serves it as an attachment with ?download=).
 */
export function CaseStudyDownloads({downloads}: {downloads: CaseStudyDownload[]}) {
  const file = primaryDownload(downloads);
  if (!file || !mediaUrl(file.path)) return null;
  return (
    <HStack gap={3} vAlign="center" wrap="wrap" className="cs-downloads">
      <Text type="supporting" style={{...EYEBROW_STYLE, color: 'var(--color-text-secondary)'}}>
        {caseStudyPage.downloads.label}
      </Text>
      <Button
          label={caseStudyPage.downloads.button.replace('{format}', DOWNLOAD_FORMAT[file.kind])}
          tooltip={`${file.name}${file.size ? ` · ${formatBytes(file.size)}` : ''}`}
          href={`${mediaUrl(file.path)}?download=${encodeURIComponent(file.name)}`}
          variant="secondary"
          size="sm"
          icon={<Icon icon={Download} size="sm" color="inherit" />}
        />
    </HStack>
  );
}
