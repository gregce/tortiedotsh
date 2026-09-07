import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fetchWithRetry, repositoryIdentityMatches } from "../lib/repository-refresh.mjs";
import { main, refreshProject } from "../refresh-open-source-metrics.mjs";

const project = {
  id: "codewhale", name: "CodeWhale", category: "code-ides",
  owner: "Hmbown", repo: "CodeWhale",
  githubUrl: "https://github.com/Hmbown/CodeWhale",
  apiUrl: "https://api.github.com/repos/Hmbown/CodeWhale",
  loc: { enabled: true },
};
const priorDate = "2026-08-30T00:00:00.000Z";
const previous = {
  ...project, metricScope: null, status: "current", refreshedAt: priorDate,
  repositoryUrl: project.githubUrl, cloneUrl: `${project.githubUrl}.git`,
  stars: 10, defaultBranch: "main", languages: [{ name: "JavaScript", bytes: 100, percentage: 100 }],
  version: "v1.0.0", latestRelease: { tagName: "v1.0.0", prerelease: false },
  loc: { status: "measured", code: 300, measuredRef: "v1.0.0", measuredAt: priorDate, verifiedAt: priorDate, commitSha: "a".repeat(40) },
  sources: [
    { type: "repository", url: project.apiUrl, fetchedAt: priorDate },
    { type: "languages", url: `${project.apiUrl}/languages`, fetchedAt: priorDate },
    { type: "latest-release", url: `${project.apiUrl}/releases?per_page=100`, fetchedAt: priorDate },
    { type: "loc-measurement", url: `${project.githubUrl}/tree/v1.0.0`, fetchedAt: priorDate },
  ],
  errors: [],
};
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });

function mockForge(t, failSection = null) {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    if (url === project.apiUrl) {
      if (failSection === "repository") return json({}, 401);
      const canonical = failSection === "identity" ? "https://github.com/another/Codewhale" : "https://github.com/Hmbown/Codewhale";
      return json({ html_url: canonical, clone_url: `${canonical}.git`, stargazers_count: 42, default_branch: "main", forks_count: 2, size: 100, open_issues_count: 1, archived: false });
    }
    if (url.endsWith("/languages")) return failSection === "languages" ? json({}, 401) : json({ JavaScript: 500 });
    if (url.includes("/contributors?")) return json([{ login: "example" }]);
    if (url.includes("/releases?")) return failSection === "version" ? json({}, 401) : json([
      { tag_name: "v1.1.0", name: "v1.1.0", published_at: priorDate, html_url: `${project.githubUrl}/releases/tag/v1.1.0`, draft: false, prerelease: false },
    ]);
    throw new Error(`Unexpected request: ${url}`);
  });
  return calls;
}

test("GitHub casing changes pass the same identity rule used by validation", () => {
  assert.equal(repositoryIdentityMatches(project, {
    ...previous, owner: "hmbown", repo: "Codewhale",
    repositoryUrl: "https://github.com/Hmbown/Codewhale", cloneUrl: "https://github.com/Hmbown/Codewhale.git",
  }), true);
  for (const change of [
    { cloneUrl: "https://github.com/another/Codewhale.git" },
    { repo: "different" }, { owner: "different" }, { forge: "gitlab" },
    { metricScope: "different" }, { cloneUrl: null },
  ]) assert.equal(repositoryIdentityMatches(project, { ...previous, ...change }), false);
});

test("GitLab identity does not inherit GitHub's casing rule", () => {
  const gitlab = { ...project, forge: "gitlab", repositoryUrl: "https://gitlab.com/Example/Project", cloneUrl: "https://gitlab.com/Example/Project.git" };
  const record = { ...gitlab, metricScope: null };
  assert.equal(repositoryIdentityMatches(gitlab, record), true);
  assert.equal(repositoryIdentityMatches(gitlab, { ...record, cloneUrl: record.cloneUrl.toLowerCase() }), false);
});

function retryOptions(responses) {
  const waits = [];
  const signals = [];
  const options = {
    fetchImpl: async (_url, init) => {
      signals.push(init.signal);
      const result = responses.shift();
      if (result instanceof Error) throw result;
      return result;
    },
    wait: async (ms) => { waits.push(ms); }, random: () => 0, now: () => 0, onRetry: () => {},
  };
  return { options, waits, signals };
}

test("504 and network timeouts recover with bounded backoff and fresh signals", async () => {
  const retry = retryOptions([json({}, 504), new DOMException("timed out", "TimeoutError"), json({ ok: true })]);
  assert.equal((await fetchWithRetry("https://example.com", {}, retry.options)).status, 200);
  assert.deepEqual(retry.waits, [2000, 4000]);
  assert.equal(new Set(retry.signals).size, 3);
});

test("503 exhaustion stops after three attempts", async () => {
  const retry = retryOptions([json({}, 503), json({}, 503), json({}, 503)]);
  assert.equal((await fetchWithRetry("https://example.com", {}, retry.options)).status, 503);
  assert.deepEqual(retry.waits, [2000, 4000]);
});

test("network failures stop after three attempts and programming errors fail immediately", async () => {
  const networkError = new TypeError("fetch failed");
  const retry = retryOptions([networkError, networkError, networkError]);
  await assert.rejects(fetchWithRetry("https://example.com", {}, retry.options), /fetch failed/);
  assert.deepEqual(retry.waits, [2000, 4000]);
  const invalid = retryOptions([new TypeError("invalid argument")]);
  await assert.rejects(fetchWithRetry("https://example.com", {}, invalid.options), /invalid argument/);
  assert.deepEqual(invalid.waits, []);
});

test("permanent HTTP errors are not retried", async () => {
  for (const status of [400, 401, 403, 404, 422]) {
    const retry = retryOptions([json({}, status)]);
    assert.equal((await fetchWithRetry("https://example.com", {}, retry.options)).status, status);
    assert.deepEqual(retry.waits, []);
  }
});

test("rate-limit retries respect server headers and never retry before a long reset", async () => {
  const retry = retryOptions([json({}, 429, { "retry-after": "10" }), json({})]);
  await fetchWithRetry("https://example.com", {}, retry.options);
  assert.deepEqual(retry.waits, [60_000]);
  for (const headers of [
    { "retry-after": "120" },
    { "x-ratelimit-remaining": "0", "x-ratelimit-reset": "120" },
    { "retry-after": new Date(120_000).toUTCString() },
  ]) {
    const long = retryOptions([json({}, 403, headers)]);
    assert.equal((await fetchWithRetry("https://example.com", {}, long.options)).status, 403);
    assert.deepEqual(long.waits, []);
  }
});

test("failed languages keep their values and source date while stars update", async (t) => {
  mockForge(t, "languages");
  const record = await refreshProject(project, previous, false);
  assert.equal(record.status, "partial");
  assert.equal(record.stars, 42);
  assert.deepEqual(record.languages, previous.languages);
  assert.equal(record.sources.find((source) => source.type === "languages").fetchedAt, priorDate);
  assert.notEqual(record.sources.find((source) => source.type === "repository").fetchedAt, priorDate);
  assert.equal(repositoryIdentityMatches(project, record), true);
});

test("a failed version lookup retains release-tag LOC instead of counting main", async (t) => {
  mockForge(t, "version");
  const record = await refreshProject(project, previous, true);
  assert.equal(record.version, "v1.0.0");
  for (const key of Object.keys(previous.loc)) assert.deepEqual(record.loc[key], previous.loc[key]);
  assert.deepEqual(record.errors.map((error) => error.section), ["version", "loc"]);
  assert.equal(record.sources.find((source) => source.type === "loc-measurement").fetchedAt, priorDate);
});

test("daily metadata refresh cannot clear a weekly LOC failure", async (t) => {
  mockForge(t);
  const record = await refreshProject(project, { ...previous, errors: [{ section: "loc", message: "clone failed" }] }, false);
  assert.equal(record.status, "partial");
  assert.equal(record.errors[0].section, "loc");
  assert.equal(record.loc.verifiedAt, priorDate);
});

test("repository transfers cannot overwrite previously reviewed metrics", async (t) => {
  const calls = mockForge(t, "identity");
  const record = await refreshProject(project, previous, false);
  assert.equal(record.status, "stale");
  assert.equal(record.stars, 10);
  assert.equal(record.refreshedAt, priorDate);
  assert.equal(record.cloneUrl, previous.cloneUrl);
  assert.match(record.errors[0].message, /review the manifest/);
  assert.equal(calls.length, 1);
});

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "tortie-refresh-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const manifest = join(directory, "manifest.json");
  const output = join(directory, "metrics.json");
  const report = join(directory, "report.json");
  await writeFile(manifest, JSON.stringify({ schemaVersion: 1, projects: [project] }));
  await writeFile(output, JSON.stringify({ schemaVersion: 1, generatedAt: priorDate, projects: [previous] }));
  // Tests must not append fixture results to the real workflow's job summary.
  const summary = process.env.GITHUB_STEP_SUMMARY;
  process.env.GITHUB_STEP_SUMMARY = join(directory, "summary.md");
  t.after(() => { if (summary === undefined) delete process.env.GITHUB_STEP_SUMMARY; else process.env.GITHUB_STEP_SUMMARY = summary; });
  return { output, report, args: ["--manifest", manifest, "--output", output, "--report", report] };
}

test("CLI remains strict by default; allow-partial opts into reported valid updates", async (t) => {
  const files = await fixture(t);
  mockForge(t, "languages");
  assert.equal(await main(files.args), 2);
  assert.equal(await main([...files.args, "--allow-partial"]), 0);
  const report = JSON.parse(await readFile(files.report, "utf8"));
  assert.deepEqual(report.counts, { current: 0, partial: 1, stale: 0 });
  assert.equal(report.projects[0].errors[0].section, "languages");
  assert.equal(JSON.parse(await readFile(files.output, "utf8")).projects[0].stars, 42);
});

test("total collection failure cannot replace the snapshot, even with allow-partial", async (t) => {
  const files = await fixture(t);
  const original = await readFile(files.output, "utf8");
  mockForge(t, "repository");
  await assert.rejects(main([...files.args, "--allow-partial"]), /Every selected repository refresh failed/);
  assert.equal(await readFile(files.output, "utf8"), original);
  assert.equal(JSON.parse(await readFile(files.report, "utf8")).counts.stale, 1);
});

test("dry-run leaves data unchanged and still writes diagnostics", async (t) => {
  const files = await fixture(t);
  const original = await readFile(files.output, "utf8");
  mockForge(t);
  assert.equal(await main([...files.args, "--dry-run"]), 0);
  assert.equal(await readFile(files.output, "utf8"), original);
  assert.equal(JSON.parse(await readFile(files.report, "utf8")).counts.current, 1);
});

test("diagnostic output cannot overwrite the snapshot or manifest", async (t) => {
  const files = await fixture(t);
  const original = await readFile(files.output, "utf8");
  await assert.rejects(main([...files.args, "--report", files.output]), /must not overwrite/);
  await assert.rejects(main([...files.args, "--report", files.args[1]]), /must not overwrite/);
  assert.equal(await readFile(files.output, "utf8"), original);
});
