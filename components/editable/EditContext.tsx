"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent, ElementStyle } from "@/lib/content";

type Json = any;

export interface EditCtx {
  editing: boolean;
  setPath: (path: string, value: Json) => void;
  addItem: (path: string) => void;
  removeItem: (path: string, index: number) => void;
  upload: (file: File) => Promise<string>;
  // per-element styles (keyed by literal path)
  getStyle: (path: string) => ElementStyle;
  setStyle?: (path: string, partial: ElementStyle) => void;
  clearStyle?: (path: string) => void;
  // active selection (for the format bar)
  activePath?: string | null;
  activeKind?: "text" | null;
  select?: (path: string, kind: "text") => void;
  clearActive?: () => void;
}

const noop = () => {};
const defaultCtx: EditCtx = {
  editing: false,
  setPath: noop,
  addItem: noop,
  removeItem: noop,
  upload: async () => "",
  getStyle: () => ({}),
};

const Ctx = createContext<EditCtx>(defaultCtx);
export const useEdit = () => useContext(Ctx);

export function EditProvider({ value, children }: { value: EditCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ── path helpers (used by the admin shell that owns content state) ──
export function getByPath(obj: Json, path: string): Json {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

export function setByPath(obj: Json, path: string, value: Json): Json {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur: Json = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

/** Return a blank copy of a value (same shape, cleared text / urls). */
export function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "boolean") return false;
  if (typeof v === "number") return 0;
  if (Array.isArray(v)) return v.length ? [blankLike(v[0])] : [];
  if (v && typeof v === "object") {
    if ("url" in v && (v.type === "image" || v.type === "video")) return { type: v.type, url: "" };
    const o: Json = {};
    for (const k of Object.keys(v)) o[k] = blankLike(v[k]);
    return o;
  }
  return v;
}

export type { SiteContent };
