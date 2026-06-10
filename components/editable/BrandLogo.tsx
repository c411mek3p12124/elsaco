"use client";
import { useState } from "react";
import { useEdit } from "./EditContext";
import type { LogoData } from "@/lib/content";

/** Display the brand logo (image / text / none). Used live + in admin. */
export function BrandLogo({ logo, fallback, className = "" }: { logo?: LogoData; fallback?: string; className?: string }) {
  const mode = logo?.mode ?? "text";
  if (mode === "none") return null;
  if (mode === "image" && logo?.image) {
    return <img src={logo.image} alt="" className={className} style={{ height: `${logo.size || 40}px`, width: "auto", objectFit: "contain" }} />;
  }
  const text = (logo?.text || fallback || "").trim();
  if (!text) return null;
  return (
    <span className={`font-heading font-bold ${className}`} style={{ fontSize: `${logo?.size || 18}px`, color: "var(--text)", lineHeight: 1.1 }}>
      {text}
    </span>
  );
}

/** Editable logo control (admin) — mode, upload, text, size. */
export function LogoEditor({ logo }: { logo?: LogoData }) {
  const { setPath, upload } = useEdit();
  const [busy, setBusy] = useState(false);
  const l: LogoData = logo ?? { mode: "text", image: "", text: "", size: 18 };
  const set = (partial: Partial<LogoData>) => setPath("brand.logo", { ...l, ...partial });

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try { const url = await upload(f); setPath("brand.logo", { ...l, image: url, mode: "image" }); }
    catch (e: any) { alert("Upload gagal: " + (e?.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="logo-editor">
      <div className="logo-preview"><BrandLogo logo={l} fallback="Elsa & Co" /></div>
      <div className="logo-tools">
        {(["image", "text", "none"] as const).map((m) => (
          <button key={m} type="button" className={`logo-btn ${l.mode === m ? "on" : ""}`} onClick={() => set({ mode: m })}>
            {m === "image" ? "Gambar" : m === "text" ? "Teks" : "Tanpa"}
          </button>
        ))}
        {l.mode === "image" && (
          <label className="logo-btn">
            {busy ? "Mengupload…" : l.image ? "Ganti gambar" : "Upload gambar"}
            <input type="file" hidden accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        )}
        {l.mode === "text" && (
          <input className="logo-input" value={l.text} placeholder="Teks logo" onChange={(e) => set({ text: e.target.value })} />
        )}
        {l.mode !== "none" && (
          <span className="logo-size">
            Ukuran <input type="range" min={l.mode === "image" ? 24 : 12} max={l.mode === "image" ? 96 : 48} value={l.size || (l.mode === "image" ? 40 : 18)} onChange={(e) => set({ size: +e.target.value })} />
          </span>
        )}
      </div>
    </div>
  );
}
