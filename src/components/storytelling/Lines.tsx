import {Fragment, type ReactNode} from 'react';

/** The italic serif accent, for one word per headline. Always in brand blue. */
export const accentStyle = {
  fontFamily: 'var(--font-family-accent)',
  color: 'var(--color-brand-text)',
  fontStyle: 'italic',
  fontWeight: 400,
  letterSpacing: '-0.01em',
} as const;

/**
 * Inline markup used in content files:
 * - "**text**" → strong emphasis
 * - "*text*"   → accent: the italic serif, used for one word per headline
 */
function Inline({text}: {text: string}): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} style={accentStyle}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

/**
 * Renders copy from content files: "\n" becomes a line break, "**text**"
 * emphasis and "*text*" the italic serif accent.
 */
export function Lines({text}: {text: string}) {
  const lines = text.split('\n');
  return lines.map((line, index) => (
    <Fragment key={index}>
      <Inline text={line} />
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}
