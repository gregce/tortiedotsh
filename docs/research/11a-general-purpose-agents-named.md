# General Purpose Agents: named-product audit

Checked 2026-08-23 against first-party product documentation and canonical repositories. Links below were opened successfully on the check date. The audit does not turn an omitted feature into `Not available`; unsupported conclusions remain `Unknown`.

## Category contract

Use category ID `general-purpose-agents`, public label **General Purpose Agents**, route `/compare/general-purpose-agents/`, and editorial order 8. Move Remote to order 9.

A product belongs here when the exact evaluated SKU:

1. owns a durable agent identity, session, or memory;
2. can perform broad work across at least three of browser/computer use, terminal/files, communications, and app/tool integrations; and
3. is an operator-usable product, not only an SDK, framework primitive, coding-only harness, or background pull-request worker.

The useful return object is ongoing delegated work across tools and systems. This distinguishes the category from coding harnesses (one model/tool loop), Agent Multiplexers (operator surfaces for concurrent coding sessions), Agent Orchestrators (parallel software-delivery workers), and Cloud Agents (remote jobs that return code artifacts).

## Inclusion result and product order

| Order | Product ID | Exact SKU | Decision | Why |
|---:|---|---|---|---|
| 1 | `openclaw` | OpenClaw | Include | Persistent self-hosted gateway with memory, browser and computer control, terminal/files, many messaging channels, automation, skills/plugins, and multi-agent routing. |
| 2 | `hermes-agent` | Hermes Agent | Include | Persistent self-hosted agent across CLI, desktop, web and messaging, with memory, browser/terminal tools, cron, approvals, and delegation. |
| 3 | `grok-bot` | Grok Bot | Include | Hosted named agents on a persistent cloud computer with apps, browser, terminal/files, routines, approvals, and direct multi-Bot collaboration. Keep this exact SKU distinct from Grok chat, `@grok`, Grok Build, and the xAI API. |
| 4 | `agent-zero` | Agent Zero | Include | Self-hosted Docker agent workbench with a Linux desktop, browser, files/terminal, project memory, scheduling, plugins, and subagents. |
| 5 | `nanobot` | nanobot | Include | Self-hosted persistent gateway with WebUI/TUI/chat surfaces, files/shell/web tools, long-term memory, automation, MCP, and subagent delegation. Its lack of documented interactive browser/desktop control is a meaningful comparison difference, not a category exclusion. |
| — | `open-interpreter` | Open Interpreter | Exclude from this category | The current first-party repository explicitly defines it as a coding agent and Codex fork focused on harness emulation. Keep or add it in Harnesses instead. |

Agent Zero and nanobot pass the screen: both now expose operator-ready persistent products rather than only framework code. Open Interpreter fails the exact-SKU test after its current Rust/Codex repositioning.

## Product identity, source, platform, execution, and lifecycle

| Product | Official and source URLs | Source / license | Documented client platforms | Execution owner | Status |
|---|---|---|---|---|---|
| OpenClaw | [Product](https://openclaw.ai/) · [docs](https://docs.openclaw.ai/) · [repo](https://github.com/openclaw/openclaw) | Open source, MIT | Core installer: macOS, Windows, Linux; Web Control UI; macOS and Windows companion apps; iOS/Android nodes. Linux has a supported Gateway but no Linux companion app yet. | User-owned local machine/server, container or VPS; optional paired nodes | Active |
| Hermes Agent | [Product/docs](https://hermes-agent.nousresearch.com/docs/) · [repo](https://github.com/NousResearch/hermes-agent) | Open source, MIT | CLI on macOS, Windows, Linux/WSL2 and Android/Termux; native desktop on macOS, Windows and Linux; web dashboard and messaging surfaces | Local process, Docker/Singularity, SSH host, Modal, Daytona or Vercel Sandbox | Active |
| Grok Bot | [Product](https://x.ai/bot) · [docs](https://docs.x.ai/grok-bot/overview) | Proprietary hosted product; no public product-source repository | Native desktop on macOS and Windows; iOS companion. Linux, Android and iPad are explicitly unsupported at initial launch. | Vendor-managed persistent Linux cloud VM, with permissioned access to a paired local computer | Active |
| Agent Zero | [Product](https://www.agent-zero.ai/) · [docs](https://www.agent-zero.ai/p/docs/) · [repo](https://github.com/agent0ai/agent-zero) | Open source, MIT | A0 Launcher on macOS, Windows and Linux; browser Web UI; A0 CLI on macOS/Linux and Windows | User-owned Docker container on a workstation, server/VPS or Raspberry Pi; optional host bridge | Active |
| nanobot | [Repo](https://github.com/HKUDS/nanobot) · [stable docs](https://nanobot.wiki/) | Open source, MIT | macOS, Windows and Linux installers; browser WebUI, terminal client, API and external chat apps | User-owned local process/background gateway, Docker, Linux service, macOS LaunchAgent or user cloud/VPS | Active |
| Open Interpreter (excluded) | [Product](https://www.openinterpreter.com/) · [repo](https://github.com/openinterpreter/openinterpreter) | Open source, Apache-2.0 | macOS, Windows and Linux terminal product; ACP clients | Local process with native OS sandboxing | Active; coding harness, not this category |

`Active` is supported by the current install/release/product material on the check date; it is not inferred from an old repository description.

## Recommended discriminating rows

These 16 rows are category-specific and should appear after the shared OS/source/repository rows:

| Row ID | Label | Group | What counts |
|---|---|---|---|
| `general-durable-identity` | Durable agent identity or session | Continuity | Named agent, persistent session, or resumable topic owned by the product |
| `general-long-term-memory` | Long-term memory and recall | Continuity | Cross-session facts, preferences, summaries, or searchable history |
| `general-browser-control` | Interactive browser control | Computer | Navigate and act in websites, not only search/fetch |
| `general-terminal-files` | Terminal and file tools | Computer | Execute commands and read/write files |
| `general-computer-use` | Desktop or GUI computer use | Computer | Observe and operate native desktop applications or a full remote desktop |
| `general-communications` | Communications channels | Reach | In-product collaboration or external messaging ingress/egress |
| `general-operator-surfaces` | Operator surfaces | Reach | Exact documented UI/CLI/TUI/web/mobile surfaces |
| `general-scheduled-automation` | Scheduled/background automation | Automation | One-shot or recurring unattended work |
| `general-event-triggers` | Event or webhook triggers | Automation | External events can wake or invoke durable work |
| `general-skills-integrations` | Skills, plugins, connectors, or MCP | Extensibility | User-installable or reusable capability surface |
| `general-multi-agent` | Multi-agent delegation or handoff | Coordination | Product-owned agents can delegate, parallelize, or hand off work |
| `general-human-approvals` | Human action approvals | Safety | Product-enforced approval or explicit capability grant, not prompt advice alone |
| `general-execution-owner` | Execution owner | Execution | Fact row naming where tools and state run |
| `general-self-hosting` | Self-hosting | Deployment | Exact product can be operated on user-controlled infrastructure |
| `general-isolation` | Isolation and security boundary | Safety | Concrete sandbox/container/account boundary and its caveat |
| `general-model-freedom` | Model/provider freedom | Models | Operator can choose providers or local models |

Controlled states below use `Built-in`, `Limited`, `Fact`, and `Unknown`. Do not create `Not available` claims from these sources.

## Controlled claims: OpenClaw

| Row | State | Claim and evidence |
|---|---|---|
| Durable identity/session | Built-in | The Gateway is the source of truth for persistent sessions and multi-agent routing. [Overview](https://docs.openclaw.ai/) |
| Long-term memory | Built-in | OpenClaw documents agent memory as a core agent capability. [Overview](https://docs.openclaw.ai/) |
| Interactive browser control | Built-in | Its managed browser opens tabs, reads pages, clicks, types, drags, selects, captures screenshots and PDFs. [Browser](https://docs.openclaw.ai/browser) |
| Terminal and files | Built-in | Built-in runtime/file tools include `exec`, process, read, write, edit and patch. [Tools](https://docs.openclaw.ai/tools) |
| Desktop/GUI computer use | Built-in | A paired capable desktop can expose screenshot plus pointer, keyboard, window and app actions; Windows/Linux support is documented as experimental. [Computer use](https://docs.openclaw.ai/nodes/computer-use) |
| Communications channels | Built-in | One Gateway connects Discord, Google Chat, iMessage, Matrix, Teams, Signal, Slack, Telegram, WhatsApp, Zalo and other plugins. [Overview](https://docs.openclaw.ai/) |
| Operator surfaces | Fact | Control UI, CLI, TUI, native macOS/Windows companions, and iOS/Android nodes are documented; Linux companion is planned while the Gateway is supported. [Platforms](https://docs.openclaw.ai/platforms) |
| Scheduled/background automation | Built-in | Durable automations support at/every/cron schedules and persisted run history. [Automations](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) |
| Event/webhook triggers | Built-in | Automations document webhooks, Gmail PubSub, command-exit and supervised stream triggers. [Automations](https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md) |
| Skills/integrations | Built-in | Skills, plugins, MCP-backed tools and ClawHub are first-class extension surfaces. [Tools](https://docs.openclaw.ai/tools) |
| Multi-agent delegation | Built-in | The tools surface documents subagents, ACP agents, agent-send and swarm coordination. [Tools](https://docs.openclaw.ai/tools) |
| Human action approvals | Built-in | Node command pairing/allowlists and exec approvals gate host actions; computer control has no per-action confirmation after its durable grant. [Nodes](https://docs.openclaw.ai/nodes) · [Computer-use authorization](https://docs.openclaw.ai/nodes/computer-use) |
| Execution owner | Fact | A self-hosted Gateway runs on the operator's machine/server and can invoke paired nodes. [Overview](https://docs.openclaw.ai/) |
| Self-hosting | Built-in | The exact product is a self-hosted gateway and documents workstation, container and VPS paths. [Overview](https://docs.openclaw.ai/) |
| Isolation | Limited | Tool execution can use Docker, SSH or OpenShell sandboxes, but sandboxing is off by default and the Gateway remains on the host. [Sandboxing](https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md) |
| Model/provider freedom | Built-in | Hosted and local model providers are supported. [Repository README](https://github.com/openclaw/openclaw) |

## Controlled claims: Hermes Agent

| Row | State | Claim and evidence |
|---|---|---|
| Durable identity/session | Built-in | CLI, desktop, web and messaging use the same conversation/session state. [Desktop README](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/README.md) · [Messaging](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) |
| Long-term memory | Built-in | Agent-curated memory, skills and full-text session search persist across sessions. [Repository README](https://github.com/NousResearch/hermes-agent) |
| Interactive browser control | Built-in | Local and managed-cloud browser backends support navigation, element interaction, forms and extraction. [Browser automation](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser/) |
| Terminal and files | Built-in | The built-in registry includes terminal execution plus file read/write/patch tools. [Tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/) |
| Desktop/GUI computer use | Unknown | First-party material establishes browser automation and a separately linked community Linux computer-use MCP, but does not establish a cross-platform core desktop-control contract for the exact Hermes SKU. |
| Communications channels | Built-in | The Gateway supports Telegram, Discord, Slack, WhatsApp, Signal, SMS, Email, Home Assistant, Mattermost, Matrix, Teams and additional adapters. [Messaging](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) |
| Operator surfaces | Fact | Native desktop on macOS/Windows/Linux, CLI/TUI, web dashboard, messaging gateway, and Android/Termux are documented. [Desktop README](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/README.md) · [Repository README](https://github.com/NousResearch/hermes-agent) |
| Scheduled/background automation | Built-in | Cron supports one-shot/recurring work, lifecycle controls, skill attachment and result delivery. [Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/) |
| Event/webhook triggers | Limited | The Messaging Gateway includes a webhook adapter with full tools; the cited material does not establish a broader typed event-routing system. [Messaging](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) |
| Skills/integrations | Built-in | Skills, MCP servers, plugins, Home Assistant and configurable toolsets are documented. [Tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/) |
| Multi-agent delegation | Built-in | `delegate_task` spawns isolated child agents and supports parallel batches. [Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation/) |
| Human action approvals | Built-in | Smart, manual and off modes gate potentially dangerous terminal commands; deny rules remain enforceable even in off/yolo mode. [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) |
| Execution owner | Fact | Commands can run locally, in Docker/Singularity, over SSH, or in Modal, Daytona and Vercel sandboxes. [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) |
| Self-hosting | Built-in | The exact product runs on operator-controlled laptops, VPSs, servers and clusters. [Product docs](https://hermes-agent.nousresearch.com/docs/) |
| Isolation | Limited | Docker, Singularity and cloud sandbox backends provide isolation, while the default local backend provides none. [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) |
| Model/provider freedom | Built-in | Nous Portal, OpenRouter, OpenAI, custom endpoints and local models are documented. [Repository README](https://github.com/NousResearch/hermes-agent) · [FAQ](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md) |

## Controlled claims: Grok Bot

| Row | State | Claim and evidence |
|---|---|---|
| Durable identity/session | Built-in | Each Bot is named and persistent with a durable conversation, role, files, browser sessions and preferences. [Overview](https://docs.x.ai/grok-bot/overview) |
| Long-term memory | Built-in | A Bot retains stable preferences, role context and summaries of prior work. [FAQ](https://docs.x.ai/grok-bot/faq) |
| Interactive browser control | Built-in | Bots operate websites on the persistent cloud computer and can use connectors when available. [Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps) |
| Terminal and files | Built-in | The managed computer exposes a command line and shared durable `/workspace` files. [Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps) |
| Desktop/GUI computer use | Built-in | Every Bot receives its own screen and can click, type and use desktop/browser tools. [Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps) |
| Communications channels | Limited | Grok Bot has direct conversations, groups, threads and asynchronous Bot-to-Bot messages. External chat-channel ingress is not established by the cited exact-SKU docs. [Collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration) |
| Operator surfaces | Fact | Native desktop is documented for macOS/Windows and the companion app for iOS. [FAQ](https://docs.x.ai/grok-bot/faq) |
| Scheduled/background automation | Built-in | Routines can run on a schedule while the operator's laptop is closed. [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations) |
| Event/webhook triggers | Built-in | Cursor account integrations can start a routine from events such as Slack messages or GitHub notifications. [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations) |
| Skills/integrations | Built-in | Reusable skills, packaged/private skills, connectors/plugins and MCP are documented. [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations) · [Overview](https://docs.x.ai/grok-bot/overview) |
| Multi-agent delegation | Built-in | Bots run in parallel, message one another, share context and hand off ownership. [Collaboration](https://docs.x.ai/grok-bot/chat-and-collaboration) |
| Human action approvals | Built-in | Proposed actions can stop for Allow once/Approve once or Deny; Auto-review supports narrow Require Approval rules. [Approvals](https://docs.x.ai/grok-bot/approvals-security-and-privacy) |
| Execution owner | Fact | Work runs on a vendor-managed persistent Linux cloud VM; it continues when the client device closes. [FAQ](https://docs.x.ai/grok-bot/faq) |
| Self-hosting | Unknown | Current first-party material establishes the managed cloud computer but does not affirm or explicitly deny a self-hosted exact SKU. |
| Isolation | Fact | The cloud computer is isolated per user account, not per Bot; all of one user's Bots share files, sessions and logins. [Computer and apps](https://docs.x.ai/grok-bot/computer-and-apps) |
| Model/provider freedom | Unknown | Current exact-SKU docs do not establish operator-selectable third-party or local models. |

## Controlled claims: Agent Zero

| Row | State | Claim and evidence |
|---|---|---|
| Durable identity/session | Built-in | Projects retain files, instructions, secrets, memory, repositories and model choices. [Repository README](https://github.com/agent0ai/agent-zero) |
| Long-term memory | Built-in | Project-scoped memory and a Memory Dashboard are documented. [Docs index](https://www.agent-zero.ai/p/docs/) |
| Interactive browser control | Built-in | The built-in browser can navigate, click, type, upload, screenshot and annotate the DOM. [Repository README](https://github.com/agent0ai/agent-zero) |
| Terminal and files | Built-in | The Linux desktop/container and host bridge expose terminals and real files. [Repository README](https://github.com/agent0ai/agent-zero) |
| Desktop/GUI computer use | Built-in | The container includes an XFCE desktop for GUI software; the A0 CLI can explicitly enable host computer use. [Repository README](https://github.com/agent0ai/agent-zero) · [A0 CLI](https://www.agent-zero.ai/p/docs/a0-cli-connector/) |
| Communications channels | Unknown | A plugin system is established, but current core product documentation does not establish a named built-in external messaging gateway comparable to OpenClaw or Hermes. |
| Operator surfaces | Fact | Browser Web UI, A0 Launcher and A0 CLI are documented across macOS, Windows and Linux. [Repository README](https://github.com/agent0ai/agent-zero) |
| Scheduled/background automation | Built-in | The Task Scheduler supports cron, planned one-time and manual jobs with project context. [Task Scheduler](https://www.agent-zero.ai/p/docs/task-scheduler/) |
| Event/webhook triggers | Unknown | Current first-party scheduler material establishes time and manual triggers, not a general webhook/event ingress contract. |
| Skills/integrations | Built-in | Skills, 100+ community plugins, MCP, A2A and custom tools are documented. [Repository README](https://github.com/agent0ai/agent-zero) |
| Multi-agent delegation | Built-in | The product delegates focused work to subagents. [Subagents](https://www.agent-zero.ai/p/docs/subagents/) |
| Human action approvals | Limited | Tool/MCP/Skill permissions and explicit host-computer enable/disable gates are built in; the cited exact-SKU docs do not establish a general per-action approval workflow. [A0 CLI](https://www.agent-zero.ai/p/docs/a0-cli-connector/) |
| Execution owner | Fact | The agent runs inside the operator's Docker container locally or on a server; A0 CLI can bridge selected host capabilities. [Repository README](https://github.com/agent0ai/agent-zero) |
| Self-hosting | Built-in | Docker deployment is documented for workstations, VPSs, Raspberry Pi and servers. [Repository README](https://github.com/agent0ai/agent-zero) |
| Isolation | Built-in | The default product workspace is a Dockerized Linux desktop; host access is an explicit additional bridge. [Repository README](https://github.com/agent0ai/agent-zero) |
| Model/provider freedom | Built-in | The onboarding supports OpenRouter and other cloud/local providers through model presets; Codex OAuth is also documented. [Docs index](https://www.agent-zero.ai/p/docs/) · [Repository README](https://github.com/agent0ai/agent-zero) |

## Controlled claims: nanobot

| Row | State | Claim and evidence |
|---|---|---|
| Durable identity/session | Built-in | Persistent topics, saved conversations, resumable sessions and long-running goals are documented. [Repository README](https://github.com/HKUDS/nanobot) |
| Long-term memory | Built-in | Session history and long-term memory through Dream survive long-running work. [Repository README](https://github.com/HKUDS/nanobot) |
| Interactive browser control | Limited | Built-in web search and fetch are documented, but current exact-SKU material does not establish click/type browser automation. [Configuration](https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md) |
| Terminal and files | Built-in | The core includes shell and file tools with optional workspace restriction. [Repository README](https://github.com/HKUDS/nanobot) · [Configuration](https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md) |
| Desktop/GUI computer use | Unknown | Current first-party material does not establish a GUI desktop-control surface. |
| Communications channels | Built-in | Telegram, Discord, Slack, WeChat, Email, Mattermost and other chat adapters are documented. [Repository README](https://github.com/HKUDS/nanobot) |
| Operator surfaces | Fact | Browser WebUI, native terminal client, API and chat-app surfaces are documented on macOS, Windows and Linux. [Repository README](https://github.com/HKUDS/nanobot) |
| Scheduled/background automation | Built-in | Cron, one-time schedules and protected heartbeat jobs run through the persistent Gateway. [Automations](https://github.com/HKUDS/nanobot/blob/main/docs/automations.md) |
| Event/webhook triggers | Limited | Durable local triggers accept CI/webhook-adapter messages, but nanobot explicitly has no built-in public webhook receiver. [Automations](https://github.com/HKUDS/nanobot/blob/main/docs/automations.md) |
| Skills/integrations | Built-in | Skills, Apps, MCP servers, Python SDK and an OpenAI-compatible API are documented. [Repository README](https://github.com/HKUDS/nanobot) |
| Multi-agent delegation | Built-in | Inline subagents and multi-agent workflows are documented, with configurable concurrency. [Repository README](https://github.com/HKUDS/nanobot) · [Configuration](https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md) |
| Human action approvals | Unknown | Pairing approves users, not agent actions. Current exact-SKU documentation does not establish per-action human approval semantics. |
| Execution owner | Fact | The persistent Gateway runs on operator-controlled local or server infrastructure and owns chat, automation and memory state. [Repository README](https://github.com/HKUDS/nanobot) |
| Self-hosting | Built-in | Local, Docker, Linux-service, macOS LaunchAgent and Render/VPS paths are documented. [Repository README](https://github.com/HKUDS/nanobot) |
| Isolation | Limited | Linux bubblewrap and Docker isolation are available, but workspace restriction and shell sandboxing are off by default; bubblewrap is not available on macOS/Windows. [Configuration](https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md) |
| Model/provider freedom | Built-in | OpenAI-compatible providers, local LLMs, fallbacks and several OAuth-backed providers are documented. [Repository README](https://github.com/HKUDS/nanobot) · [Configuration](https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md) |

## Preserved Unknowns

- Grok Bot self-hosting and third-party/local model selection remain Unknown. A managed cloud VM is not affirmative evidence that a self-hosted edition is unavailable.
- Hermes core desktop/GUI computer control remains Unknown. Browser automation and a community-linked Linux MCP do not prove a first-party cross-platform desktop-control contract.
- Agent Zero built-in external messaging ingress and event/webhook triggers remain Unknown. Its plugin framework and scheduled tasks do not establish those exact capabilities.
- nanobot GUI desktop control and human action approvals remain Unknown. User pairing is access control, not action approval.
- No candidate receives a negative platform claim unless first-party material says so. Grok Bot is the exception: its FAQ explicitly says Linux, Android and iPad are unsupported at initial launch.
- External chat apps are not silently treated as native mobile clients. Hermes and nanobot can be reached through mobile messaging apps, but that is different from Grok Bot's native iOS client and OpenClaw's iOS/Android nodes.

## Open-source metrics manifest identities

Add these exact joins with LOC enabled. The category value should be `general-purpose-agents` for every included repository.

```json
[
  {
    "id": "openclaw",
    "name": "OpenClaw",
    "category": "general-purpose-agents",
    "owner": "openclaw",
    "repo": "openclaw",
    "githubUrl": "https://github.com/openclaw/openclaw",
    "apiUrl": "https://api.github.com/repos/openclaw/openclaw",
    "loc": { "enabled": true }
  },
  {
    "id": "hermes-agent",
    "name": "Hermes Agent",
    "category": "general-purpose-agents",
    "owner": "NousResearch",
    "repo": "hermes-agent",
    "githubUrl": "https://github.com/NousResearch/hermes-agent",
    "apiUrl": "https://api.github.com/repos/NousResearch/hermes-agent",
    "loc": { "enabled": true }
  },
  {
    "id": "agent-zero",
    "name": "Agent Zero",
    "category": "general-purpose-agents",
    "owner": "agent0ai",
    "repo": "agent-zero",
    "githubUrl": "https://github.com/agent0ai/agent-zero",
    "apiUrl": "https://api.github.com/repos/agent0ai/agent-zero",
    "loc": { "enabled": true }
  },
  {
    "id": "nanobot",
    "name": "nanobot",
    "category": "general-purpose-agents",
    "owner": "HKUDS",
    "repo": "nanobot",
    "githubUrl": "https://github.com/HKUDS/nanobot",
    "apiUrl": "https://api.github.com/repos/HKUDS/nanobot",
    "loc": { "enabled": true }
  }
]
```

Grok Bot has no metrics manifest entry. Do not invent a repository join from Grok, Cursor, or xAI SDK repositories. Open Interpreter should use its canonical redirected repository identity only in Harnesses if it is not already tracked there: `openinterpreter/openinterpreter`, API `https://api.github.com/repos/openinterpreter/openinterpreter`.

## Implementation notes

- Reserve asset IDs matching product IDs: `openclaw`, `hermes-agent`, `grok-bot`, `agent-zero`, and `nanobot`.
- Use exact first-party product marks, not GitHub organization avatars.
- Add all four included repositories to the generated-metrics refresh before publishing the category. Their source/license/stars/forks/issues/contributors/release/commit/language/size/active status and version-pinned CLOC must not render blank.
- For CLOC, count source-code languages only; exclude Markdown, JSON, lockfiles, generated documentation and vendored/build output so repository documentation or data does not inflate the measured-ref total.
- Keep Open Interpreter out of this lane even though its older brand history was a general computer assistant. The current exact SKU is a coding harness and its current repository is the authoritative classification source.
