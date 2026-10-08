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
assert.equal(pixelArtFiles.filter((file) => file.endsWith(".avif")).length, 13, "Expected thirteen AVIF Pixel Tortie assets.");
assert.equal(pixelArtFiles.filter((file) => file.endsWith(".webp")).length, 13, "Expected thirteen WebP Pixel Tortie fallbacks.");
for (const file of pixelArtFiles) {
  const asset = await stat(new URL(file, pixelArtDirectory));
  assert.ok(asset.size < 500 * 1024, `${file} is too large for the web at ${asset.size} bytes.`);
}

const sitePages = pages.filter(({ html }) => html.includes('aria-label="Primary"'));
const directDownloadUrl = "https://github.com/gregce/tortie/releases/latest/download/Tortie-arm64.dmg";
const socialImageUrl = "https://tortie.sh/og/tortie-og.png";
assert.ok(sitePages.length >= 20, `Expected the shared header on at least 20 pages; found ${sitePages.length}.`);

// The privacy and support pages (Tortie Phase 333.5). The
// privacy page says the site counts page views, both included, so they
// carry Vercel Web Analytics like every other shared page.
const plainPages = [
  { route: "privacy", file: "privacy/index.html" },
  { route: "support", file: "support/index.html" },
];

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
const [canonical, compareIndex, legacy, home, demoPage, docsHome, whatTortieIs, changelogPage, heroSource, comparisonScript, comparisonCss] = await Promise.all([
  readPage("compare/agent-multiplexers/index.html"),
  readPage("compare/index.html"),
  readPage("compare/agent-ides/index.html"),
  readPage("index.html"),
  readPage("demo/index.html"),
  readPage("docs/index.html"),
  readPage("docs/what-tortie-is/index.html"),
  readPage("docs/changelog/index.html"),
  readFile(new URL("../src/components/Hero.astro", import.meta.url), "utf8"),
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
for (const art of [
  "09-open-source-grove-wide",
]) {
  assert.ok(home.includes(`/illustrations/pixel-tortie/${art}.avif`), `The homepage is missing ${art}.avif.`);
  assert.ok(home.includes(`/illustrations/pixel-tortie/${art}.webp`), `The homepage is missing ${art}.webp.`);
}
for (const demoAsset of [
  "/demos/one-project-window/poster.webp",
  "/demos/one-project-window/one-project-window.webm",
  "/demos/one-project-window/one-project-window.mp4",
  "/demos/intuitive-multiplexing/poster.webp",
  "/demos/intuitive-multiplexing/intuitive-multiplexing.webm",
  "/demos/intuitive-multiplexing/intuitive-multiplexing.mp4",
  "/demos/resume-conversation/poster.webp",
  "/demos/resume-conversation/resume-conversation.webm",
  "/demos/resume-conversation/resume-conversation.mp4",
  "/demos/notifications/poster.webp",
  "/demos/notifications/notifications.webm",
  "/demos/notifications/notifications.mp4",
  "/demos/catch-me-up/poster.webp",
  "/demos/catch-me-up/catch-me-up.webm",
  "/demos/catch-me-up/catch-me-up.mp4",
]) {
  assert.ok(home.includes(demoAsset), `The homepage is missing the feature demo asset ${demoAsset}.`);
}
const fitCheckPosition = home.indexOf("data-fit-check");
const projectWindowPosition = home.indexOf('id="one-project-window"');
const multiplexingPosition = home.indexOf('id="intuitive-multiplexing"');
const attentionPosition = home.indexOf('id="needs-you"');
const catchUpPosition = home.indexOf('id="catch-me-up"');
const destinationsPosition = home.indexOf('class="destinations"');
assert.ok(fitCheckPosition >= 0, "The homepage is missing the Tortie fit check.");
assert.ok(projectWindowPosition >= 0, "One project window is missing from the homepage.");
assert.ok(multiplexingPosition > projectWindowPosition, "Intuitive multiplexing does not follow One project window.");
assert.ok(attentionPosition > multiplexingPosition, "The feature sequence ends before the attention proof.");
assert.ok(catchUpPosition > attentionPosition, "Catch Me Up does not follow the attention proof.");
assert.ok(fitCheckPosition > catchUpPosition, "The feature sequence is not immediately below the hero and before the fit check.");
assert.ok(destinationsPosition > fitCheckPosition, "The fit check does not immediately precede the final destination row.");
assert.doesNotMatch(home, /id="survive-quit"/, "The superseded Survive quit demo is still rendered on the homepage.");
const routeMarks = [
  ["Compare", canonical, "11-compare-icon-square", ["12-docs-icon-square", "13-changelog-icon-square"]],
  ["Docs", docsHome, "12-docs-icon-square", ["11-compare-icon-square", "13-changelog-icon-square"]],
  ["Changelog", changelogPage, "13-changelog-icon-square", ["11-compare-icon-square", "12-docs-icon-square"]],
];
for (const [route, html, expectedMark, unexpectedMarks] of routeMarks) {
  assert.ok(html.includes(`/illustrations/pixel-tortie/${expectedMark}.avif`), `${route} is missing its route-specific AVIF nav mark.`);
  assert.ok(html.includes(`/illustrations/pixel-tortie/${expectedMark}.webp`), `${route} is missing its route-specific WebP nav mark.`);
  for (const unexpectedMark of unexpectedMarks) {
    assert.ok(!html.includes(unexpectedMark), `${route} includes the ${unexpectedMark} mark from another route.`);
  }
}
assert.match(home, /class="nav-mark nav-default-mark"/, "The homepage no longer uses the standard Tortie mark.");
assert.doesNotMatch(home, /(?:11-compare|12-docs|13-changelog)-icon-square/, "Route-specific marks are still displayed in the homepage destination cards.");
assert.ok(whatTortieIs.includes("/illustrations/pixel-tortie/10-mascot-accent-square.avif"), "Behind the name is missing its Pixel Tortie illustration.");
assert.match(changelogPage, /class="release-contributors"/, "The changelog is missing its contributor section.");
assert.match(changelogPage, /href="https:\/\/github\.com\/jakehildreth"/, "The changelog does not link its named contributor to GitHub.");
assert.match(changelogPage, /jakehildreth\.png\?size=64/, "The changelog contributor does not carry a sized GitHub avatar.");
assert.doesNotMatch(docsHome + whatTortieIs, /docs-sidebar-mascot/, "The Pixel Tortie accent is still trapped in the docs navigation rail.");
assert.doesNotMatch(home + docsHome, /\/illustrations\/pixel-tortie\/[^\"']+\.png/, "A full-resolution Pixel Tortie master is being served to visitors.");
assert.match(
  home,
  /A calm agent multiplexer with familiar IDE features\. Every project and coding-agent session lives in one window, but the work keeps running outside it\./,
  "The homepage is missing the approved product explanation.",
);
assert.match(home, /macOS 15\.7\.9 or later · Apple silicon/);
assert.match(home, /tortie-hero-1280\.avif 1280w, \/marketing\/tortie-hero-1920\.avif 1920w/);
assert.match(
  heroSource,
  /classList\.toggle\("is-live", frameReady && theaterOpen\)/,
  "The hero demo can remain live after its theater closes.",
);
assert.match(
  heroSource,
  /theaterOpen = false;\s+maybeReveal\(\);/,
  "Closing the hero demo does not restore the static poster.",
);
for (const control of ["demo-close", "demo-minimize", "demo-maximize"]) {
  assert.ok(home.includes(`id="${control}"`), `The hero demo is missing its ${control} window control.`);
}
assert.match(heroSource, /sendDirective\("new-session"\)/, "The hero demo does not route its new-session shortcut into Tortie.");
assert.match(heroSource, /keyboard\?\.lock\?\.\(\["KeyT"\]\)/, "The full-screen hero demo does not request Command T keyboard lock.");
assert.match(heroSource, /e\.key === "Escape" && theaterOpen\) closeTheater\(\)/, "Escape does not close the hero demo.");
assert.match(heroSource, /fullscreenchange[\s\S]+closeTheater\(\)/, "Leaving full screen does not close the hero demo.");
assert.doesNotMatch(home + demoPage, /—/, "The live demo surfaces still contain an em dash.");
assert.match(home, /class="download-actions"/, "The homepage close is missing its shared action row.");
assert.match(home, /Free under the Apache 2\.0 license and built in public\./, "The open-source close is missing its concise license copy.");
assert.doesNotMatch(home, /Star on GitHub/, "The open-source close still contains the redundant GitHub button.");
assert.match(home, /class="footer-github"[^>]*aria-label="Tortie on GitHub, [\d,]+ stars?"/, "The footer is missing the GitHub star count.");
assert.doesNotMatch(home, /footer-lockup/, "The redundant Tortie lockup is still present in the footer.");
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

// ── Privacy and support (Tortie Phase 333.5) ────────────────────────────
// Both must be built, listed in the sitemap, reachable from every footer, and
// collect nothing but page views. Apple requires the privacy and support links
// for every app. The Tortie for iPhone page follows on release day.
const footerPages = pages.filter(({ html }) => html.includes('aria-label="Footer"'));
assert.ok(footerPages.length >= 20, `Expected the footer on at least 20 pages; found ${footerPages.length}.`);
for (const { file, html } of footerPages) {
  assert.match(html, /href="\/privacy\/"[^>]*>Privacy</, `${file} is missing the footer's Privacy link.`);
  assert.match(html, /href="\/support\/"[^>]*>Support</, `${file} is missing the footer's Support link.`);
}

const sitemapFiles = (await readdir(dist)).filter((file) => /^sitemap-\d+\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, "The build wrote no sitemap.");
const sitemap = (await Promise.all(sitemapFiles.map((file) => readPage(file)))).join("\n");

const builtPlain = {};
for (const { route, file } of plainPages) {
  const html = await readPage(file).catch(() => null);
  assert.ok(html !== null, `/${route}/ was not built: ${file} is missing from dist.`);
  builtPlain[route] = html;
  assert.ok(sitemap.includes(`<loc>https://tortie.sh/${route}/</loc>`), `/${route}/ is missing from the sitemap.`);
  assert.ok(
    html.includes(`<link rel="canonical" href="https://tortie.sh/${route}/"`),
    `/${route}/ is missing its canonical URL.`,
  );
  assert.match(html, /aria-label="Primary"/, `/${route}/ is missing the shared header.`);
  assert.match(html, /aria-label="Footer"/, `/${route}/ is missing the shared footer.`);
  assert.ok(html.includes("<vercel-analytics"), `/${route}/ is missing Vercel Web Analytics, which the privacy page says it counts with.`);
  assert.doesNotMatch(html, /<(?:form|input|textarea|select)\b/i, `/${route}/ has a form or a field.`);
  assert.doesNotMatch(html, /document\.cookie/, `/${route}/ sets a cookie.`);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.ok(main.length > 0, `/${route}/ has no main content.`);
  assert.doesNotMatch(main, /[A-Za-z]<a /, `/${route}/ runs a word into a link: the build dropped the space before it.`);
  const words = main.replace(/<[^>]+>/g, " ");
  // What search results and link previews show: the title, and the content of
  // the description, og: and twitter: meta tags.
  const titleText = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  assert.ok(titleText.length > 0, `/${route}/ has no <title>.`);
  const metaText = [
    ...html.matchAll(/<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"\s+content="([^"]*)"/g),
  ].map((match) => match[1]);
  assert.ok(metaText.length >= 3, `/${route}/ has fewer than three description, og: or twitter: tags.`);
  const shown = [titleText, ...metaText].join("\n");
  for (const [pattern, name] of [
    [/\bbeta\b/i, "beta"],
    [/remote desktop/i, "remote desktop"],
    [/\bmirror/i, "mirror"],
    [/\bstream/i, "stream"],
    [/\bSSH\b/i, "SSH"],
  ]) {
    assert.doesNotMatch(words, pattern, `/${route}/ says "${name}", which his ruling of 2026-10-07 refuses.`);
    assert.doesNotMatch(
      shown,
      pattern,
      `/${route}/ says "${name}" in its title or a description, og: or twitter: tag, which his ruling of 2026-10-07 refuses.`,
    );
  }
}

assert.ok(
  builtPlain.privacy.includes('href="mailto:support@tortie.sh"'),
  "The privacy page does not give the support mailbox.",
);
assert.match(builtPlain.privacy, /Last updated \d{1,2} [A-Z][a-z]+ \d{4}/, "The privacy page has no Last updated date.");
assert.match(builtPlain.privacy, /Ita Vero, LLC/, "The privacy page does not name who makes Tortie.");
assert.ok(
  builtPlain.support.includes('href="mailto:support@tortie.sh"'),
  "The support page does not lead with the support mailbox.",
);
assert.ok(
  builtPlain.support.includes('href="https://github.com/gregce/tortie/issues"'),
  "The support page does not link Tortie for Mac's issues.",
);

console.log(`Site routes verified: ${sitePages.length} shared headers with GitHub stars, direct downloads, and Vercel Analytics; 13 responsive Pixel Tortie illustrations; atomic navigation, canonical comparison redirects, hero copy, stable closing actions, and persistent comparison controls; privacy and support pages built, in the sitemap, in ${footerPages.length} footers, with no form, field or cookie.`);
