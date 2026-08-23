# Comparison workspace operator acceptance

Run this checklist from the operator's seat before treating the comparison workspace as accepted.

## 1. Verify the build and catalog

Working directory: `/Users/gdc/tortiedotsh/takes/three`

```sh
npm run verify
```

Confirm that the command prints both of these signals:

- `Comparison data is valid: 50 products, 7 categories, 32 metrics repositories.`
- `9 page(s) built` followed by `Complete!`

## 2. Open the comparison

From the same directory, run:

```sh
npm run dev
```

Open the local URL printed by Astro, then visit `/compare/`. Confirm that it opens the Editors matrix and that the site header contains “Compare tools”.

## 3. Exercise category navigation

Open each category link: Editors, Agent IDEs, Orchestrators, Harnesses, Extensions, Cloud agents, and Remote.

Confirm that:

- the URL changes for every category;
- the current category is visibly selected;
- the matrix title, products, and category-specific criteria change;
- each product header shows its first-party vendor identity and compact documented-platform icons; an outlined `?` appears instead of guessed icons when platform support is not yet verified.

## 4. Exercise the matrix

On Orchestrators, confirm that the matrix begins in the first viewport and the controls sit in a narrow rail to its left. Scroll down and sideways inside the matrix. Confirm that the product headers remain pinned at the top and the Criterion column remains pinned at the left.

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

At 320px wide, confirm that View controls collapses behind one button and that one criterion column plus at least one product column remain usable, with sideways scrolling inside the matrix rather than across the whole page.

Disable JavaScript and reload. Confirm that the full native table remains readable and the page explains that filters and saved compare views require JavaScript.

## Not yet covered

- Four evidence-incomplete records—Mosaic Terminal, Airport, Muse Code, and Omnara—remain research backlog and are intentionally absent from public columns.
- The scheduled workflow must complete once with repository access to populate first-refresh metrics for newly added manifest entries and LOC for opted-in repositories.
- Proprietary product facts require continued manual first-party review; the GitHub collector cannot keep them current.
- Automated visual browser acceptance was unavailable in this work session. Responsive layout, focus order, sticky behavior, and control interaction still require the manual checks above.
