"use server";

import { unstable_noStore as noStore } from "next/cache";

import {
  parseTranscriptForm,
  synthesizeFromTranscript,
  type SummarizeFormState,
} from "@/app/(main)/ai-demo/form-utils";
import {
  fetchAIDemoSampleById,
  fetchAIDemoSamples,
} from "@/sanity/lib/fetch";
import { getAIDemoConfig } from "@/lib/ai/config";
import { summarizeTranscript } from "@/lib/ai/providers";

const PROVIDER_TIMEOUT_MS = Number(process.env.AI_DEMO_TIMEOUT_MS ?? 15_000);

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function submitMeetingTranscript(
  _prevState: SummarizeFormState,
  formData: FormData
): Promise<SummarizeFormState> {
  noStore();

  const parsed = parseTranscriptForm(formData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: {
        transcript: fieldErrors.transcript?.[0],
        sampleId: fieldErrors.sampleId?.[0],
      },
    };
  }

  const { transcript, sampleId } = parsed.data;

  if (transcript.length < 200) {
    return {
      status: "error",
      errors: {
        transcript:
          "Please provide at least 200 characters so the AI can produce an accurate summary.",
      },
    };
  }

  try {
    if (sampleId) {
      const sample = await fetchAIDemoSampleById({ id: sampleId });
      if (!sample) {
        return {
          status: "error",
          errors: {
            sampleId: "We couldn't find the selected sample. Please choose another option.",
          },
        };
      }

      const sampleTranscript = (sample.transcript ?? "").trim();
      const matchesSampleTranscript =
        sampleTranscript.length > 0 && transcript === sampleTranscript;

      if (matchesSampleTranscript) {
        return {
          status: "success",
          completedAt: Date.now(),
          message: `Loaded "${sample.title}" sample summary.`,
          result: {
            summary:
              sample.expectedSummary ||
              "Sample summary unavailable. Try running the AI workflow to generate a fresh summary.",
            keyDecisions: [],
            actionItems: sample.expectedActionItems ?? [],
          },
        };
      }
    }

    try {
      const config = await getAIDemoConfig();
      const providerResult = await withTimeout(
        summarizeTranscript({
          transcript,
          config,
        }),
        PROVIDER_TIMEOUT_MS
      );
      return {
        status: "success",
        completedAt: Date.now(),
        message: "Generated AI summary and action items using provider configuration.",
        result: providerResult,
      };
    } catch (providerError) {
      if (providerError instanceof TimeoutError) {
        console.warn("[submitMeetingTranscript] Provider timeout:", providerError);
        const synthesizedResult = synthesizeFromTranscript(transcript);
        return {
          status: "success",
          completedAt: Date.now(),
          message:
            "AI provider timed out; generated a quick draft summary instead. Retry for a fresh response.",
          result: synthesizedResult,
        };
      }

      console.warn(
        "[submitMeetingTranscript] Falling back to heuristic summary:",
        providerError
      );
      const synthesizedResult = synthesizeFromTranscript(transcript);
      return {
        status: "success",
        completedAt: Date.now(),
        message:
          "AI provider unavailable; generated a quick draft summary instead.",
        result: synthesizedResult,
      };
    }
  } catch (error) {
    console.error("[submitMeetingTranscript]", error);
    return {
      status: "error",
      errors: {
        general:
          "Something went wrong while processing the transcript. Please try again.",
      },
    };
  }
}

export async function preloadAIDemoSamples() {
  noStore();
  return fetchAIDemoSamples();
}

