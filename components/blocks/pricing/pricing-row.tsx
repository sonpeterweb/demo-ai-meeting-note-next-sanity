import Link from "next/link";
import { stegaClean } from "next-sanity";

import SectionContainer from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type PricingRowBlock = Extract<Block, { _type: "pricing-row" }>;
type PricingTier = NonNullable<PricingRowBlock["tiers"]>[number];

export default function PricingRow({
  padding,
  colorVariant,
  eyebrow,
  title,
  description,
  footnote,
  highlightedTier,
  tiers,
}: PricingRowBlock) {
  const color = stegaClean(colorVariant);
  const highlightId = highlightedTier?._id;

  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <SectionContainer color={color} padding={padding} id="pricing">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="space-y-4 text-center md:space-y-5">
          {eyebrow && (
            <Badge
              variant="secondary"
              className="rounded-full border border-transparent bg-primary/10 px-4 py-1 text-primary"
            >
              {eyebrow}
            </Badge>
          )}
          {title && (
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier?._id}
              tier={tier}
              featured={tier?._id === highlightId}
            />
          ))}
        </div>

        {footnote && (
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </SectionContainer>
  );
}

function PricingTierCard({
  tier,
  featured,
}: {
  tier: PricingTier;
  featured: boolean;
}) {
  const price = tier?.price?.amount;
  const currency = tier?.price?.currency ?? "NZD";
  const billingCycle = tier?.price?.billingCycle ?? "monthly";
  const cta = tier?.cta;
  const hasCTA = Boolean(cta?.href);
  const buttonVariant =
    stegaClean(cta?.buttonVariant) ?? (featured ? "default" : "secondary");

  const formattedPrice =
    typeof price === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(price)
      : "Custom";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-3xl border bg-background/80 p-8 shadow-sm backdrop-blur",
        featured
          ? "border-primary/40 shadow-[0_20px_60px_rgba(59,130,246,0.18)]"
          : "border-border/60"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {tier?.title}
          </h3>
          {tier?.badge && (
            <Badge variant="outline" className="border-primary/40 text-primary">
              {tier.badge}
            </Badge>
          )}
          {tier?.status && tier.status !== "active" && (
            <Badge
              variant="secondary"
              className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
            >
              {statusLabel(tier.status)}
            </Badge>
          )}
        </div>
        {tier?.subtitle && (
          <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
        )}
      </div>

      <div>
        <p className="flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-foreground">
          {formattedPrice}
          <span className="text-sm font-medium text-muted-foreground">
            {price === undefined ? "" : `/${billingCycleLabel(billingCycle)}`}
          </span>
        </p>
        {tier?.description && (
          <p className="mt-3 text-sm text-muted-foreground">
            {tier.description}
          </p>
        )}
      </div>

      {tier?.features && tier.features.length > 0 ? (
        <ul className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
          {tier.features.map((feature, index) => (
            <li
              key={`${tier._id}-feature-${index}`}
              className="flex items-start gap-2"
            >
              <span aria-hidden className="mt-1 text-primary">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      <div>
        <Button
          asChild={hasCTA}
          variant={buttonVariant}
          size="lg"
          className={cn(
            "w-full justify-center",
            !hasCTA && "cursor-not-allowed opacity-70"
          )}
          disabled={!hasCTA}
        >
          {hasCTA ? (
            <Link
              href={cta?.href ?? "#"}
              target={cta?.target ? "_blank" : undefined}
              rel={cta?.target ? "noopener" : undefined}
            >
              {cta?.title ?? "Get started"}
            </Link>
          ) : (
            <span>{cta?.title ?? "Contact us for pricing"}</span>
          )}
        </Button>
      </div>
    </article>
  );
}

function statusLabel(status: PricingTier["status"]) {
  switch (status) {
    case "coming-soon":
      return "Coming soon";
    case "deprecated":
      return "Deprecated";
    default:
      return "Active";
  }
}

function billingCycleLabel(
  billingCycle: NonNullable<PricingTier["price"]>["billingCycle"] | null | undefined
) {
  switch (billingCycle) {
    case "monthly":
      return "month";
    case "quarterly":
      return "quarter";
    case "annually":
      return "year";
    default:
      return billingCycle ?? "month";
  }
}

