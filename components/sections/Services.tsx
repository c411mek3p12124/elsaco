"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, M, AddBtn, DeleteBtn } from "../editable/Editable";
import { useEdit } from "../editable/EditContext";

export default function Services({ data }: { data: SiteContent["services"] }) {
  const { editing } = useEdit();
  return (
    <section id="services" className="section-pad">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal className="mb-6 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="services.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="services.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <Reveal>
          <p className="text-center text-[15px] max-w-2xl mx-auto mb-12" style={{ color: "var(--text-secondary)" }}>
            <T p="services.intro">{data.intro}</T>
          </p>
        </Reveal>

        {(editing || (data.video && data.video.url)) && (
          <Reveal>
            <div className="glass-static overflow-hidden aspect-video w-full max-w-4xl mx-auto mb-14">
              <M p="services.video" value={data.video} className="w-full h-full" />
            </div>
          </Reveal>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {data.categories.map((c, i) => (
            <Reveal key={i} delay={0.07 * i}>
              <div className="ed-item glass p-7 h-full">
                <DeleteBtn p="services.categories" i={i} />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 font-heading font-bold"
                  style={{ background: "rgba(var(--primary-rgb),0.1)", color: "var(--primary)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-4" style={{ color: "var(--text)" }}>
                  <T p={`services.categories.${i}.title`}>{c.title}</T>
                </h3>
                <ul className="space-y-2.5">
                  {c.items.map((it, j) => (
                    <li key={j} className="ed-item flex items-start gap-2.5">
                      <span className="mt-[7px] w-1 h-1 rounded-full shrink-0" style={{ background: "var(--secondary)" }} />
                      <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                        <T p={`services.categories.${i}.items.${j}`}>{it}</T>
                      </span>
                      <DeleteBtn p={`services.categories.${i}.items`} i={j} />
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <AddBtn p={`services.categories.${i}.items`} label="Tambah" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="services.categories" label="Tambah layanan" />
        </div>
      </div>
    </section>
  );
}
