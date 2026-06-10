"use client";
import { EditProvider, type EditCtx } from "./editable/EditContext";
import { T } from "./editable/Editable";
import { LogoEditor } from "./editable/BrandLogo";
import HeroStatic from "./HeroStatic";
import Sections from "./Sections";
import type { SiteContent } from "@/lib/content";

/** The live site rendered as an editable mirror inside /admin. */
export default function SiteMirror({ content, ctx }: { content: SiteContent; ctx: EditCtx }) {
  return (
    <EditProvider value={ctx}>
      {/* Opening / loading screen editor */}
      <section className="max-w-3xl mx-auto px-6 pt-10">
        <p className="font-heading text-[10px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Opening / Loading screen</p>
        <div className="glass-static p-8 flex flex-col items-center gap-4 text-center">
          <LogoEditor logo={content.brand.logo} />
          <T p="brand.name" as="p" className="font-heading font-bold text-lg">{content.brand.name}</T>
          <T p="brand.tagline" as="p" className="text-[11px] font-medium tracking-[0.2em] uppercase max-w-[300px]" >{content.brand.tagline}</T>
          <div className="bar-track"><div className="bar-fill" style={{ width: "60%" }} /></div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Logo ini juga tampil di header &amp; layar loading situs.</p>
        </div>
      </section>

      <HeroStatic hero={content.hero} />
      <Sections content={content} />
    </EditProvider>
  );
}
