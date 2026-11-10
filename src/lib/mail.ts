import 'server-only';
import nodemailer, {type Transporter} from 'nodemailer';

/**
 * Sends email from the site through Ravi's Gmail (an app password, never the
 * account password). Set in .env.local and Vercel:
 *   GMAIL_USER          r4ravikumar2701@gmail.com
 *   GMAIL_APP_PASSWORD  the 16-character app password
 *   LEAD_NOTIFY_EMAIL   where request details go (defaults to ADMIN_EMAIL)
 */
const user = process.env.GMAIL_USER ?? '';
const pass = (process.env.GMAIL_APP_PASSWORD ?? '').replace(/\s+/g, '');

export const isMailConfigured = Boolean(user && pass);

export function notifyAddress() {
  return (process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || user).trim();
}

let transport: Transporter | null = null;

export async function sendMail(message: {to: string; subject: string; text: string; html: string; replyTo?: string}) {
  if (!isMailConfigured) throw new Error('Email sending is not set up.');
  transport ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {user, pass},
  });
  await transport.sendMail({from: `Ravi Kumar <${user}>`, ...message});
}

/** Escapes text for the HTML version of an email. */
export function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[ch]!);
}
