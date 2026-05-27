import { describe, expect, it } from "vitest";

import {
  normalizeTranscriptForCompare,
  transcriptsMatchForSample,
} from "./form-utils";

describe("transcript sample matching", () => {
  it("normalizes line endings and smart quotes", () => {
    expect(
      transcriptsMatchForSample(
        "Hello\r\nworld\u2019s plan",
        "Hello\nworld's plan"
      )
    ).toBe(true);
  });

  it("detects edited transcripts", () => {
    expect(
      transcriptsMatchForSample(
        "Completely different meeting notes.",
        "Original sample transcript."
      )
    ).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeTranscriptForCompare("  notes  ")).toBe("notes");
  });
});
