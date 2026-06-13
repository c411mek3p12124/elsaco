// Auto-detect sequence frames so there is NO hard limit on frame count.
// Theme-aware hero: public/sequence/dark + public/sequence/light → keys "dark"/"light".
// Also keeps the legacy flat public/sequence/*.img ("sequence") + any walk* folders.
// Writes public/sequences.json. Runs automatically before `dev` and `build`.
import { readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const PUB = join(process.cwd(), "public");
const IMG = /\.(png|jpe?g|webp|avif|gif)$/i;
const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const list = (rel) => {
  const dir = join(PUB, ...rel.split("/"));
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => IMG.test(f)).sort(nat).map((f) => `/${rel}/${f}`);
};

const out = {};

// Theme-aware hero frames.
for (const theme of ["dark", "light"]) {
  const frames = list(`sequence/${theme}`);
  if (frames.length) out[theme] = frames;
}

// Legacy flat sequence + walk* folders.
if (existsSync(PUB)) {
  for (const entry of readdirSync(PUB, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (!(name === "sequence" || /^walk/i.test(name))) continue;
    const files = list(name);
    if (files.length) out[name] = files;
  }
}

writeFileSync(join(PUB, "sequences.json"), JSON.stringify(out));
console.log(
  "[sequences] " + (Object.entries(out).map(([k, v]) => `${k}=${v.length}`).join(", ") || "no sequence folders found")
);
