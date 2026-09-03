# Explicit Unknown ledger: IDE surfaces

Checked 2026-08-24. The machine-readable source of truth is [`unknown-audit-ide-surfaces.json`](../../src/data/unknown-audit-ide-surfaces.json).

## Scope and exact parity

This ledger resolves every non-platform row through `getComparisonClaim()` for Code IDEs, IDE Extensions, and Agent Multiplexers. It excludes the same hidden UI backlog IDs as the comparison page. Platform headers and generated repository metrics are separate contracts.

| Category | Public products | Current rendered Unknowns | Remain Unknown |
| --- | ---: | ---: | ---: |
| Code IDEs | 19 | 92 | 92 |
| IDE extensions | 20 | 121 | 121 |
| Agent Multiplexers | 13 | 58 | 58 |
| **Total** | **52** | **271** | **271** |

The generated ledger has exact key parity with all 271 current rendered Unknown cells. Every cell has a product-and-row-specific rationale and every product has an exact-SKU first-party `sourcesChecked` list. The generator rejects missing, extra, or duplicate keys.

## Changed-source corrections preserved

Fresh reads of changed first-party pages narrowed overbroad claims and restored unsupported claims to Unknown. These corrections are assertions in the generator, not editorial negatives.

| Product | Row | Preserved state | Audited source | Reason |
| --- | --- | --- | --- | --- |
| Android Studio | `editor-agent-shell-tools` | limited | [First-party page](https://developer.android.com/studio/gemini/agent-mode) | The current Agent Mode page establishes build and connected-device tooling including adb shell input, but not general-purpose terminal command execution. |
| Android Studio | `source-model` | unknown | [First-party page](https://developer.android.com/studio/install) | The current install page establishes the desktop distribution and supported stable channel, but not Android Studio's shipped source-model boundary. |
| TraeCode | `editor-agent-shell-tools` | unknown | [First-party page](https://www.trae.ai/blog/product_solo) | The current SOLO page establishes autonomous coding, tests, deployment, and an integrated terminal view, but does not establish shell-command execution by the agent. |
| TraeCode | `editor-mcp` | unknown | [First-party page](https://www.trae.ai/blog/trae_membership_0213) | The current membership page describes plans, models, context windows, and tool-call allowances, but contains no MCP evidence. |
| Android Studio | `editor-project-tree` | limited | [First-party page](https://developer.android.com/studio/projects) | The current project page establishes Android and Project views over the file hierarchy, but does not directly establish the paired editable code surface required by the combined row. |
| Qoder IDE | `editor-project-tree` | limited | [First-party page](https://docs.qoder.com/user-guide/chat/agent) | The current Agent guide establishes project search, file editing, directory traversal, file status, and diffs, but not a conventional persistent project tree. |
| Gemini Code Assist Standard / Enterprise extensions | `extension-install-channel` | unknown | [First-party page](https://docs.cloud.google.com/gemini/docs/codeassist/supported-languages) | The current supported-languages page establishes VS Code and JetBrains hosts but does not document a marketplace, package, setup path, or other install channel. |
| Gemini Code Assist Standard / Enterprise extensions | `extension-permissions` | limited | [First-party page](https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer) | The current page documents per-tool restrictions for VS Code, while IntelliJ documents review and approval rather than an equivalent per-tool policy. |
| Continue extension | `extension-install-channel` | unknown | [First-party page](https://docs.continue.dev/getting-started/install) | The current URL returns only redirect-shell content and no longer establishes a substantive VS Code or JetBrains installation channel. |
| Warp | `workbench-named-sessions` | unknown | [First-party page](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | The former local-agent conversation page is no longer published, and current exact first-party evidence for durable named sessions was not established. |
| Warp | `workbench-splits` | unknown | [First-party page](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | The former local-agent conversation page is no longer published, and current exact first-party evidence for split-session behavior was not established. |
| Warp | `workbench-attention-signals` | unknown | [First-party page](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | The former local-agent conversation page is no longer published, and current exact first-party evidence for explicit attention states was not established. |
| Warp | `workbench-session-recovery` | unknown | [First-party page](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | The former local-agent conversation page is no longer published, and current exact first-party evidence for agent-session recovery was not established. |
| Warp | `workbench-cross-project-attention` | unknown | [First-party page](https://docs.warp.dev/agent-platform/getting-started/agents-in-warp) | The former Agents in Warp page is no longer published, and current exact first-party evidence for actionable state across projects was not established. |

## High-confidence affirmative closures applied

These previously Unknown cells now resolve from the catalog to the audited state and exact evidence URL. Documentation silence is never converted to Not available.

| Product | Row | Applied value/state | Exact evidence | Why it closes |
| --- | --- | --- | --- | --- |
| TraeCode | `editor-agent-sandbox` | limited | [TRAE sandbox security](https://www.trae.ai/blog/engineering_thought_0108?v=1) | TRAE documents a beta Sandbox Mode with filesystem isolation, allowed project and temporary paths, and shell-command interception. |
| Qoder IDE | `editor-worktree-isolation` | built-in | [Qoder Quest execution environments](https://docs.qoder.com/user-guide/quest/execution-environments) | Qoder Quest documents local Worktree mode, separate Git checkouts, parallel tasks, and moving completed work back to the local workspace. |
| Zed | `editor-remote-workspaces` | built-in | [Zed Remote Development](https://zed.dev/docs/remote-development) | Zed documents an SSH-backed remote server that owns source files, language servers, tasks, and terminals while the local application owns the UI and AI client. |
| Cline extension | `extension-provider-choice` | built-in | [Cline provider configuration](https://docs.cline.bot/provider-config/other-30-plus-providers) | Cline's extension settings expose an API Provider selector, provider credentials, and model selection across hosted, local, and OpenAI-compatible providers. |
| Continue extension | `product-status` | archived | [Continue repository README](https://github.com/continuedev/continue) | The canonical repository explicitly says it is read-only and no longer actively maintained and calls 2.0.0 the final extension release. |
| Amazon Q Developer IDE extension | `extension-permissions` | built-in | [Amazon Q Developer MCP tools](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/qdev-mcp.html) | Amazon Q's IDE MCP configuration documents auto-approved, requires-approval, and dangerous tool permission levels. |
| Gemini Code Assist Standard / Enterprise extensions | `extension-mcp` | built-in | [Gemini Code Assist agent mode](https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer) | Google documents local and remote MCP server configuration for Gemini Code Assist in both VS Code and IntelliJ. |
| Gemini Code Assist Standard / Enterprise extensions | `extension-permissions` | limited | [Gemini Code Assist agent mode](https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer) | VS Code exposes coreTools and excludeTools with command-specific restrictions; IntelliJ documents review and approval rather than the same per-tool policy. |
| JetBrains AI Assistant | `extension-mcp` | built-in | [JetBrains AI Assistant agents](https://www.jetbrains.com/help/ai-assistant/agents.html) | JetBrains documents configuring MCP servers in AI Assistant settings and exposing their tools to coding agents. |
| JetBrains AI Assistant | `extension-permissions` | built-in | [JetBrains AI Assistant agents](https://www.jetbrains.com/help/ai-assistant/agents.html) | JetBrains documents per-agent operation modes and an authorize-actions step that can approve, deny, or automatically run actions. |
| CodeCompanion.nvim | `extension-mcp` | built-in | [CodeCompanion.nvim repository README](https://github.com/olimorris/codecompanion.nvim) | The canonical README explicitly lists built-in Model Context Protocol support. |
| Warp | `workbench-change-review` | built-in | [Warp Code Review](https://docs.warp.dev/code/code-review) | Warp documents a first-party Code Review panel with live diffs, inline comments, batch agent feedback, edit, revert, and file review. |
| Warp | `workbench-worktrees` | built-in | [Warp Code Review](https://docs.warp.dev/code/code-review) | Warp's Code Review documentation explicitly states native Git worktree support and links the product's worktree workflow. |
| Wave Terminal | `workbench-named-sessions` | built-in | [Wave Terminal workspaces](https://docs.waveterm.dev/workspaces) | Wave documents named saved workspaces whose tabs, layouts, terminal histories, and AI histories persist automatically and can be reopened. |

## Remaining Unknown index

### Code IDEs

| Product ID | Current Unknowns | Must remain Unknown |
| --- | ---: | ---: |
| `visual-studio-code` | 0 | 0 |
| `cursor-ide` | 0 | 0 |
| `windsurf` | 5 | 5 |
| `zed` | 1 | 1 |
| `intellij-idea` | 4 | 4 |
| `eclipse-theia-ide` | 5 | 5 |
| `traecode` | 6 | 6 |
| `qoder-ide` | 0 | 0 |
| `antigravity-ide` | 2 | 2 |
| `android-studio` | 4 | 4 |
| `positron` | 3 | 3 |
| `onlook` | 4 | 4 |
| `lapce` | 11 | 11 |
| `helix` | 12 | 12 |
| `kiro` | 3 | 3 |
| `void` | 10 | 10 |
| `visual-studio` | 9 | 9 |
| `replit-project-editor` | 5 | 5 |
| `stagewise` | 8 | 8 |

### IDE extensions

| Product ID | Current Unknowns | Must remain Unknown |
| --- | ---: | ---: |
| `github-copilot-vscode` | 5 | 5 |
| `cline` | 7 | 7 |
| `continue` | 6 | 6 |
| `kilo-code` | 3 | 3 |
| `codex-ide-extension` | 7 | 7 |
| `claude-code-vscode` | 7 | 7 |
| `claude-code-jetbrains` | 9 | 9 |
| `amazon-q-developer-ide` | 6 | 6 |
| `gemini-code-assist` | 7 | 7 |
| `jetbrains-ai-assistant` | 5 | 5 |
| `pochi-vscode` | 4 | 4 |
| `tabby-ide-extensions` | 7 | 7 |
| `codecompanion-nvim` | 6 | 6 |
| `avante-nvim` | 8 | 8 |
| `refact-ide-plugins` | 5 | 5 |
| `roo-code` | 5 | 5 |
| `tabnine-agent` | 7 | 7 |
| `windsurf-plugins` | 7 | 7 |
| `sourcegraph-cody-enterprise` | 6 | 6 |
| `junie-ide` | 4 | 4 |

### Agent Multiplexers

| Product ID | Current Unknowns | Must remain Unknown |
| --- | ---: | ---: |
| `tortie` | 3 | 3 |
| `cate` | 1 | 1 |
| `cdesktop` | 5 | 5 |
| `cmux` | 2 | 2 |
| `herdr` | 6 | 6 |
| `wmux` | 2 | 2 |
| `warp` | 9 | 9 |
| `wave-terminal` | 6 | 6 |
| `dmux` | 5 | 5 |
| `claude-squad` | 7 | 7 |
| `nodeterm` | 2 | 2 |
| `ccmanager` | 8 | 8 |
| `tty7` | 2 | 2 |

## Evidence boundaries preserved

- A host IDE capability is not inherited by every extension installed in it.
- A sibling CLI, web app, cloud agent, or predecessor is not evidence for the evaluated SKU.
- Parallel sessions do not imply worktree or container isolation.
- Permissions do not imply a sandbox, and ordinary undo does not imply workspace checkpoints.
- Running several harnesses does not imply context-preserving cross-harness handoff.
- Repository activity does not supply an editorial lifecycle label unless the first-party source states one.

## Validation

Run:

```sh
node --experimental-strip-types scripts/generate-unknown-audit-ide-surfaces.mjs --check
```

The check re-derives the rendered Unknown set, requires exact key parity, validates every source and rationale, verifies every applied closure and changed-source correction, and checks that the generated JSON and report have not drifted.
