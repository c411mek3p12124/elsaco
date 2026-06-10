"use client";
import type { SiteContent } from "@/lib/content";
import { T, AddBtn, DeleteBtn } from "./editable/Editable";

/**
 * Static editable hero used in the admin mirror (the live site uses the
 * scroll-driven HeroSequence). Shows the first sequence frame as backdrop
 * with the editable hero text + stats on top.
 */
export default function HeroStatic({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section id="home" className="relative">
      <div
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
        style={{
          backgroundImage: "url(/sequence/ezgif-frame-001.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "var(--canvas-bg)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--bg-rgb),0.6) 0%, rgba(var(--bg-rgb),0.2) 50%, rgba(var(--bg-rgb),0.7) 100%)",
          }}
        />
        <div className="relative z-10 max-w-4xl">
          <p className="eyebrow mb-5">
            <T p="hero.eyebrow">{hero.eyebrow}</T>
          </p>
          <h1
            className="font-heading font-extrabold text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="hero.headline">{hero.headline}</T>
          </h1>
          <p className="mt-6 text-[clamp(0.9rem,1.6vw,1.05rem)] leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            <T p="hero.subheadline">{hero.subheadline}</T>
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span className="btn-whatsapp">
              <T p="hero.ctaPrimaryText">{hero.ctaPrimaryText}</T>
            </span>
            <span className="btn-outline">
              <T p="hero.ctaSecondaryText">{hero.ctaSecondaryText}</T>
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 atmosphere">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hero.stats.map((s, i) => (
              <div key={i} className="ed-item glass-static p-8 text-center">
                <DeleteBtn p="hero.stats" i={i} />
                <div className="font-heading font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] mb-3" style={{ color: "var(--primary)" }}>
                  <T p={`hero.stats.${i}.value`}>{s.value}</T>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <T p={`hero.stats.${i}.label`}>{s.label}</T>
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <AddBtn p="hero.stats" label="Tambah statistik" />
          </div>
        </div>
      </div>
    </section>
  );
}
