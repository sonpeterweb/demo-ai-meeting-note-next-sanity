import { notFound } from "next/navigation";
import Link from "next/link";

import SectionContainer from "@/components/ui/section-container";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { formatDate } from "@/lib/utils";
import {
  fetchChangelogEntryBySlug,
  fetchChangelogSlugs,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

const audienceLabels: Record<string, string> = {
  all: "All users",
  admin: "Admins",
  beta: "Beta testers",
};

const impactLabels: Record<string, string> = {
  major: "Major update",
  minor: "Enhancement",
  fix: "Bug fix",
};

export async function generateStaticParams() {
  const slugs = await fetchChangelogSlugs();
  return slugs
    .filter((slug) => slug?.slug)
    .map((slug) => ({ slug: slug.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const entry = await fetchChangelogEntryBySlug({ slug });

  if (!entry) {
    notFound();
  }

  return generatePageMetadata({
    page: {
      title: entry.title,
      meta_title: entry.title,
      meta_description: entry.summary,
    } as any,
    slug: `what-new/${slug}`,
  });
}

export default async function ChangelogEntryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const entry = await fetchChangelogEntryBySlug({ slug });

  if (!entry) {
    notFound();
  }

  const links = [
    { label: "Home", href: "/" },
    { label: "What’s New", href: "/what-new" },
    { label: entry.title ?? "Update", href: "#" },
  ];

  return (
    <main>
      <SectionContainer className="bg-slate-900/[0.02] py-24 dark:bg-slate-100/[0.04] md:py-28">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge
            variant="secondary"
            className="rounded-full border border-transparent bg-primary/10 px-4 py-1 text-primary"
          >
            {entry.releaseDate ? formatDate(entry.releaseDate) : null}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {entry.title}
          </h1>
          {entry.summary ? (
            <p className="text-lg text-muted-foreground">
              {entry.summary}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {entry.impactLevel ? (
              <Badge variant="outline">
                {impactLabels[entry.impactLevel] ?? entry.impactLevel}
              </Badge>
            ) : null}
            {entry.audience ? (
              <Badge className="bg-slate-900 text-slate-100 dark:bg-slate-200 dark:text-slate-900">
                {audienceLabels[entry.audience] ?? entry.audience}
              </Badge>
            ) : null}
          </div>
        </div>
      </SectionContainer>

      <section className="container pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <Breadcrumbs links={links} />

          {entry.highlights && entry.highlights.length > 0 ? (
            <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {entry.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 text-primary">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {entry.body && entry.body.length > 0 ? (
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <PortableTextRenderer value={entry.body} />
            </div>
          ) : null}

          <footer className="flex flex-wrap items-center gap-4">
            {entry.relatedPages?.map((page) => (
              <Button key={page._id} variant="outline" asChild>
                <Link
                  href={page.slug?.current ? `/${page.slug.current}` : "#"}
                >
                  View related page
                </Link>
              </Button>
            ))}
            <Button variant="ghost" asChild>
              <Link href="/what-new">Back to all updates</Link>
            </Button>
          </footer>
        </div>
      </section>
    </main>
  );
}

