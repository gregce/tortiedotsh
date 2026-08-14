# 01. Exemplar patterns

Ten landing pages for developer tools were downloaded and measured. The verdict comes first. The winning shape for tortie.sh is a narrow single column of small text, a near monochrome palette drawn from the product's own tokens, one seekable demo of the product doing its one unique thing, and a download path inside the first screen. cmux.com gives the structure. pi.dev gives the demo mechanism. opencode.ai gives the funnel. The heavy sites prove by counterexample that framework weight buys nothing a visitor needs here.

## The comparison table

Script sizes are as measured, uncompressed unless marked. "First download CTA" is where the first download or install affordance sits.

| Site | Font families | Distinct colors | External JS | First download CTA | Demo mechanism |
| --- | --- | --- | --- | --- | --- |
| cmux.com | 2 | 7 tokens | 2,018 KB raw, 566 KB gzip | nav and hero, first screen | one static PNG screenshot |
| pi.dev | 3 | 1 blue in about 15 alpha steps | about 320 KB, no framework | copyable curl line, first screen | asciinema text recordings, scroll synced |
| opencode.ai | 1 | 2 grays plus 1 accent | 1,370 KB | 3 paths in the first screen | one 10.4 MB autoplay mp4 |
| cursor.com | 5 plus icon and math fonts | 371 | 5,370 KB | 13 KB into the body | React product theater with static images |
| ghostty.org | 2 | 54 | 600 KB, plus 1,860 KB of inline frame data | nav | 235 frame ASCII flipbook in a terminal |
| zed.dev | 4 | 502 | 2,600 KB | 17 KB into the body | inline SVG and screenshots |
| linear.app | 2 | 149 | 580 KB | 6.7 KB into the body | SVG and image app frames |
| warp.dev | 8 | 286 | 2,400 KB | footer only | one hosted mp4 |
| charm.sh | 3 | 52 | 0 | none, per project GitHub links | 11 muted webm loops |
| tailscale.com | 2 | 92 | 1,640 KB | 1.7 KB into the body | inline SVG diagrams |

## What each site's defining choice teaches

**cmux.com.** The whole design is README typography. One 672px column, 15px body, 12px muted section labels, and nothing larger than 24px. Hierarchy comes from weight and from muted against foreground, never from size jumps. The one demonstration is a real screenshot that breaks out of the text column with a deep shadow. The cost side is instructive. The page ships 566 KB of gzipped React hydration to power a typewriter and a dropdown, and 794 KB of raw HTML because 20 locales are embedded.

**pi.dev.** The demos are real recorded terminal sessions replayed as text, so they are seekable and crisp at any size and they cost a fraction of video. The site is static HTML with hand written vanilla JS and it still has a serious dual theme. The single accent color is spent in about 15 alpha steps, which shows how far one hue stretches.

**opencode.ai.** The funnel is the lesson. A visitor can start a download with zero scrolling by three separate paths. The whole site is set in one mono face, which proves one typographic decision can carry an identity. The 10.4 MB autoplay mp4 is the wrong demo mechanism for us.

**cursor.com.** The counterexample. 5.4 MB of JavaScript, 371 colors, 5 text families, and the entire page duplicated in the DOM for mobile. None of it serves a visitor who wants to download, see the source, or understand the product. Its one good habit is CTA discipline, with Download in the nav and in the hero.

**ghostty.org.** The page is the product. The hero is a terminal playing a deterministic frame sequence shipped as data and swapped in the page. That is the HyperFrames model with a worse payload. Its 1.86 MB of inline frame text shows why the frame data should live in a lazy loaded composition, not in the document.

**zed.dev and linear.app.** Two answers to density. Zed spends 4 font families and 502 colors on 25 sections. Linear holds 2 families and a disciplined token palette across a large brand with the smallest venture backed framework payload measured, 580 KB. Linear proves token discipline scales. Tortie already owns 109 tokens, so this is the confirmation, not a new idea.

**warp.dev.** The warning. The homepage has 3 content sections wrapped in a 30 link mega menu, and there is no download above the fold because the page now courts enterprise buyers. A landing page shows what a company wants, and tortie.sh should want exactly 3 things for the visitor.

**charm.sh.** The floor. Zero external scripts, 40 KB of HTML, and the page still feels alive because all motion is pre rendered video loops. Its weakness is that no single CTA leads, which tortie.sh must not copy.

**tailscale.com.** The fastest funnel measured. The word Download appears 1.7 KB into the body, before anything else.

## Patterns tortie.sh takes

- The narrow single column README structure from cmux, with 12px muted section labels and a plain feature list.
- Monochrome discipline, but sourced from Tortie's own tokens instead of a framework's neutrals. Dark first, with hierarchy from weight and muted text.
- The pill CTA pair from cmux. A filled Download for macOS with the Apple glyph, and an outlined View on GitHub, repeated small in the nav.
- The zero scroll funnel from opencode and tailscale. The download path is visible before any scrolling.
- The seekable recorded demo mechanism from pi.dev and ghostty, implemented with HyperFrames instead of asciinema or inline frame data.
- The full width breakout slot after the feature list, where cmux places its screenshot. This is where the durable session demo goes, because it demonstrates the one claim the exemplars can only state in text.
- The fully expanded FAQ with no accordions, if a FAQ ships.

## Patterns tortie.sh leaves

- Framework hydration for trivial behaviors. cmux pays 566 KB gzip for a typewriter.
- Autoplay video as the demo. opencode pays 10.4 MB and the result cannot be scrubbed.
- Quote walls and star counts. Tortie has no quotes yet and must not fake any.
- Mega menus, logo walls, and enterprise sections. The page serves 3 visitor goals and nothing else.
- Display typefaces. The exemplars each buy identity with a font. Tortie buys it with the wordmark law and the token palette, using the system font stack the app itself uses.

## What is not verified

- JS sizes are download bytes, not all over the wire gzip sizes, so cross site ratios are fair but absolute transfer would be smaller for most sites.
- ghostty.org content is client rendered, so its structure was read from the payload, not from rendered HTML.
- pi.dev and opencode.ai layouts were inferred from markup and CSS, so their fold positions are estimates.
- No Lighthouse or render timing was run on any site.

Evidence files are in the session scratchpad under sites/ and cmux/, including raw HTML, all referenced CSS, and rendered screenshots of cmux.com.
