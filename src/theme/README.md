# Portfolio theme

`portfolioTheme.ts` extends the Astryx [Stone](https://astryx.atmeta.com/themes?theme=stone) theme: warm stone and slate. The theme sets headings and body text in IBM Plex Sans, eyebrows and code in IBM Plex Mono, and accent words in Instrument Serif. Put any site-specific theme changes in this file.

## Typography

`typeScale.ts` holds Responsive Typography Scale v1:

| Family   | Roles (desktop / tablet / mobile, px)              | Line height |
| -------- | -------------------------------------------------- | ----------- |
| Display  | L 56/50/44 · M 48/44/40 · S 40/36/36               | 110%        |
| Headline | XL 36/34/32 · L 32/30/28 · M 28/26/24 · S 24/22/20 | 125%        |
| Label    | L 18/17/16 · M 16/15/14 · S 14/14/14               | 125%        |
| Body     | L 20/18/18 · M 16/16/14 (135%) · S 14/14/14 (140%) | 135% / 140% |
| Caption  | L 14/13/13 · M 13/12/12 · S 12/12/12               | 150%        |

The tablet values apply below 1024px, and the mobile values below 768px.

Astryx's built-in text styles are mapped onto these roles, so most components need no extra props:

| Astryx style               | role         | Used for                          |
| -------------------------- | ------------ | --------------------------------- |
| `display-1`                | Display L    | Homepage hero                     |
| `display-2`                | Display M    | Major storytelling statements     |
| `display-3`                | Display S    | Page titles                       |
| `heading-1`                | Headline XL  |                                   |
| `heading-2`                | Headline L   |                                   |
| `heading-3`                | Headline S   | Card and item titles              |
| `heading-4` to `heading-6` | Label L to S |                                   |
| `large`                    | Body L       | Introductory copy                 |
| `body`                     | Body M       | Body copy                         |
| `label`                    | Label S      | Eyebrows, navigation, form labels |
| `supporting`               | Caption M    | Metadata                          |

When a heading's role differs from its element's default, set the role with `style={typeRole('headline-xl')}`. For example, section headings are `<h2>` elements set as Headline XL, and Practice headings are `<h3>` elements set as Headline L.

The other files (`portfolio.css`, `portfolio.js`, `portfolio.d.ts`) are generated. Don't edit them by hand. After changing the source, rebuild them:

```bash
npm run theme:build
```

To switch to another Astryx theme, install it (`npm install @astryxdesign/theme-<name>`), change `extends` in `portfolioTheme.ts`, update the Google Fonts link in `src/app/layout.tsx` to match its typefaces, and rebuild.
