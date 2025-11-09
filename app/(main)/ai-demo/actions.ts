"use server";

import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import {
  fetchAIDemoSampleById,
  fetchAIDemoSamples,
} from "@/sanity/lib/fetch";

const FORM_SCHEMA = z.object({
  transcript: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, "Please provide a meeting transcript."),
  sampleId: z
    .string()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type SummarizeFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    transcript?: string;
    sampleId?: string;
    general?: string;
  };
  result?: {
    summary: string;
    keyDecisions: string[];
    actionItems: string[];
  };
};

export const INITIAL_FORM_STATE: SummarizeFormState = {
  status: "idle",
  errors: {},
};

export async function submitMeetingTranscript(
  _prevState: SummarizeFormState,
  formData: FormData
): Promise<SummarizeFormState> {
  noStore();

  const parsedForm = FORM_SCHEMA.safeParse({
    transcript: formData.get("transcript"),
    sampleId: formData.get("sampleId"),
  });

  if (!parsedForm.success) {
    const fieldErrors = parsedForm.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: {
        transcript: fieldErrors.transcript?.[0],
        sampleId: fieldErrors.sampleId?.[0],
      },
    };
  }

  const { transcript, sampleId } = parsedForm.data;

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

      return {
        status: "success",
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

    const synthesizedResult = synthesizeFromTranscript(transcript);
    return {
      status: "success",
      message: "Generated a quick draft summary from the supplied transcript.",
      result: synthesizedResult,
    };
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

function synthesizeFromTranscript(transcript: string) {
  const sentences = transcript
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const summary = sentences.slice(0, 3).join(" ").slice(0, 600);

  const actionItems = transcript
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("-") ||
        line.startsWith("*") ||
        /action item/i.test(line) ||
        /(todo|follow up|assign)/i.test(line)
    )
    .map((line) => line.replace(/^[-*]\s*/, ""))
    .slice(0, 5);

  const keyDecisions = sentences
    .filter((sentence) => /(decided|agreed|approved|will proceed)/i.test(sentence))
    .slice(0, 3);

  return {
    summary:
      summary.length > 0
        ? summary
        : transcript.slice(0, 600) || "Summary is unavailable for this transcript.",
    keyDecisions,
    actionItems,
  };
}

export async function preloadAIDemoSamples() {
  noStore();
  return fetchAIDemoSamples();
}

