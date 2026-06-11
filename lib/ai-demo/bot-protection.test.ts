import { afterEach, describe, expect, it, vi } from "vitest";

import {
  assertHumanForLiveDemo,
  isHoneypotTriggered,
  isTurnstileConfigured,
} from "./bot-protection";

describe("bot-protection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("detects a filled honeypot field", () => {
    const formData = new FormData();
    formData.set("website", "https://spam.example");

    expect(isHoneypotTriggered(formData)).toBe(true);
  });

  it("allows empty honeypot field", () => {
    const formData = new FormData();
    formData.set("website", "");

    expect(isHoneypotTriggered(formData)).toBe(false);
  });

  it("blocks honeypot submissions for live demo", async () => {
    const formData = new FormData();
    formData.set("website", "bot");

    const result = await assertHumanForLiveDemo(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/unable to process/i);
    }
  });

  it("requires turnstile token in production when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");

    const formData = new FormData();

    const result = await assertHumanForLiveDemo(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/human verification/i);
    }
    expect(isTurnstileConfigured()).toBe(true);
  });

  it("skips turnstile in non-production when keys are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "development");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");

    const formData = new FormData();

    const result = await assertHumanForLiveDemo(formData);

    expect(result.ok).toBe(true);
  });

  it("blocks live demo in production without turnstile keys", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");

    const formData = new FormData();

    const result = await assertHumanForLiveDemo(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/temporarily unavailable/i);
    }
  });
});
