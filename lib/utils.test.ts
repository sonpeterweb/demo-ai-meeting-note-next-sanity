import { describe, expect, it } from "vitest";

import { formatDate } from "./utils";

describe("formatDate", () => {
  it("formats ISO date strings to readable format", () => {
    const isoDate = new Date(Date.UTC(2025, 0, 18)).toISOString();
    expect(formatDate(isoDate)).toBe("January 18, 2025");
  });
});

