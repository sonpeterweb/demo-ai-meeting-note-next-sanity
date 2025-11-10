"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { submitMeetingTranscript } from "@/app/(main)/ai-demo/actions";
import {
  INITIAL_FORM_STATE,
  type SummarizeFormState,
} from "@/app/(main)/ai-demo/form-utils";
import type { AI_DEMO_SAMPLES_QUERYResult } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  samples: AI_DEMO_SAMPLES_QUERYResult;
};

export default function AIDemoClient({ samples }: Props) {
  const [transcript, setTranscript] = useState<string>("");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isPrefilling, startTransition] = useTransition();
  const [state, formAction] = useFormState<SummarizeFormState, FormData>(
    submitMeetingTranscript,
    INITIAL_FORM_STATE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTranscriptRunnable = transcript.trim().length >= 200 || Boolean(selectedSampleId);

  const selectedSample = useMemo(
    () => samples.find((sample) => sample._id === selectedSampleId),
    [samples, selectedSampleId]
  );

  const handleSampleSelect = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    startTransition(() => {
      const match = samples.find((sample) => sample._id === sampleId);
      if (match?.transcript) {
        setTranscript(match.transcript);
      }
    });
  };

  const handleClearSample = () => {
    setSelectedSampleId(null);
  };

  const handleRetry = () => {
    const data = new FormData();
    data.set("transcript", transcript);
    data.set("sampleId", selectedSampleId ?? "");
    setIsSubmitting(true);
    formAction(data);
  };

  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      setIsSubmitting(false);
    }
  }, [state.status]);

  return (
    <main className="pb-16 pt-12">
      <section className="container grid gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demo Samples</CardTitle>
              <CardDescription>
                Pick a pre-built meeting scenario or paste your own transcript to test the workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {samples.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No samples published yet. Add <code>ai-demo-sample</code> documents in Sanity Studio to seed the demo.
                </p>
              ) : (
                <div className="space-y-3">
                  {samples.map((sample) => (
                    <button
                      key={sample._id}
                      type="button"
                      onClick={() => handleSampleSelect(sample._id)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left transition-colors",
                        selectedSampleId === sample._id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-primary/5"
                      )}
                      disabled={isPrefilling}
                    >
                      <p className="font-medium text-foreground">{sample.title}</p>
                      {sample.meetingContext && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {sample.meetingContext}
                        </p>
                      )}
                      {sample.persona && (
                        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                          Persona: {sample.persona}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">Need real transcripts?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drop a `.txt` transcript right into the form or copy content from your meeting tool.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Provide at least a few paragraphs (≈200+ characters) so the AI can identify key
                themes and action items.
              </p>
              <p>
                Looking for the configuration? Manage system prompts and model defaults via the{" "}
                <strong>AI Demo Config</strong> document in Sanity Studio.
              </p>
              <p>
                This workflow runs entirely server-side. Keep your provider keys in{" "}
                <code>.env.local</code> — they never hit the browser.
              </p>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summarize a meeting</CardTitle>
              <CardDescription>
                Paste a transcript or load a demo sample to generate summaries, decisions, and action items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={formAction}
                className="space-y-6"
                onSubmit={() => setIsSubmitting(true)}
              >
                <input type="hidden" name="sampleId" value={selectedSampleId ?? ""} />

                <div className="space-y-2">
                  <Label htmlFor="transcript">Transcript</Label>
                  <textarea
                    id="transcript"
                    name="transcript"
                    value={transcript}
                    onChange={(event) => setTranscript(event.target.value)}
                    placeholder="Paste raw meeting notes or load a sample…"
                    rows={12}
                    className={cn(
                      "min-h-[200px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                      state.errors?.transcript ? "border-destructive" : ""
                    )}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{transcript.length} characters</span>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!selectedSample}
                        onClick={() => {
                          if (selectedSample?.transcript) {
                            setTranscript(selectedSample.transcript);
                          }
                        }}
                      >
                        Prefill from sample
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTranscript("");
                          handleClearSample();
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  {state.errors?.transcript && (
                    <p className="text-sm text-destructive">{state.errors.transcript}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio-upload">Optional audio file</Label>
                  <Input
                    id="audio-upload"
                    name="audio"
                    type="file"
                    disabled
                    className="cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Audio ingestion is coming soon — today the demo focuses on transcripts.
                  </p>
                </div>

                {state.errors?.general && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {state.errors.general}
                  </div>
                )}

                <SubmissionFooter
                  demoTip={selectedSample?.demoTips}
                  isRunnable={isTranscriptRunnable}
                />
              </form>
            </CardContent>
          </Card>

          {isSubmitting && <PendingPanel />}

          {state.status === "error" && state.errors?.general && (
            <ErrorPanel
              message={state.errors.general}
              onRetry={handleRetry}
              disabled={!isTranscriptRunnable || isSubmitting}
              isRetrying={isSubmitting}
            />
          )}

          {state.status === "success" && state.result && (
            <ResultsPanel state={state} isLoading={isSubmitting} />
          )}
        </section>
      </section>
    </main>
  );
}

function ResultsPanel({
  state,
  isLoading,
}: {
  state: SummarizeFormState;
  isLoading: boolean;
}) {
  if (!state.result) {
    return null;
  }

  const { summary, keyDecisions, actionItems } = state.result;
  const [hasCopied, setHasCopied] = useState(false);

  const formattedSummary = useMemo(() => {
    const sections = [
      `Summary:\n${summary}`,
      `\nKey decisions:\n${
        keyDecisions.length > 0 ? keyDecisions.map((item, idx) => `${idx + 1}. ${item}`).join("\n") : "None captured."
      }`,
      `\nAction items:\n${
        actionItems.length > 0 ? actionItems.map((item, idx) => `${idx + 1}. ${item}`).join("\n") : "None captured."
      }`,
    ];
    return sections.join("\n");
  }, [summary, keyDecisions, actionItems]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error("[ResultsPanel] Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedSummary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "listenote-meeting-summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Meeting summary & action items");
    const body = encodeURIComponent(formattedSummary);
    return `mailto:?subject=${subject}&body=${body}`;
  }, [formattedSummary]);

  return (
    <section className="space-y-6">
      <Card aria-busy={isLoading}>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          {state.message && <CardDescription>{state.message}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card aria-busy={isLoading}>
          <CardHeader>
            <CardTitle>Key decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {keyDecisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No explicit decisions captured yet. Encourage the AI to call out go/no-go choices.
              </p>
            ) : (
              <ul
                className="space-y-2 text-sm text-foreground"
                aria-live="polite"
              >
                {keyDecisions.map((decision, index) => (
                  <li key={index} className="rounded-md bg-muted/40 px-3 py-2">
                    {decision}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card aria-busy={isLoading}>
          <CardHeader>
            <CardTitle>Action items</CardTitle>
          </CardHeader>
          <CardContent>
            {actionItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No action items identified. Add bullet points or assign owners in the transcript for better results.
              </p>
            ) : (
              <ul
                className="space-y-2 text-sm text-foreground"
                aria-live="polite"
              >
                {actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 text-primary" aria-hidden>
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card aria-busy={isLoading}>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Ready to share the insights? Copy, download, or email the summary.
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleCopy}
            >
              {hasCopied ? "Copied!" : "Copy to clipboard"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownload}
            >
              Download .txt
            </Button>
            <Button asChild type="button" size="sm" variant="outline">
              <Link href={mailtoHref}>Email summary</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function PendingPanel() {
  return (
    <Card className="border-dashed border-primary/40 bg-primary/5">
      <CardContent className="flex items-center gap-3 py-6 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <div className="space-y-1 text-sm">
          <p className="font-medium">Generating insights…</p>
          <p className="text-primary/80">
            This can take up to 15 seconds when the AI provider is busy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorPanel({
  message,
  onRetry,
  disabled,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  disabled: boolean;
  isRetrying: boolean;
}) {
  return (
    <Card className="border-destructive/40 bg-destructive/10">
      <CardContent className="flex flex-col gap-3 py-6 text-destructive">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5" aria-hidden />
          <div>
            <p className="font-semibold">We hit a snag processing that transcript.</p>
            <p className="text-sm text-destructive/90">{message}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRetry}
            disabled={disabled}
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Retrying…
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                Retry request
              </>
            )}
          </Button>
          <p className="text-xs text-destructive/70">
            Still not working? Try trimming long sections or loading a demo sample.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionFooter({
  demoTip,
  isRunnable,
}: {
  demoTip?: string | null;
  isRunnable: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button type="submit" size="lg" disabled={pending || !isRunnable}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Generating…
          </>
        ) : (
          "Generate Insights"
        )}
      </Button>

      {demoTip && (
        <p className="text-xs text-muted-foreground sm:ml-3">
          <strong>Demo tip:</strong> {demoTip}
        </p>
      )}

      {!isRunnable && (
        <p className="text-xs text-muted-foreground sm:ml-3">
          Provide at least 200 characters or pick a sample to enable generation.
        </p>
      )}
    </div>
  );
}

