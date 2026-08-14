/**
 * Copies shared repo assets into this take's public/ directory before every
 * dev and build run, so the take never keeps a drifting private copy.
 *
 * - The token file is copied verbatim from assets/gmux-tokens.css. The site
 *   and the demo composition both read tokens from this one source.
 * - Brand images come from assets/brand/.
 * - The HyperFrames player and GSAP come from node_modules, pinned by
 *   package.json, and are served from this origin so the page makes no
 *   request to a third party CDN.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const take = resolve(here, "..");
const repo = resolve(take, "..", "..");

const copies = [
  // Tokens: one source of truth, two consumers (site CSS import + demo iframe).
  [join(repo, "assets/gmux-tokens.css"), join(take, "public/demos/durable-session/tokens.css")],
  // Brand. The hero mark itself is public/brand/tortie-mark-560.webp, a
  // committed 12 KB derivative of assets/brand/master/tortie-master-1024.png.
  [join(repo, "assets/brand/web/favicon-32.png"), join(take, "public/brand/favicon-32.png")],
  [join(repo, "assets/brand/web/favicon-16.png"), join(take, "public/brand/favicon-16.png")],
  [join(repo, "assets/brand/web/apple-touch-icon-180.png"), join(take, "public/brand/apple-touch-icon-180.png")],
  // Self hosted player and GSAP.
  [join(take, "node_modules/@hyperframes/player/dist/hyperframes-player.global.js"), join(take, "public/vendor/hyperframes-player.global.js")],
  [join(take, "node_modules/gsap/dist/gsap.min.js"), join(take, "public/demos/durable-session/gsap.min.js")],
];

for (const [from, to] of copies) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
console.log(`synced ${copies.length} shared assets`);
