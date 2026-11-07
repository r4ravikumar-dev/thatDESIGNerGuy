import type {JSONContent} from '@tiptap/core';
import {validateBlocks} from './blocks';

/** True if any string value in the document is inline data (base64 and the like). */
function hasInlineData(value: unknown): boolean {
  if (typeof value === 'string') return /^\s*data:/i.test(value);
  if (Array.isArray(value)) return value.some(hasInlineData);
  if (value && typeof value === 'object') return Object.values(value).some(hasInlineData);
  return false;
}

/**
 * Everything wrong with a case study's body that would stop it going live.
 * Also refuses anything embedded as inline data: media must be uploads in storage.
 */
export function validateDocument(content: JSONContent): string[] {
  const problems = validateBlocks(content as Parameters<typeof validateBlocks>[0]);
  if (hasInlineData(content)) problems.unshift('Something is embedded as raw data; upload it instead');
  return problems;
}
