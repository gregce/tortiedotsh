#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const checkedAt = "2026-08-23";
const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public/compare");
const manifestPath = resolve(root, "src/data/comparison-assets.json");

const options = { missingOnly: false, productIds: new Set() };
for (let index = 0; index < process.argv.slice(2).length; index += 1) {
  const args = process.argv.slice(2);
  const argument = args[index];
  if (argument === "--missing-only") options.missingOnly = true;
  else if (argument === "--product") {
    const id = args[index + 1];
    if (!id || id.startsWith("--")) throw new Error("--product requires an ID");
    options.productIds.add(id);
    index += 1;
  } else if (argument === "--help") {
    console.log(`Fetch first-party comparison identity assets.

Options:
  --product <id>    Refresh one product (repeatable)
  --missing-only    Fetch only manifest entries without a local asset
  --help            Show this message`);
    process.exit(0);
  } else throw new Error(`Unknown argument: ${argument}`);
}

const raw = (repo, path) =>
  `https://raw.githubusercontent.com/${repo}/HEAD/${path.split("/").map(encodeURIComponent).join("/")}`;
const avatar = (owner) => `https://github.com/${owner}.png?size=512`;

const products = {
  "visual-studio-code": ["Visual Studio Code", "https://code.visualstudio.com/assets/apple-touch-icon.png", "https://code.visualstudio.com/", "official-site-icon"],
  "cursor-ide": ["Cursor IDE", "https://cursor.com/marketing-static/favicon-light.svg", "https://cursor.com/", "official-site-icon"],
  windsurf: ["Devin Desktop", "https://mintcdn.com/cognitionai/Hhrl_8XUBqA4VQ6v/logo/favicon.svg?fit=max&auto=format&n=Hhrl_8XUBqA4VQ6v&q=85&s=ab641f30c01bf5374b90b62209db569e", "https://docs.devin.ai/", "official-product-asset"],
  zed: ["Zed", raw("zed-industries/zed", "crates/zed/resources/app-icon@2x.png"), "https://github.com/zed-industries/zed/blob/HEAD/crates/zed/resources/app-icon%402x.png", "official-repository-asset"],
  kiro: ["Kiro", "https://kiro.dev/icon.svg", "https://kiro.dev/", "official-site-icon"],
  void: ["Void", raw("voideditor/void", "void_icons/slice_of_void.png"), "https://github.com/voideditor/void/blob/HEAD/void_icons/slice_of_void.png", "official-repository-asset"],
  "eclipse-theia-ide": ["Eclipse Theia IDE", raw("eclipse-theia/theia-ide", "applications/electron/resources/icons/MacLauncherIcons/icon.icon/Assets/icon.png"), "https://github.com/eclipse-theia/theia-ide/blob/HEAD/applications/electron/resources/icons/MacLauncherIcons/icon.icon/Assets/icon.png", "official-repository-asset"],
  traecode: ["TraeCode", avatar("Trae-AI"), "https://github.com/Trae-AI", "official-product-organization-avatar"],
  "qoder-ide": ["Qoder IDE", avatar("QoderAI"), "https://github.com/QoderAI", "official-product-organization-avatar"],
  "antigravity-ide": ["Antigravity IDE", avatar("google"), "https://github.com/google", "official-vendor-organization-avatar"],
  "android-studio": ["Android Studio", "https://developer.android.com/static/studio/images/studio-icon.svg", "https://developer.android.com/studio/install", "official-site-asset"],
  "intellij-idea": ["IntelliJ IDEA", raw("JetBrains/logos", "web/intellij-idea/intellij-idea.svg"), "https://github.com/JetBrains/logos/blob/HEAD/web/intellij-idea/intellij-idea.svg", "official-vendor-brand-asset"],
  positron: ["Positron", raw("posit-dev/positron", "resources/server/positron-512.png"), "https://github.com/posit-dev/positron/blob/HEAD/resources/server/positron-512.png", "official-repository-asset"],
  onlook: ["Onlook", raw("onlook-dev/onlook", "assets/logo.svg"), "https://github.com/onlook-dev/onlook/blob/HEAD/assets/logo.svg", "official-repository-asset"],
  tortie: ["Tortie", raw("gregce/tortie", "docs/brand/tortie/macos/Tortie.iconset/icon_512x512@2x.png"), "https://github.com/gregce/tortie/blob/HEAD/docs/brand/tortie/macos/Tortie.iconset/icon_512x512%402x.png", "official-repository-asset"],
  cate: ["Cate", raw("0-AI-UG/cate", "assets/cate-logo.svg"), "https://github.com/0-AI-UG/cate/blob/HEAD/assets/cate-logo.svg", "official-repository-asset"],
  cdesktop: ["cdesktop", raw("cdesktop-ai/cdesktop", "crates/tauri-app/icons/icon.png"), "https://github.com/cdesktop-ai/cdesktop/blob/HEAD/crates/tauri-app/icons/icon.png", "official-repository-asset"],
  cmux: ["cmux", raw("manaflow-ai/cmux", "web/public/brand/app-icon-dark.png"), "https://github.com/manaflow-ai/cmux/blob/HEAD/web/public/brand/app-icon-dark.png", "official-repository-asset"],
  wmux: ["wmux", raw("openwong2kim/wmux", "assets/icon.svg"), "https://github.com/openwong2kim/wmux/blob/HEAD/assets/icon.svg", "official-repository-asset"],
  warp: ["Warp", "https://www.warp.dev/favicon-196x196.png", "https://www.warp.dev/", "official-site-icon"],
  "wave-terminal": ["Wave Terminal", avatar("wavetermdev"), "https://github.com/wavetermdev", "official-organization-avatar"],
  orca: ["Orca", raw("stablyai/orca", "resources/icon.png"), "https://github.com/stablyai/orca/blob/HEAD/resources/icon.png", "official-repository-asset"],
  conductor: ["Conductor", "https://www.conductor.build/icon.png?icon.7d575655.png", "https://www.conductor.build/", "official-site-icon"],
  "claude-code-desktop": ["Claude Code on desktop", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "poolside-desktop-assistant": ["Poolside Desktop Assistant", avatar("poolsideai"), "https://github.com/poolsideai", "official-organization-avatar"],
  bb: ["bb", raw("get-bb/bb", "apps/desktop/assets/icon.png"), "https://github.com/get-bb/bb/blob/HEAD/apps/desktop/assets/icon.png", "official-repository-asset"],
  omnigent: ["Omnigent", raw("omnigent-ai/omnigent", "web/electron/icons/icon.png"), "https://github.com/omnigent-ai/omnigent/blob/HEAD/web/electron/icons/icon.png", "official-repository-asset"],
  "agent-orchestrator": ["Agent Orchestrator", raw("Untrivial-ai/agent-orchestrator", "frontend/assets/icon.png"), "https://github.com/Untrivial-ai/agent-orchestrator/blob/HEAD/frontend/assets/icon.png", "official-repository-asset"],
  emdash: ["Emdash", raw("generalaction/emdash", "apps/emdash-desktop/src/assets/images/emdash/icon-light.png"), "https://github.com/generalaction/emdash/blob/HEAD/apps/emdash-desktop/src/assets/images/emdash/icon-light.png", "official-repository-asset"],
  kandev: ["Kandev", raw("kdlbs/kandev", "apps/web/public/icon.svg"), "https://github.com/kdlbs/kandev/blob/HEAD/apps/web/public/icon.svg", "official-repository-asset"],
  paseo: ["Paseo", raw("getpaseo/paseo", "packages/app/assets/images/icon.png"), "https://github.com/getpaseo/paseo/blob/HEAD/packages/app/assets/images/icon.png", "official-repository-asset"],
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
  "chatgpt-desktop": ["ChatGPT desktop", avatar("openai"), "https://github.com/openai", "official-organization-avatar"],
  "cursor-cli": ["Cursor CLI", "https://cursor.com/marketing-static/favicon-light.svg", "https://cursor.com/cli", "official-site-icon"],
  "gemini-cli": ["Gemini CLI", avatar("google-gemini"), "https://github.com/google-gemini", "official-organization-avatar"],
  "factory-droid-cli": ["Factory Droid CLI", "https://docs.factory.ai/favicon.svg", "https://docs.factory.ai/cli/getting-started/quickstart", "official-site-icon"],
  codewhale: ["CodeWhale", raw("Hmbown/CodeWhale", "web/app/icon.svg"), "https://github.com/Hmbown/CodeWhale/blob/HEAD/web/app/icon.svg", "official-repository-asset"],
  "antigravity-cli": ["Antigravity CLI", avatar("google"), "https://github.com/google", "official-organization-avatar"],
  "qwen-code": ["Qwen Code", raw("QwenLM/qwen-code", "packages/chrome-extension/public/icons/icon-source.png"), "https://github.com/QwenLM/qwen-code/blob/HEAD/packages/chrome-extension/public/icons/icon-source.png", "official-repository-asset"],
  "pi-coding-agent": ["Pi coding agent", "https://pi.dev/favicon.svg", "https://pi.dev/press-kit", "official-product-asset"],
  opencode: ["OpenCode CLI", raw("anomalyco/opencode", "packages/app/public/favicon-96x96-v3.png"), "https://github.com/anomalyco/opencode/blob/HEAD/packages/app/public/favicon-96x96-v3.png", "official-repository-asset"],
  "github-copilot-cli": ["GitHub Copilot CLI", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  goose: ["Goose CLI", raw("aaif-goose/goose", "ui/desktop/src/images/icon.svg"), "https://github.com/aaif-goose/goose/blob/HEAD/ui/desktop/src/images/icon.svg", "official-repository-asset"],
  aider: ["Aider", raw("Aider-AI/aider", "aider/website/assets/logo.svg"), "https://github.com/Aider-AI/aider/blob/HEAD/aider/website/assets/logo.svg", "official-repository-asset"],
  "grok-build": ["Grok Build", avatar("xai-org"), "https://github.com/xai-org", "official-organization-avatar"],
  amp: ["Amp", "https://ampcode.com/app-icon.svg", "https://ampcode.com/", "official-site-icon"],
  "prime-agent": ["Prime Agent", raw("PrimeIntellect-ai/prime-agent", "assets/brand/prime-butterfly.svg"), "https://github.com/PrimeIntellect-ai/prime-agent/blob/HEAD/assets/brand/prime-butterfly.svg", "official-repository-asset"],
  "deepseek-harness": ["DeepSeek Harness", raw("deepseek-ai/deepseek-harness", "apps/web/public/favicon.svg"), "https://github.com/deepseek-ai/deepseek-harness/blob/HEAD/apps/web/public/favicon.svg", "official-repository-asset"],
  "poolside-pool": ["pool", avatar("poolsideai"), "https://github.com/poolsideai", "official-organization-avatar"],
  "kimi-code-cli": ["Kimi Code CLI", raw("MoonshotAI/kimi-code", "docs/public/favicon.ico"), "https://github.com/MoonshotAI/kimi-code/blob/HEAD/docs/public/favicon.ico", "official-repository-asset"],
  "kilo-code-cli": ["Kilo Code CLI", raw("Kilo-Org/kilocode", "logo.png"), "https://github.com/Kilo-Org/kilocode/blob/HEAD/logo.png", "official-repository-asset"],
  "mistral-vibe": ["Mistral Vibe", avatar("mistralai"), "https://github.com/mistralai", "official-organization-avatar"],
  "continue-cli": ["Continue CLI", raw("continuedev/continue", "docs/images/logo.png"), "https://github.com/continuedev/continue/blob/HEAD/docs/images/logo.png", "official-repository-asset"],
  crush: ["Crush", raw("charmbracelet/crush", "internal/ui/notification/crush-icon-solo.png"), "https://github.com/charmbracelet/crush/blob/HEAD/internal/ui/notification/crush-icon-solo.png", "official-repository-asset"],
  "auggie-cli": ["Auggie CLI", avatar("augmentcode"), "https://github.com/augmentcode", "official-organization-avatar"],
  "kiro-cli": ["Kiro CLI", "https://kiro.dev/icon.svg", "https://kiro.dev/docs/cli/installation/", "official-site-icon"],
  "amplifier-agent": ["Amplifier Agent", avatar("microsoft"), "https://github.com/microsoft", "official-organization-avatar"],
  gptme: ["gptme", raw("gptme/gptme", "media/logo.png"), "https://github.com/gptme/gptme/blob/HEAD/media/logo.png", "official-repository-asset"],
  "github-copilot-vscode": ["GitHub Copilot for VS Code", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  "codex-ide-extension": ["OpenAI Codex IDE extension", avatar("openai"), "https://github.com/openai", "official-organization-avatar"],
  "claude-code-vscode": ["Claude Code for VS Code", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "claude-code-jetbrains": ["Claude Code for JetBrains", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "amazon-q-developer-ide": ["Amazon Q Developer IDE extension", avatar("aws"), "https://github.com/aws", "official-organization-avatar"],
  "gemini-code-assist": ["Gemini Code Assist IDE extension", avatar("google-gemini"), "https://github.com/google-gemini", "official-organization-avatar"],
  "jetbrains-ai-assistant": ["JetBrains AI Assistant", avatar("JetBrains"), "https://github.com/JetBrains", "official-organization-avatar"],
  cline: ["Cline extension", raw("cline/cline", "assets/icons/icon.svg"), "https://github.com/cline/cline/blob/HEAD/assets/icons/icon.svg", "official-repository-asset"],
  continue: ["Continue extension", raw("continuedev/continue", "extensions/vscode/media/icon.png"), "https://github.com/continuedev/continue/blob/HEAD/extensions/vscode/media/icon.png", "official-repository-asset"],
  "kilo-code": ["Kilo Code extension", raw("Kilo-Org/kilocode", "packages/kilo-vscode/assets/icons/kilo-dark.png"), "https://github.com/Kilo-Org/kilocode/blob/HEAD/packages/kilo-vscode/assets/icons/kilo-dark.png", "official-repository-asset"],
  "pochi-vscode": ["Pochi VS Code extension", raw("TabbyML/pochi", "packages/vscode/assets/icons/logo128.png"), "https://github.com/TabbyML/pochi/blob/HEAD/packages/vscode/assets/icons/logo128.png", "official-repository-asset"],
  "tabby-ide-extensions": ["Tabby IDE extensions", avatar("TabbyML"), "https://github.com/TabbyML", "official-organization-avatar"],
  "codecompanion-nvim": ["CodeCompanion.nvim", raw("olimorris/codecompanion.nvim", "doc/public/favicon.png"), "https://github.com/olimorris/codecompanion.nvim/blob/HEAD/doc/public/favicon.png", "official-repository-asset"],
  "avante-nvim": ["avante.nvim", avatar("yetone"), "https://github.com/yetone/avante.nvim", "official-project-owner-avatar"],
  "refact-ide-plugins": ["Refact IDE plugins", raw("smallcloudai/refact", "plugins/vscode/images/logo-small.png"), "https://github.com/smallcloudai/refact/blob/HEAD/plugins/vscode/images/logo-small.png", "official-repository-asset"],
  "openai-codex-cloud": ["OpenAI Codex cloud", avatar("openai"), "https://github.com/openai", "official-organization-avatar"],
  "github-copilot-coding-agent": ["GitHub Copilot coding agent", avatar("github"), "https://github.com/github", "official-organization-avatar"],
  devin: ["Devin", "https://mintcdn.com/cognitionai/Hhrl_8XUBqA4VQ6v/logo/favicon.svg?fit=max&auto=format&n=Hhrl_8XUBqA4VQ6v&q=85&s=ab641f30c01bf5374b90b62209db569e", "https://docs.devin.ai/", "official-product-asset"],
  jules: ["Jules", "https://www.gstatic.com/labs-code/code-app/favicon-48x48.png", "https://jules.google.com/", "official-product-icon"],
  "claude-code-web": ["Claude Code on the web", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "cursor-cloud-agents": ["Cursor Cloud Agents", "https://cursor.com/marketing-static/favicon-light.svg", "https://cursor.com/docs/cloud-agent", "official-site-icon"],
  "factory-cloud-sessions": ["Factory Droid Computers / cloud sessions", "https://docs.factory.ai/favicon.svg", "https://docs.factory.ai/", "official-site-icon"],
  "codegen-agent": ["Codegen agent", avatar("codegen-sh"), "https://github.com/codegen-sh", "official-organization-avatar"],
  "gitlab-duo-developer-flow": ["GitLab Duo Developer Flow", avatar("gitlab-org"), "https://github.com/gitlab-org", "official-organization-avatar"],
  "coder-agents": ["Coder Agents", avatar("coder"), "https://github.com/coder", "official-organization-avatar"],
  "replit-agent-background-tasks": ["Replit Agent background tasks", avatar("replit"), "https://github.com/replit", "official-organization-avatar"],
  "openhands-cloud": ["OpenHands Cloud", avatar("OpenHands"), "https://github.com/OpenHands", "official-organization-avatar"],
  happy: ["Happy", raw("slopus/happy", "logo.png"), "https://github.com/slopus/happy/blob/HEAD/logo.png", "official-repository-asset"],
  vibetunnel: ["VibeTunnel", raw("amantus-ai/vibetunnel", "mac/VibeTunnel/Assets.xcassets/AppIcon.appiconset/icon_512x512.png"), "https://github.com/amantus-ai/vibetunnel/blob/HEAD/mac/VibeTunnel/Assets.xcassets/AppIcon.appiconset/icon_512x512.png", "official-repository-asset"],
  shunt: ["Shunt", "https://shunt.app/icon.png", "https://shunt.app/", "official-site-icon"],
  "claude-code-remote-control": ["Claude Code Remote Control", avatar("anthropics"), "https://github.com/anthropics", "official-organization-avatar"],
  "code-server": ["code-server", raw("coder/code-server", "src/browser/media/favicon.svg"), "https://github.com/coder/code-server/blob/HEAD/src/browser/media/favicon.svg", "official-repository-asset"],
  "openvscode-server": ["OpenVSCode Server", raw("gitpod-io/openvscode-server", "resources/server/favicon.ico"), "https://github.com/gitpod-io/openvscode-server/blob/HEAD/resources/server/favicon.ico", "official-repository-asset"],
  "vscode-remote-development": ["VS Code Remote Development extensions", "https://code.visualstudio.com/assets/apple-touch-icon.png", "https://code.visualstudio.com/docs/remote/remote-overview", "official-site-icon"],
  sshx: ["sshx", raw("ekzhang/sshx", "src/lib/assets/logo.svg"), "https://github.com/ekzhang/sshx/blob/HEAD/src/lib/assets/logo.svg", "official-repository-asset"],
  upterm: ["Upterm", avatar("owenthereal"), "https://github.com/owenthereal/upterm", "official-project-owner-avatar"],
  termix: ["Termix", raw("Termix-SSH/Termix", "public/icon.png"), "https://github.com/Termix-SSH/Termix/blob/HEAD/public/icon.png", "official-repository-asset"],
  ttyd: ["ttyd", avatar("tsl0922"), "https://github.com/tsl0922/ttyd", "official-project-owner-avatar"],
  specstory: ["SpecStory", avatar("specstoryai"), "https://github.com/specstoryai", "official-organization-avatar"],
  entire: ["Entire", avatar("entireio"), "https://github.com/entireio", "official-organization-avatar"],
  tapes: ["Tapes", avatar("papercomputeco"), "https://github.com/papercomputeco", "official-organization-avatar"],
  "traces-com": ["Traces", avatar("traces-sh"), "https://github.com/traces-sh", "official-organization-avatar"],
  agentsview: ["AgentsView", avatar("kenn-io"), "https://github.com/kenn-io/agentsview", "official-project-owner-avatar"],
  "claude-code-history-viewer": ["Claude Code History Viewer", avatar("jhlee0409"), "https://github.com/jhlee0409/claude-code-history-viewer", "official-project-owner-avatar"],
  "agent-sessions": ["Agent Sessions", avatar("jazzyalex"), "https://github.com/jazzyalex/agent-sessions", "official-project-owner-avatar"],
  dmux: ["dmux", avatar("standardagents"), "https://github.com/standardagents/dmux", "official-organization-avatar"],
};

const platforms = {
  macos: ["macOS", "https://www.apple.com/apple-touch-icon.png", "https://www.apple.com/macos/", "official-vendor-icon"],
  windows: ["Windows", "https://www.microsoft.com/favicon.ico", "https://www.microsoft.com/windows/", "official-vendor-icon"],
  linux: ["Linux", "https://www.linuxfoundation.org/hubfs/Tux-flat-version.png", "https://www.linuxfoundation.org/", "official-foundation-asset"],
  ios: ["iOS", "https://www.apple.com/apple-touch-icon.png", "https://www.apple.com/ios/", "official-vendor-icon"],
  android: ["Android", "https://developer.android.com/static/images/brand/android-head_3D.svg", "https://developer.android.com/distribute/marketing-tools/brand-guidelines", "official-vendor-asset"],
};

const productFallbacks = {
  "eclipse-theia-ide": [avatar("eclipse-theia"), "https://github.com/eclipse-theia", "official-organization-avatar"],
  "android-studio": [avatar("google"), "https://github.com/google", "official-vendor-organization-avatar"],
  positron: [avatar("posit-dev"), "https://github.com/posit-dev", "official-organization-avatar"],
  onlook: [avatar("onlook-dev"), "https://github.com/onlook-dev", "official-organization-avatar"],
  cate: [avatar("0-AI-UG"), "https://github.com/0-AI-UG", "official-organization-avatar"],
  cdesktop: [avatar("cdesktop-ai"), "https://github.com/cdesktop-ai", "official-organization-avatar"],
  "poolside-desktop-assistant": [avatar("poolsideai"), "https://github.com/poolsideai", "official-organization-avatar"],
  bb: [avatar("get-bb"), "https://github.com/get-bb", "official-organization-avatar"],
  omnigent: [avatar("omnigent-ai"), "https://github.com/omnigent-ai", "official-organization-avatar"],
  "agent-orchestrator": [avatar("Untrivial-ai"), "https://github.com/Untrivial-ai", "official-organization-avatar"],
  emdash: [avatar("generalaction"), "https://github.com/generalaction", "official-organization-avatar"],
  kandev: [avatar("kdlbs"), "https://github.com/kdlbs", "official-organization-avatar"],
  paseo: [avatar("getpaseo"), "https://github.com/getpaseo", "official-organization-avatar"],
  amp: ["https://ampcode.com/app-icon.png?v=3", "https://ampcode.com/", "official-site-icon"],
  "prime-agent": [avatar("PrimeIntellect-ai"), "https://github.com/PrimeIntellect-ai", "official-organization-avatar"],
  "deepseek-harness": [avatar("deepseek-ai"), "https://github.com/deepseek-ai", "official-organization-avatar"],
  "kimi-code-cli": [avatar("MoonshotAI"), "https://github.com/MoonshotAI", "official-organization-avatar"],
  "kilo-code-cli": [avatar("Kilo-Org"), "https://github.com/Kilo-Org", "official-organization-avatar"],
  "mistral-vibe": [avatar("mistralai"), "https://github.com/mistralai", "official-organization-avatar"],
  "continue-cli": [avatar("continuedev"), "https://github.com/continuedev", "official-organization-avatar"],
  crush: [avatar("charmbracelet"), "https://github.com/charmbracelet", "official-organization-avatar"],
  gptme: [avatar("gptme"), "https://github.com/gptme", "official-organization-avatar"],
  "pochi-vscode": [avatar("TabbyML"), "https://github.com/TabbyML", "official-organization-avatar"],
  "tabby-ide-extensions": [avatar("TabbyML"), "https://github.com/TabbyML", "official-organization-avatar"],
  "codecompanion-nvim": [avatar("olimorris"), "https://github.com/olimorris", "official-project-owner-avatar"],
  "refact-ide-plugins": [avatar("smallcloudai"), "https://github.com/smallcloudai", "official-organization-avatar"],
  opencode: [avatar("anomalyco"), "https://github.com/anomalyco", "official-organization-avatar"],
  goose: [avatar("aaif-goose"), "https://github.com/aaif-goose", "official-organization-avatar"],
  aider: [avatar("Aider-AI"), "https://github.com/Aider-AI", "official-organization-avatar"],
  cline: [avatar("cline"), "https://github.com/cline", "official-organization-avatar"],
  continue: [avatar("continuedev"), "https://github.com/continuedev", "official-organization-avatar"],
  "kilo-code": [avatar("Kilo-Org"), "https://github.com/Kilo-Org", "official-organization-avatar"],
  happy: [avatar("slopus"), "https://github.com/slopus", "official-organization-avatar"],
  vibetunnel: [avatar("amantus-ai"), "https://github.com/amantus-ai", "official-organization-avatar"],
  shunt: ["https://shunt.app/favicon.ico", "https://shunt.app/", "official-site-icon"],
  "coder-agents": [avatar("coder"), "https://github.com/coder", "official-organization-avatar"],
  "openhands-cloud": [avatar("OpenHands"), "https://github.com/OpenHands", "official-organization-avatar"],
  "code-server": [avatar("coder"), "https://github.com/coder", "official-organization-avatar"],
  "openvscode-server": [avatar("gitpod-io"), "https://github.com/gitpod-io", "official-organization-avatar"],
  sshx: [avatar("ekzhang"), "https://github.com/ekzhang", "official-project-owner-avatar"],
  upterm: [avatar("owenthereal"), "https://github.com/owenthereal", "official-project-owner-avatar"],
  termix: [avatar("Termix-SSH"), "https://github.com/Termix-SSH", "official-organization-avatar"],
  ttyd: [avatar("tsl0922"), "https://github.com/tsl0922", "official-project-owner-avatar"],
  specstory: [avatar("specstoryai"), "https://github.com/specstoryai", "official-organization-avatar"],
  entire: [avatar("entireio"), "https://github.com/entireio", "official-organization-avatar"],
  tapes: [avatar("papercomputeco"), "https://github.com/papercomputeco", "official-organization-avatar"],
  "traces-com": [avatar("traces-sh"), "https://github.com/traces-sh", "official-organization-avatar"],
  agentsview: [avatar("kenn-io"), "https://github.com/kenn-io", "official-project-owner-avatar"],
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

const downloadGroup = async (group, directory, prefix, previous = {}, fallbacks = {}, selectedIds = null) => {
  const result = Object.fromEntries(
    Object.entries(previous).filter(([id]) => Object.hasOwn(group, id)),
  );
  await mkdir(resolve(publicRoot, directory), { recursive: true });
  for (const [id, [name, assetUrl, sourceUrl, sourceType]] of Object.entries(group)) {
    if (selectedIds && !selectedIds.has(id)) continue;
    if (options.missingOnly && result[id]) continue;
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

let previousManifest = { products: {}, platforms: {} };
try {
  previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
for (const id of options.productIds) {
  if (!Object.hasOwn(products, id)) throw new Error(`Unknown product asset ID: ${id}`);
}
const selectedProducts = options.productIds.size > 0 ? options.productIds : null;
const productManifest = await downloadGroup(
  products,
  "logos",
  "logo",
  previousManifest.products,
  productFallbacks,
  selectedProducts,
);
const downloadedPlatformManifest = await downloadGroup(
  platforms,
  "platforms",
  "platform",
  previousManifest.platforms,
  {},
  options.productIds.size > 0 ? new Set() : null,
);
const platformManifest = {
  ...downloadedPlatformManifest,
  web: {
    name: "Web",
    alt: "Web globe",
    src: "/compare/platforms/web.svg",
    sourceUrl: "https://www.w3.org/standards/",
    sourceType: "original-interface-glyph",
    checkedAt,
  },
};
await writeFile(
  manifestPath,
  `${JSON.stringify({ checkedAt, products: productManifest, platforms: platformManifest }, null, 2)}\n`,
);
console.log(`wrote ${manifestPath}`);
