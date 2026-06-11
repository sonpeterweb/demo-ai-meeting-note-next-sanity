import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { unstable_noStore } from "next/cache";
import * as sanityFetch from "@/sanity/lib/fetch";
import * as aiConfig from "@/lib/ai/config";
import * as aiProviders from "@/lib/ai/providers";
import * as botProtection from "@/lib/ai-demo/bot-protection";
import { INITIAL_FORM_STATE, type SummarizeFormState } from "./form-utils";
import { submitMeetingTranscript } from "./actions";

describe("submitMeetingTranscript", () => {
  const baseTranscript = "This meeting is about planning the quarterly roadmap. ".repeat(10);

  let fetchSampleSpy: any;
  let fetchSamplesSpy: any;
  let getConfigSpy: any;
  let summarizeSpy: any;
  let humanCheckSpy: any;

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "test");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    humanCheckSpy = vi
      .spyOn(botProtection, "assertHumanForLiveDemo")
      .mockResolvedValue({ ok: true });
    vi.mocked(unstable_noStore).mockClear();
    fetchSampleSpy = vi.spyOn(sanityFetch, "fetchAIDemoSampleById").mockResolvedValue(null);
    fetchSamplesSpy = vi.spyOn(sanityFetch, "fetchAIDemoSamples").mockResolvedValue([]);
    getConfigSpy = vi.spyOn(aiConfig, "getAIDemoConfig").mockResolvedValue({
      provider: "openai",
      model: "gpt-4o-mini",
      maxTokens: 1200,
      temperature: 0.7,
      systemPrompt: null,
      postProcessingInstructions: null,
    });
    summarizeSpy = vi.spyOn(aiProviders, "summarizeTranscript").mockResolvedValue({
      summary: "AI generated summary.",
      keyDecisions: ["Approve launch timeline"],
      actionItems: ["Follow up with design"],
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    humanCheckSpy.mockRestore();
    fetchSampleSpy.mockRestore();
    fetchSamplesSpy.mockRestore();
    getConfigSpy.mockRestore();
    summarizeSpy.mockRestore();
    vi.useRealTimers();
  });

  it("returns cached summary when a sampleId is provided", async () => {
    const sampleId = "sample-123";
    fetchSampleSpy.mockResolvedValue({
      _id: sampleId,
      title: "Weekly Sync",
      transcript: baseTranscript,
      expectedSummary: "Prepared summary from sample.",
      expectedActionItems: ["Share notes with stakeholders"],
    } as any);

    const formData = new FormData();
    formData.set("transcript", baseTranscript);
    formData.set("sampleId", sampleId);

    const result = await submitMeetingTranscript(INITIAL_FORM_STATE, formData);

    expect(result).toMatchObject<SummarizeFormState>({
      status: "success",
      message: expect.stringContaining('Loaded "Weekly Sync" sample summary.'),
      result: {
        summary: "Prepared summary from sample.",
        keyDecisions: [],
        actionItems: ["Share notes with stakeholders"],
      },
    });
    expect(summarizeSpy).not.toHaveBeenCalled();
  });

  it("does not call OpenAI when sampleId is set even if transcript differs", async () => {
    const sampleId = "sample-123";
    fetchSampleSpy.mockResolvedValue({
      _id: sampleId,
      title: "Weekly Sync",
      transcript: "Original sample transcript only. ".repeat(12),
      expectedSummary: "Prepared summary from sample.",
      expectedActionItems: ["Share notes with stakeholders"],
    } as any);

    const formData = new FormData();
    formData.set("transcript", baseTranscript);
    formData.set("sampleId", sampleId);

    const result = await submitMeetingTranscript(INITIAL_FORM_STATE, formData);

    expect(result.status).toBe("success");
    expect(result.message).toContain('Loaded "Weekly Sync" sample summary.');
    expect(summarizeSpy).not.toHaveBeenCalled();
  });

  it("invokes provider and returns AI summary when available", async () => {
    const formData = new FormData();
    formData.set("transcript", baseTranscript);

    const result = await submitMeetingTranscript(INITIAL_FORM_STATE, formData);

    expect(result.status).toBe("success");
    expect(result.result?.summary).toBe("AI generated summary.");
    expect(summarizeSpy).toHaveBeenCalled();
  });

  it("falls back to synthesized summary when provider throws an error", async () => {
    summarizeSpy.mockRejectedValue(new Error("Provider offline"));

    const formData = new FormData();
    formData.set("transcript", baseTranscript);

    const result = await submitMeetingTranscript(INITIAL_FORM_STATE, formData);

    expect(result.status).toBe("success");
    expect(result.message).toMatch(/draft summary/i);
    expect(result.result?.summary).toBeTruthy();
  });

  it("falls back when provider times out", async () => {
    vi.useFakeTimers();
    summarizeSpy.mockImplementation(
      () =>
        new Promise(() => {
          // intentionally never resolves
        })
    );

    const formData = new FormData();
    formData.set("transcript", baseTranscript);

    const promise = submitMeetingTranscript(INITIAL_FORM_STATE, formData);
    await vi.advanceTimersByTimeAsync(15_000);
    const result = await promise;

    expect(result.status).toBe("success");
    expect(result.message).toMatch(/timed out/i);
  });

  it("blocks live AI when honeypot field is filled", async () => {
    humanCheckSpy.mockRestore();
    humanCheckSpy = vi.spyOn(botProtection, "assertHumanForLiveDemo");

    const formData = new FormData();
    formData.set("transcript", baseTranscript);
    formData.set("website", "https://spam.example");

    const result = await submitMeetingTranscript(INITIAL_FORM_STATE, formData);

    expect(result.status).toBe("error");
    expect(result.errors?.general).toMatch(/unable to process/i);
    expect(summarizeSpy).not.toHaveBeenCalled();
  });
});

