#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  comparisonCategories,
  comparisonProducts,
  getComparisonClaim,
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
const dataDirectory = resolve(takeRoot, "src/data");
const unknownAuditFileNames = (await readdir(dataDirectory))
  .filter((name) => name.startsWith("unknown-audit-") && name.endsWith(".json"))
  .sort();
const unknownAudits = await Promise.all(
  unknownAuditFileNames.map(async (fileName) => ({
    fileName,
    data: JSON.parse(await readFile(resolve(dataDirectory, fileName), "utf8")),
  })),
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
const manifestForge = (project) => project.forge || "github";
const manifestRepositoryUrl = (project) => project.repositoryUrl || project.githubUrl;
const evidenceBacklog = new Set(["mosaic-terminal", "airport", "muse-code", "omnara"]);
const publicProductIds = comparisonProducts
  .filter((product) => !evidenceBacklog.has(product.id))
  .map((product) => product.id);

const expectedUnknownKeysByCategory = new Map(
  comparisonCategories.map((category) => {
    const keys = [];
    for (const product of comparisonProducts.filter((item) => (
      item.categoryId === category.id && !evidenceBacklog.has(item.id)
    ))) {
      for (const row of category.rows) {
        if (!row.platform && getComparisonClaim(product, row).state === "unknown") {
          keys.push(`${category.id}:${product.id}:${row.id}`);
        }
      }
    }
    return [category.id, keys];
  }),
);

const auditedCategoryIds = [];
for (const { fileName, data } of unknownAudits) {
  check(data.schemaVersion === 1, `${fileName} must use schemaVersion 1.`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(data.checkedAt), `${fileName} needs a YYYY-MM-DD checkedAt date.`);
  check(Array.isArray(data.categories) && data.categories.length > 0, `${fileName} must contain category audits.`);

  let fileCellCount = 0;
  for (const categoryAudit of data.categories || []) {
    const { categoryId } = categoryAudit;
    auditedCategoryIds.push(categoryId);
    check(categoryIds.includes(categoryId), `${fileName} audits unknown category ${categoryId}.`);

    const actualKeys = [];
    for (const productAudit of categoryAudit.products || []) {
      check(
        Array.isArray(productAudit.sourcesChecked) && productAudit.sourcesChecked.length > 0 &&
          productAudit.sourcesChecked.every((url) => /^https:\/\//.test(url)),
        `${fileName} ${categoryId}:${productAudit.productId} needs exact HTTPS sourcesChecked.`,
      );
      for (const cell of productAudit.cells || []) {
        check(
          typeof cell.rationale === "string" && cell.rationale.trim().length > 0,
          `${fileName} ${categoryId}:${productAudit.productId}:${cell.rowId} needs its own rationale.`,
        );
        actualKeys.push(`${categoryId}:${productAudit.productId}:${cell.rowId}`);
      }
    }

    const expectedKeys = expectedUnknownKeysByCategory.get(categoryId) || [];
    const actualKeySet = new Set(actualKeys);
    const expectedKeySet = new Set(expectedKeys);
    const missing = expectedKeys.filter((key) => !actualKeySet.has(key));
    const extra = actualKeys.filter((key) => !expectedKeySet.has(key));
    check(unique(actualKeys), `${fileName} ${categoryId} contains duplicate Unknown keys.`);
    check(
      missing.length === 0 && extra.length === 0,
      `${fileName} ${categoryId} must exactly match rendered Unknowns (${missing.length} missing, ${extra.length} extra).`,
    );
    fileCellCount += actualKeys.length;
  }

  if (Number.isInteger(data.summary?.currentUnknownCells)) {
    check(
      data.summary.currentUnknownCells === fileCellCount,
      `${fileName} summary currentUnknownCells must equal its ${fileCellCount} audited cells.`,
    );
  }
}

check(unique(auditedCategoryIds), "Unknown audit ledgers may cover each category only once.");
check(
  categoryIds.every((id) => auditedCategoryIds.includes(id)) &&
    auditedCategoryIds.every((id) => categoryIds.includes(id)),
  "Unknown audit ledgers must cover every comparison category exactly once.",
);

check(comparisonCategories.length === 9, "The catalog must contain exactly nine comparison categories.");
check(comparisonProducts.length >= 50, "The research catalog may not shrink below its 50-product launch baseline.");
check(unique(categoryIds), "Category IDs must be unique.");
check(unique(productIds), "Product IDs must be unique.");
check(unique(manifestIds), "Metrics manifest IDs must be unique.");
check(unique(metricIds), "Generated metrics IDs must be unique.");
check(
  metricIds.every((id) => manifestIdSet.has(id)),
  "Generated metrics may not contain IDs absent from the manifest.",
);
check(
  manifestIds.every((id) => metricIds.includes(id)),
  "Every metrics manifest entry must have a generated record.",
);

for (const project of manifest.projects) {
  const forge = manifestForge(project);
  check(["github", "gitlab"].includes(forge), `${project.id} uses unsupported forge ${forge}.`);
  if (forge === "github") {
    check(
      project.githubUrl === `https://github.com/${project.owner}/${project.repo}` &&
        project.apiUrl === `https://api.github.com/repos/${project.owner}/${project.repo}`,
      `${project.id} GitHub URLs must exactly match its owner/repo coordinates.`,
    );
  } else if (forge === "gitlab") {
    const repositoryUrl = `https://gitlab.com/${project.owner}/${project.repo}`;
    check(
      project.repositoryUrl === repositoryUrl &&
        project.apiUrl === `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${project.owner}/${project.repo}`)}` &&
        project.cloneUrl === `${repositoryUrl}.git`,
      `${project.id} GitLab URLs must exactly match its owner/repo coordinates.`,
    );
  }
  if (project.metricScope !== undefined) {
    check(
      typeof project.metricScope === "string" && project.metricScope.trim().length > 0,
      `${project.id} metricScope must be a non-empty string when present.`,
    );
  }
  check(typeof project.loc?.enabled === "boolean", `${project.id} must declare whether LOC is enabled.`);
  if (project.loc?.enabled === false) {
    check(
      typeof project.loc.reason === "string" && project.loc.reason.trim().length > 0,
      `${project.id} must explain why LOC measurement is disabled.`,
    );
  }
  if (project.license?.components !== undefined) {
    check(
      typeof project.license.summary === "string" && project.license.summary.trim().length > 0,
      `${project.id} mixed-license override needs a summary.`,
    );
    check(
      Array.isArray(project.license.components) && project.license.components.length > 0,
      `${project.id} mixed-license override needs non-empty components.`,
    );
    for (const component of project.license.components || []) {
      check(
        ["spdxId", "name", "scope", "sourceUrl"].every((field) => (
          typeof component[field] === "string" && component[field].trim().length > 0
        )) && component.sourceUrl.startsWith("https://"),
        `${project.id} mixed-license components need SPDX/name/scope and HTTPS provenance.`,
      );
    }
  }
}

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
        manifestRepositoryUrl(metricProject).toLowerCase() === product.repository.url.toLowerCase(),
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
      record.repo.toLowerCase() === project.repo.toLowerCase() &&
      (record.forge || "github") === manifestForge(project) &&
      (record.repositoryUrl || record.githubUrl).toLowerCase() === manifestRepositoryUrl(project).toLowerCase() &&
      record.cloneUrl === (project.cloneUrl || `${manifestRepositoryUrl(project)}.git`) &&
      record.metricScope === (project.metricScope || null),
    `${record.id} generated metrics identity is stale relative to the manifest.`,
  );
  if (project.license?.components) {
    check(
      record.license?.summary === project.license.summary &&
        JSON.stringify(record.license?.components) === JSON.stringify(project.license.components),
      `${record.id} generated mixed-license scope is stale relative to the manifest.`,
    );
  }
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
  const unresolvedEvidence = evidenceStatus.sources.filter((source) =>
    source.status === "changed" ||
    (source.status !== "current" && dateAgeDays(source.latestReviewAt) > MAX_EVIDENCE_AGE_DAYS),
  );
  check(
    unresolvedEvidence.length === 0,
    `Evidence monitor has ${unresolvedEvidence.length} changed or review-expired source(s): ${unresolvedEvidence.slice(0, 12).map((source) => `${source.status} ${source.url}`).join("; ")}${unresolvedEvidence.length > 12 ? "; …" : ""}`,
  );

  for (const record of metrics.projects) {
    const project = manifestById.get(record.id);
    if (!project) continue;
    const owner = `Open-source metrics for ${record.id}`;
    const sourceTypes = new Set((record.sources || []).map((item) => item.type));
    const gaps = [];
    const requireField = (condition, label) => {
      if (!condition) gaps.push(label);
    };

    requireField(record.status === "current", `status=${record.status || "missing"}`);
    requireField(Array.isArray(record.errors) && record.errors.length === 0, "refresh errors");
    requireField(dateAgeDays(record.refreshedAt) <= MAX_METRICS_AGE_DAYS, "fresh per-project timestamp");
    requireField(Number.isInteger(record.stars) && record.stars >= 0, "stars");
    requireField(Number.isInteger(record.forks) && record.forks >= 0, "forks");
    requireField(Number.isInteger(record.openIssues) && record.openIssues >= 0, "open issues");
    requireField(Number.isInteger(record.contributors) && record.contributors >= 0, "contributors");
    requireField(Number.isInteger(record.repositorySizeKb) && record.repositorySizeKb >= 0, "repository size");
    requireField(typeof record.defaultBranch === "string" && record.defaultBranch.length > 0, "default branch");
    requireField(Number.isFinite(Date.parse(record.pushedAt)), "last push");
    requireField(typeof record.archived === "boolean", "archive status");
    requireField(Object.hasOwn(record, "license"), "license resolution");
    requireField(Array.isArray(record.languages), "languages");
    requireField(sourceTypes.has("repository"), "repository provenance");
    requireField(sourceTypes.has("languages"), "language provenance");
    requireField(sourceTypes.has("contributors"), "contributor provenance");
    requireField(sourceTypes.has("latest-release") || sourceTypes.has("latest-tag") || sourceTypes.has("release-policy"), "release/tag policy provenance");
    for (const source of record.sources || []) {
      requireField(/^https:\/\//.test(source.url), `${source.type} HTTPS provenance`);
      const maximumAge = source.type === "release-policy" || source.type === "license-override" ? MAX_EVIDENCE_AGE_DAYS : MAX_METRICS_AGE_DAYS;
      requireField(dateAgeDays(source.fetchedAt) <= maximumAge, `fresh ${source.type} provenance`);
    }

    if (project.loc.enabled) {
      requireField(record.loc?.status === "measured", "version-pinned LOC status");
      requireField(Number.isInteger(record.loc?.code) && record.loc.code >= 0, "LOC count");
      requireField(typeof record.loc?.measuredRef === "string" && record.loc.measuredRef.length > 0, "LOC ref");
      requireField(typeof record.loc?.commitSha === "string" && record.loc.commitSha.length >= 7, "LOC commit");
      requireField(record.loc?.methodology === "source-code-v2", "source-only LOC methodology");
      requireField(typeof record.loc?.excludedExtensions === "string" && record.loc.excludedExtensions.includes("md") && record.loc.excludedExtensions.includes("json"), "LOC document/data exclusions");
      requireField(dateAgeDays(record.loc?.verifiedAt || record.loc?.measuredAt) <= MAX_METRICS_AGE_DAYS, "fresh LOC verification");
    } else {
      requireField(record.loc?.status === "disabled", "recorded LOC opt-out");
    }
    check(gaps.length === 0, `${owner} are incomplete: ${[...new Set(gaps)].join(", ")}.`);
  }
}

const platformAssetSet = new Set(Object.values(assets.platforms));
await Promise.all(
  [...Object.values(assets.products), ...Object.values(assets.platforms)].map(async (asset) => {
    check(asset.sourceUrl.startsWith("https://"), `${asset.src} needs an HTTPS provenance URL.`);
    check(
      asset.sourceType.startsWith("official-") ||
        (platformAssetSet.has(asset) && asset.sourceType === "original-interface-glyph"),
      `${asset.src} must be sourced from a first party or be an original universal platform glyph.`,
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
