"use client";
import { useEdit } from "./EditContext";

const FONTS = [
  { label: "Default", value: "" },
  { label: "Heading", value: "var(--font-heading)" },
  { label: "Body", value: "var(--font-body)" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'Courier New', monospace" },
];

/** Floating text-format bar — appears only when a text element is focused. */
export default function FormatBar() {
  const { editing, activeKind, activePath, getStyle, setStyle, clearStyle, clearActive } = useEdit();
  if (!editing || activeKind !== "text" || !activePath || !setStyle) return null;

  const p = activePath;
  const st = getStyle(p) || {};
  const curSize = st.fontSize ? parseInt(st.fontSize, 10) : 0;
  const isBold = (st.fontWeight ?? 0) >= 600;
  const isItalic = st.fontStyle === "italic";
  const isUnderline = st.textDecoration === "underline";
  const bump = (d: number) => setStyle(p, { fontSize: `${Math.max(8, (curSize || 16) + d)}px` });

  return (
    <div className="fmt-bar" onMouseDown={(e) => e.preventDefault()}>
      <select className="fmt-select" value={st.fontFamily ?? ""} onChange={(e) => setStyle(p, { fontFamily: e.target.value })} title="Font">
        {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
      </select>
      <span className="fmt-sep" />
      <button className="fmt-btn" onClick={() => bump(-2)} title="Smaller">−</button>
      <input className="fmt-size" value={curSize || ""} placeholder="auto"
        onChange={(e) => { const n = parseInt(e.target.value, 10); setStyle(p, { fontSize: isNaN(n) ? "" : `${n}px` }); }} />
      <button className="fmt-btn" onClick={() => bump(2)} title="Larger">+</button>
      <span className="fmt-sep" />
      <button className={`fmt-btn ${isBold ? "on" : ""}`} onClick={() => setStyle(p, { fontWeight: isBold ? undefined : 700 })} title="Bold"><b>B</b></button>
      <button className={`fmt-btn ${isItalic ? "on" : ""}`} onClick={() => setStyle(p, { fontStyle: isItalic ? "" : "italic" })} title="Italic"><i>I</i></button>
      <button className={`fmt-btn ${isUnderline ? "on" : ""}`} onClick={() => setStyle(p, { textDecoration: isUnderline ? "" : "underline" })} title="Underline"><u>U</u></button>
      <span className="fmt-sep" />
      {(["left", "center", "right", "justify"] as const).map((a) => (
        <button key={a} className={`fmt-btn ${st.textAlign === a ? "on" : ""}`} onClick={() => setStyle(p, { textAlign: st.textAlign === a ? "" : a })} title={st.textAlign === a ? "Reset to neutral" : `Align ${a}`}>
          {a === "left" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h12M3 18h15" /></svg>}
          {a === "center" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M6 12h12M4 18h16" /></svg>}
          {a === "right" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M9 12h12M6 18h15" /></svg>}
          {a === "justify" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>}
        </button>
      ))}
      <span className="fmt-sep" />
      <label className="fmt-color" title="Text color">
        <span style={{ background: st.color || "var(--text)" }} />
        <input type="color" value={st.color || "#2c3e50"} onChange={(e) => setStyle(p, { color: e.target.value })} />
      </label>
      <button className="fmt-btn" onClick={() => clearStyle?.(p)} title="Clear formatting">⤺</button>
      <button className="fmt-btn" onClick={() => clearActive?.()} title="Done">✕</button>
    </div>
  );
}
