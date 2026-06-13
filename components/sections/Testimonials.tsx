"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T, M, AddBtn, DeleteBtn } from "../editable/Editable";
import { useEdit } from "../editable/EditContext";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "var(--primary)" : "none"} stroke="var(--primary)" strokeWidth="1.5">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

/* Star rating — display in view mode, click-to-set in edit mode. */
function Stars({ p, value }: { p: string; value?: number }) {
  const { editing, setPath } = useEdit();
  const rating = Math.max(0, Math.min(5, value ?? 5));
  if (!editing) {
    return (
      <div className="flex gap-1" aria-label={`${rating} of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => <Star key={n} filled={n <= rating} />)}
      </div>
    );
  }
  return (
    <div className="flex gap-1" title="Klik bintang untuk atur rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className="leading-none" style={{ cursor: "pointer" }} onClick={() => setPath(p, n)}>
          <Star filled={n <= rating} />
        </button>
      ))}
    </div>
  );
}

export default function Testimonials({ data }: { data: SiteContent["testimonials"] }) {
  const { editing } = useEdit();
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

                <div className="flex items-center justify-between mb-4">
                  <div className="font-heading text-5xl leading-none" style={{ color: "var(--primary)" }}>
                    &ldquo;
                  </div>
                  <Stars p={`testimonials.items.${i}.rating`} value={t.rating} />
                </div>

                <blockquote className="text-[15px] leading-relaxed flex-1" style={{ color: "var(--text)" }}>
                  <T p={`testimonials.items.${i}.quote`}>{t.quote}</T>
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3">
                  {editing ? (
                    <span className="flex-shrink-0 w-28">
                      <M p={`testimonials.items.${i}.image`} value={t.image ?? { type: "image", url: "" }} className="w-12 h-12 rounded-full object-cover" />
                    </span>
                  ) : t.image?.url ? (
                    <span className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 grid place-items-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <M p={`testimonials.items.${i}.image`} value={t.image} className="w-12 h-12 rounded-full object-cover" />
                    </span>
                  ) : null}
                  <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    — <T p={`testimonials.items.${i}.author`}>{t.author}</T>
                  </span>
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
