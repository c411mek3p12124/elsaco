"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T } from "../editable/Editable";

export default function Contact({ data }: { data: SiteContent["contact"] }) {
  return (
    <section id="contact" className="section-pad">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="glass-static text-center px-6 md:px-16 py-16">
            <p className="eyebrow mb-5">
              <T p="contact.eyebrow">{data.eyebrow}</T>
            </p>
            <h2
              className="font-heading font-bold text-[clamp(1.9rem,4.5vw,3rem)] leading-tight tracking-tight mb-6"
              style={{ color: "var(--text)" }}
            >
              <T p="contact.heading">{data.heading}</T>
            </h2>
            <p className="text-[15px] leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
              <T p="contact.body">{data.body}</T>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={data.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <T p="contact.ctaText">{data.ctaText}</T>
              </a>
              <a href={`mailto:${data.email}`} className="btn-outline">
                <T p="contact.email">{data.email}</T>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
