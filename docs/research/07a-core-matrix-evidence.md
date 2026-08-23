# Core matrix evidence: editors, workbenches, and orchestrators

Checked: 2026-08-23

This is a first-party evidence pack for three comparison tabs. It is deliberately conservative: a product/row pair appears only when a vendor document or the product's official repository supports it directly. An omitted cell remains `Unknown`; omission never means `Not available`.

Controlled states below use the catalog vocabulary: `Built in`, `Via extension`, `Via integration`, and `Limited`. `Limited` always names the boundary. Repository README and checked-in product documentation are `repository-derived`; vendor documentation and vendor product pages are `vendor-documented`.

## 1. Code editors and IDEs

### Recommended row additions

These seven rows separate ordinary editor reach from the agent-specific capabilities that now distinguish the category.

| Proposed row ID | Display label | Group | What earns a positive state |
|---|---|---|---|
| `editor-inline-prediction` | Inline code prediction | AI interaction | Predictive inline or next-edit suggestions while typing |
| `editor-agent-shell-tools` | Agent can run shell commands | Agent tools | The in-editor agent can execute and observe terminal commands |
| `editor-mcp` | MCP tools | Agent tools | Product documentation describes MCP server/tool support |
| `editor-parallel-sessions` | Parallel agent sessions | Agent workflow | Multiple independent agent sessions can actively run and be managed together |
| `editor-worktree-isolation` | Git worktree isolation | Isolation | A session can be placed in a separate Git worktree by the product |
| `editor-change-review` | Agent change review | Review | Product has a product-native diff/change review surface for agent edits |
| `editor-remote-workspaces` | Remote workspace execution | Execution | The editor/agent can run against code and tools on another machine or managed remote environment |

### Easy closures for existing rows

| Product | Existing row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| Cursor IDE | Project tree and editor | Built in | Open a project and let Agent search and edit its files. | [Cursor quickstart](https://docs.cursor.com/en/get-started/quickstart) | vendor-documented | 2026-08-23 |
| Cursor IDE | Integrated terminal | Built in | Cursor has a native terminal; Agent executes commands in it with preserved history. | [Cursor terminal](https://docs.cursor.com/en/agent/terminal) | vendor-documented | 2026-08-23 |
| Cursor IDE | Agent mode | Built in | Agent searches the codebase, edits files, and runs terminal commands. | [Cursor Agent overview](https://prod.cursor.com/docs/agent/overview) | vendor-documented | 2026-08-23 |
| Cursor IDE | Background agent jobs | Built in | Asynchronous agents edit and run code in isolated remote Ubuntu machines. | [Cursor Background Agents](https://docs.cursor.com/background-agent) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | Project tree and editor | Built in | The current, renamed desktop IDE includes an editor and an agent that creates, edits, and runs code. | [Devin Desktop getting started](https://docs.devin.ai/desktop/getting-started) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | Integrated terminal | Built in | Enhanced terminal with agent command execution and approval controls. | [Devin Desktop terminal](https://docs.devin.ai/desktop/terminal) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | Agent mode | Built in | Devin Local is the current primary local agent; the transitional Cascade surface also edits code and calls tools. | [Devin Desktop getting started](https://docs.devin.ai/desktop/getting-started) | vendor-documented | 2026-08-23 |
| Zed | Project tree and editor | Built in | Zed Agent integrates with the project and editor surfaces. | [Zed Agent](https://zed.dev/docs/ai/zed-agent) | vendor-documented | 2026-08-23 |
| Zed | Integrated terminal | Built in | Agent has a terminal tool and Terminal Threads are managed beside agent threads. | [Zed Agent](https://zed.dev/docs/ai/zed-agent) | vendor-documented | 2026-08-23 |
| Zed | Agent mode | Built in | Native Agent Panel can read/search projects, edit files, run commands, and review changes. | [Zed Agent](https://zed.dev/docs/ai/zed-agent) | vendor-documented | 2026-08-23 |
| Zed | Background agent jobs | Built in | Independent threads continue while the operator starts or switches to another thread. | [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents) | vendor-documented | 2026-08-23 |
| Kiro | Project tree and editor | Built in | IDE includes editor interface, codebase indexing, source control, and extensions. | [Kiro IDE docs](https://kiro.dev/docs/ide/) | vendor-documented | 2026-08-23 |
| Kiro | Integrated terminal | Built in | IDE agents can run long-lived commands in dedicated visible terminals. | [Kiro dev servers](https://kiro.dev/docs/chat/dev-servers/) | vendor-documented | 2026-08-23 |
| Kiro | Agent mode | Built in | IDE chat and specs use the same agent engine as CLI and Web. | [Kiro IDE docs](https://kiro.dev/docs/ide/) | vendor-documented | 2026-08-23 |
| Kiro | Background agent jobs | Built in | Agent Focus launches multiple independent sessions; cloud sessions keep working after disconnect. | [Kiro Agent Focus](https://kiro.dev/docs/ide/experimental/focus-mode) | vendor-documented | 2026-08-23 |

### Claims for the added rows

| Product | Proposed row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| Visual Studio Code | Inline code prediction | Via extension | GitHub Copilot provides inline suggestions and next-edit suggestions in VS Code. | [VS Code inline suggestions](https://code.visualstudio.com/docs/editing/ai-powered-suggestions) | vendor-documented | 2026-08-23 |
| Visual Studio Code | Agent can run shell commands | Built in | Agent tools run commands and can move long-running commands to background terminals. | [VS Code agent tools](https://code.visualstudio.com/docs/agents/run/tools) | vendor-documented | 2026-08-23 |
| Visual Studio Code | MCP tools | Built in | Agent tool picker supports built-in, MCP, and extension tools. | [VS Code agent tools](https://code.visualstudio.com/docs/agents/run/tools) | vendor-documented | 2026-08-23 |
| Visual Studio Code | Parallel agent sessions | Built in | Agents window starts and tracks multiple sessions across projects. | [VS Code Agents window](https://code.visualstudio.com/docs/agents/run/agents-window) | vendor-documented | 2026-08-23 |
| Visual Studio Code | Git worktree isolation | Built in | Local agent sessions can use a product-created separate Git worktree. | [VS Code agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses) | vendor-documented | 2026-08-23 |
| Visual Studio Code | Agent change review | Built in | Changes view supports diffs and range-based feedback for the active agent session. | [VS Code Agents window](https://code.visualstudio.com/docs/agents/run/agents-window) | vendor-documented | 2026-08-23 |
| Visual Studio Code | Remote workspace execution | Built in | Agents window can target SSH/dev-tunnel workspaces; harness runs beside remote code and tools. | [VS Code agents overview](https://code.visualstudio.com/docs/agents/overview) | vendor-documented | 2026-08-23 |
| Cursor IDE | Inline code prediction | Built in | Cursor Tab supplies multi-line/block completion and next-location suggestions. | [Cursor quickstart](https://docs.cursor.com/en/get-started/quickstart) | vendor-documented | 2026-08-23 |
| Cursor IDE | Agent can run shell commands | Built in | Agent executes commands in Cursor's native terminal. | [Cursor terminal](https://docs.cursor.com/en/agent/terminal) | vendor-documented | 2026-08-23 |
| Cursor IDE | MCP tools | Built in | Cursor supports stdio, SSE, and Streamable HTTP MCP servers. | [Cursor MCP](https://docs.cursor.com/context/model-context-protocol) | vendor-documented | 2026-08-23 |
| Cursor IDE | Parallel agent sessions | Built in | Background Agent sidebar starts and monitors multiple asynchronous agents. | [Cursor Background Agents](https://docs.cursor.com/background-agent) | vendor-documented | 2026-08-23 |
| Cursor IDE | Remote workspace execution | Built in | Background Agents run and edit code in vendor-hosted isolated VMs. | [Cursor Background Agents](https://docs.cursor.com/background-agent) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | Inline code prediction | Built in | Tab provides inline, diff, import, and cursor-jump suggestions. | [Devin Desktop Tab](https://docs.devin.ai/desktop/tab/overview) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | Agent can run shell commands | Built in | The current local agent runs commands under allow/ask/deny permissions; Cascade remains documented with four auto-execution levels. | [Devin Desktop terminal](https://docs.devin.ai/desktop/terminal) | vendor-documented | 2026-08-23 |
| Devin Desktop (catalog: Windsurf) | MCP tools | Built in | Desktop documentation exposes MCP servers to the local agent/Cascade surfaces. | [Devin Desktop MCP](https://docs.devin.ai/desktop/cascade/mcp) | vendor-documented | 2026-08-23 |
| Zed | Inline code prediction | Built in | Edit Prediction offers single- or multi-line suggestions and multiple providers. | [Zed Edit Prediction](https://zed.dev/docs/ai/edit-prediction) | vendor-documented | 2026-08-23 |
| Zed | Agent can run shell commands | Built in | Zed Agent includes terminal execution among its native tools. | [Zed Agent](https://zed.dev/docs/ai/zed-agent) | vendor-documented | 2026-08-23 |
| Zed | MCP tools | Built in | Agent Profiles expose configured MCP tools to Zed Agent threads. | [Zed Agent Panel](https://zed.dev/docs/ai/agent-panel) | vendor-documented | 2026-08-23 |
| Zed | Parallel agent sessions | Built in | Threads Sidebar runs multiple independent native, ACP, or terminal threads. | [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents) | vendor-documented | 2026-08-23 |
| Zed | Git worktree isolation | Built in | A thread can create and run in a linked Git worktree, restored with thread history. | [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents) | vendor-documented | 2026-08-23 |
| Zed | Agent change review | Built in | Zed Agent sends changes to Zed's review UI. | [Zed Agent](https://zed.dev/docs/ai/zed-agent) | vendor-documented | 2026-08-23 |
| Kiro | Agent can run shell commands | Built in | Agent starts and monitors long-running commands in dedicated terminals. | [Kiro dev servers](https://kiro.dev/docs/chat/dev-servers/) | vendor-documented | 2026-08-23 |
| Kiro | MCP tools | Built in | IDE connects external tools/data through MCP servers. | [Kiro IDE docs](https://kiro.dev/docs/ide/) | vendor-documented | 2026-08-23 |
| Kiro | Parallel agent sessions | Built in | Agent Focus manages multiple independent sessions with status indicators. | [Kiro Agent Focus](https://kiro.dev/docs/ide/experimental/focus-mode) | vendor-documented | 2026-08-23 |
| Kiro | Agent change review | Built in | Agent Focus renders changed files as inline diffs and opens a full file view. | [Kiro Agent Focus](https://kiro.dev/docs/ide/experimental/focus-mode) | vendor-documented | 2026-08-23 |
| Kiro | Remote workspace execution | Built in | Cloud sessions run in managed sandboxes and remain active when the client disconnects. | [Kiro IDE](https://kiro.dev/ide/) | vendor-documented | 2026-08-23 |
| Void | Inline code prediction | Built in | Official beta release lists native autocomplete. | [Void releases](https://github.com/voideditor/void/releases) | repository-derived | 2026-08-23 |
| Void | Agent change review | Built in | Repository describes checkpoints and visualized changes. | [Void repository](https://github.com/voideditor/void) | repository-derived | 2026-08-23 |

## 2. Agent workbenches

### Recommended row additions

| Proposed row ID | Display label | Group | What earns a positive state |
|---|---|---|---|
| `workbench-splits` | Tabs and split panes | Workspace composition | Multiple live terminal/surface panes can be arranged together |
| `workbench-attention-signals` | Cross-session attention signals | Attention | Product identifies sessions that finished, blocked, or need input |
| `workbench-session-recovery` | Session recovery | Continuity | Product documents exactly what survives quit, crash, reboot, or reconnect |
| `workbench-browser` | Embedded browser | Workbench depth | A browser surface exists inside the workspace window |
| `workbench-remote-host` | SSH or remote host | Execution | Sessions can be opened or driven on a remote machine |
| `workbench-programmable-control` | CLI or socket control | Automation | Product exposes supported commands/API for manipulating its surfaces |
| `workbench-worktrees` | Git worktree workflow | Isolation | Worktrees are created, surfaced, or used as first-class session contexts |

### Easy closures for existing rows

| Product | Existing row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| cmux | Source control workflow | Limited | Sidebar shows branch and linked PR status; it is not documented as a full SCM editor. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| Warp | Code editor | Built in | Native tabbed editor supports syntax highlighting, find/replace, and Vim keys. | [Warp code editor](https://docs.warp.dev/code/code-editor) | vendor-documented | 2026-08-23 |
| Warp | Project file tree | Built in | Editor includes a file tree for browsing files and adding them as agent context. | [Warp code editor](https://docs.warp.dev/code/code-editor) | vendor-documented | 2026-08-23 |
| Warp | Source control workflow | Limited | Interactive code review covers agent diffs and inline feedback; docs do not establish a complete SCM surface. | [Warp local agents overview](https://docs.warp.dev/agent-platform/local-agents/overview) | vendor-documented | 2026-08-23 |
| Wave Terminal | Code editor | Built in | Built-in graphical editor edits local and remote files. | [Wave repository](https://github.com/wavetermdev/waveterm) | repository-derived | 2026-08-23 |
| Wave Terminal | Project file tree | Limited | Directory/file preview and connected file management are built in; a project-wide IDE tree is not claimed. | [Wave repository](https://github.com/wavetermdev/waveterm) | repository-derived | 2026-08-23 |

### Claims for the added rows

| Product | Proposed row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| Tortie | Tabs and split panes | Built in | Project tabs plus draggable session splits and zoom. | [Tortie README](https://github.com/gregce/tortie#readme) | repository-derived | 2026-08-23 |
| Tortie | Cross-session attention signals | Built in | Attention state spans sessions and projects rather than only the active terminal. | [Tortie product documentation](https://github.com/gregce/tortie/blob/main/docs/ZEN-OF-TORTIE.md) | repository-derived | 2026-08-23 |
| Tortie | Session recovery | Built in | tmux-owned live sessions survive app exit; reboot recovery relaunches native agent resume commands. | [Tortie README](https://github.com/gregce/tortie#readme) | repository-derived | 2026-08-23 |
| Tortie | SSH or remote host | Built in | Remote machines can host sessions that are listed, opened, and restored from Tortie. | [Tortie README](https://github.com/gregce/tortie#readme) | repository-derived | 2026-08-23 |
| cmux | Tabs and split panes | Built in | Native workspaces, tabs, and split terminal/browser panes. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| cmux | Cross-session attention signals | Built in | Pane rings, unread sidebar state, popover, and desktop notifications identify attention. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| cmux | Session recovery | Limited | Restores layouts, cwd, scrollback, and supported agent conversations via native resume IDs; arbitrary process state is not checkpointed. | [cmux session restore](https://github.com/manaflow-ai/cmux#session-restore) | repository-derived | 2026-08-23 |
| cmux | Embedded browser | Built in | Scriptable browser panes can sit beside terminals and expose DOM, console, and network controls. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| cmux | SSH or remote host | Built in | Opens workspaces over SSH and attaches remote tmux sessions. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| cmux | CLI or socket control | Built in | CLI and Unix socket create workspaces/splits, send input, inspect screens, and drive the browser. | [cmux README](https://github.com/manaflow-ai/cmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | Tabs and split panes | Built in | Native PTYs, workspaces, tabs, multiview, and tmux-style split panes. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | Cross-session attention signals | Built in | Fleet View, completion notifications, taskbar/Dock signals, and approval inbox. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | Session recovery | Built in | A daemon owns PTYs so processes survive UI quit/crash; supervised panes relaunch after reboot. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | Embedded browser | Built in | Integrated Chrome/CDP browser with agent-operable MCP tools. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | SSH or remote host | Built in | Remote workspaces can be attached and mirrored over SSH. | [wmux releases](https://github.com/openwong2kim/wmux/releases) | repository-derived | 2026-08-23 |
| wmux | CLI or socket control | Built in | CLI plus workspace-scoped MCP tools control terminals, panes, browser, channels, and tasks. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| wmux | Git worktree workflow | Built in | Fan-out creates isolated worktrees, supports selective diff adoption, and can open a PR. | [wmux README](https://github.com/openwong2kim/wmux/blob/main/README.md) | repository-derived | 2026-08-23 |
| Warp | Tabs and split panes | Built in | Multiple conversations can run in separate windows, tabs, or panes. | [Warp agent conversations](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | vendor-documented | 2026-08-23 |
| Warp | Session recovery | Built in | Past restores an earlier agent conversation into a new tab or pane; storage is local by default. | [Warp agent conversations](https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents) | vendor-documented | 2026-08-23 |
| Wave Terminal | Tabs and split panes | Built in | Tabs contain draggable, resizable terminal/browser/editor/preview blocks. | [Wave getting started](https://docs.waveterm.dev/gettingstarted) | vendor-documented | 2026-08-23 |
| Wave Terminal | Embedded browser | Built in | Web browser is a first-class block type. | [Wave getting started](https://docs.waveterm.dev/gettingstarted) | vendor-documented | 2026-08-23 |
| Wave Terminal | SSH or remote host | Built in | One-click SSH with terminal and remote file access. | [Wave repository](https://github.com/wavetermdev/waveterm) | repository-derived | 2026-08-23 |
| Wave Terminal | Session recovery | Limited | Durable SSH sessions reconnect after network changes and Wave restarts; this does not establish local-process survival. | [Wave repository](https://github.com/wavetermdev/waveterm) | repository-derived | 2026-08-23 |
| Wave Terminal | CLI or socket control | Built in | `wsh` manages workspace surfaces and shares data between sessions. | [Wave repository](https://github.com/wavetermdev/waveterm) | repository-derived | 2026-08-23 |

## 3. Agent orchestrators

### Recommended row additions

The current four rows collapse materially different kinds of isolation and delivery. These eight additions make those differences inspectable without inventing a score.

| Proposed row ID | Display label | Group | What earns a positive state |
|---|---|---|---|
| `orchestrator-worktrees` | Git worktree isolation | Isolation | Product creates/manages task worktrees |
| `orchestrator-containers` | Container or VM isolation | Isolation | Product documents a container, VM, or remote workspace boundary |
| `orchestrator-task-board` | Task or Kanban board | Planning | Product includes task states/board as an operator surface |
| `orchestrator-inline-review` | Inline diff feedback | Review | Operator can annotate specific diff lines and return feedback to the agent |
| `orchestrator-pr-lifecycle` | Pull-request workflow | Delivery | Product creates, tracks, or merges pull requests from the task workspace |
| `orchestrator-remote-execution` | Remote execution | Execution | Agents can run on an SSH, daemon, container, or managed remote host |
| `orchestrator-attention-signals` | Fleet attention signals | Attention | Product surfaces running/waiting/completed state across workers |
| `orchestrator-programmable` | Programmable control plane | Automation | Supported CLI/API/MCP can create or supervise tasks/workspaces |

### Easy closures for existing rows

| Product | Existing row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| Sculptor | Multiple agent harnesses | Built in | Product documents a choice of integrated harnesses and multiple agents per workspace. | [Sculptor repository](https://github.com/imbue-ai/sculptor) | repository-derived | 2026-08-23 |
| HumanLayer | Multiple agent harnesses | Built in | BYOK sessions support Claude Code, Codex, and additional coding agents. | [HumanLayer](https://www.humanlayer.com/) | vendor-documented | 2026-08-23 |
| claude-squad | Multiple agent harnesses | Built in | Profiles launch Claude Code, Codex, Gemini, OpenCode, Aider, and other commands. | [claude-squad repository](https://github.com/smtg-ai/claude-squad) | repository-derived | 2026-08-23 |

### Claims for the added rows

| Product | Proposed row | State | Display / note | Primary source | Basis | Checked |
|---|---|---|---|---|---|---|
| Orca | Git worktree isolation | Built in | CLI creates named worktrees and can launch a selected agent in the first terminal. | [Orca CLI guide](https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md) | repository-derived | 2026-08-23 |
| Orca | Inline diff feedback | Built in | Review surface accepts comments on diff lines and sends them back to the agent. | [Orca README](https://github.com/stablyai/orca/blob/main/README.md) | repository-derived | 2026-08-23 |
| Orca | Remote execution | Built in | Product supports remote worktrees over SSH. | [Orca README](https://github.com/stablyai/orca/blob/main/README.md) | repository-derived | 2026-08-23 |
| Orca | Programmable control plane | Built in | `orca` CLI controls worktrees, terminals, browser/computer surfaces, and orchestration. | [Orca CLI guide](https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md) | repository-derived | 2026-08-23 |
| Conductor | Git worktree isolation | Built in | Every workspace gets its own branch, worktree, files, commands, and review flow. | [Conductor worktrees](https://www.conductor.build/docs/concepts/git-worktrees) | vendor-documented | 2026-08-23 |
| Conductor | Inline diff feedback | Built in | Diff Viewer comments target changed lines and become attachments sent to an agent. | [Conductor workflow](https://www.conductor.build/docs/concepts/workflow) | vendor-documented | 2026-08-23 |
| Conductor | Pull-request workflow | Built in | Workspace flow creates PRs, tracks checks/comments, merges, and archives. | [Conductor workflow](https://www.conductor.build/docs/concepts/workflow) | vendor-documented | 2026-08-23 |
| Superset | Git worktree isolation | Built in | Each parallel workspace uses its own Git worktree, branch, terminal, and environment. | [Superset repository](https://github.com/superset-sh/superset) | repository-derived | 2026-08-23 |
| Superset | Inline diff feedback | Built in | Built-in diff viewer and editor review workspace changes. | [Superset repository](https://github.com/superset-sh/superset) | repository-derived | 2026-08-23 |
| Superset | Remote execution | Built in | Workspaces are reachable through remote hosts, CLI, SDK, or MCP. | [Superset repository](https://github.com/superset-sh/superset) | repository-derived | 2026-08-23 |
| Superset | Fleet attention signals | Built in | Sidebar status, completion chimes, and Dock badges identify agents needing attention. | [Superset repository](https://github.com/superset-sh/superset) | repository-derived | 2026-08-23 |
| coder/mux | Git worktree isolation | Built in | Local worktree mode isolates parallel workspaces. | [Mux repository](https://github.com/coder/cmux) | repository-derived | 2026-08-23 |
| coder/mux | Inline diff feedback | Built in | Official README identifies an integrated code-review surface. | [Mux repository](https://github.com/coder/cmux) | repository-derived | 2026-08-23 |
| coder/mux | Remote execution | Built in | SSH mode executes workspaces on a remote server. | [Mux repository](https://github.com/coder/cmux) | repository-derived | 2026-08-23 |
| coder/mux | Fleet attention signals | Built in | Sidebar reports agent status across the workspace suite. | [Mux repository](https://github.com/coder/cmux) | repository-derived | 2026-08-23 |
| Nimbalyst | Git worktree isolation | Built in | Worktree sessions use separate directories and branches. | [Nimbalyst worktrees](https://github.com/nimbalyst/nimbalyst/blob/main/docs/WORKTREES.md) | repository-derived | 2026-08-23 |
| Nimbalyst | Task or Kanban board | Built in | Sessions and tasks are managed in Kanban with editable phases and items. | [Nimbalyst repository](https://github.com/nimbalyst/nimbalyst) | repository-derived | 2026-08-23 |
| Nimbalyst | Inline diff feedback | Built in | Visual red/green diffs support approve, edit, and annotate workflows. | [Nimbalyst repository](https://github.com/nimbalyst/nimbalyst) | repository-derived | 2026-08-23 |
| Nimbalyst | Fleet attention signals | Built in | Session dashboard identifies agents working versus needing input and sends push notifications. | [Nimbalyst repository](https://github.com/nimbalyst/nimbalyst) | repository-derived | 2026-08-23 |
| Vibe Kanban | Git worktree isolation | Built in | Each task attempt receives an isolated Git worktree. | [Vibe Kanban execution](https://vibekanban.com/docs/core-features/monitoring-task-execution) | vendor-documented | 2026-08-23 |
| Vibe Kanban | Task or Kanban board | Built in | Tasks move through To do, In Progress, In Review, and Done. | [Vibe Kanban tasks](https://www.vibekanban.com/docs/core-features/creating-tasks) | vendor-documented | 2026-08-23 |
| Vibe Kanban | Inline diff feedback | Built in | Line comments are collected and sent to the agent as a review. | [Vibe Kanban code review](https://www.vibekanban.com/docs/core-features/reviewing-code-changes) | vendor-documented | 2026-08-23 |
| Vibe Kanban | Pull-request workflow | Built in | Git operations create PRs, rebase, merge, and manage branches. | [Vibe Kanban reviewing code](https://www.vibekanban.com/docs/reviewing-code) | vendor-documented | 2026-08-23 |
| Sculptor | Git worktree isolation | Built in | A workspace is an isolated repo copy; work is reviewed and merged back to main. | [Sculptor repository](https://github.com/imbue-ai/sculptor) | repository-derived | 2026-08-23 |
| Sculptor | Container or VM isolation | Limited | Docker/remote container backend is documented as experimental. | [Sculptor repository](https://github.com/imbue-ai/sculptor) | repository-derived | 2026-08-23 |
| Sculptor | Pull-request workflow | Built in | Product documentation includes opening a GitHub PR and tracking status. | [Sculptor repository](https://github.com/imbue-ai/sculptor) | repository-derived | 2026-08-23 |
| HumanLayer | Git worktree isolation | Built in | Tasks provision one or multiple configured repository worktrees. | [HumanLayer workspace setup](https://docs.humanlayer.com/guide/workspaces) | vendor-documented | 2026-08-23 |
| HumanLayer | Task or Kanban board | Built in | Tasks group sessions, artifacts, and worktrees; Kanban and task-table views are product surfaces. | [HumanLayer](https://www.humanlayer.com/) | vendor-documented | 2026-08-23 |
| HumanLayer | Inline diff feedback | Limited | Keyboard diff navigation and inline comments are currently an experimental alpha. | [HumanLayer release notes](https://docs.humanlayer.com/release-notes) | vendor-documented | 2026-08-23 |
| HumanLayer | Pull-request workflow | Built in | Guided workflows hand implementation to a PR description phase. | [HumanLayer workflows reference](https://docs.humanlayer.com/reference/skills-workflows) | vendor-documented | 2026-08-23 |
| HumanLayer | Remote execution | Built in | Remote daemons run a selected agent on Linux or Windows hosts controlled from the web app. | [HumanLayer remote daemon](https://docs.humanlayer.com/tutorials/remote-daemon) | vendor-documented | 2026-08-23 |
| claude-squad | Git worktree isolation | Built in | Every task uses an isolated Git workspace and branch. | [claude-squad repository](https://github.com/smtg-ai/claude-squad) | repository-derived | 2026-08-23 |
| claude-squad | Inline diff feedback | Limited | TUI lets the operator review changes before applying or checking them out; line-comment feedback is not documented. | [claude-squad repository](https://github.com/smtg-ai/claude-squad) | repository-derived | 2026-08-23 |
| agent-deck | Git worktree isolation | Built in | Sessions can create isolated worktrees with setup and copy rules. | [agent-deck repository](https://github.com/asheshgoplani/agent-deck) | repository-derived | 2026-08-23 |
| agent-deck | Remote execution | Built in | SSH remotes support listing, creating, and attaching to remote sessions. | [agent-deck repository](https://github.com/asheshgoplani/agent-deck) | repository-derived | 2026-08-23 |
| agent-deck | Fleet attention signals | Built in | Session list and tmux status distinguish running, waiting, idle, and error states. | [agent-deck repository](https://github.com/asheshgoplani/agent-deck) | repository-derived | 2026-08-23 |
| agent-deck | Programmable control plane | Built in | CLI manages sessions, worktrees, MCPs, skills, remotes, and conductor flows. | [agent-deck skill](https://github.com/asheshgoplani/agent-deck/blob/main/skills/agent-deck/SKILL.md) | repository-derived | 2026-08-23 |

## Catalog identity corrections found during research

- The catalog's `Windsurf` desktop product is now **Devin Desktop**. The old documentation URLs redirect to [`docs.devin.ai/desktop`](https://docs.devin.ai/desktop/getting-started), whose installation guide says the package was renamed to `devin-desktop` while `windsurf` remains a transitional package. Rename the column and refresh its logo/official URL; do not present the old brand as a separate current product.
- The catalog currently stores `coder/mux`. GitHub now resolves that name away from the product source, while Coder's public Mux repository and product README are at [`coder/cmux`](https://github.com/coder/cmux). Refresh the repository identity and metrics join before applying these Mux claims. This is an identity correction, not a capability inference.

## Rows deliberately left unknown

- No negative capability states are proposed. First-party docs rarely prove absence.
- T3 Code remains unknown for the new orchestrator rows: the public product page did not yield precise, stable documentation in this pass.
- cmux code editor/file tree, wmux code editor/file tree, and Wave full SCM remain unknown; adjacent browser, preview, Git, or terminal features do not prove those stronger rows.
- Cursor local Git-worktree isolation and Windsurf Git-worktree/background-session behavior remain unknown here; remote VM execution or a checkpoint is not the same claim.
- A product's generic "parallel" language was not treated as fleet attention, line-level review, or PR lifecycle unless the source names that surface.
