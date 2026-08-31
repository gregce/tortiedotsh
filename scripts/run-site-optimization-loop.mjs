import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const valueFor = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const has = (name) => args.includes(name);
const label = valueFor("--label", new Date().toISOString().replace(/[:.]/g, "-"));
const url = valueFor("--url", "https://tortie.sh");
const output = resolve(valueFor("--output", `.audit/site-quality/${label}`));

const runNpm = (script, scriptArgs = []) => execFileSync("npm", ["run", script, ...(scriptArgs.length ? ["--", ...scriptArgs] : [])], {
  stdio: "inherit",
  maxBuffer: 50 * 1024 * 1024,
});

runNpm("verify");
if (!has("--skip-discovery")) runNpm("discover:comparison", ["--output", resolve(output, "comparison-candidates")]);
runNpm("audit:site", ["--url", url, "--label", label, "--output", output]);

const summaryPath = resolve(output, "summary.json");
if (!existsSync(summaryPath)) throw new Error(`Audit summary is missing: ${summaryPath}`);
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
const iteration = {
  completedAt: new Date().toISOString(),
  url,
  label,
  staticFailures: summary.static.missingMetadata.length,
  scores: summary.scores,
  pageSpeedApiAvailable: Object.values(summary.scores.pageSpeed).some(Boolean),
  notes: [
    "Google PageSpeed is authoritative when its API responds; set PAGESPEED_API_KEY when anonymous quota is exhausted.",
    "Local Lighthouse is the deterministic fallback and uses the same Lighthouse scoring engine.",
    "is-agentic includes API-oriented checks that are not applicable to a static macOS application website; do not publish fake API surfaces to raise its aggregate score.",
  ],
};
writeFileSync(resolve(output, "iteration.json"), `${JSON.stringify(iteration, null, 2)}\n`);
mkdirSync(resolve(".audit", "site-quality"), { recursive: true });
writeFileSync(resolve(".audit", "site-quality", "latest.json"), `${JSON.stringify(iteration, null, 2)}\n`);

process.stdout.write(`\nOptimization iteration ${label}\n${JSON.stringify(iteration, null, 2)}\n`);

if (has("--enforce")) {
  const mobile = iteration.scores.lighthouse.mobile;
  const desktop = iteration.scores.lighthouse.desktop;
  const failed = iteration.staticFailures > 0
    || !mobile || !desktop
    || mobile.performance < 0.85
    || desktop.performance < 0.9
    || mobile.seo < 0.95
    || desktop.seo < 0.95;
  if (failed) process.exitCode = 1;
}
