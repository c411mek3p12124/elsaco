"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";

export default function Pricing({ data }: { data: SiteContent["pricing"] }) {
  return (
    <section id="pricing" className="section-pad">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Reveal className="mb-6 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="pricing.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="pricing.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <Reveal>
          <p className="text-center text-sm max-w-3xl mx-auto mb-12" style={{ color: "var(--text-muted)" }}>
            <T p="pricing.note">{data.note}</T>
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {data.packages.map((p, i) => (
            <Reveal key={i} delay={0.07 * i}>
              <div
                className="ed-item glass p-8 h-full flex flex-col relative"
                style={
                  p.popular
                    ? { borderColor: "var(--primary)", boxShadow: "0 12px 40px rgba(var(--primary-rgb),0.2)" }
                    : undefined
                }
              >
                <DeleteBtn p="pricing.packages" i={i} />
                {p.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-heading font-semibold whitespace-nowrap"
                    style={{ background: "var(--primary)", color: "#fff" }}
                  >
                    ★ Most Popular
                  </span>
                )}
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: "var(--text)" }}>
                  <T p={`pricing.packages.${i}.name`}>{p.name}</T>
                </h3>
                <div className="font-heading font-extrabold text-3xl mb-1" style={{ color: "var(--primary)" }}>
                  <T p={`pricing.packages.${i}.price`}>{p.price}</T>
                </div>
                <div className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  <T p={`pricing.packages.${i}.unit`}>{p.unit}</T>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="ed-item flex items-start gap-2.5">
                      <span style={{ color: "var(--whatsapp)" }}>✓</span>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        <T p={`pricing.packages.${i}.features.${j}`}>{f}</T>
                      </span>
                      <DeleteBtn p={`pricing.packages.${i}.features`} i={j} />
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <AddBtn p={`pricing.packages.${i}.features`} label="Tambah fitur" />
                </div>
                <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                  <T p={`pricing.packages.${i}.perfect`}>{p.perfect}</T>
                </p>
                <a href="#contact" className={p.popular ? "btn-primary w-full" : "btn-outline w-full"}>
                  Choose {p.name}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="pricing.packages" label="Tambah paket" />
        </div>

        {/* Specialist service */}
        <Reveal delay={0.1}>
          <div className="glass-static mt-8 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-heading font-semibold mb-3"
                  style={{ background: "rgba(var(--primary-rgb),0.12)", color: "var(--primary)" }}
                >
                  ★ <T p="pricing.specialist.badge">{data.specialist.badge}</T>
                </span>
                <h3 className="font-heading font-bold text-2xl" style={{ color: "var(--text)" }}>
                  <T p="pricing.specialist.title">{data.specialist.title}</T>
                </h3>
              </div>
              <div className="text-left md:text-right">
                <div className="font-heading font-extrabold text-4xl" style={{ color: "var(--primary)" }}>
                  <T p="pricing.specialist.price">{data.specialist.price}</T>
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  <T p="pricing.specialist.priceNote">{data.specialist.priceNote}</T>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-heading font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
                  Long-term rentals
                </h4>
                <ul className="space-y-2">
                  {data.specialist.longTerm.map((it, i) => (
                    <li key={i} className="ed-item flex items-start gap-2.5">
                      <span className="mt-[7px] w-1 h-1 rounded-full shrink-0" style={{ background: "var(--secondary)" }} />
                      <span className="text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                        <T p={`pricing.specialist.longTerm.${i}`}>{it}</T>
                      </span>
                      <DeleteBtn p="pricing.specialist.longTerm" i={i} />
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <AddBtn p="pricing.specialist.longTerm" label="Tambah" />
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
                  Short-term & Airbnb rentals
                </h4>
                <ul className="space-y-2">
                  {data.specialist.shortTerm.map((it, i) => (
                    <li key={i} className="ed-item flex items-start gap-2.5">
                      <span className="mt-[7px] w-1 h-1 rounded-full shrink-0" style={{ background: "var(--secondary)" }} />
                      <span className="text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                        <T p={`pricing.specialist.shortTerm.${i}`}>{it}</T>
                      </span>
                      <DeleteBtn p="pricing.specialist.shortTerm" i={i} />
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <AddBtn p="pricing.specialist.shortTerm" label="Tambah" />
                </div>
              </div>
            </div>
            <p className="text-xs mt-8 pt-6" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
              <T p="pricing.specialist.model">{data.specialist.model}</T>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
