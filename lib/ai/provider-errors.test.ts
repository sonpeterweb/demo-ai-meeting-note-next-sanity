import { describe, expect, it } from "vitest";

import {
  classifyProviderError,
  providerErrorUserMessage,
} from "./provider-errors";

describe("classifyProviderError", () => {
  it("detects insufficient quota", () => {
    const error = new Error(
      'OpenAI request failed (429): {"code":"insufficient_quota"}'
    );
    expect(classifyProviderError(error)).toBe("quota");
    expect(providerErrorUserMessage("quota")).toMatch(/quota exceeded/i);
  });

  it("detects invalid API key", () => {
    const error = new Error("OpenAI request failed (401): invalid_api_key");
    expect(classifyProviderError(error)).toBe("auth");
  });
});
