"use client";
import { useEffect } from "react";
import type { ThemeColors } from "@/lib/content";

function hexToRgb(hex: string): string {
  const m = (hex || "").replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `${r || 0},${g || 0},${b || 0}`;
}

/** Applies the editable theme colors to CSS variables (live + admin). */
export function ThemeApplier({ theme }: { theme?: ThemeColors }) {
  useEffect(() => {
    if (!theme) return;
    const apply = () => {
      const root = document.documentElement;
      const dark = root.getAttribute("data-theme") === "dark";
      const primary = dark ? theme.primaryDark : theme.primaryLight;
      const bg = dark ? theme.bgDark : theme.bgLight;
      if (primary) {
        root.style.setProperty("--primary", primary);
        root.style.setProperty("--primary-rgb", hexToRgb(primary));
        root.style.setProperty("--highlight", primary);
        root.style.setProperty("--highlight-rgb", hexToRgb(primary));
        root.style.setProperty("--secondary", primary);
      }
      if (bg) {
        root.style.setProperty("--bg", bg);
        root.style.setProperty("--bg-rgb", hexToRgb(bg));
        root.style.setProperty("--canvas-bg", bg);
      }
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [theme, theme?.primaryLight, theme?.bgLight, theme?.primaryDark, theme?.bgDark]);
  return null;
}

const Row = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="thm-row">
    <span>{label}</span>
    <span className="thm-val">
      <code>{value}</code>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </span>
  </label>
);

export function ThemePanel({ theme, onChange, onClose }: { theme: ThemeColors; onChange: (key: keyof ThemeColors, v: string) => void; onClose: () => void }) {
  return (
    <div className="thm-overlay" onClick={onClose}>
      <div className="thm-card" onClick={(e) => e.stopPropagation()}>
        <h3>Colors &amp; Theme</h3>
        <p className="thm-sub">Changes apply live. Light and dark modes have separate colors.</p>
        <Row label="Accent (Light)" value={theme.primaryLight} onChange={(v) => onChange("primaryLight", v)} />
        <Row label="Background (Light)" value={theme.bgLight} onChange={(v) => onChange("bgLight", v)} />
        <Row label="Accent (Dark)" value={theme.primaryDark} onChange={(v) => onChange("primaryDark", v)} />
        <Row label="Background (Dark)" value={theme.bgDark} onChange={(v) => onChange("bgDark", v)} />
        <button className="thm-done" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
