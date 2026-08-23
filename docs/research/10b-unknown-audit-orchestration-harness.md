# Unknown audit: orchestrators and coding-agent harnesses

Date: 2026-08-23

## Scope and method

This pass audited every `Unknown` cell in the Agent Orchestrators and Coding-agent Harnesses matrices. A cell was closed only when a current first-party product page, documentation page, release note, or canonical source repository directly established the claim for the exact SKU in the column. Adjacent products, companion apps, similarly named cloud services, and reasonable inferences were not used as substitutes.

An absent claim is not treated as a negative. In particular, the catalog keeps an unmentioned operating system, web client, sandbox, worktree, subagent, checkpoint, detached-run guarantee, or delivery workflow as `Unknown`. This is why many platform cells remain open even when a product documents a narrower installation path.

## Result

| Category | Products before | Unknown before | Products after | Unknown after | Existing unknowns closed |
| --- | ---: | ---: | ---: | ---: | ---: |
| Agent Orchestrators | 19 | 159 | 20 | 122 | 49 |
| Coding-agent Harnesses | 28 | 164 | 28 | 153 | 11 |
| Total | 47 | 323 | 48 | 275 | 60 |

The new ChatGPT desktop column contributes 12 deliberately preserved unknowns. On a like-for-like basis, the original 19 orchestrator columns now contain 110 unknowns, down from 159.

## Added exact SKU

`chatgpt-desktop` is the asset ID required for the new **ChatGPT desktop** orchestrator column. It is placed immediately after Claude Code on desktop and is explicitly separate from Codex CLI, the Codex IDE extension, and Codex cloud.

The [ChatGPT desktop app documentation](https://learn.chatgpt.com/docs/app) directly establishes macOS, Windows and Linux clients; project and folder context; ChatGPT and Codex modes; parallel projects; and long-running work. The [ChatGPT product overview](https://learn.chatgpt.com/) establishes the Codex review and delivery workflow. No other ChatGPT desktop capability was inferred.

## Closure ledger

### Agent Orchestrators

- **Orca:** closed task board, pull-request lifecycle, attention signals and live steering from the [canonical repository README](https://github.com/stablyai/orca#readme).
- **Conductor:** closed active status, vendor-cloud execution, multiple harnesses, remote execution, live steering and programmable control from the [harness reference](https://www.conductor.build/docs/reference/harnesses) and [API documentation](https://www.conductor.build/docs/api).
- **bb:** closed task board and inline review from the [canonical repository](https://github.com/get-bb/bb).
- **Superset:** closed active status, pull-request lifecycle, live steering and programmable control from the [canonical repository](https://github.com/superset-sh/superset). Windows remains unclaimed because the project explicitly says it is unavailable.
- **Nimbalyst:** closed active status and live steering from the [canonical repository](https://github.com/Nimbalyst/nimbalyst).
- **T3 Code:** closed macOS, Windows and Linux; open-source and active status; multiple harnesses; handoff; review and delivery; inline review; and pull-request lifecycle from the [product site](https://t3.codes/) and [canonical repository](https://github.com/pingdotgg/t3code).
- **Vibe Kanban:** closed macOS and web surfaces and limited remote execution from the [canonical repository](https://github.com/BloopAI/vibe-kanban).
- **Sculptor:** closed limited remote execution from the [canonical repository](https://github.com/Imbue-AI/sculptor).
- **HumanLayer:** closed macOS, Windows, Linux and web; active status; attention signals; live steering; and programmable control from the [product documentation](https://humanlayer.com/) and [canonical repository](https://github.com/humanlayer/humanlayer).
- **claude-squad:** closed macOS, Linux and live steering from the [canonical repository](https://github.com/smtg-ai/claude-squad). Windows was not promoted from WSL/tmux instructions to native support.
- **agent-deck:** closed macOS, Linux and web; container execution and isolation; active status; and live steering from the [canonical repository](https://github.com/asheshgoplani/agent-deck).

### Coding-agent Harnesses

- **Claude Code:** closed active status and multi-provider deployment from the [official Claude Code documentation](https://code.claude.com/docs/en/overview).
- **Codex CLI:** closed active status, multi-provider access, structured output, Git workflow and multimodal input from current [official Codex documentation](https://learn.chatgpt.com/docs/codex/cli) and related pages in that documentation set.
- **Gemini CLI:** closed active status, Git workflow and multimodal input from the [canonical repository](https://github.com/google-gemini/gemini-cli).
- **DeepSeek Harness:** closed its web surface from the [official product documentation](https://chat.deepseek.com/).

## Remaining unknowns and search boundary

The counts below are the post-audit state. The listed boundary is why the remaining cells were preserved rather than converted into unsupported negatives.

### Agent Orchestrators

| Product | Unknowns | Preserved boundary |
| --- | ---: | --- |
| Claude Code on desktop | 6 | No exact-SKU Linux or web client, handoff, container, task-board or API contract was found. |
| ChatGPT desktop | 12 | Official app pages prove the three desktop clients and parallel/review workflow, but not web parity, isolation mechanics, worktrees, containers, boards, PR automation, alerts, steering, remote execution or an API. |
| Orca | 3 | Current first-party material does not state a lifecycle label, cross-agent handoff contract or container isolation. |
| Conductor | 7 | No exact client claim for Windows, Linux or web, nor explicit handoff, containers, task board or attention signaling. |
| Poolside Desktop Assistant | 11 | The launch page proves macOS, worktrees, multiple harnesses and handoff, but not the remaining platform, container, board, PR, remote, alert, steering or API cells. |
| bb | 3 | Native Windows, container isolation and an owned PR-creation lifecycle are not directly stated. |
| Omnigent | 4 | No direct handoff, task-board, inline-review or PR-lifecycle claim. |
| Agent Orchestrator | 5 | No exact web surface, handoff, container, inline-review or remote-execution guarantee. |
| Emdash | 7 | No exact web, handoff, container, board, inline-review, live-steering or API contract. |
| Kandev | 1 | The feature contract does not establish inline review. |
| Paseo | 1 | The first-party repository does not establish a task board. |
| Superset | 5 | Windows is explicitly unavailable; web, handoff, containers and board behavior remain unstated rather than inferred. |
| coder/mux | 9 | Current first-party material does not settle native Windows, lifecycle status, multi-harness, handoff, containers, boards, PRs, steering or API semantics. |
| Nimbalyst | 6 | No exact web, handoff, container, PR, remote-execution or API claim. |
| T3 Code | 9 | The current product proves harness switching and review, but not web, isolation/worktree mechanics, containers, boards, remote execution, alerts, steering or API control. |
| Vibe Kanban | 7 | No native Windows/Linux client, handoff, container, attention, steering or API guarantee was directly established. |
| Sculptor | 8 | No native Windows/web, handoff, board, inline-review, attention, steering or API claim. |
| HumanLayer | 2 | Cross-agent handoff and container isolation are not documented for the exact product. |
| claude-squad | 10 | Native Windows/web, current lifecycle label, handoff, containers, boards, PR lifecycle, remote execution, alerts and API semantics remain unstated. |
| agent-deck | 6 | Native Windows, handoff, owned review/delivery, board, inline-review and PR-lifecycle guarantees remain unstated. |

### Coding-agent Harnesses

| Product | Unknowns | Preserved boundary |
| --- | ---: | --- |
| Claude Code | 1 | No browser-hosted harness SKU was inferred from web-adjacent Claude products. |
| Codex CLI | 2 | No web CLI or first-party checkpoint/rollback contract was established. |
| GitHub Copilot CLI | 3 | No web CLI, sandbox guarantee or multimodal-input contract was established. |
| Gemini CLI | 2 | No web CLI or multi-provider model contract was established. |
| Amp | 2 | No web CLI or checkpoint contract was established. |
| Prime Agent | 3 | Native Windows, web CLI and an owned Git workflow remain unstated. |
| DeepSeek Harness | 4 | The documented web product does not establish native desktop CLIs or multimodal harness input. |
| pool | 2 | No separate web CLI or multimodal-input contract was established. |
| Kimi Code CLI | 4 | Web, project-instruction precedence, sandboxing and owned Git workflow were not closed in this checkpoint. |
| Kilo Code CLI | 4 | Web, sandbox, checkpoints and multimodal input remain for a follow-up exact-page pass. |
| Mistral Vibe | 5 | Native Windows, web, sandbox, checkpoints and multimodal input remain open. |
| Continue CLI | 5 | Web, sandbox, checkpoints, subagents and multimodal input remain open. |
| Crush | 6 | Web, sandbox, checkpoints, subagents, structured output and multimodal input remain open. |
| Auggie CLI | 5 | Native Windows, web, sandbox, checkpoints and owned Git workflow remain open. |
| Kiro CLI | 2 | Web and multimodal-input semantics remain open. |
| Amplifier | 7 | All platform cells plus sandbox, checkpoints and multimodal input lack an exact current contract. |
| gptme | 4 | Native Windows, web, sandbox and owned Git workflow remain open. |
| Cursor CLI | 10 | Platform, lifecycle, multi-provider, sandbox, checkpoints, subagents and multimodal claims require exact current CLI pages rather than Cursor IDE evidence. |
| Factory Droid CLI | 9 | Platform, lifecycle, multi-provider, checkpoints, Git workflow and multimodal claims require exact CLI evidence. |
| CodeWhale | 7 | Platform, lifecycle, Git workflow and multimodal claims remain unestablished. |
| Antigravity CLI | 6 | Platform, lifecycle and multi-provider claims remain unestablished for the CLI SKU. |
| Muse Code | 21 | No sufficiently specific current first-party capability source was found; the entire column remains an explicit research gap. |
| Qwen Code | 2 | Web and a current lifecycle label remain open. |
| pi coding agent | 5 | All platform cells and lifecycle status remain open rather than inferred from package tooling. |
| OpenCode | 7 | Platform, lifecycle, sandbox and owned Git-workflow claims remain open. |
| Goose | 9 | Platform, lifecycle, checkpoints, structured output, Git workflow and multimodal claims remain open. |
| Aider | 10 | Platform, lifecycle, extension protocol, permissions, sandbox, subagents and structured-output claims remain open. |
| Grok Build | 6 | Platform, lifecycle and multimodal-input claims remain open. |

## Follow-up rule

Future audit automation should treat these remaining cells as a queue of claims, not a queue of presumed failures. A deterministic refresh may flag changed first-party pages and repository releases, but a cell should change state only when its stored source excerpt directly proves the exact row for the exact SKU.
