import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const files = (await readdir(dist, { recursive: true }))
  .filter((file) => file.endsWith(".html"));

const pages = await Promise.all(files.map(async (file) => ({
  file,
  html: await readFile(join(dist.pathname, file), "utf8"),
})));

const sitePages = pages.filter(({ html }) => html.includes('aria-label="Primary"'));
const directDownloadUrl = "https://github.com/gregce/tortie/releases/latest/download/Tortie-arm64.dmg";
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
}

const readPage = (path) => readFile(new URL(path, dist), "utf8");
const [canonical, compareIndex, legacy, home, comparisonScript, comparisonCss] = await Promise.all([
  readPage("compare/agent-multiplexers/index.html"),
  readPage("compare/index.html"),
  readPage("compare/agent-ides/index.html"),
  readPage("index.html"),
  readFile(new URL("../src/scripts/comparison.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/comparison.css", import.meta.url), "utf8"),
]);

assert.match(canonical, /<title>Agent Multiplexers comparison · Tortie<\/title>/);
assert.match(canonical, /rel="canonical" href="https:\/\/tortie\.sh\/compare\/agent-multiplexers\/"/);
for (const [name, html] of [["comparison index", compareIndex], ["legacy agent IDE route", legacy]]) {
  assert.match(html, /url=\/compare\/agent-multiplexers\//, `${name} does not redirect to the canonical route.`);
  assert.match(html, /name="robots" content="noindex"/, `${name} redirect can be indexed.`);
}

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

console.log(`Site routes verified: ${sitePages.length} shared headers with GitHub stars, direct downloads, and Vercel Analytics; atomic navigation, canonical comparison redirects, hero copy, responsive product still, stable closing actions, and persistent comparison controls.`);
