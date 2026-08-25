# Comparison workspace operator acceptance

Run this checklist from the operator's seat before treating the comparison workspace as accepted.

## 1. Verify the build and catalog

Working directory: the repository root

```sh
npm run verify
```

Confirm that the command prints both of these signals (the exact product and repository counts may grow as the catalog expands):

- `Comparison data is valid:` followed by `9 categories`
- the Astro build completes successfully and includes the 9 category routes plus `/compare/`

## 2. Open the comparison

From the same directory, run:

```sh
npm run dev
```

Open the local URL printed by Astro, then visit `/compare/`. Confirm that it opens the Code IDEs matrix and that the site header contains “Compare tools”.

## 3. Exercise category navigation

Open each category link in order: Code IDEs, Extensions, Agent Multiplexers, Agent Orchestrators, Harnesses, Agent Traces, Cloud agents, General agents, and Remote.

Confirm that:

- the URL changes for every category;
- the current category is visibly selected;
- the matrix title, products, and category-specific criteria change;
- each product header shows its first-party vendor identity and compact documented-platform icons; an outlined `?` appears instead of guessed icons when platform support is not yet verified.

On Agent Traces, confirm that SpecStory is the first product, followed by Entire, Tapes, Traces, and AgentsView. Confirm that the criteria distinguish capture coverage, storage boundary, Git linkage, reconstruction, transcript/tool/artifact coverage, export, privacy, collaboration, analytics, and self-hosting; evidence gaps must render as `Unknown` rather than an inferred negative.

## 4. Exercise the matrix

On Agent Orchestrators, confirm that the matrix begins in the first viewport and uses the full available width. Open View controls and confirm the utility panel appears without permanently narrowing the matrix; close it with Escape and confirm focus returns to the disclosure. Scroll down and sideways inside the matrix. Confirm that the product headers remain pinned at the top and the Criterion column remains pinned at the left.

Then:

- search for a criterion such as `worktree`;
- choose “Research gaps” under Show;
- filter to a documented client platform;
- sort by name, stars, and repository activity;
- choose 2 to 4 products in Focus products and apply the selection;
- reload the page and confirm the query-backed view returns;
- press Reset view and confirm the full category returns.

The visible count beneath the controls should update after every filter.

## 5. Inspect evidence and freshness

Open several evidence links from capability and repository-metric cells. Confirm that each link names its evidence basis and checked date in its tooltip. Repository metrics should lead to the exact GitHub API endpoint or measured checkout when available.

Confirm these distinctions remain visible:

- `Unknown` means no supported conclusion was recorded;
- `Not tracked` means no public product-source repository is attached;
- “Latest verified stable release” does not show a repository-tag fallback;
- LOC copy names the measured ref;
- contributor copy describes GitHub contributor entries, not human contributors or recent activity.

## 6. Check narrow screens and no-JavaScript behavior

At 320px wide, confirm that View controls expands inline beneath its button and that one criterion column plus at least one product column remain usable, with sideways scrolling inside the matrix rather than across the whole page.

Disable JavaScript and reload. Confirm that the full native table remains readable and the page explains that filters and saved compare views require JavaScript.

## Not yet covered

- Four evidence-incomplete records—Mosaic Terminal, Airport, Muse Code, and Omnara—remain research backlog and are intentionally absent from public columns.
- The scheduled workflow must complete once with repository access to populate first-refresh metrics for newly added manifest entries and LOC for opted-in repositories.
- Proprietary product facts require continued manual first-party review; the GitHub collector cannot keep them current.
- Automated visual browser acceptance was unavailable in this work session. Responsive layout, focus order, sticky behavior, and control interaction still require the manual checks above.
