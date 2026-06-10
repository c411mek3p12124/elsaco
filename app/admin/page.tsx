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
      {status && <div className="op-status">{status}</div>}

      {/* Floating toolbar (Keppra-style) */}
      <div className="op-toolbar">
        <button className={`op-mode ${editing ? "on" : ""}`} onClick={() => setEditing(true)} title="Mode edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg> Edit
        </button>
        <button className={`op-mode ${!editing ? "on" : ""}`} onClick={() => setEditing(false)} title="Lihat hasil">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> Lihat
        </button>

        <span className="op-sep" />

        <button className="icon-btn op-ic" title="Pratinjau Desktop" onClick={() => setDevice("desktop")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="1" /><path d="M8 21h8M12 17v4" /></svg>
        </button>
        <button className="icon-btn op-ic" title="Pratinjau Tablet" onClick={() => setDevice("tablet")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
        </button>
        <button className="icon-btn op-ic" title="Pratinjau Mobile" onClick={() => setDevice("mobile")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
        </button>

        <span className="op-sep" />

        <button className="icon-btn op-ic" title="Warna & tema" onClick={() => setShowTheme(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.926.746-1.688 1.688-1.688H16c3.314 0 6-2.686 6-6 0-4.97-4.5-8.5-10-8.5z" /></svg>
        </button>
        <button className="icon-btn op-ic" title="Koneksi GitHub (simpan online)" onClick={() => setShowGh(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        </button>
        <a className="icon-btn op-ic" title="Buka situs" href="/" target="_blank" rel="noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14L21 3" /></svg>
        </a>

        <button className="btn-primary op-save" onClick={save} title="Simpan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
          Simpan
        </button>
      </div>

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
      .adm-canvas{position:relative;padding-bottom:96px}
      .op-toolbar{position:fixed;left:50%;transform:translateX(-50%);bottom:20px;z-index:300;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:16px;max-width:96vw;flex-wrap:wrap;justify-content:center;background:var(--glass-bg);backdrop-filter:blur(var(--card-blur));-webkit-backdrop-filter:blur(var(--card-blur));border:1px solid var(--glass-border);box-shadow:var(--shadow);font-family:var(--font-body)}
      .op-sep{width:1px;height:22px;background:var(--border)}
      .op-mode{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;background:transparent;border:1px solid transparent;color:var(--text-muted);transition:all .2s;font-family:var(--font-heading)}
      .op-mode.on{background:var(--surface);border-color:var(--glass-border);color:var(--text)}
      .op-mode:hover{color:var(--text)}
      .op-ic{width:36px!important;height:36px!important;border-radius:11px}
      .op-save{padding:9px 18px;font-size:13px;border-radius:11px}
      .op-status{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:299;padding:8px 16px;border-radius:12px;background:var(--glass-bg);backdrop-filter:blur(var(--card-blur));border:1px solid var(--glass-border);box-shadow:var(--shadow);font-family:var(--font-body);font-size:12.5px;color:var(--text-secondary);max-width:90vw;text-align:center}
    `}</style>
  );
}

function FormatBarStyles() {
  return (
    <style>{`
      .ed-active{outline:2px solid var(--primary)!important;background:rgba(var(--primary-rgb),.12)!important}
      .fmt-bar{position:fixed;left:50%;transform:translateX(-50%);top:16px;z-index:350;display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:14px;max-width:96vw;flex-wrap:wrap;background:var(--glass-bg);backdrop-filter:blur(var(--card-blur));-webkit-backdrop-filter:blur(var(--card-blur));border:1px solid var(--glass-border);box-shadow:var(--shadow);font-family:var(--font-body)}
      .fmt-bar .fmt-sep{width:1px;height:22px;background:var(--border)}
      .fmt-btn{min-width:30px;height:30px;padding:0 8px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;color:var(--text-secondary);font-size:14px}
      .fmt-btn:hover{background:var(--surface);color:var(--text)}
      .fmt-btn.on{background:var(--primary);color:#fff}
      .fmt-select{height:30px;border-radius:8px;padding:0 8px;cursor:pointer;max-width:120px;background:var(--input-bg);border:1px solid var(--border);color:var(--text);font-size:12px;outline:none}
      .fmt-size{width:44px;height:30px;text-align:center;border-radius:8px;background:var(--input-bg);border:1px solid var(--border);color:var(--text);font-size:12px;outline:none}
      .fmt-color{position:relative;width:30px;height:30px;border-radius:8px;overflow:hidden;cursor:pointer;border:1px solid var(--border)}
      .fmt-color span{position:absolute;inset:3px;border-radius:5px}
      .fmt-color input{position:absolute;inset:0;opacity:0;cursor:pointer}
      .thm-overlay{position:fixed;inset:0;z-index:400;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);backdrop-filter:blur(6px)}
      .thm-card{width:min(92vw,420px);background:var(--bg);border:1px solid var(--glass-border);border-radius:16px;padding:26px;color:var(--text);box-shadow:var(--shadow);font-family:var(--font-body)}
      .thm-card h3{font-size:18px;font-weight:700;margin-bottom:4px;font-family:var(--font-heading);color:var(--text)}
      .thm-sub{font-size:13px;color:var(--text-secondary);margin-bottom:16px}
      .thm-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-secondary)}
      .thm-val{display:flex;align-items:center;gap:10px}
      .thm-val code{font-size:11px;color:var(--text-muted)}
      .thm-val input[type=color]{width:30px;height:30px;border:none;background:none;cursor:pointer;border-radius:6px}
      .thm-done{margin-top:18px;width:100%;padding:11px;border-radius:10px;background:var(--primary);border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-heading)}
      .gh-field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
      .gh-field>span{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-muted)}
      .gh-input{width:100%;padding:10px 12px;border-radius:9px;background:var(--input-bg);border:1px solid var(--border);color:var(--text);font-size:13px;outline:none;font-family:var(--font-body)}
      .gh-input:focus{border-color:var(--primary)}
      .gh-hint{font-size:11.5px;color:var(--text-muted);line-height:1.5;margin-top:2px}
    `}</style>
  );
}
