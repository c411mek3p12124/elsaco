"use client";
import { EditProvider, type EditCtx } from "./editable/EditContext";
import HeroStatic from "./HeroStatic";
import Sections from "./Sections";
import type { SiteContent } from "@/lib/content";

/** The live site rendered as an editable mirror inside /admin. */
export default function SiteMirror({ content, ctx }: { content: SiteContent; ctx: EditCtx }) {
  return (
    <EditProvider value={ctx}>
      <HeroStatic hero={content.hero} />
      <Sections content={content} />
    </EditProvider>
  );
}
