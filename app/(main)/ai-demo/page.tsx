import { fetchAIDemoSamples } from "@/sanity/lib/fetch";
import AIDemoClient from "@/components/ai/ai-demo-client";

export default async function AIDemoPage() {
  const samples = await fetchAIDemoSamples();
  return <AIDemoClient samples={samples ?? []} />;
}

