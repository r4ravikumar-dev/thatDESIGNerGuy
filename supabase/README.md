# Case-study studio: setup

The private writing studio lives at **`/write`**. It isn't linked anywhere, isn't indexed, and only your email can sign in. Case studies are stored in Supabase; the Work page, Home and `/work/<slug>` read them from there. Until Supabase is connected, the site keeps showing its built-in projects.

## One-time setup (about five minutes)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (the free plan is enough).
2. **Create the tables and storage.** Open `supabase/migrations/0001_case_studies.sql`, replace `you@example.com` with your email, then paste it into Supabase → SQL Editor → New query → Run.
3. **Allow the sign-in link to come back to the site.** Supabase → Authentication → URL Configuration:
   - Site URL: `https://ravi.graphikx.in`
   - Redirect URLs: add `https://ravi.graphikx.in/auth/callback` and `http://localhost:3000/auth/callback` (and your Vercel preview URL pattern if you want to sign in on previews, e.g. `https://*-r4ravikumar-devs-projects.vercel.app/auth/callback`).
4. **Add the keys.** Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Project Settings → API,
   - `ADMIN_EMAIL`, the same email as in step 2.

   Add the same three in Vercel → Settings → Environment Variables, then redeploy.
5. Open **`/write`**, enter your email, and click the link that arrives.

## Writing

- **New case study** starts with the ten-section template (Opening → Reflection). Rename, reorder, delete or add sections freely.
- **Type `/`** on an empty line for the insert menu: image, video file, video link (YouTube, Vimeo, Loom), Figma, file (PDF, PowerPoint, Word), section heading, callout, quote, lists, divider. The **Insert** button in the toolbar has the same list.
- **Drag or paste** images, videos and files straight into the page.
- The **toolbar** has paragraph styles, the site's fonts (sans, serif, mono), sizes, bold/italic/underline/strike, text colour and highlight (theme colours that work in light and dark mode), alignment, lists, links (⌘K) and undo/redo. Selecting text shows a small bubble menu.
- The **settings panel** holds what the Work page and Home need: thumbnail (with alt text and crop focus), headline (wrap one word in `*asterisks*` for the serif accent), subheadline, summary, project label, area, tags, focus line, Work-page layout, order, **Show on Home**, the cover image, the URL slug and the search description.
- Everything **autosaves** to the draft (⌘S saves at once). **Preview** shows the draft exactly as the site will, at desktop, tablet and phone widths.
- **Publish** needs a headline, a slug, a summary and a thumbnail with alt text, and every block must be complete. **Unpublish** takes it off the site and keeps it as a draft.

## Visual blocks

Beyond writing, the "/" menu and the Insert button's **Visual blocks** section add preset layouts you adjust without CSS:

- **Image grid**: 2, 3 or 4 columns; even, asymmetric (first image large) or masonry; ratio, gap, caption; reorder images and give each alt text.
- **Comparison**: before / after or old flow / new flow, 50/50 or 60/40, with labels and a line of explanation under each side.
- **Full-bleed showcase**: an image or video edge to edge (or at the page's width), with ratio, focal point, a background surface and caption.
- **Device mockups**: smartphone, tablet, laptop and browser frames. Start from single, dual overlap, triple stack or laptop + tablet + phone, then move each device (left/right, up/down), resize, rotate, bring forward or send back; give each its own screen. Shadows, spacing, stage shape, background, and what happens on phones (keep the composition, stack the devices, or show the first one).
- **Split layout**: a picture beside text you write in place; picture or text first, proportions, alignment. Stacks on phones.
- **Pull quote, callout, metrics**: quotes with attribution in three styles; callouts in four tones; results as large figures.

Click a picture inside a block to choose or replace it, or select a block (or its **Properties** button) to edit everything in the side panel's **Block** tab. Every block has a drag handle and move up / down, duplicate and delete. **Preview** shows the draft at desktop, tablet and phone widths.

## Media library and storage

Every upload goes to Supabase Storage (bucket `case-study-media`) **and** gets a row in the `assets` table (path, type, size, pixel size, alt text, original name), so the media library can list and reuse anything uploaded before. Blocks store each file's storage path and details, never the file itself or base64 data. Alt text is required on images before publishing.

## Drafts and the live version

Editing always changes the **draft** (autosaved). **Publish** checks everything (required fields, every block's media and alt text, no unsafe links, no embedded data) and copies the draft into the **published** version the site reads. After that, edits stay in the draft until you press **Update**; the dashboard marks a live case study with "Unpublished changes" when it has some.

## Good to know

- Files are limited to **50 MB** each (the free-plan ceiling). For long videos, upload to YouTube, Vimeo or Loom and use **Video link**.
- Figma embeds need the file shared as "Anyone with the link can view".
- PDFs, PowerPoint and Word files can show an inline preview (toggle under the file). Office previews use Microsoft's online viewer, which needs the file's public link.
- Security: the proxy (`src/proxy.ts`) sends anyone but you to the sign-in page, every save checks your email on the server, and the database's row-level security checks it a third time. The public site can only ever read published case studies.
