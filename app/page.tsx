import LandingClient from "@/components/LandingClient";
import { getContent } from "@/lib/store";

// Always read the latest saved content (so admin edits show immediately).
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return <LandingClient content={content} />;
}
