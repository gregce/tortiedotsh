/**
 * Copies generated browser assets into public/ before development and builds.
 *
 * - The demo composition receives the same token file as the Astro app.
 * - The HyperFrames player and GSAP come from node_modules, pinned by
 *   package.json, and are served from this origin so the page makes no
 *   request to a third party CDN.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const project = resolve(here, "..");

const copies = [
  // Tokens: one source of truth, two consumers (site CSS import + demo iframe).
  [join(project, "src/styles/tokens.css"), join(project, "public/demos/durable-session/tokens.css")],
  // Self hosted player and GSAP.
  [join(project, "node_modules/@hyperframes/player/dist/hyperframes-player.global.js"), join(project, "public/vendor/hyperframes-player.global.js")],
  [join(project, "node_modules/gsap/dist/gsap.min.js"), join(project, "public/demos/durable-session/gsap.min.js")],
];

for (const [from, to] of copies) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
console.log(`synced ${copies.length} shared assets`);
