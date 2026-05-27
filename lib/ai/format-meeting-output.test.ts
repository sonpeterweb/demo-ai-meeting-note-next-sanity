import { describe, expect, it } from "vitest";

import {
  formatMeetingOutput,
  isFallbackSummaryMessage,
} from "./format-meeting-output";

describe("formatMeetingOutput", () => {
  it("formats summary, decisions, and actions", () => {
    const output = formatMeetingOutput({
      summary: "Team aligned on launch.",
      keyDecisions: ["Ship in March"],
      actionItems: ["Design mockups by Tuesday"],
    });

    expect(output).toContain("Summary:\nTeam aligned on launch.");
    expect(output).toContain("Key decisions:\n1. Ship in March");
    expect(output).toContain("Action items:\n1. Design mockups by Tuesday");
  });
});

describe("isFallbackSummaryMessage", () => {
  it("detects fallback messaging", () => {
    expect(
      isFallbackSummaryMessage("AI provider unavailable; generated a quick draft summary instead.")
    ).toBe(true);
    expect(
      isFallbackSummaryMessage("Generated AI summary and action items using provider configuration.")
    ).toBe(false);
  });
});
