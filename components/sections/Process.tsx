"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";

export default function Process({ data }: { data: SiteContent["process"] }) {
  return (
    <section id="process" className="section-pad">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="process.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="process.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {data.steps.map((s, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div className="ed-item glass p-8 h-full">
                <DeleteBtn p="process.steps" i={i} />
                <div className="font-heading font-extrabold text-5xl mb-5 opacity-80" style={{ color: "var(--primary)" }}>
                  <T p={`process.steps.${i}.no`}>{s.no}</T>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-3" style={{ color: "var(--text)" }}>
                  <T p={`process.steps.${i}.title`}>{s.title}</T>
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <T p={`process.steps.${i}.body`}>{s.body}</T>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="process.steps" label="Tambah langkah" />
        </div>
      </div>
    </section>
  );
}
