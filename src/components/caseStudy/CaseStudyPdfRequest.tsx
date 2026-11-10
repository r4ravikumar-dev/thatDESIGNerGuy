'use client';

import {useActionState, useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowRight, Mail} from 'lucide-react';
import {Lines} from '@/components/storytelling/Lines';
import {requestCaseStudyPdf, type PdfRequestState} from '@/app/work/[slug]/actions';
import {caseStudyPage} from '@/content/work';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';


/** The request copy with the file's format filled in ("Email me the PDF"). */
function copyFor(format: string) {
  return Object.fromEntries(
    Object.entries(caseStudyPage.pdfRequest).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replaceAll('{format}', format) : value,
    ]),
  ) as typeof caseStudyPage.pdfRequest;
}

/**
 * The end of a case study: an offer of its download (PDF, presentation or
 * document). A line of text and a link first; choosing it opens a short form
 * (name, email, mobile). On sending, the visitor gets the file by email and Ravi gets their details
 * (requestCaseStudyPdf). In the studio's preview the form shows but doesn't send.
 */
export function CaseStudyPdfRequest({
  slug,
  format,
  isPreview = false,
}: {
  slug: string;
  /** PDF, presentation or document. */
  format: string;
  isPreview?: boolean;
}) {
  const copy = copyFor(format);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startedAt, setStartedAt] = useState(0);
  const [state, action, isSending] = useActionState<PdfRequestState, FormData>(
    requestCaseStudyPdf.bind(null, slug),
    {status: 'idle'},
  );

  if (state.status === 'sent') {
    return (
      <VStack gap={3} className="cs-pdf" aria-live="polite">
        <Heading level={2} style={{...typeRole('headline-l'), letterSpacing: '-0.02em'}}>
          <Lines text={copy.sentTitle} />
        </Heading>
        <Text color="secondary">{copy.sentBody.replace('{email}', state.fields?.email ?? email)}</Text>
      </VStack>
    );
  }

  return (
    <VStack gap={6} className="cs-pdf">
      <VStack gap={3}>
        <Text type="supporting" style={EYEBROW_STYLE}>
          {copy.label}
        </Text>
        <Heading level={2} textWrap="balance" style={{...typeRole('headline-l'), letterSpacing: '-0.02em'}}>
          <Lines text={copy.title} />
        </Heading>
        <Text color="secondary" textWrap="pretty" style={{maxInlineSize: '52ch'}}>
          {copy.body}
        </Text>
      </VStack>

      {!isOpen ? (
        <HStack>
          <Button
            label={copy.open}
            variant="ghost"
            className="cs-pdf-link"
            onClick={() => {
              setIsOpen(true);
              setStartedAt(Date.now());
            }}
            endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />}
          />
        </HStack>
      ) : (
        <form action={action} noValidate>
          <VStack gap={6}>
            <input type="hidden" name="startedAt" value={startedAt} />
            {/* A field people never see; bots fill it in. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="cs-pdf-trap" aria-hidden />
            <Grid columns={{minWidth: 200, max: 3}} gap={6}>
              <TextInput
                label={copy.fields.name}
                htmlName="name"
                value={name}
                onChange={setName}
                autoComplete="name"
                autoCapitalize="words"
                hasAutoFocus
                width="100%"
                containerClassName="contact-field"
                status={state.errors?.name ? {type: 'error', message: state.errors.name} : undefined}
                statusVariant="detached"
              />
              <TextInput
                type="email"
                label={copy.fields.email}
                htmlName="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                hasSpellCheck={false}
                width="100%"
                containerClassName="contact-field"
                status={state.errors?.email ? {type: 'error', message: state.errors.email} : undefined}
                statusVariant="detached"
              />
              <TextInput
                type="tel"
                label={copy.fields.phone}
                htmlName="phone"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                inputMode="tel"
                width="100%"
                containerClassName="contact-field"
                status={state.errors?.phone ? {type: 'error', message: state.errors.phone} : undefined}
                statusVariant="detached"
              />
            </Grid>
            <HStack gap={4} vAlign="center" wrap="wrap">
              <Button
                type="submit"
                label={copy.submit}
                variant="primary"
                isLoading={isSending}
                isDisabled={isPreview}
                icon={<Icon icon={Mail} size="sm" color="inherit" />}
              />
              {(state.message || isPreview) && (
                <Text role="alert" color="secondary">
                  {isPreview ? copy.preview : state.message}
                </Text>
              )}
            </HStack>
            <Text type="supporting" color="secondary" style={{maxInlineSize: '60ch'}}>
              {copy.note}
            </Text>
          </VStack>
        </form>
      )}
    </VStack>
  );
}
