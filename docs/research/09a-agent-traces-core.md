# 09a. Agent Traces: category definition and core evidence ledger

**Snapshot:** 2026-08-23

**Scope:** products whose primary workflow object is a durable provenance or observability record of coding-agent work.
**Evidence rule:** first-party current product documentation and canonical product repositories only. An omitted claim remains `Unknown`; absence from a feature list is never scored as `Not available`.

## Category ruling

Agent Traces is a separate category because the user returns to the record of the work, not primarily to an editor window, live terminal session, delegated task, remote job, or relay. The record may be a Markdown transcript, Git checkpoint, normalized trace/span tree, hosted timeline, or local database. The durable object must retain coding-agent-specific structure such as prompts, responses, tools, files, checkpoints, or harness identity.

The route is `/compare/agent-traces/`. SpecStory is first by explicit editorial instruction. The first implementation set is:

1. SpecStory
2. Entire
3. Tapes by Paper Compute Co.
4. Traces
5. AgentsView

Generic LLM observability products are not automatically peers. They belong only when a current first-party source documents coding-agent capture and the resulting agent-work record as a primary workflow.

## Shared row model

| Row ID | Label | Claim boundary |
| --- | --- | --- |
| `trace-capture-coverage` | Harness and client capture | Exact supported clients, hooks, imports, proxies, or instrumentation lanes |
| `trace-storage-boundary` | Storage boundary | Local files/database, Git, vendor cloud, or operator service |
| `trace-git-linkage` | Commit, branch, and worktree linkage | Automatic or explicit provenance links; versionable files alone are Limited |
| `trace-replay-resume` | Replay or session reconstruction | Native reopen, rewind, resume, fork, or context reconstruction |
| `trace-search-timeline` | Searchable session timeline | Search or browsing over durable recorded events |
| `trace-multi-harness` | Multi-harness ingestion | More than one named coding-agent source normalized by the product |
| `trace-transcript-coverage` | Prompt and transcript coverage | User, assistant, thinking, and nested-session content where documented |
| `trace-tool-call-coverage` | Tool calls and results | Structured calls, arguments, results, timing, or provider-turn equivalents |
| `trace-artifact-coverage` | Artifacts, files, and diffs | Workspace artifacts or changes, not merely code fences in prose |
| `trace-export-api` | Export or ingestion API | Machine-readable export, local/hosted API, MCP, OTLP, or CI ingestion |
| `trace-redaction-privacy` | Redaction and privacy controls | Data boundary, secret handling, explicit sync, and visibility controls |
| `trace-sharing` | Collaboration and sharing | Repository review, links, Gists, teams, or organizations |
| `trace-ci-analytics` | CI and team analytics | CI ingestion and aggregate team/project reporting; personal analytics alone are Limited |
| `trace-self-hosting` | Self-hosting | Operator-owned complete deployment, not just a local capture client |

## Exact product identities and source boundaries

| Product | Canonical product source | Canonical repository and license | Platforms and execution | Source boundary | Status |
| --- | --- | --- | --- | --- | --- |
| SpecStory | [Documentation](https://docs.specstory.com/) | [`specstoryai/getspecstory`](https://github.com/specstoryai/getspecstory), Apache-2.0 for the public CLI/source tree | macOS, Windows, Linux local CLI/IDE capture; optional browser Cloud | Split-source. The CLI and skills are public; current first-party material does not establish the IDE extensions and Cloud service as the same open-source artifact. | Active |
| Entire | [Product](https://entire.io/) | [`entireio/cli`](https://github.com/entireio/cli), MIT | macOS, Windows, Linux CLI; optional browser dashboard | The primary Entire checkpoint product and its Git-backed record are implemented by the MIT CLI. Hosted account/dashboard behavior is not used to infer source availability for unverified service code. | Active |
| Tapes | [Introduction](https://tapes.dev/docs/introduction/) | [`papercomputeco/tapes`](https://github.com/papercomputeco/tapes), dual MIT/Apache-2.0 in the repository README | macOS, Windows, Linux binaries; local/container/operator-hosted server and PostgreSQL | Open-source server is the product source. `tapesctl` is a separately versioned first-party capture client, so its repository is supporting source rather than the metrics repository for this column. | Active |
| Traces | [Documentation](https://traces.com/docs) | No public product-source repository established. [`traces-sh/mcp`](https://github.com/traces-sh/mcp) is only the open-source MCP integration and must not be counted as product source. | Native macOS/Linux/Windows CLI plus browser service | Hosted service. Public docs describe local SQLite discovery and a vendor-hosted namespace, but not public source for the shipped CLI/web product. | Active |
| AgentsView | [Product](https://www.agentsview.io/) | [`kenn-io/agentsview`](https://github.com/kenn-io/agentsview), MIT | macOS, Windows, Linux CLI/desktop plus a locally served web UI | Open-source product source. SQLite is primary; PostgreSQL, DuckDB/Quack, Docker, and S3-compatible inputs are optional operator-controlled boundaries. | Active |

## Capability ledger

Legend: `BI` built in, `LIM` limited, `UNK` unknown. Facts use their literal value in the implementation.

| Product | Capture | Storage | Git linkage | Replay/resume | Search/timeline | Multi-harness | Transcript | Tool calls | Artifacts/diffs | Export/API | Privacy | Sharing | CI/team analytics | Self-host |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SpecStory | fact | fact | LIM | BI | BI | BI | BI | BI | UNK | fact | BI | BI | UNK | LIM |
| Entire | fact | fact | BI | BI | BI | BI | BI | BI | BI | UNK | BI | BI | LIM | BI |
| Tapes | fact | fact | UNK | UNK | BI | BI | BI | BI | UNK | BI | UNK | UNK | LIM | BI |
| Traces | fact | fact | BI | LIM | BI | BI | BI | BI | UNK | BI | BI | BI | BI | LIM |
| AgentsView | fact | fact | LIM | LIM | BI | BI | BI | BI | LIM | BI | LIM | BI | LIM | BI |

## Product evidence

### SpecStory

The [terminal-agent overview](https://docs.specstory.com/integrations/terminal-coding-agents) says the wrapper turns commands, responses, and decisions into searchable Markdown and names Claude Code, Cursor CLI, Codex CLI, Droid, Antigravity, Cursor IDE, and DeepSeek capture paths. The current [CLI usage reference](https://docs.specstory.com/integrations/terminal-coding-agents/usage) adds `run`, `watch`, `sync`, `search`, `list`, and cross-project/cross-agent `resume`; documents `.specstory/history/` and `~/.specstory/sessions.db`; and exposes JSON/stdout, optional OTLP, secret redaction, usage-analytics opt-out, and optional Cloud sync. The [Cloud quickstart](https://docs.specstory.com/cloud/quickstart) states that local capture precedes explicit authentication and sync. [Session sharing](https://docs.specstory.com/cloud/session-sharing) requires an explicit sharing action.

Rulings:

- Git linkage is Limited: project-local Markdown can be committed and reviewed, but no automatic commit/branch/worktree binding is established.
- Artifact/diff capture stays Unknown: first-party docs establish transcripts, commands, and responses, not a normalized independent artifact or workspace-diff record.
- CI/team analytics stays Unknown. The Cloud quickstart explicitly describes current Cloud collaboration scope, but does not establish CI reporting.
- Self-hosting is Limited: local capture/search are operator-owned; a self-hosted Cloud deployment is not documented.

### Entire

The canonical repository is [`entireio/cli`](https://github.com/entireio/cli). Its README documents lifecycle hooks, checkpoint creation on commit, `status`, `session resume`, `rewind`, `checkpoint search`, `checkpoint explain`, multiple concurrent sessions, worktree isolation, separate checkpoint remotes, transcripts, file changes, and best-effort secret redaction. [Sessions and checkpoints architecture](https://github.com/entireio/cli/blob/main/docs/architecture/sessions-and-checkpoints.md) defines active state under `.git/entire-sessions/`, the legacy `entire/checkpoints/v1` branch, the recommended `refs/entire/checkpoints/...` backend, and adapters for Claude Code, Codex, Gemini CLI, OpenCode, Cursor, Droid, and Copilot CLI. The [product page](https://entire.io/) explicitly says prompts and tool calls are stored with commits and that core setup is fully open source.

Rulings:

- Export/API stays Unknown. Git-backed storage is inspectable and portable, but this audit did not find a current product export or ingestion API contract.
- CI/team analytics is Limited. First-party organization material documents a dashboard across repositories, while a dedicated CI analytics contract was not established.
- Self-hosting is Built in for the core checkpoint system: capture and persistent session data run locally and live in operator-controlled Git refs.

### Tapes by Paper Compute Co.

The exact product is Tapes, not the Paper Compute organization or its separate orchestration products. The canonical product repository is [`papercomputeco/tapes`](https://github.com/papercomputeco/tapes). Its README defines an append-only `raw_turns` log, deterministic derivation into sessions → traces → spans, PostgreSQL storage, statistics, raw-turn reads, and content-addressed provenance. The [introduction](https://tapes.dev/docs/introduction/) documents session inspection, token/cost measurement, semantic search, exports, and local setup. [Agent integrations](https://tapes.dev/docs/integrations/) documents proxy/transcript/plugin lanes for Claude Code, Codex, Codex desktop, Pi, and compatible clients. The [client command reference](https://tapes.dev/docs/tapesctl/commands/) documents JSONL exports and the read/ingest APIs.

Rulings:

- Git linkage, replay/resume, artifacts/diffs, redaction, and sharing stay Unknown. None is inferred from generic session storage or from adjacent Paper Compute repositories.
- CI/team analytics is Limited: span-grain stats, token, and cost folds are documented, but CI- or team-specific reporting is not.
- Self-hosting is Built in: the operator runs the server, PostgreSQL, API, proxy, and derive worker.

### Traces

The exact product is Traces at [traces.com](https://traces.com/), not the unrelated repositories using similar names. [Getting started](https://traces.com/docs/getting-started) documents native-session discovery from JSONL, SQLite, and JSON, normalization into typed messages, and upload to the service. The [supported documentation index](https://traces.com/docs) names Claude Code, Cursor, OpenCode, Codex, Pi, Amp, Copilot, Cline, and OpenClaw. [Git-hook sharing](https://traces.com/docs/sharing/git-hooks) attaches traces to commits through Git notes and records repository, branch, and commit refs. The [CLI command reference](https://traces.com/docs/cli/commands) documents local event search, bounded timelines, remote sync, and macOS-only exact native resume. [Data export](https://traces.com/docs/traces-web/exports) produces JSONL traces, messages, and typed parts including tool calls. The [ingestion API](https://traces.com/docs/api-reference) supports namespace-scoped publishing.

Rulings:

- Artifacts/diffs stay Unknown. Typed tool-call parts do not establish normalized workspace artifacts or diffs.
- Replay/resume is Limited because exact native resume is documented only on macOS; continuation guidance is not equivalent to replay.
- Self-hosting is Limited because the product page lists self-host/on-prem only under custom enterprise terms.
- Do not attach `traces-sh/mcp` as the metrics repository: it is an integration, not the source of the Traces product.

### AgentsView

The canonical repository is [`kenn-io/agentsview`](https://github.com/kenn-io/agentsview). The README defines a no-account local-first archive that discovers many coding-agent formats into SQLite, serves a local web UI, provides usage and cost tracking, supports desktop packages and Docker, and optionally mirrors to PostgreSQL or DuckDB and reads S3-compatible session roots. The [usage guide](https://github.com/kenn-io/agentsview/blob/main/docs/usage.md) documents FTS5/semantic/hybrid search, transcript and subagent rendering, structured tool calls and results, activity timelines, project/agent/cost/health analytics, CSV/Markdown/JSON/API export, Gist sharing, repo/worktree context, and patch rendering when a source transcript exposes patch payloads.

Rulings:

- Git linkage is Limited: repository, branch, and worktree context are present, but automatic commit-to-session binding is not established.
- Replay/resume is Limited: context export and selected Claude forking are documented, while general native replay across harnesses is not.
- Artifact coverage is Limited: patch-bearing calls render as diffs only when the source transcript supplies the patch; independent workspace artifacts are not claimed.
- Privacy is Limited: data is local and loopback-bound by default, but automatic transcript redaction is not established.
- CI/team analytics is Limited: rich personal/project analytics and optional shared stores are documented, but a dedicated CI reporting workflow is not.

## Open-source metrics joins

The comparison manifest joins only true or substantial product-source repositories:

| Metric ID | Repository | Relationship |
| --- | --- | --- |
| `specstory` | `specstoryai/getspecstory` | Public CLI/source tree for a split-source product |
| `entire` | `entireio/cli` | Product source |
| `tapes` | `papercomputeco/tapes` | Product source |
| `agentsview` | `kenn-io/agentsview` | Product source |

Traces has no metrics join. Its open-source MCP repository is intentionally excluded because repository counts for an integration would misrepresent the hosted product.

## Maintenance notes

- Product claims remain human-reviewed and source-linked. A source change creates a review item; it must not silently rewrite a capability state.
- Repository releases, contributors, language bytes, activity, and optional LOC follow the shared deterministic metrics collector.
- The Tapes column tracks the server product release; `tapesctl` compatibility should be reviewed as a supporting capture surface.
- SpecStory's source boundary must be rechecked if extensions or Cloud source are published or their SKU identity changes.
- `Unknown` cells are deliberate review gaps, not negative scores.
