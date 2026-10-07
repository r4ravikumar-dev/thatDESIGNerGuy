'use client';

import {Fragment} from 'react';
import {Heading} from '@astryxdesign/core/Heading';
import {typeRole, type TypeRole} from '@/theme/typeScale';

type ScriptName = {text: string; lang: string};

/**
 * One word or name in three scripts (English, Hindi, Kannada) joined by grey
 * dots, as in the hero. Each piece stays whole with its dot, so lines only
 * break after a dot, never before one. Styles: .portfolio-hero-names.
 */
export function ScriptNames({
  names,
  role = 'display-m',
  level = 2,
}: {
  names: readonly ScriptName[];
  role?: TypeRole;
  level?: 1 | 2 | 3;
}) {
  return (
    <Heading
      level={level}
      className="portfolio-hero-names"
      style={{...typeRole(role), letterSpacing: '-0.03em', lineHeight: 1.3}}>
      {names.map((name, index) => (
        <Fragment key={name.lang}>
          <span className="portfolio-hero-name" lang={name.lang}>
            {name.text}
            {index < names.length - 1 && (
              <span aria-hidden className="portfolio-hero-dot">
                {' •'}
              </span>
            )}
          </span>
          {index < names.length - 1 && ' '}
        </Fragment>
      ))}
    </Heading>
  );
}
