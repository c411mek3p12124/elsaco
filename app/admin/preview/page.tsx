"use client";
import { useEffect, useState } from "react";
import LandingClient from "@/components/LandingClient";
import { defaultContent, type SiteContent } from "@/lib/content";

/* Renders the real live site, hydrated with the editor's (unsaved)
   content via postMessage, so the parent can frame it at device widths. */
export default function AdminPreview() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    // fallback to saved content until the parent sends the live edits
    fetch("/api/content").then((r) => r.json()).then((c) => setContent((p) => p ?? c)).catch(() => setContent(defaultContent));
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "editor:content" && e.data.content) setContent(e.data.content);
    };
    window.addEventListener("message", onMsg);
    window.parent?.postMessage({ type: "preview:ready" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!content) return null;
  return <LandingClient content={content} />;
}
