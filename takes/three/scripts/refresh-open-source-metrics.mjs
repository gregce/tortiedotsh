#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const LOC_METHODOLOGY = "source-code-v2";
const LOC_EXCLUDED_EXTENSIONS = "md,markdown,mdx,json,jsonc,yaml,yml,toml,xml,csv,tsv,txt,lock";
const LOC_EXCLUDED_DIRECTORIES = ".git,node_modules,vendor,vendors,third_party,third-party,dist,build,.build,target,coverage,.next,out,generated,.generated,Pods,DerivedData,.dart_tool";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const takeRoot = resolve(scriptDirectory, "..");
const defaultManifest = resolve(takeRoot, "src/data/open-source-projects.json");
const defaultOutput = resolve(takeRoot, "src/data/open-source-metrics.json");
const githubApi = "https://api.github.com";
const githubToken = process.env.GITHUB_TOKEN?.trim() || null;

function usage() {
  console.log(`Refresh committed GitHub metrics for the open-source comparison.

Usage:
  node scripts/refresh-open-source-metrics.mjs [options]

Options:
  --loc                 Measure LOC for manifest entries that opt in
  --project <id>        Refresh one project (repeatable)
  --manifest <path>     Override the manifest path
  --output <path>       Override the generated output path
  --concurrency <n>     Concurrent GitHub refreshes (default: 3)
  --sync-only           Add/remove manifest records without network access
  --dry-run             Fetch and validate without writing
  --help                Show this help

GITHUB_TOKEN is optional. Anonymous GitHub API limits apply when it is absent.`);
}

function parseArguments(argv) {
  const options = {
    includeLoc: false,
    projectIds: [],
    manifest: defaultManifest,
    output: defaultOutput,
    concurrency: 3,
    dryRun: false,
    syncOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--loc") options.includeLoc = true;
    else if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--sync-only") options.syncOnly = true;
    else if (argument === "--help") {
      usage();
      process.exit(0);
    } else if (["--project", "--manifest", "--output", "--concurrency"].includes(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      index += 1;
      if (argument === "--project") options.projectIds.push(value);
      if (argument === "--manifest") options.manifest = resolve(process.cwd(), value);
      if (argument === "--output") options.output = resolve(process.cwd(), value);
      if (argument === "--concurrency") options.concurrency = Number(value);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 10) {
    throw new Error("--concurrency must be an integer from 1 through 10");
  }
  if (options.syncOnly && (options.includeLoc || options.projectIds.length > 0)) {
    throw new Error("--sync-only cannot be combined with --loc or --project");
  }
  return options;
}

async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && fallback !== null) return fallback;
    throw new Error(`Could not read JSON at ${path}: ${error.message}`);
  }
}

function validateManifest(manifest) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.projects)) {
    throw new Error("Manifest must use schemaVersion 1 and contain a projects array");
  }

  const ids = new Set();
  const repositories = new Set();
  for (const project of manifest.projects) {
    for (const field of ["id", "name", "category", "owner", "repo", "githubUrl", "apiUrl"]) {
      if (typeof project[field] !== "string" || project[field].trim() === "") {
        throw new Error(`Manifest project ${project.id || "<unknown>"} needs a non-empty ${field}`);
      }
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
      throw new Error(`Invalid project id: ${project.id}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.category)) {
      throw new Error(`Invalid category for ${project.id}: ${project.category}`);
    }
    if (ids.has(project.id)) throw new Error(`Duplicate project id: ${project.id}`);
    ids.add(project.id);

    const repository = `${project.owner.toLowerCase()}/${project.repo.toLowerCase()}`;
    if (repositories.has(repository)) throw new Error(`Duplicate repository: ${repository}`);
    repositories.add(repository);

    const expectedGithubUrl = `https://github.com/${project.owner}/${project.repo}`;
    const expectedApiUrl = `${githubApi}/repos/${project.owner}/${project.repo}`;
    if (project.githubUrl !== expectedGithubUrl || project.apiUrl !== expectedApiUrl) {
      throw new Error(`${project.id} URLs must exactly match its owner/repo coordinates`);
    }
    if (typeof project.loc?.enabled !== "boolean") {
      throw new Error(`${project.id} must declare loc.enabled`);
    }
    if (!project.loc.enabled && (typeof project.loc.reason !== "string" || project.loc.reason.trim() === "")) {
      throw new Error(`${project.id} must explain why LOC measurement is disabled`);
    }
    if (project.release?.mode === "default-branch" && (typeof project.release.reason !== "string" || project.release.reason.trim() === "")) {
      throw new Error(`${project.id} must explain its default-branch release policy`);
    }
    if (project.release?.mode === "default-branch" && !Number.isFinite(Date.parse(project.release.checkedAt))) {
      throw new Error(`${project.id} must date its default-branch release policy`);
    }
    if (project.release && project.release.mode !== "default-branch") {
      throw new Error(`${project.id} has an unsupported release.mode`);
    }
  }
}

class GithubRequestError extends Error {
  constructor(message, { status, url, body = null, headers = null } = {}) {
    super(message);
    this.name = "GithubRequestError";
    this.status = status;
    this.url = url;
    this.body = body;
    this.headers = headers;
  }
}

async function githubRequest(path, { allow404 = false } = {}) {
  const url = path.startsWith("https://") ? path : `${githubApi}${path}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tortie-open-source-metrics",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (allow404 && response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    const rateRemaining = response.headers.get("x-ratelimit-remaining");
    const rateReset = response.headers.get("x-ratelimit-reset");
    const rateNote = rateRemaining === "0" && rateReset
      ? `; rate limit resets at ${new Date(Number(rateReset) * 1000).toISOString()}`
      : "";
    throw new GithubRequestError(`GitHub returned ${response.status} for ${url}${rateNote}`, {
      status: response.status,
      url,
      body: body.slice(0, 500),
      headers: response.headers,
    });
  }

  return {
    data: await response.json(),
    url,
    fetchedAt: new Date().toISOString(),
    link: response.headers.get("link"),
  };
}

function source(type, response) {
  return { type, url: response.url, fetchedAt: response.fetchedAt };
}

function parseLastPage(linkHeader, currentLength) {
  if (!linkHeader) return currentLength;
  for (const part of linkHeader.split(",")) {
    if (!part.includes('rel="last"')) continue;
    const match = part.match(/[?&]page=(\d+)/);
    if (match) return Number(match[1]);
  }
  return currentLength;
}

function normalizeLanguages(languageBytes) {
  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
  return Object.entries(languageBytes)
    .sort((left, right) => right[1] - left[1])
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: totalBytes === 0 ? 0 : Number(((bytes / totalBytes) * 100).toFixed(2)),
    }));
}

function nullLoc(status = "not-measured", reason = null) {
  return {
    status,
    code: null,
    comments: null,
    blank: null,
    files: null,
    measuredAt: null,
    verifiedAt: null,
    measuredRef: null,
    refType: null,
    commitSha: null,
    tool: null,
    methodology: LOC_METHODOLOGY,
    excludedExtensions: LOC_EXCLUDED_EXTENSIONS,
    excludedDirectories: LOC_EXCLUDED_DIRECTORIES,
    reason,
  };
}

async function resolveRemoteRefSha(project, measuredRef, refType) {
  const patterns = refType === "default-branch"
    ? [`refs/heads/${measuredRef}`]
    : [`refs/tags/${measuredRef}`, `refs/tags/${measuredRef}^{}`];
  const { stdout } = await execFileAsync("git", ["ls-remote", project.githubUrl, ...patterns], {
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });
  const refs = stdout.trim().split("\n").filter(Boolean).map((line) => {
    const [sha, ref] = line.split(/\s+/, 2);
    return { sha, ref };
  });
  return refs.find((item) => item.ref?.endsWith("^{}"))?.sha || refs[0]?.sha || null;
}

async function measureLoc(project, measuredRef, refType, previousLoc = null) {
  if (!project.loc.enabled) return nullLoc("disabled", project.loc.reason || "Disabled in manifest");

  try {
    const currentCommitSha = await resolveRemoteRefSha(project, measuredRef, refType);
    if (
      currentCommitSha &&
      previousLoc?.status === "measured" &&
      previousLoc.measuredRef === measuredRef &&
      previousLoc.refType === refType &&
      previousLoc.commitSha === currentCommitSha &&
      previousLoc.methodology === LOC_METHODOLOGY
    ) {
      return {
        ...previousLoc,
        verifiedAt: new Date().toISOString(),
        reason: null,
      };
    }
  } catch {
    // Ref verification is an optimization. A fresh checkout remains the
    // authoritative fallback when ls-remote is unavailable.
  }

  const tempRoot = await mkdtemp(resolve(tmpdir(), `tortie-loc-${project.id}-`));
  const checkout = resolve(tempRoot, "repo");
  try {
    await execFileAsync("git", [
      "clone",
      "--depth=1",
      "--single-branch",
      `--branch=${measuredRef}`,
      "--quiet",
      project.githubUrl,
      checkout,
    ], { timeout: 10 * 60_000, maxBuffer: 4 * 1024 * 1024 });

    const { stdout } = await execFileAsync("cloc", [
      "--json",
      "--quiet",
      `--exclude-ext=${LOC_EXCLUDED_EXTENSIONS}`,
      `--exclude-dir=${LOC_EXCLUDED_DIRECTORIES}`,
      checkout,
    ], { timeout: 10 * 60_000, maxBuffer: 32 * 1024 * 1024 });
    const jsonStart = stdout.indexOf("{");
    const jsonEnd = stdout.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("cloc returned no JSON object");
    const result = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
    const sum = result.SUM;
    if (!sum) throw new Error("cloc returned no SUM record");
    const { stdout: commitSha } = await execFileAsync("git", ["-C", checkout, "rev-parse", "HEAD"], {
      timeout: 30_000,
      maxBuffer: 1024 * 1024,
    });
    const measuredAt = new Date().toISOString();
    return {
      status: "measured",
      code: sum.code ?? null,
      comments: sum.comment ?? null,
      blank: sum.blank ?? null,
      files: sum.nFiles ?? null,
      measuredAt,
      verifiedAt: measuredAt,
      measuredRef,
      refType,
      commitSha: commitSha.trim(),
      tool: `cloc ${result.header?.cloc_version || "unknown"}`,
      methodology: LOC_METHODOLOGY,
      excludedExtensions: LOC_EXCLUDED_EXTENSIONS,
      excludedDirectories: LOC_EXCLUDED_DIRECTORIES,
      reason: null,
    };
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function latestVersion(project) {
  const { owner, repo } = project;
  if (project.release?.mode === "default-branch") {
    return {
      latestRelease: null,
      latestTag: null,
      version: null,
      releaseDate: null,
      releasePolicy: {
        mode: "default-branch",
        reason: project.release.reason,
        checkedAt: project.release.checkedAt,
        rejectedCandidate: project.release.rejectedCandidate || null,
      },
      sources: [{
        type: "release-policy",
        url: `${project.githubUrl}/releases`,
        fetchedAt: `${project.release.checkedAt}T00:00:00.000Z`,
      }],
    };
  }
  const release = await githubRequest(`/repos/${owner}/${repo}/releases/latest`, { allow404: true });
  if (release) {
    return {
      latestRelease: {
        tagName: release.data.tag_name || null,
        name: release.data.name || null,
        publishedAt: release.data.published_at || null,
        url: release.data.html_url || null,
        prerelease: Boolean(release.data.prerelease),
      },
      latestTag: null,
      version: release.data.tag_name || null,
      releaseDate: release.data.published_at || null,
      releasePolicy: null,
      sources: [source("latest-release", release)],
    };
  }

  const tags = await githubRequest(`/repos/${owner}/${repo}/tags?per_page=1`);
  const tag = tags.data[0];
  if (!tag) {
    return {
      latestRelease: null,
      latestTag: null,
      version: null,
      releaseDate: null,
      releasePolicy: null,
      sources: [source("latest-tag", tags)],
    };
  }

  const commit = await githubRequest(`/repos/${owner}/${repo}/commits/${encodeURIComponent(tag.commit.sha)}`);
  return {
    latestRelease: null,
    latestTag: {
      name: tag.name,
      commitSha: tag.commit.sha,
      commitDate: commit.data.commit?.committer?.date || commit.data.commit?.author?.date || null,
      url: `https://github.com/${owner}/${repo}/tree/${encodeURIComponent(tag.name)}`,
    },
    version: tag.name,
    releaseDate: null,
    releasePolicy: null,
    sources: [source("latest-tag", tags), source("tag-commit", commit)],
  };
}

function baseRecord(project, previous) {
  const prior =
    previous?.owner?.toLowerCase() === project.owner.toLowerCase() &&
    previous?.repo?.toLowerCase() === project.repo.toLowerCase()
      ? previous
      : null;
  const priorErrors = prior?.errors || [];
  const policyResolvesVersionError = project.release?.mode === "default-branch" && priorErrors.every((error) => error.section === "version");
  const record = {
    id: project.id,
    name: project.name,
    category: project.category,
    owner: project.owner,
    repo: project.repo,
    githubUrl: project.githubUrl,
    apiUrl: project.apiUrl,
    status: policyResolvesVersionError ? "current" : prior?.status || "stale",
    refreshedAt: prior?.refreshedAt || null,
    stars: prior?.stars ?? null,
    forks: prior?.forks ?? null,
    openIssues: prior?.openIssues ?? null,
    contributors: prior?.contributors ?? null,
    repositorySizeKb: prior?.repositorySizeKb ?? null,
    defaultBranch: prior?.defaultBranch ?? null,
    pushedAt: prior?.pushedAt ?? null,
    archived: prior?.archived ?? null,
    license: prior?.license ?? null,
    languages: prior?.languages || [],
    latestRelease: prior?.latestRelease ?? null,
    latestTag: prior?.latestTag ?? null,
    version: prior?.version ?? null,
    releaseDate: prior?.releaseDate ?? null,
    releasePolicy: prior?.releasePolicy ?? null,
    loc: !project.loc.enabled
      ? nullLoc("disabled", project.loc.reason || "Disabled in manifest")
      : prior?.loc
        ? { ...nullLoc(), ...prior.loc }
        : nullLoc(),
    sources: prior?.sources || [],
    errors: policyResolvesVersionError ? [] : priorErrors,
  };
  if (project.release?.mode === "default-branch") {
    record.latestRelease = null;
    record.latestTag = null;
    record.version = null;
    record.releaseDate = null;
    record.releasePolicy = {
      mode: "default-branch",
      reason: project.release.reason,
      checkedAt: project.release.checkedAt,
      rejectedCandidate: project.release.rejectedCandidate || null,
    };
    record.sources = (record.sources || []).filter((item) => !["latest-release", "latest-tag", "tag-commit", "release-policy"].includes(item.type));
    record.sources.push({
      type: "release-policy",
      url: `${project.githubUrl}/releases`,
      fetchedAt: `${project.release.checkedAt}T00:00:00.000Z`,
    });
  }
  return record;
}

async function refreshProject(project, previous, includeLoc) {
  const record = baseRecord(project, previous);
  record.errors = [];
  const currentSources = [];
  let repositoryCurrent = false;

  try {
    const repository = await githubRequest(`/repos/${project.owner}/${project.repo}`);
    repositoryCurrent = true;
    record.stars = repository.data.stargazers_count ?? null;
    record.forks = repository.data.forks_count ?? null;
    record.openIssues = repository.data.open_issues_count ?? null;
    record.repositorySizeKb = repository.data.size ?? null;
    record.defaultBranch = repository.data.default_branch || null;
    record.pushedAt = repository.data.pushed_at || null;
    record.archived = typeof repository.data.archived === "boolean" ? repository.data.archived : null;
    record.license = repository.data.license
      ? {
          key: repository.data.license.key || null,
          name: repository.data.license.name || null,
          spdxId: repository.data.license.spdx_id || null,
          url: repository.data.license.html_url || repository.data.license.url || null,
        }
      : null;
    record.githubUrl = repository.data.html_url || project.githubUrl;
    currentSources.push(source("repository", repository));
  } catch (error) {
    record.errors.push({ section: "repository", message: error.message });
  }

  if (repositoryCurrent) {
    let versionCurrent = false;
    const tasks = [
      (async () => {
        const languages = await githubRequest(`/repos/${project.owner}/${project.repo}/languages`);
        record.languages = normalizeLanguages(languages.data);
        currentSources.push(source("languages", languages));
      })(),
      (async () => {
        const contributors = await githubRequest(`/repos/${project.owner}/${project.repo}/contributors?anon=true&per_page=1`);
        record.contributors = parseLastPage(contributors.link, contributors.data.length);
        currentSources.push(source("contributors", contributors));
      })(),
      (async () => {
        const version = await latestVersion(project);
        Object.assign(record, {
          latestRelease: version.latestRelease,
          latestTag: version.latestTag,
          version: version.version,
          releaseDate: version.releaseDate,
          releasePolicy: version.releasePolicy,
        });
        versionCurrent = true;
        currentSources.push(...version.sources);
      })(),
    ];

    const sections = ["languages", "contributors", "version"];
    const results = await Promise.allSettled(tasks);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        record.errors.push({ section: sections[index], message: result.reason.message });
      }
    });

    if (includeLoc) {
      try {
        const measuredRef = versionCurrent
          ? record.latestRelease?.tagName || record.defaultBranch
          : record.defaultBranch;
        const refType = versionCurrent && record.latestRelease?.tagName
          ? "stable-release-tag"
          : "default-branch";
        record.loc = await measureLoc(project, measuredRef, refType, previous?.loc);
        if (record.loc.status === "measured") {
          currentSources.push({
            type: "loc-measurement",
            url: `${project.githubUrl}/tree/${encodeURIComponent(record.loc.measuredRef)}`,
            fetchedAt: record.loc.verifiedAt || record.loc.measuredAt,
          });
        }
      } catch (error) {
        record.errors.push({ section: "loc", message: error.message });
        record.loc = previous?.loc || nullLoc("failed", error.message);
      }
    } else if (!project.loc.enabled) {
      record.loc = nullLoc("disabled", project.loc.reason || "Disabled in manifest");
    }
  }

  if (repositoryCurrent) {
    const replacedTypes = new Set(currentSources.map((item) => item.type));
    if (["latest-release", "latest-tag", "tag-commit"].some((type) => replacedTypes.has(type))) {
      replacedTypes.add("latest-release");
      replacedTypes.add("latest-tag");
      replacedTypes.add("tag-commit");
    }
    if (replacedTypes.has("loc-measurement")) {
      replacedTypes.add("loc-checkout");
      replacedTypes.add("loc-ref-verification");
    }
    const retainedSources = (previous?.sources || []).filter((item) => !replacedTypes.has(item.type));
    record.sources = [...retainedSources, ...currentSources];
  }
  record.refreshedAt = repositoryCurrent ? new Date().toISOString() : record.refreshedAt;
  record.status = !repositoryCurrent ? "stale" : record.errors.length > 0 ? "partial" : "current";
  return record;
}

async function mapWithConcurrency(items, limit, mapper) {
  const output = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      output[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return output;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const manifest = await readJson(options.manifest);
  validateManifest(manifest);

  const previousOutput = await readJson(options.output, {
    schemaVersion: 1,
    generatedAt: null,
    generator: "takes/three/scripts/refresh-open-source-metrics.mjs",
    projects: [],
  });
  const previousById = new Map((previousOutput.projects || []).map((project) => [project.id, project]));
  if (options.syncOnly) {
    const output = {
      schemaVersion: 1,
      // A manifest reconciliation is not a metrics refresh. Preserve the last
      // successful network-refresh timestamp so freshness checks cannot be
      // satisfied by adding empty records offline.
      generatedAt: previousOutput.generatedAt || null,
      manifestSyncedAt: new Date().toISOString(),
      generator: "takes/three/scripts/refresh-open-source-metrics.mjs",
      projects: manifest.projects.map((project) => baseRecord(project, previousById.get(project.id))),
    };
    if (options.dryRun) {
      console.log(`Manifest sync dry run complete; ${options.output} was not changed.`);
    } else {
      await writeFile(options.output, `${JSON.stringify(output, null, 2)}\n`, "utf8");
      console.log(`Synced ${output.projects.length} manifest record(s) to ${options.output} without network access.`);
    }
    return;
  }
  const requestedIds = new Set(options.projectIds);
  const unknownIds = options.projectIds.filter((id) => !manifest.projects.some((project) => project.id === id));
  if (unknownIds.length > 0) throw new Error(`Unknown project id(s): ${unknownIds.join(", ")}`);

  const selected = requestedIds.size === 0
    ? manifest.projects
    : manifest.projects.filter((project) => requestedIds.has(project.id));

  console.log(`Refreshing ${selected.length} project(s)${githubToken ? " with GITHUB_TOKEN" : " anonymously"}${options.includeLoc ? ", including eligible LOC" : ""}.`);
  const refreshed = await mapWithConcurrency(selected, options.concurrency, async (project) => {
    process.stdout.write(`- ${project.name} ... `);
    const result = await refreshProject(project, previousById.get(project.id), options.includeLoc);
    console.log(`${result.status}${result.errors.length ? ` (${result.errors.length} issue(s))` : ""}`);
    return result;
  });

  const refreshedById = new Map(refreshed.map((project) => [project.id, project]));
  const projects = manifest.projects.map((project) => refreshedById.get(project.id) || baseRecord(project, previousById.get(project.id)));
  const successful = refreshed.filter((project) => project.status !== "stale").length;
  if (selected.length > 0 && successful === 0) {
    throw new Error("Every selected repository refresh failed; preserving the committed fallback file");
  }

  const output = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    manifestSyncedAt: new Date().toISOString(),
    generator: "takes/three/scripts/refresh-open-source-metrics.mjs",
    projects,
  };
  const serialized = `${JSON.stringify(output, null, 2)}\n`;
  if (options.dryRun) {
    console.log(`Dry run complete; ${options.output} was not changed.`);
  } else {
    await writeFile(options.output, serialized, "utf8");
    console.log(`Wrote ${options.output}.`);
  }

  const partial = refreshed.filter((project) => project.status !== "current");
  if (partial.length > 0) {
    console.warn(`Completed with non-current records: ${partial.map((project) => project.id).join(", ")}`);
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
