# Listenote — AI Meeting Notes Demo

**Listenote** turns meeting transcripts into clear summaries, decisions, and action items. This portfolio demo includes a marketing site (Sanity-driven blocks and pricing), a changelog, and an interactive AI workflow.

![Screenshot of Sanity Studio using Presentation Tool to do Visual Editing](https://cdn.sanity.io/images/a03xrv11/production/e83fee6a672a9df53548878eccddc0f962d1cac8-1920x931.webp)

[![Next.js][next-js]][next-js-url] [![Sanity][sanity]][sanity-url] [![React][react]][react-url] [![Typescript][typescript]][typescript-url] [![Tailwind][tailwind]][tailwind-url] [![Shadcn][shadcn]][shadcn-url]

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

### Deploying

1. Add your production URL to CORS origins in your Sanity project settings.
2. Push to GitHub and deploy on [Vercel](https://vercel.com/new) (or your host of choice).
3. Copy environment variables from `.env.local` into the deployment settings.

### Inviting collaborators

Open [Sanity Manage](https://www.sanity.io/manage), select your project, and invite members so they can use the deployed Studio.

### Configuring Resend (optional)

For the newsletter form:

1. Create a [Resend](https://resend.com/signup) account and API key.
2. Copy your [audience](https://resend.com/audiences) id.
3. Set `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` in `.env.local` or your host.

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
- `RESEND_API_KEY` – Resend API key for the newsletter form.
- `RESEND_AUDIENCE_ID` – Resend audience id for newsletter contacts.
- `OPENAI_API_KEY`, `AI_DEMO_PROVIDER`, `AI_DEMO_MODEL`, etc. – See AI demo section above.

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
