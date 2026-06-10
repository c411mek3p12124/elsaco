"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, AddBtn, DeleteBtn } from "../editable/Editable";

export default function Testimonials({ data }: { data: SiteContent["testimonials"] }) {
  return (
    <section id="testimonials" className="section-pad">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">
            <T p="testimonials.eyebrow">{data.eyebrow}</T>
          </p>
          <h2
            className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            <T p="testimonials.heading">{data.heading}</T>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {data.items.map((t, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <figure className="ed-item glass p-8 h-full flex flex-col">
                <DeleteBtn p="testimonials.items" i={i} />
                <div className="font-heading text-5xl leading-none mb-4" style={{ color: "var(--primary)" }}>
                  &ldquo;
                </div>
                <blockquote className="text-[15px] leading-relaxed flex-1" style={{ color: "var(--text)" }}>
                  <T p={`testimonials.items.${i}.quote`}>{t.quote}</T>
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  — <T p={`testimonials.items.${i}.author`}>{t.author}</T>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <AddBtn p="testimonials.items" label="Tambah testimoni" />
        </div>
      </div>
    </section>
  );
}
