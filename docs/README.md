# Maintainer documentation

The public site is a static Astro application whose runtime data is committed to Git. These documents cover the operational work that sits outside the visitor-facing documentation.

- [Comparison data and refresh operations](operations/comparison-data-refresh.md) explains catalog ownership, repository metrics, evidence monitoring, scheduled refreshes, and failure recovery.
- [Comparison workspace acceptance](acceptance/comparison-workspace.md) is the manual browser test for the published matrix.
- [September 2026 product gap canvass](research/15-product-gap-canvass-2026-09-13.md) ranks missing and newly launched products for the next catalog expansion.

Visitor documentation is defined in [`src/data/docs.ts`](../src/data/docs.ts) and published under `/docs/`.
