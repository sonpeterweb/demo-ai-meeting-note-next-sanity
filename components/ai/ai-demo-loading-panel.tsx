"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  "Analysing transcript…",
  "Finding decisions…",
  "Extracting action items…",
  "Preparing meeting summary…",
] as const;

export default function AIDemoLoadingPanel() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % LOADING_STEPS.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  const progress = ((activeStep + 1) / LOADING_STEPS.length) * 100;

  return (
    <Card
      className="border-primary/30 bg-primary/5"
      aria-live="polite"
      aria-busy="true"
    >
      <CardContent className="space-y-5 py-6">
        <div className="flex items-start gap-3 text-primary">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium text-foreground">Processing your meeting</p>
            <p className="text-sm text-muted-foreground">
              This usually takes a few seconds. Live AI may take up to 15 seconds
              when the provider is busy.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div
            className="h-2 overflow-hidden rounded-full bg-primary/15"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Processing progress"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ul className="space-y-2 text-sm">
            {LOADING_STEPS.map((step, index) => {
              const status =
                index < activeStep
                  ? "done"
                  : index === activeStep
                    ? "active"
                    : "pending";

              return (
                <li
                  key={step}
                  className={cn(
                    "flex items-center gap-2",
                    status === "active" && "font-medium text-foreground",
                    status === "done" && "text-muted-foreground",
                    status === "pending" && "text-muted-foreground/70"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                      status === "active" && "bg-primary text-primary-foreground",
                      status === "done" && "bg-primary/20 text-primary",
                      status === "pending" && "bg-muted text-muted-foreground"
                    )}
                    aria-hidden
                  >
                    {status === "done" ? "✓" : index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
