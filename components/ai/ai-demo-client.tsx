"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { submitMeetingTranscript } from "@/app/(main)/ai-demo/actions";
import {
  INITIAL_FORM_STATE,
  type SummarizeFormState,
} from "@/app/(main)/ai-demo/form-utils";
import type { AI_DEMO_SAMPLES_QUERYResult } from "@/sanity.types";
import AIDemoEmptyState from "@/components/ai/ai-demo-empty-state";
import AIDemoErrorPanel from "@/components/ai/ai-demo-error-panel";
import AIDemoLoadingPanel from "@/components/ai/ai-demo-loading-panel";
import AIDemoResultsPanel from "@/components/ai/ai-demo-results-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  samples: AI_DEMO_SAMPLES_QUERYResult;
};

export default function AIDemoClient({ samples }: Props) {
  const transcriptRef = useRef<HTMLTextAreaElement>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isPrefilling, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState<
    SummarizeFormState,
    FormData
  >(submitMeetingTranscript, INITIAL_FORM_STATE);

  const isTranscriptRunnable =
    transcript.trim().length >= 200 || Boolean(selectedSampleId);
  const showEmptyState = state.status === "idle" && !isPending;
  const showResults = state.status === "success" && state.result;
  const showGeneralError =
    state.status === "error" && Boolean(state.errors?.general);

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

  const handleTryFirstSample = () => {
    const first = samples[0];
    if (first) {
      handleSampleSelect(first._id);
      transcriptRef.current?.focus();
    }
  };

  const handleFocusForm = () => {
    transcriptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    transcriptRef.current?.focus();
  };

  const handleRetry = () => {
    const data = new FormData();
    data.set("transcript", transcript);
    data.set("sampleId", selectedSampleId ?? "");
    formAction(data);
  };

  return (
    <div className="pb-16 pt-12">
      <div className="container mb-10 space-y-3">
        <p className="text-sm font-medium text-primary">Listenote AI Demo</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Turn transcripts into summaries and next steps
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste a meeting transcript or load a sample scenario to see how
          Listenote extracts summaries, decisions, and action items your team can
          share right away.
        </p>
      </div>

      <div className="container grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
        <aside className="order-2 space-y-6 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Sample transcripts</CardTitle>
              <CardDescription>
                Choose a scenario to prefill the form, then generate insights in one
                click.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {samples.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No samples published yet. Add meeting scenarios in Sanity Studio
                  under <strong>AI Demo Samples</strong>.
                </p>
              ) : (
                <ul className="space-y-3" role="list">
                  {samples.map((sample) => {
                    const isSelected = selectedSampleId === sample._id;

                    return (
                      <li key={sample._id}>
                        <button
                          type="button"
                          onClick={() => handleSampleSelect(sample._id)}
                          aria-pressed={isSelected}
                          className={cn(
                            "w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
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
                              {sample.persona}
                            </p>
                          )}
                          {isSelected && (
                            <p className="mt-2 text-xs font-medium text-primary">
                              Selected — ready to generate
                            </p>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">Using your own notes?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste at least 200 characters from Zoom, Teams, or a `.txt` export.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Longer transcripts produce richer summaries. Samples run instantly
                without calling the AI provider.
              </p>
              <p>
                Configure prompts and models in the <strong>AI Demo Config</strong>{" "}
                document in Sanity Studio.
              </p>
            </CardContent>
          </Card>
        </aside>

        <div className="order-1 space-y-6 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Summarize a meeting</CardTitle>
              <CardDescription>
                Transcript in, structured notes out — summary, decisions, and tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="sampleId" value={selectedSampleId ?? ""} />

                <div className="space-y-2">
                  <Label htmlFor="transcript">Meeting transcript</Label>
                  <textarea
                    ref={transcriptRef}
                    id="transcript"
                    name="transcript"
                    value={transcript}
                    onChange={(event) => setTranscript(event.target.value)}
                    placeholder="Paste raw meeting notes or load a sample from the left…"
                    rows={12}
                    aria-describedby="transcript-hint"
                    className={cn(
                      "min-h-[200px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                      state.errors?.transcript ? "border-destructive" : ""
                    )}
                  />
                  <div
                    id="transcript-hint"
                    className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      {transcript.length} characters
                      {!isTranscriptRunnable && " · 200+ required without a sample"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        disabled={!selectedSample}
                        onClick={() => {
                          if (selectedSample?.transcript) {
                            setTranscript(selectedSample.transcript);
                          }
                        }}
                      >
                        Reload sample
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8"
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
                    <p className="text-sm text-destructive" role="alert">
                      {state.errors.transcript}
                    </p>
                  )}
                  {state.errors?.sampleId && (
                    <p className="text-sm text-destructive" role="alert">
                      {state.errors.sampleId}
                    </p>
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
                    aria-describedby="audio-hint"
                  />
                  <p id="audio-hint" className="text-xs text-muted-foreground">
                    Audio ingestion is coming soon — today the demo focuses on
                    transcripts.
                  </p>
                </div>

                <SubmissionFooter
                  demoTip={selectedSample?.demoTips}
                  isRunnable={isTranscriptRunnable}
                />
              </form>
            </CardContent>
          </Card>

          {isPending && <AIDemoLoadingPanel />}

          {showGeneralError && (
            <AIDemoErrorPanel
              onRetry={handleRetry}
              disabled={!isTranscriptRunnable || isPending}
              isRetrying={isPending}
            />
          )}

          {showEmptyState && !showResults && (
            <AIDemoEmptyState
              hasSamples={samples.length > 0}
              onTrySample={samples.length > 0 ? handleTryFirstSample : undefined}
              onFocusForm={handleFocusForm}
            />
          )}

          {showResults && state.result && (
            <AIDemoResultsPanel result={state.result} message={state.message} />
          )}
        </div>
      </div>
    </div>
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
  const isBusy = pending;

  return (
    <div className="space-y-3">
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={isBusy || !isRunnable}
      >
        {isBusy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Generating meeting notes…
          </>
        ) : (
          "Generate meeting notes"
        )}
      </Button>

      {demoTip && (
        <p className="text-xs text-muted-foreground">
          <strong>Demo tip:</strong> {demoTip}
        </p>
      )}

      {!isRunnable && (
        <p className="text-xs text-muted-foreground">
          Provide at least 200 characters or select a sample to enable generation.
        </p>
      )}
    </div>
  );
}
