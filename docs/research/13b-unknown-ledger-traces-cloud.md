# Agent Traces and Cloud Agents Unknown ledger

Checked 2026-08-23 against current exact-SKU first-party documentation and canonical repositories.

The machine-readable source of truth is [`takes/three/src/data/unknown-audit-traces-cloud.json`](../../takes/three/src/data/unknown-audit-traces-cloud.json). It contains one disposition, a product-and-row-specific rationale, and the exact source set checked for every current non-platform Unknown rendered through `getComparisonClaim()`.

## Result

| Category | Products | Implemented affirmative closures | Current Unknowns |
| --- | ---: | ---: | ---: |
| Agent Traces | 7 | 3 | 8 |
| Cloud and Background Agents | 12 | 24 | 21 |
| Total | 19 | 27 | 29 |

The ledger excludes platform rows and generated repository metrics. Platform support needs its own exact native-host audit; an omitted OS or web surface is not a negative. Stars, contributors, releases, licenses, and CLOC are deterministic collector outputs and must be repaired through the manifest and freshness gate, not hand-entered as editorial claims.

No `Not available` recommendation was made from missing documentation. Adjacent SKUs were not inherited: Copilot CLI cloud sandboxes do not prove parallel Copilot coding-agent jobs, Replit Routines do not prove triggers for Agent background coding tasks, and GitLab's broader external-agent platform does not prove a Developer Flow capability.

## Implemented affirmative closures

These 27 exact-SKU, first-party-supported claims are now implemented in the catalog. They have therefore been removed from the live Unknown ledger; evidence-registry synchronization remains a separate coordinated step.

| Product | Row | Suggested state | First-party evidence | Exact basis |
| --- | --- | --- | --- | --- |
| SpecStory | `trace-artifact-coverage` | Limited | [Features](https://docs.specstory.com/specstory/features) | Saved conversations explicitly preserve code blocks and diffs; an independent normalized artifact model is not established. |
| SpecStory | `trace-ci-analytics` | Limited | [Cloud Analytics](https://docs.specstory.com/cloud/analytics) | Cross-agent activity, project, duration, concurrency, message, token, and cost analytics are built in; CI and shared-team reporting are not established. |
| Entire | `trace-export-api` | Built in | [CLI changelog](https://github.com/entireio/cli/blob/main/CHANGELOG.md) | Current releases document authenticated `entire api` access and machine-readable checkpoint listing. |
| GitHub Copilot coding agent | `cloud-network-policy` | Built in | [Cloud-agent firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) | Default-limited internet, recommended allowlist, custom organization/repository rules, and policy controls are explicit. |
| Jules | `cloud-parallel-tasks` | Built in | [Limits and plans](https://jules.google/docs/usage-limits) | Current plans publish 3, 15, and 60 concurrent tasks. |
| Jules | `cloud-project-instructions` | Built in | [Getting started](https://jules.google/docs/) | Jules automatically reads root `AGENTS.md`. |
| Jules | `cloud-task-limit` | Fact | [Limits and plans](https://jules.google/docs/usage-limits) | Publish `15 / 100 / 300 daily; 3 / 15 / 60 concurrent`. |
| Jules | `cloud-triggered-automation` | Built in | [REST API quickstart](https://jules.google/docs/api/reference/) | The API creates and manages sessions and is explicitly intended for CI/CD and workflow integrations. |
| Factory cloud sessions | `cloud-code-hosts` | Built in | [Self-managed source control](https://docs.factory.ai/enterprise/self-managed-scm) | Factory documents GitHub, GitHub Enterprise, GitLab, and GitLab Self-Hosted repository access in sessions. |
| Factory cloud sessions | `cloud-network-policy` | Built in | [Deployment patterns](https://docs.factory.ai/enterprise/network-and-deployment) | Cloud, hybrid, and air-gapped execution plus outbound restrictions, proxies, custom CAs, and managed network settings are explicit. |
| Factory cloud sessions | `cloud-project-instructions` | Built in | [AGENTS.md](https://docs.factory.ai/harness/agents-md) | Droid loads root and nested repository instruction files with documented precedence. |
| Factory cloud sessions | `cloud-triggered-automation` | Built in | [Custom Automations](https://docs.factory.ai/software-factory/automations) | Schedules, Slack messages, and GitHub events start Droid workflows. |
| Codegen | `cloud-sandbox` | Built in | [Code execution sandboxes](https://docs.codegen.com/sandboxes/overview) | Agents run in secure isolated sandboxes with filesystem, terminal, process, and controlled-network access. |
| Codegen | `cloud-environment-config` | Built in | [Setup commands](https://docs.codegen.com/sandboxes/setup-commands) | Repository setup commands create reusable snapshots; environment variables and encrypted repository secrets are separately documented. |
| Codegen | `cloud-network-policy` | Built in | [Code execution sandboxes](https://docs.codegen.com/sandboxes/overview) | Sandbox networking is controlled and can be restricted. |
| Codegen | `cloud-project-instructions` | Built in | [Agent Rules](https://docs.codegen.com/settings/repo-rules) | User, organization, and repository rules plus automatic `AGENTS.md` and compatible-file discovery are explicit. |
| Codegen | `cloud-live-steering` | Built in | [Triggering Codegen](https://docs.codegen.com/capabilities/triggering-codegen) | Follow-ups in the originating thread, issue, ticket, or PR return to the same agent context; the API also resumes runs with a prompt. |
| Codegen | `cloud-isolation-unit` | Fact | [Code execution sandboxes](https://docs.codegen.com/sandboxes/overview) | Publish `Isolated sandbox per agent context`. |
| Codegen | `cloud-human-takeover` | Built in | [Remote Editor](https://docs.codegen.com/sandboxes/editor) | Password-protected VS Code opens the active sandbox for terminal access, debugging, inspection, and manual edits. |
| GitLab Duo Developer Flow | `cloud-environment-config` | Built in | [Flow execution](https://docs.gitlab.com/user/duo_agent_platform/flows/execution/) | Committed agent config, setup scripts, images, caches, variables, tokens, and runner selection are documented. |
| GitLab Duo Developer Flow | `cloud-network-policy` | Built in | [Remote execution sandbox](https://docs.gitlab.com/user/duo_agent_platform/environment_sandbox/) | SRT supplies a default allowlist and project, group, and instance allow/deny policy for remote flows. |
| Coder Agents | `cloud-code-hosts` | Built in | [Architecture](https://coder.com/docs/ai-coder/agents/architecture) | Existing external auth covers GitHub, GitLab, and Bitbucket; the provider guide includes enterprise and self-hosted variants. |
| Coder Agents | `cloud-network-policy` | Built in | [Template optimization](https://coder.com/docs/ai-coder/agents/platform-controls/template-optimization) | The workspace is the explicit network boundary and can restrict egress to the control plane and Git provider. |
| Coder Agents | `cloud-project-instructions` | Built in | [Getting started](https://coder.com/docs/ai-coder/agents/getting-started) | Coder automatically loads workspace `AGENTS.md`; an administrator system prompt is also supported. |
| Coder Agents | `cloud-triggered-automation` | Built in | [Getting started](https://coder.com/docs/ai-coder/agents/getting-started) | The beta Chats API and service-to-service API-key guidance establish programmatic automation. |
| Replit Agent background tasks | `cloud-project-instructions` | Built in | [replit.md announcement](https://docs.replit.com/updates/2025/07/11/changelog) | Agent automatically reads the root project file for architecture, conventions, and preferred tools. |
| Replit Agent background tasks | `cloud-task-limit` | Fact | [Task system](https://docs.replit.com/core-concepts/agent/task-system) | Publish `1 concurrent on Core; up to 10 on Pro`; excess accepted tasks queue. |

## Agent Traces ledger index

The OSS products received the deepest source inspection. Internal interfaces, database accessibility, and operator deployment were not substituted for a supported export, collaboration, artifact, or privacy feature.

| Product ID | Current Unknown count | Disposition |
| --- | ---: | --- |
| `tapes` | 5 | Remain: `trace-git-linkage`, `trace-replay-resume`, `trace-artifact-coverage`, `trace-redaction-privacy`, `trace-sharing` |
| `traces-com` | 1 | Remain: `trace-artifact-coverage` |
| `agent-sessions` | 2 | Remain: `trace-export-api`, `trace-sharing` |

`agentsview` and `claude-code-history-viewer` have no current non-platform Unknown cells.

Important exact-product boundaries:

- Tapes `backfill` replays captured bytes into a deployment. It is not a user session replay or resume workflow. Its current architecture also explicitly says it has no checkout or user-facing history-branching workflow.
- Traces JSONL export retains typed message parts and tool calls, but that does not prove a normalized workspace-artifact or diff model.
- Agent Sessions is local-only and read-only, but local storage is not an export contract and “no telemetry” is not a collaboration workflow.
- Entire's new public CLI surfaces now cross the prior export/API threshold; internal Go store interfaces alone would not have done so.

## Cloud Agents ledger index

| Product ID | Current Unknown count | Cells that remain Unknown |
| --- | ---: | --- |
| `openai-codex-cloud` | 1 | `cloud-task-limit` |
| `github-copilot-coding-agent` | 1 | `cloud-parallel-tasks` |
| `devin` | 2 | `cloud-network-policy`, `cloud-task-limit` |
| `jules` | 1 | `cloud-network-policy` |
| `claude-code-web` | 1 | `cloud-task-limit` |
| `cursor-cloud-agents` | 1 | `cloud-task-limit` |
| `factory-cloud-sessions` | 1 | `cloud-task-limit` |
| `codegen-agent` | 2 | `cloud-parallel-tasks`, `cloud-task-limit` |
| `gitlab-duo-developer-flow` | 4 | `cloud-parallel-tasks`, `cloud-live-steering`, `cloud-task-limit`, `cloud-human-takeover` |
| `coder-agents` | 1 | `cloud-task-limit` |
| `replit-agent-background-tasks` | 4 | `cloud-code-hosts`, `cloud-environment-config`, `cloud-network-policy`, `cloud-triggered-automation` |
| `openhands-cloud` | 2 | `cloud-network-policy`, `cloud-task-limit` |

Run-limit discipline matters. Resource ceilings, API request quotas, billing limits, setup-step timeouts, and idle workspace autostop are not maximum task runtimes. They remain Unknown unless the vendor publishes an exact run ceiling for the product in this row.

## Validation contract

The ledger was reconciled to the current catalog with these invariants:

1. derive every non-platform Unknown key as `productId::rowId` through `getComparisonClaim()`;
2. exclude only the declared UI backlog products;
3. assert the ledger and catalog key sets are identical, with no duplicate or extra keys;
4. require every cell to have exactly one disposition and a non-empty product-and-row-specific rationale;
5. keep implemented closures out of the ledger once the catalog resolves them affirmatively;
6. preserve every unsupported negative as Unknown rather than inferring absence from documentation silence.

Validated result: 29 catalog keys, 29 ledger keys, 29 unique keys, no missing keys, no extra keys, 27 implemented affirmative closures, and 29 preserved Unknowns.
