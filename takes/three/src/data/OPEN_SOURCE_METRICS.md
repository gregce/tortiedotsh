# Open-source project metrics

The comparison UI can build without forge tokens or a network connection by
reading the committed `open-source-metrics.json`. Refreshing the file is an
explicit maintenance operation; page builds never call GitHub or GitLab.

## Refresh

From `takes/three`:

```sh
node scripts/refresh-open-source-metrics.mjs
```

That fetches repository metadata (stars, forks, open issues, size, activity,
archive state, and detected license), languages, the newest chronologically
published stable release (or a clearly labelled newest prerelease when no
stable release exists), a separately labelled repository-tag fallback, and contributor count from each
repository's official forge API. Set `GITHUB_TOKEN` to raise GitHub's public
rate limit. Complete GitLab project statistics require `GITLAB_TOKEN` with
`read_api` scope and at least Reporter access to the tracked project; GitLab's
anonymous Projects API deliberately omits repository size and may omit archive
state. A refresh missing those fields is recorded as partial, never guessed.

LOC requires a shallow clone and can be expensive for large repositories, so
it runs in the scheduled refresh rather than during a page build:

```sh
node scripts/refresh-open-source-metrics.mjs --loc
```

The `--loc` mode requires `git` and `cloc`. Every currently tracked public-source
repository has `loc.enabled: true`; a future exception must be explicit and
justified in the manifest. Without `--loc`, the refresh retains previously
measured LOC; a first refresh records LOC as unknown. Use `--dry-run` to validate
and fetch without writing, `--project <id>` to limit a run, and `--help` for the
complete command summary.

After adding manifest entries, sync them into the committed fallback without
making network requests:

```sh
node scripts/refresh-open-source-metrics.mjs --sync-only
```

Existing last-known-good values are retained. New entries are emitted with
`status: "stale"` and unknown (`null`) metrics until a later API refresh.
This operation records `manifestSyncedAt` but deliberately preserves
`generatedAt`: reconciling IDs is not a successful data refresh.

## Manifest schema

`open-source-projects.json` is hand-curated. Add one object per official public
repository:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable UI/data join key. Never reuse an old ID. |
| `name` | string | Display name. |
| `category` | string | Comparison tab ID. |
| `forge` | `github` or `gitlab`? | Forge adapter; omitted means `github` for backwards compatibility. |
| `owner`, `repo` | string | Forge repository coordinates. |
| `githubUrl` | URL? | Exact GitHub repository URL for GitHub entries. |
| `repositoryUrl` | URL? | Exact non-GitHub human-facing repository URL. Required for GitLab. |
| `apiUrl` | URL | Exact official forge project/repository API URL. |
| `cloneUrl` | URL? | Exact HTTPS clone URL. Required for GitLab; derived for GitHub. |
| `metricScope` | string? | Visible boundary for what whole-repository statistics and CLOC actually cover. |
| `loc.enabled` | boolean | Whether scheduled shallow-clone LOC runs; this is `true` for every current public-source repository. |
| `loc.reason` | string? | Exceptional justification when LOC cannot be measured. |
| `release.mode` | `default-branch`? | Reviewed exception for repositories whose GitHub Releases feed contains non-product artifacts. |
| `release.reason` | string? | Required explanation for a release-policy exception. |
| `release.checkedAt` | date? | Human review date for the exceptional release policy; recheck within 120 days. |
| `release.rejectedCandidate` | object? | Exact GitHub artifact that demonstrated why automatic release inference was unsafe. |
| `license` | object? | Dated, source-linked license override. A single-license record uses `spdxId`, `name`, and `sourceUrl`; a mixed record uses `summary` plus non-empty `components[]` entries with `spdxId`, `name`, `scope`, and `sourceUrl`. |
| `loc.timeoutMinutes` | integer? | Optional 1–60 minute clone and CLOC timeout for unusually large canonical repositories; defaults to 10. |

The script validates IDs, categories, forge-qualified duplicate repositories,
canonical URLs, metric scopes, and license-component provenance before making
requests.

## Freshness guard

The weekly workflow refreshes repository data every Monday at 07:17 UTC, commits
the generated fallback and claim-source fingerprints when they change, and then runs:

```sh
npm run audit:freshness
```

The audit does not trust the file-level timestamp alone. It fails unless every
manifest repository has a generated record with `status: "current"`, no
section errors, a per-project refresh within 14 days, validated repository,
language, contributor, and release/tag provenance, and all required numeric
and identity fields. Every tracked public-source project must also have a
version-pinned source-only measurement, exact ref and commit SHA, declared
exclusion methodology, and verification from the same 14-day window. An
exceptional LOC opt-out must carry a reason in the manifest and a matching
`disabled` result.

The same audit fails when first-party capability evidence is older than 120
days or identity assets have not been reviewed for 180 days. A failure is a
maintenance signal, not permission to guess a new value: re-open the linked
first-party source, update the claim and its `checkedAt` date, or leave the cell
`Unknown`. Asset refreshes remain a reviewed operation because vendor sites
can return unrelated or malformed images even when a request succeeds.
Content-hash changes always block publication until reviewed. Sources that
reject automated clients may remain `unreachable` only while their explicit
human review is within the same 120-day window; this keeps bot-protected vendor
documentation honest without pretending the scheduled job can bypass it.
After a reviewer confirms that a changed page still supports every catalog use,
record that exact decision with `npm run refresh:evidence -- --accept-changed
<exact-url>`. The command accepts only a currently changed catalog URL, stores
the reviewed hash and timestamp, appends an audit entry to that source, and
never treats unrelated changed pages as reviewed.

When adding or replacing a small set of sources, refresh only those URLs without
spending the anonymous forge quota on the entire registry:

```sh
npm run refresh:evidence -- --url <exact-catalog-url>
```

`--url` is repeatable. Unselected registry entries retain their last observed
content, review history, and status; each selected URL must already be used by
the catalog.

## Shipping and continuous operation

The repository includes `.github/workflows/refresh-open-source-metrics.yml`.
Once this checkout is pushed to GitHub, run **Refresh comparison data** once
from the Actions tab before the first production deploy. The workflow then runs
every Monday at 07:17 UTC and:

1. refreshes every manifest repository through its GitHub or GitLab API;
2. measures source-only LOC for every public-source project at its resolved release/tag ref;
3. fingerprints every first-party capability source;
4. runs the strict per-project freshness audit; and
5. commits the two generated snapshots only when the entire audit passes.

The workflow token needs `contents: write` so the bot can commit the snapshots.
Add a `GITLAB_TOKEN` Actions secret with `read_api` and Reporter access to the
canonical GitLab project so the strict audit can validate GitLab size and
archive fields.
The comparison build remains deterministic and network-free: production reads
only the reviewed files in Git. Configure the hosting provider to run
`npm run audit:freshness` before `npm run build`, or make the refresh workflow a
required check, so stale or incomplete data cannot silently ship.

The current local checkout has no Git remote and its `gh` credential is invalid.
Those are deployment configuration tasks, not data-model gaps: configure the
remote/credential, push the repository, then run the first manual workflow.

Catalog products join through `comparison-catalog.ts` `repoMetricId`. Multiple
catalog products may deliberately share one repository metric. A public
repository is not automatically eligible: the pivoted Omnara repository no
longer represents the current companion SKU, so it has no metrics join. Warp is
now joined to `warpdotdev/warp` because the project explicitly identifies that
repository as the open-source client codebase under AGPL-3.0 and MIT terms.
Vibe Kanban remains joined to its canonical sunsetting repository so its
last-known repository history stays explicit.

## Generated schema

Every generated project has the manifest identity fields plus:

| Field | Type | Meaning |
| --- | --- | --- |
| `status` | `current`, `partial`, or `stale` | Overall refresh result. |
| `refreshedAt` | ISO timestamp or `null` | Last successful repository refresh. |
| `forge` | `github` or `gitlab` | Adapter that produced the record. |
| `repositoryUrl`, `cloneUrl` | URL | Canonical human and HTTPS clone URLs. `githubUrl` remains a compatibility alias for the human URL. |
| `metricScope` | string or `null` | Manifest-reviewed boundary for interpreting whole-repository values. |
| `stars` | integer or `null` | Forge-reported star count. |
| `forks` | integer or `null` | Forge-reported fork count. |
| `openIssues` | integer or `null` | Open issue count; GitHub's repository field includes pull requests, while GitLab's issues endpoint does not include merge requests. |
| `contributors` | integer or `null` | Count inferred from official forge contributor pagination. |
| `repositorySizeKb` | integer or `null` | Forge-reported repository size normalized to KiB; not a checkout's disk usage. |
| `pushedAt` | ISO timestamp or `null` | GitHub `pushed_at`, or the newest GitLab repository commit date. |
| `archived` | boolean or `null` | Current repository archive state. |
| `license` | object or `null` | Forge-detected license or manifest-reviewed single/mixed license, preserving mixed-license `summary` and scoped `components`. |
| `languages` | array | GitHub Linguist bytes and calculated percentage, or GitLab's official percentages with `bytes: null`. |
| `latestRelease` | object or `null` | Newest published non-draft stable release by date; when no stable exists, the newest prerelease with `prerelease: true`. |
| `latestTag` | object or `null` | Latest tag and its commit date, used when no release exists. |
| `version` | string or `null` | Compatibility field containing the release tag, otherwise latest repository tag. The UI does not present a fallback tag as a verified stable release. |
| `releaseDate` | ISO timestamp or `null` | Published date of `latestRelease`; remains unknown for tag-only projects. |
| `releasePolicy` | object or `null` | Reviewed exception and rejected GitHub candidate when a repository's Releases feed does not represent product releases. |
| `loc` | object | `code`, `comments`, `blank`, `files`, `measuredAt`, `verifiedAt`, `measuredRef`, `refType`, `commitSha`, tool, methodology and exact exclusions, and status; unavailable values are `null`, never zero. |
| `sources` | array | Exact forge API/repository URL and fetch timestamp for each metric source. |
| `errors` | array | Per-section errors that explain partial or stale data. |

Unknown and unavailable metrics are represented as `null`. A numeric zero means
GitHub or `cloc` actually reported zero. If a refresh section fails, the script
keeps the prior section where possible, marks the record partial/stale, and
records the failure instead of silently replacing a known value with zero.

## Source notes

- GitHub repository metadata comes from `GET /repos/{owner}/{repo}`. Releases
  come from `GET /repos/{owner}/{repo}/releases?per_page=100` and are ordered by
  `published_at`, avoiding a stale manually designated “latest” release;
  languages, tags, tag commits, and contributors use the corresponding official
  GitHub REST endpoints.
- GitLab repository metadata comes from
  `GET /projects/{url-encoded-path}?statistics=true&license=true`; open issues,
  newest commit, language percentages, contributors, releases, and tags use the
  corresponding project subresources. Every generated source stores the exact
  queried URL. GitLab's repository-size statistics require Reporter access.
- GitLab releases are filtered for non-upcoming releases and sorted by
  `released_at`; if none exist, the collector falls back to the latest official
  repository tag without presenting that tag as a verified release.
- LOC is a point-in-time `cloc` count over a shallow clone. It excludes Markdown,
  JSON, YAML, TOML, XML, delimited/text/lock files, dependency trees, build
  output, coverage output, and common generated-code directories so the public
  number describes source code rather than repository documentation or data.
  The exact extension and directory exclusion lists are stored with every
  measurement. The script checks out the latest stable release tag when one
  exists, otherwise a clearly labelled newest prerelease tag when published,
  and otherwise the current default branch at an exact commit;
  it never treats an arbitrary repository tag as a release. The output records
  the exact ref, ref type, and commit SHA. LOC is not comparable to
  GitHub language bytes, which measure bytes rather than lines.
- Shallow checkouts set `GIT_LFS_SKIP_SMUDGE=1`: large binary LFS payloads are
  not downloaded, avoiding vendor quota failures and keeping binary assets out
  of source LOC. Pointer files are not recognized source languages by CLOC.
- Before repeating an unchanged LOC measurement, the collector queries the
  installed `cloc --version` and resolves the remote release/tag/branch ref with
  `git ls-remote`. It reuses a count only when the exact commit SHA, methodology,
  and recorded `cloc` version all match. Otherwise it reclones and reruns CLOC,
  recording the exact queried tool version. The `source-code-v2` extension and
  directory exclusions remain unchanged.

GitHub API documentation: <https://docs.github.com/en/rest>

GitLab API documentation: <https://docs.gitlab.com/api/projects/>,
<https://docs.gitlab.com/api/repositories/>,
<https://docs.gitlab.com/api/releases/>, and
<https://docs.gitlab.com/api/tags/>
