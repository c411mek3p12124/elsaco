"use client";
import { useEffect } from "react";
import type { ThemeColors } from "@/lib/content";

function hexToRgb(hex: string): string {
  const m = (hex || "").replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `${r || 0},${g || 0},${b || 0}`;
}

type BtnStyle = { radius: number; size: "sm" | "md" | "lg" };
const BTN_PAD: Record<string, string> = { sm: "11px 24px", md: "14px 32px", lg: "17px 42px" };

/** Applies the editable theme colors + button style to CSS variables. */
export function ThemeApplier({ theme, button }: { theme?: ThemeColors; button?: BtnStyle }) {
  useEffect(() => {
    const apply = () => {
      const root = document.documentElement;
      if (theme) {
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
      }
      if (button) {
        root.style.setProperty("--btn-radius", `${button.radius}px`);
        root.style.setProperty("--btn-pad", BTN_PAD[button.size] || BTN_PAD.md);
      }
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [theme, theme?.primaryLight, theme?.bgLight, theme?.primaryDark, theme?.bgDark, button, button?.radius, button?.size]);
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

export function ThemePanel({ theme, button, onChange, onButton, onClose }: { theme: ThemeColors; button: BtnStyle; onChange: (key: keyof ThemeColors, v: string) => void; onButton: (b: BtnStyle) => void; onClose: () => void }) {
  return (
    <div className="thm-overlay" onClick={onClose}>
      <div className="thm-card" onClick={(e) => e.stopPropagation()}>
        <h3>Warna &amp; Tampilan</h3>
        <p className="thm-sub">Berubah langsung. Mode terang &amp; gelap punya warna terpisah.</p>
        <Row label="Aksen (Terang)" value={theme.primaryLight} onChange={(v) => onChange("primaryLight", v)} />
        <Row label="Background (Terang)" value={theme.bgLight} onChange={(v) => onChange("bgLight", v)} />
        <Row label="Aksen (Gelap)" value={theme.primaryDark} onChange={(v) => onChange("primaryDark", v)} />
        <Row label="Background (Gelap)" value={theme.bgDark} onChange={(v) => onChange("bgDark", v)} />

        <div className="thm-btn-block">
          <p className="thm-block-label">Tombol</p>
          <div className="thm-btn-row">
            <span>Bentuk</span>
            <input type="range" min={0} max={40} value={button.radius > 40 ? 40 : button.radius} onChange={(e) => onButton({ ...button, radius: +e.target.value })} />
            <button className={`thm-mini ${button.radius >= 999 ? "on" : ""}`} onClick={() => onButton({ ...button, radius: 999 })}>Bulat</button>
          </div>
          <div className="thm-btn-row">
            <span>Ukuran</span>
            {(["sm", "md", "lg"] as const).map((s) => (
              <button key={s} className={`thm-mini ${button.size === s ? "on" : ""}`} onClick={() => onButton({ ...button, size: s })}>{s.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <button className="thm-done" onClick={onClose}>Selesai</button>
      </div>
    </div>
  );
}
