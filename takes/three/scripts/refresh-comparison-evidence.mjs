#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { comparisonProducts } from "../src/data/comparison-catalog.ts";

const takeRoot = resolve(import.meta.dirname, "..");
const defaultOutput = resolve(takeRoot, "src/data/comparison-evidence-status.json");
function resolveGitHubToken() {
  const environmentToken = process.env.GITHUB_TOKEN?.trim();
  if (environmentToken) return environmentToken;
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
  } catch {
    return null;
  }
}

const githubToken = resolveGitHubToken();

function parseArguments(argv) {
  const options = { acceptChanged: [], concurrency: 6, dryRun: false, syncOnly: false, output: defaultOutput, urls: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--sync-only") options.syncOnly = true;
    else if (["--accept-changed", "--concurrency", "--output", "--url"].includes(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      index += 1;
      if (argument === "--accept-changed") options.acceptChanged.push(value);
      if (argument === "--concurrency") options.concurrency = Number(value);
      if (argument === "--output") options.output = resolve(process.cwd(), value);
      if (argument === "--url") options.urls.push(value);
    } else if (argument === "--help") {
      console.log(`Refresh the first-party source registry used by comparison claims.

Options:
  --accept-changed <url>  Accept one manually reviewed changed source (repeatable)
  --url <url>          Refresh only one catalog source (repeatable)
  --sync-only         Reconcile catalog URLs without network requests
  --dry-run           Fetch and validate without writing
  --concurrency <n>   Concurrent requests, 1-12 (default: 6)
  --output <path>     Override generated JSON destination
  --help              Show this message`);
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 12) {
    throw new Error("--concurrency must be an integer from 1 through 12");
  }
  if (options.acceptChanged.length > 0 && (options.syncOnly || options.dryRun)) {
    throw new Error("--accept-changed cannot be combined with --sync-only or --dry-run");
  }
  if (options.urls.length > 0 && (options.acceptChanged.length > 0 || options.syncOnly)) {
    throw new Error("--url cannot be combined with --accept-changed or --sync-only");
  }
  return options;
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

function sourceId(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 20);
}

function collectCatalogSources() {
  const sources = new Map();
  const add = (product, field, evidence) => {
    for (const item of evidence) {
      const record = sources.get(item.url) ?? {
        id: sourceId(item.url),
        url: item.url,
        bases: new Set(),
        usedBy: [],
        latestReviewAt: item.checkedAt,
      };
      record.bases.add(item.basis);
      record.usedBy.push({ productId: product.id, field, checkedAt: item.checkedAt });
      if (item.checkedAt > record.latestReviewAt) record.latestReviewAt = item.checkedAt;
      sources.set(item.url, record);
    }
  };

  for (const product of comparisonProducts) {
    for (const [field, fact] of Object.entries(product.profile)) {
      add(product, `profile.${field}`, fact.evidence);
    }
    for (const [rowId, claim] of Object.entries(product.claims)) {
      add(product, rowId, claim.evidence);
    }
  }

  return [...sources.values()]
    .map((source) => ({
      ...source,
      bases: [...source.bases].sort(),
      usedBy: source.usedBy.sort((left, right) =>
        `${left.productId}:${left.field}`.localeCompare(`${right.productId}:${right.field}`)),
    }))
    .sort((left, right) => left.url.localeCompare(right.url));
}

function githubFetchTarget(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== "github.com") return url;
  const segments = parsed.pathname.split("/").filter(Boolean);
  const reservedRoutes = new Set([
    "apps",
    "collections",
    "customer-stories",
    "enterprise",
    "features",
    "login",
    "marketplace",
    "new",
    "organizations",
    "orgs",
    "pricing",
    "search",
    "security",
    "settings",
    "signup",
    "sponsors",
    "topics",
  ]);
  if (segments.length >= 5 && segments[2] === "blob") {
    const [owner, repo, , ref, ...path] = segments;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.join("/")}`;
  }
  if (segments.length === 2 && !reservedRoutes.has(segments[0].toLowerCase())) {
    return `https://api.github.com/repos/${segments[0]}/${segments[1]}/readme`;
  }
  return url;
}

function normalizeBody(body, contentType) {
  if (contentType.includes("json")) {
    try {
      return JSON.stringify(JSON.parse(body));
    } catch {
      return body.trim();
    }
  }
  if (contentType.includes("html")) {
    const text = body
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    return text.replace(/\s+/g, " ").trim() || body.replace(/\s+/g, " ").trim();
  }
  return body.replace(/\r\n/g, "\n").trim();
}

async function fetchSource(source, previous) {
  const fetchUrl = githubFetchTarget(source.url);
  const headers = {
    Accept: fetchUrl.includes("api.github.com") ? "application/vnd.github.raw+json" : "text/html, text/plain;q=0.9, application/json;q=0.8",
    "User-Agent": "tortie-comparison-evidence-monitor",
  };
  if (githubToken && new URL(fetchUrl).hostname === "api.github.com") {
    headers.Authorization = `Bearer ${githubToken}`;
  }
  if (previous?.etag) headers["If-None-Match"] = previous.etag;
  if (previous?.lastModified) headers["If-Modified-Since"] = previous.lastModified;

  const checkedAt = new Date().toISOString();
  try {
    const response = await fetch(fetchUrl, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
    });
    if (response.status === 304 && previous?.contentHash) {
      return {
        ...previous,
        ...source,
        status: previous.status === "changed" ? "changed" : "current",
        fetchUrl,
        lastCheckedAt: checkedAt,
        httpStatus: 304,
        error: null,
      };
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    const body = await response.text();
    const normalized = normalizeBody(body, contentType);
    if (normalized.length < 32) throw new Error("Response contained too little source content");
    const contentHash = createHash("sha256").update(normalized).digest("hex");
    const reviewAdvanced = Boolean(previous?.latestReviewAt && source.latestReviewAt > previous.latestReviewAt);
    const reviewedHash = !previous?.reviewedHash || reviewAdvanced ? contentHash : previous.reviewedHash;
    const changed = contentHash !== reviewedHash;
    return {
      ...source,
      status: changed ? "changed" : "current",
      fetchUrl,
      resolvedUrl: response.url,
      lastCheckedAt: checkedAt,
      firstObservedAt: previous?.firstObservedAt ?? checkedAt,
      changeDetectedAt: changed ? previous?.changeDetectedAt ?? checkedAt : null,
      httpStatus: response.status,
      contentType,
      contentLength: Buffer.byteLength(body),
      contentHash,
      reviewedHash,
      reviews: previous?.reviews ?? [],
      etag: response.headers.get("etag"),
      lastModified: response.headers.get("last-modified"),
      error: null,
    };
  } catch (error) {
    const hasObservedContent = Boolean(previous?.contentHash);
    return {
      ...source,
      status: previous?.status === "changed"
        ? "changed"
        : hasObservedContent
          ? "unreachable"
          : "awaiting-refresh",
      fetchUrl,
      resolvedUrl: previous?.resolvedUrl ?? null,
      lastCheckedAt: checkedAt,
      firstObservedAt: previous?.firstObservedAt ?? null,
      changeDetectedAt: previous?.changeDetectedAt ?? null,
      httpStatus: null,
      contentType: previous?.contentType ?? null,
      contentLength: previous?.contentLength ?? null,
      contentHash: previous?.contentHash ?? null,
      reviewedHash: previous?.reviewedHash ?? null,
      reviews: previous?.reviews ?? [],
      etag: previous?.etag ?? null,
      lastModified: previous?.lastModified ?? null,
      error: error.message,
    };
  }
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

const options = parseArguments(process.argv.slice(2));
const catalogSources = collectCatalogSources();
const fetchSources = options.urls.length > 0
  ? catalogSources.filter((source) => options.urls.includes(source.url))
  : catalogSources;
const needsGitHubApi = !options.syncOnly && options.acceptChanged.length === 0 && fetchSources.some((source) =>
  new URL(githubFetchTarget(source.url)).hostname === "api.github.com");
if (needsGitHubApi && !githubToken) {
  throw new Error("GitHub evidence refresh requires GITHUB_TOKEN or an authenticated `gh auth login`; refusing an anonymous refresh that could overwrite healthy sources with rate-limit failures.");
}
const previous = await readJson(options.output, { schemaVersion: 1, generatedAt: null, sources: [] });
const previousByUrl = new Map(previous.sources.map((source) => [source.url, source]));
const catalogByUrl = new Map(catalogSources.map((source) => [source.url, source]));

for (const url of options.urls) {
  if (!catalogByUrl.has(url)) throw new Error(`Cannot refresh a URL that is not used by the catalog: ${url}`);
}

for (const url of options.acceptChanged) {
  if (!catalogByUrl.has(url)) throw new Error(`Cannot accept a URL that is not used by the catalog: ${url}`);
  const prior = previousByUrl.get(url);
  if (prior?.status !== "changed" || !prior.contentHash) {
    throw new Error(`Cannot accept a source that is not currently changed with fetched content: ${url}`);
  }
}

const acceptedUrls = new Set(options.acceptChanged);
const selectedUrls = new Set(options.urls);
const acceptedAt = new Date().toISOString();

function preserveSource(source) {
  const prior = previousByUrl.get(source.url);
  const status = prior?.status === "unreachable" && !prior.contentHash
    ? "awaiting-refresh"
    : prior?.status ?? "awaiting-refresh";
  return {
    ...prior,
    ...source,
    status,
    fetchUrl: githubFetchTarget(source.url),
    resolvedUrl: prior?.resolvedUrl ?? null,
    lastCheckedAt: prior?.lastCheckedAt ?? null,
    firstObservedAt: prior?.firstObservedAt ?? null,
    changeDetectedAt: prior?.changeDetectedAt ?? null,
    httpStatus: prior?.httpStatus ?? null,
    contentType: prior?.contentType ?? null,
    contentLength: prior?.contentLength ?? null,
    contentHash: prior?.contentHash ?? null,
    reviewedHash: prior?.reviewedHash ?? null,
    etag: prior?.etag ?? null,
    lastModified: prior?.lastModified ?? null,
    error: prior?.error ?? null,
  };
}

const sources = acceptedUrls.size > 0
  ? catalogSources.map((source) => {
      const prior = previousByUrl.get(source.url);
      if (!prior) throw new Error(`Cannot accept changes while catalog source is unsynchronized: ${source.url}`);
      if (!acceptedUrls.has(source.url)) return { ...prior, ...source };
      return {
        ...prior,
        ...source,
        status: "current",
        reviewedHash: prior.contentHash,
        reviewedAt: acceptedAt,
        reviews: [
          ...(prior.reviews ?? []),
          { action: "accepted-after-review", reviewedAt: acceptedAt, contentHash: prior.contentHash },
        ],
        changeDetectedAt: null,
        error: null,
      };
    })
  : options.syncOnly
  ? catalogSources.map(preserveSource)
  : await mapConcurrent(catalogSources, options.concurrency, (source) =>
      selectedUrls.size === 0 || selectedUrls.has(source.url)
        ? fetchSource(source, previousByUrl.get(source.url))
        : preserveSource(source));

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sources,
};

const counts = sources.reduce((result, source) => {
  result[source.status] = (result[source.status] ?? 0) + 1;
  return result;
}, {});
console.log(`Evidence registry: ${sources.length} unique first-party URLs (${Object.entries(counts).map(([key, value]) => `${value} ${key}`).join(", ")}).`);
if (!options.dryRun) await writeFile(options.output, `${JSON.stringify(output, null, 2)}\n`);
