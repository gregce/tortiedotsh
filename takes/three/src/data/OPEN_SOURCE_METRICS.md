# Open-source project metrics

The comparison UI can build without a GitHub token or a network connection by
reading the committed `open-source-metrics.json`. Refreshing the file is an
explicit maintenance operation; page builds never call GitHub.

## Refresh

From `takes/three`:

```sh
node scripts/refresh-open-source-metrics.mjs
```

That fetches repository metadata, languages, the latest stable GitHub release,
a separately labelled repository-tag fallback, and contributor count from
GitHub's official REST API. Anonymous
requests work but are subject to GitHub's low public rate limit. Set
`GITHUB_TOKEN` to raise that limit. The scheduled workflow uses its built-in,
read-only-for-API GitHub token and commits only the generated data file.

LOC is intentionally opt-in because it requires a shallow clone and can be
expensive for large repositories:

```sh
node scripts/refresh-open-source-metrics.mjs --loc
```

The `--loc` mode requires `git` and `cloc`. It runs only for manifest entries
whose `loc.enabled` is `true`. Without `--loc`, the refresh retains previously
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
| `loc.enabled` | boolean | Whether scheduled shallow-clone LOC is practical. |
| `loc.reason` | string? | Why LOC is disabled, for maintainers and UI notes. |

The script validates IDs, categories, duplicate repositories, and both URLs
before making requests.

## Freshness guard

The weekly workflow refreshes repository data every Monday at 07:17 UTC, commits
the generated fallback when it changes, and then runs:

```sh
npm run audit:freshness
```

The audit fails when repository metrics are older than 14 days, first-party
capability evidence is older than 120 days, or identity assets have not been
reviewed for 180 days. A failure is a maintenance signal, not permission to
guess a new value: re-open the linked first-party source, update the claim and
its `checkedAt` date, or leave the cell `Unknown`. Asset refreshes remain a
reviewed operation because vendor sites can return unrelated or malformed
images even when a request succeeds.

Catalog products join through `comparison-catalog.ts` `repoMetricId`. Multiple
catalog products may deliberately share one repository metric (for example,
VS Code and its Copilot surface). A public repository is not automatically
eligible: Warp's public repository is not the shipped product source, and the
pivoted Omnara repository no longer represents the current companion SKU, so
neither has a metrics join. Vibe Kanban remains joined to its canonical
sunsetting repository so its last-known repository history stays explicit.

## Generated schema

Every generated project has the manifest identity fields plus:

| Field | Type | Meaning |
| --- | --- | --- |
| `status` | `current`, `partial`, or `stale` | Overall refresh result. |
| `refreshedAt` | ISO timestamp or `null` | Last successful repository refresh. |
| `stars` | integer or `null` | GitHub `stargazers_count`. |
| `contributors` | integer or `null` | Count inferred from GitHub's paginated contributors API, including anonymous contributors. |
| `repositorySizeKb` | integer or `null` | GitHub's repository `size` value; not a checkout's disk usage. |
| `languages` | array | GitHub Linguist language bytes and calculated percentage. |
| `latestRelease` | object or `null` | Latest non-draft, non-prerelease GitHub release. |
| `latestTag` | object or `null` | Latest tag and its commit date, used when no release exists. |
| `version` | string or `null` | Compatibility field containing the release tag, otherwise latest repository tag. The UI does not present a fallback tag as a verified stable release. |
| `releaseDate` | ISO timestamp or `null` | Published date of `latestRelease`; remains unknown for tag-only projects. |
| `loc` | object | `code`, `comments`, `blank`, `files`, `measuredAt`, `measuredRef`, `refType`, `commitSha`, tool, and status; unavailable values are `null`, never zero. |
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
- LOC is a point-in-time `cloc` count over a shallow clone. The script checks out
  the latest stable release tag when one exists, then the latest tag, and only
  falls back to the default branch when no current tag is available. The output
  records the exact ref, ref type, and commit SHA. LOC is not comparable to
  GitHub language bytes, which measure bytes rather than lines.

GitHub API documentation: <https://docs.github.com/en/rest>
