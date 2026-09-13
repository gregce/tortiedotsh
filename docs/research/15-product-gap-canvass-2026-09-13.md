# Product gap canvass — 13 September 2026

This canvass compares the live 174-product catalog against current first-party product documentation and a repeatable GitHub discovery pass. It is a discovery queue, not a substitute for the product-by-product evidence audit required before a column becomes public.

## Outcome

The current taxonomy still works. The clearest gaps are exact product surfaces inside the nine existing categories; a new category is not needed.

The first implementation pass should add the 24 products below. They are either major vendor surfaces, conspicuous peer-set omissions, or active open-source products with material adoption and an unambiguous category fit. A second wave contains credible products that need a boundary decision, more maturity, or more evidence.

## Method

The review used four gates:

1. **Exact surface:** a separately installable or operable product, not a company umbrella, SDK, framework, sample, skill pack, or feature name.
2. **Category contract:** the product's primary workflow object matches one existing category. Secondary capabilities do not create duplicate columns.
3. **Current evidence:** first-party documentation establishes that the surface is available and active.
4. **Materiality:** a major vendor, meaningful adoption, a strongly differentiated workflow, or a new product that closes a clear comparison gap.

The repository scan ran the existing 29 category-specific GitHub searches with a 100-star floor. It returned 173 repository candidates not already joined to the catalog. Each high-signal result was then checked against its current README or official product documentation. Stars below are an approximate discovery signal captured on 13 September 2026; they are not a quality score.

## P0: clear additions

| Category | Product | Why it belongs | OSS signal / source |
| --- | --- | --- | --- |
| Code IDEs | Xcode | A full IDE whose current Coding Intelligence surface runs Claude and Codex against projects, builds, tests, previews, and Apple documentation. | Proprietary; [Apple announcement](https://www.apple.com/ie/newsroom/2026/02/xcode-26-point-3-unlocks-the-power-of-agentic-coding/), [setup docs](https://developer.apple.com/documentation/xcode/setting-up-coding-intelligence) |
| Code IDEs | IBM Bob IDE | IBM ships Bob as a standalone project-oriented IDE with agent, ask, and plan modes, files, terminal commands, MCP, approvals, and subagents. | Proprietary; [IBM Bob IDE docs](https://bob.ibm.com/docs/ide) |
| Code IDEs | ZCode | Z.ai's desktop agentic development environment is organized around projects, files, terminals, agents, goals, and long-running development tasks. | Proprietary; [ZCode product](https://zcode.z.ai/en), [installation](https://zcode.z.ai/en/docs/install) |
| IDE extensions | Augment Code | A separately installed agent extension for VS Code and JetBrains. Auggie CLI is already a distinct Harness column. | Proprietary; [Augment quickstart](https://docs.augmentcode.com/quickstart), [agent docs](https://docs.augmentcode.com/using-augment/agent) |
| IDE extensions | Qodo IDE plugin | A current VS Code, JetBrains, and Visual Studio review-agent plugin. Its review-first direction should be represented accurately rather than described as a general autocomplete product. | Proprietary; [Qodo IDE docs](https://docs.qodo.ai/qodo-ide) |
| Agent Multiplexers | CCB / Claude Codex Bridge | A visible, persistent multi-agent TUI for 16 CLI-agent families, with concurrent panes, takeover, inter-agent coordination, and mobile control. | ~3.5k stars; [repository](https://github.com/SeemSeam/claude_codex_bridge) |
| Agent Multiplexers | Agent of Empires | A session manager for parallel coding agents with persistent tmux sessions, worktrees, sandboxing, status, diffs, TUI, web, and mobile views. Multiplexing is the primary object; remote access is secondary. | ~3.2k stars, MIT; [repository](https://github.com/agent-of-empires/agent-of-empires) |
| Agent Orchestrators | GitHub Copilot app | GitHub's GA desktop command center runs parallel sessions in isolated branches/worktrees, reviews results, opens PRs, and schedules cloud automations. It is separate from Copilot IDE plugins, CLI, and cloud agent. | Proprietary; [GA announcement](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/), [product overview](https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/) |
| Agent Orchestrators | Augment Intent | A spec-driven orchestration workspace with coordinator, implementer, and verifier agents executing in parallel isolated worktrees. | Proprietary; [Intent announcement](https://www.augmentcode.com/blog/intent-a-workspace-for-agent-orchestration), [walkthrough](https://www.augmentcode.com/guides/intent-walkthrough-prompt-to-merge) |
| Agent Orchestrators | Yao Agents | A self-hosted task board and workspace control plane for agents running across devices, with isolated workspaces, persistent tasks, and API access. | ~7.9k stars; [repository](https://github.com/YaoApp/yao), [product docs](https://yaoagents.com/docs) |
| Harnesses | jcode | A cross-platform terminal coding harness with its own conversation/tool loop, sessions, providers, updates, and releases. | ~19.6k stars, MIT; [repository](https://github.com/1jehuang/jcode), [docs](https://jcode.sh/docs) |
| Harnesses | DeepCode | An active open agentic-coding runtime with one shared service behind TUI, desktop, and web clients; it owns goals, tools, permissions, sessions, models, and automations. Its parallel-agent support is a capability, not a reason to duplicate the product in Orchestrators. | ~16.5k stars, MIT; [repository](https://github.com/HKUDS/DeepCode) |
| Harnesses | IBM Bob Shell | A distinct interactive and non-interactive terminal agent with file, process, command, MCP, scripting, and structured automation capabilities. | Proprietary; [Bob Shell docs](https://bob.ibm.com/docs/shell) |
| Agent Traces | LangSmith | A major missing peer to Langfuse, Phoenix, and AgentOps; it records projects, threads, end-to-end traces, nested runs, tool calls, feedback, and metadata. | Proprietary service with public SDKs; [observability docs](https://docs.langchain.com/langsmith/observability-concepts) |
| Agent Traces | Braintrust | A first-class trace viewer and instrumentation platform for inputs, outputs, tools, model parameters, tokens, latency, cost, and agent frameworks. | Public SDKs; [tracing quickstart](https://www.braintrust.dev/docs/tracing-quickstart), [trace viewer](https://www.braintrust.dev/docs/observe/examine-traces) |
| Agent Traces | W&B Weave | A major agent-tracing peer with sessions, turns, steps, tools, subagents, analytics, evaluation, and production monitoring. | Apache-licensed core; [product](https://site.wandb.ai/weave/), [agent evaluation docs](https://docs.wandb.ai/weave/agent-evals) |
| Cloud agents | Warp Oz | Warp explicitly defines Oz as its orchestration platform for cloud agents: parallel runs, schedules, triggers, web/API control, and shared local/cloud agent capabilities. Keep Warp itself in Multiplexers and add Oz only here. | Proprietary service over an open-source client; [Warp and Oz overview](https://docs.warp.dev/?fallback=true), [changelog](https://docs.warp.dev/changelog) |
| Cloud agents | Ona | The former Gitpod product is now a background-agent platform: task in, pull request out, with automations and isolated connected cloud environments. | Proprietary/split infrastructure; [Ona product](https://ona.com/), [agent docs](https://ona.com/docs/ona/agents) |
| General-purpose agents | AutoGPT Platform | A current, active platform for building, deploying, scheduling, and managing continuous general-purpose agents. Record it as split-source: the platform directory uses Polyform Shield while other portions remain MIT. | ~187k stars; [repository](https://github.com/Significant-Gravitas/AutoGPT), [platform docs](https://github.com/Significant-Gravitas/AutoGPT/blob/master/docs/content/index.md) |
| General-purpose agents | OpenManus | A highly adopted, runnable general-purpose agent with terminal, MCP, and multi-agent modes; it is a product/runtime rather than only a framework. | ~58.3k stars, MIT; [repository](https://github.com/FoundationAgents/OpenManus) |
| General-purpose agents | Kun | A local-first workspace explicitly spanning coding, writing, design, research, and automation through one GUI/TUI runtime. | ~6.3k stars; [repository](https://github.com/KunAgent/Kun) |
| General-purpose agents | OpenCowork | An open-source desktop work agent with sandbox isolation, multi-model support, MCP/skills, and messaging integrations. | ~2.1k stars, MIT; [repository](https://github.com/OpenCoworkAI/open-cowork) |
| Remote | CC Pocket | A purpose-built mobile client and WebSocket bridge for observing and controlling Codex and Claude sessions from a phone. | ~1.1k stars, MIT; [repository](https://github.com/K9i-0/ccpocket) |
| Remote | tmate | A mature, active instant terminal-sharing comparator. Because sshx and Upterm are already in this category, omitting tmate makes the peer set inconsistent. | ~6.1k stars; [repository](https://github.com/tmate-io/tmate) |

## P1: strong second wave

These should follow P0 after an exact-surface evidence pass.

| Category | Products | Decision still needed |
| --- | --- | --- |
| Code IDEs / Multiplexers | Tencent CodeBuddy IDE, Nezha, PI-Desktop, StarkIDE, Vicoa | CodeBuddy is a major-vendor surface; the others need a primary-object decision between editor, single-agent desktop, and multiplexer. |
| IDE extensions | Tencent CodeBuddy plugin | Keep separate from CodeBuddy IDE and CodeBuddy Code only if first-party docs continue to expose independent distribution, support, and capabilities. |
| Agent Multiplexers | LeapMux, Pragma, Pane, parallel-code | All are exact multi-agent workspaces. LeapMux is especially relevant as a newly launched, cross-platform local/remote worktree multiplexer, but adoption is still early and its FSL-to-Apache license must be represented as source-available today. |
| Harnesses | Tencent CodeBuddy Code, Fuxi, Command Code, nanocoder, Zero, OpenDev | Active terminal agents with meaningful differentiation or adoption; each needs full row evidence before publication. |
| Agent Traces | Helicone, OpenLLMetry, OpenLIT, tokScale, ccusage, TokenTelemetry | The first three are broad observability products. The latter three are coding-agent-specific usage analytics, not complete provenance systems; add them only if the Agent Traces criteria explicitly support this narrower coverage. |
| Cloud agents | CodeRabbit, Greptile, Qodo Code Review, Codex Security | These are important autonomous code-review/security agents. They fit only if the category is intentionally broadened from code production to durable remote review/remediation jobs. CodeRabbit can now edit in a sandbox and return a stacked PR; Greptile can execute targeted tests and hand fixes to coding agents. |
| General-purpose agents | useAgent, Ouroboros, Interpreter Workstation | Clear category fit and active development, but lower adoption or very recent launches call for a second-wave evidence pass. |
| Remote | OpenCode Manager, Lody, Lucarne, pi-agent-dashboard, Vicoa | Useful agent-specific remote clients; validate authentication, session ownership, native/web platform support, and project maturity first. |

## Corrections and deliberate non-additions

- **Do not add Windsurf Editor as a second IDE column.** Cognition states that Devin Desktop is the new name for Windsurf and upgrades arrive in place. Update aliases/evidence on the existing Devin Desktop column instead.
- **Update “GitHub Copilot coding agent” to “GitHub Copilot cloud agent.”** GitHub renamed the cloud surface; this is a catalog maintenance change, not a new product.
- **Do not add GitHub Agent HQ as a product column.** It is the umbrella across Copilot app, CLI, cloud agent, IDE integrations, and third-party agents. Model the exact surfaces.
- **Do not add Augment Cosmos as a column yet.** It currently reads as the enterprise platform across Augment's agent surfaces. The independently usable extension, Auggie CLI, and Intent are the comparable products.
- **Do not add Lingma as a duplicate of Qoder without a regional-SKU review.** Alibaba documents Lingma's rename to Qoder in China.
- **Do not add generic app builders** such as Lovable, Bolt, v0, or retired GitHub Spark to Code IDEs. Their primary object is an application or page, not a file/project/editor workflow.
- **Do not promote frameworks, SDKs, examples, benchmarks, skills, or setup repositories** such as AutoGen, Sandcastle, agent SDKs, `loop-engineering`, or cloud reference architectures into product columns.
- **Defer stale products** such as Plandex unless a maintenance/status review establishes a current supported release. Historical importance alone is not enough for the live field guide.
- **Reject repository-description-only evidence.** `tutti` and similarly vague candidates need actual product documentation before classification.

## Recommended implementation order

1. Add the six major-vendor desktop/editor surfaces: Xcode, IBM Bob IDE, ZCode, Augment Code, Qodo IDE plugin, and GitHub Copilot app.
2. Add the open-source coding core: CCB, Agent of Empires, Yao, jcode, DeepCode, AutoGPT Platform, OpenManus, Kun, and OpenCowork.
3. Add the ecosystem gaps: Augment Intent, IBM Bob Shell, Warp Oz, Ona, LangSmith, Braintrust, W&B Weave, CC Pocket, and tmate.
4. For every open or split-source addition, register the repository join before publication so stars, contributors, releases, languages, and CLOC-derived source lines cannot render blank.
5. Add first-party identity assets and complete the Unknown audit for the new product before making it public.
6. Re-run discovery after the P0 repositories are registered; this removes them from the unseen queue and makes the P1 report materially easier to review.

## Repeatable discovery follow-up

The existing command is the right starting point:

```sh
npm run discover:comparison -- --min-stars 100 --limit 50 --output .audit/comparison-candidates
```

It should become a monthly pull-request workflow that:

1. runs the category-specific GitHub queries;
2. diffs candidates against product IDs, repository joins, aliases, and a reviewed rejection ledger;
3. records stars, activity, license, release state, and the matching query;
4. produces a bounded candidate report without editing reviewed claims automatically; and
5. fails only on collection errors, while leaving classification to a person using first-party sources.

Daily repository metrics and evidence fingerprinting keep known products current. Monthly discovery answers a different question: which products do we not know about yet?
