# 04. Comparison taxonomy and matrix blueprint

**Snapshot:** 2026-08-23

**Scope:** AI developer tools that create, edit, run, supervise, review, or remotely steer software-engineering work.
**Evidence base:** `docs/research/`, the Tortie source at `/Users/gdc/gmux`, the Orca source at `/Users/gdc/orca`, and the primary product sites and repositories linked below.

## The answer

The comparison launched from 7 category tabs and now has an eighth, not one universal feature table:

1. Code editors and IDEs
2. Agent workbenches, also called agent IDEs
3. Agent orchestrators
4. Coding-agent harnesses
5. IDE extensions
6. Cloud and background agents
7. Remote companions and relays
8. Agent Traces

Every product has one primary category, determined by the object around which its normal workflow is organized. It may also have cross-category tags. This is the only stable way to keep products such as VS Code, Cursor, Tortie, cmux, Orca, and Warp comparable without pretending their largest feature overlap is their identity.

The initial catalog should be deliberately deep rather than falsely complete: 50 separately versioned products or SKUs, each with an explicit evidence state. A discovery backlog follows it. Most launch rows already point at a primary source; any row marked `source needed` stays unpublished until its identity, current status, official URL, release source, and primary category have been established.

## 1. The primary-category rule

Ask one question first:

> What durable object does the product ask the user to create, return to, and eventually finish?

| Primary object | Primary category | The workflow usually begins with | The workflow usually ends with |
| --- | --- | --- | --- |
| A file, project, or editor window | Code editor or IDE | Open a repository or file | Edited code in the project |
| A named live session inside a project | Agent workbench | Open a project and start or resume a session | The session remains available for later work |
| A delegated task in an isolated workspace | Agent orchestrator | Create or import a task, branch, worktree, container, or sandbox | Review, merge, PR, archive, or choose a winner |
| One model conversation and its tool loop | Coding-agent harness | Run a CLI or start a conversation | Exit or resume that conversation |
| A host-IDE chat or agent panel | IDE extension | Install into an editor | Changes remain in the host workspace |
| A remotely executed job | Cloud or background agent | Send an issue or prompt to remote compute | Receive a patch, PR, or result |
| A session owned by another machine or product | Remote companion or relay | Pair, wrap, or connect to an existing session | Continue monitoring or steering it elsewhere |
| A durable provenance record of agent work | Agent Trace | Capture, import, or instrument a coding-agent session | Search, inspect, share, resume, or analyze the recorded work |

### Tie-breakers

Use these in order when a product spans several rows:

1. Use the default onboarding path, not the longest feature list.
2. Use the product's required object. Optional worktrees do not make a session workbench an orchestrator. A mandatory worktree-per-task flow usually does.
3. Classify separately versioned SKUs separately. Cursor IDE and Cursor CLI are 2 rows. GitHub Copilot's editor extension, CLI, and coding agent are 3 rows.
4. Prefer observed product behavior over the word `IDE`, `agent`, or `orchestrator` in marketing copy.
5. If 2 objects are equally central, pick the object that owns persistence and attach a `hybrid:*` tag.

### Important overlap cases

| Product | Primary category | Why | Cross-category tags |
| --- | --- | --- | --- |
| VS Code | Code editor or IDE | Files, projects, extension hosting, debugging, and SCM remain the spine, even with the Agents window and Agent Host. | `agent-sessions`, `extensions`, `local-agent`, `background-agent-client`, `remote-development` |
| Cursor IDE | Code editor or IDE | It opens and edits repositories as an editor distribution. Its agent and background-agent surfaces extend that object. | `agent-panel`, `background-agent-client`, `proprietary`, `vscode-derived` |
| Tortie | Agent workbench | A project contains durable named terminal sessions. Editing and Git are supporting furniture, and worktrees are optional rather than the ontology. | `terminal`, `editor`, `scm`, `session-durability`, `multi-project`, `remote-ssh`, `oss` |
| cmux | Agent workbench | Named workspaces, panes, and agent-aware terminal continuity are the main object. It is not a task-to-merge system. | `terminal`, `session-restore`, `browser`, `multi-project`, `oss` |
| Orca | Agent orchestrator | Its default promise is prompt or task to isolated worktrees, compare/review, then merge. Durable PTYs and editing are substantial but support that loop. | `agent-ide`, `terminal`, `editor`, `scm`, `worktrees`, `remote-ssh`, `mobile`, `oss` |
| Warp | Agent workbench | The persistent terminal workspace and sessions are the user's recurring object. Cloud agents are a secondary execution mode. | `terminal`, `cloud-agent`, `blocks`, `open-source` |
| Cline | IDE extension | The VS Code-hosted agent panel is the established primary surface. Its CLI is a cross-category surface until it is independently versioned and documented as a product. | `harness`, `cli`, `vscode`, `oss` |
| OpenCode | Coding-agent harness | The terminal agent loop is the primary product, even though a desktop client and editor integrations exist. | `desktop-client`, `extensions`, `multi-model`, `oss` |

## 2. Category definitions and boundaries

### 2.1 Code editors and IDEs

An editor or IDE owns the file-edit-debug-test loop. Agents may edit, plan, review, or run in the background, but removing the AI features would still leave a recognizable development environment.

Include:

- standalone desktop or browser development environments;
- editor distributions with first-party agent features;
- products with a real editor, project tree, language tooling, and debug/test surfaces.

Exclude:

- a Monaco editor embedded only to review an agent's diff;
- terminal products with file preview but no editor workflow;
- extensions that cannot run without a host editor.

### 2.2 Agent workbenches, or agent IDEs

An agent workbench owns named, recurring sessions across one or more projects. The differentiating question is not “can it run 5 agents?” but “what is still alive, named, placed, and recoverable when the window goes away?”

Include:

- project shells with durable or resumable agent terminals;
- cross-project attention and session-navigation products;
- agent-aware terminals when workspaces and sessions, rather than files or tasks, are the durable objects.

Exclude:

- a terminal emulator with no agent or session-management layer;
- task/worktree factories whose normal endpoint is review and merge;
- mobile viewers whose sessions are owned elsewhere.

### 2.3 Agent orchestrators

An orchestrator turns delegated work into isolated executions and brings results back through diff, review, merge, or PR. Worktrees are common but not required. Containers, VMs, cloud sandboxes, and shared workspaces are equivalent isolation choices at this level.

Include:

- task to workspace to agent to review products;
- prompt fan-out, compare-and-select, worker/coordinator, and queue-based products;
- TUI orchestrators when task/worktree lifecycle is primary.

Exclude:

- session managers where a worktree is merely an option;
- single-agent harnesses with subagents hidden inside one conversation;
- cloud agents that expose only a remote job and result, with no orchestration surface.

### 2.4 Coding-agent harnesses

A harness is the process that runs a model-tool loop against a codebase. It owns prompts, tool calls, permissions, context construction, session storage, and resume semantics. It may offer subagents, but it remains one launchable agent surface from Tortie's or Orca's perspective.

Include:

- terminal coding agents;
- autonomous local software-engineering agents that can be launched as one process;
- vendor and multi-model clients.

Exclude:

- the model or API by itself;
- a desktop orchestrator that launches several harnesses;
- a host-only editor extension, unless its CLI is an independently versioned SKU.

### 2.5 IDE extensions

An IDE extension depends on a host editor for project state, editing, terminal, and lifecycle. Compare the integration contract, not the host editor's inherited capabilities.

Include:

- agent panels, inline-edit assistants, and autocomplete extensions;
- extensions that can delegate background work but still require the host.

Exclude:

- the editor distribution itself;
- a separately installed CLI merely invoked by an extension;
- generic protocol clients with no end-user coding surface.

### 2.6 Cloud and background agents

A cloud or background agent executes away from the user's foreground machine and returns a durable result. The defining boundary is remote job ownership, not whether a local client can display it.

Include:

- issue-to-PR agents;
- vendor-hosted coding jobs and sandboxes;
- background agents submitted from an editor, CLI, web app, or Git provider.

Exclude:

- a local daemon that keeps a PTY alive;
- SSH execution on infrastructure the user controls;
- a relay that only forwards an existing local session.

### 2.7 Remote companions and relays

A companion or relay changes where the human can observe or steer a session without becoming the main owner of the code workspace.

Include:

- mobile and web command centers for existing local agents;
- browser terminals and encrypted session relays;
- permission and notification clients.

Exclude:

- full remote development environments;
- cloud agents that own execution;
- mobile clients that are inseparable features of a primary desktop product. Those remain tags on the parent product unless they have independent identity and releases.

### 2.8 Agent Traces

An Agent Trace product makes the durable record of coding-agent work the object users return to. It may capture local harness files, instrument provider traffic, bind sessions to Git history, or normalize records into a hosted timeline.

Include:

- local-first session archives and viewers;
- Git-native checkpoints that bind transcripts to commits;
- hosted trace-sharing and team-observability products;
- self-hosted agent telemetry systems whose primary object is the recorded run.

Exclude:

- observability embedded only inside a harness, IDE, or orchestrator;
- generic LLM application tracing without a documented coding-agent workflow;
- terminal recording that does not understand agent sessions or their structured events.

## 3. The initial 50-product catalog

`Primary source` is the source to establish identity and current status. A repository link does not itself imply open source. License is a separate field and must be read from the repository or distributed package.

### 3.1 Code editors and IDEs, 6

| Product | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| Visual Studio Code | [Agents window](https://code.visualstudio.com/docs/agents/agents-window) | [Code-OSS repository](https://github.com/microsoft/vscode); shipped Microsoft build has separate proprietary terms | `agent-sessions`, `extensions`, `background-agent-client`, `remote-development` |
| Cursor IDE | [Product](https://cursor.com/) | Proprietary shipped client | `agent-panel`, `background-agent-client`, `vscode-derived` |
| Windsurf | [Product](https://windsurf.com/) | Proprietary; Cognition terms must be checked separately from any public repository | `agent-panel`, `background-agent-client`, `vscode-derived` |
| Zed | [Product](https://zed.dev/) | [Repository](https://github.com/zed-industries/zed) | `agent-panel`, `terminal`, `scm`, `oss` |
| Kiro | [Product and docs](https://kiro.dev/) | Public issue repository is not product source; license remains to be established | `agent-panel`, `spec-driven`, `proprietary` |
| Void | [Repository](https://github.com/voideditor/void) | Archived in the local 2026-08-12 license survey; retain as historical | `agent-panel`, `vscode-derived`, `oss`, `historical` |

### 3.2 Agent workbenches, 7

| Product | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| Tortie | [Repository](https://github.com/gregce/tortie) | Local source at `/Users/gdc/gmux`; Apache-2.0 in the current README | `terminal`, `editor`, `scm`, `session-durability`, `multi-project`, `remote-ssh`, `oss` |
| cmux | [Product](https://cmux.com/) | [Repository](https://github.com/manaflow-ai/cmux) | `terminal`, `session-restore`, `browser`, `oss` |
| Mosaic Terminal | [Product](https://mosaicterminal.dev/) | Source status must be verified | `terminal`, `session-restore`, `attention`, `multi-project` |
| Airport | [Product](https://get-airport.com/) | Product claims open source; canonical repository must be established before automation | `terminal`, `attention`, `multi-project` |
| wmux | [Repository](https://github.com/openwong2kim/wmux) | Repository is the primary product source | `terminal`, `daemon-pty`, `worktrees`, `scm`, `oss` |
| Warp | [Product](https://www.warp.dev/) · [source](https://github.com/warpdotdev/warp) | Open-source client under AGPL-3.0, with MIT-licensed UI framework crates | `terminal`, `cloud-agent`, `blocks`, `hybrid:workbench-cloud`, `oss` |
| Wave Terminal | [Product](https://www.waveterm.dev/) | Canonical repository must be attached during ingestion | `terminal`, `workspace-blocks`, `editor-blocks`, `remote-ssh` |

### 3.3 Agent orchestrators, 11

| Product | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| Orca | [Product](https://onorca.dev/) | [Repository](https://github.com/stablyai/orca); local source at `/Users/gdc/orca` | `agent-ide`, `worktrees`, `terminal`, `editor`, `scm`, `remote-ssh`, `mobile`, `oss` |
| Conductor | [Docs](https://www.conductor.build/docs/) | Closed-source native macOS product | `native-macos`, `worktrees`, `review`, `multi-agent` |
| Superset | [Repository](https://github.com/superset-sh/superset) | Source available under Elastic License 2.0 in the local survey, not OSI open source | `worktrees`, `terminal`, `diff-review`, `source-available` |
| coder/mux | [Repository](https://github.com/coder/mux) | AGPL repository | `chat-control-plane`, `worktrees`, `ssh`, `review`, `oss` |
| Nimbalyst | [Repository](https://github.com/nimbalyst/nimbalyst) | MIT repository in the local survey | `agent-ide`, `worktrees`, `kanban`, `editor`, `visual-docs`, `oss` |
| T3 Code | [Product](https://t3.codes/) | Product claims open source; repository must be established | `chat-control-plane`, `branches`, `pr-flow` |
| Vibe Kanban | [Repository](https://github.com/BloopAI/vibe-kanban) | Sunsetting according to the current official repository; retain as a dated lifecycle record | `kanban`, `worktrees`, `approvals`, `oss`, `sunsetting` |
| Sculptor | [Repository](https://github.com/imbue-ai/sculptor) | MIT repository in the local survey | `containers`, `worktrees`, `ide-pairing`, `oss` |
| HumanLayer | [Product](https://humanlayer.com/) | Current rebuild is closed; [older repository](https://github.com/humanlayer/humanlayer) is deprecated and must not be treated as current product source | `worktrees`, `local-daemon`, `cloud-daemon`, `review` |
| claude-squad | [Repository](https://github.com/smtg-ai/claude-squad) | AGPL repository | `tui`, `tmux`, `worktrees`, `oss` |
| agent-deck | [Repository](https://github.com/asheshgoplani/agent-deck) | MIT repository in the local survey | `tui`, `tmux`, `worktrees`, `remote-ssh`, `oss` |

### 3.4 Coding-agent harnesses, 15

| Product or SKU | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| Claude Code | [Official docs](https://docs.anthropic.com/en/docs/claude-code/overview) | Proprietary distributed client in the local license survey | `cli`, `vendor-model`, `resume`, `subagents` |
| Codex CLI | [Repository](https://github.com/openai/codex) | Apache-2.0 in the local license survey | `cli`, `multi-agent-runtime`, `resume`, `oss` |
| Cursor CLI | [Official CLI page](https://cursor.com/cli) | Proprietary; distinct from Cursor IDE and unrelated to the similarly named npm package noted in local research | `cli`, `vendor-client`, `resume` |
| Gemini CLI | [Repository](https://github.com/google-gemini/gemini-cli) | Apache-2.0 in the local license survey | `cli`, `vendor-model`, `resume`, `oss` |
| Factory Droid CLI | [Official docs](https://docs.factory.ai/cli/getting-started/quickstart) | Proprietary distributed client | `cli`, `vendor-client`, `resume` |
| CodeWhale | [Repository](https://github.com/Hmbown/CodeWhale) | MIT; successor identity to `deepseek-tui` in the local survey | `cli`, `multi-model`, `resume`, `oss` |
| Antigravity CLI | [Official docs](https://antigravity.google/docs/cli-overview) | Proprietary prebuilt client in the local survey | `cli`, `vendor-client`, `resume` |
| Muse Code | Official public product or docs URL not established in the local evidence | Proprietary prebuilt client; publish as `source needed` until a first-party URL is attached | `cli`, `vendor-client`, `resume`, `source-needed` |
| Qwen Code | [Repository](https://github.com/QwenLM/qwen-code) | Apache-2.0 in the local survey | `cli`, `vendor-model`, `resume`, `oss` |
| Pi coding agent | [Repository](https://github.com/earendil-works/pi) | MIT; current organization-owned repository, with `badlogic/pi-mono` retained only as historical discovery context | `cli`, `multi-model`, `resume`, `extensions`, `oss` |
| OpenCode | [Repository](https://github.com/anomalyco/opencode) | MIT | `cli`, `multi-model`, `desktop-client`, `extensions`, `oss` |
| GitHub Copilot CLI | [Official docs](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Proprietary license; public repository metadata is not product source | `cli`, `vendor-service`, `resume` |
| Goose CLI | [Repository](https://github.com/aaif-goose/goose) | Current canonical repository; the column is explicitly scoped to the CLI surface | `cli`, `multi-model`, `extensions`, `oss` |
| Aider | [Repository](https://github.com/Aider-AI/aider) | Apache-2.0 in the local survey | `cli`, `multi-model`, `git-native`, `oss` |
| Grok Build | [Repository](https://github.com/xai-org/grok-build) | Apache-2.0, but the local survey records a closed contribution model | `cli`, `vendor-model`, `source-transparent`, `oss` |

### 3.5 IDE extensions, 4

| Product or SKU | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| GitHub Copilot for VS Code | [Official docs](https://code.visualstudio.com/docs/copilot/overview) | Treat repository source and the extension shipped in Microsoft VS Code as different license artifacts, as documented in local research | `vscode`, `autocomplete`, `agent-panel`, `background-agent-client` |
| Cline | [Official docs](https://docs.cline.bot/) | [Repository](https://github.com/cline/cline), Apache-2.0 in the local survey | `vscode`, `agent-panel`, `cli`, `oss` |
| Continue | [Official docs](https://docs.continue.dev/) | [Repository](https://github.com/continuedev/continue), Apache-2.0 in the local survey | `vscode`, `jetbrains`, `autocomplete`, `agent-panel`, `cli`, `oss` |
| Kilo Code | [Official docs](https://kilo.ai/docs/) | [Repository](https://github.com/Kilo-Org/kilocode), MIT in the local survey | `vscode`, `jetbrains`, `agent-panel`, `cli`, `oss` |

### 3.6 Cloud and background agents, 3

| Product or SKU | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| OpenAI Codex cloud | [Official product page](https://openai.com/codex/) | Hosted service; do not inherit Codex CLI's Apache-2.0 license | `issue-to-pr`, `sandbox`, `github`, `vendor-service` |
| GitHub Copilot coding agent | [Official docs](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) | Hosted service and separate SKU from the extension and CLI | `issue-to-pr`, `github`, `background`, `vendor-service` |
| Devin | [Official product](https://devin.ai/) | Proprietary hosted product; its CLI is a secondary control surface | `cloud-sandbox`, `issue-to-pr`, `cli-client`, `vendor-service` |

### 3.7 Remote companions and relays, 4

| Product | Primary source | Repository or source status | Cross-category tags |
| --- | --- | --- | --- |
| Happy | [Repository](https://github.com/slopus/happy) | MIT in the local survey | `mobile`, `web`, `e2e-encryption`, `claude`, `codex`, `oss` |
| VibeTunnel | [Repository](https://github.com/amantus-ai/vibetunnel) | MIT; local research records faded release momentum, which must be recomputed rather than frozen | `browser-terminal`, `mobile-web`, `server-owned-pty`, `oss` |
| Omnara | [Repository](https://github.com/omnara-ai/omnara) | Repository pivoted in local research; distinguish current agent API from the earlier command-center product | `web`, `mobile`, `durable-agent-api`, `pivoted`, `oss` |
| Shunt | [Product](https://shunt.app/) | Source status must be verified | `remote-tmux`, `permissions`, `mobile` |

## 4. Discovery backlog from the local corpus

These products were named in the source material but do not yet have enough normalized evidence for the launch catalog. They should not disappear. They should enter an ingestion queue with a reason.

| Candidate | Likely primary category | Why it is not in the initial 50 |
| --- | --- | --- |
| Hyperlane | Agent orchestrator or agent IDE | Primary object and durability claims need direct verification |
| StarkIDE | Agent workbench | PTY ownership and reboot semantics are not established |
| SlyCode | Agent workbench or orchestrator | Task-card versus durable-session boundary needs verification |
| dmux | Agent orchestrator | Canonical repository and current release source need attachment |
| ccmanager | Agent orchestrator | Strong local evidence, cut only to hold the initial catalog at 50 |
| Agent of Empires | Agent orchestrator | Current repo, version, and platform support need normalization |
| Dorchestrator | Agent orchestrator | Public claims exist; runtime and release evidence remain thin |
| strIDEterm | Agent orchestrator | Worker/Judge loop is clear, current release and source status are not |
| QuadCode | Agent orchestrator | Narrow four-agent comparison product; current status needs verification |
| ccmux | Agent workbench add-on | Tmux add-on rather than a standalone workbench; decide whether add-ons get their own tab |
| tmux-agent-sidebar | Agent workbench add-on | Same add-on boundary as ccmux |
| Ghostty, iTerm2, WezTerm | Architecture precedents, not AI products | Keep in an architecture-reference collection, not the product matrix |
| Crystal | Historical orchestrator | Deprecated in favor of Nimbalyst |
| Terragon OSS | Historical cloud agent | Company shutdown; useful architecture snapshot, not a live comparison column |
| OpenHands, SWE-agent, Plandex, Open Interpreter | Coding-agent harnesses | Add in the second harness expansion after launch rows are fully sourced |
| Amazon Q Developer CLI, Kimi Code CLI, Mistral Vibe, Rovo Dev, Amp, Auggie, Crush, Freebuff | Coding-agent harnesses | All appear in local inventories; add after SKU, license, and release-source normalization |
| Replit Agent, Jules, Cursor background agents, Claude Code on the web | Cloud and background agents | Important category expansion, but not deeply mapped in the current local research corpus |

## 5. Rows shared by every category

The user asked for operating systems first. Put these groups at the top of every tab in this order.

### 5.1 Availability and platform

1. macOS support, with Apple silicon and Intel separated
2. Windows native support
3. Windows through WSL only
4. Linux desktop support
5. Browser client
6. iOS companion or full client
7. Android companion or full client
8. Remote SSH target support
9. Dev container, container, or VM support
10. Installation channels
11. Account required to start
12. Free, paid, trial, or BYO-model requirement

An available release asset is evidence that an artifact exists, not proof that the platform is supported. Platform cells need either product documentation or a tested release manifest.

### 5.2 Product identity and openness

- Current product name and former names
- Vendor or maintainer
- Primary category and cross-category tags
- Current, beta, deprecated, archived, pivoted, or shut down
- Open source, source available, open core, or proprietary
- Exact license and license source
- Self-hostable
- Local-only mode available
- Telemetry default and opt-out
- Source repository and canonical repository ID

Never infer license from a GitHub repository, package metadata alone, or a badge. The local license research contains several counterexamples.

### 5.3 Freshness and project health

- Latest stable version
- Latest prerelease version
- Stable release date
- Days since stable release
- Releases in trailing 90 days
- Latest default-branch commit date
- Repository archived flag
- Source lines of code at the stable release
- Language breakdown
- Total human contributors at the stable release
- Human contributors in trailing 90 days
- Maintainer count, only when governance establishes it
- Open issues and pull requests, shown as context rather than quality scores
- Data fetched time, source, and collector status

Stars, forks, downloads, lines of code, contributors, commits, and release count are scale signals, not feature or quality scores. Do not combine them into a synthetic rank.

### 5.4 Security, execution, and data boundary

- Execution location: local process, local daemon, SSH host, container, VM, vendor cloud, or user cloud
- Code sent to vendor by default
- Model provider choice
- BYO API key or subscription reuse
- Permission modes and approval granularity
- Sandbox or isolation mode
- Secret/file exclusions
- Network controls
- Audit or session transcript
- Enterprise policy controls

## 6. Category-specific comparison axes

### 6.1 Code editors and IDEs

Compare the editor as an editor first, then its agent system.

| Axis group | Rows |
| --- | --- |
| Editor foundation | Native engine or VS Code fork; editor component; extension API compatibility; settings/keymap compatibility; LSP; tree-sitter; debugger; test UI; notebook support |
| Project model | Single folder; multi-root workspace; multi-repo; project tabs; multiple windows; remote workspace; dev containers |
| Core coding loop | File tree; search; symbol navigation; SCM stage/commit; diff; merge conflict UI; terminal; preview; task runner |
| AI interaction | Inline completion; inline edit; chat; plan mode; agent mode; multi-agent sessions; subagents; background jobs; image/browser context |
| Agent ownership | UI-owned conversation; independent agent host; local CLI process; vendor cloud job; third-party agent support |
| Context | Open files; indexed repository; terminal; diagnostics; debugger; docs/web; MCP; skills/rules/instructions |
| Review | Changes list; per-file diff; line comments; partial accept/reject; send review note back to agent; PR creation |
| Model and privacy | Vendor-only or multi-model; local models; BYO key; retention controls; code-training policy source |

Do not give an IDE credit for “terminal” or “Git” without recording depth. A terminal panel and a daemon-owned durable PTY are different values. A changes list and a complete stage/branch/history/PR workflow are different values.

### 6.2 Agent workbenches

This tab needs the most precise continuity vocabulary.

| Axis group | Rows |
| --- | --- |
| Session admission | Arbitrary shell process; arbitrary CLI agent; first-class provider registry; user-defined agent; install detection; launch confirmation |
| Live continuity | Session dies with UI; conversation can relaunch; PTY survives UI quit; PTY survives UI crash; live server process is independently owned |
| Reboot recovery | None; layout only; scrollback snapshot; shell recreation; provider-native conversation resume; original executable and argv retained; human confirms resume |
| Session identity | Name; project; cwd; command; provider; branch/worktree; stable position; groups; tombstones/history |
| Attention | Working/idle/needs-input/failed; evidence source; notifications; unread; cross-project jump; Dock/menu/mobile signal |
| Spatial model | Project tabs; session list; panes/splits; drag/move; saved layout; multi-window behavior |
| Workbench depth | Tree; search; editor; diff; SCM; history; PR/CI; previews; embedded browser |
| Remote | SSH sessions; remote files; remote Git; reconnect; port forwarding; remote attention parity; mobile companion |
| Machinery | tmux; daemon-owned PTY; UI-owned PTY; provider session files; scrollback persistence; private versus user's multiplexer |

Use this continuity scale in cells:

- `C0 UI-bound`: closing the UI kills the process.
- `C1 conversation resume`: the process dies, but the provider conversation can relaunch.
- `C2 app-independent live`: a daemon or multiplexer keeps the live PTY/process after UI exit.
- `C3 reboot reconstruction`: after OS reboot, the product restores layout, scrollback evidence, command identity, and provider resume target. No product should claim a normal user process remains live through reboot.

### 6.3 Agent orchestrators

| Axis group | Rows |
| --- | --- |
| Intake | Free prompt; issue; PR comment; GitHub/GitLab; Linear/Jira; local task; API/CLI |
| Unit of work | Task; workspace; branch; worktree; container; VM; cloud sandbox; shared workspace |
| Fan-out | One task per run; broadcast prompt; N parallel workers; compare winner; dependencies; coordinator/worker hierarchy |
| Isolation | None; git branch; worktree; container; VM; remote sandbox; secrets boundary; setup/teardown hooks |
| Agent compatibility | Arbitrary CLI; ACP; provider adapters; built-in harness; model routing; mixed agents in one run |
| Control | Pause; resume; interrupt; follow-up; approvals; gates; mailboxes/messages; scheduling; retries; budgets |
| Observability | Status source; logs; terminal; artifact view; token/cost usage; progress tree; notifications; mobile |
| Review | Aggregate diff; side-by-side candidates; line annotations; partial adoption; tests/checks; conflicts; send feedback to worker |
| Delivery | Commit; rebase; squash; PR; merge; archive; cleanup; rollback; branch protection awareness |
| Human handoff | Open in IDE; pairing/sync; editable worktree; local checkout; review-only mode |

Record isolation as an enum, not a yes/no `sandboxed` row. Worktree, container, VM, and vendor sandbox have different costs and guarantees.

### 6.4 Coding-agent harnesses

| Axis group | Rows |
| --- | --- |
| Runtime | CLI/TUI/GUI; implementation language; supported OS; install channel; headless and non-interactive modes |
| Model access | Vendor-bound; multi-provider; OpenAI-compatible; local models; model switching; account/subscription reuse; BYO key |
| Context | Working directory; repository map/index; Git state; open files; images; web; browser; MCP; skills; instruction files; hooks/plugins |
| Tools | Read/write/patch; shell; search; Git; browser; computer use; custom tools; MCP; language-server tools |
| Safety | Plan/read-only mode; per-tool approval; command policy; sandbox; network policy; secret handling; trusted folders |
| Session | Named sessions; session ID; storage format; resume command; fork; compact; export; share; transcript location |
| Agency | Planning; subagents; parallel tool calls; delegated tasks; background mode; scheduled/loop mode; max concurrency |
| Automation | JSON/stream output; stdin prompt; SDK; exit codes; hooks; CI use; container support |
| Review | Diff view; Git-aware edits; checkpoint/undo; commit; test loop; review annotations |
| Openness | Client source; license; contribution model; model/service dependency; self-hostable backend |

Do not combine “supports resume” into one cell. Store identity, explicit resume syntax, cwd dependence, captured launch flags, and cross-version compatibility are separate facts. The Tortie provider research shows why.

### 6.5 IDE extensions

| Axis group | Rows |
| --- | --- |
| Host reach | VS Code; VSCodium; Cursor; Windsurf; JetBrains; Visual Studio; Neovim; browser editor |
| Interaction | Completion; inline edit; chat; agent panel; terminal agent; background delegation; review |
| Host integration | Open files; selection; diagnostics; symbols; debugger; terminal; SCM; tests; commands; notebooks |
| Context and tools | Repository index; rules/instructions; MCP; skills; custom tools; web/browser; images |
| Models | Vendor-only; multi-provider; local; BYO key; team routing; model fallback |
| Changes | Patch preview; file diff; partial accept; checkpoints; undo; commit/PR; send review feedback |
| Lifecycle | Conversation survives reload; survives host close; background host; cloud handoff; resume and export |
| Enterprise | Policy controls; SSO; audit; telemetry; data retention; private index; air-gap options |

Only score capabilities the extension supplies. Do not inherit the host editor's Git, debugger, terminal, or OS support without marking the dependency.

### 6.6 Cloud and background agents

| Axis group | Rows |
| --- | --- |
| Intake | Prompt; issue assignment; PR comment; chat handoff; API; schedule; webhook |
| Hosting | Vendor cloud; customer VPC; self-hosted; ephemeral container/VM; region controls |
| Repository access | GitHub; GitLab; Bitbucket; Azure DevOps; local upload; monorepo support; private submodules |
| Environment | Setup script; devcontainer; secrets; network egress; persistent cache; custom image; GPU/browser |
| Autonomy | Plan approval; duration limit; retries; parallel tasks; subagents; human gates; follow-ups |
| Observability | Live logs; terminal; artifacts; screenshots; token/cost; notifications; mobile |
| Result | Patch; branch; commit; PR; tests; checks; deployment preview; provenance/attestation |
| Security | Credential scope; branch protection; data retention; training policy; audit; enterprise isolation |
| Economics | Included quota; per-task price; token pass-through; compute charge; concurrency limits |

### 6.7 Remote companions and relays

| Axis group | Rows |
| --- | --- |
| Client | Web; iOS; Android; desktop; terminal; notification-only |
| Session ownership | Wraps local CLI; connects to tmux; owns PTY server; provider API relay; cloud state service |
| Reachability | LAN; direct SSH; Tailscale; vendor relay; self-hosted relay; offline/reconnect behavior |
| Security | End-to-end encryption; host key verification; pairing; device revocation; secret storage; relay visibility |
| Interaction | Observe output; type; approve tools; send follow-up; voice; upload files/images; switch sessions |
| State | Session list; working/idle/needs-input; unread; notifications; scrollback; transcript; resume |
| Project context | Files; diff; Git; editor; PR; terminal only |
| Dependencies | Supported harnesses; required desktop host; required account; required daemon or tmux |

### 6.8 Agent Traces

| Axis group | Rows |
| --- | --- |
| Capture | Named harnesses and IDE clients; lifecycle hooks; local-log import; proxy or OpenTelemetry ingestion; multi-harness normalization |
| Storage | Local Markdown or database; Git refs; hosted namespace; operator database; retention and data boundary |
| Git provenance | Commit, branch, worktree, checkpoint, patch, and pull-request linkage |
| Captured record | Prompts; responses; thinking; tool calls and results; files; artifacts; diffs; subagents |
| Inspection | Search; timeline; replay; rewind; resume; cross-agent handoff; analytics |
| Interoperability | Markdown, JSON, JSONL, CSV, HTTP API, MCP, OpenTelemetry, CI ingestion |
| Privacy and teams | Secret redaction; explicit sync; visibility; sharing; organizations; team analytics |
| Deployment | Local-only; hosted service; self-hosted server; customer VPC or on-premises |

## 7. Cell semantics and evidence

Each feature cell is a small claim record, not an unqualified Boolean:

```json
{
  "value": "yes | no | partial | unknown | enum-or-number",
  "note": "short boundary or limitation",
  "sourceUrl": "https://first-party.example/...",
  "sourceType": "docs | repository | release | package | local-source | observed-test",
  "checkedAt": "2026-08-23T00:00:00Z",
  "appliesToVersion": "1.2.3",
  "confidence": "verified | inferred | stale"
}
```

Rules:

- `unknown` is the default. Missing evidence is not `no`.
- Marketing language may establish intended availability, but architecture and durability claims need docs, source, or a test.
- A repository README may establish product identity and advertised features. The license file establishes the license.
- Historical and pivoted products remain visible with a status banner and frozen evidence date.
- Version-specific facts display the version. Never silently carry a feature claim forward across releases.
- When docs and shipped behavior disagree, keep both claims, mark the conflict, and prefer an observed test for the scored value.

## 8. Keeping open-source data current

### 8.1 Canonical repository identity

Store the GitHub repository node ID, not only `owner/name`, because repositories move and redirect. Keep aliases and former names. A product may have more than one repository, but exactly one repository is marked `metricsRepository`; documentation and extension repositories are separate relations.

### 8.2 Release resolver

For each open-source product, resolve in this order:

1. Latest non-draft, non-prerelease GitHub release.
2. Latest stable tag matching the product's declared version pattern.
3. Official package registry version if the repository intentionally does not create releases.
4. Default-branch package version only as `unreleased`, never as the latest stable release.

Keep stable and prerelease tracks separately. Store the source archive commit SHA behind the release. Display when the latest package and GitHub release disagree.

### 8.3 Lines of code

Compute source lines against the exact source archive for the latest stable release, not the moving default branch:

1. Download or checkout the resolved release commit into an isolated temporary directory.
2. Run one pinned counter version, preferably `tokei` or `scc`.
3. Exclude dependencies, generated outputs, vendored code, build artifacts, lockfiles, snapshots, fixtures, media, and minified bundles through a versioned exclusion policy.
4. Store physical source lines, comments, blanks, language breakdown, counter version, exclusion-policy version, commit SHA, and completion time.
5. For a monorepo, measure the paths that ship the compared product and disclose them. Repository-wide LOC is a separate number.

LOC is not comparable when one product vendors Chromium, generated clients, Monaco, or model data and another does not. The UI must expose the counted paths and exclusions.

### 8.4 Contributors and activity

Collect:

- unique commit authors reachable at the stable release;
- unique human authors in the trailing 90 and 365 days on the default branch;
- bot authors separately;
- commits and merged pull requests in those windows;
- first and latest contribution date per author when available.

Do not call every historical author a maintainer. Maintainers require separate governance evidence such as repository permissions, CODEOWNERS, a maintainer file, or first-party documentation. GitHub's contributors endpoint can lag and may omit anonymous contributors, so store method and fetched time.

### 8.5 Refresh schedule and failure behavior

- Release, archive, redirect, and default-branch checks: every 6 hours.
- Stars, forks, issues, and pull requests: daily.
- Contributor windows and LOC: on a new stable release, plus a weekly repair pass.
- Closed-source pricing, OS support, and product status: weekly primary-doc probes plus manual review of diffs.
- A failed collector never erases the previous value. It marks it stale and records the failure.
- The UI shows `updated`, `stale`, `source unavailable`, or `manual` for every volatile group.

### 8.6 Reproducibility

Every metrics run should emit a manifest containing product ID, repository node ID, resolved version, tag, commit SHA, source archive checksum, tool versions, exclusions, start/end times, and raw API response cache keys. The matrix must be rebuildable from those manifests without trusting the rendered site.

## 9. Matrix presentation rules

- Products run across the top and feature rows down the left, as requested.
- The first 3 row groups remain Availability, Identity, and Freshness on every tab.
- Freeze the product-name header and the feature-name column.
- Let users pin up to 4 products; dim columns that are not pinned rather than hiding context.
- Use `Yes`, `No`, `Partial`, and `Unknown` text with icons. Color is secondary.
- Expand row groups. Do not ship hundreds of equally loud rows.
- Show the source, checked date, version, and note in a cell detail popover.
- Default sort is editorial, not star count. Offer name, latest release, activity, license, and selected-feature sorts.
- A “differences only” mode is useful after 2 or more products are pinned.
- Cross-category tags are filters and links, not duplicate canonical product records.
- Historical products are opt-in by default but never deleted from the evidence store.

## 10. What not to compare directly

- Do not put Claude Code beside Cursor IDE and ask whether each “has an editor.” Their primary objects differ.
- Do not compare a hosted service's license to its open-source CLI's license.
- Do not treat conversation resume, daemon-owned PTY survival, and reboot reconstruction as one `persistent sessions` row.
- Do not treat worktree, container, VM, and vendor sandbox as one `isolation` row.
- Do not equate model choice with privacy. A multi-model client can still proxy all code through its own service.
- Do not credit an extension with all capabilities of VS Code or JetBrains.
- Do not infer current health from stars, lifetime contributors, or a recent default-branch commit alone.
- Do not label inactive products dead without an archive flag, shutdown notice, deprecation notice, or a clearly disclosed inactivity rule.

## 11. Known limits of this inventory

- The local research is exceptionally deep on session managers, orchestrators, and CLI harnesses, and thinner on browser IDEs, enterprise IDE extensions, and cloud agents. The 50-product launch set reflects that evidence rather than pretending equal market coverage.
- Product status changes quickly. All status language in this document is a seed for the collector, not a permanent fact.
- Several product sites establish identity but do not expose a canonical repository or precise architecture. Those rows explicitly request further evidence.
- The Tortie and Orca comparisons are source-level studies, not runtime benchmarks.
- `Open source`, `source available`, `open core`, and `proprietary` are kept separate. A public repository does not answer the license question.
- Counts, release versions, and activity numbers belong in generated data, not this hand-authored taxonomy. This document defines how to obtain them.

## 12. Local research mapped into this taxonomy

| Local source | What it contributes |
| --- | --- |
| `docs/research/01-exemplars.md` | Product-site presentation precedents and evidence caveats |
| `/Users/gdc/gmux/docs/research/04-agent-managers.md` | Direct session-manager and orchestrator architecture, durability, status, and licensing comparisons |
| `/Users/gdc/gmux/docs/research/24-agent-workspace-product-inventory.md` | Broad market census and the recurring terminal-grid, tmux-wrapper, worktree-factory, chat-control-plane, IDE-sidebar, relay, and dashboard shapes |
| `/Users/gdc/gmux/docs/research/38-agent-licences.md` | Harness catalog, exact licensing distinctions, SKU traps, renamed projects, and historical status |
| `/Users/gdc/gmux/docs/research/47-agent-installs.md` | Install, detection, version-manager, health-check, and preflight axes |
| `/Users/gdc/gmux/docs/research/60-tortie-orca-comparison.md` | The decisive session-first versus task/worktree-first boundary and deeply mapped feature axes |
| `/Users/gdc/gmux/docs/research/63-provider-keep-map.md` and `11-agent-registry.md` | Harness session stores, resume behavior, transcript semantics, provider identity, and evidence traps |
| `/Users/gdc/gmux/README.md` and source | Tortie's current product claims and supported-agent surface |
| `/Users/gdc/orca/README.md` and source | Orca's current worktree/orchestration promise, platform reach, agent list, and broad workflow surface |
