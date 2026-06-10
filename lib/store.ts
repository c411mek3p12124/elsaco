// ─────────────────────────────────────────────────────────────
// Storage layer (server-only). Git-based CMS — no database.
//
// LOCAL (dev): reads/writes data/content.json on disk and saves uploads
// into public/uploads.
//
// PRODUCTION (Vercel, read-only fs): saves are committed to GitHub via
// the Contents API. The token/repo come from the admin UI per-request
// (GhConfig) or from server env. Reading content always uses the file
// bundled into the deployment (committed content.json).
// ─────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";
import { defaultContent, type SiteContent } from "./content";
import { ghEnabled, putFile, getFileText, envConfig, type GhConfig } from "./github";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const CONTENT_REPO_PATH = "data/content.json";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/** Deep-merge saved content over defaults so new fields always appear. */
function merge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const ov = (override ?? {}) as Record<string, unknown>;
    for (const key of Object.keys(out)) if (key in ov) out[key] = merge(out[key], ov[key]);
    return out as T;
  }
  return (override ?? base) as T;
}

/** Resolve the GitHub config: prefer request config, else env. */
function resolve(gh?: Partial<GhConfig>): GhConfig {
  const env = envConfig();
  return {
    token: gh?.token || env.token,
    repo: gh?.repo || env.repo,
    branch: gh?.branch || env.branch || "main",
  };
}

export async function getContent(gh?: Partial<GhConfig>): Promise<SiteContent> {
  const cfg = resolve(gh);
  // If GitHub is configured, read the latest committed file (so saved edits
  // show immediately, even before the redeploy finishes).
  if (ghEnabled(cfg)) {
    try {
      const raw = await getFileText(cfg, CONTENT_REPO_PATH);
      if (raw) return merge(defaultContent, JSON.parse(raw));
    } catch {
      /* fall through */
    }
  }
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    return merge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent, gh?: Partial<GhConfig>): Promise<"github" | "local"> {
  const cfg = resolve(gh);
  const json = JSON.stringify(content, null, 2);
  if (ghEnabled(cfg)) {
    await putFile(cfg, CONTENT_REPO_PATH, Buffer.from(json, "utf-8").toString("base64"), "content: update via editor");
    return "github";
  }
  await ensureDir(DATA_DIR);
  await fs.writeFile(CONTENT_FILE, json, "utf-8");
  return "local";
}

export async function saveUpload(file: File, gh?: Partial<GhConfig>): Promise<string> {
  const cfg = resolve(gh);
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filename = `${Date.now()}-${safe}`;
  if (ghEnabled(cfg)) {
    await putFile(cfg, `public/uploads/${filename}`, bytes.toString("base64"), `upload: ${filename}`);
    return `/uploads/${filename}`;
  }
  await ensureDir(UPLOAD_DIR);
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
  return `/uploads/${filename}`;
}
