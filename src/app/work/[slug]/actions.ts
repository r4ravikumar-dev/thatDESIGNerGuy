'use server';

import {headers} from 'next/headers';
import {getPublishedCaseStudy} from '@/lib/caseStudies/queries';
import {mediaUrl} from '@/lib/caseStudies/media';
import {escapeHtml, isMailConfigured, notifyAddress, sendMail} from '@/lib/mail';
import {site} from '@/content/site';
import {DOWNLOAD_FORMAT, primaryDownload} from '@/lib/caseStudies/types';

export type PdfRequestState = {
  status: 'idle' | 'sent' | 'error';
  message?: string;
  fields?: {name?: string; email?: string; phone?: string};
  /** Which fields need another look. */
  errors?: Partial<Record<'name' | 'email' | 'phone', string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** 7–15 digits, optionally with a leading + and spaces, dashes or brackets. */
const PHONE = /^\+?[\d\s\-()]{7,20}$/;

/** A form filled in under two seconds is a bot, not a person. */
const MIN_FILL_MS = 2000;

/**
 * "Get a copy of this case study": checks the visitor's name, email and
 * mobile, emails them a link to the case study's download (PDF, presentation
 * or document), and emails Ravi their details. Only published case studies
 * with a download can be requested.
 */
export async function requestCaseStudyPdf(slug: string, _: PdfRequestState, formData: FormData): Promise<PdfRequestState> {
  const name = String(formData.get('name') ?? '').trim().slice(0, 120);
  const email = String(formData.get('email') ?? '').trim().toLowerCase().slice(0, 200);
  const phone = String(formData.get('phone') ?? '').trim().slice(0, 30);
  const fields = {name, email, phone};

  // Bots: the hidden "website" field is filled, or the form came back too fast.
  const startedAt = Number(formData.get('startedAt') ?? 0);
  if (String(formData.get('website') ?? '') || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return {status: 'sent', fields};
  }

  const errors: PdfRequestState['errors'] = {};
  if (name.length < 2) errors.name = 'Add your name.';
  if (!EMAIL.test(email)) errors.email = 'That email doesn’t look right.';
  if (!PHONE.test(phone) || phone.replace(/\D/g, '').length < 7) errors.phone = 'Add a mobile number, with the country code if outside India.';
  if (Object.keys(errors).length) return {status: 'error', fields, errors};

  const study = await getPublishedCaseStudy(slug);
  const pdf = primaryDownload(study?.downloads);
  if (!study || !pdf || !mediaUrl(pdf.path)) {
    return {status: 'error', fields, message: 'This case study’s file isn’t available right now.'};
  }
  const format = DOWNLOAD_FORMAT[pdf.kind];
  if (!isMailConfigured) {
    return {status: 'error', fields, message: 'Sending is switched off for the moment. Email me and I’ll send it over.'};
  }

  const title = study.title.replace(/\*/g, '');
  const link = `${mediaUrl(pdf.path)}?download=${encodeURIComponent(pdf.name)}`;
  const page = `${site.url}/work/${study.slug}`;
  const firstName = name.split(/\s+/)[0];

  try {
    // To the visitor: the link to their copy.
    await sendMail({
      to: email,
      replyTo: notifyAddress(),
      subject: `Your copy of “${title}”`,
      text: [
        `Hi ${firstName},`,
        '',
        `Thanks for your interest. Here’s the case study as a ${format}:`,
        link,
        '',
        `You can also read it online: ${page}`,
        '',
        'If you’d like to talk it through, just reply to this email.',
        '',
        'Ravi Kumar',
      ].join('\n'),
      html: `<p>Hi ${escapeHtml(firstName)},</p>
<p>Thanks for your interest. Here’s the case study as a ${escapeHtml(format)}:</p>
<p><a href="${escapeHtml(link)}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#2059DF;color:#ffffff;text-decoration:none;font-weight:600">Download “${escapeHtml(title)}”</a></p>
<p>You can also read it online: <a href="${escapeHtml(page)}">${escapeHtml(page)}</a></p>
<p>If you’d like to talk it through, just reply to this email.</p>
<p>Ravi Kumar</p>`,
    });

    // To Ravi: who asked, and for what.
    const when = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'});
    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    await sendMail({
      to: notifyAddress(),
      replyTo: email,
      subject: `${format[0].toUpperCase() + format.slice(1)} requested: ${title} · ${name}`,
      text: [
        `${name} asked for the ${format} of “${title}”.`,
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Mobile: ${phone}`,
        `Case study: ${page}`,
        `When: ${when} IST`,
        ip ? `IP: ${ip}` : '',
      ].filter(Boolean).join('\n'),
      html: `<p><strong>${escapeHtml(name)}</strong> asked for the ${escapeHtml(format)} of “${escapeHtml(title)}”.</p>
<table cellpadding="4">
<tr><td>Name</td><td>${escapeHtml(name)}</td></tr>
<tr><td>Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
<tr><td>Mobile</td><td><a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ''))}">${escapeHtml(phone)}</a></td></tr>
<tr><td>Case study</td><td><a href="${escapeHtml(page)}">${escapeHtml(page)}</a></td></tr>
<tr><td>When</td><td>${escapeHtml(when)} IST</td></tr>
</table>`,
    });
  } catch (error) {
    console.error('[pdf request] send failed:', error instanceof Error ? error.message : error);
    return {status: 'error', fields, message: 'The email couldn’t be sent. Try again in a minute.'};
  }

  return {status: 'sent', fields};
}
