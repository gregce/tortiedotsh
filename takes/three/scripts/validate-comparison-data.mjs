#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  comparisonCategories,
  comparisonProducts,
} from "../src/data/comparison-catalog.ts";

const args = new Set(process.argv.slice(2));
const supportedArgs = new Set(["--freshness"]);
for (const argument of args) {
  if (!supportedArgs.has(argument)) throw new Error(`Unknown argument: ${argument}`);
}
const auditFreshness = args.has("--freshness");
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_EVIDENCE_AGE_DAYS = 120;
const MAX_ASSET_AGE_DAYS = 180;
const MAX_METRICS_AGE_DAYS = 14;

const takeRoot = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  await readFile(resolve(takeRoot, "src/data/open-source-projects.json"), "utf8"),
);
const metrics = JSON.parse(
  await readFile(resolve(takeRoot, "src/data/open-source-metrics.json"), "utf8"),
);
const assets = JSON.parse(
  await readFile(resolve(takeRoot, "src/data/comparison-assets.json"), "utf8"),
);
const evidenceStatus = JSON.parse(
  await readFile(resolve(takeRoot, "src/data/comparison-evidence-status.json"), "utf8"),
);

const failures = [];
const catalogEvidenceUrls = new Set();
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const dateAgeDays = (value) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? (Date.now() - timestamp) / DAY_MS : Number.POSITIVE_INFINITY;
};

const checkEvidence = (evidence, owner) => {
  for (const item of evidence) {
    catalogEvidenceUrls.add(item.url);
    check(/^https:\/\//.test(item.url), `${owner} evidence needs an HTTPS source URL.`);
    check(/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt), `${owner} evidence needs a YYYY-MM-DD checkedAt date.`);
    if (auditFreshness) {
      check(
        dateAgeDays(item.checkedAt) <= MAX_EVIDENCE_AGE_DAYS,
        `${owner} evidence is older than ${MAX_EVIDENCE_AGE_DAYS} days; re-check the first-party source.`,
      );
    }
  }
};

const unique = (items) => new Set(items).size === items.length;
const categoryIds = comparisonCategories.map((category) => category.id);
const productIds = comparisonProducts.map((product) => product.id);
const manifestIds = manifest.projects.map((project) => project.id);
const metricIds = metrics.projects.map((project) => project.id);
const manifestIdSet = new Set(manifestIds);
const manifestById = new Map(manifest.projects.map((project) => [project.id, project]));
const evidenceBacklog = new Set(["mosaic-terminal", "airport", "muse-code", "omnara"]);
const publicProductIds = comparisonProducts
  .filter((product) => !evidenceBacklog.has(product.id))
  .map((product) => product.id);

check(comparisonCategories.length === 8, "The catalog must contain exactly eight comparison categories.");
check(comparisonProducts.length >= 50, "The research catalog may not shrink below its 50-product launch baseline.");
check(unique(categoryIds), "Category IDs must be unique.");
check(unique(productIds), "Product IDs must be unique.");
check(unique(manifestIds), "Metrics manifest IDs must be unique.");
check(unique(metricIds), "Generated metrics IDs must be unique.");
check(
  metricIds.every((id) => manifestIdSet.has(id)),
  "Generated metrics may not contain IDs absent from the manifest.",
);

for (const category of comparisonCategories) {
  const products = comparisonProducts.filter((product) => product.categoryId === category.id);
  check(products.length > 0, `${category.id} must contain at least one product.`);
  check(
    unique(category.rows.map((row) => row.id)),
    `${category.id} row IDs must be unique within the category.`,
  );
  check(
    products.every((product, index) => product.editorialOrder === index + 1),
    `${category.id} editorial order must be sequential from one.`,
  );
}

for (const product of comparisonProducts) {
  check(categoryIds.includes(product.categoryId), `${product.id} uses an unknown category.`);
  if (product.repoMetricId) {
    check(
      manifestIdSet.has(product.repoMetricId),
      `${product.id} joins missing metrics manifest ID ${product.repoMetricId}.`,
    );
    const metricProject = manifestById.get(product.repoMetricId);
    if (metricProject && product.repository?.relationship === "product-source") {
      check(
        metricProject.githubUrl.toLowerCase() === product.repository.url.toLowerCase(),
        `${product.id} repository and metrics manifest coordinates disagree.`,
      );
    }
  }

  for (const [field, fact] of Object.entries(product.profile)) {
    checkEvidence(fact.evidence, `${product.id}.${field}`);
    if (fact.state === "known") {
      check(fact.evidence.length > 0, `${product.id}.${field} is known without evidence.`);
      check(
        fact.evidence.every((item) => item.basis !== "unverified"),
        `${product.id}.${field} is known from unverified evidence.`,
      );
    } else {
      check(fact.evidence.length === 0, `${product.id}.${field} is unknown but carries scoring evidence.`);
    }
  }

  const source = product.profile.source;
  if (
    source.state === "known" &&
    ["open-source", "source-available"].includes(source.value) &&
    product.repository?.relationship === "product-source"
  ) {
    check(Boolean(product.repoMetricId), `${product.id} has public product source but no metrics join.`);
  }

  for (const [rowId, claim] of Object.entries(product.claims)) {
    checkEvidence(claim.evidence, `${product.id}.${rowId}`);
    if (["unknown", "not-applicable"].includes(claim.state)) continue;
    check(claim.evidence.length > 0, `${product.id}.${rowId} is scored without evidence.`);
    check(
      claim.evidence.every((item) => !["unverified", "community-reported"].includes(item.basis)),
      `${product.id}.${rowId} is scored from inference or community evidence.`,
    );
    if (claim.state === "not-available") {
      check(
        claim.evidence.some((item) => ["reproduced", "source-inspected", "vendor-documented"].includes(item.basis)),
        `${product.id}.${rowId} says Not available without affirmative evidence.`,
      );
    }
  }
}

const evidenceStatusUrls = evidenceStatus.sources.map((source) => source.url);
check(evidenceStatus.schemaVersion === 1, "Evidence status must use schemaVersion 1.");
check(unique(evidenceStatusUrls), "Evidence status URLs must be unique.");
check(unique(evidenceStatus.sources.map((source) => source.id)), "Evidence status IDs must be unique.");
check(
  evidenceStatusUrls.every((url) => catalogEvidenceUrls.has(url)) &&
    [...catalogEvidenceUrls].every((url) => evidenceStatusUrls.includes(url)),
  "Evidence status must exactly cover every catalog evidence URL.",
);
for (const source of evidenceStatus.sources) {
  check(/^https:\/\//.test(source.url), `${source.id} evidence monitor URL must use HTTPS.`);
  check(
    ["awaiting-refresh", "current", "changed", "unreachable"].includes(source.status),
    `${source.id} has an invalid evidence monitor status.`,
  );
  check(Array.isArray(source.usedBy) && source.usedBy.length > 0, `${source.id} must name its catalog consumers.`);
}

for (const record of metrics.projects) {
  const project = manifestById.get(record.id);
  if (!project) continue;
  check(
    record.owner.toLowerCase() === project.owner.toLowerCase() &&
      record.repo.toLowerCase() === project.repo.toLowerCase(),
    `${record.id} generated metrics identity is stale relative to the manifest.`,
  );
}

check(
  unique(Object.keys(assets.products)),
  "Comparison product asset IDs must be unique.",
);
check(
  publicProductIds.every((id) => assets.products[id]),
  "Every public comparison product must have a first-party identity asset.",
);
check(
  Object.keys(assets.products).every((id) => publicProductIds.includes(id)),
  "The identity asset manifest may not contain hidden or unknown product IDs.",
);
check(
  ["macos", "windows", "linux", "web", "ios", "android"].every((id) => assets.platforms[id]),
  "The platform asset manifest must cover every supported platform icon.",
);

if (auditFreshness) {
  check(
    dateAgeDays(metrics.generatedAt) <= MAX_METRICS_AGE_DAYS,
    `Open-source metrics are older than ${MAX_METRICS_AGE_DAYS} days; run refresh:metrics.`,
  );
  check(
    dateAgeDays(evidenceStatus.generatedAt) <= MAX_METRICS_AGE_DAYS,
    `Evidence monitoring data is older than ${MAX_METRICS_AGE_DAYS} days; run refresh:evidence.`,
  );
}

await Promise.all(
  [...Object.values(assets.products), ...Object.values(assets.platforms)].map(async (asset) => {
    check(asset.sourceUrl.startsWith("https://"), `${asset.src} needs an HTTPS provenance URL.`);
    check(
      asset.sourceType.startsWith("official-"),
      `${asset.src} must be sourced from a first-party vendor, project, or standards body.`,
    );
    check(/^\d{4}-\d{2}-\d{2}$/.test(asset.checkedAt), `${asset.src} needs a YYYY-MM-DD checkedAt date.`);
    if (auditFreshness) {
      check(
        dateAgeDays(asset.checkedAt) <= MAX_ASSET_AGE_DAYS,
        `${asset.src} is older than ${MAX_ASSET_AGE_DAYS} days; run refresh:assets and review the result.`,
      );
    }
    try {
      await access(resolve(takeRoot, "public", asset.src.replace(/^\//, "")));
    } catch {
      failures.push(`${asset.src} is referenced by the asset manifest but missing on disk.`);
    }
  }),
);

if (failures.length > 0) {
  console.error(`Comparison data validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Comparison data is valid: ${comparisonProducts.length} products, ${comparisonCategories.length} categories, ${manifest.projects.length} metrics repositories.${auditFreshness ? " Freshness windows pass." : ""}`,
  );
}
