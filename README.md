# Tortie.sh

The public website for [Tortie](https://github.com/gregce/tortie), a calm macOS agent multiplexer with familiar IDE features. The site includes the product landing page, searchable documentation, release changelog, and an evidence-backed comparison of developer tools.

Production: [tortie.sh](https://tortie.sh)

## Local development

Use Node.js 22 or later.

```sh
npm install
npm run dev
```

Astro serves the site at the URL printed in the terminal. The `predev` hook copies the pinned HyperFrames and GSAP browser bundles into `public/`; those generated files are not committed.

## Verify and build

```sh
npm run verify
npm run preview
```

`npm run verify` validates all comparison data, builds the static site, creates the Pagefind documentation index, verifies full-text search, and checks shared routes and interaction contracts. The production output is written to `dist/`.

## Site optimization loop

Run a complete operator-acceptance pass against the production site:

```sh
npm run optimize:site -- --label operator-acceptance
```

The loop:

1. Runs the full `npm run verify` suite.
2. Searches GitHub for promising comparison candidates and writes the review queue to `.audit/site-quality/<label>/comparison-candidates/`.
3. Audits built pages for titles, descriptions, canonical URLs, headings, crawl directives, sitemaps, structured answer-engine surfaces, and the custom 404.
4. Runs `npx is-agentic` against the deployed site.
5. Requests Google PageSpeed Insights for mobile and desktop, then runs local Lighthouse audits as a deterministic fallback.
6. Writes raw reports and an iteration summary to `.audit/site-quality/<label>/`, with the latest result at `.audit/site-quality/latest.json`.

The default target is `https://tortie.sh`. Useful options include:

```sh
# Audit another deployment without running candidate discovery
npm run optimize:site -- --label preview --url https://preview.example.com --skip-discovery

# Fail when the static audit or Lighthouse thresholds regress
npm run optimize:site -- --label release-gate --enforce

# Avoid anonymous PageSpeed API quota limits
PAGESPEED_API_KEY=your-key npm run optimize:site -- --label operator-acceptance
```

The reports in `.audit/` are local evidence and are intentionally ignored by Git.

## Project structure

```text
src/
  components/   Astro UI components
  data/         Documentation, changelog, comparison catalog, and snapshots
  layouts/      Shared document shell, metadata, navigation, and analytics
  pages/        Astro file-based routes
  scripts/      Browser-side interaction code
  styles/       Global tokens and page-specific styles
public/         Versioned static media and comparison identity assets
scripts/        Validation, synchronization, and evidence-maintenance tools
docs/           Maintainer operations and manual acceptance checks
.github/        Scheduled changelog and comparison-data refreshes
```

## Comparison data

The comparison renders only reviewed data committed to Git. It does not scrape vendors or repositories when a visitor loads a page.

```sh
npm run validate:data
npm run audit:freshness
npm run refresh:metrics
npm run refresh:evidence
npm run refresh:assets
```

Repository metrics and source fingerprints are refreshed by scheduled GitHub Actions. Capability claims remain tied to first-party evidence and require human review. See [comparison data operations](docs/operations/comparison-data-refresh.md) for the full maintenance contract.

## Changelog

The public changelog is synchronized from [gregce/tortie](https://github.com/gregce/tortie):

```sh
npm run refresh:changelog
```

The scheduled workflow commits a changed feed so production builds remain deterministic and independent of GitHub availability.

## Deployment and analytics

Vercel builds the root Astro project with `npm run build`. `@vercel/analytics` is included in the shared layout, so page views are collected by Vercel Web Analytics after the feature is enabled for the project.

Local Vercel project metadata lives in `.vercel/` and is intentionally ignored. GitHub is the source of truth for production deployments.

## License

Apache License 2.0. See [LICENSE](LICENSE).
