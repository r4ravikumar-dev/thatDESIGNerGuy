import type {MouseEvent} from 'react';
import {site} from '@/content/site';

/** The file name the résumé saves under. */
export const RESUME_FILE_NAME = 'Ravi-Kumar-Resume.pdf';

/**
 * The résumé links' click: opens the PDF in a new tab to read, and saves a
 * copy at the same time. Modified clicks (open in background tab, etc.) are
 * left to the browser. Without JavaScript the link still opens the PDF.
 */
export function openResume(event: MouseEvent<HTMLElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;
  event.preventDefault();
  window.open(site.resumeUrl, '_blank', 'noopener');
  const download = document.createElement('a');
  download.href = site.resumeUrl;
  download.download = RESUME_FILE_NAME;
  document.body.appendChild(download);
  download.click();
  download.remove();
}
