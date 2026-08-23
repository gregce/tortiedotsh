# Agent IDE and orchestrator expansion

Checked 2026-08-23. This pass uses first-party product documentation, product repositories, and repository metadata. It does not infer a capability from a product's positioning, a roadmap item, or the mere presence of adjacent source code.

## Recommendation

Add 10 products: 2 Agent IDEs and 8 Agent Orchestrators. Eight of the 10 have inspectable open-source product repositories.

| Proposed ID | Exact product name | Primary category | Source and license | Documented client platforms | Recommended position |
|---|---|---|---|---|---|
| `poolside-desktop-assistant` | Poolside Desktop Assistant | Agent Orchestrators | Proprietary | macOS | After Orca and Conductor |
| `cate` | Cate | Agent IDEs | Open source, MIT | macOS, Windows, Linux | After Tortie |
| `cdesktop` | cdesktop | Agent IDEs | Open source, Apache-2.0 | Browser client; desktop installers are roadmap only | After Cate |
| `claude-code-desktop` | Claude Code on desktop | Agent Orchestrators | Proprietary | macOS, Windows | First orchestrator column |
| `bb` | bb | Agent Orchestrators | Open source, MIT | macOS desktop; Linux alpha; browser; Windows through WSL2, not native | After Orca and Conductor |
| `omnigent` | Omnigent | Agent Orchestrators | Open source, Apache-2.0 | macOS, Windows, Linux, browser | Immediately after bb |
| `agent-orchestrator` | Agent Orchestrator | Agent Orchestrators | Open source, Apache-2.0 | macOS, Windows, Linux | Immediately after Omnigent |
| `emdash` | Emdash | Agent Orchestrators | Open source, Apache-2.0 | macOS, Windows, Linux | After Agent Orchestrator |
| `kandev` | Kandev | Agent Orchestrators | Open source, AGPL-3.0 | macOS, Windows, Linux, browser/server | After Emdash |
| `paseo` | Paseo | Agent Orchestrators | Open source, AGPL-3.0 | macOS, Windows, Linux, browser, iOS, Android | After Kandev |

Keep Orca and Conductor near the left because they are already defining examples. Put Claude Code on desktop first because it is a mainstream reference surface and the user explicitly requested it. Poolside Desktop Assistant follows Orca and Conductor; `bb` and Omnigent follow Poolside rather than being buried at the end.

## Category rulings

The primary object remains the cleanest boundary:

- Agent IDEs organize recurring coding sessions inside a developer workspace and make editor, terminal, files, browser, and source control into the working environment.
- Agent Orchestrators organize delegated tasks or workers in isolated branches, worktrees, containers, or remote environments and supervise review and delivery.

This produces four important overlap rulings:

- Poolside explicitly calls Desktop Assistant “an interface for orchestrating agents.” Its documented spine is a fleet of parallel sessions across harnesses and repositories, with worktree isolation, cross-agent handoff, review, and merge decisions. The rich workspace furniture supports that orchestration task; it does not make the primary object an editor project. Put Desktop Assistant in Agent Orchestrators.
- Cate gained mission orchestration in 1.6, but remains an infinite-canvas IDE whose defining surfaces are editor, terminal, browser, file tree, source control, and spatial workspaces. Put it in Agent IDEs.
- Emdash calls itself an Agentic Development Environment, but each task provisions an isolated worktree, runs a delegated agent, proceeds through diff review, and can open a pull request. Put it in Agent Orchestrators.
- Paseo calls itself a development environment, but its current contract explicitly orchestrates provider-neutral workers, cross-provider handoffs, worktree-isolated workspaces, remote daemons, schedules, and subagents. Put it in Agent Orchestrators.

Do not duplicate a product across two tabs. Add a short overlap tag instead.

## Necessary new rows

The existing rows do not distinguish visual review or steering from basic session admission. Add only these four rows.

| Category | Proposed row ID | Label | Group | Positive threshold |
|---|---|---|---|---|
| Agent IDEs | `workbench-change-review` | Visual change review | Review | In-app diff review is a first-class session surface |
| Agent IDEs | `workbench-agent-handoff` | Cross-harness session handoff | Agent workflow | The same task or conversation can move to a different harness with context preserved |
| Agent Orchestrators | `orchestrator-live-steering` | Live steering and follow-ups | Supervision | An operator can redirect or add instructions to an active worker without restarting it |
| Agent Orchestrators | `orchestrator-agent-handoff` | Cross-harness task handoff | Agent compatibility | A task can transfer to another harness with an explicit context handoff, rather than merely starting an unrelated worker |

Do not add a compound “IDE surfaces” row to the orchestrator table. Terminal, editor, browser, and file-tree depth belongs in Agent IDEs. An orchestrator can link to or embed those surfaces without changing its primary object.

## Poolside orchestrator ruling

### Poolside Desktop Assistant

Exact identity: **Poolside Desktop Assistant**, not the `pool` CLI and not the Poolside Assistant VS Code or Visual Studio extensions. The desktop product was announced on 2026-07-28. It is proprietary, available on macOS, and runs local agent processes; local MLX models can run fully offline.

Primary sources: [announcement and product description](https://poolside.ai/blog/introducing-poolside-desktop-assistant), [Poolside documentation](https://docs.poolside.ai/). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Each task can own an isolated repository or worktree rather than sharing a checkout. |
| `orchestrator-parallel-workers` | Built in | Multiple sessions run concurrently across projects and repositories. |
| `orchestrator-multi-harness` | Built in | ACP-compatible harnesses run alongside `pool`; Claude Code, Codex, and Gemini are named examples. |
| `orchestrator-agent-handoff` | Built in | A conversation can move between ACP agents with its context intact. |
| `orchestrator-review-delivery` | Built in | Diffs, Git status, and merge decisions are first-class operator surfaces. |
| `orchestrator-worktrees` | Built in | Native worktrees isolate concurrent tasks and branches. |

Leave containers, remote execution, programmable control, and live steering unknown. ACP composability is not itself a control API.

## Agent IDE additions

### Cate

Exact identity: **Cate**, repository [`0-AI-UG/cate`](https://github.com/0-AI-UG/cate). It is MIT-licensed and has packaged macOS, Windows, and Linux builds. Execution is local with documented SSH and WSL remote workspace support. The stable product has a current beta channel; use lifecycle status `active`, not `beta`, because stable releases are also published.

Primary sources: [Cate README](https://github.com/0-AI-UG/cate), [Cate changelog](https://github.com/0-AI-UG/cate/blob/main/CHANGELOG.md). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `workbench-arbitrary-cli` | Built in | Agent-aware terminals recognize Claude Code, Codex, Cursor, Grok, OpenCode, Pi, and generic terminal agents. |
| `workbench-named-sessions` | Built in | Projects reopen as saved workspaces with restored agent terminals and conversations. |
| `workbench-pty-survives-ui` | Limited | Cate restores terminal scrollback and reattaches supported agents with their resume command; it does not claim arbitrary live process survival. |
| `workbench-cross-project-attention` | Built in | Agent terminals expose working, waiting, and finished state across workspaces, with notifications when input is needed. |
| `workbench-editor` | Built in | Monaco editor panels are a first-class canvas and dock surface. |
| `workbench-file-tree` | Built in | File explorer, project search, file badges, and multi-repository discovery are built in. |
| `workbench-scm` | Built in | Multi-repository source control, worktree state, Git actions, and side-by-side diffs are built in. |
| `workbench-splits` | Built in | Panels can float on a canvas, dock into tabs and splits, or detach into separate windows. |
| `workbench-attention-signals` | Built in | Panels report running, waiting, and finished state; OS and in-app notifications identify agents needing input. |
| `workbench-session-recovery` | Built in | Layouts, scrollback, browser state, workspaces, and supported agent resume commands restore after restart. |
| `workbench-browser` | Built in | Browser panels support tabs, devtools-style automation, screenshots, console output, and saved credentials. |
| `workbench-remote-host` | Built in | SSH and WSL workspaces run terminals, Git, search, and agents remotely while keeping editor/browser/canvas local. |
| `workbench-programmable-control` | Built in | The `cate` CLI controls scoped workspace, terminal, file, panel, and browser operations. |
| `workbench-worktrees` | Built in | Parallel Work creates and manages first-class Git worktrees and branches. |
| `workbench-change-review` | Built in | Side-by-side diffs, mission result review, and worktree apply/keep/discard controls are documented. |

Leave cross-harness session handoff unknown. Cate can create and message workers across harnesses, but the documentation does not establish transfer of one provider-native conversation to another harness.

### cdesktop

Exact identity: **cdesktop**, repository [`cdesktop-ai/cdesktop`](https://github.com/cdesktop-ai/cdesktop). It is Apache-2.0 and explicitly beta. The shipped product is currently a local web application started with `npx cdesktop`; macOS, Windows, and Linux Tauri installers are roadmap items and must not be shown as available desktop platforms. Execution is a local server plus child agent processes.

Primary source: [cdesktop README](https://github.com/cdesktop-ai/cdesktop). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `workbench-arbitrary-cli` | Built in | The current adapter set runs Claude Code, Codex, Gemini CLI, OpenCode, and Hermes; custom providers affect models, not arbitrary harness commands. |
| `workbench-named-sessions` | Built in | Sessions have separate transcripts and can be switched without reload. |
| `workbench-editor` | Limited | The current product exposes plan and file panes and can edit within the app, but the README describes the full project file tree as roadmap work. |
| `workbench-file-tree` | Limited | Files for the session working directory are available; a complete project tree is explicitly on the roadmap. |
| `workbench-scm` | Built in | Per-session worktrees, diff review, pull-request creation, and merge actions are built in. |
| `workbench-splits` | Built in | Up to four session cells can run side by side. |
| `workbench-session-recovery` | Built in | Code, transcripts, sessions, and worktrees are persisted on disk. |
| `workbench-browser` | Built in | App preview includes a browser, devtools, inspect mode, and device emulation. |
| `workbench-remote-host` | Limited | Remote SSH configuration opens an external VS Code Remote-SSH target; cdesktop does not document owning remote execution. |
| `workbench-worktrees` | Built in | A project can opt into an isolated branch and worktree per session. |
| `workbench-change-review` | Built in | Diff review supports inline comments sent directly to the agent. |

Leave PTY survival, cross-project attention, attention signals, programmable control, and cross-harness handoff unknown. Agent teams can mix providers, but that does not prove context-preserving handoff of a running session.

## Agent Orchestrator additions

### Claude Code on desktop

Exact identity: **Claude Code on desktop**, the **Code tab inside Claude Desktop**. Do not call the column “Claude Cowork” and do not merge the Claude Code CLI into it. Cowork is a sibling mode for general knowledge work. Dispatch lives in Cowork and can route a software task into a Code session, which is relevant context but not a second coding-orchestrator SKU.

The GUI is proprietary and supports macOS and Windows. It can execute locally, on an SSH host, or in an Anthropic-hosted cloud environment. Linux is explicitly not supported by the Code tab even though other Claude surfaces support Linux.

Primary sources: [Claude Code on desktop](https://code.claude.com/docs/en/desktop), [Claude Code worktrees](https://code.claude.com/docs/en/worktrees), [Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Every parallel Git session receives an isolated project copy. |
| `orchestrator-parallel-workers` | Built in | Multiple independent Code sessions run in parallel from one sidebar. |
| `orchestrator-multi-harness` | Not available | Desktop runs the Claude Code engine. The docs explicitly reserve agent teams for CLI/SDK and do not expose other coding harnesses in the Code tab. |
| `orchestrator-review-delivery` | Built in | Visual diffs, inline comments, GitHub PR monitoring, checks, auto-fix, auto-merge, and auto-archive are documented. |
| `orchestrator-worktrees` | Built in | Desktop automatically creates a worktree for each parallel Git session. |
| `orchestrator-inline-review` | Built in | Diff review accepts inline comments within the session. |
| `orchestrator-pr-lifecycle` | Built in | PR monitoring includes checks, fixes, merge, and session archival. |
| `orchestrator-remote-execution` | Built in | Sessions can run locally, over SSH, or in Anthropic's cloud and remain steerable. |
| `orchestrator-attention-signals` | Built in | Sidebar filters expose session status; Dispatch sessions can notify a paired phone when finished or awaiting approval. |
| `orchestrator-live-steering` | Built in | Local and remote sessions can be opened while running and redirected with follow-up instructions. |

Leave containers/VMs, task board, programmable control, and cross-harness handoff unknown. A managed cloud environment is not sufficient evidence of the container-or-VM implementation detail.

### bb

Exact identity: **bb**, repository [`get-bb/bb`](https://github.com/get-bb/bb). This resolves the user's “BB Editor” reference. The project is MIT-licensed and explicitly in active development. It ships an Apple-silicon macOS desktop app, an alpha Linux AppImage, a local browser UI through `npx`, and WSL2 support on Windows; native Windows is not supported. Execution is a local server/daemon with optional enrolled execution machines.

Primary sources: [bb README](https://github.com/get-bb/bb), [worktree documentation](https://github.com/get-bb/bb/blob/main/docs/worktrees.md), [configuration, plugins, automation, splits, and multi-machine documentation](https://github.com/get-bb/bb/blob/main/docs/configuration.md). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Threads can run in disposable managed worktrees with a separate branch and setup script. |
| `orchestrator-parallel-workers` | Built in | Multiple live threads run in up to eight visible panes. |
| `orchestrator-multi-harness` | Built in | bb uses authenticated provider CLIs and supports multiple harnesses through one thread system. |
| `orchestrator-review-delivery` | Limited | Quick-open and a built-in diff surface support review; documented worktree guidance leaves commit, push, and PR creation to the agent or shell. |
| `orchestrator-worktrees` | Built in | Managed worktrees are first-class thread environments and are cleaned up with their branches. |
| `orchestrator-remote-execution` | Built in | Projects can enroll multiple machines and dispatch a thread to a selected execution host. |
| `orchestrator-attention-signals` | Built in | Thread state is streamed live across desktop, web, CLI, and HTTP clients. |
| `orchestrator-programmable` | Built in | Desktop, web, CLI, HTTP API, Node SDK, plugins, and workflows drive the same server. |
| `orchestrator-live-steering` | Built in | A thread can be followed live and steered at any point. |
| `orchestrator-agent-handoff` | Built in | The same thread can be handed to another agent rather than copied into an unrelated task. |

Leave containers, task board, inline line-comment review, and PR lifecycle unknown. Bundled GitHub and Tasks plugins do not by themselves prove those exact end-to-end rows.

### Omnigent

Exact identity: **Omnigent**, repository [`omnigent-ai/omnigent`](https://github.com/omnigent-ai/omnigent). The installed command has two aliases, `omnigent` and `omni`. This is almost certainly the product the user called “Omniagent.” It is Apache-2.0 and runs on macOS and Linux, with a native but degraded Windows mode, a browser UI, and a macOS wrapper app. Execution can be local, local-daemon, OS-sandboxed, or provisioned in user-selected cloud/Kubernetes sandboxes.

Primary source: [Omnigent README](https://github.com/omnigent-ai/omnigent). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Agent terminals run inside OS sandboxes, and delegated coding workers can use separate Git worktrees. |
| `orchestrator-parallel-workers` | Built in | The Polly example delegates parallel coding subagents and collects their results. |
| `orchestrator-multi-harness` | Built in | Claude Code, Codex, Cursor, OpenCode, Hermes, Pi, SDK harnesses, and custom YAML agents share one orchestration layer. |
| `orchestrator-review-delivery` | Built in | Polly routes every diff to a reviewer from a different vendor before the operator merges. |
| `orchestrator-worktrees` | Built in | Polly delegates coding work into parallel Git worktrees. |
| `orchestrator-containers` | Built in | Disposable Modal, Daytona, Blaxel, E2B, Kubernetes, and other sandbox backends are documented. |
| `orchestrator-remote-execution` | Built in | Managed hosts and cloud sandboxes run sessions independently of the local laptop. |
| `orchestrator-attention-signals` | Built in | Desktop notifications, configurable sound, and a dock badge surface session attention. |
| `orchestrator-programmable` | Built in | CLI, local server, web UI, custom YAML agents, and API-backed hosts are supported control surfaces. |
| `orchestrator-live-steering` | Built in | The same session can be continued from terminal, browser, phone, or shared co-driving clients. |

Leave task board, inline line-comment review, PR lifecycle, and context-preserving cross-harness handoff unknown. “Swap or combine harnesses” and multi-agent review do not alone prove a handoff of one live provider session.

### Agent Orchestrator

Exact identity: **Agent Orchestrator**, repository [`Untrivial-ai/agent-orchestrator`](https://github.com/Untrivial-ai/agent-orchestrator). It is Apache-2.0 with packaged macOS, Windows, and Linux desktop apps. The desktop owns a local daemon and local worker processes. Do not use the frozen `@aoagents/ao` npm package as the current release identity.

Primary source: [Agent Orchestrator README](https://github.com/Untrivial-ai/agent-orchestrator). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | A Git-backed worker gets its own branch and worktree; scratch workers get managed branchless directories. |
| `orchestrator-parallel-workers` | Built in | The project orchestrator plans and delegates multiple workers across one project. |
| `orchestrator-multi-harness` | Built in | The current supported-agent list names 26 harnesses, including Claude Code, Codex, Cursor, Copilot, Amp, and Prime Agent. |
| `orchestrator-review-delivery` | Built in | Task, terminal, changed files, browser, PR, CI, review, and merge-conflict state remain attached to one worker. |
| `orchestrator-worktrees` | Built in | Every Git worker receives a dedicated worktree and branch. |
| `orchestrator-task-board` | Built in | A live Kanban derives Working, Needs you, In review, and Ready to merge from session and delivery facts. |
| `orchestrator-pr-lifecycle` | Built in | Pull requests, checks, mergeability, reviewer state, requested changes, and merge readiness are tracked. |
| `orchestrator-attention-signals` | Built in | Kanban state explicitly surfaces blocked input, failures, review changes, and lost signals. |
| `orchestrator-programmable` | Limited | A current local daemon and documented CLI route map exist, but the legacy public npm CLI is frozen and no broad stable automation contract is claimed here. |
| `orchestrator-live-steering` | Built in | Operators can reopen a worker, continue its conversation, attach to its terminal, and return CI/review feedback to the same agent. |

Leave containers, remote execution, inline line-comment review, and cross-harness handoff unknown. Isolated browser profiles are not execution containers.

### Emdash

Exact identity: **Emdash**, canonical repository [`generalaction/emdash`](https://github.com/generalaction/emdash), not the earlier `phattranky/emdash` owner path. It is Apache-2.0 with packaged macOS, Windows, and Linux apps. It runs local agents and can use SSH or provisioned remote workspaces.

Primary sources: [Emdash documentation](https://emdash.com/docs), [Emdash repository](https://github.com/generalaction/emdash). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Add Task creates a separate worktree for each task. |
| `orchestrator-parallel-workers` | Built in | Multiple agents run simultaneously, each in its own worktree. |
| `orchestrator-multi-harness` | Built in | The provider catalog documents 34 CLI agents, including GitHub Copilot and Amp. |
| `orchestrator-review-delivery` | Built in | The operator reviews task diffs, iterates, monitors CI, and can open a pull request. |
| `orchestrator-worktrees` | Built in | Worktrees are the default task isolation unit. |
| `orchestrator-pr-lifecycle` | Built in | A completed task can open a PR inside Emdash and monitor GitHub Actions checks. |
| `orchestrator-remote-execution` | Built in | Agents can run on SSH machines or provisioned remote workspaces. |
| `orchestrator-attention-signals` | Built in | Task state, reviewable automation history, and durable tmux-backed local/remote sessions are visible in the app. |

Leave containers, task board, inline line-comment feedback, programmable control, live steering, and cross-harness handoff unknown. A side-by-side diff viewer is not enough to claim line-comment feedback.

### Kandev

Exact identity: **Kandev**, repository [`kdlbs/kandev`](https://github.com/kdlbs/kandev). The repository declares AGPL-3.0. It ships a web workbench, CLI, desktop app, container/service deployment, and documented Windows support. Execution backends include local, worktree, Docker, SSH, and Sprites ephemeral cloud.

Primary sources: [Kandev product page](https://kandev.ai/), [Kandev documentation](https://kandev.ai/docs/), [feature contract](https://github.com/kdlbs/kandev/blob/main/docs/features.md). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Worktree, Docker, SSH, and ephemeral cloud executors provide task-scoped environments. |
| `orchestrator-parallel-workers` | Built in | Parallel sessions, subtasks, dependencies, multiple repositories, and additional branches are supported. |
| `orchestrator-multi-harness` | Built in | ACP and terminal-native CLIs include Claude Code, Codex, Copilot, Gemini, OpenCode, Amp, Cursor, and others. |
| `orchestrator-review-delivery` | Built in | The supported workflow runs from plan and approval through session supervision, changes, preview, pull requests, and walkthrough. |
| `orchestrator-worktrees` | Built in | Worktree is a documented isolated-branch executor. |
| `orchestrator-containers` | Built in | Docker is a documented execution boundary. |
| `orchestrator-task-board` | Built in | The regular Kanban workbench is explicitly inside the supported production boundary. |
| `orchestrator-pr-lifecycle` | Built in | Pull requests and reviews are first-class task/session surfaces. |
| `orchestrator-remote-execution` | Built in | SSH, Sprites, service, Docker, and Kubernetes deployment paths are documented. |
| `orchestrator-attention-signals` | Built in | Developer tools include notifications across parallel named sessions. |
| `orchestrator-programmable` | Built in | Kandev MCP, task MCP, WebSocket API, CLI, scheduled/event work, and plugin APIs are supported. |
| `orchestrator-live-steering` | Built in | Targeted messages and cross-task prompts can redirect active sessions and subtasks. |
| `orchestrator-agent-handoff` | Built in | Kandev MCP explicitly supports sharing plans, attaching branches, and handing work off. |

Leave inline line-comment feedback unknown until the review documentation establishes comments bound to exact diff lines.

### Paseo

Exact identity: **Paseo**, repository [`getpaseo/paseo`](https://github.com/getpaseo/paseo). The README declares AGPL-3.0. Paseo has desktop, mobile, web, and CLI clients connected to a self-hosted daemon; agents can run locally, on a remote daemon, or in the documented Docker image.

Primary sources: [Paseo README](https://github.com/getpaseo/paseo), [orchestration documentation](https://github.com/getpaseo/paseo/blob/main/public-docs/orchestration.md), [providers](https://github.com/getpaseo/paseo/blob/main/public-docs/providers.md), [changelog](https://github.com/getpaseo/paseo/blob/main/CHANGELOG.md). Checked 2026-08-23.

| Row ID | State | Implementation-ready note |
|---|---|---|
| `orchestrator-isolated-workspaces` | Built in | Agents can create worktree-isolated workspaces with a separate branch. |
| `orchestrator-parallel-workers` | Built in | Multiple providers run in parallel on self-hosted machines; a parent can spawn cross-provider subagents. |
| `orchestrator-multi-harness` | Built in | Native Claude Code, Codex, Copilot, OpenCode, Pi, and OMP support is augmented by a 25-plus-agent ACP catalog. |
| `orchestrator-review-delivery` | Built in | File editor, Changes view, side-by-side diffs, inline review comments, commit history, and multi-forge pull/merge requests are documented. |
| `orchestrator-worktrees` | Built in | Worktree creation is available through UI, CLI, MCP, and agent orchestration. |
| `orchestrator-containers` | Limited | An official Docker daemon/web deployment is documented, but the sources do not establish a separate container or VM for each delegated task. |
| `orchestrator-inline-review` | Built in | Inline review comments can be attached to diff lines and returned to the agent. |
| `orchestrator-pr-lifecycle` | Built in | GitHub, GitLab, Gitea, Forgejo, and Codeberg PR/MR workflows plus push/pull/commit history are supported. |
| `orchestrator-remote-execution` | Built in | CLI, web, desktop, and mobile clients can drive a daemon on another workstation or server. |
| `orchestrator-attention-signals` | Built in | Agent states, finish notifications, permission prompts, and subagent results surface across desktop and mobile. |
| `orchestrator-programmable` | Built in | Everything in the app is exposed through CLI, TypeScript SDK, WebSocket API, and MCP. |
| `orchestrator-live-steering` | Built in | `paseo send` and the clients send follow-up instructions to a running agent. |
| `orchestrator-agent-handoff` | Built in | The documented `/paseo-handoff` workflow transfers work between providers, including Claude planning to Codex implementation. |

Do not describe the Docker image as proving a separate container per delegated task. The supported claim is that the control plane and agents can execute in a containerized daemon.

## Second pass on current Agent IDE columns

These are the easy, primary-source-backed closures that remain after the earlier research pack.

| Product | Row ID | State | Implementation-ready note | Primary source | Checked |
|---|---|---|---|---|---|
| cmux | `workbench-file-tree` | Built in | The Finder-style Files sidebar browses the workspace tree, previews common file types, and follows the remote root in SSH workspaces. This does not establish a built-in code editor. | [cmux Finder](https://cmux.com/blog/cmux-finder) and [changelog](https://cmux.com/docs/changelog) | 2026-08-23 |
| cmux | `workbench-change-review` | Built in | The diff viewer supports comments bound to changed lines, persists comment sets per repository, and can attach the structured feedback to an agent's terminal input. | [cmux changelog, 0.64.20](https://cmux.com/docs/changelog) | 2026-08-23 |
| Warp | `workbench-named-sessions` | Built in | Agent conversations are tied to sessions, titled, searchable, restorable, and continuable. | [Interacting with agents](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | 2026-08-23 |
| Warp | `workbench-cross-project-attention` | Built in | The management view tracks all active local conversations and cloud runs while multiple Oz agents run simultaneously. | [Agents in Warp](https://docs.warp.dev/agent-platform/getting-started/agents-in-warp) | 2026-08-23 |
| Warp | `workbench-attention-signals` | Built in | Agents notify when they need permission, diff approval, or other input. | [Agents in Warp](https://docs.warp.dev/agent-platform/getting-started/agents-in-warp) | 2026-08-23 |
| Warp | `workbench-remote-host` | Built in | Agent conversations can execute commands and edit through terminal fallbacks in Warpified SSH sessions. | [SSH feature support](https://docs.warp.dev/code/ssh-feature-support) | 2026-08-23 |
| Warp | `workbench-programmable-control` | Built in | Oz CLI launches and manages agents from terminals, scripts, automated systems, and remote machines. | [Oz CLI](https://docs.warp.dev/reference/cli) | 2026-08-23 |
| Wave Terminal | `source-model` | Fact: Open source | The product repository and package declare Apache-2.0. | [Wave repository](https://github.com/wavetermdev/waveterm) | 2026-08-23 |
| Wave Terminal | `workbench-arbitrary-cli` | Built in | Wave is a general terminal with workspaces, tabs, blocks, and a command system; arbitrary installed CLI agents run as ordinary terminal processes. | [Wave repository](https://github.com/wavetermdev/waveterm) | 2026-08-23 |
| Wave Terminal | `workbench-pty-survives-ui` | Limited | Durable SSH terminal sessions survive network changes and Wave restarts; the source does not claim equivalent survival for arbitrary local processes. | [Wave repository](https://github.com/wavetermdev/waveterm) | 2026-08-23 |

No safe new claim was found for Tortie's browser, programmable control, or worktrees; cmux's full editor; wmux's general editor; or Wave's cross-project attention, full SCM, and worktree workflow. Mosaic Terminal and Airport still lack sufficiently precise first-party documentation and should remain hidden evidence-backlog columns rather than being filled from secondary descriptions.

## Identity and ambiguity decisions

### “BB Editor”

Use **bb**. [`get-bb/bb`](https://github.com/get-bb/bb) describes itself as “the agent IDE that builds itself,” uses threads, managed worktrees, provider CLIs, plugins, a desktop/web UI, CLI, HTTP API, and SDK. Do not confuse it with Bare Bones BBEdit or unrelated packages named `bb-editor`.

### “Omniagent”

Use **Omnigent**. Its own README says the commands `omnigent` and `omni` are aliases and describes a meta-harness over Claude Code, Codex, Cursor, OpenCode, Hermes, Pi, and custom agents. The generic phrase “OmniAgent” resolves to many unrelated products: an audio-video research agent, personal browser automation tools, generic multi-agent frameworks, and new low-adoption coding runtimes. None matches the user's worktree-meta-harness description as closely as Omnigent.

### Claude GUI, Cowork, and Claude Code

Use one column named **Claude Code on desktop**. The product is the Code tab in Claude Desktop. Explain in its note that:

- Cowork is a sibling task mode in the same Claude shell and brings Claude Code's agentic architecture to general knowledge work.
- Dispatch lives in Cowork and can create a Code session for software work.
- Claude Code CLI is already a separate harness column and should remain separate.

This preserves an exact SKU boundary while satisfying the request to show how Claude Desktop, Cowork, and Claude Code relate.

### Poolside

Use **Poolside Desktop Assistant** in Agent Orchestrators and keep the separate [`poolsideai/pool`](https://github.com/poolsideai/pool) runtime for the harness pass. The desktop app supervises multiple sessions, worktrees, harnesses, handoffs, and merge decisions; `pool` is the coding-agent harness; the VS Code and Visual Studio packages are extensions. They should not collapse into one column.

## Considered but not promoted in this pass

- **Opcode** (`winfunc/opcode`, formerly Claudia) is an AGPL Claude Code GUI, but its repository has not been updated since 2025-10-16 and its own README still says release executables will be published soon. Keep it on a historical/watch list rather than displacing active products.
- **Crystal** (`stravu/crystal`) is an MIT Claude Code/Codex worktree GUI with named sessions and a Monaco editor, but its repository has not been updated since 2026-02-26. Recheck before adding.
- **Automaker** is a substantial agent studio, but GitHub does not identify its current license and its repository has not been updated since 2026-05-22. Resolve the exact license before treating it as an open-source addition.
- **Rookery** has unusually detailed first-party documentation for a local Apache-2.0 fleet controller and was updated on 2026-08-19, but the repository had no public stars, forks, or release history at check time. It is a valid watch-list candidate, not yet a left-side comparison anchor.
- **cdesktop** is included despite being young because it is explicitly beta, has a precise first-party capability boundary, and is a directly relevant open-source counterpart to Claude Code on desktop. Keep the beta status visible.

## Implementation notes

- Add the open-source repositories to the metrics manifest using their exact canonical coordinates. GitHub API checks on 2026-08-23 showed all eight recommended repositories as unarchived.
- Use `generalaction/emdash`, not the older `phattranky/emdash` path.
- GitHub reports Paseo's SPDX value as `NOASSERTION`, while its README explicitly declares AGPL-3.0. Record the source model as open source and the license display as “AGPL-3.0 (README-declared)” until the license parser is reconciled.
- For every sparse product claim, leave unlisted rows Unknown. Do not convert absence from docs into “Not available.” The Claude Desktop multi-harness cell is the exception because the official desktop documentation explicitly describes the single engine and says agent teams are unavailable there.
- Preserve the separate source types: repository-derived for inspectable OSS claims, vendor-documented for proprietary product pages, and `limited` whenever the implementation boundary is narrower than the row label.
