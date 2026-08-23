# 05. Comparison matrix UX specification

> Implementation revision, 2026-08-23: operator feedback moved the matrix ahead of the controls. The desktop implementation now uses a narrow left utility rail, a nearly full-viewport matrix, compact vendor identity headers, and platform icons inside each product header instead of four repetitive platform rows. At narrow widths the rail collapses behind “View controls”. The native table, explicit evidence states, URL-backed category navigation, and no-JavaScript table remain unchanged.

## Decision

Build the comparison as a dedicated Operate-mode workspace at `/compare/`, not as another long section inside the Take Three landing page. The landing page has one job: explain Tortie and lead to a download. The matrix has a different job: let an operator investigate, narrow, compare, and verify a large body of changing facts. Putting both modes in one document would weaken both.

The workspace inherits Take Three's visual system: graphite canvas, system type, one blue accent, 1px hairlines, small radii, no ornamental cards, and the Tortie lockup in the global bar. It changes the density and interaction model. This surface is compact, persistent, and evidence-first.

The central object is a real comparison table. Products remain columns and criteria remain rows at every width. Desktop shows the full category. Mobile preserves the table instead of turning every product into a card, because cards destroy side-by-side comparison.

## Audit of the established design

Take Three is a strong source of visual authority. Its useful properties are:

- The 52px sticky product bar already creates a credible application shell.
- Hierarchy comes from type, spacing, and hairlines rather than a field of containers.
- The palette has enough neutral steps for dense interaction states without inventing color.
- Blue already means current or actionable. Amber is reserved for an agent that needs input and must not be reused for data freshness.
- The desktop and 390px screenshots demonstrate a sound 320px-and-up layout discipline.
- The implementation uses native links, headings, sections, visible focus, 44px primary targets, and no required client framework. The Impeccable detector returned no mechanical findings for `takes/three/src` and its verification screenshots.

The current landing-page scale cannot simply be reused. Its 1120px container, display lockup, spacious bands, 15px to 17px prose, and one-dimensional reading flow are right for Persuade mode but wrong for a matrix. The comparison route should use the same tokens at application density: 11px metadata, 13px cells, 44px rows, and the full viewport width.

## Information architecture

Use URL-addressable category tabs. The initial set is expected to include:

- Code editors and IDEs
- Agent IDEs
- Orchestrators
- Agent harnesses

The research taxonomy may add a category, but it must not add another interaction pattern. A product may appear in more than one category when its role genuinely crosses boundaries. It has one canonical product record and category-specific claims, so changing a release date does not require updating several copies.

Canonical routes:

```text
/compare/editors/
/compare/agent-ides/
/compare/orchestrators/
/compare/harnesses/
```

Filter state is shareable in a query string:

```text
/compare/orchestrators/?products=tortie,conductor,orca&show=differences&os=macos
```

Category changes use real route navigation and browser history. Filters use `history.replaceState` while the operator adjusts them and `pushState` when they explicitly save a compare set. Reloading or sharing a URL reconstructs the same view. Product order in the query is product order in the matrix.

The comparison route contains, from top to bottom:

1. The existing 52px global Tortie bar.
2. A 44px category navigation bar.
3. A 48px matrix toolbar.
4. The matrix viewport, which consumes the remaining height.
5. An evidence sheet that opens over or beside the matrix.

There is no second hero. The route title and current data snapshot live in the toolbar: `Compare / Orchestrators` and `Snapshot updated 23 Aug 2026`.

## The comparison model

Do not force every category through one universal feature list. Use a shared spine followed by category-specific groups. This keeps cross-category facts consistent without reducing distinct products to vague checks.

### Shared spine in every category

1. **Availability**: product status, supported operating systems, native/web/remote access, install methods, supported CPU architectures, and local versus hosted execution.
2. **Commercial and legal**: source availability, license, free tier, paid model, self-hosting, account requirement, telemetry controls, and offline capability.
3. **Interoperability**: API, CLI, extensions, MCP, import/export, webhooks, and documented integration surface.
4. **Project health**: latest stable release, release date, release cadence, last repository activity, source lines of code, contributors, commit authors in the last 90 days, releases in the last 12 months, and repository scope.
5. **Data quality**: product version evaluated, last verified date, source count, and known coverage gaps.

### Code editors and IDEs

- Editing and language intelligence
- Terminal, debugger, tasks, and source control
- Extension ecosystem and compatibility
- Collaboration and remote development
- Built-in agent functions and supported external agents
- Workspace scale, startup model, and resource use where evidence is reproducible

### Agent IDEs

- Editor, file, terminal, diff, and source-control surfaces
- Supported harnesses and model/provider options
- Session durability, resume, and background execution
- Concurrent sessions, splits, project scoping, and navigation
- Agent supervision, permissions, approval, and interruption
- Worktree, branch, environment, and remote execution models
- Review, handoff, artifact, and merge workflow

### Orchestrators

- Unit of work and scheduling model
- Parallelism, fan-out, dependencies, queues, and retries
- Worktree, branch, container, VM, and remote isolation
- Harness assignment and multi-harness support
- Supervision, intervention, budgets, and stop controls
- Durable state, crash recovery, resume, and audit trail
- Artifact collection, review, merge, CI, and cleanup
- API, headless, team, and deployment model

### Agent harnesses

- Supported model providers and authentication
- Interactive, headless, SDK, and structured-output modes
- Tool use, shell, file editing, browser, image, and multimodal input
- Permissions, sandboxing, approval policy, and trust boundaries
- Context, memory, compaction, resume, and session export
- MCP, hooks, skills, commands, plugins, and subagents
- Cost, token, trace, and telemetry visibility
- Repository awareness, test loop, review, and version-control behavior

These are criterion groups, not rows. Each group expands into claims that can be answered precisely. Avoid rows such as `Good context management` or `Powerful orchestration`. Prefer `Can resume a named session after process exit` and `Can assign different harnesses to parallel tasks`.

Do not calculate an overall product score or declare a winner. Feature importance depends on the operator's job, and an aggregate score would hide both weighting and missing evidence.

## Cell vocabulary

Binary values are allowed only for truly binary claims. Most capability rows use this controlled vocabulary:

| Display value | Meaning |
| --- | --- |
| Built in | Ships in the product and requires no third-party component |
| Via extension | Available through the product's extension system |
| Via integration | Requires another product or service |
| Limited | Present with a material, stated constraint |
| Not available | Evidence establishes that the product does not provide it |
| Unknown | The research has not established an answer |
| Not applicable | The criterion does not logically apply to this product |

`Unknown` and `Not applicable` must never share a dash, blank, color, or glyph. Render the words in every case. `Unknown` uses muted text plus a question-mark icon and exposes `Research gap` in its accessible name. `Not applicable` uses secondary text plus a slash-circle icon and exposes the reason, such as `Not applicable because this is a hosted service`. `Not available` says `Not available`; it is not inferred from missing evidence.

Evidence quality is separate from the value. A value can be `Built in` while its basis is vendor documentation rather than direct verification. Evidence basis is one of:

- Reproduced
- Source inspected
- Vendor documented
- Repository derived
- Community reported
- Unverified

Never encode these states with color alone. Use text first, then a small neutral icon. Blue is reserved for focus, selection, and links. Amber remains unused on this surface. Red is used only for an actual ingestion failure, not an old record.

Free-form values stay short in the matrix. Lists show the first two items and `+4`; prose shows one factual line. Activating the source count opens the full claim and evidence.

## Matrix anatomy and dimensions

The matrix viewport scrolls on both axes and has a visible native scrollbar. It is a named focusable region. The page itself does not become thousands of pixels tall; the table owns the remaining viewport height.

| Part | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Feature column | 280px sticky left | 232px sticky left | 136px sticky left |
| Product column | 192px | 176px | 164px |
| Product header | 96px sticky top | 92px sticky top | 84px sticky top |
| Ordinary row | 44px minimum | 44px minimum | 48px minimum |
| Group row | 36px | 36px | 40px |
| Cell type | 13px / 20px | 13px / 20px | 12px / 18px |

The top-left `Feature` header sticks above the row labels and has the highest matrix z-index. Product headers stick to the top of the matrix viewport. Row headers stick to its left edge. A 1px strong border marks both frozen boundaries. The current row receives `--bg-raised` on hover or keyboard inspection. The current column gets a subtle `--accent-wash` only while a cell or product header in that column has focus.

Product headers contain product name, optional 24px mark, evaluated version, open-source label when true, and a `Product details` link. The name is never truncated without an accessible full value. Long names wrap to two lines. Product logos remain their real assets, but never add card backgrounds or uncontrolled brand color fields.

All products in the category are present by default, in a stable editorial order documented in the data file. The operator can sort by name, latest release, contributor count, or source LOC. Sorting always discloses the metric snapshot and puts unknown values last.

`Compare set` reduces the table to 2 to 4 chosen products. It does not pin columns inside an already wide table. This avoids compounded sticky-column behavior and gives the operator a clean, shareable focused view. `Show differences` hides rows where all selected products have the same normalized value. Each group heading reports the result, for example `Execution, 7 shown, 4 matching rows hidden`.

On mobile, the default remains the full horizontal matrix. A persistent `Focus products` control offers the 2 to 4 product compare set before the operator starts a long swipe. The sticky 136px feature label plus one 164px product column fits at 320px, so one claim is always readable with its label. Do not replace the table with stacked cards. Touch targets are at least 44px, and tapping a partially visible product header scrolls that column fully into view.

Do not hide the browser's horizontal scrollbar. A one-time text hint above the viewport says `Scroll sideways to compare products`. It disappears after the first horizontal movement and remains available to screen readers in the region description.

## Controls

The toolbar contains:

- Current category title and snapshot date
- Search across product names and criterion labels
- Product chooser with selected count
- `Show` menu: all rows, differences, unknowns, stale claims
- OS filter: macOS, Windows, Linux, web
- Sort menu
- `Reset view`

Search filters rows and product names but never searches hidden evidence text. This makes the result understandable. A result summary announces `18 criteria and 6 products shown` through a polite live region after a 250ms debounce.

Filters never silently remove an entire criterion group. Leave its group heading in place with `No rows match these filters`, plus a `Clear group filters` action. If the whole matrix is empty, keep the product header and show `No comparison rows match this view` with `Reset view`. A zero-result state must not resemble an unavailable dataset.

The product chooser is a searchable sheet with checkboxes. It offers `Show all`, `Select 2 to 4 for comparison`, and `Clear`. Selection does not apply until `Update matrix`, which prevents columns jumping while the operator is still choosing.

## Evidence and freshness

Every claim has an addressable evidence record. A compact source suffix such as `2 sources` links to `/compare/evidence/{claim-id}/`. With JavaScript, the link opens a non-modal right sheet on desktop and a modal bottom sheet on mobile. Without JavaScript, it opens the evidence page. The URL is copyable in both cases.

The evidence view contains:

- Product, criterion, and displayed value
- Evidence basis
- Source title and direct link
- Short supporting excerpt or derived calculation
- Product version, release tag, or commit SHA the claim describes
- First captured and last verified dates
- Researcher or automated collector
- Ambiguity note and reason for `Unknown` or `Not applicable`
- `Report a correction` link

On desktop the non-modal sheet is 420px wide, casts `--shadow-2`, closes with its labeled button or Escape, and returns focus to the source link. It does not use a scrim or trap focus, so the operator can inspect adjacent cells. On mobile the sheet is modal, uses the existing scrim token, traps focus, closes with Escape or the close button, and returns focus to its trigger.

Freshness appears at three levels:

- Dataset: snapshot date in the toolbar
- Product: latest successful product sync in the column header
- Claim: last verified date in evidence

Use exact dates in visible UI and relative age only as secondary text. `Verified 2026-08-20` is durable; `3 days ago` is not. A stale claim remains readable and is labeled `Verification due`. A failed refresh serves the last known good value, labels it `Refresh failed 2026-08-23`, and links to the failure record. Never replace useful last-known data with a spinner or blank cell.

Repository-derived metrics require visible methodology:

- Latest release means the newest non-prerelease tag unless a project documents another stable channel.
- Source LOC is measured from the evaluated release tag, excludes vendored, generated, build-output, lock, and fixture files, and states the monorepo subtree when scoped.
- Test LOC is separate from source LOC.
- Contributors means deduplicated commit authors for the measured repository history. Active authors in the last 90 days is a separate value.
- All counts link to the commit, tag, collector version, exclusions, and collection date.

Format large counts compactly in cells, such as `128k`, but expose the exact value in the accessible name and evidence. Never compare LOC collected with different exclusion rules.

## Semantic HTML, keyboard, and ARIA

Category tabs are URL-backed page navigation, not an in-page ARIA tab widget. Use:

```html
<nav aria-label="Comparison categories">
  <ul>
    <li><a href="/compare/editors/" aria-current="page">Code editors and IDEs</a></li>
    <!-- other category links -->
  </ul>
</nav>
```

Visually this remains a single horizontally scrollable tab strip. The current link uses primary text and a 2px accent edge; other links use secondary text. It does not use pill containers. Do not add `role="tablist"`, `role="tab"`, or `role="tabpanel"`. Those roles promise an in-page panel relationship that route navigation does not provide. Keyboard behavior remains native and exact: Tab and Shift+Tab move through category links in document order, Enter follows the focused link, Space scrolls the page, and arrow keys retain browser behavior. On a narrow screen, focusing a clipped category link progressively scrolls it into view, but navigation does not depend on that enhancement.

The matrix uses a native `<table>`, not a collection of divs and not `role="grid"`. It includes a concise `<caption>`, one `<thead>`, `<th scope="col">` product headers, and `<th scope="row">` criterion labels. Each criterion group is its own `<tbody>` with an associated group heading. Do not virtualize rows in the first release; a complete semantic table is more valuable than shaving initial rendering time before measurement proves a problem.

Wrap the table in:

```html
<div
  role="region"
  aria-label="Agent orchestrator comparison. Scroll sideways to compare products."
  tabindex="0"
>
  <!-- table -->
</div>
```

When the region itself has focus, native Arrow, Page Up, Page Down, Home, and End scrolling remains intact. Do not hijack these keys for cell navigation. Tab reaches native interactive elements such as product-detail and evidence links. Do not place a visually intrusive skip control over the category navigation or matrix header. The comparison is the page's primary task, and the compact category links plus native table structure provide the predictable route through it; evidence links remain concise and grouped by native row boundaries.

Sticky headers are the original header cells, not visual duplicates, so screen readers encounter one label. Every icon has adjacent text or an accessible name. Visible focus uses `--focus-ring` and is never clipped by the scroller. The product-order select has an explicit label and exposes its current value; `aria-sort` is not used because the operator is reordering product columns rather than sorting table rows by one data column. Filter result counts use `aria-live="polite"`; ordinary scrolling and hover do not announce.

At 200% zoom and 320 CSS pixels, the sticky feature column may shrink to 120px but product data never scales below 12px. Text wraps. No cell relies on a tooltip for its primary value.

## JavaScript-disabled behavior

The category routes, full matrix, sticky headers, two-axis scrolling, product-detail links, and evidence links work without JavaScript. Each category page statically renders every product and row in its canonical order. Evidence links navigate to ordinary evidence pages instead of opening sheets.

Search, filtering, compare-set reduction, column reordering, focus-column highlighting, live counts, and in-place evidence sheets are progressive enhancements. Hide those controls when JavaScript is unavailable and show one `<noscript>` note: `The full comparison is shown. Filtering and saved compare views require JavaScript.` A query string loaded without JavaScript may be ignored because the canonical full matrix is still present and usable.

There are no skeleton cells. Core data arrives in HTML. If a build cannot load current data, it publishes the last known good snapshot with a visible dataset failure notice; it does not publish an empty table.

## Operator-ready component and state specification

| Component | Required states | Operator action | Result and persistence |
| --- | --- | --- | --- |
| `GlobalBar` | Default, current Compare route | Follow Tortie home, GitHub, download | Native navigation |
| `CategoryNav` | Current, hover, focus, clipped | Choose category | Navigates to canonical route; category is in browser history |
| `MatrixToolbar` | Default, filtered, no results, stale snapshot | Search, filter, sort, reset | Updates visible rows/columns and query string; announces count |
| `ProductChooser` | All products, draft with 1 selected, valid 2 to 4, invalid over 4 | Choose focused compare set | `Update matrix` applies and serializes ordered product IDs; one selection asks for one more |
| `MatrixRegion` | Default, horizontal offset, vertical offset, keyboard focus | Scroll on either axis | Sticky feature and product headers preserve orientation |
| `ProductHeader` | Default, focused column, stale sync, refresh failed | Open product detail; add to compare set | Opens addressable product record; exposes exact evaluated version |
| `CriterionGroup` | Expanded, filtered-empty, matching rows hidden | Scan or skip group | Reports shown and hidden counts; remains present when empty |
| `ComparisonCell` | Value, limited, unavailable, unknown, not applicable, stale | Read concise fact; follow source count | Opens evidence; never infers a negative from unknown data |
| `EvidenceSheet` | Loading enhancement, ready, multiple sources, source unavailable | Inspect, copy URL, close, report correction | URL remains addressable; close restores focus |
| `DatasetNotice` | Current, verification due, refresh failed, offline snapshot | Inspect snapshot or failure | Last known good data stays visible |
| `EmptyFilterState` | Group empty, matrix empty | Clear group filters or reset view | Restores canonical rows without route loss |
| `NoScriptState` | JavaScript unavailable | Browse full matrix and evidence pages | No filter state; all core facts remain available |

### State precedence

1. A refresh failure labels the last known value; it does not change that value to `Unknown`.
2. `Unknown` means no supported conclusion exists.
3. `Not applicable` requires a recorded reason.
4. `Not available` requires affirmative evidence.
5. A stale label can accompany any known value.
6. Filter-empty and dataset-empty are different components and different copy.

## Acceptance checks from the operator's seat

1. Open the orchestrator route at 1440px. Scroll to the last product and the last criterion. The product header, current criterion label, and current category remain visible.
2. Open the same route at 320px. Read one complete product value beside its feature label, then swipe to another product without losing the label.
3. Choose Tortie, Conductor, and Orca, turn on differences, copy the URL, and open it in a new tab. Product order and filters are restored.
4. Keyboard through category navigation, matrix skip links, a product detail, and an evidence link. Focus stays visible and Escape returns focus after closing evidence.
5. Turn JavaScript off and reload a category URL. The full table scrolls in both directions, category links navigate, and evidence links open complete pages.
6. Inspect one `Unknown`, one `Not applicable`, and one `Not available` cell with color removed. All three remain distinguishable and each explains its state.
7. Inspect an open-source product's LOC and contributor values. Each exposes a release tag or commit, exclusions, collection date, and exact count.
8. Simulate a failed refresh. The previous value stays in place and the failure date is visible.
9. Zoom to 200%. Headers do not cover the first data row, focus rings are not clipped, and no primary value requires hover.
10. Apply filters that match no rows. The page offers a reset and does not resemble a data outage.

## Top usability risks

| Priority | Risk | Consequence | Required mitigation |
| --- | --- | --- | --- |
| P0 | Sticky layers lose alignment during two-axis scroll | Operators compare a value to the wrong product or feature | One scroll owner, original table headers, fixed column widths, and automated scroll-position screenshots at desktop and mobile widths |
| P0 | `Unknown` is presented as `No` | The matrix makes a false product claim | Controlled vocabulary, separate state styling, evidence-required negatives, and schema validation that forbids empty cells |
| P1 | A landing page and a research tool compete in one long surface | Download intent and comparison work both become harder | Dedicated `/compare/` workspace with the global Tortie bar as the bridge |
| P1 | Too many columns make the first view feel unusable | Operators abandon before discovering horizontal comparison | Visible scrollbar, sticky row labels, first-use scroll hint, searchable product chooser, and 2 to 4 product compare sets |
| P1 | Stale or version-mixed facts appear current | Decisions are based on incompatible snapshots | Dataset, product, and claim dates; evaluated versions; last-known-good failure states; metric methodology links |
| P1 | Category schemas become a wall of low-value checks | Important differences disappear in noise | Shared spine plus category-specific groups, precise testable rows, difference filter, and no aggregate score |
| P1 | Thousands of interactive cells create a keyboard burden | Keyboard users cannot efficiently cross the table | Native table reading order, no focus on static cells, skip-table and skip-group links, addressable evidence links |
| P2 | Mobile is converted to product cards | Side-by-side reasoning is lost | Preserve the table, show one feature/product pair at 320px, and offer a focused compare set |
| P2 | Product logos and state colors overwhelm Tortie's identity | The route becomes a noisy directory rather than a tool | Text-led headers, 24px maximum marks, neutral state language, and blue only for action/focus |
| P2 | Repository metrics become popularity theater | Large or old repositories look automatically better | No winner score, exact methodology, separate activity windows, stable sort disclosure, and unknown metrics last |

## Visual direction in one sentence

Take Three's lockup becomes a compact shell, its hairlines become the matrix structure, and its single blue accent marks only what the operator can act on or is currently inspecting.
