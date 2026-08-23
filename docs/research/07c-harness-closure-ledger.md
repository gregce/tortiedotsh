# 07c. Harness closure ledger

**Checked:** 2026-08-23

**Scope:** Second-pass closure of `Unknown` cells in the public coding-agent harness matrix.
**Rule:** A cell moves out of `Unknown` only when a first-party page directly documents that capability for the evaluated CLI surface. Product-page silence is not evidence of absence.

## Applied closures

| Product | Criteria closed | First-party evidence |
| --- | --- | --- |
| Claude Code | Sandbox, checkpoints, Git workflow, multimodal input | [Sandboxing](https://code.claude.com/docs/en/sandboxing), [checkpointing](https://code.claude.com/docs/en/checkpointing), [common workflows](https://code.claude.com/docs/en/common-workflows), [tutorials](https://code.claude.com/docs/en/tutorials) |
| Cursor CLI | Extension protocol, project instructions, permissions, structured output, Git workflow | [CLI use](https://docs.cursor.com/en/cli/using), [permissions](https://docs.cursor.com/cli/reference/permissions), [output formats](https://docs.cursor.com/en/cli/reference/output-format), [headless mode](https://docs.cursor.com/en/cli/headless) |
| Gemini CLI | Permissions, subagents | [Policy engine](https://geminicli.com/docs/reference/policy-engine/), [subagents](https://geminicli.com/docs/core/subagents/) |
| Factory Droid CLI | Headless mode, structured output, extensions, project instructions, permissions, sandbox, subagents | [Droid Exec](https://docs.factory.ai/droid-exec/overview), [CLI overview](https://docs.factory.ai/droid-cli/overview), [settings](https://docs.factory.ai/droid-cli/settings), [agent controls](https://docs.factory.ai/enterprise/llm-safety-and-agent-controls) |
| CodeWhale | Headless mode, MCP/extensions, permissions, sandbox, checkpoints, subagents, structured output | [Official repository README](https://github.com/Hmbown/CodeWhale) |
| Antigravity CLI | Headless mode, structured output, extensions, instructions, permissions, sandbox, checkpoints, subagents, Git workflow, multimodal input | [Headless mode](https://antigravity.google/docs/cli/headless/), [features](https://www.antigravity.google/docs/cli/features), [best practices](https://www.antigravity.google/docs/cli/best-practices/), [permissions](https://www.antigravity.google/docs/cli/permissions), [sandbox](https://www.antigravity.google/docs/cli/sandbox/) |
| Qwen Code | Instructions, permissions, sandbox, checkpoints, bounded Git workflow, multimodal input | [Memory](https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/), [settings](https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md), [sandbox](https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/), [filesystem tools](https://qwenlm.github.io/qwen-code-docs/en/developers/tools/file-system/) |
| Pi coding agent | Instructions, structured output, multimodal input; extension-provided checkpoints, subagents, and Git workflow | [Coding-agent README](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md) |
| OpenCode CLI | Instructions, permissions, subagents, structured output, snapshots, multimodal attachments | [Rules](https://opencode.ai/docs/rules), [permissions](https://opencode.ai/docs/permissions/), [agents](https://opencode.ai/docs/agents/), [CLI](https://opencode.ai/docs/cli/), [snapshots](https://opencode.ai/v2/docs/snapshots), [attachments](https://opencode.ai/v2/docs/attachments) |
| GitHub Copilot CLI | Instructions, permissions, sandbox, subagents, structured output, Git workflow | [CLI overview](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview), [tool permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools), [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [product concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| Goose CLI | Permissions, sandbox, subagents | [Official documentation](https://block.github.io/goose/index.html) |
| Aider | Project conventions, Git-backed checkpoints | [Conventions](https://aider.chat/docs/usage/conventions.html), [Git integration](https://aider.chat/docs/git.html) |
| Grok Build | Extension protocol, sandbox, checkpoints, Git workflow | [Official repository README](https://github.com/xai-org/grok-build) |

The second pass raises the public harness matrix from 112 of 238 documented cells (47.1%) to 180 of 238 (75.6%). The remaining 58 cells stay `Unknown`; this ledger does not infer negative capability claims from missing documentation.

## Adjacent workbench closures

- `cmux` gains `Git worktree workflow: Via integration` from the official [customization examples](https://github.com/manaflow-ai/cmux-home/blob/main/docs/customization.md). The example creates a worktree before opening cmux; it is not treated as core cmux behavior.
- `wmux` gains `Project file tree: Limited` from its [official README](https://github.com/openwong2kim/wmux/blob/main/README.md). The evidenced tree belongs to its diff and task-harvest review surface, not a project-wide editor.
