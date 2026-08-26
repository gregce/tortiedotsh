#!/usr/bin/env node

import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const registryPath = resolve(root, "src/data/comparison-evidence-status.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const knownStatuses = ["current", "changed", "unreachable", "awaiting-refresh"];
const counts = Object.fromEntries(knownStatuses.map((status) => [status, 0]));

for (const source of registry.sources ?? []) {
  counts[source.status] = (counts[source.status] ?? 0) + 1;
}

const needsReview = (registry.sources ?? []).filter((source) => source.status === "changed");
const unavailable = (registry.sources ?? []).filter((source) =>
  source.status === "unreachable" || source.status === "awaiting-refresh");
const summary = [
  "## Comparison evidence monitor",
  "",
  `Checked ${registry.sources?.length ?? 0} first-party sources at ${registry.generatedAt ?? "an unknown time"}.`,
  "",
  "| Status | Sources |",
  "| --- | ---: |",
  ...knownStatuses.map((status) => `| ${status} | ${counts[status]} |`),
  "",
];

if (needsReview.length > 0) {
  summary.push(
    `### ${needsReview.length} source${needsReview.length === 1 ? "" : "s"} need review`,
    "",
    ...needsReview.slice(0, 20).map((source) => `- ${source.url}`),
    ...(needsReview.length > 20 ? [`- …and ${needsReview.length - 20} more in \`src/data/comparison-evidence-status.json\`.`] : []),
    "",
  );
  console.log(`::warning title=Comparison evidence needs review::${needsReview.length} first-party sources changed after their latest recorded review.`);
}

if (unavailable.length > 0) {
  summary.push(
    `### ${unavailable.length} source${unavailable.length === 1 ? "" : "s"} could not be checked`,
    "",
    ...unavailable.slice(0, 20).map((source) => `- ${source.status}: ${source.url}${source.error ? ` (${source.error})` : ""}`),
    ...(unavailable.length > 20 ? [`- …and ${unavailable.length - 20} more in \`src/data/comparison-evidence-status.json\`.`] : []),
    "",
  );
  console.log(`::warning title=Comparison evidence unavailable::${unavailable.length} first-party sources could not be checked.`);
}

const renderedSummary = `${summary.join("\n")}\n`;
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, renderedSummary, "utf8");
} else {
  console.log(renderedSummary);
}
