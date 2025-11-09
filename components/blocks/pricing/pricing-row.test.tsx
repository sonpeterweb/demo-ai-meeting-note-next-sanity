import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import PricingRow from "./pricing-row";

describe("PricingRow", () => {
  const tiers = [
    {
      _id: "starter",
      title: "Starter",
      subtitle: "For individuals shipping ideas",
      badge: "Best value",
      description: "Capture and summarize every meeting without manual notes.",
      status: "active" as const,
      price: {
        amount: 29,
        currency: "USD",
        billingCycle: "monthly" as const,
      },
      features: [
        "Unlimited AI summaries",
        "Task extraction & email export",
        "Integrations with Notion & Slack",
      ],
      cta: {
        _key: "cta-starter",
        _type: "link",
        title: "Start free trial",
        href: "/start",
        target: false,
        isExternal: false,
        buttonVariant: "default",
      },
    },
    {
      _id: "team",
      title: "Team",
      subtitle: "Collaboration-ready workspace",
      badge: "Most popular",
      description: "Keep cross-functional teams aligned with shared workspaces.",
      status: "coming-soon" as const,
      price: {
        amount: 79,
        currency: "USD",
        billingCycle: "monthly" as const,
      },
      features: [
        "Shared libraries with search",
        "Auto-assigned action items",
        "Priority support with success manager",
      ],
      cta: {
        _key: "cta-team",
        _type: "link",
        title: "Join waitlist",
        href: "/waitlist",
        target: false,
        isExternal: false,
        buttonVariant: "secondary",
      },
    },
  ];

  it("renders pricing tiers with badges, pricing, and CTA buttons", () => {
    render(
      <PricingRow
        _type="pricing-row"
        _key="pricing-row"
        padding={null}
        colorVariant={null}
        eyebrow="Pricing"
        title="Flexible pricing for every team"
        description="Enable product, design, and engineering to stay aligned after every meeting."
        footnote="Need enterprise support? Contact us for custom pricing."
        highlightedTier={{ _id: "team" } as any}
        tiers={tiers as any}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /Flexible pricing/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: /Starter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Start free trial/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: /Team/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Join waitlist/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Need enterprise support/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
  });
});

