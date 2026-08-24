# Explicit Unknown ledger: orchestrators and harnesses

Checked 2026-08-23. The machine-readable source of truth is [`unknown-audit-orchestrators-harnesses.json`](../../takes/three/src/data/unknown-audit-orchestrators-harnesses.json).

## Scope and counting rule

This pass derives the Unknown set from `comparison-catalog.ts` by resolving every non-platform category row through `getComparisonClaim()`. It covers the 20 rendered Agent Orchestrators and 27 rendered Coding-agent Harnesses after excluding the hidden backlog IDs `mosaic-terminal`, `airport`, `muse-code`, and `omnara`.

The result reconciles exactly with the current catalog:

| Category | Products | Rendered catalog Unknowns | Suggested closures | Must remain Unknown |
| --- | ---: | ---: | ---: | ---: |
| Agent Orchestrators | 20 | 99 | 0 | 99 |
| Coding-agent Harnesses | 27 | 62 | 0 | 62 |
| Total | 47 | 161 | 0 | 161 |

Every one of the 161 remaining cells has its own product/row record, checked first-party source set, and product-specific rationale in the JSON ledger. There are no category-wide placeholder rationales. The eight closures below are retained separately as an implementation record.

This count deliberately does not mix in two different kinds of presentation gap:

- platform support is rendered in each product header, not as table rows; the 10 products whose whole platform fact is Unknown are audited separately below;
- repository metric Unknowns are generated collector failures or not-yet-refreshed values. They must be closed by the `--loc` refresh and strict `audit:freshness` gate, not by hand-written capability research.

## Implemented catalog closures

These eight former Unknown cells have direct exact-SKU first-party evidence and are now implemented in the catalog.

| Product | Row | Suggested state | Exact evidence | Why it closes |
| --- | --- | --- | --- | --- |
| GitHub Copilot CLI | `harness-sandbox` | Built in | [First-party CLI changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) | Documents `/sandbox`, path and network enforcement, platform policy, bypass behavior, and sandboxed execution. |
| GitHub Copilot CLI | `harness-multimodal-input` | Built in | [First-party CLI changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) | Explicitly documents pasted/dragged image input, attached images and PDFs, vision policy, and `--attachment` in non-interactive mode. |
| Kimi Code CLI | `harness-project-instructions` | Built in | [Agent customization guide](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/customization/agents.md) | Documents global and project `AGENTS.md` locations and injection as workspace instructions. |
| Mistral Vibe | `harness-multimodal-input` | Built in | [Canonical README](https://github.com/mistralai/mistral-vibe#features) | Documents `@` image attachments for PNG, JPEG, GIF, and WebP sent as native multimodal content. |
| gptme | `harness-git-workflow` | Built in | [First-party features](https://github.com/gptme/gptme/blob/master/docs/features.rst) | Documents the built-in auto-commit tool and pre-commit integration. |
| CodeWhale | `product-status` | Active | [Canonical README](https://github.com/Hmbown/CodeWhale) | Explicitly says the project is independently maintained and invites current contributions. |
| Qwen Code | `product-status` | Active | [Canonical README](https://github.com/QwenLM/qwen-code) | Explicitly says Qwen Code is actively iterating on itself. |
| Goose CLI | `harness-structured-output` | Built in | [Running tasks](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/running-tasks.md) | Documents both `--output-format json` and `--output-format stream-json`. |

These are affirmative closures. No cell was converted to `Not available` merely because a feature was absent from documentation.

## Agent Orchestrator ledger index

The row list below enumerates all 99 current Unknowns. The JSON ledger contains the exact rationale and checked sources for each cell.

| Product ID | Count | Cells that remain Unknown |
| --- | ---: | --- |
| `claude-code-desktop` | 4 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-programmable` |
| `chatgpt-desktop` | 11 | `orchestrator-isolated-workspaces`, `orchestrator-agent-handoff`, `orchestrator-worktrees`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-pr-lifecycle`, `orchestrator-remote-execution`, `orchestrator-attention-signals`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `orca` | 3 | `product-status`, `orchestrator-agent-handoff`, `orchestrator-containers` |
| `conductor` | 4 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-attention-signals` |
| `poolside-desktop-assistant` | 8 | `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-pr-lifecycle`, `orchestrator-remote-execution`, `orchestrator-attention-signals`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `bb` | 2 | `orchestrator-containers`, `orchestrator-pr-lifecycle` |
| `omnigent` | 4 | `orchestrator-agent-handoff`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-pr-lifecycle` |
| `agent-orchestrator` | 4 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-inline-review`, `orchestrator-remote-execution` |
| `emdash` | 6 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `kandev` | 1 | `orchestrator-inline-review` |
| `paseo` | 1 | `orchestrator-task-board` |
| `superset` | 3 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board` |
| `coder-mux` | 8 | `product-status`, `orchestrator-multi-harness`, `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-pr-lifecycle`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `nimbalyst` | 5 | `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-pr-lifecycle`, `orchestrator-remote-execution`, `orchestrator-programmable` |
| `t3-code` | 8 | `orchestrator-isolated-workspaces`, `orchestrator-worktrees`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-remote-execution`, `orchestrator-attention-signals`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `vibe-kanban` | 6 | `orchestrator-parallel-workers`, `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-attention-signals`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `sculptor` | 6 | `orchestrator-agent-handoff`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-attention-signals`, `orchestrator-live-steering`, `orchestrator-programmable` |
| `humanlayer` | 2 | `orchestrator-agent-handoff`, `orchestrator-containers` |
| `claude-squad` | 8 | `product-status`, `orchestrator-agent-handoff`, `orchestrator-containers`, `orchestrator-task-board`, `orchestrator-pr-lifecycle`, `orchestrator-remote-execution`, `orchestrator-attention-signals`, `orchestrator-programmable` |
| `agent-deck` | 5 | `orchestrator-agent-handoff`, `orchestrator-review-delivery`, `orchestrator-task-board`, `orchestrator-inline-review`, `orchestrator-pr-lifecycle` |

The most important preserved boundary is cross-harness handoff. Running several harnesses, changing a model, or launching a new worker does not prove that one active task and its context can move between harnesses. Likewise, a worktree is not a container, permission prompts are not a sandbox, a session list is not a Kanban board, and generic Git access is not an owned pull-request lifecycle.

The `coder-mux` source set now points to [Xum](https://github.com/coder/xum), the renamed exact product. The durable ID stays in this ledger until the coordinated catalog, manifest, evidence, and identity-asset migration lands.

## Coding-agent Harness ledger index

| Product ID | Count | Suggested closures | Cells that remain Unknown |
| --- | ---: | --- | --- |
| `codex-cli` | 1 | — | `harness-checkpoints` |
| `github-copilot-cli` | 0 | Implemented: `harness-sandbox`, `harness-multimodal-input` | — |
| `gemini-cli` | 1 | — | `harness-multi-provider` |
| `amp` | 1 | — | `harness-checkpoints` |
| `prime-agent` | 1 | — | `harness-git-workflow` |
| `deepseek-harness` | 1 | — | `harness-multimodal-input` |
| `poolside-pool` | 1 | — | `harness-multimodal-input` |
| `kimi-code-cli` | 2 | Implemented: `harness-project-instructions` | `harness-sandbox`, `harness-git-workflow` |
| `kilo-code-cli` | 3 | — | `harness-sandbox`, `harness-checkpoints`, `harness-multimodal-input` |
| `mistral-vibe` | 2 | Implemented: `harness-multimodal-input` | `harness-sandbox`, `harness-checkpoints` |
| `continue-cli` | 4 | — | `harness-sandbox`, `harness-checkpoints`, `harness-subagents`, `harness-multimodal-input` |
| `crush` | 5 | — | `harness-sandbox`, `harness-checkpoints`, `harness-subagents`, `harness-structured-output`, `harness-multimodal-input` |
| `auggie-cli` | 3 | — | `harness-sandbox`, `harness-checkpoints`, `harness-git-workflow` |
| `kiro-cli` | 1 | — | `harness-multimodal-input` |
| `amplifier-agent` | 3 | — | `harness-sandbox`, `harness-checkpoints`, `harness-multimodal-input` |
| `gptme` | 1 | Implemented: `harness-git-workflow` | `harness-sandbox` |
| `cursor-cli` | 6 | — | `product-status`, `harness-multi-provider`, `harness-sandbox`, `harness-checkpoints`, `harness-subagents`, `harness-multimodal-input` |
| `factory-droid-cli` | 5 | — | `product-status`, `harness-multi-provider`, `harness-checkpoints`, `harness-git-workflow`, `harness-multimodal-input` |
| `codewhale` | 2 | Implemented: `product-status` | `harness-git-workflow`, `harness-multimodal-input` |
| `antigravity-cli` | 2 | — | `product-status`, `harness-multi-provider` |
| `qwen-code` | 1 | Implemented: `product-status` | `harness-checkpoints` |
| `pi-coding-agent` | 1 | — | `product-status` |
| `opencode` | 3 | — | `product-status`, `harness-sandbox`, `harness-git-workflow` |
| `goose` | 4 | Implemented: `harness-structured-output` | `product-status`, `harness-checkpoints`, `harness-git-workflow`, `harness-multimodal-input` |
| `aider` | 6 | — | `product-status`, `harness-extension-protocol`, `harness-permission-controls`, `harness-sandbox`, `harness-subagents`, `harness-structured-output` |
| `grok-build` | 2 | — | `product-status`, `harness-multimodal-input` |

Qwen Code checkpointing returned to Unknown after the current exact settings document removed the former checkpoint configuration. Its only remaining `checkpoint` reference describes a startup-profiler memory snapshot, not workspace rollback or conversation recovery.

## Platform-header audit

All orchestrator products have a known platform fact. Four audited harness platform profiles are now implemented; six products still render a `?` because their complete platform fact remains Unknown:

| Product | Result | Evidence boundary |
| --- | --- | --- |
| Amplifier Agent | Implemented: macOS, Windows, Linux | [Canonical installer](https://github.com/microsoft/amplifier-agent) documents the Unix path and explicit Windows Git Bash path. |
| OpenCode CLI | Implemented: macOS, Windows, Linux | [Canonical README](https://github.com/anomalyco/opencode) lists packages for all three. |
| Aider | Implemented: macOS, Windows, Linux | [Installation guide](https://aider.chat/docs/install.html) supplies supported paths for all three. |
| Grok Build | Implemented: macOS, Windows, Linux | [Canonical README](https://github.com/xai-org/grok-build) explicitly names macOS, Linux, and Git Bash on Windows. |
| Cursor CLI | Remain Unknown | Exact native-host matrix was not established; editor platforms were not inherited. |
| Factory Droid CLI | Remain Unknown | Cloud Droid Computers were not substituted for the local CLI host contract. |
| CodeWhale | Remain Unknown | Release artifacts were not promoted without a current supported-host statement. |
| Antigravity CLI | Remain Unknown | Adjacent Google IDE and cloud surfaces were excluded from the CLI claim. |
| Pi coding agent | Remain Unknown | Package/build tooling alone does not establish a supported native OS set. |
| Goose CLI | Remain Unknown | Desktop support and WSL guidance were not inherited as a complete native CLI matrix. |

Platform closure recommendations are separate from the 167 table-cell count because the UI renders platform facts in product headers.

## Generated metric boundary

The comparison page appends 14 open-source repository rows whenever a category has metric joins. Their Unknown values are not part of this editorial evidence ledger. A missing star count, contributor count, license, release, CLOC measurement, or refresh timestamp is a failed or incomplete deterministic collection result. The correct response is:

1. repair the canonical manifest identity or license/release exception;
2. run `node takes/three/scripts/refresh-open-source-metrics.mjs --loc`;
3. require `npm --prefix takes/three run audit:freshness` to pass;
4. block publication if any tracked repository remains partial, stale, or unmeasured.

Hand-entering those values would make the matrix less current and less reproducible.

## Validation contract

The JSON ledger should be checked against the catalog before each audit merge:

- derive every non-platform Unknown key as `productId::rowId`;
- assert the ledger has exactly the same key set, with no duplicates;
- require every cell to have one disposition and a non-empty product/row-specific rationale;
- require every suggested closure to carry exact evidence URL, title, basis, and target state;
- remove a ledger cell only in the same change that closes the catalog claim, or update its rationale when rechecked evidence still cannot support a conclusion.

This turns Unknowns into a review queue without turning absence of documentation into a guessed negative.
