#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  COMPARISON_SNAPSHOT,
  comparisonCategories,
  comparisonProducts,
  getComparisonClaim,
} from "../src/data/comparison-catalog.ts";

const root = resolve(import.meta.dirname, "..");
const checkedAt = COMPARISON_SNAPSHOT;
const evidenceBacklog = new Set(["mosaic-terminal", "airport", "omnara"]);
const files = [
  {
    name: "unknown-audit-general-purpose-agents.json",
    categoryIds: ["general-purpose-agents"],
  },
  {
    name: "unknown-audit-orchestrators-harnesses.json",
    categoryIds: ["agent-orchestrators", "coding-agent-harnesses"],
  },
  {
    name: "unknown-audit-traces-cloud.json",
    categoryIds: ["agent-traces", "cloud-agents"],
  },
];

const unique = (values) => [...new Set(values.filter(Boolean))];
const productSources = (product) => unique([
  product.officialUrl,
  product.repository?.url,
  product.platformSource?.url,
  product.sourceSource?.url,
  product.executionSource?.url,
  product.statusSource?.url,
  ...Object.values(product.claims).flatMap((claim) => claim.evidence.map((item) => item.url)),
]);

const rowLabel = (categoryId, rowId) => comparisonCategories
  .find((category) => category.id === categoryId)
  ?.rows.find((row) => row.id === rowId)
  ?.label ?? rowId;

const rationaleFor = (product, categoryId, rowId) => (
  `${product.name}'s exact first-party product page, repository, and cited capability sources were checked. ` +
  `They do not establish “${rowLabel(categoryId, rowId)}” for this exact product or SKU, so the cell remains Unknown rather than inferring a negative from documentation silence.`
);

for (const file of files) {
  const path = resolve(root, "src/data", file.name);
  const data = JSON.parse(await readFile(path, "utf8"));
  data.checkedAt = checkedAt;
  data.catalogSnapshot = COMPARISON_SNAPSHOT;

  for (const categoryId of file.categoryIds) {
    const category = comparisonCategories.find((item) => item.id === categoryId);
    const categoryAudit = data.categories.find((item) => item.categoryId === categoryId);
    if (!category || !categoryAudit) throw new Error(`${file.name} is missing ${categoryId}.`);

    const existingProducts = new Map(categoryAudit.products.map((item) => [item.productId, item]));
    categoryAudit.products = comparisonProducts
      .filter((product) => product.categoryId === categoryId && !evidenceBacklog.has(product.id))
      .sort((left, right) => left.editorialOrder - right.editorialOrder)
      .map((product) => {
        const existing = existingProducts.get(product.id);
        const existingCells = new Map((existing?.cells ?? []).map((cell) => [cell.rowId, cell]));
        const cells = category.rows
          .filter((row) => !row.platform && getComparisonClaim(product, row).state === "unknown")
          .map((row) => existingCells.get(row.id) ?? {
            rowId: row.id,
            result: "remain-unknown",
            rationale: rationaleFor(product, categoryId, row.id),
          });
        return {
          productId: product.id,
          sourcesChecked: unique([...(existing?.sourcesChecked ?? []), ...productSources(product)]),
          cells,
        };
      });
  }

  const counts = Object.fromEntries(data.categories.map((category) => [
    category.categoryId,
    category.products.reduce((total, product) => total + product.cells.length, 0),
  ]));
  const productCount = data.categories.reduce((total, category) => total + category.products.length, 0);
  const productsWithUnknownCells = data.categories.reduce(
    (total, category) => total + category.products.filter((product) => product.cells.length > 0).length,
    0,
  );
  const currentUnknownCells = Object.values(counts).reduce((total, count) => total + count, 0);

  if ("products" in data.summary) data.summary.products = productCount;
  if ("productsInScope" in data.summary) data.summary.productsInScope = productCount;
  if ("productsWithUnknownCells" in data.summary) data.summary.productsWithUnknownCells = productsWithUnknownCells;
  data.summary.currentUnknownCells = currentUnknownCells;
  data.summary.remainUnknown = currentUnknownCells;
  if ("agentOrchestratorUnknownCells" in data.summary) data.summary.agentOrchestratorUnknownCells = counts["agent-orchestrators"] ?? 0;
  if ("codingAgentHarnessUnknownCells" in data.summary) data.summary.codingAgentHarnessUnknownCells = counts["coding-agent-harnesses"] ?? 0;
  if ("agentTraceUnknownCells" in data.summary) data.summary.agentTraceUnknownCells = counts["agent-traces"] ?? 0;
  if ("cloudAgentUnknownCells" in data.summary) data.summary.cloudAgentUnknownCells = counts["cloud-agents"] ?? 0;

  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${file.name}: ${productCount} products, ${currentUnknownCells} exact Unknown cells.`);
}
