# Hero studio background

`hero-studio-background-source.png` is the project source for the cinematic
environment behind the Tortie hero window. It was generated with the built-in
OpenAI image-generation tool on 2026-08-24 using
`docs/design/mocks/04-disposable-window.png` as the composition reference.

`hero-studio-background-v2-source.png` is the active lighting pass. It extends
the overhead light to the top edge so it can continue behind the transparent
homepage navigation, and bakes a wide contact shadow into the floor beneath
the product landing zone.

The consuming files in `takes/three/public/marketing/` are deliberately small:

- The active `hero-studio-v2*` files are optimized desktop and mobile
  derivatives of the second lighting pass.
- `tortie-window.webp` is a tight, optimized crop of the real Tortie window.

The first-pass source remains here as design provenance, but its web
derivatives are intentionally not shipped because the active hero does not
reference them.

The generated source prompt requested a text-free, nearly black graphite
studio; a subtle horizon; a low concrete floor; darkness on the left for HTML
copy; and soft illumination beneath the product on the right. It explicitly
excluded interfaces, products, logos, text, people, neon, lens flare, grids,
fog, and visible light sources.
