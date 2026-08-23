# Take three, the lockup

The bold editorial take from docs/research/03-design-brief.md section 10. The
giant TORTIE.sh lockup is the design. The first screen holds the lockup at
display scale, the hero sentence, and the two CTAs, so all three visitor goals
sit inside one viewport at 1440 and at 390 wide.

## Build

```bash
npm install
npm run build
```

The build syncs shared assets first, then writes static output to `dist/`.
Deploy `dist/` to Vercel with no adapter. `npm run dev` serves the same site
locally.

For a production comparison-data gate, run:

```bash
npm run audit:freshness
npm run build
```

The audit checks each open-source project and each monitored first-party source,
not only their snapshot timestamps. See
`src/data/OPEN_SOURCE_METRICS.md` and `src/data/EVIDENCE_MONITOR.md` for the
scheduled refresh and human-review process.

## What is in here

- `src/pages/index.astro` is the one page. Components live in
  `src/components/`.
- The token file is imported from the repo's `assets/gmux-tokens.css`. This
  take copies no token values. `scripts/sync-assets.mjs` copies the file
  itself into the demo's directory before every build so the composition
  iframe reads the same tokens.
- `public/demos/durable-session/index.html` is the HyperFrames composition.
  One paused GSAP timeline registered on `window.__timelines` drives the live
  player, the preview, and the MP4 render, from one source.
- The player is `@hyperframes/player`, self hosted from `public/vendor/`.
  The composition registers its timeline before the player's fifth probe
  tick, so the player drives the timeline directly and never injects the
  runtime from a CDN. Zero requests leave the page's origin.
- `public/demos/durable-session/durable-session.mp4` is the rendered
  composition, 14.5 s at 30 fps. It serves as the `prefers-reduced-motion`
  fallback with native controls and `preload="none"`. `poster.webp` is its
  frame at 2.5 s. `og/og-image.jpg` is its frame at 13.8 s, cropped to
  1200 by 630.
- `public/brand/tortie-mark-560.webp` is a committed 12 KB derivative of
  `assets/brand/master/tortie-master-1024.png`.

## Rebuilding the demo assets

```bash
npx hyperframes lint public/demos/durable-session
npx hyperframes render -c public/demos/durable-session/index.html -o public/demos/durable-session/durable-session.mp4
ffmpeg -y -ss 2.5 -i public/demos/durable-session/durable-session.mp4 -frames:v 1 -c:v libwebp -quality 82 public/demos/durable-session/poster.webp
ffmpeg -y -ss 13.8 -i public/demos/durable-session/durable-session.mp4 -frames:v 1 -vf "scale=1200:750,crop=1200:630:0:60" -q:v 4 public/og/og-image.jpg
```

## Measured weight, gzip

| Load | Size |
| --- | --- |
| index.html with all CSS inlined | 5.8 KB |
| player component | 16.3 KB |
| hero mark webp | 12.0 KB |
| first paint total | 34.1 KB |
| demo on approach: composition, tokens, GSAP, poster | 46.5 KB |
| whole page | 80.6 KB |

The budget in the brief allows 120 KB for first paint and 300 KB for the
whole page. The MP4 is 350 KB but loads only when a reduced motion visitor
presses play.

## Verification notes

- `verify/final-1440.png` and `verify/final-390.png` are the checked
  screenshots of the built site.
- The page reads correctly with JavaScript disabled. The static markup is
  the poster image with a caption, and script replaces it with the player.
- Reduced motion was checked by emulation. The stage mounts a `<video>` with
  the MP4 instead of the live player.
- No request leaves the page's origin. Checked by recording every request
  through page load, demo mount, and playback. 8 requests, all same origin.
- The lockup fits without horizontal scroll down to 320px wide.
