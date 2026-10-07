import {ImageResponse} from 'next/og';

export const size = {width: 180, height: 180};
export const contentType = 'image/png';

/** The "R" monogram from icon.svg, on an opaque square for iOS home screens. */
export default function AppleIcon() {
  return new ImageResponse(
    <svg width={180} height={180} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#2059DF" />
      <path
        d="M22 48V16h11a9 9 0 0 1 0 18H22M32 34l11 14"
        fill="none"
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>,
    size,
  );
}
