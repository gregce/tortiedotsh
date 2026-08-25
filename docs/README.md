# Maintainer documentation

The public site is a static Astro application whose runtime data is committed to Git. These documents cover the operational work that sits outside the visitor-facing documentation.

- [Comparison data and refresh operations](operations/comparison-data-refresh.md) explains catalog ownership, repository metrics, evidence monitoring, scheduled refreshes, and failure recovery.
- [Comparison workspace acceptance](acceptance/comparison-workspace.md) is the manual browser test for the published matrix.

Visitor documentation is defined in [`src/data/docs.ts`](../src/data/docs.ts) and published under `/docs/`.
