import SignalApp from "@/components/SignalApp";
import { hasApiKey } from "@/lib/anthropic";

// Read the env var at request time so adding a key doesn't require a rebuild.
export const dynamic = "force-dynamic";

export default function Home() {
  return <SignalApp demoMode={!hasApiKey()} />;
}
