"use client";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "../ui";
import { T } from "../editable/Editable";
import { useEdit } from "../editable/EditContext";

function Field({ label, p, value, hint }: { label: string; p: string; value?: string; hint?: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
      <T p={p} className="block px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>{value || ""}</T>
      {hint && <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{hint}</span>}
    </label>
  );
}

export default function Contact({ data }: { data: SiteContent["contact"] }) {
  const { editing } = useEdit();

  // WhatsApp: build a wa.me link from the number + template message so the chat opens
  // with the message ready to send. Falls back to the legacy whatsapp URL if no number.
  const waNumber = (data.whatsappNumber || "").replace(/[^0-9]/g, "");
  const waHref = waNumber
    ? `https://wa.me/${waNumber}${data.whatsappMessage ? `?text=${encodeURIComponent(data.whatsappMessage)}` : ""}`
    : data.whatsapp || "#";

  // Email: open the visitor's mail app addressed to the editor's email (+ optional subject).
  const emailHref = data.email
    ? `mailto:${data.email}${data.emailSubject ? `?subject=${encodeURIComponent(data.emailSubject)}` : ""}`
    : "#";

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
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" onClick={(e) => { if (editing) e.preventDefault(); }}>
                <T p="contact.ctaText">{data.ctaText}</T>
              </a>
              <a href={emailHref} className="btn-outline" onClick={(e) => { if (editing) e.preventDefault(); }}>
                <T p="contact.email">{data.email}</T>
              </a>
            </div>

            {/* Admin: configure where the buttons point (number / template / email). */}
            {editing && (
              <div className="mt-10 max-w-lg mx-auto text-left grid gap-4 p-5 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>Admin · button settings</p>
                <Field label="WhatsApp number" p="contact.whatsappNumber" value={data.whatsappNumber} hint="Digits only with country code, e.g. 6285128014783" />
                <Field label="WhatsApp template message" p="contact.whatsappMessage" value={data.whatsappMessage} hint="Pre-filled in the chat, ready for the visitor to send" />
                <Field label="Email address" p="contact.email" value={data.email} hint="Where the email button sends to" />
                <Field label="Email subject (optional)" p="contact.emailSubject" value={data.emailSubject} />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
