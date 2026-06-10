// ─────────────────────────────────────────────────────────────
// GitHub commit-on-save backend (git-based CMS, no database).
//
// When GITHUB_TOKEN + GITHUB_REPO are set, the admin editor commits
// content.json and uploaded files directly to the repo via the
// GitHub Contents API. Vercel then auto-redeploys, so the saved
// changes become the "real code" and go live (~1 min).
//
// On localhost (env not set) the app falls back to the filesystem,
// see lib/store.ts.
// ─────────────────────────────────────────────────────────────

const TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = process.env.GITHUB_REPO || ""; // "owner/repo"
const BRANCH = process.env.GITHUB_BRANCH || "main";

export function githubEnabled(): boolean {
  return !!(TOKEN && REPO);
}

const API = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "elsaco-editor",
  };
}

/** Get the current blob SHA of a file (needed to update it), or null. */
async function getSha(path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getSha ${res.status}`);
  const json = await res.json();
  return json.sha ?? null;
}

/** Create or update a file in the repo. contentBase64 = file bytes in base64. */
export async function putFile(path: string, contentBase64: string, message: string): Promise<void> {
  const sha = await getSha(path);
  const res = await fetch(`${API}/repos/${REPO}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contentBase64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub putFile ${res.status}: ${text}`);
  }
}

/** Read a text file from the repo (latest committed version). */
export async function getFileText(path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFileText ${res.status}`);
  const json = await res.json();
  if (!json.content) return null;
  return Buffer.from(json.content, "base64").toString("utf-8");
}
