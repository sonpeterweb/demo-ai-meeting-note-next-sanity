import Link from "next/link";

import { formatDate } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { fetchChangelogEntries } from "@/sanity/lib/fetch";

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

export const metadata = {
  title: "What’s New | Listenote Product Updates",
  description:
    "Track Listenote releases, AI enhancements, and admin improvements that help your team turn meetings into momentum.",
};

export const revalidate = 60;

export default async function WhatsNewPage() {
  const entries = await fetchChangelogEntries();

  const links = [
    { label: "Home", href: "/" },
    { label: "What’s New", href: "/what-new" },
  ];

  return (
    <div className="pb-12 md:pb-16 lg:pb-20">
      <SectionContainer className="bg-slate-900/[0.02] py-24 dark:bg-slate-100/[0.04] md:py-28">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <Badge
            variant="secondary"
            className="rounded-full border border-transparent bg-primary/10 px-4 py-1 text-primary"
          >
            What’s New
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Product updates & release notes
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore the latest improvements to Listenote—from AI-powered
            summary upgrades to admin workflow optimizations.
          </p>
        </div>
      </SectionContainer>

      <section className="container space-y-12 py-12 md:py-16 lg:py-20">
        <Breadcrumbs links={links} />

        <div className="space-y-8">
          {entries.map((entry) => (
            <article
              key={entry._id}
              className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur md:p-10"
            >
              <header className="flex flex-col gap-3 border-b border-border/60 pb-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {entry.releaseDate && (
                      <time dateTime={entry.releaseDate}>
                        {formatDate(entry.releaseDate)}
                      </time>
                    )}
                    {entry.impactLevel && (
                      <Badge variant="outline">
                        {impactLabels[entry.impactLevel] ?? entry.impactLevel}
                      </Badge>
                    )}
                    {entry.audience && (
                      <Badge className="bg-slate-900 text-slate-100 dark:bg-slate-200 dark:text-slate-900">
                        {audienceLabels[entry.audience] ?? entry.audience}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {entry.title}
                  </h2>
                  {entry.summary && (
                    <p className="text-base text-muted-foreground md:text-lg">
                      {entry.summary}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {entry.tags?.map((tag) => (
                    <Badge key={tag._id} variant="secondary">
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              </header>

              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground md:text-base">
                  {entry.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 text-primary">
                        •
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {entry.body && entry.body.length > 0 && (
                <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
                  <PortableTextRenderer value={entry.body} />
                </div>
              )}

              <footer className="mt-8 flex flex-wrap items-center gap-4">
                {entry.relatedPages?.map((page) => {
                  const relatedHref = page.slug?.current
                    ? `/${page.slug.current}`
                    : "#";
                  return (
                    <Button key={page._id} variant="outline" asChild>
                      <Link href={relatedHref}>View related page</Link>
                    </Button>
                  );
                })}
                {entry.slug?.current && (
                  <Button variant="ghost" asChild>
                    <Link href={`/what-new/${entry.slug.current}`}>
                      View details
                    </Link>
                  </Button>
                )}
              </footer>
            </article>
          ))}

          {entries.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/40 p-10 text-center">
              <h3 className="text-xl font-semibold text-muted-foreground">
                No updates yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Publish changelog entries in Sanity Studio to see them here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

