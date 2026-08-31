import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const has = (name) => args.includes(name);
const siteUrl = flag("--url", "https://tortie.sh").replace(/\/$/, "");
const label = flag("--label", new Date().toISOString().replace(/[:.]/g, "-"));
const outputRoot = resolve(flag("--output", join(".audit", "site-quality", label)));
const distRoot = resolve("dist");

if (!existsSync(distRoot)) {
  throw new Error("dist/ is missing. Run npm run build before npm run audit:site.");
}

mkdirSync(outputRoot, { recursive: true });

const walkHtml = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return walkHtml(path);
  return entry.name.endsWith(".html") ? [path] : [];
});

const pages = walkHtml(distRoot).map((path) => {
  const html = readFileSync(path, "utf8");
  const relativePath = relative(distRoot, path);
  const isRedirect = /<meta http-equiv="refresh"/i.test(html);
  const isEmbed = relativePath.startsWith("demos/");
  return {
    path: relativePath,
    kind: isRedirect ? "redirect" : isEmbed ? "embed" : "page",
    title: /<title>[^<]+<\/title>/.test(html),
    description: /<meta name="description" content="[^"]+"/.test(html),
    canonical: /<link rel="canonical" href="https:\/\/tortie\.sh\/[^"]*"/.test(html),
    h1: /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/.test(html),
  };
});

const staticChecks = {
  generatedPages: pages.length,
  pages,
  missingMetadata: pages.filter((page) => page.kind === "page" && (!page.title || !page.description || !page.canonical || !page.h1)),
  robots: existsSync(join(distRoot, "robots.txt")),
  llms: existsSync(join(distRoot, "llms.txt")),
  sitemap: existsSync(join(distRoot, "sitemap-index.xml")),
  custom404: existsSync(join(distRoot, "404.html")),
};
writeFileSync(join(outputRoot, "static.json"), JSON.stringify(staticChecks, null, 2));

const runJson = (command, commandArgs, filename) => {
  try {
    const output = execFileSync(command, commandArgs, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
    writeFileSync(join(outputRoot, filename), output);
    return { ok: true, file: filename };
  } catch (error) {
    const output = String(error.stdout || error.stderr || error.message);
    writeFileSync(join(outputRoot, filename.replace(/\.json$/, ".error.txt")), output);
    return { ok: false, error: output.slice(0, 300) };
  }
};

const readJsonIfExists = (filename) => {
  const path = join(outputRoot, filename);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
};

const remote = {};
if (!has("--skip-remote")) {
  remote.agentic = runJson("npx", ["--yes", "is-agentic@1.0.1", siteUrl, "--json"], "is-agentic.json");
  for (const strategy of ["mobile", "desktop"]) {
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", siteUrl);
    endpoint.searchParams.set("strategy", strategy);
    endpoint.searchParams.append("category", "performance");
    endpoint.searchParams.append("category", "seo");
    if (process.env.PAGESPEED_API_KEY) endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY);
    remote[`pagespeed-${strategy}`] = runJson("curl", ["--fail", "--silent", "--show-error", endpoint.href], `pagespeed-${strategy}.json`);
  }
}

if (!has("--skip-lighthouse")) {
  for (const formFactor of ["mobile", "desktop"]) {
    const flags = formFactor === "desktop" ? ["--preset=desktop"] : [];
    remote[`lighthouse-${formFactor}`] = runJson("npx", [
      "--yes",
      "lighthouse@13.0.1",
      siteUrl,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox",
      "--output=json",
      "--output-path=stdout",
      "--only-categories=performance,seo,accessibility,best-practices",
      ...flags,
    ], `lighthouse-${formFactor}.json`);
  }
}

const agenticReport = readJsonIfExists("is-agentic.json");
const lighthouseScores = Object.fromEntries(["mobile", "desktop"].map((formFactor) => {
  const report = readJsonIfExists(`lighthouse-${formFactor}.json`);
  return [formFactor, report ? {
    performance: report.categories?.performance?.score ?? null,
    seo: report.categories?.seo?.score ?? null,
    accessibility: report.categories?.accessibility?.score ?? null,
    bestPractices: report.categories?.["best-practices"]?.score ?? null,
    fcpMs: report.audits?.["first-contentful-paint"]?.numericValue ?? null,
    lcpMs: report.audits?.["largest-contentful-paint"]?.numericValue ?? null,
    tbtMs: report.audits?.["total-blocking-time"]?.numericValue ?? null,
    cls: report.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
  } : null];
}));
const pageSpeedScores = Object.fromEntries(["mobile", "desktop"].map((strategy) => {
  const report = readJsonIfExists(`pagespeed-${strategy}.json`);
  return [strategy, report?.lighthouseResult?.categories ? {
    performance: report.lighthouseResult.categories.performance?.score ?? null,
    seo: report.lighthouseResult.categories.seo?.score ?? null,
  } : null];
}));
const summary = {
  siteUrl,
  label,
  outputRoot,
  static: staticChecks,
  scores: {
    agentic: typeof agenticReport?.score === "number" ? agenticReport.score : null,
    lighthouse: lighthouseScores,
    pageSpeed: pageSpeedScores,
  },
  remote,
};
writeFileSync(join(outputRoot, "summary.json"), JSON.stringify(summary, null, 2));
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

const staticFailure = staticChecks.missingMetadata.length > 0
  || !staticChecks.robots
  || !staticChecks.llms
  || !staticChecks.sitemap
  || !staticChecks.custom404;
if (staticFailure) process.exitCode = 1;
