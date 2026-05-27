export type ProviderFailureKind = "quota" | "auth" | "rate_limit" | "unknown";

export function classifyProviderError(error: unknown): ProviderFailureKind {
  if (!(error instanceof Error)) {
    return "unknown";
  }

  const message = error.message.toLowerCase();

  if (message.includes("insufficient_quota")) {
    return "quota";
  }

  if (
    message.includes("invalid_api_key") ||
    message.includes("incorrect api key") ||
    message.includes("openai request failed (401)")
  ) {
    return "auth";
  }

  if (message.includes("429") || message.includes("rate limit")) {
    return message.includes("quota") ? "quota" : "rate_limit";
  }

  return "unknown";
}

export function providerErrorUserMessage(kind: ProviderFailureKind): string {
  switch (kind) {
    case "quota":
      return "OpenAI quota exceeded. Add billing or credits at platform.openai.com/account/billing, then try again.";
    case "auth":
      return "OpenAI rejected the API key. Check OPENAI_API_KEY in .env.local and restart the dev server.";
    case "rate_limit":
      return "OpenAI rate limit reached. Wait a minute and try again.";
    default:
      return "";
  }
}
