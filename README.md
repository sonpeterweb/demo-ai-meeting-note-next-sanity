# Listenote — AI Meeting Notes Demo

**Listenote** turns meeting transcripts into clear summaries, decisions, and action items. This portfolio demo includes a marketing site (Sanity-driven blocks and pricing), a changelog, and an interactive AI workflow.

![Screenshot of Sanity Studio using Presentation Tool to do Visual Editing](https://cdn.sanity.io/images/a03xrv11/production/e83fee6a672a9df53548878eccddc0f962d1cac8-1920x931.webp)

[![Next.js][next-js]][next-js-url] [![Sanity][sanity]][sanity-url] [![React][react]][react-url] [![Typescript][typescript]][typescript-url] [![Tailwind][tailwind]][tailwind-url] [![Shadcn][shadcn]][shadcn-url]

**Live demo:** [listenote.vercel.app](https://listenote.vercel.app/)

## Case study

**Role:** Frontend / full-stack engineer (solo) — Peter Son 
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Sanity CMS · OpenAI · Vitest · Vercel 
**Live:** [listenote.vercel.app](https://listenote.vercel.app/)

### The problem

Most "AI SaaS" portfolio pieces stop at a static landing page. I wanted a demo that proves I can ship the things real clients pay for: a marketing site their team can edit without a developer, plus a genuinely interactive product feature backed by a server-side AI integration.

### What I built

- **CMS-driven marketing site.** The homepage, pricing tiers, and CTAs are composed from typed Sanity blocks (`hero`, `pricing-row`, `cta`, etc.), so non-technical editors can restructure pages in Sanity Studio (`/studio`) with live visual editing — no redeploy required.
- **Interactive AI meeting-notes demo (`/ai-demo`).** Users paste a transcript or load a sample, and a Next.js **server action** calls an AI provider (OpenAI adapter) to return a structured summary, key decisions, and action items. Sample transcripts run fully offline; live calls degrade gracefully with clear error states for quota/auth issues.
- **Sanity-powered changelog (`/what-new`).** Release entries with impact badges, audience targeting, and Portable Text bodies, including list/detail routes and empty states.
- **Production polish.** Accessible shadcn/ui components, `prefers-reduced-motion`-aware Framer Motion hero, SEO metadata, Open Graph image, sitemap, and PWA icons.

### Engineering highlights

- **End-to-end type safety** — GROQ queries generate TypeScript types (`sanity.types.ts`); blocks render through a discriminated-union `componentMap`.
- **Server-first data fetching** — React Server Components by default, client components only where interactivity is required, with ISR/revalidation on content lists.
- **Tested core logic** — Vitest coverage for the AI server action, OpenAI adapter, provider error handling, and key UI blocks (17 tests).
- **Resilient AI layer** — provider abstraction, timeouts, and heuristic fallbacks keep the demo stable without API credentials.

### Outcome

A single deployment serving a marketing site, an editable CMS, and a working AI feature — demonstrating I can own a modern Next.js + headless-CMS product from schema to UI to deploy. Try it: [listenote.vercel.app](https://listenote.vercel.app/).

## Getting Started

### Demo overview

Listenote is an AI meeting-notes SaaS demo with a complete marketing + product-experience stack:

- `/**` (Marketing homepage) – Hero animations narrate "meeting → notes → actions", while pricing tiers, CTAs, and messaging are editable via Sanity (`hero`, `pricing-tier` docs). Framer Motion sequences respect `prefers-reduced-motion`, and shadcn/ui cards produce polished, accessible layouts.
- `/what-new` (Changelog) – Lists `changelog-entry` documents from Sanity with release date, impact badge, audience targeting, highlights, and portable-text body copy. Empty states are handled when no entries exist.
  - `/what-new/[slug]` (Changelog detail) – Deep links into the same content with consistent badges, breadcrumbs, and share-ready layout.
- `/ai-demo` (Interactive AI workflow) – A guided experience backed by `ai-demo-sample` and `ai-demo-config` documents. Users can load sample transcripts, run a server action (`submitMeetingTranscript`) that calls an AI provider (OpenAI adapter included), and review structured summaries with copy/email/export affordances. Heuristic fallbacks keep the demo stable if credentials are missing.

Supporting documents (`pricing-tier`, `changelog-entry`, `ai-demo-sample`, `ai-demo-config`, `admin-user`) are registered in Sanity Studio.

### Run locally

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Copy environment variables (see [Environment variables](#environment-variables)) into `.env.local`.

3. Start the development server:

```bash
pnpm dev
```

4. Open the app at [http://localhost:3000](http://localhost:3000) and the Studio at [http://localhost:3000/studio](http://localhost:3000/studio).

### Adding content with Sanity

#### Import sample data (optional)

```bash
npx sanity dataset import listenote-seed.ndjson production --replace
```

#### Publish your first document

Document types include `Category`, `FAQ`, `Page`, `Pricing Tier`, `Changelog Entry`, `AI Demo Sample`, `AI Demo Config`, and `Admin User`.

From the Studio, create and publish a `Page` document. Content appears on the site once published.

#### Extend the schema

Page blocks live under `sanity/schemas/blocks/`. Add new block schema types, register them in `sanity/schema.ts` and `sanity/schemas/documents/page.ts`, then add matching query fragments and React components in `sanity/queries/` and `components/blocks/`.

#### Configure the AI demo (optional)

The `/ai-demo` route showcases the meeting summarization workflow. To connect it to a live provider:

1. Create an API key with your preferred provider (the project ships with an OpenAI-ready adapter).
2. Add the following variables to your `.env.local` file:
   ```bash
   OPENAI_API_KEY=sk-...
   OPENAI_API_BASE=https://api.openai.com/v1 # optional if using the default endpoint
   AI_DEMO_PROVIDER=openai
   AI_DEMO_MODEL=gpt-4o-mini
   AI_DEMO_MAX_TOKENS=1200
   AI_DEMO_TEMPERATURE=0.7
   ```
3. Update the “AI Demo Config” document in Sanity Studio to tweak the system prompt, model, and temperature.

Without an API key, the UI still works with demo samples and lightweight heuristic summaries.

#### Protect live AI from bots (recommended for production)

Custom transcripts call OpenAI and can cost money if abused. **Sample transcripts never call OpenAI** and do not require verification.

For production, add [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) (free):

1. Create a Turnstile widget in the Cloudflare dashboard for your domain.
2. Add to `.env.local` and Vercel:
   ```bash
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
   TURNSTILE_SECRET_KEY=...
   ```
3. Redeploy. Custom transcript runs show a human verification checkbox before submit.

If Turnstile keys are missing in production (`NEXT_PUBLIC_SITE_ENV=production`), live AI on custom transcripts is disabled — samples still work.

### Deploying

1. Add your production URL to CORS origins in your Sanity project settings.
2. Push to GitHub and deploy on [Vercel](https://vercel.com/new) (or your host of choice).
3. Copy environment variables from `.env.local` into the deployment settings.

### Inviting collaborators

Open [Sanity Manage](https://www.sanity.io/manage), select your project, and invite members so they can use the deployed Studio.

## Sanity TypeGen

```bash
npx sanity schema extract
npx sanity typegen generate
```

Or use the npm script:

```bash
pnpm typegen
```

## Environment variables

- `NEXT_PUBLIC_SITE_URL` – Site URL without trailing slash (e.g. `https://yourwebsite.com`).
- `NEXT_PUBLIC_SITE_ENV` – `development` prevents search engine indexing on staging.
- `NEXT_PUBLIC_SANITY_API_VERSION` – Sanity API version (e.g. `2024-01-01`).
- `NEXT_PUBLIC_SANITY_PROJECT_ID` – Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` – Dataset name (e.g. `production`).
- `SANITY_API_READ_TOKEN` – Read token for fetching content in Next.js.
- `OPENAI_API_KEY`, `AI_DEMO_PROVIDER`, `AI_DEMO_MODEL`, etc. – See AI demo section above.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` – Cloudflare Turnstile for `/ai-demo` bot protection (required for live AI in production).

[react-url]: https://reactjs.org/
[next-js-url]: https://nextjs.org/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[shadcn-url]: https://ui.shadcn.com/
[sanity-url]: https://www.sanity.io/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[next-js]: https://img.shields.io/badge/Next.js-20232A?style=for-the-badge&logo=Next.js
[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[tailwind]: https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwindcss&logoColor=319795
[shadcn]: https://img.shields.io/badge/shadcn/ui-20232A?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBjbGFzcz0iaC02IHctNiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiPjwvcmVjdD48bGluZSB4MT0iMjA4IiB5MT0iMTI4IiB4Mj0iMTI4IiB5Mj0iMjA4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiPjwvbGluZT48bGluZSB4MT0iMTkyIiB5MT0iNDAiIHgyPSI0MCIgeTI9IjE5MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMyIj48L2xpbmU+PC9zdmc+&logoColor=ffffff
[sanity]: https://img.shields.io/badge/Sanity-20232A?style=for-the-badge&logo=sanity&logoColor=F97316
