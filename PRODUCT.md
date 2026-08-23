# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers who run or evaluate AI coding tools and need to understand which kind of product they are looking at before comparing features. They may be choosing an editor, an agent-native IDE, a worktree orchestrator, a terminal workspace, or a coding-agent CLI. Tortie visitors also need an honest way to see where Tortie fits among adjacent tools.

## Product Purpose

Tortie.sh explains Tortie and hosts a current, evidence-backed map of AI developer tools. The comparison surface helps a reader compare like with like across category-specific axes, then inspect the source and freshness of each claim. Success means a reader can identify the right category, narrow a large field to a useful shortlist, and understand the tradeoffs without relying on marketing language.

## Positioning

The comparison is category-aware. It does not flatten editors, agent IDEs, worktree orchestrators, terminal workspaces, remote-control tools, and coding-agent harnesses into one misleading scorecard. Open-source project health is refreshed from repository data, while product capabilities stay tied to primary-source evidence and explicit review dates.

## Operating Context

- Public static Astro site at tortie.sh.
- The landing page remains a concise product introduction. The comparison is a dedicated `/compare` operating surface.
- Research begins with `docs/research/`, the Tortie source and research in `/Users/gdc/gmux`, and the Orca source and documentation in `/Users/gdc/orca`.
- Readers often arrive on desktop for broad comparison, but category navigation and product shortlisting must remain usable from 320px wide.

## Capabilities and Constraints

- Products are organized into mutually understandable primary categories, with cross-category tags for genuine overlap.
- Products run across the top of each category matrix. Feature axes run down the left; documented platforms collapse into compact icons in each product header.
- Category selection is URL-addressable and works without JavaScript.
- Every capability value distinguishes confirmed support, confirmed absence, partial support, unknown, and not applicable.
- Claims link to primary evidence and carry a review date.
- Open-source records can refresh latest release, release date, repository activity, contributors, language mix, size, and estimated source lines where the source allows it.
- Repository metrics are context, not a product-quality score.
- The first catalog favors depth and evidence over speculative breadth. The schema is designed to grow.
- No customer, pricing, benchmark, popularity, or capability claim may be invented.

## Brand Commitments

- Name: Tortie. The TORTIE.sh wordmark law and cat mark remain unchanged.
- The comparison surface inherits the established `takes/three` Tortie tokens, system type, cool graphite materials, blue accent, tight radii, and 1px hairlines.
- Amber remains semantic: the comparison uses it only for evidenced partial or limited support, never as decoration.
- The voice is plain, specific, and evidence-led. It avoids hype and false rankings.

## Evidence on Hand

- `docs/research/01-exemplars.md`, `02-framework-and-graphics.md`, and `03-design-brief.md` define the site and its visual/technical constraints.
- `/Users/gdc/gmux/docs/research/04-agent-managers.md` and `24-agent-workspace-product-inventory.md` contain a primary-source competitor inventory.
- `/Users/gdc/gmux/docs/research/02-agent-resume.md` documents coding-agent persistence and resume behavior.
- `/Users/gdc/orca` contains a current worktree-orchestrator implementation and its supported-agent documentation.
- No hands-on usability testing exists for most third-party products. Source-based capability claims must not be presented as experiential rankings.

## Product Principles

1. Compare like with like before comparing features.
2. Show the source, date, and uncertainty behind every consequential claim.
3. Keep “unknown” visibly different from “no” and “not applicable.”
4. Make a large field scannable without reducing it to a single score.
5. Automate volatile repository facts and review product claims deliberately.

## Accessibility & Inclusion

The matrix uses native table semantics, keyboard-operable navigation and filters, visible focus, text labels in addition to symbols, and no color-only status. It must not cause page-level horizontal overflow from 320px wide; wide comparison content scrolls inside its own labeled region. Reduced-motion preferences disable nonessential transitions.
