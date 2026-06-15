ko # Fashion Blog — Astro + Keystatic

A fast, free-to-host fashion/Pinterest blog built with **Astro (static)**,
**Keystatic CMS**, and **Tailwind CSS v4**.

## What changed from the old project

- Removed the Node server adapter and `output: 'server'` — the site now
  builds as **pure static HTML**, which deploys for free on Cloudflare
  Pages / Netlify / Vercel with no backend server needed.
- Removed the custom `/api` image upload routes (they required a running
  server). Images are managed by Keystatic directly into `/public/images`.
- Fixed broken relative imports (`../../../frontend/...`, `@backend` aliases
  that pointed nowhere).
- Rewrote `keystatic.config.ts` paths to match the real `src/content`
  folder structure.
- Added missing pages: `/posts`, `/posts/[slug]`, `/categories`,
  `/category/[slug]`, `/about`, `/contact`, `/404`, `/rss.xml`, sitemap,
  `robots.txt`.
- Added a working content reader (`src/lib/keystatic-reader.ts`).
- Fixed `PopularPosts.astro` (was importing from a non-existent path).
- Added one sample post/author/category so the homepage isn't empty.

## Local development

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- CMS admin (local only, dev mode): http://localhost:4321/keystatic

Add posts via the CMS — it writes Markdown/MDX files into
`src/content/posts/`. Commit and push those files to GitHub.

## Images (important — read this)

This project deliberately uses plain `<img>` tags from `/public/images/`
instead of Astro's `<Image />` component. With 500-2000 articles,
`import.meta.glob()`-based optimization scans the whole folder at build
time and can make Cloudflare Pages builds slow or hit limits.

Instead:
- Before uploading via Keystatic, **compress and convert images to `.webp`
  yourself** (TinyPNG, Squoosh, or any batch converter — takes seconds).
- All `<img>` tags already have `width`/`height`/`loading` set to avoid
  layout shift (CLS) without needing Astro's image pipeline.

This keeps build times at ~5 seconds even at scale.

## Ads (AdSense)

- The AdSense **loader script** is included once, globally, in
  `Analytics.astro` (in `<head>`).
- `AdSlot.astro` only renders the `<ins class="adsbygoogle">` tag and pushes
  that one slot — no duplicate script tags even with multiple ad slots per
  page.
- Each `AdSlot` has a fixed width/height per format, so ads don't shift
  your layout when they load (good for Core Web Vitals / AdSense approval).
- If you later switch to **AdSense Auto Ads**, you can drop `AdSlot.astro`
  entirely — Auto Ads just needs the loader script in `<head>`, which is
  already there.

## Editing the CMS in production (no local computer needed)

`keystatic.config.ts` automatically uses:
- `storage: { kind: 'local' }` when running `npm run dev`
- `storage: { kind: 'github' }` when `NODE_ENV === 'production'` (i.e. on
  Cloudflare Pages build)

For the GitHub mode to actually let you log in and edit at
`yourdomain.com/keystatic`, you need to:
1. Edit `repo: { owner: '...', name: '...' }` in `keystatic.config.ts` with
   your real GitHub username/repo.
2. Create a free **Keystatic Cloud** account at https://keystatic.cloud and
   connect it to your repo (this handles the GitHub OAuth — no custom
   Cloudflare Functions needed).

This is a one-time ~10 minute dashboard setup, not just a config line — but
no extra hosting cost.

For 2 authors and ~500-2000 posts, an equally valid simpler path is:
**skip the GitHub/Cloud setup entirely** and have both authors run
`npm run dev` locally, edit via `/keystatic`, then `git push`. Zero extra
setup, fully free.


## Deploying (free)

1. Push this repo to GitHub.
2. Cloudflare Pages → Create project → connect the repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add your domain in Cloudflare Pages → Custom domains.
6. Update `site` in `astro.config.mjs` to your real domain.

## Images on Cloudflare R2

For 500-2000 image-heavy posts, store images in **Cloudflare R2** and
reference them with full URLs in `featuredImage`/content images instead of
`/public`, to keep your git repo small. The `astro.config.mjs` already
allows `r2.cloudflarestorage.com` as a remote image domain.

## Ads & Analytics

Set these in a `.env` file (copy `.env.example`):

- `PUBLIC_ADSENSE_*` — Google AdSense slots
- `PUBLIC_GA4_ID` — Google Analytics 4
- `PUBLIC_PINTEREST_TAG` — Pinterest conversion tag
- `PUBLIC_CLOUDFLARE_ANALYTICS` — Cloudflare Web Analytics

## Folder structure

```
src/
  components/   Header, Footer, PostCard, AdSlot, SocialShare, etc.
  content/      posts/, authors/, categories/ (edited via Keystatic)
  layouts/      Layout.astro (SEO/meta)
  lib/          keystatic-reader.ts (content queries)
  pages/        routes (index, posts, categories, about, contact, rss)
  styles/       global.css (Tailwind)
public/
  images/posts, images/authors, images/content
```
