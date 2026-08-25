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
const gitlabApi = "https://gitlab.com/api/v4";
const gitlabGraphqlApi = "https://gitlab.com/api/graphql";
const gitlabToken = process.env.GITLAB_TOKEN?.trim() || null;

function projectForge(project) {
  return project.forge || "github";
}

function projectRepositoryUrl(project) {
  return project.repositoryUrl || project.githubUrl;
}

function projectCloneUrl(project) {
  return project.cloneUrl || `${projectRepositoryUrl(project)}.git`;
}

function projectTreeUrl(project, ref) {
  const separator = projectForge(project) === "gitlab" ? "/-/tree/" : "/tree/";
  return `${projectRepositoryUrl(project)}${separator}${encodeURIComponent(ref)}`;
}

function projectReleasesUrl(project) {
  return projectForge(project) === "gitlab"
    ? `${projectRepositoryUrl(project)}/-/releases`
    : `${projectRepositoryUrl(project)}/releases`;
}

function usage() {
  console.log(`Refresh committed forge metrics for the open-source comparison.

Usage:
  node scripts/refresh-open-source-metrics.mjs [options]

Options:
  --loc                 Measure LOC for manifest entries that opt in
  --project <id>        Refresh one project (repeatable)
  --manifest <path>     Override the manifest path
  --output <path>       Override the generated output path
  --concurrency <n>     Concurrent forge refreshes (default: 3)
  --sync-only           Add/remove manifest records without network access
  --dry-run             Fetch and validate without writing
  --help                Show this help

GITHUB_TOKEN is optional. Anonymous GitHub API limits apply when it is absent.
GITLAB_TOKEN is optional. GitLab repository-size statistics require Reporter
access; manifest-reviewed forge-restricted policies represent that field
honestly when an upstream public project does not expose it.`);
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
    for (const field of ["id", "name", "category", "owner", "repo", "apiUrl"]) {
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

    const forge = projectForge(project);
    if (!["github", "gitlab"].includes(forge)) {
      throw new Error(`${project.id} uses unsupported forge ${forge}`);
    }
    const repository = `${forge}:${project.owner.toLowerCase()}/${project.repo.toLowerCase()}`;
    if (repositories.has(repository)) throw new Error(`Duplicate repository: ${repository}`);
    repositories.add(repository);

    if (forge === "github") {
      const expectedGithubUrl = `https://github.com/${project.owner}/${project.repo}`;
      const expectedApiUrl = `${githubApi}/repos/${project.owner}/${project.repo}`;
      if (project.githubUrl !== expectedGithubUrl || project.apiUrl !== expectedApiUrl) {
        throw new Error(`${project.id} GitHub URLs must exactly match its owner/repo coordinates`);
      }
    } else {
      const expectedRepositoryUrl = `https://gitlab.com/${project.owner}/${project.repo}`;
      const expectedApiUrl = `${gitlabApi}/projects/${encodeURIComponent(`${project.owner}/${project.repo}`)}`;
      const expectedCloneUrl = `${expectedRepositoryUrl}.git`;
      if (
        project.repositoryUrl !== expectedRepositoryUrl ||
        project.apiUrl !== expectedApiUrl ||
        project.cloneUrl !== expectedCloneUrl
      ) {
        throw new Error(`${project.id} GitLab URLs must exactly match its owner/repo coordinates`);
      }
    }
    if (project.metricScope !== undefined && (
      typeof project.metricScope !== "string" || project.metricScope.trim() === ""
    )) {
      throw new Error(`${project.id} metricScope must be a non-empty string when present`);
    }
    if (project.repositorySizePolicy !== undefined) {
      const policy = project.repositorySizePolicy;
      if (
        forge !== "gitlab" ||
        policy.mode !== "forge-restricted" ||
        typeof policy.reason !== "string" || policy.reason.trim() === "" ||
        !Number.isFinite(Date.parse(policy.checkedAt)) ||
        typeof policy.sourceUrl !== "string" || !policy.sourceUrl.startsWith("https://")
      ) {
        throw new Error(`${project.id} has an invalid repositorySizePolicy`);
      }
    }
    if (typeof project.loc?.enabled !== "boolean") {
      throw new Error(`${project.id} must declare loc.enabled`);
    }
    if (project.loc.timeoutMinutes !== undefined && (
      !Number.isInteger(project.loc.timeoutMinutes) ||
      project.loc.timeoutMinutes < 1 ||
      project.loc.timeoutMinutes > 60
    )) {
      throw new Error(`${project.id} loc.timeoutMinutes must be an integer from 1 through 60`);
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
    if (project.release?.mode === "tag-prefix" && (typeof project.release.tagPrefix !== "string" || project.release.tagPrefix.trim() === "")) {
      throw new Error(`${project.id} must provide release.tagPrefix for a tag-prefix policy`);
    }
    if (project.release?.mode === "tag-prefix" && (typeof project.release.reason !== "string" || project.release.reason.trim() === "")) {
      throw new Error(`${project.id} must explain its tag-prefix release policy`);
    }
    if (project.release?.mode === "tag-prefix" && !Number.isFinite(Date.parse(project.release.checkedAt))) {
      throw new Error(`${project.id} must date its tag-prefix release policy`);
    }
    if (project.release && !["default-branch", "tag-prefix"].includes(project.release.mode)) {
      throw new Error(`${project.id} has an unsupported release.mode`);
    }
    if (project.license) {
      if (!Number.isFinite(Date.parse(project.license.checkedAt))) {
        throw new Error(`${project.id} license override needs a valid check date`);
      }
      if (project.license.components !== undefined) {
        if (
          typeof project.license.summary !== "string" || project.license.summary.trim() === "" ||
          !Array.isArray(project.license.components) || project.license.components.length === 0
        ) {
          throw new Error(`${project.id} mixed-license override needs a summary and non-empty components`);
        }
        for (const component of project.license.components) {
          for (const field of ["spdxId", "name", "scope", "sourceUrl"]) {
            if (typeof component[field] !== "string" || component[field].trim() === "") {
              throw new Error(`${project.id} license component needs a non-empty ${field}`);
            }
          }
          if (!component.sourceUrl.startsWith("https://")) {
            throw new Error(`${project.id} license component needs HTTPS provenance`);
          }
        }
      } else {
        for (const field of ["spdxId", "name", "sourceUrl"]) {
          if (typeof project.license[field] !== "string" || project.license[field].trim() === "") {
            throw new Error(`${project.id} license override needs a non-empty ${field}`);
          }
        }
        if (!project.license.sourceUrl.startsWith("https://")) {
          throw new Error(`${project.id} license override needs HTTPS provenance`);
        }
      }
    }
  }
}

function manifestLicenseValue(license) {
  if (!license) return null;
  if (license.components) {
    return {
      key: "manifest-verified-mixed",
      name: license.summary,
      spdxId: null,
      url: null,
      summary: license.summary,
      components: license.components.map((component) => ({ ...component })),
    };
  }
  return {
    key: "manifest-verified",
    name: license.name,
    spdxId: license.spdxId,
    url: license.sourceUrl,
  };
}

function manifestLicenseSources(license) {
  if (!license) return [];
  const urls = license.components
    ? [...new Set(license.components.map((component) => component.sourceUrl))]
    : [license.sourceUrl];
  return urls.map((url) => ({
    type: "license-override",
    url,
    fetchedAt: `${license.checkedAt}T00:00:00.000Z`,
  }));
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

class GitlabRequestError extends Error {
  constructor(message, { status, url, body = null, headers = null } = {}) {
    super(message);
    this.name = "GitlabRequestError";
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

async function gitlabRequest(url, { allow404 = false } = {}) {
  const headers = {
    Accept: "application/json",
    "User-Agent": "tortie-open-source-metrics",
  };
  if (gitlabToken) headers["PRIVATE-TOKEN"] = gitlabToken;

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (allow404 && response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new GitlabRequestError(`GitLab returned ${response.status} for ${url}`, {
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
    total: response.headers.get("x-total"),
    totalPages: response.headers.get("x-total-pages"),
  };
}

async function gitlabGraphqlRequest(query, variables) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "tortie-open-source-metrics",
  };
  if (gitlabToken) headers.Authorization = `Bearer ${gitlabToken}`;
  const response = await fetch(gitlabGraphqlApi, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new GitlabRequestError(`GitLab GraphQL returned ${response.status} for ${gitlabGraphqlApi}`, {
      status: response.status,
      url: gitlabGraphqlApi,
      body: body.slice(0, 500),
      headers: response.headers,
    });
  }
  const payload = await response.json();
  if (payload.errors?.length) {
    throw new GitlabRequestError(`GitLab GraphQL returned errors for ${variables.fullPath}`, {
      status: response.status,
      url: gitlabGraphqlApi,
      body: JSON.stringify(payload.errors).slice(0, 500),
      headers: response.headers,
    });
  }
  return {
    data: payload.data,
    url: gitlabGraphqlApi,
    fetchedAt: new Date().toISOString(),
  };
}

async function verifyPublicSource(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "tortie-open-source-metrics",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Policy source returned ${response.status} for ${url}`);
  }
  return { url, fetchedAt: new Date().toISOString() };
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

function normalizeGitlabLanguages(languagePercentages) {
  return Object.entries(languagePercentages)
    .sort((left, right) => right[1] - left[1])
    .map(([name, percent]) => ({
      name,
      bytes: null,
      percent: Number(Number(percent).toFixed(2)),
    }));
}

function parseGitlabTotal(response, currentLength) {
  const total = Number(response.total);
  if (Number.isInteger(total) && total >= 0) return total;
  const totalPages = Number(response.totalPages);
  if (Number.isInteger(totalPages) && totalPages > 1 && currentLength === 1) return totalPages;
  return currentLength;
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
  const { stdout } = await execFileAsync("git", ["ls-remote", projectCloneUrl(project), ...patterns], {
    timeout: 60_000,
    maxBuffer: 1024 * 1024,
  });
  const refs = stdout.trim().split("\n").filter(Boolean).map((line) => {
    const [sha, ref] = line.split(/\s+/, 2);
    return { sha, ref };
  });
  return refs.find((item) => item.ref?.endsWith("^{}"))?.sha || refs[0]?.sha || null;
}

async function currentClocTool() {
  const { stdout, stderr } = await execFileAsync("cloc", ["--version"], {
    timeout: 30_000,
    maxBuffer: 1024 * 1024,
  });
  const version = `${stdout || ""}\n${stderr || ""}`.trim().split(/\s+/)[0];
  if (!version) throw new Error("cloc --version returned no version");
  return `cloc ${version}`;
}

async function measureLoc(project, measuredRef, refType, previousLoc = null) {
  if (!project.loc.enabled) return nullLoc("disabled", project.loc.reason || "Disabled in manifest");
  const locTimeout = (project.loc.timeoutMinutes || 10) * 60_000;
  const clocTool = await currentClocTool();

  try {
    const currentCommitSha = await resolveRemoteRefSha(project, measuredRef, refType);
    if (
      currentCommitSha &&
      previousLoc?.status === "measured" &&
      previousLoc.measuredRef === measuredRef &&
      previousLoc.refType === refType &&
      previousLoc.commitSha === currentCommitSha &&
      previousLoc.methodology === LOC_METHODOLOGY &&
      previousLoc.tool === clocTool
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
      projectCloneUrl(project),
      checkout,
    ], {
      timeout: locTimeout,
      maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, GIT_LFS_SKIP_SMUDGE: "1" },
    });

    const { stdout } = await execFileAsync("cloc", [
      "--json",
      "--quiet",
      `--exclude-ext=${LOC_EXCLUDED_EXTENSIONS}`,
      `--exclude-dir=${LOC_EXCLUDED_DIRECTORIES}`,
      checkout,
    ], { timeout: locTimeout, maxBuffer: 32 * 1024 * 1024 });
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
      tool: clocTool,
      methodology: LOC_METHODOLOGY,
      excludedExtensions: LOC_EXCLUDED_EXTENSIONS,
      excludedDirectories: LOC_EXCLUDED_DIRECTORIES,
      reason: null,
    };
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function gitlabProjectEndpoint(project, suffix = "", query = "") {
  return `${project.apiUrl}${suffix}${query}`;
}

async function latestGitlabVersion(project) {
  let releases = null;
  try {
    releases = await gitlabRequest(gitlabProjectEndpoint(project, "/releases", "?per_page=100"));
  } catch (error) {
    if (!(error instanceof GitlabRequestError) || error.status !== 403) throw error;
  }
  const now = Date.now();
  const release = (releases?.data || [])
    .filter((candidate) => (
      !candidate.upcoming_release &&
      Number.isFinite(Date.parse(candidate.released_at)) &&
      Date.parse(candidate.released_at) <= now
    ))
    .sort((left, right) => Date.parse(right.released_at) - Date.parse(left.released_at))[0];
  if (release) {
    return {
      latestRelease: {
        tagName: release.tag_name || null,
        name: release.name || null,
        publishedAt: release.released_at || null,
        url: release._links?.self || projectTreeUrl(project, release.tag_name),
        prerelease: false,
      },
      latestTag: null,
      version: release.tag_name || null,
      releaseDate: release.released_at || null,
      releasePolicy: null,
      sources: [source("latest-release", releases)],
    };
  }

  const tags = await gitlabRequest(gitlabProjectEndpoint(project, "/repository/tags", "?per_page=1"));
  const tag = tags.data[0];
  if (!tag) {
    return {
      latestRelease: null,
      latestTag: null,
      version: null,
      releaseDate: null,
      releasePolicy: null,
      sources: [
        ...(releases ? [source("latest-release", releases)] : []),
        source("latest-tag", tags),
      ],
    };
  }
  return {
    latestRelease: null,
    latestTag: {
      name: tag.name,
      commitSha: tag.commit?.id || null,
      commitDate: tag.commit?.committed_date || tag.commit?.created_at || null,
      url: tag.web_url || projectTreeUrl(project, tag.name),
    },
    version: tag.name,
    releaseDate: null,
    releasePolicy: releases ? null : {
      mode: "forge-tag-fallback",
      reason: "GitLab does not expose this public upstream project's Releases feed to anonymous API clients; the newest official repository tag is retained as a tag, not promoted to a verified stable release.",
      checkedAt: new Date().toISOString().slice(0, 10),
      rejectedCandidate: null,
    },
    sources: [
      ...(releases ? [source("latest-release", releases)] : []),
      source("latest-tag", tags),
    ],
  };
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
        url: projectReleasesUrl(project),
        fetchedAt: `${project.release.checkedAt}T00:00:00.000Z`,
      }],
    };
  }
  if (projectForge(project) === "gitlab") return latestGitlabVersion(project);
  const releases = await githubRequest(`/repos/${owner}/${repo}/releases?per_page=100`);
  const now = Date.now();
  const looksLikePrerelease = (candidate) => {
    const label = `${candidate.tag_name || ""} ${candidate.name || ""}`;
    return /(?:^|[._-])(alpha|beta|rc|pre|preview|canary|nightly|dev)(?:[._-]?\d|\b)/i.test(label);
  };
  const publishedReleases = releases.data
    .filter((candidate) => (
      !candidate.draft &&
      (!project.release?.tagPrefix || candidate.tag_name?.startsWith(project.release.tagPrefix)) &&
      Number.isFinite(Date.parse(candidate.published_at)) &&
      Date.parse(candidate.published_at) <= now
    ))
    .sort((left, right) => Date.parse(right.published_at) - Date.parse(left.published_at));
  const release = publishedReleases.find((candidate) => !candidate.prerelease && !looksLikePrerelease(candidate)) || null;
  if (release) {
    return {
      latestRelease: {
        tagName: release.tag_name || null,
        name: release.name || null,
        publishedAt: release.published_at || null,
        url: release.html_url || null,
        prerelease: Boolean(release.prerelease),
      },
      latestTag: null,
      version: release.tag_name || null,
      releaseDate: release.published_at || null,
      releasePolicy: project.release?.mode === "tag-prefix" ? {
        mode: "tag-prefix",
        reason: project.release.reason,
        checkedAt: project.release.checkedAt,
        tagPrefix: project.release.tagPrefix,
        rejectedCandidate: releases.data[0] && releases.data[0].tag_name !== release.tag_name ? {
          tagName: releases.data[0].tag_name || null,
          name: releases.data[0].name || null,
          url: releases.data[0].html_url || null,
        } : null,
      } : null,
      sources: [source("latest-release", releases)],
    };
  }

  if (project.release?.mode === "tag-prefix") {
    return {
      latestRelease: null,
      latestTag: null,
      version: null,
      releaseDate: null,
      releasePolicy: {
        mode: "tag-prefix",
        reason: project.release.reason,
        checkedAt: project.release.checkedAt,
        tagPrefix: project.release.tagPrefix,
        rejectedCandidate: releases.data[0] ? {
          tagName: releases.data[0].tag_name || null,
          name: releases.data[0].name || null,
          url: releases.data[0].html_url || null,
        } : null,
      },
      sources: [source("latest-release", releases)],
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
      sources: [source("latest-release", releases), source("latest-tag", tags)],
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
    sources: [source("latest-release", releases), source("latest-tag", tags), source("tag-commit", commit)],
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
    forge: projectForge(project),
    repositoryUrl: projectRepositoryUrl(project),
    cloneUrl: projectCloneUrl(project),
    // Compatibility alias for the current UI/data consumer. New code should
    // use repositoryUrl because this value can identify a non-GitHub forge.
    githubUrl: projectRepositoryUrl(project),
    apiUrl: project.apiUrl,
    metricScope: project.metricScope || null,
    status: policyResolvesVersionError ? "current" : prior?.status || "stale",
    refreshedAt: prior?.refreshedAt || null,
    stars: prior?.stars ?? null,
    forks: prior?.forks ?? null,
    openIssues: prior?.openIssues ?? null,
    contributors: prior?.contributors ?? null,
    repositorySizeKb: prior?.repositorySizeKb ?? null,
    repositorySizePolicy: project.repositorySizePolicy || null,
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
      url: projectReleasesUrl(project),
      fetchedAt: `${project.release.checkedAt}T00:00:00.000Z`,
    });
  }
  if (project.license) {
    record.license = manifestLicenseValue(project.license);
    record.sources = (record.sources || []).filter((item) => item.type !== "license-override");
    record.sources.push(...manifestLicenseSources(project.license));
  }
  return record;
}

async function refreshProject(project, previous, includeLoc) {
  const record = baseRecord(project, previous);
  record.errors = [];
  const currentSources = [];
  let repositoryCurrent = false;

  try {
    const forge = projectForge(project);
    const repository = forge === "gitlab"
      ? await gitlabRequest(`${project.apiUrl}?statistics=true&license=true`)
      : await githubRequest(`/repos/${project.owner}/${project.repo}`);
    repositoryCurrent = true;
    record.stars = forge === "gitlab" ? repository.data.star_count ?? null : repository.data.stargazers_count ?? null;
    record.forks = repository.data.forks_count ?? null;
    record.openIssues = repository.data.open_issues_count ?? null;
    record.repositorySizeKb = forge === "gitlab"
      ? Number.isFinite(repository.data.statistics?.repository_size)
        ? Math.round(repository.data.statistics.repository_size / 1024)
        : null
      : repository.data.size ?? null;
    record.defaultBranch = repository.data.default_branch || null;
    record.pushedAt = forge === "gitlab" ? repository.data.last_activity_at || null : repository.data.pushed_at || null;
    record.archived = typeof repository.data.archived === "boolean" ? repository.data.archived : null;
    record.license = project.license
      ? manifestLicenseValue(project.license)
      : repository.data.license
        ? {
            key: repository.data.license.key || null,
            name: repository.data.license.name || null,
            spdxId: repository.data.license.spdx_id || repository.data.license.nickname || null,
            url: repository.data.license.html_url || repository.data.license.url || null,
          }
        : null;
    record.repositoryUrl = forge === "gitlab"
      ? repository.data.web_url || projectRepositoryUrl(project)
      : repository.data.html_url || projectRepositoryUrl(project);
    record.cloneUrl = forge === "gitlab"
      ? repository.data.http_url_to_repo || projectCloneUrl(project)
      : repository.data.clone_url || projectCloneUrl(project);
    record.githubUrl = record.repositoryUrl;
    currentSources.push(source("repository", repository));
    if (forge === "gitlab") {
      const supplemental = await Promise.allSettled([
        gitlabRequest(gitlabProjectEndpoint(project, "/issues", "?state=opened&per_page=1")),
        gitlabRequest(gitlabProjectEndpoint(project, "/repository/commits", "?per_page=1")),
        gitlabGraphqlRequest(
          "query ProjectArchiveState($fullPath: ID!) { project(fullPath: $fullPath) { archived } }",
          { fullPath: `${project.owner}/${project.repo}` },
        ),
        project.repositorySizePolicy
          ? verifyPublicSource(project.repositorySizePolicy.sourceUrl)
          : Promise.resolve(null),
      ]);
      if (supplemental[0].status === "fulfilled") {
        record.openIssues = parseGitlabTotal(supplemental[0].value, supplemental[0].value.data.length);
        currentSources.push(source("open-issues", supplemental[0].value));
      } else if (!Number.isInteger(record.openIssues)) {
        record.errors.push({ section: "open-issues", message: supplemental[0].reason.message });
      }
      if (supplemental[1].status === "fulfilled") {
        record.pushedAt = supplemental[1].value.data[0]?.committed_date || record.pushedAt;
        currentSources.push(source("last-commit", supplemental[1].value));
      } else {
        record.errors.push({ section: "last-commit", message: supplemental[1].reason.message });
      }
      if (supplemental[2].status === "fulfilled" && typeof supplemental[2].value.data?.project?.archived === "boolean") {
        record.archived = supplemental[2].value.data.project.archived;
        currentSources.push(source("archive-status", supplemental[2].value));
      } else if (typeof record.archived !== "boolean") {
        const message = supplemental[2].status === "rejected"
          ? supplemental[2].reason.message
          : "GitLab GraphQL omitted archive status";
        record.errors.push({ section: "archive-status", message });
      }
      if (record.repositorySizeKb === null && project.repositorySizePolicy) {
        record.repositorySizePolicy = project.repositorySizePolicy;
        if (supplemental[3].status === "fulfilled" && supplemental[3].value) {
          currentSources.push(source("repository-size-policy", supplemental[3].value));
        } else {
          record.errors.push({
            section: "repository-size-policy",
            message: supplemental[3].status === "rejected"
              ? supplemental[3].reason.message
              : "Repository-size policy source was not checked",
          });
        }
      }
      const restrictedFields = [
        [record.repositorySizeKb === null && !record.repositorySizePolicy, "repository size"],
        [typeof record.archived !== "boolean", "archive status"],
      ].filter(([missing]) => missing).map(([, label]) => label);
      if (restrictedFields.length > 0) {
        record.errors.push({
          section: "repository-statistics",
          message: `GitLab omitted ${restrictedFields.join(" and ")}; configure GITLAB_TOKEN with Reporter access and read_api scope`,
        });
      }
    }
    if (project.license) {
      currentSources.push(...manifestLicenseSources(project.license));
    }
  } catch (error) {
    record.errors.push({ section: "repository", message: error.message });
  }

  if (repositoryCurrent) {
    let versionCurrent = false;
    const tasks = [
      (async () => {
        const languages = projectForge(project) === "gitlab"
          ? await gitlabRequest(gitlabProjectEndpoint(project, "/languages"))
          : await githubRequest(`/repos/${project.owner}/${project.repo}/languages`);
        record.languages = projectForge(project) === "gitlab"
          ? normalizeGitlabLanguages(languages.data)
          : normalizeLanguages(languages.data);
        currentSources.push(source("languages", languages));
      })(),
      (async () => {
        const contributors = projectForge(project) === "gitlab"
          ? await gitlabRequest(gitlabProjectEndpoint(project, "/repository/contributors", "?per_page=1"))
          : await githubRequest(`/repos/${project.owner}/${project.repo}/contributors?anon=true&per_page=1`);
        record.contributors = projectForge(project) === "gitlab"
          ? parseGitlabTotal(contributors, contributors.data.length)
          : parseLastPage(contributors.link, contributors.data.length);
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
          ? record.latestRelease?.tagName || record.latestTag?.name || record.defaultBranch
          : record.defaultBranch;
        const refType = versionCurrent && record.latestRelease?.tagName
          ? (record.latestRelease.prerelease ? "prerelease-tag" : "stable-release-tag")
          : versionCurrent && record.latestTag?.name
            ? "repository-tag"
            : "default-branch";
        record.loc = await measureLoc(project, measuredRef, refType, previous?.loc);
        if (record.loc.status === "measured") {
          currentSources.push({
            type: "loc-measurement",
            url: projectTreeUrl(project, record.loc.measuredRef),
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
    generator: "scripts/refresh-open-source-metrics.mjs",
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
      generator: "scripts/refresh-open-source-metrics.mjs",
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

  const credentials = [githubToken ? "GITHUB_TOKEN" : null, gitlabToken ? "GITLAB_TOKEN" : null].filter(Boolean);
  console.log(`Refreshing ${selected.length} project(s)${credentials.length ? ` with ${credentials.join(" and ")}` : " anonymously"}${options.includeLoc ? ", including eligible LOC" : ""}.`);
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
    generator: "scripts/refresh-open-source-metrics.mjs",
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
