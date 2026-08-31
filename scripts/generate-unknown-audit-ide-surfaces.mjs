#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  COMPARISON_SNAPSHOT,
  comparisonCategories,
  comparisonProducts,
  getComparisonClaim,
} from "../src/data/comparison-catalog.ts";

const checkedAt = "2026-08-24";
const root = resolve(import.meta.dirname, "..");
const ledgerPath = resolve(root, "src/data/unknown-audit-ide-surfaces.json");
const reportPath = resolve(root, "docs/operations/comparison-unknown-ledger.md");
const checkOnly = process.argv.includes("--check");
const allowedArgs = new Set(["--check"]);
for (const argument of process.argv.slice(2)) {
  if (!allowedArgs.has(argument)) throw new Error(`Unknown argument: ${argument}`);
}

const categoryIds = ["code-editors", "ide-extensions", "agent-workbenches"];
const excludedProductIds = ["mosaic-terminal", "airport", "muse-code", "omnara"];
const excluded = new Set(excludedProductIds);

const productNotes = {
  "eclipse-theia-ide": "The packaged Eclipse Theia IDE sources establish its editor, terminal, AI panel, MCP, and browser-delivered application, while keeping framework capabilities distinct from this exact IDE SKU.",
  traecode: "TRAE's exact IDE and SOLO material establishes the shipped editor, agent, terminal, browser preview, model service, and current safety controls without inheriting capabilities from the separate SOLO Web product.",
  "qoder-ide": "Qoder's desktop and Quest documentation establishes the Editor and Quest workspaces, agent tools, task board, sandbox, and current desktop release behavior for the exact IDE.",
  "antigravity-ide": "Antigravity's IDE pages establish its editor, agent side panel, terminal tools, MCP, permissions, browser agent, and desktop downloads without inheriting Antigravity CLI or cloud behavior.",
  "android-studio": "Android Studio's first-party pages establish the IDE, Gemini agent mode, terminal execution, emulator and device verification, and current desktop distribution without treating adjacent Google coding products as this SKU.",
  "intellij-idea": "IntelliJ IDEA and JetBrains AI Assistant pages establish the unified IDE, terminal, Git worktrees, remote development, model access, and agent integrations without assigning every external-agent capability to IDEA itself.",
  positron: "Positron's exact product, Assistant, permission, and repository sources establish its data-science editor, terminal, agent tools, MCP, review, remote access, and browser preview boundaries.",
  onlook: "Onlook's current web editor, canonical repository, UI guide, and self-hosting pages establish its visual React workspace and sandbox-provider architecture without inheriting behavior from the retired desktop build.",
  "visual-studio-code": "Visual Studio Code's current agent documentation establishes the editor, Agent Host, approvals, sandboxing, browser tools, worktrees, and remote development for the exact IDE.",
  "cursor-ide": "Cursor's exact IDE documentation establishes local and background agents, worktrees, approvals, sandboxing, browser tools, and model access without treating the separate cloud web console as an IDE platform.",
  windsurf: "Devin Desktop documentation establishes the renamed desktop editor, local agent, terminal, MCP, Tab completion, Quick Review, and browser preview; hosted Devin sessions remain a separate product boundary.",
  zed: "Zed's exact editor documentation establishes its native agent, ACP, parallel worktrees, approvals, sandbox, terminal tools, and current desktop channels.",
  lapce: "Lapce's setup, terminal, remote-development, release, and canonical repository sources establish a general modal editor with experimental Copilot completion rather than a first-party coding-agent surface.",
  helix: "Helix's commands, installation guide, canonical repository, and maintainer discussions establish a terminal-first modal editor whose AI integrations remain external LSP or CLI concerns.",
  kiro: "Kiro's exact IDE, shared-harness, permissions, Focus, source-control, and release documentation establishes the desktop editor while keeping Kiro Web and Kiro CLI as separate surfaces.",
  void: "Void's archived repository and historical releases establish the final open-source desktop editor and experimental AI surface; no current product documentation exists beyond that retained record.",
  "visual-studio": "Visual Studio's exact product and GitHub Copilot documentation establish the Windows IDE, editor, terminal, debugging, source control, and agent integration without inheriting capabilities from VS Code or Visual Studio Code extensions.",
  "replit-project-editor": "Replit's exact workspace and Agent documentation establish the browser-hosted project editor, terminal, preview, deployment, and agent task surface without treating the broader Replit service as a conventional local desktop IDE.",
  stagewise: "stagewise's canonical repository establishes the exact agentic IDE, browser and terminal tools, project context, approvals, and open-source distribution without inheriting optional host-editor extensions.",
  "github-copilot-vscode": "GitHub's IDE feature matrix and installation pages establish the multi-host Copilot extension family; host-specific VS Code behavior and the separately owned cloud coding agent are not automatically universal to every host.",
  cline: "Cline's exact extension documentation establishes its IDE panel, tools, MCP, checkpoints, auto-approval, and configurable model-provider layer without inheriting Cline CLI or hosted-service ownership.",
  continue: "Continue's final extension documentation and canonical read-only repository establish the VS Code and JetBrains plugins, providers, MCP, codebase context, and local agent boundary.",
  "kilo-code": "Kilo Code's exact VS Code and JetBrains extension pages establish provider choice, MCP, checkpoints, permissions, and Agent Manager worktrees while keeping the cloud agent and CLI as sibling surfaces.",
  "codex-ide-extension": "OpenAI's Codex IDE pages establish the VS Code-compatible extension, local Codex sidecar, permissions, MCP, and cloud-task handoff without inheriting every Codex CLI or cloud capability.",
  "claude-code-vscode": "Anthropic's IDE integration and platform comparison establish the VS Code-compatible Claude Code extension backed by the local CLI, while web and remote sessions remain separately owned surfaces.",
  "claude-code-jetbrains": "Anthropic's exact platform comparison establishes the JetBrains plugin and local Claude Code execution boundary without inheriting the sibling VS Code extension or web client.",
  "amazon-q-developer-ide": "Amazon Q Developer's IDE matrix and MCP documentation establish the extension family across VS Code, JetBrains, Eclipse, and Visual Studio, with host-specific feature differences preserved.",
  "gemini-code-assist": "Google Cloud's exact Gemini Code Assist IDE documentation establishes VS Code and JetBrains extensions, inline assistance, agent mode, tools, context, MCP, and current service-tier boundaries.",
  "jetbrains-ai-assistant": "JetBrains AI Assistant documentation establishes the JetBrains-only plugin, selectable models and agents, ACP, MCP, operation modes, authorization, and change review.",
  "pochi-vscode": "Pochi's canonical repository and exact VS Code guide establish its extension, models, tool use, worktree-isolated parallel tasks, task history, and optional cloud storage without inheriting unrelated Tabby products.",
  "tabby-ide-extensions": "Tabby's canonical repository and agent-client documentation establish its self-hosted completion service and editor clients without treating the separate Pochi agent extension as Tabby core.",
  "codecompanion-nvim": "CodeCompanion's canonical repository and Neovim documentation establish its chat buffers, providers, ACP agents, MCP, tools, inline transforms, and asynchronous in-process execution.",
  "avante-nvim": "avante.nvim's canonical repository establishes a Neovim-resident agent panel, provider adapters, ACP agents, inline editing, and repository context without inheriting capabilities from the Neovim host or optional companion plugins.",
  "refact-ide-plugins": "Refact's canonical product and agent repositories establish its editor plugins, local agent/LSP, providers, MCP, codebase context, and self-hosted server boundary.",
  "roo-code": "Roo Code's archived repository and retained exact extension documentation establish the historical VS Code-family panel, providers, MCP, checkpoints, permissions, and indexing before shutdown.",
  "tabnine-agent": "Tabnine's exact Agent and installation documentation establishes its supported IDE hosts, inline assistance, codebase context, and operator checkpoints without inheriting capabilities from unrelated Tabnine deployment products.",
  "windsurf-plugins": "The current Windsurf Plugins documentation establishes Cascade, completion, MCP, review, and the JetBrains-hosted execution boundary without treating Devin Desktop or the hosted Devin agent as the same SKU.",
  "sourcegraph-cody-enterprise": "Sourcegraph's current Cody Enterprise documentation establishes the supported IDE clients, codebase context, model configuration, and enterprise service boundary after the consumer Cody product ended.",
  tortie: "Tortie's canonical repository and shipped acceptance documentation establish its tmux-owned sessions, recovery, cross-project attention, editor, file tree, SCM, review, and current macOS product boundary.",
  cate: "Cate's canonical repository and changelog establish its multi-agent canvas, terminal, editor, browser, SCM, remote SSH, programmable control, and worktree workflows.",
  cdesktop: "cdesktop's canonical repository establishes its current local web client, worktree-backed sessions, diff review, browser, and roadmap boundaries without promoting planned desktop installers to shipped behavior.",
  cmux: "cmux's canonical repository, changelog, Finder, home, and customization sources establish a macOS terminal workspace with durable session recovery, attention states, browser panes, remote access, and CLI control.",
  herdr: "Herdr's canonical repository and exact product documentation establish its daemon-owned terminal panes, named sessions, multi-project agent attention, restore paths, remote SSH clients, socket automation, and worktree control without inheriting editor, SCM, diff-review, or browser capabilities from plugins or hosted tools.",
  wmux: "wmux's canonical README establishes its daemon-owned terminal sessions, splits, file and Git surfaces, diff review, remote access, and Linux/browser reach without treating agent delegation as session transfer.",
  warp: "Warp's exact local application documentation establishes its terminal and agent modes, code editor, project tree, Code Review, SSH, local-agent integrations, and current worktree support while keeping Oz cloud orchestration separate.",
  "wave-terminal": "Wave Terminal's canonical repository and exact workspace documentation establish its saved workspaces, terminal blocks, graphical editor, browser, remote connections, durable SSH sessions, and wsh control surface.",
  dmux: "dmux's canonical README establishes its tmux panes, supported agent launchers, worktree isolation, file and diff browser, notifications, multi-project navigation, merge, and pull-request workflow.",
  "claude-squad": "claude-squad's canonical repository establishes its tmux-managed coding-agent sessions, worktree isolation, Git workflow, attention states, session recovery, and change review without inheriting editor, browser, remote-host, or programmable-control capabilities.",
  "cc-haha": "Claude Code Haha's canonical repository establishes its desktop multi-session workspace, global search, diff review, browser preview, worktrees, attention surfaces, remote web access, and multi-agent workflows without claiming arbitrary CLI support or live-process survival after desktop exit.",
  codeg: "Codeg's canonical repository establishes its aggregated multi-agent sessions, ACP agents, editor, file tree, Git client, worktrees, review queue, splits, server deployment, and mobile clients without treating server-mode durability as proof that the desktop process survives application exit.",
  nodeterm: "nodeterm's canonical repository establishes its tmux-backed terminal canvas, persistent sessions, editors, diffs, Git, worktrees, attention states, remote SSH, browser server, and mobile client while preserving the distinction between its spatial canvas and conventional split panes.",
  ccmanager: "CCManager's canonical repository establishes its cross-project CLI session manager, supported agent launchers, state monitoring, worktree operations, resume configuration, and status hooks without inheriting editor, file-tree, browser, split-pane, or detached-process capabilities.",
  tty7: "tty7's canonical repository establishes its server-owned persistent terminal sessions, agent handoff, cross-project status, notifications, Git and diff surfaces, worktrees, remote workspaces, and programmable CLI without treating editor-grade terminal input as a code editor or implying an embedded browser.",
};

const rowBoundaries = {
  "source-model": "The checked product source does not establish whether the shipped distribution is open source, split source, source available, proprietary, or a hosted service.",
  "product-status": "The checked first-party material does not assign an explicit lifecycle label that maps to the catalog's active, beta, community-maintained, sunsetting, archived, or pivoted states.",
  "editor-project-tree": "It does not directly establish a conventional project tree paired with an editable source surface for this exact product mode.",
  "editor-terminal": "It does not establish an integrated interactive terminal owned by this exact editor surface.",
  "editor-agent-mode": "It does not establish a first-party autonomous coding-agent loop inside this editor.",
  "editor-background-jobs": "It does not establish a detached agent job that keeps running independently of the foreground editor conversation.",
  "editor-inline-prediction": "It does not establish current inline or next-edit code prediction for this exact editor release.",
  "editor-agent-shell-tools": "It does not establish an editor-owned agent tool that can execute shell commands rather than merely exposing a terminal to the operator.",
  "editor-mcp": "It does not establish an MCP client available to this exact editor's agent surface.",
  "editor-parallel-sessions": "It does not establish concurrently running agent sessions owned and surfaced by this exact editor.",
  "editor-worktree-isolation": "It does not establish product-managed Git worktrees that isolate agent changes.",
  "editor-change-review": "It does not establish a first-party review surface for agent-produced changes.",
  "editor-remote-workspaces": "It does not establish that the editor runs the workspace, language services, terminal, or agent tools on a remote host.",
  "editor-agent-permissions": "It does not establish an approval scope or allow, ask, and deny policy for the editor agent's tool calls.",
  "editor-agent-sandbox": "It does not establish a documented process, filesystem, container, VM, or network containment boundary for agent-run commands.",
  "editor-browser-tools": "It does not establish an embedded browser or browser-control tool available to the editor agent; preview-only or adjacent web surfaces are not inherited.",
  "editor-verification-loop": "It does not establish a documented agent loop that runs tests, builds, diagnostics, browser inspection, or device checks and consumes the result.",
  "extension-inline-completion": "It does not establish inline completion as a capability of this exact extension rather than the host editor or a sibling plugin.",
  "extension-background-delegation": "It does not establish a separately owned background job that continues outside the foreground extension conversation.",
  "extension-host-vscode": "It does not establish a first-party VS Code or compatible-fork package for this exact extension SKU.",
  "extension-host-jetbrains": "It does not establish a first-party JetBrains package for this exact extension SKU.",
  "extension-provider-choice": "It does not establish an operator-facing provider or model selector for this exact extension surface.",
  "extension-mcp": "It does not establish an MCP client exposed by this exact extension rather than the host IDE or an optional third-party plugin.",
  "extension-checkpoints": "It does not establish task-scoped workspace snapshots that can restore file mutations, rather than ordinary undo or chat history.",
  "extension-permissions": "It does not establish per-tool approval or allow, ask, and deny policies for this exact extension.",
  "extension-install-channel": "It does not establish an exact marketplace listing, package, setup path, or other supported installation channel for this extension.",
  "extension-codebase-context": "It does not establish a maintained codebase map or indexing/retrieval layer; ordinary file reads and text search are insufficient.",
  "extension-isolated-parallel": "It does not establish multiple concurrent extension agents with separate filesystem or Git worktree isolation.",
  "extension-byok-local-model": "It does not establish operator-supplied provider credentials, a local model, or a self-hosted inference endpoint for this exact extension.",
  "extension-remote-session-client": "It does not establish a client for observing or steering a separately owned cloud or background session.",
  "workbench-arbitrary-cli": "It does not establish admission of arbitrary operator-chosen CLI agents beyond the explicitly integrated set.",
  "workbench-agent-handoff": "Running or launching multiple harnesses does not establish context-preserving transfer of the same active task or conversation between them.",
  "workbench-named-sessions": "It does not establish user-named durable workspaces or sessions whose identity and history survive closing and reopening the UI.",
  "workbench-pty-survives-ui": "Persisted scrollback, layout, or conversation resume does not establish that the original live PTY process survives UI exit.",
  "workbench-cross-project-attention": "It does not establish one operator view that carries actionable state across multiple projects.",
  "workbench-editor": "File preview, a diff viewer, or launching an external editor does not establish an editable in-product code surface.",
  "workbench-file-tree": "It does not establish a project-wide file tree or file browser owned by the workbench.",
  "workbench-scm": "It does not establish a first-party source-control workflow rather than terminal access to Git.",
  "workbench-change-review": "It does not establish in-product visual diff review as a first-class session surface.",
  "workbench-splits": "It does not establish multiple first-class panes or splits that keep distinct agent or terminal sessions visible together.",
  "workbench-attention-signals": "It does not establish explicit cross-session waiting, blocked, failed, or completed attention states.",
  "workbench-session-recovery": "It does not establish recovery of the same durable agent or terminal session after interruption or application restart.",
  "workbench-browser": "It does not establish an embedded interactive browser owned by the workbench.",
  "workbench-remote-host": "It does not establish a supported SSH or remote-host execution workflow for the workbench.",
  "workbench-programmable-control": "It does not establish a supported CLI, socket, API, or event contract for external workspace control.",
  "workbench-worktrees": "It does not establish product-managed creation, isolation, review, and cleanup of Git worktrees.",
};

const extraSources = {
  traecode: ["https://www.trae.ai/blog/engineering_thought_0108?v=1"],
  "qoder-ide": ["https://docs.qoder.com/user-guide/quest/execution-environments"],
  zed: ["https://zed.dev/docs/remote-development"],
  cline: ["https://docs.cline.bot/provider-config/other-30-plus-providers"],
  continue: ["https://github.com/continuedev/continue"],
  "amazon-q-developer-ide": ["https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/qdev-mcp.html"],
  "gemini-code-assist": ["https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer"],
  "jetbrains-ai-assistant": ["https://www.jetbrains.com/help/ai-assistant/agents.html"],
  "codecompanion-nvim": ["https://github.com/olimorris/codecompanion.nvim"],
  warp: ["https://docs.warp.dev/code/code-review", "https://docs.warp.dev/code/git-worktrees"],
  "wave-terminal": ["https://docs.waveterm.dev/workspaces", "https://docs.waveterm.dev/durable-sessions"],
};

const appliedClosures = [
  { productId: "traecode", rowId: "editor-agent-sandbox", targetState: "limited", evidenceUrl: "https://www.trae.ai/blog/engineering_thought_0108?v=1", evidenceTitle: "TRAE sandbox security", basis: "vendor-documented", rationale: "TRAE documents a beta Sandbox Mode with filesystem isolation, allowed project and temporary paths, and shell-command interception." },
  { productId: "qoder-ide", rowId: "editor-worktree-isolation", targetState: "built-in", evidenceUrl: "https://docs.qoder.com/user-guide/quest/execution-environments", evidenceTitle: "Qoder Quest execution environments", basis: "vendor-documented", rationale: "Qoder Quest documents local Worktree mode, separate Git checkouts, parallel tasks, and moving completed work back to the local workspace." },
  { productId: "zed", rowId: "editor-remote-workspaces", targetState: "built-in", evidenceUrl: "https://zed.dev/docs/remote-development", evidenceTitle: "Zed Remote Development", basis: "vendor-documented", rationale: "Zed documents an SSH-backed remote server that owns source files, language servers, tasks, and terminals while the local application owns the UI and AI client." },
  { productId: "cline", rowId: "extension-provider-choice", targetState: "built-in", evidenceUrl: "https://docs.cline.bot/provider-config/other-30-plus-providers", evidenceTitle: "Cline provider configuration", basis: "vendor-documented", rationale: "Cline's extension settings expose an API Provider selector, provider credentials, and model selection across hosted, local, and OpenAI-compatible providers." },
  { productId: "continue", rowId: "product-status", targetState: "archived", claimState: "fact", evidenceUrl: "https://github.com/continuedev/continue", evidenceTitle: "Continue repository README", basis: "repository-derived", rationale: "The canonical repository explicitly says it is read-only and no longer actively maintained and calls 2.0.0 the final extension release." },
  { productId: "amazon-q-developer-ide", rowId: "extension-permissions", targetState: "built-in", evidenceUrl: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/qdev-mcp.html", evidenceTitle: "Amazon Q Developer MCP tools", basis: "vendor-documented", rationale: "Amazon Q's IDE MCP configuration documents auto-approved, requires-approval, and dangerous tool permission levels." },
  { productId: "gemini-code-assist", rowId: "extension-mcp", targetState: "built-in", evidenceUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", evidenceTitle: "Gemini Code Assist agent mode", basis: "vendor-documented", rationale: "Google documents local and remote MCP server configuration for Gemini Code Assist in both VS Code and IntelliJ." },
  { productId: "gemini-code-assist", rowId: "extension-permissions", targetState: "limited", evidenceUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", evidenceTitle: "Gemini Code Assist agent mode", basis: "vendor-documented", rationale: "VS Code exposes coreTools and excludeTools with command-specific restrictions; IntelliJ documents review and approval rather than the same per-tool policy." },
  { productId: "jetbrains-ai-assistant", rowId: "extension-mcp", targetState: "built-in", evidenceUrl: "https://www.jetbrains.com/help/ai-assistant/agents.html", evidenceTitle: "JetBrains AI Assistant agents", basis: "vendor-documented", rationale: "JetBrains documents configuring MCP servers in AI Assistant settings and exposing their tools to coding agents." },
  { productId: "jetbrains-ai-assistant", rowId: "extension-permissions", targetState: "built-in", evidenceUrl: "https://www.jetbrains.com/help/ai-assistant/agents.html", evidenceTitle: "JetBrains AI Assistant agents", basis: "vendor-documented", rationale: "JetBrains documents per-agent operation modes and an authorize-actions step that can approve, deny, or automatically run actions." },
  { productId: "codecompanion-nvim", rowId: "extension-mcp", targetState: "built-in", evidenceUrl: "https://github.com/olimorris/codecompanion.nvim", evidenceTitle: "CodeCompanion.nvim repository README", basis: "repository-derived", rationale: "The canonical README explicitly lists built-in Model Context Protocol support." },
  { productId: "warp", rowId: "workbench-change-review", targetState: "built-in", evidenceUrl: "https://docs.warp.dev/code/code-review", evidenceTitle: "Warp Code Review", basis: "vendor-documented", rationale: "Warp documents a first-party Code Review panel with live diffs, inline comments, batch agent feedback, edit, revert, and file review." },
  { productId: "warp", rowId: "workbench-worktrees", targetState: "built-in", evidenceUrl: "https://docs.warp.dev/code/code-review", evidenceTitle: "Warp Code Review", basis: "vendor-documented", rationale: "Warp's Code Review documentation explicitly states native Git worktree support and links the product's worktree workflow." },
  { productId: "wave-terminal", rowId: "workbench-named-sessions", targetState: "built-in", evidenceUrl: "https://docs.waveterm.dev/workspaces", evidenceTitle: "Wave Terminal workspaces", basis: "vendor-documented", rationale: "Wave documents named saved workspaces whose tabs, layouts, terminal histories, and AI histories persist automatically and can be reopened." },
];

const changedSourceCorrections = [
  { productId: "android-studio", rowId: "editor-agent-shell-tools", targetState: "limited", auditedUrl: "https://developer.android.com/studio/gemini/agent-mode", evidenceUrl: "https://developer.android.com/studio/gemini/agent-mode", rationale: "The current Agent Mode page establishes build and connected-device tooling including adb shell input, but not general-purpose terminal command execution." },
  { productId: "android-studio", rowId: "source-model", targetState: "unknown", auditedUrl: "https://developer.android.com/studio/install", rationale: "The current install page establishes the desktop distribution and supported stable channel, but not Android Studio's shipped source-model boundary." },
  { productId: "traecode", rowId: "editor-agent-shell-tools", targetState: "unknown", auditedUrl: "https://www.trae.ai/blog/product_solo", rationale: "The current SOLO page establishes autonomous coding, tests, deployment, and an integrated terminal view, but does not establish shell-command execution by the agent." },
  { productId: "traecode", rowId: "editor-mcp", targetState: "unknown", auditedUrl: "https://www.trae.ai/blog/trae_membership_0213", rationale: "The current membership page describes plans, models, context windows, and tool-call allowances, but contains no MCP evidence." },
  { productId: "android-studio", rowId: "editor-project-tree", targetState: "limited", auditedUrl: "https://developer.android.com/studio/projects", evidenceUrl: "https://developer.android.com/studio/projects", rationale: "The current project page establishes Android and Project views over the file hierarchy, but does not directly establish the paired editable code surface required by the combined row." },
  { productId: "qoder-ide", rowId: "editor-project-tree", targetState: "limited", auditedUrl: "https://docs.qoder.com/user-guide/chat/agent", evidenceUrl: "https://docs.qoder.com/user-guide/chat/agent", rationale: "The current Agent guide establishes project search, file editing, directory traversal, file status, and diffs, but not a conventional persistent project tree." },
  { productId: "gemini-code-assist", rowId: "extension-install-channel", targetState: "unknown", auditedUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/supported-languages", rationale: "The current supported-languages page establishes VS Code and JetBrains hosts but does not document a marketplace, package, setup path, or other install channel." },
  { productId: "gemini-code-assist", rowId: "extension-permissions", targetState: "limited", auditedUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", evidenceUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", rationale: "The current page documents per-tool restrictions for VS Code, while IntelliJ documents review and approval rather than an equivalent per-tool policy." },
  { productId: "continue", rowId: "extension-install-channel", targetState: "unknown", auditedUrl: "https://docs.continue.dev/getting-started/install", rationale: "The current URL returns only redirect-shell content and no longer establishes a substantive VS Code or JetBrains installation channel." },
  { productId: "warp", rowId: "workbench-named-sessions", targetState: "unknown", auditedUrl: "https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", rationale: "The former local-agent conversation page is no longer published, and current exact first-party evidence for durable named sessions was not established." },
  { productId: "warp", rowId: "workbench-splits", targetState: "unknown", auditedUrl: "https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", rationale: "The former local-agent conversation page is no longer published, and current exact first-party evidence for split-session behavior was not established." },
  { productId: "warp", rowId: "workbench-attention-signals", targetState: "unknown", auditedUrl: "https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", rationale: "The former local-agent conversation page is no longer published, and current exact first-party evidence for explicit attention states was not established." },
  { productId: "warp", rowId: "workbench-session-recovery", targetState: "unknown", auditedUrl: "https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", rationale: "The former local-agent conversation page is no longer published, and current exact first-party evidence for agent-session recovery was not established." },
  { productId: "warp", rowId: "workbench-cross-project-attention", targetState: "unknown", auditedUrl: "https://docs.warp.dev/agent-platform/getting-started/agents-in-warp", rationale: "The former Agents in Warp page is no longer published, and current exact first-party evidence for actionable state across projects was not established." },
];

const appliedClosureByKey = new Map(appliedClosures.map((closure) => [`${closure.productId}::${closure.rowId}`, closure]));
if (appliedClosureByKey.size !== appliedClosures.length) throw new Error("Applied closure keys must be unique.");
const allowedResults = new Set(["remain-unknown"]);
const assertHttpsUrl = (url, label) => {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== "https:") throw new Error(`${label} must use HTTPS: ${url}`);
};
for (const closure of appliedClosures) {
  assertHttpsUrl(closure.evidenceUrl, `Applied closure evidence for ${closure.productId}::${closure.rowId}`);
  if (!closure.targetState.trim() || !closure.evidenceTitle.trim() || !closure.rationale.trim()) {
    throw new Error(`Applied closure ${closure.productId}::${closure.rowId} is incomplete.`);
  }
}
for (const correction of changedSourceCorrections) {
  assertHttpsUrl(correction.auditedUrl, `Changed-source audit for ${correction.productId}::${correction.rowId}`);
  if (correction.evidenceUrl) assertHttpsUrl(correction.evidenceUrl, `Changed-source correction for ${correction.productId}::${correction.rowId}`);
  if (!correction.targetState.trim() || !correction.rationale.trim()) {
    throw new Error(`Changed-source correction ${correction.productId}::${correction.rowId} is incomplete.`);
  }
}

const dedupe = (items) => [...new Set(items.filter(Boolean))];
const productSources = (product) => dedupe([
  product.officialUrl,
  product.repository?.url,
  ...Object.values(product.claims).flatMap((claim) => claim.evidence.map((item) => item.url)),
  ...(extraSources[product.id] ?? []),
]);

const categories = categoryIds.map((categoryId) => {
  const category = comparisonCategories.find((item) => item.id === categoryId);
  if (!category) throw new Error(`Missing comparison category ${categoryId}.`);
  const rows = category.rows.filter((row) => !row.platform);
  const products = comparisonProducts
    .filter((product) => product.categoryId === categoryId && !excluded.has(product.id))
    .sort((left, right) => left.editorialOrder - right.editorialOrder)
    .map((product) => {
      const productNote = productNotes[product.id];
      if (!productNote) throw new Error(`Missing exact-SKU audit note for ${product.id}.`);
      const sourcesChecked = productSources(product);
      if (sourcesChecked.length === 0) throw new Error(`Missing sourcesChecked for ${product.id}.`);
      for (const source of sourcesChecked) assertHttpsUrl(source, `sourcesChecked for ${product.id}`);
      const cells = rows
        .filter((row) => getComparisonClaim(product, row).state === "unknown")
        .map((row) => {
          const key = `${product.id}::${row.id}`;
          const boundary = rowBoundaries[row.id];
          if (!boundary) throw new Error(`Missing row-specific Unknown boundary for ${key}.`);
          return {
            rowId: row.id,
            result: "remain-unknown",
            rationale: `${productNote} ${boundary}`,
          };
        });
      return { productId: product.id, sourcesChecked, cells };
    });
  return { categoryId, products };
});

const allCells = categories.flatMap((category) => category.products.flatMap((product) =>
  product.cells.map((cell) => ({ ...cell, productId: product.productId, categoryId: category.categoryId })),
));
const cellKeys = allCells.map((cell) => `${cell.productId}::${cell.rowId}`);
if (new Set(cellKeys).size !== cellKeys.length) throw new Error("Unknown audit cell keys must be unique.");
if (allCells.some((cell) => !cell.rationale.trim())) throw new Error("Every Unknown audit cell needs a rationale.");
if (allCells.some((cell) => !allowedResults.has(cell.result))) throw new Error("Unknown audit cell has an invalid result.");

const renderedUnknownKeys = categoryIds.flatMap((categoryId) => {
  const category = comparisonCategories.find((item) => item.id === categoryId);
  const rows = category.rows.filter((row) => !row.platform);
  return comparisonProducts
    .filter((product) => product.categoryId === categoryId && !excluded.has(product.id))
    .flatMap((product) => rows
      .filter((row) => getComparisonClaim(product, row).state === "unknown")
      .map((row) => `${product.id}::${row.id}`));
});
const auditKeys = new Set(cellKeys);
const renderedKeys = new Set(renderedUnknownKeys);
const missingKeys = [...renderedKeys].filter((key) => !auditKeys.has(key));
const extraKeys = [...auditKeys].filter((key) => !renderedKeys.has(key));
if (missingKeys.length || extraKeys.length) {
  throw new Error(`Unknown key parity failed. Missing: ${missingKeys.join(", ") || "none"}. Extra: ${extraKeys.join(", ") || "none"}.`);
}
for (const [key, closure] of appliedClosureByKey) {
  if (renderedKeys.has(key)) throw new Error(`Applied closure ${key} still renders Unknown.`);
  const product = comparisonProducts.find((item) => item.id === closure.productId);
  const row = comparisonCategories.flatMap((category) => category.rows).find((item) => item.id === closure.rowId);
  if (!product || !row) throw new Error(`Applied closure ${key} no longer resolves to a catalog product and row.`);
  const claim = getComparisonClaim(product, row);
  const expectedClaimState = closure.claimState ?? closure.targetState;
  if (claim.state !== expectedClaimState) {
    throw new Error(`Applied closure ${key} resolves to ${claim.state}; expected ${expectedClaimState}.`);
  }
  if (closure.claimState === "fact" && claim.displayValue?.toLowerCase() !== closure.targetState) {
    throw new Error(`Applied closure ${key} resolves to ${claim.displayValue}; expected ${closure.targetState}.`);
  }
  if (!claim.evidence.some((item) => item.url === closure.evidenceUrl)) {
    throw new Error(`Applied closure ${key} is missing its audited evidence URL ${closure.evidenceUrl}.`);
  }
}
for (const correction of changedSourceCorrections) {
  const key = `${correction.productId}::${correction.rowId}`;
  const product = comparisonProducts.find((item) => item.id === correction.productId);
  const row = comparisonCategories.flatMap((category) => category.rows).find((item) => item.id === correction.rowId);
  if (!product || !row) throw new Error(`Changed-source correction ${key} no longer resolves to a catalog product and row.`);
  const claim = getComparisonClaim(product, row);
  if (claim.state !== correction.targetState) {
    throw new Error(`Changed-source correction ${key} resolves to ${claim.state}; expected ${correction.targetState}.`);
  }
  if (correction.targetState === "unknown") {
    if (!renderedKeys.has(key)) throw new Error(`Changed-source correction ${key} must remain in the rendered Unknown ledger.`);
    if (claim.evidence.length !== 0) throw new Error(`Changed-source correction ${key} is Unknown but still carries evidence.`);
  }
  if (correction.evidenceUrl && !claim.evidence.some((item) => item.url === correction.evidenceUrl)) {
    throw new Error(`Changed-source correction ${key} is missing its audited evidence URL ${correction.evidenceUrl}.`);
  }
}

const countFor = (categoryId) => allCells.filter((cell) => cell.categoryId === categoryId).length;
const summary = {
  products: categories.reduce((total, category) => total + category.products.length, 0),
  currentUnknownCells: allCells.length,
  codeEditorUnknownCells: countFor("code-editors"),
  ideExtensionUnknownCells: countFor("ide-extensions"),
  agentMultiplexerUnknownCells: countFor("agent-workbenches"),
  appliedClosures: appliedClosures.length,
  changedSourceCorrections: changedSourceCorrections.length,
  remainUnknown: allCells.length,
};

const ledger = {
  schemaVersion: 1,
  checkedAt,
  catalogSnapshot: COMPARISON_SNAPSHOT,
  scope: {
    categoryIds,
    excludedProductIds,
    renderedRows: "Every non-platform category row resolved through getComparisonClaim(). Generated repository metrics are governed separately by the freshness gate.",
    platformHeaders: "Platform-header support is outside this rendered-cell ledger. An omitted OS in a known platform list is not treated as Unknown.",
  },
  summary,
  categories,
  appliedClosures,
  changedSourceCorrections,
  generatedMetricUnknowns: {
    result: "excluded-from-editorial-ledger",
    rationale: "Repository metric Unknowns are collector failures or not-yet-refreshed values. The deterministic repository refresh and audit:freshness gate must close or block them; editorial research must not hand-fill those cells.",
  },
};

const json = `${JSON.stringify(ledger, null, 2)}\n`;
const reportLines = [
  "# Explicit Unknown ledger: IDE surfaces",
  "",
  `Checked ${checkedAt}. The machine-readable source of truth is [\`unknown-audit-ide-surfaces.json\`](../../src/data/unknown-audit-ide-surfaces.json).`,
  "",
  "## Scope and exact parity",
  "",
  "This ledger resolves every non-platform row through `getComparisonClaim()` for Code IDEs, IDE Extensions, and Agent Multiplexers. It excludes the same hidden UI backlog IDs as the comparison page. Platform headers and generated repository metrics are separate contracts.",
  "",
  "| Category | Public products | Current rendered Unknowns | Remain Unknown |",
  "| --- | ---: | ---: | ---: |",
  ...categories.map((category) => {
    const unknowns = category.products.flatMap((product) => product.cells);
    const label = comparisonCategories.find((item) => item.id === category.categoryId).label;
    return `| ${label} | ${category.products.length} | ${unknowns.length} | ${unknowns.length} |`;
  }),
  `| **Total** | **${summary.products}** | **${summary.currentUnknownCells}** | **${summary.remainUnknown}** |`,
  "",
  `The generated ledger has exact key parity with all ${summary.currentUnknownCells} current rendered Unknown cells. Every cell has a product-and-row-specific rationale and every product has an exact-SKU first-party \`sourcesChecked\` list. The generator rejects missing, extra, or duplicate keys.`,
  "",
  "## Changed-source corrections preserved",
  "",
  "Fresh reads of changed first-party pages narrowed overbroad claims and restored unsupported claims to Unknown. These corrections are assertions in the generator, not editorial negatives.",
  "",
  "| Product | Row | Preserved state | Audited source | Reason |",
  "| --- | --- | --- | --- | --- |",
  ...changedSourceCorrections.map((correction) => {
    const product = comparisonProducts.find((item) => item.id === correction.productId);
    const source = `[First-party page](${correction.auditedUrl})`;
    return `| ${product.name} | \`${correction.rowId}\` | ${correction.targetState} | ${source} | ${correction.rationale} |`;
  }),
  "",
  "## High-confidence affirmative closures applied",
  "",
  "These previously Unknown cells now resolve from the catalog to the audited state and exact evidence URL. Documentation silence is never converted to Not available.",
  "",
  "| Product | Row | Applied value/state | Exact evidence | Why it closes |",
  "| --- | --- | --- | --- | --- |",
  ...appliedClosures.map((closure) => {
    const product = comparisonProducts.find((item) => item.id === closure.productId);
    return `| ${product.name} | \`${closure.rowId}\` | ${closure.targetState} | [${closure.evidenceTitle}](${closure.evidenceUrl}) | ${closure.rationale} |`;
  }),
  "",
  "## Remaining Unknown index",
  "",
  ...categories.flatMap((category) => {
    const label = comparisonCategories.find((item) => item.id === category.categoryId).label;
    return [
      `### ${label}`,
      "",
      "| Product ID | Current Unknowns | Must remain Unknown |",
      "| --- | ---: | ---: |",
      ...category.products.map((product) => {
        return `| \`${product.productId}\` | ${product.cells.length} | ${product.cells.length} |`;
      }),
      "",
    ];
  }),
  "## Evidence boundaries preserved",
  "",
  "- A host IDE capability is not inherited by every extension installed in it.",
  "- A sibling CLI, web app, cloud agent, or predecessor is not evidence for the evaluated SKU.",
  "- Parallel sessions do not imply worktree or container isolation.",
  "- Permissions do not imply a sandbox, and ordinary undo does not imply workspace checkpoints.",
  "- Running several harnesses does not imply context-preserving cross-harness handoff.",
  "- Repository activity does not supply an editorial lifecycle label unless the first-party source states one.",
  "",
  "## Validation",
  "",
  "Run:",
  "",
  "```sh",
  "node --experimental-strip-types scripts/generate-unknown-audit-ide-surfaces.mjs --check",
  "```",
  "",
  "The check re-derives the rendered Unknown set, requires exact key parity, validates every source and rationale, verifies every applied closure and changed-source correction, and checks that the generated JSON and report have not drifted.",
  "",
].join("\n");

if (checkOnly) {
  const [existingJson, existingReport] = await Promise.all([
    readFile(ledgerPath, "utf8"),
    readFile(reportPath, "utf8"),
  ]);
  if (existingJson !== json) throw new Error("unknown-audit-ide-surfaces.json is stale; rerun the generator.");
  if (existingReport !== reportLines) throw new Error("comparison-unknown-ledger.md is stale; rerun the generator.");
  console.log(`Unknown audit is current: ${summary.currentUnknownCells} exact rendered keys, ${summary.appliedClosures} applied closures, ${summary.changedSourceCorrections} changed-source corrections, ${summary.remainUnknown} remain Unknown.`);
} else {
  await Promise.all([
    writeFile(ledgerPath, json),
    writeFile(reportPath, reportLines),
  ]);
  console.log(`Wrote ${ledgerPath}`);
  console.log(`Wrote ${reportPath}`);
  console.log(`Validated ${summary.currentUnknownCells} exact rendered keys.`);
}
