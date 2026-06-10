// Auto-detect sequence frames so there is NO hard limit on frame count.
// Scans public/ for the "sequence" folder and any "walk*" folders, lists the
// image files (natural-sorted), and writes public/sequences.json:
//   { "sequence": ["/sequence/001.png", ...] }
// Runs automatically before `dev` and `build` (see package.json).
import { readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

const PUB = join(process.cwd(), "public");
const IMG = /\.(png|jpe?g|webp|avif|gif)$/i;
const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const out = {};
if (existsSync(PUB)) {
  for (const entry of readdirSync(PUB, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const isSeq = name === "sequence" || /^walk/i.test(name);
    if (!isSeq) continue;
    const files = readdirSync(join(PUB, name)).filter((f) => IMG.test(f)).sort(nat);
    if (files.length) out[name] = files.map((f) => `/${name}/${f}`);
  }
}

writeFileSync(join(PUB, "sequences.json"), JSON.stringify(out));
console.log(
  "[sequences] " + (Object.entries(out).map(([k, v]) => `${k}=${v.length}`).join(", ") || "no sequence folders found")
);
