# SSG / ISR Migration Plan

_Status: Planning only. No code changes proposed yet._

## Why this exists

The current site is a Vite + React SPA. Every route — including the 21-post
research library at `/blog/*` and the marketing pages at `/`, `/products`,
`/about`, `/careers` — is rendered client-side. SEO metadata for blog posts
is patched into the document head at runtime by `usePostSEO` in
`Frontend/src/pages/Blog.jsx`.

Two structural problems follow from that architecture:

1. **Search engines see a JS shell first.** Googlebot has improved at
   executing JavaScript, but the site is at a permanent disadvantage compared
   to prerendered competitors on time-to-index and time-to-rank for research
   content that we want to earn organic reach.
2. **Unknown blog slugs return HTTP 200 with a "Not found" component.** This
   is a soft-404 that search engines discount, and it is unfixable inside the
   SPA because the shell has to load before the client can decide the slug
   is invalid.

The proposal here is to move rendered HTML for the marketing pages and the
blog to a prerender/ISR pipeline while keeping the SPA experience for the
authenticated `/admin` surface.

## Option 1 — Next.js App Router (Recommended)

**What it looks like:** Rewrite the routing shell as a Next.js 15 App Router
project. Move each page into `app/<route>/page.jsx`. Reuse every
`src/components/*` file unchanged; they are already framework-agnostic.
The Express API stays as-is, mounted at `/api` via Vercel's route rewrite,
or migrated to Next.js route handlers over time.

**Delivery model per route:**

| Route | Delivery | Reason |
|---|---|---|
| `/`, `/products`, `/about`, `/careers`, `/contact` | Static generation (SSG) | Content changes with a redeploy; no per-request data. |
| `/privacy`, `/terms`, `/cookies` | SSG | Same. |
| `/blog` (index) | ISR with 60s revalidation | New posts should surface without a manual redeploy. |
| `/blog/:slug` | ISR with 300s revalidation + `generateStaticParams` from `blog.json` | Prerendered on build; regenerated on demand. Unknown slugs 404 correctly. |
| `/admin` | SPA / dynamic | Auth-gated, per-user. No SEO value. |

**Wins:**
- Real HTTP 404 for missing blog slugs (`notFound()` from `next/navigation`).
- Server-rendered `<meta>` tags — Google, Twitter, LinkedIn all see them on
  first fetch, no runtime patching.
- Sitemap and `robots.txt` become code (`app/sitemap.ts`, `app/robots.ts`).
- Image optimization via `next/image` — CAD renders and product screenshots
  cache-hit at native breakpoints.
- Vercel-native. Rolling releases, Fluid Compute, and preview URLs work out
  of the box.

**Costs:**
- Rewrite `App.jsx` + `main.jsx` boot glue.
- Convert every `useLocation`/`useNavigate` call to `next/navigation`
  equivalents (~15 sites across pages).
- Convert `<Link to>` from `react-router-dom` to `next/link` (drop-in).
- Blog fetch: replace `api.listBlogs()` calls with server components that
  read the DB directly, plus `generateMetadata` for OG/Twitter.
- One-time Tailwind + PostCSS config reconciliation (Next has its own).
- Framer Motion and GSAP work in Next with the `use client` directive on
  the components that need them.

**Effort:** ~4 engineer-days for the routing rewrite and blog conversion;
another 2 days for testing and preview-URL polish.

## Option 2 — Vike (vite-plugin-ssr successor)

**What it looks like:** Keep Vite as the bundler. Add Vike, which introduces
per-page `+onBeforeRender.js` files that run at build time (SSG), per
request (SSR), or on a schedule (ISR-lite). Zero framework change; every
existing React component stays.

**Wins:**
- Smallest code delta — the current Vite pipeline is preserved end-to-end.
- Fine-grained control over which pages prerender, which SSR, which stay SPA.
- No lock-in to Next's data-fetching primitives.

**Costs:**
- ISR is not native; you build a cron-based rebuild pipeline for the blog
  index or rely on webhook redeploys when the DB changes.
- Ecosystem is smaller. Vercel has no Vike-specific features; you deploy
  the same way as an SPA plus a Node server component.
- Vike's routing model is different enough from `react-router-dom` that
  every route file is still touched.

**Effort:** ~3 engineer-days.

## Option 3 — Astro islands

**What it looks like:** Rebuild the marketing shell (`/`, `/products`,
`/about`, `/careers`, `/contact`, `/blog`) as Astro. The React components
that need interactivity (animations, form state) become "islands" that
Astro hydrates individually. Admin stays as a separate React app served
under `/admin`.

**Wins:**
- Best-in-class content delivery — near-zero JS on pages that are mostly
  text (About, Legal).
- Astro's markdown pipeline could replace `react-markdown` for the blog
  library, with typed frontmatter and content collections.
- SEO output is textbook-clean out of the box.

**Costs:**
- Framer Motion, GSAP, and React Router are all React-specific. Astro
  supports React islands but every animation on the homepage becomes a
  hydration boundary decision.
- Splits the codebase into two apps (marketing + admin) with different
  build pipelines. Higher ongoing cost.
- Team has to learn Astro's mental model.

**Effort:** ~5 engineer-days. Best content delivery of the three, but the
learning curve and codebase split make it the highest-risk option.

## Recommendation

**Next.js App Router.** The blog is the single most compelling SEO surface
we have, and Next's ISR + `generateStaticParams` on a slug-partitioned
route hits every requirement without additional infrastructure. The
existing React components port over unchanged, and the ecosystem alignment
with Vercel is a real operational advantage.

## Phased plan

If we go with Next:

1. **Phase 0 — dry run.** Create a `next-ssg-preview` branch and stand up
   a bare Next.js project at the repo root. Port `/`, `/about`, and one
   blog post. Confirm Tailwind, Framer Motion, and Sentry all work. Ship
   a preview URL. Effort: 1 day.
2. **Phase 1 — marketing pages.** Port `/`, `/products`, `/about`,
   `/careers`, `/contact`, `/privacy`, `/terms`, `/cookies`. Retain
   `App.jsx`'s current shell components (Navbar, Footer, ErrorBoundary,
   PremiumBackground) inside `app/layout.jsx`. Effort: 1.5 days.
3. **Phase 2 — blog library.** Convert `/blog` and `/blog/:slug` to
   server components. Move blog data reads into the server. Wire
   `generateStaticParams`, `generateMetadata`, and `notFound()`. Delete
   `usePostSEO`. Effort: 1.5 days.
4. **Phase 3 — admin.** Keep the admin as a client-only sub-tree under
   `app/admin/`, wrapping the existing React tree with a `"use client"`
   directive. Effort: 0.5 days.
5. **Phase 4 — Vercel plumbing.** Move `robots.ts`, `sitemap.ts`, and OG
   image generation into Next's file conventions. Delete
   `scripts/generate-sitemap.mjs` and its `prebuild` hook. Effort: 0.5 days.

**Total: ~5 engineer-days for the full migration.** Preview URL after
day 1; production cutover after Phase 4 with a preview-to-production
promotion via Vercel.

## What we are not committing to

- No move away from Postgres. The DB layer stays behind the API surface.
- No swap of the animation stack. Framer Motion and GSAP both run in
  Next client components without changes.
- No rebranding of `/admin`. Admin stays a SPA sub-tree under the new shell.

## Open questions

- Do we want to consolidate `api/[...path].js` into Next route handlers
  during the migration, or keep the Express app mounted for now? Keeping
  Express is faster; consolidating is cleaner in the long run.
- Do we want to move the blog source of truth from the DB to Markdown files
  in the repo? That maps naturally to Next's content pipeline and would
  make `seed-blogs.js` unnecessary. It also puts research content behind a
  PR review, which we may or may not want.
