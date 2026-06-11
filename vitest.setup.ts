import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_SITE_ENV = "test";
process.env.TURNSTILE_SECRET_KEY = "";
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "test";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "test";
process.env.NEXT_PUBLIC_SANITY_API_VERSION ??= "2024-10-31";
process.env.AI_PROVIDER ??= "openai";
process.env.OPENAI_API_KEY ??= "test-openai-key";
process.env.OPENAI_API_MODEL ??= "gpt-4o-mini";

if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    });
}

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  unstable_noStore: vi.fn(),
}));

vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(async () => {
    throw new Error("sanityFetch is not available in test environment.");
  }),
  SanityLive: () => null,
}));

