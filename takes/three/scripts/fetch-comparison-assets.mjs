#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const checkedAt = "2026-08-23";
const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public/compare");
const manifestPath = resolve(root, "src/data/comparison-assets.json");

const raw = (repo, path) =>
  `https://raw.githubusercontent.com/${repo}/HEAD/${path.split("/").map(encodeURIComponent).join("/")}`;
const avatar = (owner) => `https://github.com/${owner}.png?size=512`;

const products = {
  "visual-studio-code": ["Visual Studio Code", "https://code.visualstudio.com/assets/apple-touch-icon.png", "https://code.visualstudio.com/", "official-site-icon"],
  "cursor-ide": ["Cursor IDE", "https://cursor.com/marketing-static/favicon-light.svg", "https://cursor.com/", "official-site-icon"],
  windsurf: ["Devin Desktop", avatar("cognition-ai"), "https://github.com/cognition-ai", "official-organization-avatar"],
  zed: ["Zed", raw("zed-industries/zed", "crates/zed/resources/app-icon@2x.png"), "https://github.com/zed-industries/zed/blob/HEAD/crates/zed/resources/app-icon%402x.png", "official-repository-asset"],
  kiro: ["Kiro", "https://kiro.dev/icon.svg", "https://kiro.dev/", "official-site-icon"],
  void: ["Void", raw("voideditor/void", "void_icons/slice_of_void.png"), "https://github.com/voideditor/void/blob/HEAD/void_icons/slice_of_void.png", "official-repository-asset"],
  tortie: ["Tortie", raw("gregce/tortie", "docs/brand/tortie/macos/Tortie.iconset/icon_512x512@2x.png"), "https://github.com/gregce/tortie/blob/HEAD/docs/brand/tortie/macos/Tortie.iconset/icon_512x512%402x.png", "official-repository-asset"],
  cmux: ["cmux", raw("manaflow-ai/cmux", "web/public/brand/app-icon-dark.png"), "https://github.com/manaflow-ai/cmux/blob/HEAD/web/public/brand/app-icon-dark.png", "official-repository-asset"],
  wmux: ["wmux", raw("openwong2kim/wmux", "assets/icon.svg"), "https://github.com/openwong2kim/wmux/blob/HEAD/assets/icon.svg", "official-repository-asset"],
  warp: ["Warp", "https://www.warp.dev/favicon-196x196.png", "https://www.warp.dev/", "official-site-icon"],
  "wave-terminal": ["Wave Terminal", avatar("wavetermdev"), "https://github.com/wavetermdev", "official-organization-avatar"],
  orca: ["Orca", raw("stablyai/orca", "resources/icon.png"), "https://github.com/stablyai/orca/blob/HEAD/resources/icon.png", "official-repository-asset"],
  conductor: ["Conductor", "https://www.conductor.build/icon.png?icon.7d575655.png", "https://www.conductor.build/", "official-site-icon"],
  superset: ["Superset", avatar("superset-sh"), "https://github.com/superset-sh", "official-organization-avatar"],
  "coder-mux": ["Coder Mux", raw("coder/cmux", "public/icon-512.png"), "https://github.com/coder/cmux/blob/HEAD/public/icon-512.png", "official-repository-asset"],
  nimbalyst: ["Nimbalyst", raw("nimbalyst/nimbalyst", "packages/electron/icon.png"), "https://github.com/nimbalyst/nimbalyst/blob/HEAD/packages/electron/icon.png", "official-repository-asset"],
  "t3-code": ["T3 Code", "https://t3.codes/apple-touch-icon.png", "https://t3.codes/", "official-site-icon"],
  "vibe-kanban": ["Vibe Kanban", raw("BloopAI/vibe-kanban", "packages/public/favicon-vk-light.svg"), "https://github.com/BloopAI/vibe-kanban/blob/HEAD/packages/public/favicon-vk-light.svg", "official-repository-asset"],
  sculptor: ["Sculptor", raw("imbue-ai/sculptor", "sculptor/frontend/public/favicon.svg"), "https://github.com/imbue-ai/sculptor/blob/HEAD/sculptor/frontend/public/favicon.svg", "official-repository-asset"],
  humanlayer: ["HumanLayer", "https://humanlayer.com/icon.png?icon.01v9gqce1npvy.png", "https://humanlayer.com/", "official-site-icon"],
  "claude-squad": ["claude-squad", avatar("smtg-ai"), "https://github.com/smtg-ai", "official-organization-avatar"],
  "agent-deck": ["agent-deck", raw("asheshgoplani/agent-deck", "site/logo.svg"), "https://github.com/asheshgoplani/agent-deck/blob/HEAD/site/logo.svg", "official-repository-asset"],
  "claude-code": ["Claude Code", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "codex-cli": ["Codex CLI", avatar("openai"), "https://github.com/openai", "official-organization-avatar"],
  "cursor-cli": ["Cursor CLI", "https://cursor.com/marketing-static/favicon-light.svg", "https://cursor.com/cli", "official-site-icon"],
  "gemini-cli": ["Gemini CLI", avatar("google-gemini"), "https://github.com/google-gemini", "official-organization-avatar"],
  "factory-droid-cli": ["Factory Droid CLI", "https://docs.factory.ai/favicon.svg", "https://docs.factory.ai/cli/getting-started/quickstart", "official-site-icon"],
  codewhale: ["CodeWhale", raw("Hmbown/CodeWhale", "web/app/icon.svg"), "https://github.com/Hmbown/CodeWhale/blob/HEAD/web/app/icon.svg", "official-repository-asset"],
  "antigravity-cli": ["Antigravity CLI", avatar("google"), "https://github.com/google", "official-organization-avatar"],
  "qwen-code": ["Qwen Code", raw("QwenLM/qwen-code", "packages/chrome-extension/public/icons/icon-source.png"), "https://github.com/QwenLM/qwen-code/blob/HEAD/packages/chrome-extension/public/icons/icon-source.png", "official-repository-asset"],
  "pi-coding-agent": ["Pi coding agent", avatar("earendil-works"), "https://github.com/earendil-works", "official-organization-avatar"],
  opencode: ["OpenCode CLI", raw("anomalyco/opencode", "packages/app/public/favicon-96x96-v3.png"), "https://github.com/anomalyco/opencode/blob/HEAD/packages/app/public/favicon-96x96-v3.png", "official-repository-asset"],
  "github-copilot-cli": ["GitHub Copilot CLI", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  goose: ["Goose CLI", raw("aaif-goose/goose", "ui/desktop/src/images/icon.svg"), "https://github.com/aaif-goose/goose/blob/HEAD/ui/desktop/src/images/icon.svg", "official-repository-asset"],
  aider: ["Aider", raw("Aider-AI/aider", "aider/website/assets/logo.svg"), "https://github.com/Aider-AI/aider/blob/HEAD/aider/website/assets/logo.svg", "official-repository-asset"],
  "grok-build": ["Grok Build", avatar("xai-org"), "https://github.com/xai-org", "official-organization-avatar"],
  "github-copilot-vscode": ["GitHub Copilot for VS Code", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  cline: ["Cline extension", raw("cline/cline", "assets/icons/icon.svg"), "https://github.com/cline/cline/blob/HEAD/assets/icons/icon.svg", "official-repository-asset"],
  continue: ["Continue extension", raw("continuedev/continue", "extensions/vscode/media/icon.png"), "https://github.com/continuedev/continue/blob/HEAD/extensions/vscode/media/icon.png", "official-repository-asset"],
  "kilo-code": ["Kilo Code extension", raw("Kilo-Org/kilocode", "packages/kilo-vscode/assets/icons/kilo-dark.png"), "https://github.com/Kilo-Org/kilocode/blob/HEAD/packages/kilo-vscode/assets/icons/kilo-dark.png", "official-repository-asset"],
  "openai-codex-cloud": ["OpenAI Codex cloud", avatar("openai"), "https://github.com/openai", "official-organization-avatar"],
  "github-copilot-coding-agent": ["GitHub Copilot coding agent", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  devin: ["Devin", avatar("cognition-ai"), "https://github.com/cognition-ai", "official-organization-avatar"],
  happy: ["Happy", raw("slopus/happy", "logo.png"), "https://github.com/slopus/happy/blob/HEAD/logo.png", "official-repository-asset"],
  vibetunnel: ["VibeTunnel", raw("amantus-ai/vibetunnel", "mac/VibeTunnel/Assets.xcassets/AppIcon.appiconset/icon_512x512.png"), "https://github.com/amantus-ai/vibetunnel/blob/HEAD/mac/VibeTunnel/Assets.xcassets/AppIcon.appiconset/icon_512x512.png", "official-repository-asset"],
  shunt: ["Shunt", "https://shunt.app/icon.png", "https://shunt.app/", "official-site-icon"],
};

const platforms = {
  macos: ["macOS", "https://www.apple.com/apple-touch-icon.png", "https://www.apple.com/macos/", "official-vendor-icon"],
  windows: ["Windows", "https://www.microsoft.com/favicon.ico", "https://www.microsoft.com/windows/", "official-vendor-icon"],
  linux: ["Linux", "https://www.linuxfoundation.org/hubfs/Tux-flat-version.png", "https://www.linuxfoundation.org/", "official-foundation-asset"],
  web: ["Web", "https://www.w3.org/assets/logos/w3c-2025/favicons/favicon-180.png", "https://www.w3.org/", "official-standards-body-asset"],
  ios: ["iOS", "https://www.apple.com/apple-touch-icon.png", "https://www.apple.com/ios/", "official-vendor-icon"],
  android: ["Android", "https://developer.android.com/static/images/brand/android-head_3D.svg", "https://developer.android.com/distribute/marketing-tools/brand-guidelines", "official-vendor-asset"],
};

const productFallbacks = {
  opencode: [avatar("anomalyco"), "https://github.com/anomalyco", "official-organization-avatar"],
  goose: [avatar("aaif-goose"), "https://github.com/aaif-goose", "official-organization-avatar"],
  aider: [avatar("Aider-AI"), "https://github.com/Aider-AI", "official-organization-avatar"],
  cline: [avatar("cline"), "https://github.com/cline", "official-organization-avatar"],
  continue: [avatar("continuedev"), "https://github.com/continuedev", "official-organization-avatar"],
  "kilo-code": [avatar("Kilo-Org"), "https://github.com/Kilo-Org", "official-organization-avatar"],
  happy: [avatar("slopus"), "https://github.com/slopus", "official-organization-avatar"],
  vibetunnel: [avatar("amantus-ai"), "https://github.com/amantus-ai", "official-organization-avatar"],
  shunt: ["https://shunt.app/favicon.ico", "https://shunt.app/", "official-site-icon"],
};

const extensionFor = (assetUrl, contentType = "") => {
  if (contentType.includes("image/svg+xml")) return ".svg";
  if (contentType.includes("image/jpeg")) return ".jpg";
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/x-icon") || contentType.includes("image/vnd.microsoft.icon")) return ".ico";
  const extension = extname(new URL(assetUrl).pathname).toLowerCase();
  return [".svg", ".png", ".webp", ".jpg", ".jpeg", ".ico"].includes(extension) ? extension : ".png";
};

const fetchAsset = async (id, candidates) => {
  const errors = [];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const [assetUrl, sourceUrl, sourceType] = candidate;
    try {
      const response = await fetch(assetUrl, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "user-agent": "tortie.sh comparison asset collector" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 100) throw new Error(`unexpectedly small (${bytes.length} bytes)`);
      return { bytes, assetUrl, sourceUrl, sourceType, contentType: response.headers.get("content-type") || "" };
    } catch (error) {
      errors.push(`${assetUrl}: ${error.message}`);
    }
  }
  throw new Error(`${id}: every first-party asset candidate failed: ${errors.join("; ")}`);
};

const downloadGroup = async (group, directory, prefix, fallbacks = {}) => {
  const result = {};
  await mkdir(resolve(publicRoot, directory), { recursive: true });
  for (const [id, [name, assetUrl, sourceUrl, sourceType]] of Object.entries(group)) {
    const fetched = await fetchAsset(id, [
      [assetUrl, sourceUrl, sourceType],
      fallbacks[id],
    ]);
    const extension = extensionFor(fetched.assetUrl, fetched.contentType);
    const filename = `${id}${extension}`;
    await writeFile(resolve(publicRoot, directory, filename), fetched.bytes);
    result[id] = {
      name,
      alt: `${name} logo`,
      src: `/compare/${directory}/${filename}`,
      sourceUrl: fetched.sourceUrl,
      sourceType: fetched.sourceType,
      checkedAt,
    };
    process.stdout.write(`${prefix} ${id} (${fetched.bytes.length.toLocaleString()} bytes)\n`);
  }
  return result;
};

const productManifest = await downloadGroup(products, "logos", "logo", productFallbacks);
const platformManifest = await downloadGroup(platforms, "platforms", "platform");
await writeFile(
  manifestPath,
  `${JSON.stringify({ checkedAt, products: productManifest, platforms: platformManifest }, null, 2)}\n`,
);
console.log(`wrote ${manifestPath}`);
