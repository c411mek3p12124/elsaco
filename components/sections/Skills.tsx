"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";

export default function Skills({ data }: { data: SiteContent["skills"] }) {
  return (
    <section id="skills" className="section-pad">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="skills.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="skills.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap justify-center items-center gap-2.5 mb-6">
            {data.coreSkills.map((s, i) => (
              <span
                key={i}
                className="ed-item glass-pill px-4 py-2 text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                <T p={`skills.coreSkills.${i}`}>{s}</T>
                <DeleteBtn p="skills.coreSkills" i={i} />
              </span>
            ))}
          </div>
          <div className="flex justify-center mb-14">
            <AddBtn p="skills.coreSkills" label="Tambah skill" />
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.groups.map((g, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div className="ed-item glass p-6 h-full">
                <DeleteBtn p="skills.groups" i={i} />
                <h3 className="font-heading font-semibold text-base mb-4" style={{ color: "var(--text)" }}>
                  <T p={`skills.groups.${i}.title`}>{g.title}</T>
                </h3>
                <ul className="space-y-2.5">
                  {g.items.map((it, j) => (
                    <li key={j} className="ed-item flex items-start gap-2.5">
                      <span
                        className="mt-[7px] w-1 h-1 rounded-full shrink-0"
                        style={{ background: "var(--secondary)" }}
                      />
                      <span className="text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                        <T p={`skills.groups.${i}.items.${j}`}>{it}</T>
                      </span>
                      <DeleteBtn p={`skills.groups.${i}.items`} i={j} />
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <AddBtn p={`skills.groups.${i}.items`} label="Tambah" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="skills.groups" label="Tambah grup skill" />
        </div>

        <Reveal delay={0.1}>
          <p className="text-center text-sm mt-12 max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            <T p="skills.note">{data.note}</T>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
