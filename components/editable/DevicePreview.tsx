"use client";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

type Device = "desktop" | "tablet" | "mobile";
const DEVICES: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1280, h: 800, label: "Desktop" },
  tablet: { w: 820, h: 1180, label: "Tablet" },
  mobile: { w: 390, h: 844, label: "Mobile" },
};

export default function DevicePreview({ content, initial = "desktop", onClose }: { content: SiteContent; initial?: Device; onClose: () => void }) {
  const [device, setDevice] = useState<Device>(initial);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  const post = () => iframeRef.current?.contentWindow?.postMessage({ type: "editor:content", content }, "*");

  useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.data?.type === "preview:ready") { readyRef.current = true; post(); } };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (readyRef.current) post(); /* eslint-disable-next-line */ }, [content]);

  const d = DEVICES[device];
  useEffect(() => {
    const fit = () => { const avail = Math.min(window.innerWidth - 48, 1400); setScale(d.w > avail ? avail / d.w : 1); };
    fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit);
  }, [d.w]);

  return (
    <div className="dp-overlay">
      <div className="dp-bar">
        <span className="dp-title">Responsive preview</span>
        <span className="dp-divider" />
        {(Object.keys(DEVICES) as Device[]).map((k) => (
          <button key={k} className={`dp-btn ${device === k ? "on" : ""}`} onClick={() => setDevice(k)}>
            {DEVICES[k].label} <small>{DEVICES[k].w}</small>
          </button>
        ))}
        <span className="dp-spacer" />
        <button className="dp-btn" onClick={post} title="Refresh">↻</button>
        <button className="dp-btn" onClick={onClose}>✕ Close</button>
      </div>
      <div className="dp-stage">
        <div className="dp-device" style={{ width: d.w * scale, height: d.h * scale }}>
          <iframe ref={iframeRef} src="/admin/preview" title="preview"
            onLoad={() => { readyRef.current = true; setTimeout(post, 60); }}
            style={{ width: d.w, height: d.h, border: "none", transform: `scale(${scale})`, transformOrigin: "top left" }} />
        </div>
      </div>
      <style>{`
        .dp-overlay{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;background:rgba(0,0,0,.6);backdrop-filter:blur(10px)}
        .dp-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#192028;border-bottom:1px solid rgba(255,255,255,.1);flex-wrap:wrap;font-family:"DM Sans",system-ui,sans-serif}
        .dp-title{color:#e8ecf0;font-size:13px;font-weight:600}
        .dp-divider{width:1px;height:20px;background:rgba(255,255,255,.15)}
        .dp-spacer{flex:1}
        .dp-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#b6bfc8;font-size:12px;font-weight:600;cursor:pointer}
        .dp-btn small{opacity:.6}
        .dp-btn:hover{color:#fff}
        .dp-btn.on{background:#2e86c1;color:#fff;border-color:transparent}
        .dp-stage{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:28px}
        .dp-device{position:relative;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);flex-shrink:0}
      `}</style>
    </div>
  );
}
