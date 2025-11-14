import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Hero from "./hero";

type HeroProps = Parameters<typeof Hero>[0];

describe("Hero", () => {
  const baseProps: HeroProps = {
    _type: "hero" as const,
    _key: "hero",
    tagLine: "Product teams ship faster",
    title: "Turn every meeting into momentum",
    body: [
      {
        _type: "block",
        _key: "block-1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "span-1",
            text: "Listenote captures decisions and tasks automatically.",
            marks: [],
          },
        ],
      },
    ],
    image: null,
    links: [
      {
        _key: "primary",
        _type: "link",
        title: "Start free trial",
        href: "/start",
        target: false,
        isExternal: false,
        buttonVariant: "default",
      },
      {
        _key: "secondary",
        _type: "link",
        title: "See pricing",
        href: "/pricing",
        target: false,
        isExternal: false,
        buttonVariant: "secondary",
      },
    ],
  };

  it("renders headline, supporting copy, and CTAs", () => {
    const { getByRole } = render(<Hero {...baseProps} />);

    expect(
      getByRole("heading", {
        level: 1,
        name: /Turn every meeting into momentum/i,
      })
    ).toBeInTheDocument();

    expect(
      getByRole("link", { name: /Start free trial/i })
    ).toBeInTheDocument();

    expect(
      getByRole("link", { name: /See pricing/i })
    ).toBeInTheDocument();
  });

  it("renders animation wrapper for hero visualization", () => {
    render(<Hero {...baseProps} />);

    const animationWrapper = screen.getByTestId("listenote-hero-animation");
    expect(animationWrapper).toBeInTheDocument();
  });
});

