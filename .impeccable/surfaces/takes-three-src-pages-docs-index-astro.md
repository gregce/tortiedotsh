---
version: 1
slug: "takes-three-src-pages-docs-index-astro"
primary_target: "takes/three/src/pages/docs/index.astro"
related_targets: ["takes/three/src/pages/docs/[slug].astro", "takes/three/src/pages/docs/changelog/index.astro", "takes/three/src/components/DocsShell.astro", "takes/three/src/components/DocsArticle.astro", "takes/three/src/components/Nav.astro", "takes/three/src/styles/docs.css"]
---

Scope: Tortie's embedded documentation and repository-backed changelog. Visitor mode: Read, understand, and verify.

Audience and job: developers evaluating Tortie who need to install it, understand its durable-session model, learn the daily workflow, and verify current capabilities without reading the source tree.

Task and content: provide a direct getting-started path; explain Projects, Sessions, Splits, Attention, Catch Me Up, recovery, files, source control, remote work, supported agents, and shortcuts; keep release notes at `/docs/changelog/`; retain an explicit link to GitHub from the uniform site header.

Constraints: claims must be supported by `/Users/gdc/gmux`. tmux remains an implementation detail. Quitting and reboot recovery are described separately. The current release is Apple-silicon only. There are 11 launchable agents; capture-only IDE watchers are not described as launchable agents. The comparison matrix remains unchanged apart from the shared header.

Direction: use the user-pinned cmux documentation shell as the structural exemplar—a compact uniform header, contextual `/ docs` lockup, narrow searchable rail, quiet active row, restrained reading column, anchored headings, and release-first changelog entries. Interpret it through Tortie's true-black graphite world, silver type, and single blue action accent. Do not copy cmux's product hierarchy, theme switcher, or feature vocabulary.

Responsive behavior: the rail remains pinned on desktop and becomes one disclosure below the shared header on smaller screens. Article content stays single-column and tables keep their own horizontal overflow.

Search: Pagefind indexes the rendered docs and changelog during production builds. Results appear inline beneath the rail input, target the strongest matching section, show highlighted excerpts, and push the table of contents downward. Development mode falls back honestly to the curated guide index when the generated search bundle is unavailable.
