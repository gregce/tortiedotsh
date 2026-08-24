# Comparison data and refresh operations

This guide explains how tortie.sh stores, reviews, refreshes and publishes comparison data. Use it when you deploy the site, add a product, investigate a failed refresh or review changed documentation.

The main rule is simple: the public site reads reviewed files from Git. It does not scrape vendors or forges when a visitor loads a page.

## Service model

The comparison has 2 update paths:

- numeric repository facts update automatically after validation
- semantic product claims change only after a person reviews first-party evidence

This split keeps volatile counts current without letting a changed marketing page silently alter a product score.

```text
Official forges                 Official product documentation
       |                                      |
       v                                      v
Repository collector                 Evidence monitor
       |                                      |
       v                                      v
Metrics and source-only CLOC       Content fingerprints
       |                                      |
       +------------------+-------------------+
                          |
                          v
                 Strict freshness audit
                          |
                  pass ---+--- fail
                    |           |
                    v           v
             Commit snapshots   Keep last reviewed snapshot
                    |
                    v
             Hosting rebuilds site
```

## Data ownership

The comparison uses reviewed source files and generated snapshots. Do not edit a generated snapshot to fix a source problem.

| File | Ownership | Purpose |
| --- | --- | --- |
| [`comparison-catalog.ts`](../../takes/three/src/data/comparison-catalog.ts) | reviewed by a person | categories, products, rows, profile facts, capability claims and evidence |
| [`open-source-projects.json`](../../takes/three/src/data/open-source-projects.json) | reviewed by a person | canonical forge identities, metric scope, license exceptions, release policies and CLOC settings |
| [`open-source-metrics.json`](../../takes/three/src/data/open-source-metrics.json) | generated | current forge facts, releases, tags, languages, contributors and CLOC |
| [`comparison-evidence-status.json`](../../takes/three/src/data/comparison-evidence-status.json) | generated | content fingerprints and retrieval state for catalog evidence URLs |
| [`comparison-assets.json`](../../takes/three/src/data/comparison-assets.json) | generated from a reviewed source map | local product and platform assets with provenance |
| `unknown-audit-*.json` | reviewed by a person | exact rationale and sources checked for every rendered Unknown cell |
| [`refresh-open-source-metrics.mjs`](../../takes/three/scripts/refresh-open-source-metrics.mjs) | application code | GitHub and GitLab metrics, release resolution and CLOC |
| [`refresh-comparison-evidence.mjs`](../../takes/three/scripts/refresh-comparison-evidence.mjs) | application code | documentation retrieval, normalization, fingerprinting and review acceptance |
| [`fetch-comparison-assets.mjs`](../../takes/three/scripts/fetch-comparison-assets.mjs) | application code with reviewed mappings | first-party product and platform asset retrieval |
| [`validate-comparison-data.mjs`](../../takes/three/scripts/validate-comparison-data.mjs) | application code | catalog, provenance, Unknown-ledger and freshness gates |
| [`refresh-open-source-metrics.yml`](../../.github/workflows/refresh-open-source-metrics.yml) | deployment automation | scheduled refresh, validation and snapshot commit |

The files in [`docs/research/`](../research/) preserve discovery and editorial decisions. They support future reviews but do not render the live matrix.

## Published data flow

Astro builds the comparison from committed data. The build does not need GitHub, GitLab or vendor documentation to be online.

[`ComparisonPage.astro`](../../takes/three/src/components/ComparisonPage.astro) joins data by stable ID:

1. `comparison-catalog.ts` supplies the product and its claims.
2. `repoMetricId` joins an eligible product to `open-source-metrics.json`.
3. The product ID joins to `comparison-assets.json`.
4. Evidence URLs join to `comparison-evidence-status.json`.
5. Unknown ledgers prove that every rendered Unknown has been reviewed.

Several products can share one repository record. For example, a CLI and an IDE extension can live in the same monorepo. The visible metric scope must say what the repository count covers.

## Catalog claims

The catalog is the editorial source of truth. Each product has:

- a stable product ID
- one category and an intentional editorial order
- an official product URL
- an optional canonical public repository
- an optional metrics join
- documented platforms
- source and execution models
- a primary object and lifecycle status
- sparse category claims

Do not alphabetise categories, products or rows. Their order is part of the editorial model.

### Controlled claim states

Capability claims use these states:

| State | Meaning |
| --- | --- |
| `built-in` | the exact product provides the capability directly |
| `via-extension` | an extension adds the capability |
| `via-integration` | another product or service supplies the capability |
| `limited` | the product provides a narrower form with a documented boundary |
| `not-available` | affirmative first-party or reproduced evidence establishes absence |
| `unknown` | the research did not establish a supported conclusion |
| `not-applicable` | the criterion does not apply to this product type |

Missing claims become `Unknown`. They do not become `Not available`.

### Evidence requirements

A known profile fact must have at least one source. A scored claim must use first-party or reproduced evidence.

Each evidence record stores:

- a descriptive title
- an exact HTTPS URL
- an evidence basis
- a review date in `YYYY-MM-DD` format

The validator rejects scored claims based only on community reports or unverified inference. It also rejects `Not available` without affirmative evidence.

The current catalog helper applies `COMPARISON_SNAPSHOT` as the default review date for catalog evidence. Advancing this date represents a full catalog review. Do not change it after reviewing only one source. The evidence registry records targeted changed-source acceptance separately, but the catalog-wide 120-day gate still requires a genuine review of catalog evidence. A future schema should allow per-claim review dates without weakening this gate.

## Repository manifest

Add public-source repositories to [`open-source-projects.json`](../../takes/three/src/data/open-source-projects.json). The manifest identifies what the collector should measure. The generated metrics file records what the forge returned.

Each manifest entry includes:

- a stable metrics ID
- the product-facing name and category
- the canonical forge, owner and repository
- exact human, API and clone URLs
- a visible metric scope when the repository and product boundaries differ
- whether CLOC is enabled
- reviewed license or release exceptions where required

Use the canonical forge. Do not replace a GitLab upstream with an unofficial GitHub mirror to simplify collection.

### Repository relationships

The catalog records how a repository relates to a product:

| Relationship | Meaning |
| --- | --- |
| `product-source` | the repository is the canonical product source |
| `source-tree` | the repository contains a public source tree but may not represent the full shipped product |
| `metadata-only` | the repository contains packaging or metadata, not the product implementation |
| `deprecated-predecessor` | the repository describes an older product identity |

The matrix displays this boundary beside repository metrics.

## Repository refresh

Run the full collector from `takes/three`:

```sh
npm run refresh:metrics -- --loc
```

Use a token for GitHub to avoid the anonymous rate limit:

```sh
GITHUB_TOKEN="$(gh auth token)" npm run refresh:metrics -- --loc
```

Refresh selected repositories with repeatable IDs:

```sh
npm run refresh:metrics -- --loc \
  --project specstory \
  --project entire
```

Use a lower concurrency for large repositories or restricted networks:

```sh
npm run refresh:metrics -- --loc --concurrency 2
```

Use `--dry-run` to fetch and validate without writing. Use `--sync-only` after a manifest edit to add or remove generated records without pretending a network refresh succeeded.

### Collected repository fields

The collector records:

- stars
- forks
- open issues
- repository contributor entries
- repository size where the forge exposes it
- default branch
- newest commit activity
- archive status
- detected or reviewed license
- language distribution
- latest release or repository-tag fallback
- release or tag date where available
- exact metric sources and fetch times
- source-only CLOC

A numeric zero means the forge or CLOC returned zero. Missing data remains `null` or uses an explicit typed policy. The collector does not turn an error into zero.

### GitHub collection

The GitHub adapter uses the official REST API for repository metadata, languages, contributors, releases, tags and tag commits.

It orders releases by `published_at`. It does not trust the manually designated latest release. It ignores drafts and future-dated candidates. It prefers the newest stable release and labels a prerelease when no stable release exists.

If releases do not represent product versions, the manifest records a reviewed default-branch policy. This avoids presenting unrelated extension or packaging releases as the product version.

### GitLab collection

The GitLab adapter uses the canonical GitLab project API. It uses public GraphQL for archive state and public repository tags when the Releases endpoint is not available anonymously.

GitLab restricts forge-reported repository-size statistics to project members with Reporter access or higher. A public upstream where that membership is unavailable uses a dated `forge-restricted` policy. The matrix displays `Not publicly exposed` instead of a blank or invented checkout size.

An optional `GITLAB_TOKEN` can expose more fields when its account has suitable upstream access. The weekly job does not require a role that the site owner cannot obtain.

## Source-only CLOC

Every tracked public-source repository currently enables CLOC. The collector measures a shallow checkout at the resolved release or tag. If no release or tag is suitable, it uses the reviewed default branch.

Each result records:

- code, comment, blank and file counts
- measurement and verification times
- measured ref and ref type
- exact commit SHA
- CLOC version
- methodology version
- excluded extensions and directories

The `source-code-v2` methodology excludes:

- Markdown and MDX
- JSON and JSONC
- YAML and YML
- TOML and XML
- CSV and TSV
- text and lock files
- dependency and vendor directories
- third-party source trees
- distribution and build output
- coverage output
- common generated-code directories

The collector can reuse a previous count only when all of these still match:

- methodology
- installed CLOC version
- resolved ref
- ref type
- remote commit SHA

If one value changes, it clones and counts again.

## Documentation evidence monitor

Run the evidence monitor from `takes/three`:

```sh
npm run refresh:evidence
```

The monitor enumerates every unique URL used by a known catalog profile or capability claim. It also records each product and field that uses the URL.

For GitHub sources, it converts:

- repository roots to the GitHub README API
- blob links to raw file URLs

For HTML, it removes scripts, styles, comments, tags and whitespace noise. It then hashes the normalized content with SHA-256.

Each source stores:

- original and resolved URLs
- fetch URL
- products and fields that use it
- HTTP status and content type
- content length
- ETag and Last-Modified values
- current and reviewed hashes
- first observation and latest check times
- review history
- retrieval errors

### Evidence states

| State | Meaning | Publish effect |
| --- | --- | --- |
| `current` | observed content matches the reviewed hash | passes while the review is fresh |
| `changed` | observed content differs from the reviewed hash | blocks the strict audit |
| `unreachable` | a previously captured source cannot be fetched | passes only while its human review is within 120 days |
| `awaiting-refresh` | the source has never returned usable content | blocks once it lacks a current reviewed baseline |

The monitor detects change. It does not decide what the new wording means.

### Review a changed source

When the weekly job reports a changed URL:

1. Open the exact first-party source.
2. Find every catalog field listed in `usedBy`.
3. Confirm that the current source still supports each claim.
4. Update claims, notes, states or URLs when the meaning changed.
5. Return unsupported claims to `Unknown`.
6. Advance the catalog evidence review date.
7. Accept the exact changed URL after review.

```sh
npm run refresh:evidence -- --accept-changed <exact-catalog-url>
```

The command only accepts a URL that is currently `changed`. It records the observed hash as reviewed and appends an audit entry.

Refresh a small set of existing catalog URLs with repeatable arguments:

```sh
npm run refresh:evidence -- \
  --url <first-exact-url> \
  --url <second-exact-url>
```

Use `--sync-only` after catalog URL edits. It reconciles the registry without making network requests. Use `--dry-run` to inspect a complete refresh without writing.

### Current documentation boundary

The evidence monitor watches URLs already attached to known catalog claims. It is not a whole-site crawler.

It stores hashes and retrieval metadata, not a permanent copy of each document body. A changed-source review therefore uses the live first-party page and the catalog claim. The planned discovery service should retain bounded normalized snapshots or diffs so reviewers can see what changed without turning this repository into an unlimited document archive.

It does not yet discover:

- a new documentation page that proves an Unknown capability
- a new product mentioned in release notes
- a new criterion implied by a product launch
- a moved page without a redirect
- a claim documented only in an unmonitored issue or changelog

The exact URLs listed as `sourcesChecked` in Unknown ledgers are also not all fingerprinted today. The ledgers prove that research happened, but the weekly monitor does not yet re-open every negative search surface.

The planned discovery service is specified later in this guide.

## Unknown audit ledgers

Every public non-platform Unknown cell must appear exactly once in an `unknown-audit-*.json` file.

Each product audit includes:

- the exact product ID
- first-party sources checked
- one entry per remaining Unknown row
- a product-specific rationale

The validator calculates every Unknown rendered by the live catalog. It compares those keys with all ledger files. Validation fails when a key is missing, duplicated or no longer rendered.

This rule prevents 2 common errors:

- adding an unresearched product with a large silent Unknown surface
- closing a catalog cell without reconciling its research ledger

Unknown means that checked sources did not establish a supported answer. It is not a negative claim.

## Identity assets

The comparison serves product and platform images from its own origin. It does not load vendor images at page view time.

[`fetch-comparison-assets.mjs`](../../takes/three/scripts/fetch-comparison-assets.mjs) contains a reviewed source mapping for every public product and platform.

The source preference is:

1. exact official product artwork
2. official product repository artwork
3. official vendor site icon
4. official product or vendor organisation avatar

Run a full refresh:

```sh
npm run refresh:assets
```

Fetch only missing entries:

```sh
npm run refresh:assets -- --missing-only
```

Refresh selected products:

```sh
npm run refresh:assets -- \
  --product jules \
  --product devin
```

Always inspect changed images before committing. A successful HTTP response does not prove that a favicon, avatar or dynamically generated artwork belongs to the intended product.

The current asset fetcher uses one reviewed `checkedAt` constant for the bundle. After a genuine asset review, advance that date in `fetch-comparison-assets.mjs`, rebuild the targeted assets and inspect the resulting manifest. Do not advance it merely because every HTTP request returned successfully.

The strict freshness window for reviewed assets is 180 days.

## Validation commands

Run structural validation during normal development:

```sh
npm run validate:data
```

This checks:

- category, row and product identity
- sequential editorial ordering
- evidence shape and allowed basis
- exact metrics manifest joins
- generated identity consistency
- public asset coverage and file existence
- exact Unknown-ledger parity across all categories
- exact evidence-registry coverage for known claim URLs

Run the deployment gate before publishing:

```sh
npm run audit:freshness
```

This adds time and completeness rules:

| Data | Maximum age | Required state |
| --- | --- | --- |
| repository metrics | 14 days | every project current with no section errors |
| CLOC verification | 14 days | measured at an exact current ref and SHA |
| evidence registry generation | 14 days | registry refreshed |
| first-party capability evidence | 120 days | reviewed, with no unresolved content change |
| identity assets | 180 days | reviewed first-party asset |

Run the full static build:

```sh
npm run build
```

The build writes 11 routes to `takes/three/dist`. It makes no forge or vendor requests.

## Weekly GitHub Actions job

The workflow in [`.github/workflows/refresh-open-source-metrics.yml`](../../.github/workflows/refresh-open-source-metrics.yml) runs every Monday at 07:17 UTC. You can also start it with `workflow_dispatch` from the Actions interface.

It performs these steps in order:

1. Checks out the repository.
2. Installs Node.js 22.
3. Installs CLOC.
4. Refreshes every official forge record with CLOC enabled.
5. Refreshes every known catalog evidence fingerprint.
6. Runs the strict freshness audit.
7. Commits the 2 generated snapshots when they changed.
8. Pushes the bot commit to the checked-out branch.

The workflow uses one concurrency group and does not cancel an active refresh. This prevents 2 jobs from writing competing snapshots.

The job has a 90-minute timeout. Large repositories can set a manifest-specific CLOC timeout up to 60 minutes.

### Failure behaviour

The workflow does not commit when refresh or validation fails.

This means:

- the deployed site keeps serving its last reviewed snapshot
- the failed run identifies the affected project or URL in its log
- no partial snapshot reaches the default branch
- the next deployment can be blocked by `audit:freshness` when the committed snapshot ages past its limit

The generated files on a failed runner are temporary. Reproduce the failure locally or rerun the workflow after fixing the source.

## First deployment

Set up the repository before deploying the site.

1. Push the current branch to GitHub.
2. Enable GitHub Actions.
3. Give Actions read and write access to repository contents.
4. Confirm that the workflow retains `permissions: contents: write`.
5. Decide how the bot will work with branch protection.
6. Run the `Refresh comparison data` workflow manually.
7. Confirm that the strict audit passes.
8. Connect the hosting provider to the default branch.
9. Configure the production build gate and output directory.

Use this production build command from the repository root:

```sh
npm --prefix takes/three run audit:freshness && \
npm --prefix takes/three run build
```

Publish this directory:

```text
takes/three/dist
```

The hosting provider should rebuild after every default-branch commit. The weekly bot commit then becomes the deployment trigger.

### Branch protection choices

The current workflow pushes directly. Choose one operating model before deployment:

| Model | Configuration | Trade-off |
| --- | --- | --- |
| direct bot commit | allow `github-actions[bot]` to write the default branch | simple and fully automatic for validated snapshots |
| automated pull request | change the workflow to open a data-refresh pull request | adds review and works with stricter branch protection |

Use an automated pull request if your default branch requires reviews for every change.

## Secrets and permissions

The scheduled job uses:

- GitHub's built-in `GITHUB_TOKEN` for API capacity and snapshot commits
- an optional `GITLAB_TOKEN` when the token owner has useful upstream access

Do not store tokens in the manifest, generated JSON, workflow commands or documentation.

The GitHub token needs:

- repository content read access
- repository content write access for the final snapshot commit

The collectors only make read requests to product repositories and documentation sources. The only external write is the final commit to this repository.

## Operator runbooks

### Confirm a healthy weekly refresh

1. Open the latest `Refresh comparison data` Actions run.
2. Confirm that repository refresh completed without partial or stale records.
3. Confirm that the evidence registry reported its status counts.
4. Confirm that `audit:freshness` passed.
5. Confirm that the job either committed a snapshot or reported no changes.
6. Confirm that the hosting provider deployed the resulting commit.

### Recover from a repository failure

1. Read the project ID and failed section in the Actions log.
2. Run a targeted local refresh with a forge token.
3. Inspect the generated record and its `errors` array.
4. Confirm that owner, repository and forge identity are still canonical.
5. Update redirects, release policy or license policy only from first-party evidence.
6. Run structural validation and the strict freshness audit.
7. Commit the corrected manifest, collector or generated snapshot separately.

```sh
GITHUB_TOKEN="$(gh auth token)" npm run refresh:metrics -- --loc --project <metric-id>
npm run validate:data
npm run audit:freshness
```

### Recover from a changed document

1. Run the evidence refresh locally to reproduce the changed state.
2. Find the URL in `comparison-evidence-status.json`.
3. Review every entry in `usedBy`.
4. Open the current first-party page.
5. Update affected catalog claims or evidence URLs.
6. Return unsupported claims to `Unknown` and update its ledger.
7. Accept the changed URL only after the semantic review.
8. Run both validators and build the site.

### Recover from an unreachable document

1. Check whether the URL moved or now requires client-side rendering.
2. Prefer a canonical first-party replacement with stable text.
3. For GitHub documentation, prefer an exact file or repository README.
4. Keep the old reviewed source only while its 120-day review window remains valid.
5. Do not use search snippets or community posts as substitute claim evidence.

### Add a product

1. Classify the exact product SKU using the taxonomy.
2. Add it to `comparison-catalog.ts` with a stable ID and editorial order.
3. Add documented profile facts and sparse supported claims.
4. Add exact first-party evidence to every known fact.
5. Add every remaining Unknown to the correct audit ledger.
6. Add a canonical repository manifest entry when public source exists.
7. Reuse an existing metrics ID when 2 SKUs share one repository.
8. Add a first-party product asset mapping.
9. Fetch the asset and inspect it.
10. Synchronise evidence URLs without network access.
11. Synchronise the metrics manifest without network access.
12. Run targeted network refreshes.
13. Run validation, freshness and the full build.

```sh
npm run refresh:evidence -- --sync-only
npm run refresh:metrics -- --sync-only
npm run refresh:assets -- --missing-only
npm run refresh:metrics -- --loc --project <metric-id>
npm run refresh:evidence -- --url <exact-catalog-url>
npm run validate:data
npm run audit:freshness
npm run build
```

### Change a canonical repository

Treat a repository rename, transfer or product pivot as an identity change.

1. Verify the redirect and current canonical owner from the official forge.
2. Update the catalog repository URL and manifest coordinates together.
3. Keep the stable metrics ID when the product identity remains continuous.
4. Reassess metric scope, source model and license.
5. Refresh the asset if it uses the old owner or product identity.
6. Run `--sync-only` before the network refresh.
7. Refresh the exact project with CLOC.
8. Validate generated identity parity.

### Update an identity asset

1. Find the exact first-party product artwork.
2. Update the reviewed mapping in `fetch-comparison-assets.mjs`.
3. Run a targeted asset refresh.
4. Inspect the local output at its rendered size and on both themes.
5. Confirm that the manifest records the correct source URL and review date.
6. Run `npm run validate:data`.

### Roll back a bad generated snapshot

Use a normal revert commit. Do not reset or rewrite shared history.

1. Identify the bot commit that introduced the snapshot.
2. Confirm that no catalog or schema change depends on it.
3. Revert that commit.
4. Fix the collector, source identity or policy.
5. Run a targeted refresh.
6. Run the strict audit before publishing the replacement.

## Adding full documentation discovery

The current system monitors known claim sources. A separate discovery service should search official documentation for new evidence and products.

This service should create review proposals. It should not edit public capability states without approval.

### Discovery inputs

Maintain a reviewed source configuration for each product:

- official documentation domains
- exact product and version boundaries
- XML sitemaps
- `llms.txt`
- official GitHub or GitLab documentation paths
- README files
- release notes and changelogs
- official release feeds
- documentation APIs
- Unknown-ledger `sourcesChecked` URLs

Do not crawl unrelated domains, search results, community mirrors or arbitrary links found inside vendor pages.

### Deterministic collection

The collector should store:

- canonical URL
- resolved URL
- document title
- headings
- normalized body text
- publication and update dates where exposed
- product and version identity
- repository ref and SHA for source documents
- content hash
- first-seen and last-seen times
- retrieval state and error

Use domain-specific adapters where available. Prefer, in order:

1. raw repository files at an exact ref
2. official documentation APIs
3. `llms.txt` and sitemaps
4. server-rendered HTML
5. a controlled browser renderer for essential JavaScript-only pages

Set page, depth, size and time limits per product. Respect robots rules and vendor rate limits.

### Candidate analysis

After collection, compare new and changed documents with:

- current catalog claims
- category row definitions
- current Unknown rationales
- product identity and source boundaries
- previous document snapshots

The system can suggest:

- an Unknown that may now be closable
- a known claim that may no longer be supported
- a new platform or execution model
- a product rename or lifecycle change
- a new category row candidate
- a newly discovered product

Each suggestion must include the exact source, affected cells, old text, new text and a bounded rationale.

### Review pull request

Run discovery monthly and open a pull request containing:

- new, removed and changed official pages
- affected products and matrix rows
- proposed claim changes
- proposed Unknown closures
- proposed new rows or products
- unresolved identity conflicts
- retrieval failures

Keep semantic changes out of the weekly automatic snapshot commit. A reviewer should approve them before they change the catalog.

The discovery workflow should upload its crawl report as a workflow artifact even when validation fails. This gives reviewers a durable change report, unlike the current weekly runner where an uncommitted failed refresh exists only for the life of that runner and its logs.

### Unknown-source monitoring

The first discovery improvement should add every Unknown ledger `sourcesChecked` URL to a monitored registry.

When one of those sources changes, the report should identify the product and all Unknown cells that cited the source during research. This turns new documentation into a focused re-audit instead of another full manual search.

The future schema should also replace the catalog-wide evidence date with per-source or per-claim review dates. That change must preserve exact consumer mapping and the 120-day review gate.

### Safe automation boundary

The service may automate:

- URL discovery within reviewed domains
- retrieval and normalization
- content fingerprints
- exact diff generation
- affected-cell mapping
- candidate suggestions
- pull request creation

It must not automatically:

- promote an inferred capability to `built-in`
- turn silence into `Not available`
- merge adjacent product SKUs
- treat a framework capability as a shipped product capability
- accept a changed evidence hash without reviewing all consumers
- replace first-party evidence with search snippets or community reports

## Monitoring and maintenance cadence

Use this operating cadence:

| Frequency | Work |
| --- | --- |
| weekly | automatic forge refresh, CLOC, known evidence fingerprints, validation and snapshot commit |
| after a failed run | inspect and resolve the named project, source or freshness gate |
| monthly | review changed and unreachable evidence, run documentation discovery when implemented |
| quarterly | broader product discovery, taxonomy review and Unknown re-audit |
| within 120 days | re-review capability evidence and exceptional policies |
| within 180 days | re-review identity assets |

## Deployment acceptance

Before treating the deployed refresh system as accepted, confirm these observable results:

1. A manual workflow run passes without local credentials.
2. The run commits changed snapshots with the GitHub Actions bot identity.
3. The host deploys that bot commit.
4. The production matrix shows the new `generatedAt` time.
5. A test branch with an intentionally stale metric fails `audit:freshness`.
6. A test branch with an intentionally changed evidence hash fails `audit:freshness`.
7. A failed refresh does not commit partial data.
8. The next successful run replaces the failed snapshot cleanly.
9. Product pages load without third-party image or data requests.
10. Branch protection does not prevent the chosen bot or pull-request model.

Use the separate [comparison workspace acceptance script](../acceptance/comparison-workspace.md) for browser layout, navigation, responsive behaviour and evidence-link checks.

## Command reference

Run these commands from `takes/three` unless stated otherwise.

| Command | Purpose |
| --- | --- |
| `npm run validate:data` | check structural data, evidence, assets and Unknown parity |
| `npm run audit:freshness` | run the production completeness and age gate |
| `npm run refresh:metrics` | refresh forge metrics without running CLOC |
| `npm run refresh:metrics -- --loc` | refresh forge metrics and source-only CLOC |
| `npm run refresh:metrics -- --project <id>` | refresh one metrics record |
| `npm run refresh:metrics -- --sync-only` | reconcile the manifest without network access |
| `npm run refresh:evidence` | refresh every known catalog evidence fingerprint |
| `npm run refresh:evidence -- --url <url>` | refresh one known catalog URL |
| `npm run refresh:evidence -- --accept-changed <url>` | accept one semantically reviewed changed source |
| `npm run refresh:evidence -- --sync-only` | reconcile catalog URLs without network access |
| `npm run refresh:assets` | rebuild the reviewed identity asset bundle |
| `npm run refresh:assets -- --missing-only` | fetch only missing identity assets |
| `npm run refresh:assets -- --product <id>` | refresh one product asset |
| `npm run build` | build the deterministic static site |
| `npm run dev` | run the local development server |
