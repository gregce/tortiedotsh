# General Purpose Agents: identity assets and presentation handoff

Checked 2026-08-23. This note covers the 13 products currently in the General Purpose Agents catalog. It uses first-party product assets where the product publishes one. A GitHub organization avatar is called out explicitly as a fallback; it must not be described as an exact product logo.

## Recommended asset mappings

| Product ID | Preferred asset | Source page | Format and handling | Confidence / caveat |
| --- | --- | --- | --- | --- |
| `openclaw` | `https://raw.githubusercontent.com/openclaw/openclaw/main/apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/1024.png` | [OpenClaw app-icon source](https://github.com/openclaw/openclaw/tree/main/apps/ios/Sources/Assets.xcassets/AppIcon.appiconset) | 1024×1024 PNG, opaque white background. Use as-is with `object-fit: contain`; do not add another white inset. | Exact first-party app icon, downloaded and visually inspected. The documentation's alternate mark is the scalable [`pixel-lobster.svg`](https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/pixel-lobster.svg), declared as both logo and favicon in [`docs/docs.json`](https://github.com/openclaw/openclaw/blob/main/docs/docs.json). The pixel mark should render at an integer multiple of its 16×16 viewBox, not the current 26px inner size. |
| `hermes-agent` | `https://raw.githubusercontent.com/NousResearch/hermes-agent/main/apps/desktop/assets/icon.png` | [Hermes Desktop source](https://github.com/NousResearch/hermes-agent/tree/main/apps/desktop) | 1024×1024 RGBA PNG; black-and-white illustrated mark on its own white rounded tile. | Exact first-party desktop icon, downloaded and visually inspected. The live desktop lockup separately uses `apps/desktop/public/nous-girl.jpg`, as shown in the first-party [`brand-mark.tsx`](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/brand-mark.tsx). The illustration loses fine detail at 26px but keeps a recognizable silhouette; do not recolor it. |
| `grok-bot` | `https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ec/4b/bd/ec4bbdd2-666d-17d0-65e1-70b7031438df/app-0-0-1x_U007ephone-0-1-P3-85-220.png/512x512bb.jpg` | [Grok Bot on the App Store](https://apps.apple.com/us/app/grok-bot/id6794501026) | 512×512 JPEG; dark graphite tile with a white Bot face. | Exact product-specific icon uploaded by the vendor for bundle `co.anysphere.sand`; downloaded and visually inspected. Prefer this over the generic Grok or xAI mark. Apple CDN hashes can change, so the refresh job should resolve `results[0].artworkUrl512` from `https://itunes.apple.com/lookup?id=6794501026` before fetching. |
| `perplexity-computer` | Resolve `results[0].artworkUrl512` from `https://itunes.apple.com/lookup?id=1668000334` | [Perplexity on the App Store](https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334) and [Computer product page](https://www.perplexity.ai/products/computer) | Apple-hosted JPEG app artwork. Keep the app tile intact. | First-party Perplexity product identity, but not a Computer-specific sub-brand. No stable public Computer-only mark was established. This is preferable to fabricating a Computer glyph or using a search-engine favicon. |
| `manus` | Resolve `results[0].artworkUrl512` from `https://itunes.apple.com/lookup?id=6740909540` | [Manus on the App Store](https://apps.apple.com/us/app/manus-ai-agent-automation/id6740909540) and [Manus](https://manus.im/) | Apple-hosted JPEG app artwork. Keep the supplied tile and corner treatment. | First-party Manus app identity. Resolve at refresh time because Apple's CDN path is content-addressed and may change. |
| `genspark-super-agent` | Resolve `results[0].artworkUrl512` from `https://itunes.apple.com/lookup?id=6739554054` | [Genspark AI Workspace on the App Store](https://apps.apple.com/us/app/genspark-ai-workspace/id6739554054) and [Super Agent help](https://www.genspark.ai/helpcenter/super-agent) | Apple-hosted JPEG app artwork. Keep the supplied tile intact. | First-party Genspark identity, not a separate Super Agent sub-brand. The catalog compares the exact Super Agent surface, so label text must continue to say “Genspark Super Agent.” |
| `nanobot` | `https://raw.githubusercontent.com/HKUDS/nanobot/main/images/nanobot_mark.svg` | [nanobot `images/` directory](https://github.com/HKUDS/nanobot/tree/main/images) | SVG, transparent orange cat mark, viewBox 759×718. | Exact first-party standalone product mark. It remains legible on the graphite header and needs no background override. Prefer the mark over the wide `nanobot_logo.svg` or README cover. |
| `agent-zero` | `https://raw.githubusercontent.com/agent0ai/agent-zero/main/webui/public/favicon.svg` | [Agent Zero repository](https://github.com/agent0ai/agent-zero) | Self-contained 960×960 SVG with navy square and white A mark. | Exact first-party product icon. Prefer this over `darkSymbol.svg`: the latter uses `currentColor`, which resolves to black when loaded through an external `<img>` and disappears on Tortie's dark header. The product itself references `darkSymbol.svg` as a CSS mask, not as an external image. |
| `zeroclaw` | `https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/main/zeroclaw.png` | [ZeroClaw repository](https://github.com/zeroclaw-labs/zeroclaw) and [maintainer logo issue](https://github.com/zeroclaw-labs/zeroclaw/issues/1346) | PNG product mark. Fetch to a local immutable asset and record the final content type. | The first-party issue explicitly names root `zeroclaw.png` as the primary logo. The project has been iterating its identity; the asset refresher should fail rather than silently substitute if this path moves. Do not use user-submitted issue artwork as the production logo. |
| `ironclaw` | Fallback: `https://github.com/nearai.png?size=256` | [IronClaw repository](https://github.com/nearai/ironclaw) | GitHub-served PNG organization avatar. | First-party vendor fallback only; not an exact IronClaw mark. The repository's design-system work still describes logo/identity work as evolving. Store `sourceType: official-vendor-avatar-fallback` and revisit when the product publishes a stable standalone mark. |
| `picoclaw` | Fallback: `https://github.com/sipeed.png?size=256` | [PicoClaw repository](https://github.com/sipeed/picoclaw) and [logo roadmap](https://github.com/sipeed/picoclaw/blob/main/ROADMAP.md) | GitHub-served PNG organization avatar. | First-party vendor fallback only. PicoClaw's own roadmap says it is still looking for a Mantis Shrimp logo, so a community proposal must not be promoted to official identity. |
| `openfang` | Fallback: `https://github.com/RightNow-AI.png?size=256` | [OpenFang repository](https://github.com/RightNow-AI/openfang) | GitHub-served PNG organization avatar. | First-party maintainer fallback only; not an established product mark. Keep the source type explicit and replace it when a stable OpenFang mark is published in the repository or on `openfang.sh`. |
| `agent-tars` | Fallback: `https://github.com/bytedance.png?size=256` | [Agent TARS repository](https://github.com/bytedance/UI-TARS-desktop) | GitHub-served PNG organization avatar. | First-party vendor fallback only. Do not use a UI-TARS Desktop native-app icon unless its source is explicitly shared with the exact Agent TARS CLI/WebUI SKU; the catalog intentionally separates those platform claims. |

The three Apple lookup endpoints are better automation inputs than hard-coded CDN URLs. The fetcher should validate `resultCount === 1`, the expected `trackId`, the expected `trackName`, and an HTTPS `artworkUrl512`, then download the returned image and write the resolved URL into `comparison-assets.json` as the evidence URL.

## Exact platform marks for the 13 columns

These are the product-platform IDs supported by the evidence already in the catalog. They map directly to the shared high-resolution assets in `public/compare/platforms/`; do not introduce product-specific OS glyphs.

| Product | Platform icon IDs | Important scope note |
| --- | --- | --- |
| OpenClaw | `macos`, `windows`, `linux`, `web`, `ios`, `android` | iOS and Android are paired nodes; Linux has a supported Gateway and companion. |
| Hermes Agent | `macos`, `windows`, `linux`, `web`, `android` | Android is the documented Termux path, not a native mobile GUI; Web is the browser dashboard. |
| Grok Bot | `macos`, `windows`, `ios` | The exact FAQ explicitly excludes Linux, Android, and iPad at launch. Do not add `web` merely because execution is cloud-hosted. |
| Perplexity Computer | `web`, `ios`, `android` | Operator surfaces, not the cloud sandbox's guest OS. |
| Manus | `macos`, `windows`, `web` | Exact desktop and browser surfaces. |
| Genspark Super Agent | `web` | The exact compared surface is the browser product. The broader Genspark mobile app should not expand this column without exact-SKU evidence. |
| nanobot | `macos`, `windows`, `linux`, `web` | WebUI is served by the local or hosted gateway. |
| Agent Zero | `macos`, `windows`, `linux`, `web` | The agent normally runs in Docker; the Web UI is the operator surface. |
| ZeroClaw | `macos`, `windows`, `linux` | Messaging adapters are not platform clients. |
| IronClaw | `macos`, `windows`, `linux`, `web` | Windows support includes the documented Windows/WSL path; Web is served by the operator process. |
| PicoClaw | `macos`, `windows`, `linux`, `web`, `android` | Android is explicitly documented through APK/Termux; other edge architectures are execution targets, not additional icon types. |
| OpenFang | `macos`, `windows`, `linux`, `web` | Includes local dashboard and documented cross-platform install paths. |
| Agent TARS | `web` | Exact Agent TARS has CLI, WebUI, and headless server; macOS/Windows native claims belong to UI-TARS Desktop. |

## Navigation placement

The minimal information-architecture change is:

`Cloud agents → General agents → Remote`

Keep the route and page heading as **General Purpose Agents**, place it at category order 8, and move Remote to order 9. In the sticky navigation, use the short label **General agents**. Repeating the full 22-character heading in a nine-tab `width: max-content` strip adds unnecessary horizontal travel and makes the selected tab harder to reacquire on intermediate desktop widths.

The navigation is already a horizontal scroller, which is the correct structural model. Preserve DOM order, ensure the current item is scrolled into view on route load, and add subtle inline-edge overflow affordances only when content is actually clipped. Do not compress labels until they become cryptic.

## Header-spacing risks and corrections

The category has 13 columns. At the current desktop dimensions, the table is roughly `228px + 13 × 158px = 2,282px` before borders. Horizontal scrolling is expected; shrinking product columns below the existing 152–158px range would make evidence cells and product names materially harder to scan.

The important defects are inside each product header:

1. **Six platform marks do not fit the current row.** An OpenClaw header can need six 18px boxes plus five gaps. With the present `var(--space-2)` gap, this exceeds the usable width of a 158px cell. Use a compact platform-only gap of 2–3px and 17–18px marks, or allow a deliberate two-row icon cluster and raise the header height. Do not let the icons overflow invisibly.
2. **The enlarged Linux image is clipped by its 18px parent.** The current rule requests a 28px image inside an `overflow: hidden` 18px mark. Increase the Linux mark's own inline size or reduce the image; an oversized image inside a clipped box does not create a more legible Tux.
3. **Long names are constrained by the side-by-side 32px logo grid.** “Perplexity Computer” and “Genspark Super Agent” can become three lines in the remaining text width. Preserve the real names. A 28px logo, 6px lockup gap, and a header height that tolerates three 16px lines is safer than truncation or narrower columns.
4. **Pixel artwork needs integer scaling.** If OpenClaw uses `pixel-lobster.svg`, render it at 16px or 32px with `image-rendering: pixelated`; the current generic 26px logo size blurs its 16×16 grid. The 1024px app icon avoids this constraint.
5. **Do not normalize away supplied tiles.** Hermes, Grok Bot, and the App Store identities already include deliberate light or dark backgrounds. Transparent marks such as nanobot can use the standard graphite frame. A global white-frame override would make the header visually noisy.
6. **Fallbacks must stay visibly accountable.** The IronClaw, PicoClaw, OpenFang, and Agent TARS mappings above are vendor avatars, not product logos. Preserve that distinction in asset metadata so a later deterministic audit can identify and replace every fallback.

The visual priority remains product mark → exact product name → version/metadata → compact platform cluster. Platform icons should never compete with or force clipping of the product identity.
