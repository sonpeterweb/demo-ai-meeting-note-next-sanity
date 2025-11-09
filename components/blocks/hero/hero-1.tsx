"use client";

import Link from "next/link";
import Image from "next/image";
import { cubicBezier } from "motion";
import { motion } from "motion/react";
import { stegaClean } from "next-sanity";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import { Button } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type Hero1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-1" }
>;

const heroEase = cubicBezier(0.21, 0.47, 0.32, 0.99);

const insightCards = [
  {
    id: "summary",
    title: "Summary",
    description: "Three-bullet recap that keeps everyone aligned in seconds.",
  },
  {
    id: "decisions",
    title: "Key Decisions",
    description: "Highlights commitments and owners so nothing slips.",
  },
  {
    id: "actions",
    title: "Action Items",
    description: "Ready-to-send tasks that sync with your workspace tools.",
  },
];

export default function Hero1({
  tagLine,
  title,
  body,
  image,
  links,
}: Hero1Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const primaryLink = links?.[0];
  const secondaryLink = links?.[1];
  const heroImageSrc =
    image && image.asset?._id ? urlFor(image).width(120).height(90).url() : "";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/80">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="container py-20 md:py-28 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <div className="space-y-8">
            {tagLine ? (
              <motion.span
                {...fadeUp(0.05, prefersReducedMotion)}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary"
              >
                {tagLine}
              </motion.span>
            ) : null}

            {title ? (
              <motion.h1
                {...fadeUp(0.12, prefersReducedMotion)}
                className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                {title}
              </motion.h1>
            ) : null}

            {body ? (
              <motion.div
                {...fadeUp(0.18, prefersReducedMotion)}
                className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
              >
                <PortableTextRenderer value={body} />
              </motion.div>
            ) : null}

            {(primaryLink || secondaryLink) && (
              <motion.div
                {...fadeUp(0.26, prefersReducedMotion)}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                {primaryLink ? (
                  <HeroLinkButton link={primaryLink} priority />
                ) : null}
                {secondaryLink ? (
                  <HeroLinkButton link={secondaryLink} />
                ) : null}
              </motion.div>
            )}

            <motion.div
              {...fadeUp(0.34, prefersReducedMotion)}
              className="flex items-center gap-4 text-sm text-muted-foreground"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <p className="text-left">
                Listenote transforms every meeting into momentum—summaries,
                decisions, and tasks ready before you leave the room.
              </p>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.2, prefersReducedMotion)}
            className="relative"
            data-testid="listenote-hero-animation"
          >
            <div
              className="relative isolate overflow-hidden rounded-[2.5rem] border border-border/40 bg-background/80 p-8 shadow-[0_30px_120px_var(--shadow-color)] backdrop-blur-xl dark:border-white/10 dark:shadow-[0_30px_120px_rgba(14,165,233,0.12)]"
              style={
                {
                  "--shadow-color": "rgba(37, 99, 235, 0.12)",
                } as CSSProperties
              }
            >
              <OrbitBackground prefersReducedMotion={prefersReducedMotion} />

              <MeetingArtifactCard
                prefersReducedMotion={prefersReducedMotion}
                imageSrc={heroImageSrc}
                imageAlt={image?.alt}
              />
              <TranscriptCard prefersReducedMotion={prefersReducedMotion} />
              <InsightCards prefersReducedMotion={prefersReducedMotion} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroLinkButton({
  link,
  priority = false,
}: {
  link: NonNullable<Hero1Props["links"]>[number];
  priority?: boolean;
}) {
  const variant = stegaClean(link?.buttonVariant) ?? "default";
  const href = link?.href || "#";
  const target = link?.target ? "_blank" : undefined;

  return (
    <Button
      asChild
      size="lg"
      variant={priority ? variant : variant === "default" ? "secondary" : variant}
    >
      <Link href={href} target={target} rel={target ? "noopener" : undefined}>
        {link?.title}
      </Link>
    </Button>
  );
}

function MeetingArtifactCard({
  prefersReducedMotion,
  imageSrc,
  imageAlt,
}: {
  prefersReducedMotion: boolean;
  imageSrc: string;
  imageAlt?: string | null;
}) {
  return (
    <motion.div
      {...fadeUp(0.25, prefersReducedMotion)}
      className="relative z-10 flex items-center gap-4 rounded-2xl border border-border/40 bg-white/90 px-4 py-3 shadow-lg dark:bg-slate-950/90"
    >
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-primary/10">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt || "Meeting illustration"}
            fill
            sizes="48px"
            className="object-cover"
            priority
          />
        ) : (
          <span aria-hidden className="text-xl">🗓️</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Weekly Product Sync
        </p>
        <p className="text-xs text-muted-foreground">
          10:30–11:00 AM · Product · Design · Engineering
        </p>
      </div>
    </motion.div>
  );
}

function TranscriptCard({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      {...fadeUp(0.33, prefersReducedMotion)}
      className="relative z-10 mt-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-sm leading-relaxed text-primary-foreground shadow-lg backdrop-blur-sm dark:bg-sky-500/10"
    >
      <p className="font-medium text-primary">
        “Let's finalize the onboarding milestones, confirm QA coverage for the
        mobile release, and assign follow-ups for the AI insights launch.”
      </p>
      <p className="mt-3 text-xs text-primary/70">
        Transcript captured automatically · Confidence 98%
      </p>
    </motion.div>
  );
}

function InsightCards({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="relative z-10 mt-6 grid gap-3">
      {insightCards.map((card, index) => (
        <motion.div
          key={card.id}
          {...fadeUp(0.4 + index * 0.08, prefersReducedMotion)}
          className={cn(
            "flex items-start gap-3 rounded-2xl border border-border/40 bg-background/95 p-4 shadow-lg backdrop-blur-sm",
            card.id === "summary" && "border-primary/40 bg-primary/10",
            card.id === "decisions" && "border-amber-400/40 bg-amber-100/30 dark:border-amber-500/30 dark:bg-amber-500/10",
            card.id === "actions" && "border-emerald-400/40 bg-emerald-100/30 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          )}
        >
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {card.title.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {card.title}
            </p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              {card.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function OrbitBackground({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-400/10 via-transparent to-transparent"
      {...(prefersReducedMotion
        ? { initial: false }
        : {
            initial: { rotate: 0 },
            animate: { rotate: 360 },
            transition: {
              duration: 24,
              ease: "linear",
              repeat: Infinity,
            },
          })}
    >
      <div className="absolute inset-16 rounded-full border border-sky-400/30" />
      <motion.span
        aria-hidden
        className="absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.6)]"
        {...(prefersReducedMotion
          ? { initial: false }
          : {
              initial: { rotate: 0 },
              animate: { rotate: -360 },
              transition: { duration: 12, ease: "linear", repeat: Infinity },
            })}
      />
    </motion.div>
  );
}

function fadeUp(delay: number, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.65,
      delay,
      ease: heroEase,
    },
  };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
