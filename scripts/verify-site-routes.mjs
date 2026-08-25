import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const files = (await readdir(dist, { recursive: true }))
  .filter((file) => file.endsWith(".html"));

const pages = await Promise.all(files.map(async (file) => ({
  file,
  html: await readFile(join(dist.pathname, file), "utf8"),
})));

const pixelArtDirectory = new URL("../public/illustrations/pixel-tortie/", import.meta.url);
const pixelArtFiles = (await readdir(pixelArtDirectory)).sort();
assert.equal(pixelArtFiles.filter((file) => file.endsWith(".avif")).length, 10, "Expected ten AVIF Pixel Tortie assets.");
assert.equal(pixelArtFiles.filter((file) => file.endsWith(".webp")).length, 10, "Expected ten WebP Pixel Tortie fallbacks.");
for (const file of pixelArtFiles) {
  const asset = await stat(new URL(file, pixelArtDirectory));
  assert.ok(asset.size < 500 * 1024, `${file} is too large for the web at ${asset.size} bytes.`);
}

const sitePages = pages.filter(({ html }) => html.includes('aria-label="Primary"'));
const directDownloadUrl = "https://github.com/gregce/tortie/releases/latest/download/Tortie-arm64.dmg";
const socialImageUrl = "https://tortie.sh/og/tortie-og.png";
assert.ok(sitePages.length >= 20, `Expected the shared header on at least 20 pages; found ${sitePages.length}.`);

for (const { file, html } of sitePages) {
  assert.match(
    html,
    /href="\/compare\/agent-multiplexers\/"[^>]*>Compare</,
    `${file} does not send Compare to the agent multiplexer matrix.`,
  );
  assert.doesNotMatch(
    html,
    /href="\/compare\/"[^>]*>Compare</,
    `${file} still sends Compare to the legacy index route.`,
  );
  assert.match(
    html,
    /name="astro-view-transitions-enabled"/,
    `${file} is missing atomic client-side navigation.`,
  );
  assert.match(
    html,
    /animation: none/,
    `${file} can animate the full document during navigation.`,
  );
  assert.match(
    html,
    /class="nav-link nav-github"[^>]*aria-label="Tortie on GitHub, [\d,]+ stars?"/,
    `${file} is missing the shared GitHub mark and star count.`,
  );
  assert.ok(
    html.includes('href="' + directDownloadUrl + '"'),
    `${file} does not use the permanent direct macOS download.`,
  );
  assert.ok(html.includes("<vercel-analytics"), `${file} is missing Vercel Web Analytics.`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${file} is missing its search description.`);
  assert.match(html, /<meta property="og:site_name" content="Tortie"/, `${file} is missing the Tortie social identity.`);
  assert.ok(
    html.includes(`<meta property="og:image" content="${socialImageUrl}"`),
    `${file} is missing the canonical Tortie social image.`,
  );
  assert.match(html, /<meta property="og:image:alt" content="[^"]+"/, `${file} is missing social image alt text.`);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `${file} is missing its large Twitter card.`);
  assert.ok(
    html.includes(`<meta name="twitter:image" content="${socialImageUrl}"`),
    `${file} is missing the canonical Twitter image.`,
  );
  assert.match(html, /<link rel="canonical" href="https:\/\/tortie\.sh\//, `${file} is missing its production canonical URL.`);
}

const readPage = (path) => readFile(new URL(path, dist), "utf8");
const [canonical, compareIndex, legacy, home, docsHome, comparisonScript, comparisonCss] = await Promise.all([
  readPage("compare/agent-multiplexers/index.html"),
  readPage("compare/index.html"),
  readPage("compare/agent-ides/index.html"),
  readPage("index.html"),
  readPage("docs/index.html"),
  readFile(new URL("../src/scripts/comparison.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/comparison.css", import.meta.url), "utf8"),
]);

assert.match(canonical, /<title>Agent Multiplexers comparison · Tortie<\/title>/);
assert.match(canonical, /rel="canonical" href="https:\/\/tortie\.sh\/compare\/agent-multiplexers\/"/);
for (const [name, html] of [["comparison index", compareIndex], ["legacy agent IDE route", legacy]]) {
  assert.match(html, /url=\/compare\/agent-multiplexers\//, `${name} does not redirect to the canonical route.`);
  assert.match(html, /name="robots" content="noindex"/, `${name} redirect can be indexed.`);
}

assert.match(home, /<title>Tortie \| One window for every coding agent<\/title>/);
assert.match(
  home,
  /A calm agent multiplexer with familiar IDE features\. Keep coding-agent sessions across projects in one window, even after Tortie quits\./,
  "The homepage metadata is missing the concise product position.",
);
assert.match(home, /"@type":"SoftwareApplication"/, "The homepage is missing SoftwareApplication structured data.");
for (const art of ["03-one-project-window-wide", "04-what-needs-you-square", "05-restore-conversation-square", "09-open-source-grove-wide"]) {
  assert.ok(home.includes(`/illustrations/pixel-tortie/${art}.avif`), `The homepage is missing ${art}.avif.`);
  assert.ok(home.includes(`/illustrations/pixel-tortie/${art}.webp`), `The homepage is missing ${art}.webp.`);
}
assert.ok(docsHome.includes("/illustrations/pixel-tortie/10-mascot-accent-square.avif"), "The docs rail is missing its small Pixel Tortie accent.");
assert.doesNotMatch(home + docsHome, /\/illustrations\/pixel-tortie\/[^\"']+\.png/, "A full-resolution Pixel Tortie master is being served to visitors.");
assert.match(
  home,
  /A calm agent multiplexer with familiar IDE features\. Every project and coding-agent session lives in one window, but the work keeps running outside it\./,
  "The homepage is missing the approved product explanation.",
);
assert.match(home, /macOS 15\.7\.9 or later · Apple silicon/);
assert.match(home, /tortie-hero-1280\.avif 1280w, \/marketing\/tortie-hero-1920\.avif 1920w/);
assert.match(home, /class="download-actions"/, "The homepage close is missing its shared action row.");
assert.doesNotMatch(home, /grid-template-areas:"copy blank"/, "The homepage close still uses the fragile named-area layout.");
assert.ok(
  home.split('href="' + directDownloadUrl + '"').length - 1 >= 3,
  "The homepage download actions do not all use the permanent direct URL.",
);
assert.doesNotMatch(
  home,
  /href="https:\/\/github\.com\/gregce\/tortie\/releases\/latest"/,
  "A homepage download still opens the GitHub release page.",
);

assert.match(
  comparisonScript,
  /root\.dataset\.enhanced = ""/,
  "Comparison controls are not enhanced on their persistent page root.",
);
assert.doesNotMatch(
  comparisonCss,
  /\.js\s+\.(?:workspace-action|matrix-toolbar|matrix-rail)/,
  "Comparison controls still depend on a transient document-level .js class.",
);
assert.match(
  comparisonCss,
  /\[data-comparison-root\]\[data-enhanced\] \.workspace-action/,
  "Fullscreen and filter actions are not anchored to persistent comparison state.",
);

console.log(`Site routes verified: ${sitePages.length} shared headers with GitHub stars, direct downloads, and Vercel Analytics; 10 responsive Pixel Tortie illustrations; atomic navigation, canonical comparison redirects, hero copy, stable closing actions, and persistent comparison controls.`);
