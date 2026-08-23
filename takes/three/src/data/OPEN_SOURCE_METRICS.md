# Open-source project metrics

The comparison UI can build without a GitHub token or a network connection by
reading the committed `open-source-metrics.json`. Refreshing the file is an
explicit maintenance operation; page builds never call GitHub.

## Refresh

From `takes/three`:

```sh
node scripts/refresh-open-source-metrics.mjs
```

That fetches repository metadata (stars, forks, open issues, size, activity,
archive state, and detected license), languages, the latest stable GitHub
release, a separately labelled repository-tag fallback, and contributor count
from GitHub's official REST API. Anonymous
requests work but are subject to GitHub's low public rate limit. Set
`GITHUB_TOKEN` to raise that limit. The scheduled workflow uses its built-in,
read-only-for-API GitHub token and commits only the generated data file.

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
| `owner`, `repo` | string | GitHub repository coordinates. |
| `githubUrl` | URL | Raw human-facing official repository URL. |
| `apiUrl` | URL | Raw official GitHub REST repository URL. |
| `loc.enabled` | boolean | Whether scheduled shallow-clone LOC runs; this is `true` for every current public-source repository. |
| `loc.reason` | string? | Exceptional justification when LOC cannot be measured. |
| `release.mode` | `default-branch`? | Reviewed exception for repositories whose GitHub Releases feed contains non-product artifacts. |
| `release.reason` | string? | Required explanation for a release-policy exception. |
| `release.checkedAt` | date? | Human review date for the exceptional release policy; recheck within 120 days. |
| `release.rejectedCandidate` | object? | Exact GitHub artifact that demonstrated why automatic release inference was unsafe. |
| `license` | object? | Dated, source-linked SPDX override when GitHub reports `NOASSERTION` for a license established by the canonical repository. |

The script validates IDs, categories, duplicate repositories, and both URLs
before making requests.

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

## Shipping and continuous operation

The repository includes `.github/workflows/refresh-open-source-metrics.yml`.
Once this checkout is pushed to GitHub, run **Refresh comparison data** once
from the Actions tab before the first production deploy. The workflow then runs
every Monday at 07:17 UTC and:

1. refreshes every manifest repository through GitHub's API;
2. measures source-only LOC for every public-source project at its resolved release/tag ref;
3. fingerprints every first-party capability source;
4. runs the strict per-project freshness audit; and
5. commits the two generated snapshots only when the entire audit passes.

The workflow token needs `contents: write` so the bot can commit the snapshots.
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
| `stars` | integer or `null` | GitHub `stargazers_count`. |
| `forks` | integer or `null` | GitHub `forks_count`. |
| `openIssues` | integer or `null` | GitHub `open_issues_count`, which includes pull requests. |
| `contributors` | integer or `null` | Count inferred from GitHub's paginated contributors API, including anonymous contributors. |
| `repositorySizeKb` | integer or `null` | GitHub's repository `size` value; not a checkout's disk usage. |
| `pushedAt` | ISO timestamp or `null` | Repository `pushed_at` value. |
| `archived` | boolean or `null` | Current repository archive state. |
| `license` | object or `null` | GitHub's detected license key, name, SPDX ID, and URL; `null` is a verified no-license-detected result after a current repository refresh. |
| `languages` | array | GitHub Linguist language bytes and calculated percentage. |
| `latestRelease` | object or `null` | Latest non-draft, non-prerelease GitHub release. |
| `latestTag` | object or `null` | Latest tag and its commit date, used when no release exists. |
| `version` | string or `null` | Compatibility field containing the release tag, otherwise latest repository tag. The UI does not present a fallback tag as a verified stable release. |
| `releaseDate` | ISO timestamp or `null` | Published date of `latestRelease`; remains unknown for tag-only projects. |
| `releasePolicy` | object or `null` | Reviewed exception and rejected GitHub candidate when a repository's Releases feed does not represent product releases. |
| `loc` | object | `code`, `comments`, `blank`, `files`, `measuredAt`, `verifiedAt`, `measuredRef`, `refType`, `commitSha`, tool, methodology and exact exclusions, and status; unavailable values are `null`, never zero. |
| `sources` | array | Exact GitHub API/repository URL and fetch timestamp for each metric source. |
| `errors` | array | Per-section errors that explain partial or stale data. |

Unknown and unavailable metrics are represented as `null`. A numeric zero means
GitHub or `cloc` actually reported zero. If a refresh section fails, the script
keeps the prior section where possible, marks the record partial/stale, and
records the failure instead of silently replacing a known value with zero.

## Source notes

- Repository stars, size, default branch, and timestamps come from
  `GET /repos/{owner}/{repo}`.
- Language bytes come from `GET /repos/{owner}/{repo}/languages`.
- Releases come from `GET /repos/{owner}/{repo}/releases/latest`; repositories
  without a release fall back to `GET /repos/{owner}/{repo}/tags` and the tag's
  official commit record.
- Contributor count comes from the pagination metadata on
  `GET /repos/{owner}/{repo}/contributors?anon=true`.
- LOC is a point-in-time `cloc` count over a shallow clone. It excludes Markdown,
  JSON, YAML, TOML, XML, delimited/text/lock files, dependency trees, build
  output, coverage output, and common generated-code directories so the public
  number describes source code rather than repository documentation or data.
  The exact extension and directory exclusion lists are stored with every
  measurement. The script checks out the latest stable release tag when one
  exists and otherwise measures the current default branch at an exact commit;
  it never treats an arbitrary repository tag as a release. The output records
  the exact ref, ref type, and commit SHA. LOC is not comparable to
  GitHub language bytes, which measure bytes rather than lines.
- Before repeating an unchanged LOC measurement, the collector resolves the
  remote release/tag/branch ref with `git ls-remote`. If its exact commit SHA
  still matches *and the methodology version is unchanged*, it advances
  `verifiedAt` without relabelling the original `measuredAt`; if the ref or
  methodology changed, it reclones and reruns `cloc`.

GitHub API documentation: <https://docs.github.com/en/rest>
