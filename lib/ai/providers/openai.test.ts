import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { summarizeWithOpenAI } from "./openai";

describe("summarizeWithOpenAI", () => {
  const config = {
    provider: "openai" as const,
    model: "gpt-4o-mini",
    maxTokens: 1200,
    temperature: 0.7,
    systemPrompt: null,
    postProcessingInstructions: null,
  };

  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    vi.stubEnv("OPENAI_API_BASE", "https://api.openai.com/v1");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("uses text.format for structured output on the Responses API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          summary: "Team aligned on launch.",
          keyDecisions: ["Ship Friday"],
          actionItems: ["QA sign-off"],
        }),
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await summarizeWithOpenAI({
      transcript: "We agreed to ship on Friday. ".repeat(20),
      config,
    });

    expect(result.summary).toBe("Team aligned on launch.");
    expect(fetchMock).toHaveBeenCalledOnce();

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;

    expect(body).toHaveProperty("text");
    expect(body).not.toHaveProperty("response_format");
    expect(body).toHaveProperty("instructions");
    expect(typeof body.input).toBe("string");
    expect(body.text).toMatchObject({
      format: {
        type: "json_schema",
        name: "MeetingSummary",
        strict: true,
      },
    });
  });
});
