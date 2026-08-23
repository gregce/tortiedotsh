# IDE-surface Unknown audit

Checked 2026-08-23. Scope: Code IDEs (`code-editors`), IDE Extensions (`ide-extensions`), and Agent Multiplexers (`agent-workbenches`). Evidence was limited to the exact evaluated SKU's first-party documentation or product repository. An omitted feature, an adjacent SKU, inherited host behavior, a roadmap item, or a similarly named community project was not converted into `Not available`.

## Result

The public category label and short label are now **Agent Multiplexers**. The category description names the actual operator job: multiplex concurrent agents and workspaces, route attention, isolate changes, and review results. The stable category ID and existing route remain unchanged to preserve links.

| Category | Products before → after | Unknowns before | Unknowns after | Raw closures | New-column Unknowns |
| --- | ---: | ---: | ---: | ---: | ---: |
| Code IDEs | 14 → 14 | 73 | 60 | 13 | 0 |
| IDE Extensions | 15 → 15 | 128 | 128 | 0 | 0 |
| Agent Multiplexers | 9 → 10 | 94 | 92 | 12 | 10 |
| **Total** | **38 → 39** | **295** | **280** | **25** | **10** |

Counts include unknown profile facts and the matrix cells produced from them. For example, one unknown platform profile also produces four unknown platform cells. The net reduction is 15.

## Closed cells

- Cursor IDE: agent permissions, command sandbox, and integrated agent browser (3).
- Kiro IDE: proprietary shipped-product source model and its source-model row (2). The first-party license identifies Kiro as licensed AWS content and separately lists its open-source dependencies; it does not publish Kiro itself under an open-source license.
- Void: historical macOS, Windows, and Linux binaries plus the platform profile (4); model access, specialization, AI boundary, and archived release channel (4).
- Tortie: active lifecycle profile and row, visual diff review, and limited HTML preview/browser surface (4).
- cmux: active lifecycle profile and row (2).
- wmux: experimental Linux and read-only browser/PWA reach, active lifecycle profile and row, affirmative absence of a code editor, and built-in diff/hunk review (6).

No IDE Extension Unknown was closed merely from the host IDE's behavior. In particular, cloud agents, CLIs, Kanban products, and JetBrains/VS Code sibling plugins remain separate SKUs.

## Preserved Unknowns after exact-SKU audit

The count in parentheses is the remaining matrix count for the product, including profile-derived cells.

### Code IDEs

- Eclipse Theia IDE (5): detached jobs, parallel sessions, worktrees, an OS command sandbox, and an agent browser are not established for the packaged Theia IDE.
- TraeCode (5): browser-distributed IDE, worktrees, remote workspace execution, permissions, and sandbox boundaries are not established by the cited exact-SKU sources.
- Qoder IDE (2): browser IDE and worktree isolation remain unproved.
- Antigravity IDE (3): browser IDE, worktrees, and remote workspace execution remain unproved.
- Android Studio (4): browser IDE, worktrees, remote workspace execution, and a command sandbox remain unproved for Android Studio rather than adjacent Google products.
- IntelliJ IDEA (5): browser IDE and AI-plugin detached/parallel jobs, sandbox, and browser tools remain unproved for the unified IDEA SKU.
- Positron (4): browser IDE, background/parallel jobs, and worktrees remain unproved.
- Onlook (7): historical desktop OSes are not current-product platforms; inline prediction, parallel sessions, permissions, and sandboxing remain unproved.
- Cursor IDE (1): the separately hosted Agents site is not the Cursor IDE's browser platform.
- Devin Desktop (6): browser IDE, detached/parallel desktop jobs, worktrees, permissions, and sandboxing remain unproved for the renamed desktop SKU.
- Zed (3): browser IDE, remote workspace execution, and an embedded agent browser remain unproved.
- Kiro (4): Kiro Web is an adjacent surface; IDE inline prediction, worktrees, and sandboxing remain unproved.
- Void (11): archived sources do not affirm browser delivery or the remaining agent-shell, MCP, background, parallel, worktree, remote, permission, sandbox, browser, and verification rows.

### IDE Extensions

- GitHub Copilot for IDEs (6): browser delivery, provider choice, checkpoints, permissions, isolated parallelism, and BYOK/local models remain exact-extension gaps.
- Cline extension (12): four platform/profile-derived cells plus inline completion, background delegation, JetBrains sibling-plugin identity, provider-choice presentation, codebase indexing, isolated parallelism, and remote-session ownership remain unproved for this column.
- Continue extension (10): four platform/profile-derived cells plus background delegation, checkpoints, permissions, isolated parallelism, and remote-session ownership remain unproved. Its first-party repository now says the product received a final 2.0.0 release and is no longer actively maintained; lifecycle should be reconciled separately rather than guessed from GitHub's unarchived flag.
- Kilo Code extension (7): four platform/profile-derived cells plus codebase indexing and remote-session ownership remain unproved; the cloud agent is a sibling surface.
- OpenAI Codex IDE extension (8), Claude Code for VS Code (8), Claude Code for JetBrains (10), Amazon Q Developer IDE extension (8), Gemini Code Assist IDE extension (9), JetBrains AI Assistant (8), Pochi for VS Code (5), Tabby IDE extensions (8), CodeCompanion.nvim (8), avante.nvim (9), and Refact IDE plugins (6): remaining cells are intentionally preserved where a capability belongs to a sibling CLI/cloud product, another host plugin, the host IDE, or lacks affirmative first-party exact-SKU evidence. The repeated families are browser platform, sibling host reach, checkpoints, permissions, MCP, isolated/background execution, codebase indexing, BYOK/local-model scope, and remote-session ownership.

### Agent Multiplexers

- Tortie (6): unsupported desktop/web platforms, cross-harness context handoff, programmable external control, and worktrees remain unproved.
- Cate (2): browser delivery and context-preserving cross-harness handoff remain unproved.
- cdesktop (8): roadmap desktop installers, live PTY survival, cross-project attention, attention signaling, programmable control, and handoff remain unproved.
- cmux (5): non-macOS/web platforms, code editing, and context-preserving handoff remain unproved.
- Mosaic Terminal (19) and Airport (20): their public pages did not yield enough exact-SKU evidence to establish platform, source, lifecycle, or the sparse feature rows. They remain explicit evidence-backlog products rather than receiving inferred negatives or guessed repositories.
- wmux (1): agent-to-agent delegation does not prove context-preserving cross-harness session handoff.
- Warp (7): browser delivery, arbitrary third-party CLI admission, PTY survival, context-preserving handoff, first-class review, embedded browser, and worktrees remain unproved for the evaluated local workbench surface.
- Wave Terminal (8): generic terminal workspaces do not prove durable agent-session identity, cross-project attention, agent attention signals, handoff, SCM/review, or worktree workflow.
- dmux (10): platform profile and its four platform cells remain unknown because npm/tmux requirements do not affirm an OS support matrix; handoff, editor, browser, remote host, and external programmable control are not established.

## New Agent Multiplexer

Add `standardagents/dmux`. Its MIT repository calls the product a dev agent multiplexer and documents tmux panes, eleven named coding-agent CLIs, isolated worktrees, multi-project navigation, durable agent conversation resume, notifications, file/diff browsing, merge, and GitHub PR creation. At audit time it had 1,750 stars, 138 forks, 30 open issues, and a 2026-08-16 default-branch push. This clears both exact-fit and meaningful-adoption thresholds.

Rejected or deferred:

- Opcode: 22,389 stars but last pushed 2025-10-16; its release contract remains historical/stale.
- Crystal: 3,106 stars, explicitly renamed/succeeded by Nimbalyst, last pushed 2026-02-26.
- Arbor: 805 stars and a strong worktree/orchestration fit, but below the adoption bar and last pushed 2026-06-12.
- Codeman (715), LeapMux (76), Aya (18), and Clodex (7): active or exact-fit ideas, but not yet notably adopted.
- Superset, Coder Mux, Nimbalyst, claude-squad, and agent-deck already have primary orchestrator columns; they were not duplicated or moved during this lane.

## Open-source joins and handoff IDs

- Added source-tree metrics join `intellij-community` for split-source IntelliJ IDEA.
- Added product-source metrics join `dmux` for `standardagents/dmux`.
- Generated metrics must contain complete, sourced records for both IDs before release; no blank open/split-source card is acceptable.
- New first-party identity asset ID required: `dmux`. IntelliJ IDEA already has a product asset; the source-tree join does not create a new product column.

Android Studio remains a special split-source case: its exact first-party source lives in Android's non-GitHub source infrastructure. Substituting IntelliJ Community or a community GitHub mirror would violate exact-SKU provenance. Its collector needs an explicit non-GitHub source adapter rather than a fabricated GitHub join.

## First-party sources

- [Cursor run modes](https://cursor.com/docs/agent/security/run-modes) and [Cursor browser tools](https://cursor.com/docs/agent/tools/browser)
- [Kiro license](https://kiro.dev/license/) and [Kiro IDE documentation](https://kiro.dev/docs/ide/)
- [Void repository](https://github.com/voideditor/void) and [first-party Void binaries](https://github.com/voideditor/binaries/releases)
- [Tortie repository](https://github.com/gregce/tortie)
- [cmux repository](https://github.com/manaflow-ai/cmux)
- [wmux repository](https://github.com/openwong2kim/wmux)
- [dmux repository](https://github.com/standardagents/dmux)
- [Continue repository](https://github.com/continuedev/continue)
- [IntelliJ Community source tree](https://github.com/JetBrains/intellij-community)
