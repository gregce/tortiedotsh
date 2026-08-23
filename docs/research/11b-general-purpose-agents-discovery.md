# General Purpose Agents discovery

Checked 2026-08-23. This pass looks beyond the already named OpenClaw, Hermes Agent, and exact-SKU Grok Bot. It uses first-party product documentation and canonical repositories for product identity and capability claims. GitHub adoption and activity figures were read from the GitHub repository API on the check date.

## Category boundary

A General Purpose Agent is a persistent agent or agent workspace whose primary object is broad work rather than a code repository. It should span several of browser/web, files and terminal, desktop applications, communications, integrations, memory, and scheduled or background work.

Exclude or re-route:

- coding-only tool loops and CLIs to Harnesses;
- worktree or multi-session coding control planes to Agent Multiplexers or Agent Orchestrators;
- browser-only automation libraries to Extensions or a future browser-agent category;
- SDKs, evaluation systems, and agent-building frameworks without a maintained end-user agent surface;
- chatbots whose first-party material does not establish meaningful tool or computer ownership.

This boundary is intentionally about the object the user returns to. A product does not move to Agent Orchestrators merely because it invokes subagents internally.

## Recommended launch set

The named baseline remains OpenClaw, Hermes Agent, and Grok Bot. The strongest additional launch columns are:

1. **nanobot** — the clearest lightweight open-source personal-agent peer, with unusually complete first-party evidence and very high adoption.
2. **Agent Zero** — a broad, self-hosted agent workbench with a full Linux computer, browser, office documents, project memory, scheduling, and subordinate agents.
3. **Perplexity Computer** — a major hosted general-purpose worker with persistent memory, connectors, sandboxed execution, subagents, and scheduled work.
4. **Manus** — a major hosted general agent spanning its cloud computer and folder-scoped local desktop execution.
5. **Genspark Super Agent** — a major hosted general agent with a dedicated browser/filesystem/execution sandbox, app context, reusable skills, and parallel background work.

The open-source breadth wave should then add **ZeroClaw**, **IronClaw**, **PicoClaw**, **OpenFang**, and **Agent TARS**. Each has significant adoption and a distinct comparison story; none is included merely because it is an OpenClaw rewrite.

## Open-source adoption and exact repository joins

The figures below are repository counts, not product-quality scores. `pushed_at` is the latest repository push reported by GitHub at check time.

| Product | Decision | Manifest ID | Canonical repository | Stars | Forks | `pushed_at` | License basis |
|---|---|---|---|---:|---:|---|---|
| OpenClaw | Named baseline | `openclaw` | [`openclaw/openclaw`](https://github.com/openclaw/openclaw) | 387,266 | 81,329 | 2026-08-23T22:42:28Z | MIT in repository README/license |
| Hermes Agent | Named baseline | `hermes-agent` | [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent) | 234,940 | 47,331 | 2026-08-23T22:45:49Z | MIT |
| nanobot | Include at launch | `nanobot` | [`HKUDS/nanobot`](https://github.com/HKUDS/nanobot) | 47,310 | 8,352 | 2026-08-23T18:17:59Z | MIT |
| Agent Zero | Include at launch | `agent-zero` | [`agent0ai/agent-zero`](https://github.com/agent0ai/agent-zero) | 18,946 | 3,757 | 2026-08-23T15:01:09Z | MIT in canonical [`LICENSE`](https://github.com/agent0ai/agent-zero/blob/main/LICENSE) |
| ZeroClaw | Include, breadth wave | `zeroclaw` | [`zeroclaw-labs/zeroclaw`](https://github.com/zeroclaw-labs/zeroclaw) | 32,636 | 4,909 | 2026-08-23T20:34:55Z | Apache-2.0/MIT repository licenses |
| IronClaw | Include, breadth wave | `ironclaw` | [`nearai/ironclaw`](https://github.com/nearai/ironclaw) | 12,602 | 1,488 | 2026-08-23T22:33:00Z | Apache-2.0 or MIT |
| PicoClaw | Include, breadth wave | `picoclaw` | [`sipeed/picoclaw`](https://github.com/sipeed/picoclaw) | 29,910 | 4,450 | 2026-08-19T09:17:33Z | MIT |
| OpenFang | Include, breadth wave | `openfang` | [`RightNow-AI/openfang`](https://github.com/RightNow-AI/openfang) | 18,130 | 2,285 | 2026-07-02T08:13:12Z | Apache-2.0 or MIT |
| Agent TARS | Include, breadth wave | `agent-tars` | [`bytedance/UI-TARS-desktop`](https://github.com/bytedance/UI-TARS-desktop) | 38,697 | 3,907 | 2026-08-05T02:48:59Z | Apache-2.0 |

The Agent TARS join is deliberately repository-level: the canonical repository ships both Agent TARS and UI-TARS Desktop. The product column should be named **Agent TARS**, and its claims must not silently borrow UI-TARS Desktop-only capabilities unless the cell says so.

Every included repository should enter `open-source-projects.json` with LOC enabled and be refreshed through the same version-pinned CLOC pipeline as the rest of the public-source fleet.

## Implementation-ready evidence for strong additions

These are affirmative claims only. Unmentioned features remain `Unknown`; absence from a README is not evidence of unavailability.

### nanobot

Primary source: [canonical repository](https://github.com/HKUDS/nanobot).

- Product identity: self-hosted personal AI agent runtime, not merely an SDK.
- Surfaces: WebUI, native terminal client, OpenAI-compatible API, and chat apps.
- Platforms/deployment: Python 3.11+ source/package install; documented macOS/Linux installer, Windows PowerShell installer, Docker, Linux service, and macOS LaunchAgent deployment.
- Persistence: saved session history, long-term Dream memory, persistent topics/workspaces, and a background gateway that keeps channels and automations running.
- Tools: files, shell, web search/fetch, MCP, cron, image generation, and subagents.
- Communications: Telegram, Discord, Slack, WeChat/Feishu, email, Mattermost, Teams, and other documented adapters.
- Automation/delegation: long-horizon goals, scheduled automations, and isolated subagents.
- Execution owner: operator-controlled local or self-hosted server gateway; cloud deployment is optional.
- Source model: MIT open source.

### Agent Zero

Primary source: [canonical repository](https://github.com/agent0ai/agent-zero).

- Product identity: an end-user agent workbench as well as an extensible framework.
- Surfaces/platforms: web UI plus A0 Launcher/CLI; documented Docker paths for macOS, Linux, and Windows on x86 and ARM64.
- Computer/browser/files: full Dockerized XFCE Linux desktop, terminal and files, native browser with click/type/upload/screenshots and DOM annotation, plus an explicit bridge to selected host-machine files and shell.
- Persistence: projects isolate workspaces, instructions, memory, secrets, knowledge, repositories, and model presets; Time Travel supplies snapshot/diff/revert for the agent workspace.
- Apps and artifacts: live Markdown cowork plus LibreOffice Writer, Calc, and Impress; rich browser and desktop work is observable in the Canvas.
- Integrations: more than 100 community plugins plus MCP, A2A, custom tools, prompts, and skills.
- Automation/delegation: recurring scheduled operations and subordinate agents with their own contexts.
- Security boundary: Docker is the recommended isolation boundary; host-machine access is separately granted. The project warns against mounting the whole home directory.
- Source model: MIT open source.

### ZeroClaw

Primary source: [canonical repository](https://github.com/zeroclaw-labs/zeroclaw).

- Product identity: a self-hosted personal-agent runtime packaged as one Rust binary.
- Platforms: explicit Linux, macOS, Windows, FreeBSD, NixOS, and Docker installation paths.
- Tools: shell, browser, HTTP, hardware, and custom MCP servers.
- Communications: 30+ adapters including Discord, Telegram, Matrix, email, voice, webhooks, and CLI.
- Persistence: SQLite and embeddings are first-party architecture components.
- Security: configuration exposes autonomy, sandboxing, and tool-receipt controls; do not infer the exact default policy without the linked security page.
- Execution owner: runs on the operator's machine, with their keys and workspace.
- Source model: Apache-2.0/MIT repository licenses.

### IronClaw

Primary source: [canonical repository](https://github.com/nearai/ironclaw).

- Product identity: a secure personal AI assistant and Agent OS, not only a library.
- Platforms/surfaces: background service, browser WebUI, terminal REPL; documented macOS, Linux, and Windows/WSL installation.
- Persistence: encrypted local data, hybrid full-text/vector memory, workspace files, and identity files across sessions.
- Communications: REPL, web gateway, HTTP webhooks, Telegram, Slack, Discord, and other documented channels.
- Automation: cron routines, event triggers, webhook handlers, proactive heartbeats, and parallel isolated jobs.
- Integrations: MCP plus dynamically built and drop-in WASM tools/channels.
- Security boundary: untrusted tools run in capability-limited WASM; container jobs use per-job tokens; secrets are injected at the host boundary; HTTP endpoints can be allowlisted.
- Source model: dual Apache-2.0/MIT open source.

### PicoClaw

Primary source: [canonical repository](https://github.com/sipeed/picoclaw).

- Product identity: a low-footprint personal assistant rather than a generic Go agent library.
- Surfaces/platforms: browser WebUI launcher, terminal/gateway paths, Android APK/Termux, Docker, and binaries across RISC-V, ARM, MIPS, and x86.
- Communications: 19+ documented channels including Telegram, Discord, WhatsApp, Weixin, QQ, Slack, Matrix, DingTalk, Feishu/Lark, LINE, WeCom, VK, and IRC.
- Tools/integrations: MCP, web search, vision/image input, model routing, subagents, hooks, and cron are documented in the current release history and guides.
- Persistence/automation: the product demonstrates scheduling, automation, and remembering; do not claim a specific memory algorithm without its exact memory guide.
- Execution owner: operator-controlled local, Docker, VM, Android, or low-cost edge hardware.
- Source model: MIT open source.

### OpenFang

Primary source: [canonical repository](https://github.com/RightNow-AI/openfang).

- Product identity: a self-hosted Agent OS for autonomous scheduled agents, explicitly not presented as a chatbot or multi-agent framework.
- Surfaces/platforms: one Rust binary, local dashboard, CLI/TUI, and Tauri desktop app; installation is documented for macOS/Linux shell and Windows PowerShell.
- Automation: seven bundled “Hands” run independently on schedules; examples cover research, monitoring, lead generation, publishing, browser workflows, and media production.
- Browser/human control: the Browser Hand has persistent sessions and an explicit purchase approval gate; the Twitter Hand has a publication approval queue.
- Communications: 40 adapters are documented, including Telegram, Discord, Slack, WhatsApp, Signal, Matrix, email, Teams, Google Chat, Feishu/Lark, and webhooks.
- Persistence: SQLite, vector memory, canonical sessions, compaction, and a knowledge-graph-oriented workflow are documented.
- Tools/delegation: 53 tools plus MCP/A2A, scheduled Hands, and an agent kernel; treat “Hands” as autonomous capability packages, not as proof of arbitrary peer-agent collaboration.
- Security: WASM tool sandbox, capability gates, signed manifests, audit trail, prompt-injection checks, and approval gates are affirmative first-party claims.
- Source model: Apache-2.0/MIT open source.

### Agent TARS

Primary source: [canonical repository](https://github.com/bytedance/UI-TARS-desktop).

- Product identity: Agent TARS is the general multimodal product in the repository; UI-TARS Desktop is a separate native GUI-agent product in the same repository.
- Surfaces: Agent TARS ships a CLI, WebUI, and headless server path.
- Browser/computer: hybrid browser control supports GUI, DOM, or combined strategies; multimodal GUI/vision and MCP tools are core features.
- Execution: current first-party material documents an isolated AIO agent sandbox and streaming shell/multi-file tool output.
- Platforms: the shared repository explicitly documents UI-TARS Desktop on Windows, macOS, and browser. Keep Agent TARS native OS cells `Unknown` until its own install docs affirm them.
- Persistence, messaging, schedules, and cross-session memory: remain `Unknown` in this category based on the reviewed first-party material.
- Source model: Apache-2.0 open source.

### Perplexity Computer

Primary sources: [product page](https://www.perplexity.ai/products/computer), [What is Computer?](https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer), and [scheduled tasks](https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks).

- Product identity: hosted general-purpose digital worker, distinct from Perplexity Search and the Comet browser.
- Surfaces: web desktop, iOS, Android, Slack, Microsoft 365, and email are documented access paths.
- Persistence: persistent memory across sessions and platforms; long-running tasks can operate for hours or months.
- Tools/integrations: browser automation, code, document/artifact creation, and hundreds of connectors including Gmail, Outlook, GitHub, Linear, Slack, Notion, Snowflake, Databricks, and Salesforce.
- Automation/delegation: asynchronous background execution, recurring and condition-triggered work, parallel research, and specialist subagents.
- Security boundary: personal cloud sandbox described as secure and isolated.
- Execution owner/source model: vendor cloud, proprietary hosted service; no public product-source repository should be invented.

### Manus

Primary sources: [Desktop documentation](https://manus.im/docs/features/desktop), [Cloud Computer](https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer), and [Agent Skills](https://manus.im/features/agent-skills).

- Product identity: one general-purpose Manus product spanning hosted task execution and the optional Desktop “My Computer” capability.
- Platforms: Desktop is documented for macOS and Windows; hosted access is web-based.
- Computer/files/terminal: folder-scoped local file access, command execution, local applications, and CLI tools; cloud tasks use an isolated Ubuntu VM with filesystem and shell execution.
- Persistence: projects and delivered outputs persist; Cloud Computer is an always-on persistent VM whose files, tools, and processes survive between sessions.
- Browser/integrations: browser automation, code, files, skills, scheduled tasks, and connected services are documented.
- Human control: local folders require explicit authorization and commands prompt for scoped approval under the current Desktop documentation.
- Execution owner: hybrid vendor cloud or user-authorized local desktop.
- Source model: proprietary hosted/desktop product; no public source repository should be joined.

### Genspark Super Agent

Primary sources: [Super Agent help](https://www.genspark.ai/helpcenter/super-agent) and [SecondBrain](https://www.genspark.ai/helpcenter/secondbrain).

- Product identity: Genspark's autonomous general assistant, distinct from its specialized Slides, Sheets, Docs, and Code products.
- Environment: current Super Agent has a dedicated sandbox with a real browser, filesystem, and execution.
- Breadth: research, content, analysis, design, coding, communication, app context, and delivered files are documented.
- Persistence: delivered files stay with a project; SecondBrain supplies personal context across email, calendar, chat, meetings, files, and connected apps.
- Automation/delegation: reusable saved skills, several parallel tasks in one project, background execution after the laptop closes, and coordination of specialized agents.
- Integrations: Gmail/Outlook action and a broad connected-app/SecondBrain surface are documented; do not translate a marketing count into a specific connector list without its first-party directory.
- Execution owner/source model: vendor cloud, proprietary hosted service; no public product-source repository should be invented.

## Defer and reject ledger

| Candidate | Public signal checked 2026-08-23 | Decision | Reason |
|---|---:|---|---|
| LobsterAI | 5,939 stars; 938 forks; pushed 2026-08-21 | Re-route to Agent Orchestrators | Strong product and open source, but its own README defines Cowork as the product/session layer and foregrounds custom multi-agent workflows. Its object is closer to a Cowork control plane than one persistent general teammate. Manifest ID if added there: `lobsterai`, repo `netease-youdao/LobsterAI`. |
| Suna | 20,132 stars; 3,432 forks; pushed 2026-08-23 | Re-route to Agent Orchestrators | Current exact identity is “The Company AI Command Center” / open-source AI management system using OpenCode sessions, not the earlier single generalist-agent pitch. Manifest ID: `suna`, repo `kortix-ai/suna`. |
| Eigent | 15,085 stars; 1,791 forks; pushed 2026-08-23 | Re-route to Agent Orchestrators | First-party identity is an open-source Cowork desktop for building and managing an AI workforce. Manifest ID: `eigent`, repo `eigent-ai/eigent`. |
| OpenManus | 58,052 stars; 10,083 forks; pushed 2026-08-22 | Defer / Harness watchlist | General browser-and-terminal loop with exceptional adoption, but current first-party material is a terminal-launched agent/framework and calls its multi-agent mode unstable. It does not yet establish the persistent personal/workspace semantics required here. Repo `FoundationAgents/OpenManus`. |
| AstrBot | 39,526 stars; 2,832 forks; pushed 2026-08-21 | Defer | Major IM assistant/framework, but the reviewed first-party identity is channel/plugin led. Require exact terminal/files/browser ownership and persistence evidence before a broad-computer-agent column. Repo `AstrBotDevs/AstrBot`. |
| Moltis | 2,833 stars; 340 forks; pushed 2026-08-21 | Watchlist | Exact secure persistent personal-agent fit with memory, channels and sandboxing, but adoption remains below the included differentiated Rust peers. Repo `moltis-org/moltis`. |
| OpenFang alternatives: NullClaw | 8,043 stars; 943 forks; pushed 2026-07-19 | Watchlist | Exact assistant infrastructure, but it is a less-adopted implementation variant without a category-defining distinction strong enough to justify another launch column. Repo `nullclaw/nullclaw`. |
| PocketPaw | 871 stars; 328 forks; pushed 2026-08-22 | Watchlist | Strong exact fit and active development, but current adoption is materially below the launch set. Repo `pocketpaw/pocketpaw`. |
| MIRA | 1 star; 0 forks; pushed 2026-08-21 | Reject for now | Strong claimed fit but no demonstrated adoption. Repo `Vexillon-ai/MIRA`. |
| Open Interpreter | 68,122 stars; 5,862 forks; pushed 2026-08-20 | Reject from this category | The canonical repository moved to `openinterpreter/openinterpreter` and its current exact description is “A coding agent for open models like Kimi K3.” Historical general computer-control branding must not override the current product identity. |
| Magentic-UI | 10,074 stars; 1,015 forks; pushed 2026-08-19 | Reject from product matrix | First-party positioning is an experimental interface for developing and studying human-agent interaction. It is a research/development environment, not a maintained general personal agent product. Repo `microsoft/magentic-ui`. |
| UFO | 9,545 stars; 1,050 forks; pushed 2026-08-10 | Reject from product matrix | Research framework for Windows/GUI agents rather than a general persistent end-user agent identity. Repo `microsoft/UFO`. |
| OWL | 20,092 stars; 2,298 forks; pushed 2026-08-14 | Reject from product matrix | General multi-agent research/framework project; its primary object is building/testing agent teams. Repo `camel-ai/owl`. |
| Letta | 24,374 stars; 2,591 forks; pushed 2026-08-23 | Reject from this category | Strong stateful-agent platform and SDK, but the primary object is constructing and operating agents, not one comparable end-user general-purpose agent. Repo `letta-ai/letta`. |
| browser-use | 110,256 stars; 12,119 forks; pushed 2026-08-22 | Reject from this category | Important browser-agent library/platform but browser-scoped and developer-facing. Repo `browser-use/browser-use`. |
| Comet Assistant | Hosted | Defer to Code IDE/browser taxonomy | It is embedded in the Comet browser and first-party docs frame it around page/tab context and web actions. Perplexity Computer is the broader exact SKU for this category. |

## Hosted product identity rules

- Use **Grok Bot**, not Grok chat, `@grok`, Grok Build, or a generic xAI column. Its first-party docs define one Bot as one persistent named agent with a shared user-scoped cloud computer, routines, apps, approvals, memory, and Bot-to-Bot handoffs: [overview](https://docs.x.ai/grok-bot/overview).
- Use **Perplexity Computer**, not Perplexity Search, Comet Assistant, or Personal Computer. Personal Computer is a local macOS superset, while Computer is the cross-platform hosted worker being compared.
- Use **Genspark Super Agent**, not the general Genspark brand or one of its specialist artifact products.
- Use **Manus** as the product and distinguish Cloud Computer from Desktop/My Computer at the row level rather than creating fake repositories or combining it with unrelated “OpenManus” projects.

## Suggested ordering

Field-guide order should lead with distinct product objects rather than sorting by star count:

1. OpenClaw
2. Hermes Agent
3. Grok Bot
4. Perplexity Computer
5. Manus
6. Genspark Super Agent
7. nanobot
8. Agent Zero
9. ZeroClaw
10. IronClaw
11. PicoClaw
12. OpenFang
13. Agent TARS

This order puts the category-defining personal-agent and hosted-worker products first, then the differentiated open-source implementations. It prevents five OpenClaw-family columns from making the category look narrower than it is.

## Rows worth adding or preserving

The discovery pass reinforces these primary axes:

- native/client platforms and web availability;
- persistent identity and cross-session memory;
- execution owner: vendor cloud, local host, container, VM, or hybrid;
- persistent computer/environment versus ephemeral task sandbox;
- browser control, terminal/shell, files, and native desktop apps;
- communications channels and remote invocation;
- first-party app connectors, MCP, skills/plugins;
- scheduled, event-triggered, and proactive work;
- human approval controls and credential boundary;
- subagent delegation versus peer-agent collaboration;
- isolation and sandbox boundary;
- self-hosting and source model;
- latest stable release and complete repository telemetry for every public-source join.

Do not use “multi-agent” as one undifferentiated row. Agent Zero's parent/subagent hierarchy, Grok Bot's peer Bots sharing one account computer, Perplexity Computer's internal specialist dispatch, and OpenFang's scheduled Hands are materially different architectures.
