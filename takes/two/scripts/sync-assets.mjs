// Copies shared repo assets into public/ so the built site is self contained.
// The token file is copied verbatim. No token value is re-authored here.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const take = dirname(dirname(fileURLToPath(import.meta.url)));
const repo = join(take, "..", "..");

const copies = [
  // One source of truth for color: assets/gmux-tokens.css at the repo root.
  ["assets/gmux-tokens.css", "public/tokens.css"],
  // The composition runs in an iframe and is also rendered standalone by the
  // hyperframes CLI, so it needs the tokens beside it.
  ["assets/gmux-tokens.css", "public/demos/durable-session/tokens.css"],
  // GSAP is self hosted inside the composition. No CDN request at view time.
  ["node_modules/gsap/dist/gsap.min.js", "public/demos/durable-session/gsap.min.js"],
  // Brand assets.
  ["assets/brand/web/favicon-16.png", "public/brand/favicon-16.png"],
  ["assets/brand/web/favicon-32.png", "public/brand/favicon-32.png"],
  ["assets/brand/web/apple-touch-icon-180.png", "public/brand/apple-touch-icon-180.png"],
  ["assets/brand/dock/tortie-dock-64.png", "public/brand/tortie-mark-64.png"],
  ["assets/brand/dock/tortie-dock-256.png", "public/brand/tortie-mark-256.png"],
];

for (const [from, to] of copies) {
  const src = from.startsWith("node_modules/") ? join(take, from) : join(repo, from);
  const dest = join(take, to);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}
console.log(`synced ${copies.length} shared assets into public/`);
