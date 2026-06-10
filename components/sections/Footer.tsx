"use client";
import type { SiteContent } from "@/lib/content";
import { T } from "../editable/Editable";

export default function Footer({ data, brand }: { data: SiteContent["footer"]; brand: string }) {
  return (
    <footer className="py-10 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-heading font-bold text-sm" style={{ color: "var(--text)" }}>
          <T p="brand.name">{brand}</T>
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          <T p="footer.text">{data.text}</T>
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} — All rights reserved
        </span>
      </div>
    </footer>
  );
}
