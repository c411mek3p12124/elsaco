"use client";
import { useCallback, useEffect, useState } from "react";
import SiteMirror from "@/components/SiteMirror";
import { setByPath, getByPath, blankLike, type EditCtx } from "@/components/editable/EditContext";
import FormatBar from "@/components/editable/FormatBar";
import { ThemeApplier, ThemePanel } from "@/components/editable/ThemePanel";
import DevicePreview from "@/components/editable/DevicePreview";
import { defaultTheme, type SiteContent, type ThemeColors, type ElementStyle } from "@/lib/content";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [editing, setEditing] = useState(true);
  const [status, setStatus] = useState("");
  const [gateErr, setGateErr] = useState("");
  const [activePath, setActivePath] = useState<string | null>(null);
  const [activeKind, setActiveKind] = useState<"text" | null>(null);
  const [showTheme, setShowTheme] = useState(false);
  const [device, setDevice] = useState<null | "desktop" | "tablet" | "mobile">(null);
  const [gh, setGh] = useState({ token: "", repo: "c411mek3p12124/elsaco", branch: "main" });
  const [showGh, setShowGh] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("elsaco.gh");
      if (raw) setGh((g) => ({ ...g, ...JSON.parse(raw) }));
    } catch {}
  }, []);
  const saveGh = (next: typeof gh) => { setGh(next); try { localStorage.setItem("elsaco.gh", JSON.stringify(next)); } catch {} };
  const ghHeaders = () => ({ "x-github-token": gh.token, "x-github-repo": gh.repo, "x-github-branch": gh.branch });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setStatus("Gagal memuat konten"));
  }, []);

  // ── editing operations ──
  const setPath = useCallback((path: string, value: any) => {
    setContent((prev) => (prev ? (setByPath(prev, path, value) as SiteContent) : prev));
  }, []);

  const addItem = useCallback((path: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const arr = getByPath(prev, path) || [];
      const item = arr.length ? blankLike(arr[arr.length - 1]) : "";
      return setByPath(prev, path, [...arr, item]) as SiteContent;
    });
  }, []);

  const removeItem = useCallback((path: string, index: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const arr = getByPath(prev, path) || [];
      return setByPath(prev, path, arr.filter((_: any, j: number) => j !== index)) as SiteContent;
    });
  }, []);

  // ── per-element styles (stored under content.styles[path] as a literal key) ──
  const getStyle = useCallback((path: string): ElementStyle => (content?.styles?.[path] ?? {}), [content]);
  const setStyle = useCallback((path: string, partial: ElementStyle) => {
    setContent((prev) => {
      if (!prev) return prev;
      const merged: any = { ...(prev.styles?.[path] ?? {}), ...partial };
      Object.keys(merged).forEach((k) => { const v = merged[k]; if (v === undefined || v === null || v === "") delete merged[k]; });
      return { ...prev, styles: { ...(prev.styles ?? {}), [path]: merged } };
    });
  }, []);
  const clearStyle = useCallback((path: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = { ...(prev.styles ?? {}) }; delete next[path];
      return { ...prev, styles: next };
    });
  }, []);
  const setThemeColor = useCallback((key: keyof ThemeColors, v: string) => {
    setContent((prev) => prev ? { ...prev, theme: { ...(prev.theme ?? defaultTheme), [key]: v } } : prev);
  }, []);

  const upload = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password, ...ghHeaders() },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "upload error");
      return (await res.json()).url as string;
    },
    [password]
  );

  const tryLogin = async () => {
    // Verify the password only — no save (works even before GitHub is set).
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "x-admin-password": password, "x-admin-check": "1" },
    });
    if (res.ok) {
      setAuthed(true);
      setGateErr("");
    } else {
      setGateErr("Password salah");
    }
  };

  const save = async () => {
    if (!content) return;
    setStatus("Menyimpan…");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password, ...ghHeaders() },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus(
        data.mode === "github"
          ? "✓ Tersimpan & di-commit ke GitHub. Situs ter-update ±1 menit."
          : "✓ Tersimpan ke file lokal. (Untuk online, isi GitHub token di 🔗 GitHub.)"
      );
      setTimeout(() => setStatus(""), 7000);
    } else {
      const err = await res.json().catch(() => ({}));
      setStatus("Gagal menyimpan: " + (err.error || res.status));
    }
  };

  // ── password gate ──
  if (!authed) {
    return (
      <div className="adm-gate">
        <GateStyles />
        <div className="adm-gate-card">
          <h1 className="adm-gate-title">Editor Privat — Elsa &amp; Co</h1>
          <p className="adm-gate-sub">Masukkan password untuk mengubah isi landing page.</p>
          <input
            className="adm-gate-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            autoFocus
          />
          <button className="adm-gate-btn" onClick={tryLogin}>
            Masuk
          </button>
          {gateErr && <p className="adm-gate-err">{gateErr}</p>}
        </div>
      </div>
    );
  }

  if (!content) return <div className="adm-gate"><GateStyles />Memuat…</div>;

  const ctx: EditCtx = {
    editing, setPath, addItem, removeItem, upload,
    getStyle, setStyle, clearStyle,
    activePath, activeKind,
    select: (p, k) => { setActivePath(p); setActiveKind(k); },
    clearActive: () => { setActivePath(null); setActiveKind(null); },
  };

  return (
    <div>
      <ToolbarStyles />
      <FormatBarStyles />
      <ThemeApplier theme={content.theme} />
      {editing && <FormatBar />}
      {showTheme && <ThemePanel theme={content.theme ?? defaultTheme} onChange={setThemeColor} onClose={() => setShowTheme(false)} />}
      {device && <DevicePreview content={content} initial={device} onClose={() => setDevice(null)} />}
      {showGh && (
        <div className="thm-overlay" onClick={() => setShowGh(false)}>
          <div className="thm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Koneksi GitHub</h3>
            <p className="thm-sub">Agar tombol Simpan bisa commit ke repo &amp; tampil online. Token disimpan hanya di browser ini — tidak dikirim ke mana pun selain GitHub.</p>
            <label className="gh-field"><span>Repo (owner/repo)</span><input className="gh-input" value={gh.repo} onChange={(e) => saveGh({ ...gh, repo: e.target.value })} placeholder="c411mek3p12124/elsaco" /></label>
            <label className="gh-field"><span>Branch</span><input className="gh-input" value={gh.branch} onChange={(e) => saveGh({ ...gh, branch: e.target.value })} placeholder="main" /></label>
            <label className="gh-field"><span>Token (Contents: Read &amp; Write)</span><input className="gh-input" type="password" value={gh.token} onChange={(e) => saveGh({ ...gh, token: e.target.value })} placeholder="github_pat_…" /></label>
            <p className="gh-hint">Buat token: GitHub → Settings → Developer settings → Fine-grained tokens → repo <b>elsaco</b> → Contents: Read &amp; write.</p>
            <button className="thm-done" onClick={() => setShowGh(false)}>Selesai</button>
          </div>
        </div>
      )}
      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          <span className="adm-brand">Editor — Elsa &amp; Co</span>
          <div className="adm-modes">
            <button
              className={`adm-mode ${editing ? "active" : ""}`}
              onClick={() => setEditing(true)}
            >
              ✏️ Mode Edit
            </button>
            <button
              className={`adm-mode ${!editing ? "active" : ""}`}
              onClick={() => setEditing(false)}
            >
              👁️ Lihat Hasil
            </button>
          </div>
          <div className="adm-tools">
            <button className="adm-tool" onClick={() => setShowGh(true)} title="Koneksi GitHub (simpan online)">🔗 GitHub</button>
            <button className="adm-tool" onClick={() => setShowTheme(true)} title="Warna & tema">🎨 Warna</button>
            <span className="adm-tool-sep" />
            <span className="adm-tool-label">Pratinjau:</span>
            <button className="adm-tool" onClick={() => setDevice("desktop")} title="Desktop">🖥️</button>
            <button className="adm-tool" onClick={() => setDevice("tablet")} title="Tablet">📋</button>
            <button className="adm-tool" onClick={() => setDevice("mobile")} title="Mobile">📱</button>
          </div>
        </div>
        <div className="adm-toolbar-right">
          {status && <span className="adm-status">{status}</span>}
          <a className="adm-link" href="/" target="_blank" rel="noreferrer">
            Buka situs ↗
          </a>
          <button className="adm-save" onClick={save}>
            💾 Simpan
          </button>
        </div>
      </div>

      {editing && (
        <div className="adm-help">
          Klik teks bergaris putus-putus (✏) untuk mengedit langsung. Gunakan tombol
          <b> ＋ Tambah </b> dan <b> ✕ </b> untuk menambah / menghapus item. Lalu klik <b>Simpan</b>.
        </div>
      )}

      {/* The live site, editable */}
      <div className="adm-canvas">
        <SiteMirror content={content} ctx={ctx} />
      </div>
    </div>
  );
}

function GateStyles() {
  return (
    <style>{`
      .adm-gate{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f1419;color:#e8ecf0;font-family:"DM Sans",system-ui,sans-serif;padding:24px}
      .adm-gate-card{background:#192028;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px;width:100%;max-width:380px;text-align:left}
      .adm-gate-title{font-size:20px;font-weight:700;margin-bottom:6px}
      .adm-gate-sub{font-size:13px;color:#8899a6;margin-bottom:18px}
      .adm-gate-input{width:100%;padding:11px 14px;border-radius:9px;background:#0f1419;border:1px solid rgba(255,255,255,.14);color:#e8ecf0;font-size:14px;outline:none;font-family:inherit}
      .adm-gate-input:focus{border-color:#2e86c1}
      .adm-gate-btn{margin-top:12px;width:100%;padding:11px;border-radius:9px;background:#2e86c1;border:none;color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
      .adm-gate-btn:hover{background:#3a91cc}
      .adm-gate-err{color:#ff6b6b;font-size:13px;margin-top:10px}
    `}</style>
  );
}

function ToolbarStyles() {
  return (
    <style>{`
      .adm-toolbar{position:sticky;top:0;z-index:200;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 18px;background:rgba(15,20,25,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.1);color:#e8ecf0;font-family:"DM Sans",system-ui,sans-serif;flex-wrap:wrap}
      .adm-toolbar-left,.adm-toolbar-right{display:flex;align-items:center;gap:12px}
      .adm-brand{font-family:"Plus Jakarta Sans",sans-serif;font-weight:700;font-size:14px}
      .adm-modes{display:flex;background:rgba(255,255,255,.06);border-radius:999px;padding:3px}
      .adm-mode{border:none;background:none;color:#8899a6;font-size:13px;font-weight:600;padding:6px 14px;border-radius:999px;cursor:pointer;font-family:inherit}
      .adm-mode.active{background:#2e86c1;color:#fff}
      .adm-status{font-size:12px;color:#5dade2}
      .adm-link{font-size:13px;color:#8899a6;text-decoration:none}
      .adm-link:hover{color:#e8ecf0}
      .adm-save{background:#27ae60;border:none;color:#fff;font-size:13px;font-weight:700;padding:8px 18px;border-radius:999px;cursor:pointer;font-family:inherit}
      .adm-save:hover{filter:brightness(1.08)}
      .adm-help{position:sticky;top:53px;z-index:150;background:#1a5276;color:#eaf4fb;font-size:12.5px;padding:8px 18px;text-align:center;font-family:"DM Sans",system-ui,sans-serif}
      .adm-canvas{position:relative}
      .adm-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
      .adm-tool{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#b6bfc8;font-size:13px;padding:6px 12px;border-radius:9px;cursor:pointer;font-family:inherit}
      .adm-tool:hover{color:#fff;border-color:rgba(255,255,255,.25)}
      .adm-tool-sep{width:1px;height:18px;background:rgba(255,255,255,.15)}
      .adm-tool-label{font-size:11px;color:#8899a6}
    `}</style>
  );
}

function FormatBarStyles() {
  return (
    <style>{`
      .ed-active{outline:2px solid var(--primary)!important;background:rgba(var(--primary-rgb),.12)!important}
      .fmt-bar{position:fixed;left:50%;transform:translateX(-50%);top:64px;z-index:300;display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:14px;max-width:96vw;flex-wrap:wrap;background:#192028;border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 40px rgba(0,0,0,.4);font-family:"DM Sans",system-ui,sans-serif}
      .fmt-bar .fmt-sep{width:1px;height:22px;background:rgba(255,255,255,.15)}
      .fmt-btn{min-width:30px;height:30px;padding:0 8px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;color:#b6bfc8;font-size:14px}
      .fmt-btn:hover{background:rgba(255,255,255,.08);color:#fff}
      .fmt-btn.on{background:#2e86c1;color:#fff}
      .fmt-select{height:30px;border-radius:8px;padding:0 8px;cursor:pointer;max-width:120px;background:#0f1419;border:1px solid rgba(255,255,255,.14);color:#e8ecf0;font-size:12px;outline:none}
      .fmt-size{width:44px;height:30px;text-align:center;border-radius:8px;background:#0f1419;border:1px solid rgba(255,255,255,.14);color:#e8ecf0;font-size:12px;outline:none}
      .fmt-color{position:relative;width:30px;height:30px;border-radius:8px;overflow:hidden;cursor:pointer;border:1px solid rgba(255,255,255,.14)}
      .fmt-color span{position:absolute;inset:3px;border-radius:5px}
      .fmt-color input{position:absolute;inset:0;opacity:0;cursor:pointer}
      .thm-overlay{position:fixed;inset:0;z-index:400;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)}
      .thm-card{width:min(92vw,420px);background:#192028;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:26px;color:#e8ecf0;font-family:"DM Sans",system-ui,sans-serif}
      .thm-card h3{font-size:18px;font-weight:700;margin-bottom:4px;font-family:"Plus Jakarta Sans",sans-serif}
      .thm-sub{font-size:13px;color:#8899a6;margin-bottom:16px}
      .thm-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:13px}
      .thm-val{display:flex;align-items:center;gap:10px}
      .thm-val code{font-size:11px;color:#8899a6}
      .thm-val input[type=color]{width:30px;height:30px;border:none;background:none;cursor:pointer;border-radius:6px}
      .thm-done{margin-top:18px;width:100%;padding:11px;border-radius:10px;background:#2e86c1;border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
      .gh-field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
      .gh-field>span{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#8899a6}
      .gh-input{width:100%;padding:10px 12px;border-radius:9px;background:#0f1419;border:1px solid rgba(255,255,255,.14);color:#e8ecf0;font-size:13px;outline:none;font-family:inherit}
      .gh-input:focus{border-color:#2e86c1}
      .gh-hint{font-size:11.5px;color:#7f8c9a;line-height:1.5;margin-top:2px}
    `}</style>
  );
}
