# 02. The framework and the graphics mode

Two decisions, stated first. The site is built with Astro 7 in static output mode. HyperFrames runs in both of its modes from one source. The hero demo plays as a seekable composition in the page through the player component, and the same composition is rendered to MP4 for the poster, the reduced motion fallback, and the social preview image.

## Decision 1. Framework

| Candidate | Version checked | Client JS by default | Verdict | Deciding reason |
| --- | --- | --- | --- | --- |
| Astro | 7.2.2 | zero | **Chosen** | Zero JS pages plus HTML componenting and scoped CSS. The HyperFrames player is a plain web component, so it needs one script tag and no framework integration |
| Plain Vite plus vanilla TS | 8.2.1 | zero | Rejected | No componenting. Every shared header and section gets hand rolled. Astro costs nothing more at runtime and gives structure |
| SvelteKit static | 2.70.2 | small hydration runtime per island | Rejected | The site has no reactive app state, so a compiler framework buys nothing |
| Next static export | 16.3.1 | React runtime, about 90 KB gzip | Rejected | The heaviest baseline for a page with no app logic. cmux.com uses it and its HTML alone is 794 KB |

The domain already points at Vercel. Astro static output deploys there with no adapter and no configuration. The integration shape is one script tag importing `@hyperframes/player`, then `<hyperframes-player src="/demos/durable-session/index.html">` in markup. If any page level motion needs GSAP, it loads the same way in one script tag. No islands framework is used because nothing on the page is React or Svelte.

## Decision 2. HyperFrames mode

How HyperFrames works, from reading the source at /Users/gdc/hyperframes. A composition is one HTML file. Elements carry `data-start` and `data-duration` attributes, and GSAP timelines register on `window.__timelines`. The player is a zero dependency web component that loads the composition in a sandboxed iframe. The page controls it with `play()`, `pause()` and `seek(seconds)`, so scroll or hover scrubbing is a few lines of page script. The producer renders the same file to MP4 with deterministic 30 fps seeks.

Measured weight of the published artifacts, version 0.7.108:

| Artifact | Raw | Gzip | Where it loads |
| --- | --- | --- | --- |
| `@hyperframes/player` global build | 58.3 KB | 16.2 KB | the page |
| `hyperframe.runtime.iife.js` | 377.9 KB | 113.0 KB | inside the iframe, deferred |
| GSAP 3.15.0 core | 72.9 KB | 28.3 KB | inside the iframe |
| Total for one live demo | 509 KB | 157.5 KB | first paint pays only the 16.2 KB player |

| Mode | Verdict | Deciding reason |
| --- | --- | --- |
| (a) MP4 loops only | Rejected as the whole answer | A video cannot be scrubbed by scroll, and it reads as a movie of the product rather than the product. The operator asked for interactive |
| (b) Seekable runtime only | Rejected as the whole answer | 157.5 KB gzip is acceptable for one hero but wasteful for small motion, and without a render there is no poster and no social preview asset |
| (c) Both, one source | **Chosen** | One composition is authored once. It plays live in the page and it renders to MP4 for the poster, the reduced motion fallback, and the preview image |

The budget rule that follows from the numbers. Exactly one live composition runs on the page, the durable session demo. The player gets a rendered poster, and its iframe loads lazily, so first paint pays only the 16.2 KB player component. All other motion on the page uses plain CSS transitions inside the app's motion tokens.

## The authoring loop for the durable session demo

1. Write `demos/durable-session/index.html` in this repo. It is ordinary HTML and CSS, so it uses the 109 Tortie tokens from assets/gmux-tokens.css directly.
2. Time the scene with `data-start` and `data-duration` attributes plus GSAP timelines on `window.__timelines`.
3. Preview with `npx hyperframes preview`, which gives a seekable scrubber during authoring.
4. Validate with `hyperframes check`. The linter catches missing attributes and overlapping tracks.
5. Copy the composition into the site's `public/`, embed it with `<hyperframes-player>`, and drive `seek()` from scroll position.
6. Render the MP4 poster and the preview assets with the `hyperframes` CLI.

## The CDN question

The player injects a version pinned copy of the runtime from cdn.jsdelivr.net when the composition does not carry its own. The check lives in `packages/player/src/shouldInjectRuntime.ts`. If a third party CDN at view time is unacceptable, the composition includes a self hosted copy of the runtime script, 113 KB gzip, and the player skips injection. The builders should self host, because the page should not depend on a third party at view time.

## What is not verified

- Artifact sizes were measured, but real page load time was not. Lighthouse numbers need the built site.
- No MP4 render was executed. The render path was read from the producer and CLI code and docs. A builder should run one end to end render early.
- Scroll driven seek assumes `seek()` stays cheap at scroll frequency. The player throttles its time updates to about 10 per second, but seek cost under scroll should get one quick probe during the build.
- Version numbers came from the npm registry on 2026-08-13. Astro 7.2.2, Vite 8.2.1, SvelteKit 2.70.2, Next 16.3.1, GSAP 3.15.0, HyperFrames 0.7.108.

Key source paths read: /Users/gdc/hyperframes/packages/player/src/composition-probe.ts, /Users/gdc/hyperframes/packages/core/src/runtime/README.md, /Users/gdc/hyperframes/packages/core/src/adapters/gsap.ts, /Users/gdc/hyperframes/packages/player/README.md.
