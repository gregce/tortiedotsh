# Unknown audit: Agent Traces, Cloud Agents, Remote, and General Purpose backlog

Checked 2026-08-23. This pass uses exact-SKU vendor documentation or the canonical product repository. Missing evidence remains `Unknown`; an omitted platform or feature is not converted into `Not available` by inference.

## Result

At takeover, the shared working tree contained 10 Agent Traces products with 29 rendered Unknown cells, 12 Cloud Agents with 86, and 12 Remote products with 101: 216 Unknowns across 34 products. The reviewed result contains 7 Agent Traces with 15 Unknowns, 12 Cloud Agents with 78, and 12 Remote products with 98: 191 Unknowns across 31 products.

The count fell by 25 while removing only low-adoption trace columns and adding evidence-backed status, environment, network, automation, and repository-instruction facts. The pre-expansion trace baseline had five products and ten Unknowns; the final trace lane adds two substantial history products without adding an Unknown to Claude Code History Viewer and with five deliberate Unknowns on Agent Sessions.

## Agent Traces additions and adoption

| Product | Decision | Public-project signal at check time | Exact product fit and evidence |
|---|---|---:|---|
| Claude Code History Viewer | Include | 2,089 stars, 207 forks; pushed 2026-08-19; MIT | Canonical repository documents 29 coding-assistant readers, local/offline storage, worktree grouping, search, tool-call rendering, resume commands, HTML/JSON export, analytics, desktop packages, and authenticated headless/Docker operation: [repository](https://github.com/jhlee0409/claude-code-history-viewer). |
| Agent Sessions | Include | 811 stars, 52 forks; pushed 2026-08-23; MIT | Canonical repository documents 15 local coding-agent histories, search, readable tool calls, images, supported-agent resume, per-session quota/cost analytics, macOS 14+, local-only storage, and no telemetry: [repository](https://github.com/jazzyalex/agent-sessions). |
| Agent History (`nihen/ah`) | Reject for now | 2 stars, 0 forks; pushed 2026-08-21; MIT | Exact fit and active, but adoption is not yet meaningful enough for a comparison column. Keep on the watchlist: [repository](https://github.com/nihen/ah). |
| Session Manager | Reject for now | 9 stars, 2 forks; pushed 2026-08-13; MIT | Exact fit, but a very new low-adoption column would over-weight one implementation. Revisit after sustained releases or adoption: [repository](https://github.com/CatheadOwl/session-manager). |
| Session Bandit | Reject for now | 0 stars, 0 forks; last push 2026-07-23; MIT | Strong export/redaction design but no demonstrated adoption. It remains research input, not a product column: [repository](https://github.com/janole/session-bandit). |
| `dotneet/agent-session-view` | Reject | 11 stars, 3 forks; last push 2026-02-03; no GitHub-detected license at check time | It is an exact Claude Code/Codex transcript viewer with web/TUI browsing and HTML/text export, but activity and adoption are materially below retained products: [repository](https://github.com/dotneet/agent-session-view). |
| Claude Code Trace | Watchlist | 339 stars, 19 forks; pushed 2026-08-23; MIT | Active and meaningful adoption, but currently a single-harness Claude Code viewer whose inspection surface is already covered by broader retained products. Reconsider if single-harness depth becomes an explicit selection axis: [repository](https://github.com/delexw/claude-code-trace). |

The retained open-source trace set has no blank repository join in the catalog manifest: `specstory`, `entire`, `tapes`, `agentsview`, `claude-code-history-viewer`, and `agent-sessions`. Live signals for the earlier retained projects were respectively 1,310, 4,999, 315, and 5,227 stars, with all four pushed during August 2026. Traces.com remains a hosted exact-SKU product rather than an invented repository join.

Generic LLM observability products were excluded. The category requires durable records of coding-agent sessions, tool calls, code artifacts, or git/session continuity, not merely model spans or application telemetry.

## Cloud and Remote closures

Cloud lifecycle status is now explicitly active for OpenAI Codex cloud, GitHub Copilot coding agent, and Devin. Claude Code on the web now has exact-page claims for saved environment configuration, default-limited/configurable networking, and scheduled/API/GitHub-event automation in [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web). Cursor Cloud Agents now has exact claims for outbound-domain/private-network controls in [Cloud Agents](https://cursor.com/docs/cloud-agent) and version-controlled `.cursor/rules`/`AGENTS.md` in [Cursor Rules](https://cursor.com/docs/rules).

Remote lifecycle status is now explicit for Happy, VibeTunnel, and Shunt. The open-source remote products all retain their metrics joins. Adoption is substantial for the main OSS baselines: Happy 23,477 stars, VibeTunnel 4,635, code-server 79,023, OpenVSCode Server 6,156, sshx 7,649, Upterm 1,280, Termix 14,880, and ttyd 12,248. Omnara remains a pivoted/deprecated predecessor and its unresearched capability cells remain intentionally Unknown rather than being filled from the replacement product.

## Preserved Unknowns

- Platform omissions remain Unknown unless the exact SKU affirmatively documents lack of support. “Web product” does not prove “not available on macOS,” and a browser client is not silently reclassified as a native app.
- A run limit remains Unknown when first-party documentation only says a task expires after inactivity without publishing a duration.
- Network policy stays Unknown where the exact product page does not describe egress, credential proxying, or operator controls.
- Generic remote IDEs and terminal relays keep agent-approval, notification, and named-harness cells Unknown unless their exact product documentation establishes those semantics. Raw terminal input is not normalized agent state.
- Shunt's shipped-source model remains Unknown because its product page does not link a canonical public product-source repository or license.
- Agent Sessions export and sharing remain Unknown: local browsing, images, and resume are documented, but a stable export or collaboration contract is not.
- Existing trace gaps such as SpecStory artifact/CI coverage, Entire export API, and Tapes git/replay/artifact/redaction/sharing remain Unknown where current first-party material does not support a narrower conclusion.

## General Purpose Agents: next-pass backlog

No ninth category was partially added in this pass. The exact-fit rule for a future `general-purpose-agents` category is: a persistent broad-purpose agent that operates across several of apps, websites/browser, terminal/files, and communications. Coding-only harnesses, background PR workers, and SDK/framework-only repositories are excluded.

High-confidence next-pass candidates are:

- OpenClaw — include candidate. Its canonical repository documents persistent gateway/session state, browser control, local tools, messaging channels, skills, memory, and operator-controlled sandboxing: [OpenClaw](https://github.com/openclaw/openclaw).
- Hermes Agent by Nous Research — include candidate. The canonical product has shared persistent sessions/memory across CLI, desktop, web dashboard and messaging gateways, plus browser and terminal tools: [Hermes Agent](https://github.com/NousResearch/hermes-agent).
- Grok Bot — include hosted candidate under the exact SKU “Grok Bot,” not Grok chat, `@grok`, or Grok Build. First-party docs describe named persistent agents on cloud VMs with browser, filesystem, terminal, apps, approvals, routines, communications, and collaboration: [Grok Bot overview](https://docs.x.ai/grok-bot/overview), [product page](https://x.ai/bot).
- Open Interpreter — screen in the next pass as a broad local computer-control product, but do not conflate its repository with a persistent messaging teammate without exact current lifecycle evidence: [repository](https://github.com/OpenInterpreter/open-interpreter).
- Agent Zero — screen as a persistent Docker/self-hosted general agent; require exact current product, memory, browser/terminal, communications, and security-boundary evidence before inclusion: [repository](https://github.com/agent0ai/agent-zero).
- HKUDS nanobot — screen as a lightweight personal-agent/channel product; require current adoption metrics and exact tool/persistence evidence before inclusion: [repository](https://github.com/HKUDS/nanobot).

Suggested category rows are persistence/memory, computer ownership, browser control, terminal/files, communications channels, app/tool integrations, scheduled/event automation, human approvals, multi-agent delegation, execution owner, isolation/security boundary, and self-hosting/source model.

## Asset and generated-data handoff

New public product asset IDs required by the retained catalog additions are `claude-code-history-viewer` and `agent-sessions`. Their OSS metric manifest IDs are the same. The generated metrics snapshot and identity-asset manifest were intentionally not edited in this lane.

If the General Purpose category is implemented, reserve product/asset IDs `openclaw`, `hermes-agent`, and `grok-bot`; additional screened candidates should receive IDs only after inclusion. Before publication, the asset/metrics owner must add first-party identity assets for the two retained trace products and refresh both new manifest records so no public open-source project renders blank statistics.
