"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";

export default function WhyElsa({ data }: { data: SiteContent["why"] }) {
  return (
    <section id="why" className="section-pad">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="why.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="why.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <Reveal>
          <div className="glass-static overflow-hidden">
            <div className="grid grid-cols-3 gap-2 px-5 md:px-8 py-5 border-b" style={{ borderColor: "var(--border)" }}>
              <span />
              <span className="font-heading font-bold text-sm text-center" style={{ color: "var(--primary)" }}>
                <T p="why.colElsa">{data.colElsa}</T>
              </span>
              <span className="font-heading font-semibold text-sm text-center" style={{ color: "var(--text-muted)" }}>
                <T p="why.colHire">{data.colHire}</T>
              </span>
            </div>
            {data.rows.map((r, i) => (
              <div
                key={i}
                className="ed-item grid grid-cols-3 gap-2 px-5 md:px-8 py-4 items-center"
                style={{ borderBottom: i < data.rows.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                  <T p={`why.rows.${i}.label`}>{r.label}</T>
                </span>
                <span className="text-[13px] text-center font-medium" style={{ color: "var(--primary)" }}>
                  <T p={`why.rows.${i}.elsa`}>{r.elsa}</T>
                </span>
                <span className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
                  <T p={`why.rows.${i}.hire`}>{r.hire}</T>
                </span>
                <DeleteBtn p="why.rows" i={i} />
              </div>
            ))}
          </div>
        </Reveal>
        <div className="flex justify-center mt-6">
          <AddBtn p="why.rows" label="Tambah baris" />
        </div>
      </div>
    </section>
  );
}
