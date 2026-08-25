# Comparison identity assets

Product and platform identity assets are committed locally so the comparison never makes third-party image requests at page load.

`comparison-assets.json` records the visible name, local path, first-party provenance URL, source type, and review date for every asset. Product assets come from official vendor sites, official product repositories, or vendor-controlled organization avatars. Platform assets come from Apple, Microsoft, the Linux Foundation, W3C, and Android's official brand resources.

Refresh from the repository root with:

```sh
npm run refresh:assets
npm run refresh:assets -- --missing-only
npm run refresh:assets -- --product jules --product amp
```

The full command rebuilds the bundle. `--missing-only` preserves reviewed assets
and fetches only absent local files; repeatable `--product` arguments make a
targeted vendor refresh deterministic. The fetcher uses a 15-second timeout per
source and only falls back to an official project organization avatar.
`npm run validate:data` rejects missing public-product assets, missing platform
assets, non-HTTPS provenance, and non-first-party source types.

The Android robot is reproduced from work created and shared by Google and used according to the Creative Commons 3.0 Attribution License, following the official Android brand guidance linked in the manifest.
