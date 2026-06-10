// ─────────────────────────────────────────────────────────────
// GitHub commit-on-save backend (git-based CMS, no database).
//
// The token/repo can come EITHER from the admin UI (sent per-request,
// stored only in the editor's browser — like the Keppra operator) OR
// from server env (GITHUB_TOKEN / GITHUB_REPO / GITHUB_BRANCH).
// On localhost with neither set, the app falls back to the filesystem
// (see lib/store.ts).
// ─────────────────────────────────────────────────────────────

export interface GhConfig {
  token: string;
  repo: string;   // "owner/repo"
  branch: string;
}

export function envConfig(): GhConfig {
  return {
    token: process.env.GITHUB_TOKEN || "",
    repo: process.env.GITHUB_REPO || "",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

export function ghEnabled(cfg: GhConfig): boolean {
  return !!(cfg.token && cfg.repo);
}

const API = "https://api.github.com";

function headers(cfg: GhConfig) {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "elsaco-editor",
  };
}

async function getSha(cfg: GhConfig, path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${cfg.repo}/contents/${encodeURIComponent(path)}?ref=${cfg.branch}`,
    { headers: headers(cfg), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getSha ${res.status}`);
  const json = await res.json();
  return json.sha ?? null;
}

/** Create or update a file in the repo. contentBase64 = file bytes in base64. */
export async function putFile(cfg: GhConfig, path: string, contentBase64: string, message: string): Promise<void> {
  const sha = await getSha(cfg, path);
  const res = await fetch(`${API}/repos/${cfg.repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contentBase64, branch: cfg.branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub putFile ${res.status}: ${text}`);
  }
}

/** Read a text file from the repo (latest committed version). */
export async function getFileText(cfg: GhConfig, path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${cfg.repo}/contents/${encodeURIComponent(path)}?ref=${cfg.branch}`,
    { headers: headers(cfg), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFileText ${res.status}`);
  const json = await res.json();
  if (!json.content) return null;
  return Buffer.from(json.content, "base64").toString("utf-8");
}
