import "@testing-library/jest-dom/vitest";

process.env.NEXT_PUBLIC_SANITY_DATASET ??= "test";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "test";
process.env.NEXT_PUBLIC_SANITY_API_VERSION ??= "2024-10-31";

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

