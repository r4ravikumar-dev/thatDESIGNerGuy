import {ImageResponse} from 'next/og';

export const size = {width: 180, height: 180};
export const contentType = 'image/png';

/** The "r" monogram from icon.svg, on an opaque square for iOS home screens. */
export default function AppleIcon() {
  return new ImageResponse(
    <svg width={180} height={180} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#2059DF" />
      <path
        d="M24 46V24M24 32c0-6 5-9 14-9"
        fill="none"
        stroke="#ffffff"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>,
    size,
  );
}
