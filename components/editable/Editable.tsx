"use client";
import { useState, type ElementType, type ReactNode } from "react";
import { useEdit } from "./EditContext";
import { MediaView } from "../ui";
import type { Media } from "@/lib/content";

/**
 * Inline-editable text. In view mode renders plain; in edit mode the text
 * gets a dashed border + pencil badge and becomes editable in place.
 *   <T p="about.heading">{data.heading}</T>
 */
export function T({
  p,
  children,
  as,
  className = "",
  style,
}: {
  p: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: any;
}) {
  const { editing, setPath, getStyle, select, activePath } = useEdit();
  const Tag: ElementType = as || "span";
  const merged = { ...(style || {}), ...(getStyle(p) || {}) };
  // text-align only works on a block box, but T is an inline span by default —
  // so when an alignment is set, make it a full-width block so L/C/R/justify apply.
  const applied = merged.textAlign ? { display: "block", width: "100%", ...merged } : merged;
  if (!editing) return <Tag className={className} style={applied}>{children}</Tag>;
  const active = activePath === p;
  return (
    <Tag
      className={`ed-editable ${active ? "ed-active" : ""} ${className}`}
      style={applied}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => select?.(p, "text")}
      onClick={(e: any) => {
        // don't trigger parent buttons/links while editing
        e.stopPropagation();
        if (Tag === "span" || typeof Tag === "string") e.preventDefault?.();
      }}
      onBlur={(e: any) => setPath(p, e.currentTarget.innerText)}
    >
      {children}
    </Tag>
  );
}

/** Editable image/video. In edit mode shows a "Ganti" upload button overlay. */
export function M({
  p,
  value,
  className = "",
}: {
  p: string;
  value: Media;
  className?: string;
}) {
  const { editing, setPath, upload } = useEdit();
  const [busy, setBusy] = useState(false);

  if (!editing) return <MediaView media={value} className={className} />;

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try {
      const url = await upload(f);
      setPath(p, { type: f.type.startsWith("video") ? "video" : "image", url });
    } catch (e: any) {
      alert("Upload gagal: " + (e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ed-media">
      {value?.url ? (
        <MediaView media={value} className={className} />
      ) : (
        <div className="ed-media-empty">Belum ada media</div>
      )}
      <label className="ed-media-btn">
        {busy ? "Mengupload…" : "✏️ Ganti"}
        <input
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}

/** Delete the item at `index` of the array at `p`. Renders only in edit mode. */
export function DeleteBtn({ p, i, float = true }: { p: string; i: number; float?: boolean }) {
  const { editing, removeItem } = useEdit();
  if (!editing) return null;
  return (
    <button
      className={float ? "ed-del ed-del-float" : "ed-del"}
      title="Hapus item ini"
      onClick={(e) => {
        e.preventDefault();
        if (confirm("Hapus item ini?")) removeItem(p, i);
      }}
    >
      ✕
    </button>
  );
}

/** Append a new (blank) item to the array at `p`. Renders only in edit mode. */
export function AddBtn({ p, label = "Tambah item" }: { p: string; label?: string }) {
  const { editing, addItem } = useEdit();
  if (!editing) return null;
  return (
    <button className="ed-add" onClick={() => addItem(p)} type="button">
      ＋ {label}
    </button>
  );
}
