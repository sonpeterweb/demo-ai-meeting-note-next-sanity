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

export async function preloadAIDemoSamples() {
  noStore();
  return fetchAIDemoSamples();
}

