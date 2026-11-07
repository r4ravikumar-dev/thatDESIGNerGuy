'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import NextLink from 'next/link';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Table, proportional, pixel, type TableColumn} from '@astryxdesign/core/Table';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';
import {deleteCaseStudy} from '@/app/write/actions';
import type {CaseStudy} from '@/lib/caseStudies/types';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type Study = Omit<CaseStudy, 'content' | 'published'> & {has_changes: boolean};
type Row = Study & Record<string, unknown>;

const DATE = new Intl.DateTimeFormat('en-IN', {dateStyle: 'medium', timeStyle: 'short'});

/** Every case study, newest edit first, with ways to open, view and delete. */
export function CaseStudyTable({studies}: {studies: Study[]}) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState('');

  const columns: TableColumn<Row>[] = [
    {
      key: 'title',
      header: 'Case study',
      width: proportional(3, {minWidth: 220}),
      renderCell: row => (
        <VStack gap={1}>
          <NextLink href={`/write/${row.id}`} className="studio-link">
            {row.title.replace(/\*/g, '')}
          </NextLink>
          <Text type="supporting" color="secondary">
            /work/{row.slug}
          </Text>
        </VStack>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(130),
      renderCell: row => (
        <VStack gap={1}>
          <Text
            type="supporting"
            style={{
              ...EYEBROW_STYLE,
              color: row.status === 'published' ? 'var(--color-brand-text)' : 'var(--color-text-secondary)',
            }}>
            {row.status === 'published' ? 'Live' : 'Draft'}
          </Text>
          {row.has_changes && (
            <Text type="supporting" color="secondary">
              Unpublished changes
            </Text>
          )}
          {row.is_featured && (
            <Text type="supporting" color="secondary">
              On Home
            </Text>
          )}
        </VStack>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last edited',
      width: proportional(1, {minWidth: 150}),
      renderCell: row => <Text color="secondary">{DATE.format(new Date(row.updated_at))}</Text>,
    },
    {
      key: 'id',
      header: '',
      width: pixel(230),
      align: 'end',
      renderCell: row => (
        <HStack gap={1} hAlign="end">
          <Button label="Edit" size="sm" variant="secondary" href={`/write/${row.id}`} />
          {row.status === 'published' && (
            <Button label="View" size="sm" variant="ghost" href={`/work/${row.slug}`} target="_blank" />
          )}
          <Button label="Delete" size="sm" variant="ghost" onClick={() => setToDelete(row)} />
        </HStack>
      ),
    },
  ];

  if (!studies.length) {
    return (
      <VStack gap={3} className="studio-empty">
        <Heading level={2}>No case studies yet</Heading>
        <Text color="secondary">
          Start one with New case study. It opens with the ten-section template, ready to write over.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack gap={4}>
      {error && <Text color="secondary">{error}</Text>}
      <Table<Row> data={studies as Row[]} columns={columns} idKey="id" hasHover />
      <AlertDialog
        isOpen={toDelete !== null}
        onOpenChange={open => {
          if (!open) setToDelete(null);
        }}
        title={`Delete “${toDelete?.title.replace(/\*/g, '') ?? ''}”?`}
        description="This removes the case study for good, and it disappears from the site if it was live. Uploaded files stay in storage."
        actionLabel="Delete"
        cancelLabel="Keep it"
        isActionLoading={isDeleting}
        onAction={() =>
          startDelete(async () => {
            if (!toDelete) return;
            const result = await deleteCaseStudy(toDelete.id);
            if (!result.ok) setError(result.error);
            setToDelete(null);
            router.refresh();
          })
        }
      />
    </VStack>
  );
}
