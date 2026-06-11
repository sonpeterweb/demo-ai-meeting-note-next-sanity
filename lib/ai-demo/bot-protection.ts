const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const HONEYPOT_FIELD = "website";

export function isTurnstileConfigured() {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

export function isHoneypotTriggered(formData: FormData) {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}

type VerifyResult = { ok: true } | { ok: false; message: string };

export async function assertHumanForLiveDemo(
  formData: FormData
): Promise<VerifyResult> {
  if (isHoneypotTriggered(formData)) {
    return {
      ok: false,
      message: "Unable to process this request. Please try again.",
    };
  }

  if (!isTurnstileConfigured()) {
    if (process.env.NEXT_PUBLIC_SITE_ENV === "production") {
      return {
        ok: false,
        message:
          "Live AI is temporarily unavailable. Try a sample transcript instead.",
      };
    }
    return { ok: true };
  }

  const token = formData.get("turnstileToken");
  if (typeof token !== "string" || token.trim().length === 0) {
    return {
      ok: false,
      message: "Please complete the human verification check before generating.",
    };
  }

  return verifyTurnstileToken(token.trim());
}

async function verifyTurnstileToken(token: string): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true };
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "Verification failed. Please refresh and try again.",
      };
    }

    const payload = (await response.json()) as { success?: boolean };
    if (!payload.success) {
      return {
        ok: false,
        message: "Human verification failed. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Verification is unavailable right now. Please try again shortly.",
    };
  }
}

export { HONEYPOT_FIELD };
