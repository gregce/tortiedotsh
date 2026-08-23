# Code IDE expansion

Checked: 2026-08-23

This is a primary-source expansion of the `code-editors` tab. It recommends seven current products: two open-source products, one source-available product, one split-source IDE, and three proprietary IDEs. It records exact current SKUs and deliberately excludes editor extensions, terminal harnesses, agent-manager shells, and prompt-first app builders.

## Recommendation

Add these exact products, in this order:

| Stable ID | Exact display name | Disposition | Why it belongs in Code IDEs |
|---|---|---|---|
| `eclipse-theia-ide` | Eclipse Theia IDE | Add; open-source priority | A downloadable and browser-capable end-user IDE with Theia AI and Theia Coder built into the product. This is the IDE distribution, not the Eclipse Theia application framework. |
| `traecode` | TraeCode | Add | A current desktop IDE with an editor mode and autonomous SOLO mode. The vendor has renamed the former TRAE IDE to TraeCode. |
| `qoder-ide` | Qoder IDE | Add | A dedicated desktop IDE with Editor and long-running Quest surfaces. This is distinct from Qoder's JetBrains plugin, CLI, Cloud Agents, QoderWork, and Mobile & Web products. |
| `antigravity-ide` | Antigravity IDE | Add | Google's local editor product with editor, terminal, browser, asynchronous local agents, and review artifacts. It is distinct from Antigravity 2.0 and the Antigravity IDE extensions. |
| `android-studio` | Android Studio | Add | A platform-specialized desktop IDE whose current Gemini Agent Mode is integrated into the IDE and supports concurrent agent conversations, MCP, builds, tests, and device verification. |
| `positron` | Positron | Add; source-available priority | A current data-science IDE with Posit Assistant shipped as its default AI experience, BYOK/local-model support, tool permissions, shell sandboxing, and remote development. |
| `onlook` | Onlook | Add; open-source specialist | An active, Apache-2.0, browser-based visual-first code editor for React/Next.js and Tailwind. Its source, file/code editor, AI tools, MCP support, checkpoints, and web-container boundary are documented together. |

Claim-state legend:

- `BI`: built in and directly documented
- `LIM`: present, but narrower than the row label
- `UNK`: not established by the cited primary source
- `NA`: the row does not apply

The existing Code IDE row IDs are:

- `editor-project-tree`
- `editor-terminal`
- `editor-agent-mode`
- `editor-background-jobs`
- `editor-inline-prediction`
- `editor-agent-shell-tools`
- `editor-mcp`
- `editor-parallel-sessions`
- `editor-worktree-isolation`
- `editor-change-review`
- `editor-remote-workspaces`

Unknown is not a negative claim. It means the cited first-party material did not establish the capability for that exact SKU.

## Product boundary and source summary

| Stable ID | Canonical product page | Canonical source / license | Client platforms | Execution boundary | Status |
|---|---|---|---|---|---|
| `eclipse-theia-ide` | [Eclipse Theia IDE getting started](https://theia-ide.org/docs/user_getting_started/) | [`eclipse-theia/theia-ide`](https://github.com/eclipse-theia/theia-ide), MIT. The underlying [`eclipse-theia/theia`](https://github.com/eclipse-theia/theia) framework is a separate EPL-2.0/GPL-2.0-with-classpath-exception project. | macOS, Windows, Linux, web/Docker | Desktop process or browser-connected deployment; model traffic can go to configured cloud providers or local Ollama. | Active; current end-user docs and repository checked 2026-08-23. |
| `traecode` | [TraeCode product page](https://www.trae.ai/ide) | Proprietary. [`Trae-AI/TRAE`](https://github.com/Trae-AI/TRAE) is a feedback/issue repository, not the editor source. | macOS 12+, Windows 10/11, Linux `.deb`/`.rpm` | Local desktop editor and local tools with vendor/model services; SOLO is an IDE mode, while TraeWork is a separate product. | Active; current download page uses “TraeCode,” checked 2026-08-23. |
| `qoder-ide` | [Qoder product-family boundary](https://docs.qoder.com/product-series/what-is-qoder) | Proprietary; no complete canonical public product-source repository is documented. | macOS 12+, Windows 10+, Linux `.deb`/`.rpm` | Local desktop IDE, local tool execution, optional sandbox, and vendor/BYOK model services. Quest remains part of Qoder IDE; Cloud Agents is separate. | Active; IDE 1.25.1 released 2026-08-19. |
| `antigravity-ide` | [Antigravity IDE overview](https://antigravity.google/docs/ide/overview/) | Proprietary; no complete canonical public product-source repository is documented. | macOS, Windows x64/ARM64, Linux x64/ARM64 | Editor and agents run locally; model calls use Google services. Optional OS sandboxing is product- and platform-dependent. | Active, checked 2026-08-23. |
| `android-studio` | [Android Studio download and install](https://developer.android.com/studio/install) | Split-source distribution. The main Android plugin and much of the IDE are published in [AOSP's `platform/tools/adt/idea`](https://android.googlesource.com/platform/tools/adt/idea/), while the downloaded SDK, Google services, and Gemini integration have separate terms. Do not label the complete shipped product Apache-2.0. | macOS, Windows, Linux | Local IDE, build tools, emulator/device tools, and terminal; prompts and tool results go to the Gemini API or a configured provider. | Active; Android Studio Quail 3 / 2026.1.3 Patch 1 was current when checked. |
| `positron` | [Positron](https://positron.posit.co/) | [`posit-dev/positron`](https://github.com/posit-dev/positron), source-available under Elastic License 2.0. Do not label it open source. | macOS, Windows, Linux; Remote SSH and Dev Containers | Local IDE and tools communicate directly with the selected external provider, local Ollama, or optional Posit AI. | Active; Positron 2026.08.2-4 and Posit Assistant are current. |
| `onlook` | [Onlook documentation](https://docs.onlook.com/) | [`onlook-dev/onlook`](https://github.com/onlook-dev/onlook), Apache-2.0. The old [`onlook-dev/desktop`](https://github.com/onlook-dev/desktop) product is a separate historical desktop surface. | Web; hosted or locally run/self-hosted browser surface | Project code runs in a web container; the editor and AI index and modify that container. Hosted infrastructure uses external model and sandbox providers. | Active development; the current hosted next product is early access, so describe the open-source editor without promising hosted-product availability. |

## Existing-row claim ledger

| Product | Project tree/editor | Terminal | Agent mode | Background jobs | Inline prediction | Agent shell tools | MCP | Parallel sessions | Worktree isolation | Change review | Remote workspaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eclipse Theia IDE | BI | BI | BI | UNK | BI | BI | BI | UNK | UNK | BI | LIM |
| TraeCode | BI | BI | BI | LIM | BI | BI | BI | BI | UNK | LIM | UNK |
| Qoder IDE | BI | BI | BI | BI | BI | BI | BI | BI | UNK | BI | BI |
| Antigravity IDE | BI | BI | BI | BI | BI | BI | BI | BI | UNK | BI | UNK |
| Android Studio | BI | BI | BI | BI | BI | BI | BI | BI | UNK | BI | UNK |
| Positron | BI | BI | BI | UNK | BI | BI | BI | UNK | UNK | BI | BI |
| Onlook | BI | LIM | BI | LIM | UNK | LIM | BI | UNK | LIM | BI | BI |

### Eclipse Theia IDE evidence

The end-user [Theia IDE documentation](https://theia-ide.org/docs/user_getting_started/) explicitly distinguishes the IDE product from the Theia platform. [Theia AI](https://theia-ide.org/docs/user_ai/) documents opt-in cloud and local model providers, inline completion, conversation history, agents, skills, MCP, and tool permissions. [Theia Coder](https://theia-ide.org/docs/theia_coder/) browses and reads the workspace, proposes structured changes for review, and can autonomously write, test, diagnose, and iterate.

- `editor-background-jobs=UNK`: conversation history is not evidence of detached or asynchronous jobs.
- `editor-parallel-sessions=UNK`: multiple saved sessions are not evidence that multiple agents execute concurrently.
- `editor-worktree-isolation=UNK`: no cited end-user source establishes a worktree per task.
- `editor-remote-workspaces=LIM`: the product is distributable for browser/Docker use, but the cited material does not establish a VS Code-style remote extension-host feature inside the desktop client.

Evidence checked 2026-08-23.

### TraeCode evidence

The current [product page](https://www.trae.ai/ide) and [download center](https://www.trae.ai/download?auto=1&product_type=ide) call the desktop product TraeCode and document IDE/SOLO switching across macOS, Windows, and Linux. First-party product notes document the [integrated editor, terminal, browser, and autonomous SOLO workflow](https://www.trae.ai/blog/product_solo), [agent file/search/edit tools](https://www.trae.ai/blog/product_thought_0617), [Cue inline and next-edit behavior](https://www.trae.ai/blog/engineering_thought_0731), and current product capabilities including [SOLO, Cue, MCP, rules, memory, and skills](https://www.trae.ai/blog/trae_membership_0213).

- `editor-background-jobs=LIM`: SOLO can carry long multi-step work, but the evidence does not establish a detached job that survives client exit.
- `editor-parallel-sessions=BI`: first-party SOLO material documents multiple cooperating agents/subagents inside the IDE.
- `editor-change-review=LIM`: agent changes and artifacts are surfaced in the IDE, but the cited sources do not establish a complete accept/reject-per-hunk contract.
- `editor-worktree-isolation=UNK`: do not infer worktrees from parallel agents.
- `editor-remote-workspaces=UNK`: TraeWork is a separate SKU and must not be used to give TraeCode a remote-workspace claim.

Evidence checked 2026-08-23. Keep `traecode` as the ID; “TRAE IDE” may be a search alias only.

### Qoder IDE evidence

Qoder's [product-family page](https://docs.qoder.com/product-series/what-is-qoder) identifies Qoder IDE as the dedicated workspace containing Editor and Quest. The [Agent guide](https://docs.qoder.com/user-guide/chat/agent) documents project search, file edits, terminal tools, MCP, multi-file changes, review, and rollback. The [terminal and sandbox guide](https://docs.qoder.com/user-guide/quest/terminal-and-sandbox) documents macOS Seatbelt, Windows vendor sandboxing, Linux bubblewrap, and Full Access. Current [IDE release notes](https://docs.qoder.com/release-notes/desktop) document concurrent side tasks, scheduled tasks, Remote SSH improvements, code-review scope, and the rename from Qoder Desktop to Qoder IDE.

- `editor-background-jobs=BI`: Quest, scheduled tasks, and side tasks are part of Qoder IDE rather than the separate Cloud Agents SKU.
- `editor-parallel-sessions=BI`: the 2026-08-04 release documents concurrent side-task processing.
- `editor-worktree-isolation=UNK`: sandboxing and concurrent tasks do not establish Git worktree isolation.
- `editor-remote-workspaces=BI`: current IDE release notes explicitly document Remote SSH support.

Evidence checked 2026-08-23. Use the current exact display name `Qoder IDE`, not `Qoder Desktop`.

### Antigravity IDE evidence

The [Antigravity IDE overview](https://antigravity.google/docs/ide/overview/) defines an IDE workspace with an editor, terminal, browser agent, asynchronous local agents, parallel execution, autocomplete, and artifacts such as code diffs. [MCP documentation](https://antigravity.google/docs/mcp) establishes MCP support, while [IDE settings](https://antigravity.google/docs/ide/settings/) documents permissions, terminal-command policy, workspace access, and optional sandboxing. The [Agent side panel](https://antigravity.google/docs/ide/agent-side-panel) documents plans, artifacts, and review in the editor.

- `editor-background-jobs=BI`: the IDE documentation explicitly describes asynchronous local agents.
- `editor-parallel-sessions=BI`: the IDE documentation explicitly describes agents working in parallel.
- `editor-worktree-isolation=UNK`: worktree behavior documented for other Antigravity surfaces must not be transferred to this IDE SKU.
- `editor-remote-workspaces=UNK`: local parallel agents are not remote workspaces.

Evidence checked 2026-08-23. [Antigravity 2.0](https://antigravity.google/docs/overview) is an independent agent command center; do not merge its claims into this column.

### Android Studio evidence

The current [Gemini in Android Studio feature index](https://developer.android.com/studio/gemini/features) documents Agent Mode, code completion, next-edit prediction, MCP servers, and parallel conversations. The [Agent Mode guide](https://developer.android.com/studio/gemini/agent-mode) documents multi-file plans, tool invocation, permissions, change approval, concurrent tasks, builds, tests, and iterative fixes. The [new-project agent guide](https://developer.android.com/studio/gemini/create-a-new-project-with-ai) adds plan review and verification on an emulator or device.

- `editor-background-jobs=BI` and `editor-parallel-sessions=BI`: the current stable IDE can run multiple active agent conversations simultaneously and monitor them from Recent Chats.
- `editor-agent-shell-tools=BI`: Agent Mode builds and tests the project as part of its verification loop.
- `editor-worktree-isolation=UNK`: simultaneous conversations are not evidence of separate worktrees or checkouts.
- `editor-remote-workspaces=UNK`: Firebase Studio and other hosted Google products are separate SKUs.

Evidence checked 2026-08-23. Use `Android Studio` as the product column and describe “Gemini in Android Studio” as the integrated AI capability, not as a second IDE.

### Positron evidence

The [`posit-dev/positron`](https://github.com/posit-dev/positron) repository documents a Code OSS-based data-science IDE with macOS, Windows, and Linux builds. Current [Posit Assistant documentation in Positron](https://positron.posit.co/assistant.html) says that Posit Assistant ships as the default AI experience as of Positron 2026.07 and documents planning, agent tools, next-edit suggestions, multiple providers, and direct client-to-provider traffic. [Posit Assistant permissions](https://assistant.posit.co/docs/features/permissions/) documents per-tool allow/ask/deny rules, approval scopes, workspace trust, shell execution, and optional OS sandboxing. [Positron's navigation and guides](https://positron.posit.co/) document terminal, source control, Remote SSH, and Dev Containers.

- `editor-background-jobs=UNK` and `editor-parallel-sessions=UNK`: conversation history and branching do not establish concurrent execution.
- `editor-change-review=BI`: file edits and shell commands are approval-gated, and edit mode presents changes for approval.
- `editor-remote-workspaces=BI`: Remote SSH and Dev Containers are first-party Positron features.
- Source model is `source-available`, not `open-source`; Elastic License 2.0 is not an OSI-approved license.

Evidence checked 2026-08-23. Do not use the superseded names Positron Assistant or Databot as the current AI feature; current exact feature is Posit Assistant.

### Onlook evidence

The current [`onlook-dev/onlook` README](https://github.com/onlook-dev/onlook) calls Onlook an open-source visual-first code editor and documents a file/code editor, AI chat with code tools, CLI command execution, checkpoints, branching, queued messages, MCP, and hosted or local use. It also documents the execution boundary: code is loaded into a web container, served into an iframe, indexed, and modified by the editor and AI tools. [Onlook's UI overview](https://docs.onlook.com/getting-started/ui-overview) establishes the file browser, code panel, AI chat, visual canvas, and project selector.

- `editor-terminal=LIM` and `editor-agent-shell-tools=LIM`: command execution is documented, but a general interactive integrated terminal is not established by the cited current product docs.
- `editor-background-jobs=LIM`: queuing multiple messages is narrower than independent durable jobs.
- `editor-inline-prediction=UNK`: AI generation is not evidence of inline completion or next-edit prediction.
- `editor-parallel-sessions=UNK`: branching and queued prompts do not establish concurrent agent sessions.
- `editor-worktree-isolation=LIM`: Onlook branches experiments, but the source does not establish Git worktree isolation.
- `editor-change-review=BI`: checkpoints, side-by-side code/design preview, and restore are documented.
- `editor-remote-workspaces=BI`: the current editor runs against a browser-accessed web container and can be hosted or run locally.

Evidence checked 2026-08-23. Scope its specialization honestly: current source emphasizes React/Next.js and Tailwind, even though broader framework support is a stated direction.

## Rows to add

The current grid over-rewards a generic “agent mode” and hides decisive safety, model, and specialization differences. Add these rows:

1. `editor-model-access`: vendor models only, BYOK, OpenAI-compatible endpoint, local models, or self-hosted inference. This distinguishes Theia and Positron from vendor-only defaults.
2. `editor-agent-permissions`: per-action approval, per-tool policy, command allow/deny, project trust, or unrestricted execution. Antigravity, Qoder, Android Studio, Theia, and Positron all expose materially different controls.
3. `editor-agent-sandbox`: none documented, optional OS sandbox, container/VM sandbox, or remote execution. A web container and an opt-in local Seatbelt profile must not render as the same capability.
4. `editor-browser-tools`: no browser, preview only, embedded browser, visual annotation, or browser agent. This separates Antigravity, Qoder, TraeCode, and Onlook from text-only editors.
5. `editor-verification-loop`: can run tests/builds, inspect diagnostics, drive a device/emulator, or inspect a browser as part of an agent loop. Android Studio's emulator loop should not collapse into a generic shell-tools checkmark.
6. `editor-specialization`: general software, Android, data science, or visual web design. This is a factual scope row, not a quality ranking.
7. `editor-ai-feature-boundary`: built into the IDE codebase, bundled first-party extension, optional first-party extension, or third-party extension. This prevents Positron's bundled Posit Assistant and Android Studio's Gemini integration from being represented as equivalent to a bare editor plus an arbitrary plugin.
8. `editor-release-channel`: stable, preview/beta, early access, or source-build-only. This keeps Onlook's active-development status and mature desktop IDE releases legible.

### New-row candidate ledger

| Product | Model access | Permissions | Sandbox | Browser tools | Verification | Specialization | AI feature boundary | Release channel |
|---|---|---|---|---|---|---|---|---|
| Eclipse Theia IDE | Vendor APIs, OpenAI-compatible, Ollama/local | Tool permissions documented | UNK at IDE-product level | UNK | Tests and diagnostics through Theia Coder | General software | Built-in opt-in Theia AI | Active monthly product |
| TraeCode | Vendor-managed models; other boundary UNK | Tool approval details UNK | UNK | Embedded browser in SOLO | Agent tool loop; exact test contract LIM | General software | Built into TraeCode | Active desktop release |
| Qoder IDE | Vendor models and BYOK documented | Command confirmation, hooks, Full Access | Seatbelt / vendor Windows sandbox / bubblewrap; opt-out Full Access | Built-in browser and annotation | Goal loop and verification artifacts | General software | Built into Qoder IDE | Active stable desktop release |
| Antigravity IDE | Google-managed models | Tool and terminal policies | Optional Seatbelt/nsjail; platform dependent | Browser agent | Terminal/browser verification and artifacts | General software | Built into Antigravity IDE | Active desktop release |
| Android Studio | Gemini default plus configured supported providers | Tool permissions and review | UNK for the full IDE agent | Emulator/device tools rather than general browser | Builds, tests, diagnostics, emulator/device | Android | Integrated Google service in shipped IDE | Active stable desktop release |
| Positron | Anthropic, OpenAI, Google, Bedrock, Copilot, compatible endpoints, Ollama/local, Posit AI | Normal/Auto/YOLO/Restricted plus per-tool rules | Optional Seatbelt/bubblewrap; Windows command allowlist only | Optional web search, not an IDE browser agent | R/Python execution, terminal, tests/builds | Data science | Bundled first-party Posit Assistant | Active stable desktop release |
| Onlook | OpenRouter and external apply-model providers in current source | UNK | Managed web container | Live preview, visual DOM editor | Preview/checkpoints; test loop UNK | React/Next.js/Tailwind visual web design | Built into open-source editor | Active development; hosted next product early access |

## Rejected, renamed, and ambiguous candidates

| Candidate | Decision | Reason and primary evidence |
|---|---|---|
| Aide / CodeStory | Reject as inactive | [`codestoryai/aide`](https://github.com/codestoryai/aide) is owner-archived and says it is no longer maintained. The associated sidecar is archived too. Do not add an archived product to a current comparison. |
| PearAI | Defer; current status not established strongly enough | The [live site](https://www.trypear.ai/about) says to stay tuned for PearAI V2, while [`trypear/pearai-app`](https://github.com/trypear/pearai-app) has no current product release cadence and the public changelog's substantive releases are from 2025. One 2026 model-registry update in a submodule is not enough to establish an actively shipped IDE. Re-check when V2 ships. |
| Firebase Studio | Reject from the active grid; sunset appendix only | Google's [current Firebase Studio page](https://firebase.google.com/docs/studio) says new user signup and workspace creation are no longer supported. The [workspace guide](https://firebase.google.com/docs/studio/get-started-workspace) dates the cutoff to 2026-06-22. Existing users may continue temporarily, but this is not a current-acquisition product. |
| PaddleBoard | Defer as alpha/watchlist | [`paddleboarddev/paddleboard`](https://github.com/paddleboarddev/paddleboard) describes an alpha Zed fork that must be built from source and does not yet distribute binaries. Its documented sandbox/workspace ideas are interesting, but the current product maturity does not justify a main comparison column. |
| Flexpilot IDE | Reject as stale | [`flexpilot-ai/flexpilot-ide`](https://github.com/flexpilot-ai/flexpilot-ide) remains public but its current release and development evidence do not establish a maintained 2026 product. Re-open only after a current vendor release. |
| Dyad | Wrong category | [`dyad-sh/dyad`](https://github.com/dyad-sh/dyad) is current and substantially open, but its own product description is a local AI app builder whose primary object is a prompt-generated application and preview. Put it in a future AI app-builder category, not Code IDEs. |
| Replit Project Editor | Do not add as a separate Code IDE SKU | Replit's [Project Editor](https://docs.replit.com/learn/projects-and-artifacts/project-editor) is a surface inside the Replit Agent/app-building product, not an independently licensed or versioned IDE SKU. Adding it here would duplicate Replit Agent while mixing the prompt-first app-builder and code-editor boundaries. |
| `TRAE IDE` | Rename, do not add twice | The vendor's current [product page](https://www.trae.ai/ide) and [downloads](https://www.trae.ai/download?auto=1&product_type=ide) say TraeCode. Keep “TRAE IDE” as a search alias only. |
| `Qoder Desktop` | Rename, do not add twice | Qoder's [2026-08 release notes](https://docs.qoder.com/release-notes/desktop) explicitly rename the desktop application to Qoder IDE. |
| Antigravity 2.0 and Antigravity IDE extensions | Separate products | The [Antigravity 2.0 overview](https://antigravity.google/docs/overview) says it is independent of the IDE, and Google's [IDE-extension announcement](https://antigravity.google/blog/antigravity-ide-extensions) describes another surface. Their remote/worktree/host claims must not be copied into Antigravity IDE. |
| Positron Assistant / Databot | Superseded feature names | [Posit Assistant's product table](https://assistant.posit.co/docs/getting-started/) says both were superseded as of Positron 2026.07. The IDE remains Positron; its current AI feature is Posit Assistant. |

## Implementation guidance

1. Add Eclipse Theia IDE and Positron first so the open/source-available side is not visually buried beneath proprietary VS Code forks.
2. Add TraeCode, Qoder IDE, and Antigravity IDE using the exact names above and search aliases for their former or umbrella names.
3. Add Android Studio with a specialization label and a split-source description; do not join its metrics to a misleading unofficial GitHub mirror.
4. Add Onlook only after the specialization and release-channel rows exist, so a visual web editor in active development is not presented as a general-purpose desktop IDE.
5. Add canonical GitHub metric joins only for `eclipse-theia/theia-ide`, `posit-dev/positron`, and `onlook-dev/onlook`. Android Studio's canonical source is Gitiles, and the three proprietary IDEs have no complete public product repository.
6. Keep all `UNK` cells unknown until an exact-SKU first-party source closes them. Do not infer worktrees from parallelism, background durability from chat history, or remote workspaces from a vendor's separate cloud product.

This expansion adds meaningful breadth without weakening the category: every recommended product still makes a project/code workspace the primary human object, even when the IDE is specialized for Android, data science, or visual web work.

## IntelliJ IDEA addendum

IntelliJ IDEA is included as the exact flagship SKU, not as a vendor-level aggregate of the JetBrains IDE family. Since 2025.3, JetBrains ships a single unified IntelliJ IDEA distribution whose free core and separately unlocked Ultimate capabilities share one installer. The shipped distribution is therefore recorded as split-source: JetBrains maintains an open-source build from the `JetBrains/intellij-community` tree, but explicitly says the unified product also contains non-open-source functionality. Repository metrics are intentionally not joined because the public tree does not describe the complete shipped distribution.

Current first-party documentation establishes Windows, macOS, and Linux support; the project/editor surface; a bundled terminal; Git worktree management; Remote Development; and the integrated IDE MCP server. AI agent mode, completion, provider/model choice, agent permissions, shell/test execution, and agent change review are attributed specifically to the separately installed first-party AI Assistant plugin. JetBrains AI Assistant remains a distinct product in the Extensions tab, so those IntelliJ IDEA cells are marked `via-extension`, not built in. Background-job durability, concurrent agent sessions, an agent sandbox, and agent-facing browser tools remain unknown rather than inferred.

Evidence checked 2026-08-23: [unified IntelliJ IDEA](https://www.jetbrains.com/help/idea/intellij-idea-single-distribution.html), [installation platforms](https://www.jetbrains.com/help/idea/installation-guide.html), [terminal](https://www.jetbrains.com/help/idea/terminal-emulator.html), [Git worktrees](https://www.jetbrains.com/help/idea/use-git-worktrees.html), [Remote Development](https://www.jetbrains.com/help/idea/remote-development-starting-page.html), [integrated MCP server](https://www.jetbrains.com/help/idea/mcp-server.html), [AI Assistant boundary](https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html), and [AI Assistant agents](https://www.jetbrains.com/help/ai-assistant/agents.html).
