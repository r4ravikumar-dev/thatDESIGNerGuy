'use server';

import {headers} from 'next/headers';
import {escapeHtml, isMailConfigured, notifyAddress, sendMail} from '@/lib/mail';
import {contactForm} from '@/content/contact';
import {site} from '@/content/site';

export type ContactInput = {
  name: string;
  email: string;
  topic: string | null;
  message: string;
  /** Hidden from people; bots fill it in. */
  website?: string;
  /** When the visitor started the form (ms), to spot instant bot submissions. */
  startedAt?: number;
};

export type ContactResult = {status: 'sent' | 'error' | 'unconfigured'};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 3000;

/**
 * The Contact page's form: emails Ravi everything the visitor filled in
 * (name, email, topic, message, when and from where), with Reply going
 * straight to the visitor. Checked again here, whatever the browser did.
 * Without email set up it answers "unconfigured", and the page falls back
 * to opening the visitor's own email app.
 */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const name = String(input.name ?? '').trim().slice(0, 120);
  const email = String(input.email ?? '').trim().slice(0, 200);
  const topic = contactForm.topics.includes(String(input.topic)) ? String(input.topic) : 'Not chosen';
  const message = String(input.message ?? '').trim().slice(0, 5000);

  // Bots: the hidden field is filled, or the form was sent within seconds.
  if (input.website || (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS)) {
    return {status: 'sent'};
  }
  if (!name || !EMAIL.test(email) || !message) return {status: 'error'};
  if (!isMailConfigured) return {status: 'unconfigured'};

  const when = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'});
  const request = await headers();
  const ip = request.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const agent = request.get('user-agent') ?? '';
  const page = `${site.url}/contact`;

  try {
    await sendMail({
      to: notifyAddress(),
      replyTo: `${name} <${email}>`,
      subject: `New message: ${topic} · ${name}`,
      text: [
        `${name} sent a message from your portfolio.`,
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `About: ${topic}`,
        '',
        'Message:',
        message,
        '',
        `When: ${when} IST`,
        `From: ${page}`,
        ip ? `IP: ${ip}` : '',
        agent ? `Browser: ${agent}` : '',
        '',
        'Reply to this email to answer them directly.',
      ]
        .filter(line => line !== null)
        .join('\n'),
      html: `<p><strong>${escapeHtml(name)}</strong> sent a message from your portfolio.</p>
<table cellpadding="4">
<tr><td>Name</td><td>${escapeHtml(name)}</td></tr>
<tr><td>Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
<tr><td>About</td><td>${escapeHtml(topic)}</td></tr>
</table>
<p><strong>Message</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<p style="color:#6b7280;font-size:13px">${escapeHtml(when)} IST · ${escapeHtml(page)}${ip ? ` · IP ${escapeHtml(ip)}` : ''}<br>${escapeHtml(agent)}</p>
<p>Reply to this email to answer them directly.</p>`,
    });
  } catch (error) {
    console.error('[contact] send failed:', error instanceof Error ? error.message : error);
    return {status: 'error'};
  }
  return {status: 'sent'};
}
