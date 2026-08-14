# Take two: the session

The page behaves like a Tortie session. The nav is the app's 36px band with its single hairline. Sections read as named sessions with status dots. The durable session demo is a HyperFrames composition that plays inside a window frame matching the page chrome, and scrolling advances the scene.

## Build

```
npm install
npm run build
```

Output is static files in `dist/`. The prebuild step copies the shared token file, the brand assets and GSAP into `public/`, so `assets/gmux-tokens.css` at the repo root stays the single source of color.

## The demo

`public/demos/durable-session/index.html` is one self contained composition. A paused GSAP timeline registers at `window.__timelines["durable-session"]`, and the same file serves both modes:

- In the page, the `@hyperframes/player` web component drives the timeline directly through its same origin adapter. No runtime is injected and no request leaves the origin.
- The `hyperframes` CLI renders it to `durable-session.mp4`, which serves as the reduced motion fallback. `poster.png` and `/og.png` are frames extracted from that render.

To re-render after editing the composition:

```
cd public/demos/durable-session
npx hyperframes@0.7.108 lint .
npx hyperframes@0.7.108 render -c ./index.html -o ./render-raw.mp4
ffmpeg -y -i render-raw.mp4 -c:v libx264 -preset veryslow -crf 28 -pix_fmt yuv420p -movflags +faststart durable-session.mp4
ffmpeg -y -ss 2.7 -i render-raw.mp4 -frames:v 1 poster.png
ffmpeg -y -ss 12.5 -i render-raw.mp4 -frames:v 1 -vf "scale=1200:750,crop=1200:630:0:60" ../../og.png
rm render-raw.mp4
```

## Verification

`scripts/verify.mjs` drives the built site in an isolated headless Chrome. It checks the scrub mapping, the reduced motion fallback, the no JavaScript fallback, horizontal overflow at 390px, and that no request leaves the page's origin. Screenshots land in `docs/shots/`.

```
npx astro preview --port 4322 &
node scripts/verify.mjs http://localhost:4322 docs/shots
```
