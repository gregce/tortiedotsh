# Agent matrix evidence: harnesses, extensions, cloud agents, and remote companions

Checked: 2026-08-23

This ledger proposes category-specific rows and closes high-confidence `Unknown` cells using only first-party documentation and official repositories. It does not infer negative capability from silence. Anything not listed here should remain `Unknown`.

## State and evidence conventions

- `Built in`: the evaluated product directly ships the capability.
- `Via integration`: the capability is delivered through a documented first-party integration or companion surface.
- `Limited`: the capability exists with a material constraint that belongs in the cell note.
- `Not applicable`: use only when the product no longer belongs to the evaluated category, with a first-party source proving the category change.
- `Vendor documented`: a first-party product or documentation page.
- `Repository derived`: the current README or documentation in the product's official repository.

No `Not available` claims are recommended below.

## Coding-agent harnesses

### Recommended row additions

| Row ID | Label | Group | What it distinguishes |
|---|---|---|---|
| `harness-project-instructions` | Project instruction files | Context and memory | Checked-in guidance such as `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md` that loads automatically. |
| `harness-permission-controls` | Tool permission controls | Safety | Allow, ask, deny, or approval modes for model-initiated tools. |
| `harness-sandbox` | Built-in sandbox boundary | Safety | A documented local/container sandbox, distinct from ordinary approval prompts. |
| `harness-checkpoints` | Checkpoint and rollback | Recovery | Product-managed restoration of files or conversation state. |
| `harness-subagents` | Subagents or agent teams | Delegation | Child agents with distinct context, instructions, or tools. |
| `harness-structured-output` | Structured machine output | Automation | JSON or streaming event output intended for scripts and CI. |
| `harness-git-workflow` | Git-aware change workflow | Change management | Product-managed commits, diffs, repository maps, or undo through Git. |
| `harness-multimodal-input` | Image or web-page input | Context | Non-text context accepted by the harness itself. |

### New-row claims

| Product | Row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Claude Code | `harness-project-instructions` | Built in | `CLAUDE.md`; project and user instructions are loaded as memory. | https://code.claude.com/docs/en/memory | Vendor documented | 2026-08-23 |
| Claude Code | `harness-permission-controls` | Built in | Tool allow/deny rules and permission modes; interactive approvals remain visible. | https://code.claude.com/docs/en/permissions | Vendor documented | 2026-08-23 |
| Claude Code | `harness-subagents` | Built in | Built-in and custom subagents have separate context, prompts, tools, and permissions. | https://code.claude.com/docs/en/sub-agents | Vendor documented | 2026-08-23 |
| Claude Code | `harness-structured-output` | Built in | Print mode supports text, JSON, and stream-JSON output. | https://docs.anthropic.com/en/docs/claude-code/cli-usage | Vendor documented | 2026-08-23 |
| Codex CLI | `harness-project-instructions` | Built in | Hierarchical `AGENTS.md` and `AGENTS.override.md` instructions load before work. | https://learn.chatgpt.com/docs/agent-configuration/agents-md | Vendor documented | 2026-08-23 |
| Codex CLI | `harness-permission-controls` | Built in | User-selectable permissions govern what Codex may do. | https://learn.chatgpt.com/docs/codex/cli | Vendor documented | 2026-08-23 |
| Codex CLI | `harness-sandbox` | Built in | Codex documents sandbox modes and operating-system enforcement. | https://learn.chatgpt.com/docs/sandboxing | Vendor documented | 2026-08-23 |
| Codex CLI | `harness-subagents` | Built in | First-party subagent configuration and delegation. | https://learn.chatgpt.com/docs/agent-configuration/subagents | Vendor documented | 2026-08-23 |
| Gemini CLI | `harness-project-instructions` | Built in | Hierarchical `GEMINI.md` project context and persistent memory. | https://geminicli.com/docs/cli/tutorials/memory-management/ | Vendor documented | 2026-08-23 |
| Gemini CLI | `harness-sandbox` | Built in | macOS Seatbelt and Docker/Podman sandbox options; sandbox expansion can request added access. | https://geminicli.com/docs/cli/sandbox/ | Vendor documented | 2026-08-23 |
| Gemini CLI | `harness-checkpoints` | Built in | Optional checkpoints restore files, conversation history, and the pending tool call. | https://geminicli.com/docs/cli/checkpointing/ | Vendor documented | 2026-08-23 |
| Gemini CLI | `harness-structured-output` | Built in | Headless mode supports JSON and newline-delimited stream JSON. | https://github.com/google-gemini/gemini-cli | Repository derived | 2026-08-23 |
| Qwen Code | `harness-subagents` | Built in | Auto-Memory, Auto-Skills, SubAgents, Agent Teams, and MCP are documented out of the box. | https://github.com/QwenLM/qwen-code | Repository derived | 2026-08-23 |
| Qwen Code | `harness-structured-output` | Built in | Headless `qwen -p` mode is documented for scripts, CI, and batch processing. | https://github.com/QwenLM/qwen-code | Repository derived | 2026-08-23 |
| Pi coding agent | `harness-permission-controls` | Limited | Runs with launcher-process permissions; stronger boundaries require a documented container or sandbox pattern. | https://github.com/earendil-works/pi | Repository derived | 2026-08-23 |
| Pi coding agent | `harness-sandbox` | Via integration | Gondolin, Docker, and OpenShell are documented isolation patterns rather than a default built-in boundary. | https://github.com/earendil-works/pi | Repository derived | 2026-08-23 |
| Aider | `harness-git-workflow` | Built in | Repository map plus automatic Git commits, diffs, and familiar Git undo. | https://github.com/Aider-AI/aider | Repository derived | 2026-08-23 |
| Aider | `harness-multimodal-input` | Built in | Images and web pages can be attached as context. | https://github.com/Aider-AI/aider | Repository derived | 2026-08-23 |

### Existing Unknown cells that can be closed

| Product | Existing row or profile | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Claude Code | Platform | Fact | macOS, Windows, Linux; current requirements list native Windows and named Linux distributions. | https://code.claude.com/docs/en/getting-started | Vendor documented | 2026-08-23 |
| Codex CLI | Platform | Fact | macOS, Windows, Linux; official install surface provides macOS/Linux and Windows paths. | https://learn.chatgpt.com/docs/codex/cli | Vendor documented | 2026-08-23 |
| Gemini CLI | Platform | Fact | macOS 15+, Windows 11 24H2+, Ubuntu 20.04+. | https://geminicli.com/docs/get-started/installation/ | Vendor documented | 2026-08-23 |
| Qwen Code | Platform | Fact | macOS, Windows, Linux; first-party standalone installers are documented for each family. | https://github.com/QwenLM/qwen-code | Repository derived | 2026-08-23 |
| Qwen Code | `harness-multi-provider` | Built in | OpenAI, Anthropic, Gemini, Qwen, third-party providers, and local Ollama/vLLM endpoints. | https://github.com/QwenLM/qwen-code | Repository derived | 2026-08-23 |
| GitHub Copilot CLI | `harness-extension-protocol` | Built in | Custom agents, skills, MCP servers, hooks, and plugins are first-party customization surfaces. | https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview | Vendor documented | 2026-08-23 |
| GitHub Copilot CLI | `harness-multi-provider` | Built in | GitHub documents bringing an external model with a user-supplied API key. | https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview | Vendor documented | 2026-08-23 |

## IDE extensions

### Recommended row additions

The existing `Documented editor hosts` cell hides the most important compatibility distinction. Split it into explicit host rows.

| Row ID | Label | Group | What it distinguishes |
|---|---|---|---|
| `extension-host-vscode` | VS Code and compatible forks | Host reach | A first-party VS Code/VSIX extension. |
| `extension-host-jetbrains` | JetBrains IDEs | Host reach | A first-party JetBrains plugin, not presumed from VS Code support. |
| `extension-provider-choice` | Provider and model choice | Model access | BYOK, multiple providers, or local model configuration. |
| `extension-mcp` | MCP servers | Context and tools | First-party MCP client configuration in the extension. |
| `extension-checkpoints` | Workspace checkpoints | Recovery | Product-managed file or conversation restoration. |
| `extension-permissions` | Per-tool permissions | Safety | Configurable allow, ask, and deny controls. |
| `extension-codebase-context` | Codebase map or indexing | Context | Explicit repository-wide retrieval, indexing, or map support. |
| `extension-isolated-parallel` | Isolated parallel agents | Lifecycle | Multiple agents in worktrees or equivalent isolated branches. |

### New-row claims

| Product | Row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| GitHub Copilot for VS Code | `extension-host-vscode` | Built in | Native VS Code agent and completion surface. | https://code.visualstudio.com/docs/copilot/overview | Vendor documented | 2026-08-23 |
| GitHub Copilot for VS Code | `extension-mcp` | Built in | VS Code agent customization includes MCP tools and servers. | https://code.visualstudio.com/docs/copilot/concepts/customization | Vendor documented | 2026-08-23 |
| GitHub Copilot for VS Code | `extension-codebase-context` | Built in | Workspace instructions, `AGENTS.md`, and file-scoped instruction files are automatically applied. | https://code.visualstudio.com/docs/agent-customization/custom-instructions | Vendor documented | 2026-08-23 |
| Cline extension | `extension-host-vscode` | Built in | First-party extension workflow runs in the VS Code panel. | https://docs.cline.bot/usage/ide | Vendor documented | 2026-08-23 |
| Cline extension | `extension-checkpoints` | Built in | Shadow-Git checkpoints restore files, task history, or both. | https://docs.cline.bot/core-workflows/checkpoints | Vendor documented | 2026-08-23 |
| Cline extension | `extension-permissions` | Built in | Auto Approve controls reads, edits, commands, browser, MCP, and notifications. | https://docs.cline.bot/features/auto-approve | Vendor documented | 2026-08-23 |
| Cline extension | `extension-mcp` | Built in | MCP tools are a documented approval category in the extension. | https://docs.cline.bot/features/auto-approve | Vendor documented | 2026-08-23 |
| Continue extension | `extension-host-vscode` | Built in | First-party VS Code extension. | https://docs.continue.dev/customize/deep-dives/configuration | Vendor documented | 2026-08-23 |
| Continue extension | `extension-host-jetbrains` | Built in | First-party JetBrains extension with its own sidebar shortcut. | https://docs.continue.dev/customize/deep-dives/configuration | Vendor documented | 2026-08-23 |
| Continue extension | `extension-provider-choice` | Built in | Multiple hosted providers and self-hosted model providers can be configured by role. | https://docs.continue.dev/customize/overview | Vendor documented | 2026-08-23 |
| Continue extension | `extension-mcp` | Built in | Agent mode can use tools supplied by MCP servers. | https://docs.continue.dev/customize/overview | Vendor documented | 2026-08-23 |
| Continue extension | `extension-codebase-context` | Built in | Repository map, files, tree, Git diff, terminal, and embedding-backed codebase context. | https://docs.continue.dev/customize/deep-dives/custom-providers | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-host-vscode` | Built in | Official VS Code extension with embedded runtime. | https://kilo.ai/docs/code-with-ai/platforms/vscode | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-host-jetbrains` | Built in | Official native JetBrains plugin for the listed JetBrains IDE family. | https://kilo.ai/docs/code-with-ai/platforms/jetbrains | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-provider-choice` | Built in | Kilo provider, BYOK, and custom providers are shared across extension surfaces. | https://kilo.ai/docs/getting-started/setup-authentication | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-mcp` | Built in | Global and project MCP configuration is built into Kilo settings. | https://kilo.ai/docs/automate/mcp/using-in-kilo-code | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-checkpoints` | Built in | Snapshots are enabled by default and expose file diffs and `Revert to here`. | https://kilo.ai/docs/code-with-ai/features/checkpoints | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-permissions` | Built in | Per-tool Allow, Ask, and Deny rules; default is Ask. | https://kilo.ai/docs/getting-started/settings/auto-approving-actions | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-isolated-parallel` | Built in | Agent Manager runs parallel sessions in separate Git worktrees with diff review. | https://kilo.ai/docs/automate/agent-manager | Vendor documented | 2026-08-23 |

### Existing Unknown cells that can be closed

| Product | Existing row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Kilo Code extension | `extension-inline-completion` | Built in | FIM autocomplete is a named VS Code extension feature. | https://kilo.ai/docs/code-with-ai/platforms/vscode | Vendor documented | 2026-08-23 |
| Kilo Code extension | `extension-background-delegation` | Built in | Agent Manager runs multiple worktree-isolated sessions in parallel and keeps panel state. | https://kilo.ai/docs/automate/agent-manager | Vendor documented | 2026-08-23 |
| Cline extension | `extension-background-delegation` | Unknown | Tasks persist with history and state, but first-party extension docs reviewed here do not establish unattended parallel worktree delegation. Keep the cell `Unknown`; do not promote based on task persistence alone. | https://docs.cline.bot/core-workflows/task-management | Vendor documented | 2026-08-23 |

The final Cline entry is a guardrail, not a claim to encode: it explains why that existing cell should remain `Unknown`.

## Cloud and background agents

### Recommended row additions

| Row ID | Label | Group | What it distinguishes |
|---|---|---|---|
| `cloud-intake-surfaces` | Task intake surfaces | Intake | Web, issue assignment, pull-request comment, API, Slack, or Linear entry points. |
| `cloud-code-hosts` | Supported code hosts | Intake | GitHub, GitLab, or another first-party documented host. |
| `cloud-parallel-tasks` | Parallel task runs | Lifecycle | Multiple independent cloud tasks can run concurrently. |
| `cloud-environment-config` | Reproducible environment setup | Hosting | Setup scripts, dependencies, images, variables, or snapshots. |
| `cloud-network-policy` | Agent network policy | Security | Default and configurable internet access during agent execution. |
| `cloud-project-instructions` | Repository instructions | Context | Checked-in project guidance applied to cloud runs. |
| `cloud-live-steering` | Live steering or takeover | Observability | Follow-ups, stop/redirect, or operator takeover while work is active. |
| `cloud-task-limit` | Documented run limit | Lifecycle | A first-party hard time or resource boundary, displayed as a fact rather than pass/fail. |

### New-row claims

| Product | Row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| OpenAI Codex cloud | `cloud-intake-surfaces` | Built in | Web, GitHub, GitLab, Linear, and Slack task starts. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-code-hosts` | Built in | GitHub and GitLab Beta repositories. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-parallel-tasks` | Built in | Dedicated cloud environments can continue in parallel. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-environment-config` | Built in | Container checkout, setup and maintenance scripts, dependencies, tools, variables, and secrets. | https://learn.chatgpt.com/docs/environments/cloud-environment | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-network-policy` | Built in | Agent internet is off by default and can be enabled with limited or unrestricted access. | https://learn.chatgpt.com/docs/cloud/internet-access | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-project-instructions` | Built in | Cloud runs use repository `AGENTS.md` instructions. | https://learn.chatgpt.com/docs/environments/cloud-environment | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-live-steering` | Built in | Watch logs, run in background, request follow-up changes, and review the diff. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-intake-surfaces` | Built in | GitHub agents panel, issues, VS Code, PR comments, API, schedules, and event automations. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-code-hosts` | Built in | GitHub repositories only. Treat this positive scope as a fact, not a negative score. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-environment-config` | Built in | Ephemeral GitHub Actions-powered development environment. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-project-instructions` | Built in | Repository custom instructions, MCP, custom agents, hooks, and skills. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-live-steering` | Built in | Continue the same conversation, ask follow-ups, inspect commits and logs, and iterate before PR creation. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| GitHub Copilot cloud agent | `cloud-task-limit` | Fact | Maximum execution time is 59 minutes per session. | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Vendor documented | 2026-08-23 |
| Devin | `cloud-intake-surfaces` | Built in | Web sessions, API-created sessions, repository mentions, and GitHub PR comments. | https://docs.devin.ai/api-reference/v1/sessions/create-a-new-devin-session | Vendor documented | 2026-08-23 |
| Devin | `cloud-code-hosts` | Via integration | GitHub integration can be scoped to selected repositories. | https://docs.devin.ai/integrations/gh | Vendor documented | 2026-08-23 |
| Devin | `cloud-parallel-tasks` | Built in | First-party guidance recommends running larger work as focused sessions in parallel with managed Devins. | https://docs.devin.ai/get-started/first-run | Vendor documented | 2026-08-23 |
| Devin | `cloud-environment-config` | Built in | YAML blueprints produce VM snapshots; each session boots a fresh copy. | https://docs.devin.ai/onboard-devin/environment/blueprints | Vendor documented | 2026-08-23 |
| Devin | `cloud-project-instructions` | Built in | Knowledge incorporates repository guidance including `CLAUDE.md` and `AGENTS.md`. | https://docs.devin.ai/onboard-devin/knowledge-onboarding | Vendor documented | 2026-08-23 |
| Devin | `cloud-live-steering` | Built in | Operator can monitor progress, inspect Shell/IDE/Browser, stop, take over, edit, and resume. | https://docs.devin.ai/work-with-devin/devin-session-tools | Vendor documented | 2026-08-23 |

### Existing Unknown cells that can be closed

| Product | Existing row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| OpenAI Codex cloud | `cloud-repo-intake` | Built in | Connect a GitHub repository or GitLab Beta project and start from several first-party surfaces. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-sandbox` | Built in | Every task checks out the selected ref in its own container. | https://learn.chatgpt.com/docs/environments/cloud-environment | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-live-observability` | Built in | Live task logs, summary, and diff. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| OpenAI Codex cloud | `cloud-durable-result` | Built in | Review summary and diff, request changes, or open a pull request. | https://learn.chatgpt.com/docs/cloud | Vendor documented | 2026-08-23 |
| Devin | `cloud-repo-intake` | Built in | Repositories can be mentioned in web prompts and sessions can be created through the API. | https://docs.devin.ai/integrations/gh | Vendor documented | 2026-08-23 |
| Devin | `cloud-sandbox` | Built in | Each session boots a fresh copy of the configured snapshot. | https://docs.devin.ai/onboard-devin/environment/blueprints | Vendor documented | 2026-08-23 |
| Devin | `cloud-live-observability` | Built in | Progress view plus live Shell, IDE, Browser, and diff inspection. | https://docs.devin.ai/work-with-devin/devin-session-tools | Vendor documented | 2026-08-23 |
| Devin | `cloud-durable-result` | Via integration | GitHub integration creates pull requests and continues responding to PR comments while the session is active. | https://docs.devin.ai/integrations/gh | Vendor documented | 2026-08-23 |

## Remote companions and relays

### Recommended row additions

| Row ID | Label | Group | What it distinguishes |
|---|---|---|---|
| `remote-native-ios` | Native iOS client | Client | A shipped or explicitly preview native iOS surface. |
| `remote-native-android` | Native Android client | Client | A shipped native Android surface. |
| `remote-browser-pwa` | Browser or PWA client | Client | Responsive browser access or installable PWA. |
| `remote-supported-harnesses` | Named agent harnesses | Compatibility | Which existing terminal agents the relay explicitly understands or wraps. |
| `remote-terminal-input` | Live terminal input | Interaction | General terminal keystrokes or prompt input, distinct from structured approvals. |
| `remote-notifications` | Push or attention notifications | Attention | Alerts for approvals, errors, or unread activity. |
| `remote-hosting-boundary` | Relay and hosting boundary | Security | Local-only, user tunnel, vendor relay, or self-hosted control plane. |
| `remote-session-history` | Session history or recording | Continuity | Reconnectable history, recordings, or durable event state. |

### New-row claims

| Product | Row | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Happy | `remote-native-ios` | Built in | First-party iOS app. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-native-android` | Built in | First-party Android app. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-browser-pwa` | Built in | First-party web app. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-supported-harnesses` | Built in | Explicit wrappers for Claude Code and Codex. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-terminal-input` | Built in | Switch control between phone and desktop; remote mode steers the wrapped session. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-notifications` | Built in | Push alerts for permission requests and errors. | https://github.com/slopus/happy | Repository derived | 2026-08-23 |
| Happy | `remote-hosting-boundary` | Limited | Encrypted session sync uses the Happy Server relay. Keep the note scoped to session content; do not generalize the E2E claim to every stored credential. | https://github.com/slopus/happy/blob/main/docs/README.md | Source inspected | 2026-08-23 |
| VibeTunnel | `remote-native-ios` | Limited | Native iOS app is work in progress and not recommended for production. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| VibeTunnel | `remote-browser-pwa` | Built in | Responsive browser interface works from phones and tablets. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| VibeTunnel | `remote-supported-harnesses` | Built in | Wraps any terminal command; README explicitly positions it for terminal AI agents. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| VibeTunnel | `remote-terminal-input` | Built in | `vt` forwards interactive shells and arbitrary commands to the browser. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| VibeTunnel | `remote-hosting-boundary` | Built in | Local server with documented Tailscale, ngrok, LAN, and Cloudflare tunnel options; multiple authentication modes. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| VibeTunnel | `remote-session-history` | Built in | Sessions are recorded in asciinema format for later playback. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |
| Shunt | `remote-native-ios` | Limited | Native SwiftUI client is distributed through TestFlight in the documented initial release. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-browser-pwa` | Built in | Embedded web client plus standalone mobile/iPad PWA support. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-supported-harnesses` | Built in | Detects Claude Code, Codex, Aider, Goose, and OpenCode in tmux sessions. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-terminal-input` | Built in | Direct browser input including Tab, Escape, Ctrl+C, arrows, and prompts. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-notifications` | Built in | Unread activity badges and approval-state attention indicators in web and iOS clients. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-session-history` | Built in | Existing tmux sessions remain the durable session owner; prompt history and per-window drafts persist in the client. | https://shunt.app/ | Vendor documented | 2026-08-23 |

### Existing Unknown cells that can be closed

| Product | Existing row or profile | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Shunt | Platform | Fact | macOS and Linux daemon; web/PWA client; native iOS client is preview/TestFlight. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-client-reach` | Built in | Embedded browser client, PWA, and preview native iOS client. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-existing-session` | Built in | Daemon monitors and controls already-running tmux sessions. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| Shunt | `remote-approvals` | Built in | Structured approve and deny actions for pending agent permission requests. | https://shunt.app/ | Vendor documented | 2026-08-23 |
| VibeTunnel | `remote-approvals` | Unknown | General terminal input is proven, but the reviewed first-party source does not establish a structured approval protocol. Leave unknown. | https://github.com/amantus-ai/vibetunnel | Repository derived | 2026-08-23 |

The VibeTunnel entry is another guardrail rather than an encoded positive claim.

### Omnara category correction

Current first-party sources describe Omnara as an open-source managed-agent control plane and stateful API, not as the earlier coding-session companion. The current product launches durable agents, streams events, resolves approvals, allocates or connects machines, and can be hosted or self-hosted.

Recommended action:

- Remove the current Omnara column from `remote-companions` rather than filling old companion rows with new-platform claims.
- Reclassify the current product into a future `agent infrastructure / managed runtimes` category, or omit it until that category exists.
- Treat `remote-existing-session` as `Not applicable` only after the product is moved; the current agent object is launched and owned by Omnara rather than attached to an existing Claude Code or Codex terminal session.

Evidence:

| Product | Classification fact | State | Display and note | Primary URL | Basis | Checked |
|---|---|---|---|---|---|---|
| Omnara | Current product role | Fact | Open-source platform for managed durable agents; console and stateful API; hosted or self-hosted. | https://docs.omnara.com/introduction | Vendor documented | 2026-08-23 |
| Omnara | Current primary object | Fact | One durable agent conversation with config, tool calls, history, live event stream, and human interactions. | https://docs.omnara.com/introduction | Vendor documented | 2026-08-23 |

## Highest-value implementation order

1. Close the existing OpenAI Codex cloud and Devin rows. These remove eight highly visible `Unknown` cells without adding criteria.
2. Close platform facts for Claude Code, Codex CLI, Gemini CLI, Qwen Code, and Shunt. These directly support the compact operating-system icon treatment.
3. Add the eight IDE-extension rows and fill Kilo, Continue, Cline, and Copilot from the claims above. The present four-row extension table obscures major product differences.
4. Add harness safety, recovery, delegation, and instructions rows. These are more decision-relevant than another generic “extensions” row.
5. Add remote client/hosting rows, close Shunt, and reclassify Omnara before displaying the remote table as comprehensive.
6. Add cloud environment, network, steering, and intake rows after the existing cloud cells are filled.

## Claims deliberately left open

- No encryption claim for VibeTunnel or Shunt: authentication and secure tunnels are not equivalent to end-to-end encryption.
- No structured remote-approval claim for VibeTunnel: raw terminal input is not the same capability.
- No background delegation claim for Cline's IDE extension: task persistence is not unattended parallel execution.
- No negative claims for products whose documentation is silent.
- No old Omnara companion claims applied to the current managed-agent platform.
