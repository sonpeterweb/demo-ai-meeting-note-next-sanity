import type { Metadata } from "next";

import { fetchAIDemoSamples } from "@/sanity/lib/fetch";
import AIDemoClient from "@/components/ai/ai-demo-client";

export const metadata: Metadata = {
  title: "AI Demo",
  description:
    "Paste a meeting transcript and see Listenote turn it into a structured summary with key decisions and action items.",
};

export default async function AIDemoPage() {
  const samples = await fetchAIDemoSamples();
  return <AIDemoClient samples={samples ?? []} />;
}
