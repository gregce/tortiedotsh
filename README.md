# tortie.sh

This repo holds the landing page for Tortie, a macOS shell for agentic coding. The product is public at github.com/gregce/tortie under Apache 2.0. Three complete takes on the page live side by side in `takes/`. Each take is a separate static site built with Astro. Every take shares the same ground rules:

- The colors are the app's own 109 tokens from `assets/gmux-tokens.css`, with no new colors added.
- The wordmark follows the law, with TORTIE in capitals at weight 600 and .sh lowercase at weight 400 at the same size.
- The durable session demonstration plays as a seekable HyperFrames composition that never makes a request off its own origin.

## The three takes, ranked

An independent verifier rebuilt each take, served it locally, and drove it in an isolated headless Chrome. Every number below was measured on the built output. Gzip means the compressed size the browser actually downloads.

| Rank | Take | Directory | First paint, gzip | Whole page with live demo, gzip | Gate failures in the first round |
| --- | --- | --- | --- | --- | --- |
| 1 | The lockup | `takes/three` | 34.1 KB | about 85 KB | none |
| 2 | The session | `takes/two` | 24.3 KB | about 156 KB | none |
| 3 | The quiet monolith | `takes/one` | 5.8 KB | about 113 KB | three, all fixed |

The budget was 120 KB for first paint and 300 KB for the whole page. Every take passes both budgets.

**Take three, the lockup, ranks first.** The giant TORTIE.sh wordmark is the design. It measured 142px with the exact proportions the law requires, being weight 600 with 0.06em tracking on the name and weight 400 with 0.02em tracking on the suffix at the same size. All three visitor goals sit inside one viewport at 1440 and at 390 wide. It ships the lightest whole page of the three at about 85 KB. Verification found no gate failures, only two small cautions, and both were closed in the fix round. Its demo caption states the durability fact in the exact shape the writing rules ask for. The window quits. The session keeps working. The window reopens on the same conversation.

**Take two, the session, ranks second.** The page behaves like the product. The nav is the app's 36px band with its single hairline. Sections read as named sessions with status dots. Scrolling the page scrubs the demo timeline, and the verifier confirmed the mapping is monotonic across six scroll positions, from 0 s at the top to the full 13.0 s at the bottom. It had no gate failures. Its cautions were fixed at the source and re-verified, including a re-render of the MP4:

- The nav dropped the GitHub button on narrow screens. It now keeps both buttons down to 320px.
- The closing caption overlaid the terminal scrollback at 12.5 s. The composition now dims the window and moves the caption below the last terminal row.
- The social preview title was the bare product name. It is now the closing line of the demo.

**Take one, the quiet monolith, ranks third.** One narrow column with the demo as the single breakout element. It has the smallest first paint of the three at 5.8 KB. It ranked last because it was the only take that failed verification gates in the first round:

- The demo caption broke the writing rules by packing three facts into one sentence.
- The hero wordmark overflowed the 320px viewport by 9px.
- The play button stayed visible but dead with JavaScript off.

All three failures were fixed and shown passing with fresh measurements in the fix round.

## How to run a take

Each take builds with the same two commands. Run them inside the take's directory, e.g. `takes/three`.

```
npm install
npm run build
```

The static site lands in that take's `dist/`. `npm run preview` serves the built output. `npm run dev` serves a live reloading copy. Takes two and three copy the shared token file and brand assets into place before every build, so `assets/gmux-tokens.css` stays the single source of color.

## Where the research lives

The research was done before any take was built and it lives in `docs/research/`.

- `01-exemplars.md` measures ten landing pages for developer tools and states the winning shape. cmux.com, pi.dev, opencode.ai and cursor.com are among the ten.
- `02-framework-and-graphics.md` picks Astro 7 in static output mode and explains how HyperFrames plays one composition both as a live seekable timeline in the page and as a rendered MP4 fallback.
- `03-design-brief.md` is the brief all three takes build from. Sections 1 through 8 bind every take. Section 10 names the three directions.
- `04-comparison-taxonomy.md` defines the seven AI developer-tool categories, the 50-product launch catalog, evidence rules and the open-source freshness model.
- `05-matrix-ux-spec.md` specifies the dedicated comparison workspace, native table behavior, filters, accessibility and responsive rules.
- `06-comparison-evidence-audit.md` records the adversarial evidence review, launch blockers, and the remediation guardrails applied afterward.
- `07a-core-matrix-evidence.md` and `07b-agent-matrix-evidence.md` add the deeper row model and first-party claim ledger used by the expanded matrices.
- `07c-harness-closure-ledger.md` records the second-pass harness closures and the two adjacent workbench corrections.

## The comparison workspace

Take three includes a category-aware comparison at `/compare/`. It keeps editors, agent workbenches, orchestrators, coding-agent harnesses, IDE extensions, cloud agents and remote companions in separate matrices so unlike products are not forced into one scorecard.

The static product and evidence catalog lives in `takes/three/src/data/comparison-catalog.ts`. Volatile repository facts live in `open-source-metrics.json` and can be refreshed without changing the UI:

```sh
cd takes/three
npm run validate:data
npm run audit:freshness
npm run refresh:metrics
npm run refresh:assets
```

Run `npm run refresh:metrics -- --loc` to measure source lines for repositories that opt in. The scheduled GitHub workflow refreshes the committed fallback weekly. Builds never call GitHub, so the comparison continues to render when the API is unavailable.

Vendor and platform identity assets are committed locally with first-party provenance in `comparison-assets.json`; `refresh:assets` rebuilds that bundle without introducing runtime image requests.

The weekly metrics workflow also runs the freshness audit. It requires repository data no older than 14 days, first-party capability evidence no older than 120 days, and reviewed identity assets no older than 180 days. Automated metrics keep moving independently; a stale capability source fails the maintenance check rather than silently changing a product score.

The operator acceptance script is in `docs/acceptance/comparison-workspace.md`.

## Shared assets

- `assets/gmux-tokens.css` holds the app's color tokens. The takes copy this file verbatim and add no colors of their own.
- `assets/brand/` holds the cat mark in its dock, macos, menu-bar and master variants.

## What is not true yet

- The repo has no remote and nothing is deployed. tortie.sh does not serve any of these pages yet.
- No take has been chosen. The ranking above is the verifier's ordering, not a decision by the operator.
- The download links point at the latest GitHub release, so they depend on a release existing there.
