"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, M, AddBtn, DeleteBtn } from "../editable/Editable";

export default function About({ data }: { data: SiteContent["about"] }) {
  return (
    <section id="about" className="section-pad">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="glass-static overflow-hidden aspect-[4/5] w-full">
              <M p="about.image" value={data.image} className="w-full h-full" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow mb-4">
                <T p="about.eyebrow">{data.eyebrow}</T>
              </p>
              <h2
                className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] tracking-tight mb-6"
                style={{ color: "var(--text)" }}
              >
                <T p="about.heading">{data.heading}</T>
              </h2>
            </Reveal>
            {data.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <p className="ed-item text-[15px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  <T p={`about.paragraphs.${i}`}>{p}</T>
                  <DeleteBtn p="about.paragraphs" i={i} />
                </p>
              </Reveal>
            ))}
            <AddBtn p="about.paragraphs" label="Tambah paragraf" />

            <Reveal delay={0.2}>
              <ul className="mt-6 space-y-3">
                {data.credibility.map((c, i) => (
                  <li key={i} className="ed-item flex items-start gap-3">
                    <span
                      className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--primary)" }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                      <T p={`about.credibility.${i}`}>{c}</T>
                    </span>
                    <DeleteBtn p="about.credibility" i={i} />
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <AddBtn p="about.credibility" label="Tambah poin" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
