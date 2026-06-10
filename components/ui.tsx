"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Media } from "@/lib/content";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <Reveal className="mb-14 text-center max-w-3xl mx-auto">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2
        className="font-heading font-bold text-[clamp(1.8rem,4vw,2.6rem)] leading-tight tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {heading}
      </h2>
    </Reveal>
  );
}

/** Renders an editable media field (image or video). Empty url -> nothing. */
export function MediaView({ media, className = "" }: { media: Media; className?: string }) {
  if (!media || !media.url) return null;
  if (media.type === "video") {
    return (
      <video
        className={className}
        src={media.url}
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.url} alt="" className={className} style={{ objectFit: "cover" }} />;
}
