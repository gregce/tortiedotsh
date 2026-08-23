# Coding-agent harness expansion

Checked: **2026-08-23**

This pass expands the harness catalog using only first-party product documentation, first-party repositories, and first-party license files. A product belongs in this category when it owns one model conversation and the tool-execution loop. A terminal that merely launches another agent, a workbench that supervises agents, or a client that creates a hosted agent task does not qualify.

Repository activity is a discovery signal, not a quality score. “Open source” below means the canonical implementation is published under an OSI-compatible license; a public repository containing wrappers, issue tracking, or an all-rights-reserved/FSL implementation is not labeled open source.

## Recommended catalog changes

| Priority | Catalog ID | Exact product / SKU | Ruling | Source model | Lifecycle |
|---|---|---|---|---|---|
| P0 | `deepseek-harness` | DeepSeek Harness (`dsh`) | Add harness | MIT | Developer preview; active |
| P0 | `prime-agent` | Prime Agent (`prime`) | Add harness | MIT | Active |
| P0 | `amp` | Amp CLI | Add harness | Proprietary | Active |
| P0 | `poolside-pool` | pool | Add harness | Public source, Poolside EULA; not OSS | Active |
| P0 | `kimi-code-cli` | Kimi Code CLI | Add harness | MIT | Active successor to Kimi CLI |
| P0 | `kilo-code-cli` | Kilo Code CLI | Add harness | MIT | Active |
| P1 | `mistral-vibe` | Mistral Vibe | Add harness | Apache-2.0 | Active |
| P1 | `continue-cli` | Continue CLI (`cn`) | Add harness | Apache-2.0 | Active |
| P1 | `crush` | Crush | Add harness, but do not call OSS | FSL-1.1-MIT; source-available | Active |
| P1 | `auggie-cli` | Auggie CLI | Add harness | Proprietary core | Beta; active |
| P1 | `kiro-cli` | Kiro CLI | Add harness | Proprietary | Active |
| P1 | `amplifier-agent` | Amplifier Agent | Add headless/embedded harness | MIT | Active |
| P1 | `gptme` | gptme | Add harness | MIT | Active |
| Existing | `github-copilot-cli` | GitHub Copilot CLI (`copilot`) | Keep and refresh; do not duplicate | Proprietary core | Public preview; active |
| Hold | `plandex` | Plandex | Research-ready, but hold from default set | MIT | Local/self-hosted remains; hosted service wound down |

This supplies **13 credible additions**, eight of them open source. The first six should be added before the second group because they close the named-product gaps, are actively documented, and add meaningful execution-boundary diversity.

### Recommended visible product order

Keep the mainstream reference products in the first viewport instead of letting repository metrics or alphabetical ordering bury them. The recommended left-to-right focus order is:

1. `claude-code`
2. `codex-cli`
3. `github-copilot-cli`
4. `gemini-cli`
5. `amp`
6. `prime-agent`
7. `deepseek-harness`

Continue with the remaining field-guide products after those anchors. This is a display-order recommendation, not a quality ranking. GitHub CLI (`gh`) must not occupy a product column beside GitHub Copilot CLI: `gh copilot` launches the separate `copilot` executable, while `gh agent-task` controls hosted tasks.

## Claim-state conventions

- `built-in`: the first-party surface documents the capability as part of the product.
- `via-extension`: an official plugin/profile/protocol supplies it, but it is not in the base experience.
- `via-integration`: an external or separately hosted execution boundary supplies it.
- `limited`: the capability exists but does not meet the full row definition.
- `not-available`: first-party material establishes its absence or recommends an external substitute.
- `unknown`: current first-party research did not establish an answer. Do not infer “no.”

Every row below is implementation-ready for `checkedAt: 2026-08-23`. Platform badges should be rendered only for platforms that the cited vendor documentation explicitly supports.

## P0 dossiers

### DeepSeek Harness — `deepseek-harness`

- **Primary category:** coding-agent harness.
- **Exact SKU:** DeepSeek Harness; npm/CLI entry point `@deepseek-ai/dsh` / `dsh`.
- **Official URL:** https://deepseek.com/harness/en/
- **Canonical repository:** https://github.com/deepseek-ai/deepseek-harness — MIT.
- **Execution boundary:** local CLI/headless process or local web application; loop, storage, sandbox, models, and UI are pluggable packages.
- **Platforms:** the code contains Linux, macOS, and Windows local-sandbox implementations, but the vendor does not yet publish a simple supported-client OS matrix. Keep OS cells `unknown` pending a support statement.
- **Lifecycle:** developer preview; repository active at check time.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `via-extension` | Base CLI ships web and headless profiles; the first-party README shows a TUI as an optional installed profile, not as a base surface. | [CLI app](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md) |
| `harness-headless` | `built-in` | `dsh --profile headless "…"` runs a persisted one-shot task. | [CLI app](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md) |
| `harness-multi-provider` | `built-in` | Model providers are plugins; the product describes models as a replaceable capability. | [Product](https://deepseek.com/harness/en/) |
| `harness-session-resume` | `built-in` | Append-only session logs support resume, fork, search, replay, and cross-device sync. | [Product](https://deepseek.com/harness/en/) |
| `harness-extension-protocol` | `built-in` | Models, tools, skills, sessions, sandboxes, storage, loops, scheduling, and UI use the same plugin system. | [Product](https://deepseek.com/harness/en/) |
| `harness-project-instructions` | `built-in` | Agent instructions load hierarchically from user and project `AGENTS.md` / `CLAUDE.md` files. | [Agent instructions](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/context/agent-instructions/README.md) |
| `harness-permission-controls` | `built-in` | Configuration exposes sandbox and tool policy presets rather than a single all-or-nothing mode. | [Configuration catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md) |
| `harness-sandbox` | `built-in` | The local sandbox fails closed and selects Linux bwrap/Landlock, macOS Seatbelt, or Windows ACL/restricted-token implementations. | [Configuration catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md), [source](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/sandbox/sandbox-local/src/index.ts) |
| `harness-checkpoints` | `limited` | A session-checkpoint policy governs log durability; first-party material does not establish workspace-file rollback. | [Configuration catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md) |
| `harness-subagents` | `built-in` | The standard coding-agent mode includes subagents and workflows. | [Product](https://deepseek.com/harness/en/) |
| `harness-structured-output` | `limited` | Headless and JSON-RPC/SDK surfaces exist, but a stable CLI result schema is not documented. | [CLI app](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md) |
| `harness-git-workflow` | `limited` | Shell and editing tools can operate on Git, but no managed branch/commit/review workflow is documented. | [Product](https://deepseek.com/harness/en/) |

### Prime Agent — `prime-agent`

- **Primary category:** coding-agent harness, with research-agent modes in the same runtime.
- **Official URL / canonical repository:** https://github.com/PrimeIntellect-ai/prime-agent — MIT.
- **Execution boundary:** local CLI backed by a local daemon; sessions survive terminal disconnects and can run on schedules or heartbeats.
- **Platforms:** macOS and Linux are documented for the stable install; do not mark Windows.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `prime` starts an interactive terminal agent with a persistent IPython execution context. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-headless` | `built-in` | Print/headless operation and RPC are documented for automation. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |
| `harness-multi-provider` | `built-in` | Configuration supports Anthropic, OpenAI, Google, and other model providers. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-session-resume` | `built-in` | Daemon-backed sessions persist, reattach after disconnect, and can be resumed or forked. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-extension-protocol` | `built-in` | Skills, MCP servers, and extension packages are first-class. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-project-instructions` | `built-in` | Project context can be sourced from `AGENTS.md` or `CLAUDE.md`. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |
| `harness-permission-controls` | `built-in` | Tool allowlists and tool disabling provide selectable execution controls. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |
| `harness-sandbox` | `not-available` | The project explicitly says commands run with the user’s permissions and are not sandboxed. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-checkpoints` | `limited` | `/refine` can restore harness state, but no workspace-mutation rollback is established. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |
| `harness-subagents` | `built-in` | Recursive subagents are part of the core continual-agent design. | [README](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md) |
| `harness-structured-output` | `built-in` | JSON and RPC modes are documented automation surfaces. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |
| `harness-multimodal-input` | `built-in` | Image files, including screenshots, can be attached from the CLI. | [Usage](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md) |

### Amp CLI — `amp`

- **Primary category:** coding-agent harness.
- **Official URL:** https://ampcode.com/manual
- **Canonical repository/license:** no first-party repository for the core CLI; proprietary. Public `ampcode` repositories contain integrations and contributed components, not the canonical harness implementation.
- **Execution boundary:** local process; optional vendor-hosted runners/Orbs provide isolated remote execution.
- **Platforms:** macOS, Linux, WSL, and native Windows PowerShell are documented.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `amp` opens the interactive terminal agent. | [Manual](https://ampcode.com/manual) |
| `harness-headless` | `built-in` | `amp -x` executes a prompt non-interactively. | [Manual](https://ampcode.com/manual) |
| `harness-multi-provider` | `built-in` | Amp supports multiple model choices and provider subscriptions within the product. | [Manual](https://ampcode.com/manual) |
| `harness-session-resume` | `built-in` | Threads persist and can be continued from the CLI. | [Manual](https://ampcode.com/manual) |
| `harness-extension-protocol` | `built-in` | MCP servers, skills, and Amp plugins extend the harness. | [Manual](https://ampcode.com/manual) |
| `harness-project-instructions` | `built-in` | Hierarchical `AGENTS.md` files provide repository and directory instructions. | [Manual](https://ampcode.com/manual) |
| `harness-permission-controls` | `not-available` | The local agent does not ask before tool execution; the manual directs users to isolation for stronger boundaries. | [Manual](https://ampcode.com/manual) |
| `harness-sandbox` | `via-integration` | Local CLI execution is not sandboxed; vendor-hosted Orbs/runners can supply an isolated environment. | [Manual](https://ampcode.com/manual) |
| `harness-checkpoints` | `not-available` | Threads can be managed, but first-party documentation does not provide workspace checkpoints or rollback. | [Manual](https://ampcode.com/manual) |
| `harness-subagents` | `built-in` | Custom subagents can be defined and invoked from a thread. | [Manual](https://ampcode.com/manual) |
| `harness-structured-output` | `built-in` | `--stream-json` emits machine-readable streaming events. | [Manual](https://ampcode.com/manual) |
| `harness-multimodal-input` | `built-in` | Images can be attached to prompts. | [Manual](https://ampcode.com/manual) |

### pool — `poolside-pool`

- **Primary category:** coding-agent harness. Poolside Assistant is a separate editor integration; the terminal harness SKU is **pool**.
- **Official URL:** https://docs.poolside.ai/cli/pool
- **Canonical repository:** https://github.com/poolsideai/pool
- **License ruling:** public source under the [Poolside license/EULA](https://github.com/poolsideai/pool/blob/main/LICENSE.md), not open source.
- **Execution boundary:** local process, optional managed local container sandbox, and ACP client/server connectivity.
- **Platforms:** Linux and macOS; Windows is documented as preview.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `pool` provides an interactive terminal UI with plan and build modes. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-headless` | `built-in` | `pool exec` runs tasks non-interactively. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-multi-provider` | `built-in` | OpenRouter, Ollama, and OpenAI-compatible providers are supported alongside Poolside models. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-session-resume` | `built-in` | Sessions can be resumed, renamed, and deleted. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-extension-protocol` | `built-in` | MCP, ACP, skills, and lifecycle hooks are documented extension surfaces. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-project-instructions` | `built-in` | `AGENTS.md` and skills supply project-local instructions. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-permission-controls` | `built-in` | The CLI presents tool approvals and supports policy configuration. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-sandbox` | `built-in` | An optional managed local container sandbox controls file and network access; unsandboxed local execution remains available. | [Sandbox docs](https://docs.poolside.ai/sandboxes) |
| `harness-checkpoints` | `limited` | Conversation rewind is documented; workspace-file rollback is not. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-subagents` | `built-in` | Subagents are a documented core feature. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-structured-output` | `built-in` | Headless execution supports structured JSON output. | [Repository README](https://github.com/poolsideai/pool) |
| `harness-git-workflow` | `limited` | The agent can modify repositories, but no managed worktree/branch/review lifecycle is established. | [Repository README](https://github.com/poolsideai/pool) |

### Kimi Code CLI — `kimi-code-cli`

- **Primary category:** coding-agent harness.
- **Official URL:** https://moonshotai.github.io/kimi-code/en/
- **Canonical repository:** https://github.com/MoonshotAI/kimi-code — MIT.
- **Execution boundary:** local CLI/TUI with optional local server and ACP surfaces.
- **Platforms:** macOS, Linux, and Windows; Windows instructions require Git Bash.
- **Lifecycle:** active. This is the successor to the winding-down `MoonshotAI/kimi-cli` project.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | Kimi Code ships an interactive terminal interface. | [README](https://github.com/MoonshotAI/kimi-code) |
| `harness-headless` | `limited` | A local server/API surface is documented, but a stable one-shot CLI contract was not established in this pass. | [README](https://github.com/MoonshotAI/kimi-code) |
| `harness-multi-provider` | `built-in` | Configuration supports Kimi, Anthropic, OpenAI/Responses, Google GenAI, and Vertex AI provider types. | [Configuration](https://moonshotai.github.io/kimi-code/en/configuration/config-files) |
| `harness-session-resume` | `built-in` | Persistent sessions support resume, fork, and export. | [Sessions](https://moonshotai.github.io/kimi-code/en/guides/sessions) |
| `harness-extension-protocol` | `built-in` | Plugins, skills, MCP, hooks, and ACP are first-party extension surfaces. | [README](https://github.com/MoonshotAI/kimi-code) |
| `harness-project-instructions` | `unknown` | No current first-party page reviewed here established the exact repository-instruction file contract. | [Docs](https://moonshotai.github.io/kimi-code/en/) |
| `harness-permission-controls` | `built-in` | Approval rules and interaction modes govern tool execution. | [Interaction guide](https://moonshotai.github.io/kimi-code/en/guides/interaction) |
| `harness-sandbox` | `unknown` | Current first-party docs reviewed did not establish an OS/container sandbox boundary. | [Docs](https://moonshotai.github.io/kimi-code/en/) |
| `harness-checkpoints` | `limited` | Sessions can be forked and conversation state can be navigated; workspace rollback is not established. | [Sessions](https://moonshotai.github.io/kimi-code/en/guides/sessions) |
| `harness-subagents` | `built-in` | Parallel subagents are built into the CLI. | [README](https://github.com/MoonshotAI/kimi-code) |
| `harness-structured-output` | `limited` | Session export and local APIs exist, but a canonical one-shot result schema was not established. | [Sessions](https://moonshotai.github.io/kimi-code/en/guides/sessions) |
| `harness-multimodal-input` | `built-in` | The interaction surface accepts images and video. | [Interaction guide](https://moonshotai.github.io/kimi-code/en/guides/interaction) |

### Kilo Code CLI — `kilo-code-cli`

- **Primary category:** coding-agent harness.
- **Official URL:** https://kilo.ai/docs/code-with-ai/platforms/cli
- **Canonical repository:** https://github.com/Kilo-Org/kilocode — MIT.
- **Execution boundary:** local CLI/TUI; ACP can expose or connect the agent to other clients.
- **Platforms:** macOS, Windows, and Linux.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `kilo` provides an interactive terminal UI. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-headless` | `built-in` | `kilo run --auto` runs a task non-interactively. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-multi-provider` | `built-in` | Kilo supports multiple hosted and local model providers. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-session-resume` | `built-in` | CLI sessions persist and can be imported or exported. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-extension-protocol` | `built-in` | MCP, ACP, skills, and plugins extend the CLI. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-project-instructions` | `built-in` | The CLI reads repository `AGENTS.md` instructions. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-permission-controls` | `built-in` | Auto-approval and per-tool permission settings are documented. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-sandbox` | `unknown` | First-party sources conflict: current product material advertises `/sandbox`, while the repository security page says Kilo does not provide sandboxing. Require version-pinned verification before claiming support. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli), [security policy](https://github.com/Kilo-Org/kilocode/security) |
| `harness-checkpoints` | `unknown` | Current first-party CLI material reviewed did not establish workspace rollback semantics. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-subagents` | `built-in` | Custom modes/subagents can delegate bounded work. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-structured-output` | `limited` | Sessions export as JSON, but a stable machine-readable event stream for `run` was not established. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |
| `harness-git-workflow` | `built-in` | CLI documentation includes repository-aware Git review and change workflows. | [CLI docs](https://kilo.ai/docs/code-with-ai/platforms/cli) |

## P1 dossiers

### Mistral Vibe — `mistral-vibe`

- **Primary category:** coding-agent harness.
- **Official URL / canonical repository:** https://github.com/mistralai/mistral-vibe — Apache-2.0.
- **Execution boundary:** local terminal process.
- **Platforms:** macOS and Linux are official targets; Windows may work but is explicitly not an official target.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | Vibe ships an interactive terminal agent. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-headless` | `built-in` | Non-interactive/programmatic invocation is documented. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-multi-provider` | `built-in` | Models and providers are configurable rather than fixed to one endpoint. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-session-resume` | `built-in` | Sessions persist and can be reopened. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-extension-protocol` | `built-in` | MCP servers and skills extend the harness. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-project-instructions` | `built-in` | Repository `AGENTS.md` instructions are supported. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-permission-controls` | `built-in` | Configurable permission agents decide whether tools run. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-sandbox` | `not-available` | Folder trust and approval are documented, but no OS/container sandbox boundary is provided. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-checkpoints` | `unknown` | Workspace checkpoint/rollback behavior is not established by current first-party material. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-subagents` | `built-in` | Subagent support is documented. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-structured-output` | `built-in` | JSON/streaming output supports automation. | [README](https://github.com/mistralai/mistral-vibe) |
| `harness-git-workflow` | `limited` | Git tools are included, but a managed branch/worktree lifecycle is not established. | [README](https://github.com/mistralai/mistral-vibe) |

### Continue CLI (`cn`) — `continue-cli`

- **Primary category:** coding-agent harness.
- **Official URL:** https://docs.continue.dev/cli/quickstart
- **Canonical repository:** https://github.com/continuedev/continue — Apache-2.0.
- **Execution boundary:** local CLI process using local or remote model providers.
- **Platforms:** macOS, Linux, and Windows.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `cn` starts an interactive terminal agent. | [Quickstart](https://docs.continue.dev/cli/quickstart) |
| `harness-headless` | `built-in` | `cn -p` runs prompts in headless mode. | [CLI README](https://github.com/continuedev/continue/blob/main/extensions/cli/README.md) |
| `harness-multi-provider` | `built-in` | Continue configuration supports multiple hosted and local providers. | [Quickstart](https://docs.continue.dev/cli/quickstart) |
| `harness-session-resume` | `built-in` | CLI sessions persist and can be resumed. | [CLI README](https://github.com/continuedev/continue/blob/main/extensions/cli/README.md) |
| `harness-extension-protocol` | `built-in` | Models, MCP servers, agents, rules, and source-controlled configs extend behavior. | [Quickstart](https://docs.continue.dev/cli/quickstart) |
| `harness-project-instructions` | `built-in` | Rules and repository configuration provide project instructions. | [Quickstart](https://docs.continue.dev/cli/quickstart) |
| `harness-permission-controls` | `built-in` | Tool permissions can allow, ask, or exclude tool execution. | [Tool permissions](https://github.com/continuedev/continue/blob/main/docs/cli/tool-permissions.mdx) |
| `harness-sandbox` | `not-available` | Tool permissions are documented, but no OS/container sandbox boundary is provided. | [Tool permissions](https://github.com/continuedev/continue/blob/main/docs/cli/tool-permissions.mdx) |
| `harness-checkpoints` | `unknown` | Workspace checkpoint/rollback behavior is not established. | [CLI README](https://github.com/continuedev/continue/blob/main/extensions/cli/README.md) |
| `harness-subagents` | `unknown` | Current first-party CLI docs reviewed do not establish recursive/delegated subagents. | [Quickstart](https://docs.continue.dev/cli/quickstart) |
| `harness-structured-output` | `built-in` | Headless mode supports JSON output. | [CLI README](https://github.com/continuedev/continue/blob/main/extensions/cli/README.md) |
| `harness-git-workflow` | `limited` | Repository changes are supported, but no managed worktree/branch lifecycle is documented. | [Quickstart](https://docs.continue.dev/cli/quickstart) |

### Crush — `crush`

- **Primary category:** coding-agent harness.
- **Official URL / canonical repository:** https://github.com/charmbracelet/crush
- **License ruling:** FSL-1.1-MIT, a source-available license that converts later; do not label the current release open source.
- **Execution boundary:** local terminal process.
- **Platforms:** macOS, Linux, Windows, Android, and BSD are documented.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | Crush provides an interactive terminal UI. | [README](https://github.com/charmbracelet/crush) |
| `harness-headless` | `built-in` | `crush run` executes a prompt non-interactively. | [README](https://github.com/charmbracelet/crush) |
| `harness-multi-provider` | `built-in` | Multiple model providers and local models can be configured. | [README](https://github.com/charmbracelet/crush) |
| `harness-session-resume` | `built-in` | Sessions persist and can be selected/resumed. | [README](https://github.com/charmbracelet/crush) |
| `harness-extension-protocol` | `built-in` | MCP servers and skills extend the agent. | [README](https://github.com/charmbracelet/crush) |
| `harness-project-instructions` | `built-in` | The CLI recognizes `AGENTS.md`, `CRUSH.md`, `CLAUDE.md`, and `GEMINI.md`. | [README](https://github.com/charmbracelet/crush) |
| `harness-permission-controls` | `built-in` | Tool execution permissions can be configured. | [README](https://github.com/charmbracelet/crush) |
| `harness-sandbox` | `not-available` | No OS/container sandbox boundary is documented. | [README](https://github.com/charmbracelet/crush) |
| `harness-checkpoints` | `unknown` | Workspace checkpoint/rollback behavior is not established. | [README](https://github.com/charmbracelet/crush) |
| `harness-subagents` | `unknown` | Current first-party material reviewed does not establish delegated subagents. | [README](https://github.com/charmbracelet/crush) |
| `harness-structured-output` | `unknown` | `run` is headless, but a stable machine-readable output schema is not established. | [README](https://github.com/charmbracelet/crush) |
| `harness-git-workflow` | `limited` | Shell/editing tools can operate on repositories; managed Git lifecycle is not established. | [README](https://github.com/charmbracelet/crush) |

### Auggie CLI — `auggie-cli`

- **Primary category:** coding-agent harness.
- **Official URL:** https://docs.augmentcode.com/cli/overview
- **Distribution:** npm package `@augmentcode/auggie`.
- **Repository/source ruling:** https://github.com/augmentcode/auggie contains launch wrappers, examples, and issue tracking; it is not the canonical core implementation. Treat the core as proprietary.
- **Execution boundary:** local CLI process using Augment’s hosted context/model service.
- **Platforms:** the documented shells are Bash, Zsh, and Fish; mark macOS/Linux. Windows support remains `unknown` in the matrix until a first-party support statement is located.
- **Lifecycle:** beta; active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `auggie` starts an interactive coding-agent session. | [Overview](https://docs.augmentcode.com/cli/overview) |
| `harness-headless` | `built-in` | Print/non-interactive operation is documented for scripts and CI. | [Reference](https://docs.augmentcode.com/cli/reference) |
| `harness-multi-provider` | `limited` | Users can select offered models, but first-party docs do not establish bring-your-own model providers. | [Reference](https://docs.augmentcode.com/cli/reference) |
| `harness-session-resume` | `built-in` | Sessions can be listed and resumed. | [Reference](https://docs.augmentcode.com/cli/reference) |
| `harness-extension-protocol` | `built-in` | MCP integrations are supported. | [Integrations](https://docs.augmentcode.com/cli/integrations) |
| `harness-project-instructions` | `built-in` | Workspace rules provide persistent project instructions. | [Rules](https://docs.augmentcode.com/cli/rules) |
| `harness-permission-controls` | `built-in` | Tool permission modes can ask, allow, or deny execution. | [Permissions](https://docs.augmentcode.com/cli/permissions) |
| `harness-sandbox` | `unknown` | Current first-party docs reviewed do not establish an OS/container sandbox boundary. | [Overview](https://docs.augmentcode.com/cli/overview) |
| `harness-checkpoints` | `unknown` | Workspace checkpoint/rollback behavior is not established. | [Reference](https://docs.augmentcode.com/cli/reference) |
| `harness-subagents` | `built-in` | Auggie documents dedicated subagents and delegation. | [Subagents](https://docs.augmentcode.com/cli/subagents) |
| `harness-structured-output` | `built-in` | Machine-readable output is available for non-interactive runs. | [Reference](https://docs.augmentcode.com/cli/reference) |
| `harness-multimodal-input` | `built-in` | Images can be supplied as agent context. | [Reference](https://docs.augmentcode.com/cli/reference) |

### Kiro CLI — `kiro-cli`

- **Primary category:** coding-agent harness.
- **Official URL:** https://kiro.dev/docs/cli/installation/
- **Canonical repository/license:** no canonical first-party source repository for the core CLI; proprietary.
- **Execution boundary:** local process, with optional Kiro cloud execution surfaces.
- **Platforms:** macOS, Linux, and Windows 11.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | Kiro CLI provides an interactive terminal chat. | [How Kiro works](https://kiro.dev/docs/how-kiro-works) |
| `harness-headless` | `built-in` | Headless invocation is documented for scripts and CI. | [CLI docs](https://kiro.dev/docs/cli/) |
| `harness-multi-provider` | `limited` | Users can select Kiro-offered models; bring-your-own provider configuration is not established. | [How Kiro works](https://kiro.dev/docs/how-kiro-works) |
| `harness-session-resume` | `built-in` | CLI sessions persist and can be resumed. | [CLI chat help](https://kiro.dev/docs/cli/chat/help-agent/) |
| `harness-extension-protocol` | `built-in` | MCP, hooks, skills, and custom agents extend the CLI. | [Docs](https://kiro.dev/docs/) |
| `harness-project-instructions` | `built-in` | Steering files provide durable project guidance. | [Docs](https://kiro.dev/docs/) |
| `harness-permission-controls` | `built-in` | Agent/tool permissions are configurable. | [CLI chat help](https://kiro.dev/docs/cli/chat/help-agent/) |
| `harness-sandbox` | `via-integration` | Local execution is not established as sandboxed; Kiro cloud execution can provide an isolated boundary. | [How Kiro works](https://kiro.dev/docs/how-kiro-works) |
| `harness-checkpoints` | `built-in` | Checkpoints and rewind are documented agent-session capabilities. | [How Kiro works](https://kiro.dev/docs/how-kiro-works) |
| `harness-subagents` | `built-in` | Custom agents and subagents can delegate work. | [Docs](https://kiro.dev/docs/) |
| `harness-structured-output` | `limited` | Headless/CI execution exists, but a stable event schema was not established in this pass. | [CLI docs](https://kiro.dev/docs/cli/) |
| `harness-git-workflow` | `built-in` | Kiro’s agent workflow is repository-aware and includes change review. | [How Kiro works](https://kiro.dev/docs/how-kiro-works) |

### Amplifier Agent — `amplifier-agent`

- **Primary category:** headless/embedded agent harness. It owns the loop even though every CLI command executes one turn and exits.
- **Official URL / canonical repository:** https://github.com/microsoft/amplifier-agent — MIT.
- **Execution boundary:** local process or embedded Python library.
- **Platforms:** first-party docs reviewed do not enumerate a support matrix; leave OS cells `unknown`.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `not-available` | The CLI reference explicitly describes one command/one turn/exit behavior rather than an interactive TUI. | [CLI reference](https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md) |
| `harness-headless` | `built-in` | `amplifier run` executes a task as a headless harness. | [CLI reference](https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md) |
| `harness-multi-provider` | `built-in` | Five model-provider integrations are documented. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-session-resume` | `built-in` | Session IDs allow subsequent commands to continue an existing session. | [CLI reference](https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md) |
| `harness-extension-protocol` | `built-in` | Tools, skills, MCP servers, and modes compose the engine. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-project-instructions` | `limited` | Modes and skills inject durable guidance; a standard repository instruction-file contract is not established. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-permission-controls` | `built-in` | Approval can be required or disabled for tool use. | [CLI reference](https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md) |
| `harness-sandbox` | `unknown` | No OS/container sandbox boundary was established by current first-party material. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-checkpoints` | `unknown` | Workspace checkpoint/rollback behavior is not established. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-subagents` | `built-in` | Delegation and subagents are core engine capabilities. | [README](https://github.com/microsoft/amplifier-agent) |
| `harness-structured-output` | `built-in` | JSON and display/NDJSON output modes are documented. | [CLI reference](https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md) |
| `harness-git-workflow` | `limited` | Tools can manipulate repositories, but no managed worktree/branch lifecycle is documented. | [README](https://github.com/microsoft/amplifier-agent) |

### gptme — `gptme`

- **Primary category:** coding-agent harness.
- **Official URL / canonical repository:** https://github.com/gptme/gptme — MIT.
- **Execution boundary:** local terminal process; can run on laptops, over SSH, on headless servers, and in CI.
- **Platforms:** macOS and Linux are well represented in first-party install paths; leave native Windows `unknown` pending an explicit support statement.
- **Lifecycle:** active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | gptme provides an interactive terminal agent with shell, file, web, and code tools. | [README](https://github.com/gptme/gptme) |
| `harness-headless` | `built-in` | Headless/server/CI execution is a documented use case. | [README](https://github.com/gptme/gptme) |
| `harness-multi-provider` | `built-in` | Anthropic, OpenAI, Google, xAI, DeepSeek, OpenRouter, and local providers are supported. | [README](https://github.com/gptme/gptme) |
| `harness-session-resume` | `built-in` | Conversation sessions persist and support undo and fork. | [README](https://github.com/gptme/gptme) |
| `harness-extension-protocol` | `built-in` | MCP, ACP, plugins, skills, and lessons extend the harness. | [README](https://github.com/gptme/gptme) |
| `harness-project-instructions` | `limited` | Config and prompt files supply persistent guidance; a standard hierarchical repository instruction contract is not established here. | [README](https://github.com/gptme/gptme) |
| `harness-permission-controls` | `built-in` | Guardrails and confirmation/auto-approve modes control tool execution. | [README](https://github.com/gptme/gptme) |
| `harness-sandbox` | `not-available` | No built-in OS/container sandbox is documented for local execution. | [README](https://github.com/gptme/gptme) |
| `harness-checkpoints` | `limited` | Undo/fork operates on conversation state; workspace mutation rollback is not established. | [README](https://github.com/gptme/gptme) |
| `harness-subagents` | `via-integration` | Autonomous templates can compose additional agents, but recursive subagents are not established as a base CLI primitive. | [README](https://github.com/gptme/gptme) |
| `harness-structured-output` | `built-in` | JSONL output supports machine consumption. | [README](https://github.com/gptme/gptme) |
| `harness-multimodal-input` | `built-in` | Vision/image input is documented. | [README](https://github.com/gptme/gptme) |

## Existing product refresh: GitHub Copilot CLI — `github-copilot-cli`

- **Primary category:** coding-agent harness.
- **Exact executable:** `copilot`.
- **Official URL:** https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli
- **Source ruling:** proprietary core. https://github.com/github/copilot-cli is the public issue/distribution repository, not an open-source implementation.
- **Execution boundary:** local CLI process with GitHub-hosted model/service calls and optional ACP clients.
- **Platforms:** macOS, Linux, Windows PowerShell, and WSL.
- **Lifecycle:** public preview; active.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | `copilot` starts the interactive coding-agent CLI. | [Overview](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview) |
| `harness-headless` | `built-in` | Prompt flags support non-interactive runs. | [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `harness-multi-provider` | `limited` | Multiple GitHub-selected models are available; bring-your-own provider configuration is not documented. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| `harness-session-resume` | `built-in` | Sessions can be resumed and managed. | [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `harness-extension-protocol` | `built-in` | MCP servers, skills, custom agents, hooks, and plugins are supported. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| `harness-project-instructions` | `built-in` | Repository custom instructions and agent files guide work. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| `harness-permission-controls` | `built-in` | Tool/path/domain allow and deny controls are configurable. | [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `harness-sandbox` | `not-available` | Local Copilot CLI applies permissions but does not document an OS/container sandbox boundary. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| `harness-checkpoints` | `built-in` | The CLI documents checkpoint/rewind behavior for agent work. | [Overview](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview) |
| `harness-subagents` | `built-in` | Built-in and custom agents can delegate to subagents. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| `harness-structured-output` | `built-in` | CLI flags expose machine-readable output for automation. | [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `harness-git-workflow` | `built-in` | GitHub-aware repository, commit, pull-request, and review workflows are first-class. | [About](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |

## GitHub CLI is not GitHub Copilot CLI

Do not add `github-cli` to the harness tab and do not represent `gh copilot` as a second harness SKU.

| Surface | Executable | Owns model conversation/tool loop? | Correct taxonomy |
|---|---|---:|---|
| GitHub CLI | `gh` | No | Developer/GitHub workflow CLI |
| `gh copilot` command | `gh copilot` | No | Installer/launcher for the separate `copilot` executable |
| `gh agent-task` | `gh agent-task` | No | Client/control surface for hosted agent tasks |
| GitHub Copilot CLI | `copilot` | Yes | Coding-agent harness |

First-party evidence:

- The GitHub CLI manual describes `gh copilot` as downloading and executing GitHub Copilot CLI: https://cli.github.com/manual/gh_copilot
- The GitHub CLI reference describes `gh agent-task` as creating, listing, viewing, and following hosted agent tasks: https://cli.github.com/manual/gh_help_reference
- GitHub deprecated the old `gh-copilot` extension in favor of the new Copilot CLI: https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/
- GitHub CLI’s canonical implementation is MIT-licensed at https://github.com/cli/cli, but that license does not apply to the separate proprietary Copilot CLI core.

## Hold candidate: Plandex — `plandex`

Plandex still qualifies technically as a harness and its MIT source remains useful, but it should not enter the default comparison until maintenance expectations are made explicit. The hosted service was wound down in October 2025 and the canonical repository has not shown the same current activity as the P0/P1 set.

- **Official URL / canonical repository:** https://github.com/plandex-ai/plandex — MIT.
- **Execution boundary:** local CLI with local/self-hosted server; the product uses a cumulative-diff staging boundary before applying changes.
- **Platforms:** macOS, Linux, and Windows through WSL.
- **Lifecycle:** hosted cloud wound down; local/self-hosted source remains available.

| Row ID | State | Implementation-ready claim | Evidence |
|---|---|---|---|
| `harness-interactive-cli` | `built-in` | Plandex has an interactive REPL. | [README](https://github.com/plandex-ai/plandex) |
| `harness-headless` | `built-in` | Scripting and automation modes are documented. | [README](https://github.com/plandex-ai/plandex) |
| `harness-multi-provider` | `built-in` | Multiple models/providers are configurable in local mode. | [README](https://github.com/plandex-ai/plandex) |
| `harness-session-resume` | `built-in` | Plans persist and retain version history. | [README](https://github.com/plandex-ai/plandex) |
| `harness-extension-protocol` | `unknown` | No current generic extension protocol was established in this pass. | [README](https://github.com/plandex-ai/plandex) |
| `harness-permission-controls` | `built-in` | Autonomy and apply/review controls gate changes. | [README](https://github.com/plandex-ai/plandex) |
| `harness-sandbox` | `limited` | The cumulative-diff sandbox isolates proposed file changes until apply, but it is not an OS process sandbox. | [README](https://github.com/plandex-ai/plandex) |
| `harness-checkpoints` | `built-in` | Plan version control supports rollback through prior states. | [README](https://github.com/plandex-ai/plandex) |
| `harness-subagents` | `unknown` | Delegated subagents were not established by current first-party material. | [README](https://github.com/plandex-ai/plandex) |
| `harness-structured-output` | `unknown` | A stable machine-readable event/result schema was not established. | [README](https://github.com/plandex-ai/plandex) |
| `harness-git-workflow` | `built-in` | Git-aware cumulative diffs, review, and apply are central to the product. | [README](https://github.com/plandex-ai/plandex) |

## Explicit rejects and replacements

| Candidate | Disposition | Reason | First-party evidence |
|---|---|---|---|
| DeepSeek “harness” ambiguity | Resolve to **DeepSeek Harness** / `dsh`; add as `deepseek-harness` | This is now an official product and repository, not a generic reference to DeepSeek models. | https://deepseek.com/harness/en/, https://github.com/deepseek-ai/deepseek-harness |
| Poolside ambiguity | Resolve to **pool**; add as `poolside-pool` | `pool` owns the terminal conversation/tool loop. Poolside Assistant is a separate editor surface. | https://docs.poolside.ai/cli/pool |
| GitHub CLI (`gh`) | Reject from harnesses | `gh` launches/delegates to Copilot CLI and manages hosted tasks; it does not own the model loop. | https://cli.github.com/manual/gh_copilot |
| Old `gh-copilot` extension | Reject | Deprecated in favor of the separate `copilot` CLI. | https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/ |
| Kimi CLI (`MoonshotAI/kimi-cli`) | Reject; replace with `kimi-code-cli` | The old repository says it is being gradually wound down. | https://github.com/MoonshotAI/kimi-cli |
| OpenHands CLI | Reject | The canonical repository says it is no longer actively maintained and points users to Agent Canvas. | https://github.com/OpenHands/OpenHands-CLI |
| Forge | Reject from harnesses; consider Agent IDE/workbench | Forge is an ACP client/TUI that runs other agents; it does not own their loop. | https://github.com/forge-agents/forge |
| Plandex | Hold | Technically fits, but hosted service wind-down and slower repository activity need visible lifecycle treatment. | https://github.com/plandex-ai/plandex |

## Refresh policy for these additions

The catalog should not turn repository freshness into hand-maintained prose. For each new product, store separately:

1. a stable product record (`id`, category, official URL, canonical repository, source model, platform claims);
2. evidence-backed feature claims with their own `checkedAt` and source URL;
3. automatically refreshed repository facts (latest release/tag, last push, license SPDX plus license-file override, contributors, stars, forks, and repository LOC);
4. a lifecycle signal that requires human review when the repository is archived, the first-party README says maintenance has ended, the official docs disappear, or the license changes;
5. a conflict state that keeps the UI at `unknown` when two current first-party sources disagree, as with Kilo sandboxing.

Automated repository metrics can refresh daily or weekly through the GitHub API and a pinned LOC counter. Product capabilities should not be inferred from release notes or code churn: re-check the cited first-party docs on a scheduled cadence, on every major release, and whenever a URL or content hash changes. Preserve the previous claim until a reviewer accepts the new evidence; expose both `checkedAt` and a stale/conflict indicator in the UI.
