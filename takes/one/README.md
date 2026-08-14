# Take one. The quiet monolith.

One narrow column, small type, and the durable-session demonstration as the
single breakout element. Built to the brief in docs/research/03-design-brief.md.

## Commands

- `npm install` installs Astro 7.2.2, gsap 3.15.0 and @hyperframes/player 0.7.108.
- `npm run build` produces the static site in `dist/`.
- `npm run preview` serves the built site.

## How the demo works

The composition is one HTML file at `public/demos/durable-session/index.html`.
It uses the app's own tokens and registers one paused GSAP timeline at
`window.__timelines.main`. The player drives that timeline directly, so the
iframe needs no HyperFrames runtime and no request ever leaves the page's
origin. The MP4 at `public/demos/durable-session/durable-session.mp4` is the
deterministic render of the same file. It serves as the reduced-motion
fallback. The poster and the social preview image are frames from that render.

To re-render after editing the composition:

```
cd public/demos/durable-session
npx hyperframes@0.7.108 lint .
npx hyperframes@0.7.108 render -c ./index.html -o ./durable-session.mp4
ffmpeg -y -ss 4.5 -i durable-session.mp4 -frames:v 1 -q:v 6 poster.jpg
ffmpeg -y -ss 15.0 -i durable-session.mp4 -frames:v 1 -vf "crop=1280:672:0:64,scale=1200:630" -q:v 5 ../../og.jpg
```

## Measured transfer sizes, gzip

| Payload | Size |
| --- | --- |
| First paint, HTML plus CSS plus inline page JS | 5.8 KB |
| Poster image, lazy | 16.6 KB |
| Player component, loaded on click | 16.3 KB |
| Demo iframe on click, composition plus tokens plus GSAP | 35.0 KB |
| Whole page with the live demo | about 74 KB |
| MP4 fallback, loads only under reduced motion on click | 369 KB |

The budget in the brief allows 120 KB for first paint and 300 KB for the whole
page. Both hold with a wide margin.

## Provenance

- `src/styles/gmux-tokens.css` and `public/demos/durable-session/gmux-tokens.css`
  are verbatim copies of `assets/gmux-tokens.css`.
- `public/brand/` files are copies from `assets/brand/`.
- `public/vendor/hyperframes-player.global.js` and
  `public/demos/durable-session/gsap.min.js` are the published npm artifacts,
  self hosted so the page makes no third party request.
