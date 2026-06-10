// ─────────────────────────────────────────────────────────────
// Storage layer (server-only). Git-based CMS — no database.
//
// LOCAL (env not set): reads/writes data/content.json on disk and
// saves uploads into public/uploads. Editing the real files directly.
//
// PRODUCTION (Vercel, env set): the filesystem is read-only, so saves
// are committed straight to the GitHub repo via the Contents API
// (see lib/github.ts). Vercel auto-redeploys and the change goes live.
// Set GITHUB_TOKEN, GITHUB_REPO ("owner/repo"), GITHUB_BRANCH.
// ─────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";
import { defaultContent, type SiteContent } from "./content";
import { githubEnabled, putFile, getFileText } from "./github";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const CONTENT_REPO_PATH = "data/content.json";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/** Deep-merge saved content over defaults so new fields always appear. */
function merge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const ov = (override ?? {}) as Record<string, unknown>;
    for (const key of Object.keys(out)) {
      if (key in ov) out[key] = merge(out[key], ov[key]);
    }
    return out as T;
  }
  return (override ?? base) as T;
}

export async function getContent(): Promise<SiteContent> {
  // In GitHub mode, read the latest committed file so saved edits show
  // immediately (even before the redeploy finishes).
  if (githubEnabled()) {
    try {
      const raw = await getFileText(CONTENT_REPO_PATH);
      if (raw) return merge(defaultContent, JSON.parse(raw));
    } catch {
      // fall through to local/default
    }
  }
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    return merge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  const json = JSON.stringify(content, null, 2);
  if (githubEnabled()) {
    await putFile(CONTENT_REPO_PATH, Buffer.from(json, "utf-8").toString("base64"), "content: update via editor");
    return;
  }
  await ensureDir(DATA_DIR);
  await fs.writeFile(CONTENT_FILE, json, "utf-8");
}

export async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filename = `${Date.now()}-${safe}`;
  if (githubEnabled()) {
    await putFile(`public/uploads/${filename}`, bytes.toString("base64"), `upload: ${filename}`);
    return `/uploads/${filename}`;
  }
  await ensureDir(UPLOAD_DIR);
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
  return `/uploads/${filename}`;
}
