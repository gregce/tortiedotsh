/**
 * Launch catalog for the Tortie comparison workspace.
 *
 * Editorial order is intentional. Do not alphabetize categories, products, or
 * rows: the order follows docs/research/04-comparison-taxonomy.md. Product
 * capabilities are sparse by design; getComparisonClaim() converts every
 * unresearched cell to an explicit Unknown rather than inferring a negative.
 */

export const COMPARISON_SNAPSHOT = "2026-08-24" as const;

export type CategoryId =
  | "code-editors"
  | "agent-workbenches"
  | "agent-orchestrators"
  | "coding-agent-harnesses"
  | "ide-extensions"
  | "cloud-agents"
  | "general-purpose-agents"
  | "remote-companions"
  | "agent-traces";

export type PlatformId =
  | "macos"
  | "windows"
  | "linux"
  | "web"
  | "ios"
  | "android";

export type SourceModel =
  | "open-source"
  | "source-available"
  | "split-source"
  | "proprietary"
  | "hosted-service";

export type ExecutionLocation =
  | "local-process"
  | "local-daemon"
  | "host-ide-process"
  | "ssh-host"
  | "container"
  | "vendor-cloud"
  | "paired-machine"
  | "user-cloud";

export type PrimaryObject =
  | "file-or-project"
  | "named-session"
  | "delegated-task"
  | "agent-conversation"
  | "host-ide-panel"
  | "remote-job"
  | "general-agent"
  | "remote-session"
  | "agent-trace";

export type ProductStatus =
  | "active"
  | "beta"
  | "community-maintained"
  | "sunsetting"
  | "archived"
  | "pivoted"
  | "source-needed";

export type EvidenceBasis =
  | "reproduced"
  | "source-inspected"
  | "vendor-documented"
  | "repository-derived"
  | "community-reported"
  | "unverified";

export type CapabilityState =
  | "built-in"
  | "via-extension"
  | "via-integration"
  | "limited"
  | "not-available"
  | "unknown"
  | "not-applicable";

export interface EvidenceSource {
  title: string;
  url: string;
  basis: EvidenceBasis;
  checkedAt: string;
}

export interface KnownFact<T> {
  state: "known";
  value: T;
  note?: string;
  evidence: readonly [EvidenceSource, ...EvidenceSource[]];
}

export interface UnknownFact {
  state: "unknown";
  value: "unknown";
  note: string;
  evidence: readonly [];
}

export type ProfileFact<T> = KnownFact<T> | UnknownFact;

export interface ComparisonClaim {
  state: CapabilityState | "fact";
  displayValue: string;
  note?: string;
  evidence: readonly EvidenceSource[];
}

export interface ComparisonRow {
  id: string;
  label: string;
  group: string;
  description?: string;
  profileField?: "source" | "execution" | "primaryObject" | "status";
  platform?: PlatformId;
}

export interface ComparisonCategory {
  id: CategoryId;
  label: string;
  shortLabel: string;
  route: string;
  editorialOrder: number;
  description: string;
  rows: readonly ComparisonRow[];
}

export interface ProductRepository {
  id: string;
  url: string;
  relationship:
    | "product-source"
    | "source-tree"
    | "metadata-only"
    | "deprecated-predecessor";
}

export interface ComparisonProduct {
  id: string;
  name: string;
  categoryId: CategoryId;
  editorialOrder: number;
  officialUrl: string | null;
  repository?: ProductRepository;
  /** Joins this product to open-source-metrics.json, whose keys come from open-source-projects.json. */
  repoMetricId?: string;
  tags: readonly string[];
  profile: {
    platform: ProfileFact<readonly PlatformId[]>;
    source: ProfileFact<SourceModel>;
    execution: ProfileFact<readonly ExecutionLocation[]>;
    primaryObject: ProfileFact<PrimaryObject>;
    status: ProfileFact<ProductStatus>;
  };
  claims: Readonly<Record<string, ComparisonClaim>>;
}

const evidence = (
  url: string,
  title: string,
  basis: EvidenceBasis = "vendor-documented",
): EvidenceSource => ({ url, title, basis, checkedAt: COMPARISON_SNAPSHOT });

const known = <T>(
  value: T,
  url: string,
  title: string,
  basis: EvidenceBasis = "vendor-documented",
  note?: string,
): KnownFact<T> => ({
  state: "known",
  value,
  ...(note ? { note } : {}),
  evidence: [evidence(url, title, basis)],
});

const unknown = (note: string): UnknownFact => ({
  state: "unknown",
  value: "unknown",
  note,
  evidence: [],
});

const capabilityLabels: Record<CapabilityState, string> = {
  "built-in": "Built in",
  "via-extension": "Via extension",
  "via-integration": "Via integration",
  limited: "Limited",
  "not-available": "Not available",
  unknown: "Unknown",
  "not-applicable": "Not applicable",
};

const capability = (
  state: Exclude<CapabilityState, "unknown">,
  url: string,
  title: string,
  note?: string,
  basis: EvidenceBasis = "vendor-documented",
): ComparisonClaim => ({
  state,
  displayValue: capabilityLabels[state],
  ...(note ? { note } : {}),
  evidence: [evidence(url, title, basis)],
});

const unknownClaim = (note = "Research gap; no supported conclusion has been recorded."): ComparisonClaim => ({
  state: "unknown",
  displayValue: "Unknown",
  note,
  evidence: [],
});

const sharedRows: readonly ComparisonRow[] = [
  { id: "platform-macos", label: "macOS", group: "Availability", platform: "macos" },
  { id: "platform-windows", label: "Windows", group: "Availability", platform: "windows" },
  { id: "platform-linux", label: "Linux", group: "Availability", platform: "linux" },
  { id: "platform-web", label: "Browser client", group: "Availability", platform: "web" },
  { id: "source-model", label: "Source model", group: "Product identity", profileField: "source" },
  {
    id: "execution-location",
    label: "Execution location",
    group: "Execution and data boundary",
    profileField: "execution",
  },
  {
    id: "primary-object",
    label: "Primary workflow object",
    group: "Product identity",
    profileField: "primaryObject",
  },
  { id: "product-status", label: "Product status", group: "Product identity", profileField: "status" },
];

const categoryRows: Record<CategoryId, readonly ComparisonRow[]> = {
  "code-editors": [
    { id: "editor-project-tree", label: "Project tree and editor", group: "Core editing" },
    { id: "editor-terminal", label: "Integrated terminal", group: "Core editing" },
    { id: "editor-agent-mode", label: "Agent mode", group: "AI interaction" },
    { id: "editor-background-jobs", label: "Background agent jobs", group: "AI interaction" },
    { id: "editor-inline-prediction", label: "Inline code prediction", group: "AI interaction" },
    { id: "editor-agent-shell-tools", label: "Agent can run shell commands", group: "Agent tools" },
    { id: "editor-mcp", label: "MCP tools", group: "Agent tools" },
    { id: "editor-parallel-sessions", label: "Parallel agent sessions", group: "Agent workflow" },
    { id: "editor-worktree-isolation", label: "Git worktree isolation", group: "Isolation" },
    { id: "editor-change-review", label: "Agent change review", group: "Review" },
    { id: "editor-remote-workspaces", label: "Remote workspace execution", group: "Execution" },
    { id: "editor-model-access", label: "Model access", group: "Model access", description: "Vendor-only, BYOK, compatible endpoints, local models, or self-hosted inference." },
    { id: "editor-agent-permissions", label: "Agent permission model", group: "Safety", description: "Approval scopes, per-tool policies, workspace trust, or unrestricted execution." },
    { id: "editor-agent-sandbox", label: "Agent sandbox", group: "Isolation", description: "The documented containment boundary for agent-run commands." },
    { id: "editor-browser-tools", label: "Browser and preview tools", group: "Agent tools", description: "Preview-only, embedded browser, visual annotation, or browser agent." },
    { id: "editor-verification-loop", label: "Agent verification loop", group: "Review", description: "Tests, builds, diagnostics, browser inspection, or device/emulator checks available to the agent." },
    { id: "editor-specialization", label: "IDE specialization", group: "Product identity" },
    { id: "editor-ai-feature-boundary", label: "AI feature boundary", group: "Product identity", description: "Built-in, bundled first-party extension, optional extension, or third-party integration." },
    { id: "editor-release-channel", label: "Release channel", group: "Product identity" },
  ],
  "agent-workbenches": [
    { id: "workbench-arbitrary-cli", label: "Arbitrary CLI agents", group: "Session admission" },
    { id: "workbench-agent-handoff", label: "Cross-harness session handoff", group: "Agent workflow", description: "The same task or conversation can move to another harness with its working context preserved." },
    { id: "workbench-named-sessions", label: "Durable named sessions", group: "Session identity" },
    { id: "workbench-pty-survives-ui", label: "Live PTY survives UI exit", group: "Live continuity" },
    { id: "workbench-cross-project-attention", label: "Cross-project attention state", group: "Attention" },
    { id: "workbench-editor", label: "Code editor", group: "Workbench depth" },
    { id: "workbench-file-tree", label: "Project file tree", group: "Workbench depth" },
    { id: "workbench-scm", label: "Source control workflow", group: "Workbench depth" },
    { id: "workbench-change-review", label: "Visual change review", group: "Review", description: "In-app diff review is a first-class session surface." },
    { id: "workbench-splits", label: "Tabs and split panes", group: "Workspace composition" },
    { id: "workbench-attention-signals", label: "Cross-session attention signals", group: "Attention" },
    { id: "workbench-session-recovery", label: "Session recovery", group: "Continuity" },
    { id: "workbench-browser", label: "Embedded browser", group: "Workbench depth" },
    { id: "workbench-remote-host", label: "SSH or remote host", group: "Execution" },
    { id: "workbench-programmable-control", label: "CLI or socket control", group: "Automation" },
    { id: "workbench-worktrees", label: "Git worktree workflow", group: "Isolation" },
  ],
  "agent-orchestrators": [
    { id: "orchestrator-isolated-workspaces", label: "Isolated workspaces", group: "Isolation" },
    { id: "orchestrator-parallel-workers", label: "Parallel workers", group: "Fan-out" },
    { id: "orchestrator-multi-harness", label: "Multiple agent harnesses", group: "Agent compatibility" },
    { id: "orchestrator-agent-handoff", label: "Cross-harness task handoff", group: "Agent compatibility", description: "A task can transfer to another harness with an explicit context handoff." },
    { id: "orchestrator-review-delivery", label: "Review and delivery flow", group: "Review and delivery" },
    { id: "orchestrator-worktrees", label: "Git worktree isolation", group: "Isolation" },
    { id: "orchestrator-containers", label: "Container or VM isolation", group: "Isolation" },
    { id: "orchestrator-task-board", label: "Task or Kanban board", group: "Planning" },
    { id: "orchestrator-inline-review", label: "Inline diff feedback", group: "Review" },
    { id: "orchestrator-pr-lifecycle", label: "Pull-request workflow", group: "Delivery" },
    { id: "orchestrator-remote-execution", label: "Remote execution", group: "Execution" },
    { id: "orchestrator-attention-signals", label: "Fleet attention signals", group: "Attention" },
    { id: "orchestrator-live-steering", label: "Live steering and follow-ups", group: "Supervision", description: "An operator can redirect or add instructions to an active worker without restarting it." },
    { id: "orchestrator-programmable", label: "Programmable control plane", group: "Automation" },
  ],
  "coding-agent-harnesses": [
    { id: "harness-interactive-cli", label: "Interactive CLI or TUI", group: "Runtime" },
    { id: "harness-headless", label: "Headless or non-interactive mode", group: "Automation" },
    { id: "harness-multi-provider", label: "Multiple model providers", group: "Model access" },
    { id: "harness-session-resume", label: "Named session resume", group: "Session" },
    { id: "harness-extension-protocol", label: "MCP, plugins, or extensions", group: "Context and tools" },
    { id: "harness-project-instructions", label: "Project instruction files", group: "Context and memory" },
    { id: "harness-permission-controls", label: "Tool permission controls", group: "Safety" },
    { id: "harness-sandbox", label: "Built-in sandbox boundary", group: "Safety" },
    { id: "harness-checkpoints", label: "Checkpoint and rollback", group: "Recovery" },
    { id: "harness-subagents", label: "Subagents or agent teams", group: "Delegation" },
    { id: "harness-structured-output", label: "Structured machine output", group: "Automation" },
    { id: "harness-git-workflow", label: "Git-aware change workflow", group: "Change management" },
    { id: "harness-multimodal-input", label: "Image or web-page input", group: "Context" },
  ],
  "ide-extensions": [
    { id: "extension-hosts", label: "Documented editor hosts", group: "Host reach" },
    { id: "extension-inline-completion", label: "Inline completion", group: "Interaction" },
    { id: "extension-agent-panel", label: "Agent panel", group: "Interaction" },
    { id: "extension-background-delegation", label: "Background delegation", group: "Lifecycle" },
    { id: "extension-host-vscode", label: "VS Code and compatible forks", group: "Host reach" },
    { id: "extension-host-jetbrains", label: "JetBrains IDEs", group: "Host reach" },
    { id: "extension-provider-choice", label: "Provider and model choice", group: "Model access" },
    { id: "extension-mcp", label: "MCP servers", group: "Context and tools" },
    { id: "extension-checkpoints", label: "Workspace checkpoints", group: "Recovery" },
    { id: "extension-permissions", label: "Per-tool permissions", group: "Safety" },
    { id: "extension-codebase-context", label: "Codebase map or indexing", group: "Context" },
    { id: "extension-isolated-parallel", label: "Isolated parallel agents", group: "Lifecycle" },
    { id: "extension-install-channel", label: "Install channel", group: "Distribution" },
    { id: "extension-tool-execution-boundary", label: "Tool execution boundary", group: "Execution" },
    { id: "extension-byok-local-model", label: "BYOK, local, or self-hosted models", group: "Model access" },
    { id: "extension-remote-session-client", label: "Cloud or background session client", group: "Lifecycle" },
  ],
  "cloud-agents": [
    { id: "cloud-repo-intake", label: "Repository or issue intake", group: "Intake" },
    { id: "cloud-sandbox", label: "Hosted isolated environment", group: "Hosting" },
    { id: "cloud-live-observability", label: "Live progress and logs", group: "Observability" },
    { id: "cloud-durable-result", label: "Patch, branch, or pull request result", group: "Result" },
    { id: "cloud-intake-surfaces", label: "Task intake surfaces", group: "Intake" },
    { id: "cloud-code-hosts", label: "Supported code hosts", group: "Intake" },
    { id: "cloud-parallel-tasks", label: "Parallel task runs", group: "Lifecycle" },
    { id: "cloud-environment-config", label: "Reproducible environment setup", group: "Hosting" },
    { id: "cloud-network-policy", label: "Agent network policy", group: "Security" },
    { id: "cloud-project-instructions", label: "Repository instructions", group: "Context" },
    { id: "cloud-live-steering", label: "Live steering or takeover", group: "Observability" },
    { id: "cloud-task-limit", label: "Documented run limit", group: "Lifecycle" },
    { id: "cloud-execution-owner", label: "Execution owner", group: "Hosting" },
    { id: "cloud-isolation-unit", label: "Isolation unit", group: "Hosting" },
    { id: "cloud-human-takeover", label: "Human takeover or local handoff", group: "Observability" },
    { id: "cloud-triggered-automation", label: "Event, schedule, or API automation", group: "Automation" },
    { id: "cloud-result-type", label: "Durable result type", group: "Result" },
  ],
  "general-purpose-agents": [
    { id: "general-durable-identity", label: "Durable agent identity or session", group: "Continuity" },
    { id: "general-long-term-memory", label: "Long-term memory and recall", group: "Continuity" },
    { id: "general-browser-control", label: "Interactive browser control", group: "Computer" },
    { id: "general-terminal-files", label: "Terminal and file tools", group: "Computer" },
    { id: "general-computer-use", label: "Desktop or GUI computer use", group: "Computer" },
    { id: "general-communications", label: "Communications channels", group: "Reach" },
    { id: "general-operator-surfaces", label: "Operator surfaces", group: "Reach" },
    { id: "general-scheduled-automation", label: "Scheduled/background automation", group: "Automation" },
    { id: "general-event-triggers", label: "Event or webhook triggers", group: "Automation" },
    { id: "general-skills-integrations", label: "Skills, plugins, connectors, or MCP", group: "Extensibility" },
    { id: "general-multi-agent", label: "Multi-agent delegation or handoff", group: "Coordination" },
    { id: "general-human-approvals", label: "Human action approvals", group: "Safety" },
    { id: "general-execution-owner", label: "Execution owner", group: "Execution" },
    { id: "general-self-hosting", label: "Self-hosting", group: "Deployment" },
    { id: "general-isolation", label: "Isolation and security boundary", group: "Safety" },
    { id: "general-model-freedom", label: "Model/provider freedom", group: "Models" },
  ],
  "remote-companions": [
    { id: "remote-client-reach", label: "Web or mobile client", group: "Client" },
    { id: "remote-existing-session", label: "Connects to an existing session", group: "Session ownership" },
    { id: "remote-approvals", label: "Remote approvals and follow-ups", group: "Interaction" },
    { id: "remote-encryption", label: "End-to-end encryption documented", group: "Security" },
    { id: "remote-native-ios", label: "Native iOS client", group: "Client" },
    { id: "remote-native-android", label: "Native Android client", group: "Client" },
    { id: "remote-browser-pwa", label: "Browser or PWA client", group: "Client" },
    { id: "remote-supported-harnesses", label: "Named agent harnesses", group: "Compatibility" },
    { id: "remote-terminal-input", label: "Live terminal input", group: "Interaction" },
    { id: "remote-notifications", label: "Push or attention notifications", group: "Attention" },
    { id: "remote-hosting-boundary", label: "Relay and hosting boundary", group: "Security" },
    { id: "remote-session-history", label: "Session history or recording", group: "Continuity" },
    { id: "remote-agent-aware", label: "Understands agent state and approvals", group: "Compatibility" },
    { id: "remote-input-model", label: "Remote input model", group: "Interaction" },
    { id: "remote-host-ownership", label: "Session host ownership", group: "Session ownership" },
    { id: "remote-relay-deployment", label: "Relay deployment", group: "Security" },
    { id: "remote-transport-security", label: "Transport security", group: "Security" },
    { id: "remote-session-durability", label: "Session durability boundary", group: "Continuity" },
  ],
  "agent-traces": [
    { id: "trace-capture-coverage", label: "Harness and client capture", group: "Capture", description: "The exact coding-agent clients or generic instrumentation paths that the product can ingest." },
    { id: "trace-storage-boundary", label: "Storage boundary", group: "Storage and privacy", description: "Local files or database, repository-backed records, hosted storage, or a configurable combination." },
    { id: "trace-git-linkage", label: "Commit, branch, and worktree linkage", group: "Git provenance" },
    { id: "trace-replay-resume", label: "Replay or session reconstruction", group: "Continuity", description: "Reopen, rewind, resume, fork, or reconstruct a recorded agent session." },
    { id: "trace-search-timeline", label: "Searchable session timeline", group: "Inspection" },
    { id: "trace-multi-harness", label: "Multi-harness ingestion", group: "Capture" },
    { id: "trace-transcript-coverage", label: "Prompt and transcript coverage", group: "Captured record" },
    { id: "trace-tool-call-coverage", label: "Tool calls and results", group: "Captured record" },
    { id: "trace-artifact-coverage", label: "Artifacts, files, and diffs", group: "Captured record" },
    { id: "trace-export-api", label: "Export or ingestion API", group: "Interoperability" },
    { id: "trace-redaction-privacy", label: "Redaction and privacy controls", group: "Storage and privacy" },
    { id: "trace-sharing", label: "Collaboration and sharing", group: "Team workflow" },
    { id: "trace-ci-analytics", label: "CI and team analytics", group: "Team workflow" },
    { id: "trace-self-hosting", label: "Self-hosting", group: "Deployment" },
  ],
};

const category = (
  id: CategoryId,
  label: string,
  shortLabel: string,
  route: string,
  editorialOrder: number,
  description: string,
): ComparisonCategory => ({
  id,
  label,
  shortLabel,
  route,
  editorialOrder,
  description,
  rows: [...sharedRows, ...categoryRows[id]],
});

export const comparisonCategories: readonly ComparisonCategory[] = [
  category("code-editors", "Code IDEs", "Code IDEs", "/compare/editors/", 1, "Products organized around files, projects, and an editor window."),
  category("ide-extensions", "IDE extensions", "Extensions", "/compare/extensions/", 2, "Agent and assistance surfaces that depend on a host editor."),
  category("agent-workbenches", "Agent Multiplexers", "Agent Multiplexers", "/compare/agent-multiplexers/", 3, "Operator surfaces for multiplexing concurrent coding agents and workspaces, routing attention, isolating changes, and reviewing results."),
  category("agent-orchestrators", "Agent orchestrators", "Agent Orchestrators", "/compare/orchestrators/", 4, "Products organized around delegated tasks in isolated workspaces."),
  category("coding-agent-harnesses", "Coding-agent harnesses", "Harnesses", "/compare/harnesses/", 5, "Processes that own one model conversation and its tool loop."),
  category("agent-traces", "Agent Traces", "Agent Traces", "/compare/agent-traces/", 6, "Durable provenance and observability records of coding-agent work."),
  category("cloud-agents", "Cloud and background agents", "Cloud agents", "/compare/cloud-agents/", 7, "Remote jobs that return durable patches, branches, pull requests, or results."),
  category("general-purpose-agents", "General Purpose Agents", "General agents", "/compare/general-purpose-agents/", 8, "Persistent agents and agent workspaces for broad work across computers, communications, tools, memory, and automation."),
  category("remote-companions", "Remote companions and relays", "Remote", "/compare/remote/", 9, "Clients that observe or steer a session owned by another machine or product."),
];

const objectForCategory: Record<CategoryId, PrimaryObject> = {
  "code-editors": "file-or-project",
  "agent-workbenches": "named-session",
  "agent-orchestrators": "delegated-task",
  "coding-agent-harnesses": "agent-conversation",
  "ide-extensions": "host-ide-panel",
  "cloud-agents": "remote-job",
  "general-purpose-agents": "general-agent",
  "remote-companions": "remote-session",
  "agent-traces": "agent-trace",
};

interface ProductInput {
  id: string;
  name: string;
  categoryId: CategoryId;
  editorialOrder: number;
  officialUrl: string | null;
  repository?: ProductRepository;
  repoMetricId?: string;
  tags: readonly string[];
  platform?: readonly PlatformId[];
  platformNote?: string;
  platformSource?: { url: string; title: string };
  platformSources?: readonly { url: string; title: string }[];
  source: SourceModel | "unknown";
  sourceSource?: { url: string; title: string; basis?: EvidenceBasis };
  execution: readonly ExecutionLocation[] | "unknown";
  executionSource?: { url: string; title: string; basis?: EvidenceBasis };
  status?: ProductStatus;
  statusSource?: { url: string; title: string; basis?: EvidenceBasis };
  claims?: Readonly<Record<string, ComparisonClaim>>;
}

const product = (input: ProductInput): ComparisonProduct => {
  const sourceUrl = input.officialUrl ?? input.repository?.url ?? null;
  const sourceTitle = `${input.name} primary source`;
  const profileUnknown = "Primary-source verification has not yet established this value.";
  const platformSources = input.platformSources?.length
    ? input.platformSources
    : input.platformSource
      ? [input.platformSource]
      : sourceUrl
        ? [{ url: sourceUrl, title: sourceTitle }]
        : [];

  return {
    id: input.id,
    name: input.name,
    categoryId: input.categoryId,
    editorialOrder: input.editorialOrder,
    officialUrl: input.officialUrl,
    ...(input.repository ? { repository: input.repository } : {}),
    ...(input.repoMetricId ? { repoMetricId: input.repoMetricId } : {}),
    tags: input.tags,
    profile: {
      platform:
        input.platform && platformSources.length > 0
          ? {
              state: "known",
              value: input.platform,
              ...(input.platformNote ? { note: input.platformNote } : {}),
              evidence: platformSources.map((source) => evidence(
                source.url,
                source.title,
                source.url.includes("github.com") ? "repository-derived" : "vendor-documented",
              )),
            }
          : unknown("Platform support is not yet verified from a primary source at row level."),
      source:
        input.source !== "unknown" && sourceUrl
          ? known(
              input.source,
              input.sourceSource?.url ?? sourceUrl,
              input.sourceSource?.title ?? sourceTitle,
              input.sourceSource?.basis ?? (input.repository ? "source-inspected" : "vendor-documented"),
            )
          : unknown("The shipped product's source model is not yet established by primary evidence."),
      execution:
        input.execution !== "unknown" && sourceUrl
          ? known(
              input.execution,
              input.executionSource?.url ?? sourceUrl,
              input.executionSource?.title ?? sourceTitle,
              input.executionSource?.basis ?? "vendor-documented",
            )
          : unknown(profileUnknown),
      primaryObject: sourceUrl
        ? known(objectForCategory[input.categoryId], sourceUrl, sourceTitle, "vendor-documented")
        : unknown("No public first-party product source has been established."),
      status:
        input.status && sourceUrl
          ? known(
              input.status,
              input.statusSource?.url ?? sourceUrl,
              input.statusSource?.title ?? sourceTitle,
              input.statusSource?.basis ?? (input.repository ? "repository-derived" : "vendor-documented"),
            )
          : unknown("Current lifecycle status has not been reviewed from a status-specific primary source."),
    },
    claims: input.claims ?? {},
  };
};

const repo = (
  id: string,
  relationship: ProductRepository["relationship"] = "product-source",
): ProductRepository => ({ id, url: `https://github.com/${id}`, relationship });

const builtInClaims = (
  url: string,
  title: string,
  ids: readonly string[],
  note?: string,
  basis: EvidenceBasis = "vendor-documented",
): Readonly<Record<string, ComparisonClaim>> =>
  Object.fromEntries(ids.map((id) => [id, capability("built-in", url, title, note, basis)]));

const limitedClaims = (
  url: string,
  title: string,
  ids: readonly string[],
  note: string,
  basis: EvidenceBasis = "vendor-documented",
): Readonly<Record<string, ComparisonClaim>> =>
  Object.fromEntries(ids.map((id) => [id, capability("limited", url, title, note, basis)]));

const factClaim = (
  displayValue: string,
  url: string,
  title: string,
  note?: string,
  basis: EvidenceBasis = "vendor-documented",
): ComparisonClaim => ({
  state: "fact",
  displayValue,
  ...(note ? { note } : {}),
  evidence: [evidence(url, title, basis)],
});

export const comparisonProducts: readonly ComparisonProduct[] = [
  // 1. Code editors and IDEs
  product({
    id: "eclipse-theia-ide", name: "Eclipse Theia IDE", categoryId: "code-editors", editorialOrder: 6,
    officialUrl: "https://theia-ide.org/docs/user_getting_started/", repository: repo("eclipse-theia/theia-ide"), repoMetricId: "eclipse-theia-ide",
    tags: ["agent-panel", "inline-completion", "mcp", "byok", "local-models", "browser-ide", "oss"], platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "container", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://theia-ide.org/docs/user_getting_started/", "Eclipse Theia IDE getting started", ["editor-project-tree", "editor-terminal"]),
      ...builtInClaims("https://theia-ide.org/docs/user_ai/", "Theia IDE AI documentation", ["editor-agent-mode", "editor-inline-prediction", "editor-mcp"]),
      ...builtInClaims("https://theia-ide.org/docs/theia_coder/", "Theia Coder documentation", ["editor-agent-shell-tools", "editor-change-review"]),
      ...limitedClaims("https://github.com/eclipse-theia/theia-ide", "Eclipse Theia IDE repository", ["editor-remote-workspaces"], "The IDE supports browser and Docker deployments, but the cited product source does not establish a desktop-owned remote extension host.", "repository-derived"),
      "editor-model-access": factClaim("Cloud APIs, compatible endpoints, or Ollama/local", "https://theia-ide.org/docs/user_ai/", "Theia IDE AI documentation"),
      "editor-agent-permissions": factClaim("Per-tool permissions", "https://theia-ide.org/docs/user_ai/", "Theia IDE AI documentation"),
      "editor-verification-loop": factClaim("Tests and diagnostics", "https://theia-ide.org/docs/theia_coder/", "Theia Coder documentation"),
      "editor-specialization": factClaim("General software", "https://theia-ide.org/docs/user_getting_started/", "Eclipse Theia IDE getting started"),
      "editor-ai-feature-boundary": factClaim("Built-in, opt-in Theia AI", "https://theia-ide.org/docs/user_ai/", "Theia IDE AI documentation"),
      "editor-release-channel": factClaim("Active", "https://github.com/eclipse-theia/theia-ide", "Eclipse Theia IDE repository", undefined, "repository-derived"),
    },
  }),
  product({
    id: "traecode", name: "TraeCode", categoryId: "code-editors", editorialOrder: 7, officialUrl: "https://www.trae.ai/ide",
    tags: ["agent-panel", "solo-mode", "inline-completion", "embedded-browser", "formerly-trae-ide"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-terminal", "editor-agent-mode"]),
      ...builtInClaims("https://www.trae.ai/blog/engineering_thought_0731", "TraeCode Cue product notes", ["editor-inline-prediction"]),
      ...builtInClaims("https://www.trae.ai/blog/product_solo_1112?v=1", "TraeCode SOLO general-availability notes", ["editor-parallel-sessions"]),
      ...limitedClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-background-jobs"], "SOLO supports long multi-step work, but detached durability after client exit is not established."),
      ...limitedClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-change-review"], "Progress and a final summary are surfaced in the IDE; per-hunk accept and reject behavior is not established."),
      "editor-agent-sandbox": capability("limited", "https://www.trae.ai/blog/engineering_thought_0108?v=1", "TRAE sandbox security", "Beta Sandbox Mode isolates filesystem access to allowed project and temporary paths and intercepts shell commands."),
      "editor-model-access": factClaim("Vendor-managed models", "https://www.trae.ai/blog/trae_membership_0213", "TraeCode capability overview"),
      "editor-browser-tools": factClaim("Embedded browser in SOLO", "https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes"),
      "editor-verification-loop": factClaim("Interactive preview and console debugging; test execution not established", "https://www.trae.ai/ide/", "TraeCode product page"),
      "editor-specialization": factClaim("General software", "https://www.trae.ai/ide", "TraeCode product page"),
      "editor-ai-feature-boundary": factClaim("Built into TraeCode", "https://www.trae.ai/ide", "TraeCode product page"),
      "editor-release-channel": factClaim("Active desktop release", "https://www.trae.ai/download?auto=1&product_type=ide", "TraeCode download center"),
    },
  }),
  product({
    id: "qoder-ide", name: "Qoder IDE", categoryId: "code-editors", editorialOrder: 8, officialUrl: "https://docs.qoder.com/product-series/what-is-qoder",
    tags: ["agent-panel", "quest", "inline-completion", "mcp", "parallel-agents", "scheduled-tasks", "remote-ssh", "sandbox"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://docs.qoder.com/user-guide/chat/agent", "Qoder IDE Agent guide", ["editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-mcp", "editor-change-review"]),
      "editor-project-tree": capability("limited", "https://docs.qoder.com/user-guide/chat/agent", "Qoder IDE Agent guide", "Agent Mode provides project search, file editing, directory traversal, Workspace file statuses, and diffs; this page does not establish a conventional persistent project tree."),
      ...builtInClaims("https://docs.qoder.com/user-guide/chat/overview", "Qoder IDE Editor overview", ["editor-inline-prediction"]),
      ...builtInClaims("https://docs.qoder.com/release-notes/desktop", "Qoder IDE release notes", ["editor-background-jobs", "editor-parallel-sessions", "editor-remote-workspaces"]),
      "editor-worktree-isolation": capability("built-in", "https://docs.qoder.com/user-guide/quest/execution-environments", "Qoder Quest execution environments", "Local Worktree mode creates a separate Git checkout for parallel task execution and can move completed work back to the local workspace."),
      "editor-model-access": factClaim("Vendor models and BYOK", "https://docs.qoder.com/user-guide/quest/terminal-and-sandbox", "Qoder IDE terminal and sandbox guide"),
      "editor-agent-permissions": factClaim("Command confirmation, hooks, or Full Access", "https://docs.qoder.com/user-guide/quest/terminal-and-sandbox", "Qoder IDE terminal and sandbox guide"),
      "editor-agent-sandbox": factClaim("Seatbelt, Windows vendor sandbox, or bubblewrap", "https://docs.qoder.com/user-guide/quest/terminal-and-sandbox", "Qoder IDE terminal and sandbox guide"),
      "editor-browser-tools": factClaim("Built-in browser and annotation", "https://docs.qoder.com/release-notes/desktop", "Qoder IDE release notes"),
      "editor-verification-loop": factClaim("Goal loop and verification artifacts", "https://docs.qoder.com/product-series/what-is-qoder", "Qoder product-family overview"),
      "editor-specialization": factClaim("General software", "https://docs.qoder.com/product-series/what-is-qoder", "Qoder product-family overview"),
      "editor-ai-feature-boundary": factClaim("Built into Qoder IDE", "https://docs.qoder.com/product-series/what-is-qoder", "Qoder product-family overview"),
      "editor-release-channel": factClaim("Active stable desktop release", "https://docs.qoder.com/release-notes/desktop", "Qoder IDE release notes"),
    },
  }),
  product({
    id: "antigravity-ide", name: "Antigravity IDE", categoryId: "code-editors", editorialOrder: 9, officialUrl: "https://antigravity.google/docs/ide/overview/",
    tags: ["agent-panel", "parallel-agents", "inline-completion", "mcp", "browser-agent", "sandbox"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://antigravity.google/docs/ide/overview/", "Antigravity IDE overview", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-background-jobs", "editor-inline-prediction", "editor-agent-shell-tools", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://antigravity.google/docs/mcp", "Antigravity MCP documentation", ["editor-mcp"]),
      "editor-model-access": factClaim("Google-managed models", "https://antigravity.google/docs/ide/overview/", "Antigravity IDE overview"),
      "editor-agent-permissions": factClaim("Tool and terminal policies", "https://antigravity.google/docs/ide/settings/", "Antigravity IDE settings"),
      "editor-agent-sandbox": factClaim("Optional Seatbelt or nsjail; platform dependent", "https://antigravity.google/docs/ide/settings/", "Antigravity IDE settings"),
      "editor-browser-tools": factClaim("Browser agent", "https://antigravity.google/docs/ide/overview/", "Antigravity IDE overview"),
      "editor-verification-loop": factClaim("Terminal and browser verification artifacts", "https://antigravity.google/docs/ide/agent-side-panel", "Antigravity IDE Agent side panel"),
      "editor-specialization": factClaim("General software", "https://antigravity.google/docs/ide/overview/", "Antigravity IDE overview"),
      "editor-ai-feature-boundary": factClaim("Built into Antigravity IDE", "https://antigravity.google/docs/ide/overview/", "Antigravity IDE overview"),
      "editor-release-channel": factClaim("Active desktop release", "https://antigravity.google/download", "Antigravity IDE download"),
    },
  }),
  product({
    id: "android-studio", name: "Android Studio", categoryId: "code-editors", editorialOrder: 10, officialUrl: "https://developer.android.com/studio/install",
    tags: ["android", "gemini", "agent-panel", "parallel-agents", "inline-completion", "mcp", "emulator"], platform: ["macos", "windows", "linux"], source: "unknown", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      "editor-project-tree": capability("limited", "https://developer.android.com/studio/projects", "Android Studio project window", "Android Studio exposes Android and Project views over the complete project file hierarchy; this page does not directly establish the paired editable code surface."),
      ...builtInClaims("https://developer.android.com/build/building-cmdline", "Android Studio terminal and command-line build documentation", ["editor-terminal"]),
      ...builtInClaims("https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode", ["editor-agent-mode", "editor-parallel-sessions", "editor-change-review"]),
      ...limitedClaims("https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode", ["editor-background-jobs"], "Multiple agent conversations can run concurrently and remain visible in Recent Chats, but durability after Android Studio exits is not established."),
      ...limitedClaims("https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode", ["editor-agent-shell-tools"], "Agent Mode invokes build and connected-device tooling including adb shell input; general-purpose terminal command execution is not established."),
      ...builtInClaims("https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features", ["editor-inline-prediction", "editor-mcp"]),
      "editor-model-access": factClaim("Gemini default and configured supported providers", "https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features"),
      "editor-agent-permissions": factClaim("Tool permissions and change review", "https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode"),
      "editor-browser-tools": factClaim("Emulator and connected-device inspection and control", "https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode"),
      "editor-verification-loop": factClaim("Builds, build-error diagnosis, emulator, and connected-device checks", "https://developer.android.com/studio/gemini/create-a-new-project-with-ai", "Android Studio new-project agent"),
      "editor-specialization": factClaim("Android", "https://developer.android.com/studio", "Android Studio product page"),
      "editor-ai-feature-boundary": factClaim("Integrated Gemini service in the shipped IDE", "https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features"),
      "editor-release-channel": factClaim("Active stable desktop release", "https://developer.android.com/studio/install", "Android Studio install guide"),
    },
  }),
  product({
    id: "intellij-idea", name: "IntelliJ IDEA", categoryId: "code-editors", editorialOrder: 5, officialUrl: "https://www.jetbrains.com/help/idea/intellij-idea-single-distribution.html",
    repository: repo("JetBrains/intellij-community", "source-tree"), repoMetricId: "intellij-community",
    tags: ["jetbrains", "jetbrains-ide-family", "java", "kotlin", "jvm", "agent-panel", "external-agents", "mcp", "worktrees", "remote-development", "split-source"],
    platform: ["macos", "windows", "linux"], platformNote: "This column is the unified IntelliJ IDEA product, not an aggregate of every JetBrains IDE.",
    source: "split-source", execution: ["local-process", "ssh-host", "container"], status: "active",
    claims: {
      ...builtInClaims("https://www.jetbrains.com/help/idea/project-tool-window.html", "IntelliJ IDEA Project tool window", ["editor-project-tree"]),
      ...builtInClaims("https://www.jetbrains.com/help/idea/terminal-emulator.html", "IntelliJ IDEA terminal", ["editor-terminal"]),
      ...builtInClaims("https://www.jetbrains.com/help/idea/mcp-server.html", "IntelliJ IDEA integrated MCP server", ["editor-mcp"], "The IDE ships an MCP server; MCP client tools for in-IDE agents are supplied through the optional AI Assistant plugin."),
      ...builtInClaims("https://www.jetbrains.com/help/idea/use-git-worktrees.html", "IntelliJ IDEA Git worktrees", ["editor-worktree-isolation"]),
      ...builtInClaims("https://www.jetbrains.com/help/idea/remote-development-starting-page.html", "IntelliJ IDEA Remote Development", ["editor-remote-workspaces"]),
      "editor-agent-mode": capability("via-extension", "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "AI Assistant in JetBrains IDEs", "Available through JetBrains' separate AI Assistant plugin; the extension remains its own comparison product."),
      "editor-inline-prediction": capability("via-extension", "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "AI Assistant in JetBrains IDEs", "AI Assistant supplies autocomplete and next-edit suggestions."),
      "editor-agent-shell-tools": capability("via-extension", "https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents", "Supported agents can run commands and tests from the optional AI Assistant plugin."),
      "editor-change-review": capability("via-extension", "https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents", "The optional AI Assistant plugin supports reviewing, keeping, and rolling back agent changes."),
      "editor-model-access": factClaim("JetBrains AI, provider accounts, BYOK, or local models via AI Assistant", "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "AI Assistant in JetBrains IDEs"),
      "editor-agent-permissions": factClaim("Per-agent operation modes with approve, deny, or automatic authorization", "https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents"),
      "editor-verification-loop": factClaim("Commands and tests via AI Assistant agents", "https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents"),
      "editor-specialization": factClaim("Java, Kotlin, and the JVM ecosystem", "https://www.jetbrains.com/idea/", "IntelliJ IDEA product page"),
      "editor-ai-feature-boundary": factClaim("Optional first-party AI Assistant plugin; integrated IDE MCP server", "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "AI Assistant in JetBrains IDEs", "JetBrains AI Assistant remains a separate extension product in this catalog."),
      "editor-release-channel": factClaim("Active stable unified desktop product", "https://www.jetbrains.com/help/idea/intellij-idea-single-distribution.html", "IntelliJ IDEA unified product documentation"),
    },
  }),
  product({
    id: "positron", name: "Positron", categoryId: "code-editors", editorialOrder: 11, officialUrl: "https://positron.posit.co/", repository: repo("posit-dev/positron"), repoMetricId: "positron",
    tags: ["data-science", "agent-panel", "inline-completion", "mcp", "byok", "local-models", "remote-ssh", "dev-containers", "source-available"], platform: ["macos", "windows", "linux"], source: "source-available", execution: ["local-process", "ssh-host", "container", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://positron.posit.co/", "Positron documentation", ["editor-project-tree", "editor-terminal", "editor-remote-workspaces"]),
      ...builtInClaims("https://positron.posit.co/assistant.html", "Posit Assistant in Positron", ["editor-agent-mode", "editor-inline-prediction", "editor-agent-shell-tools", "editor-mcp", "editor-change-review"]),
      "editor-model-access": factClaim("BYOK, compatible endpoints, Ollama/local, or Posit AI", "https://positron.posit.co/assistant.html", "Posit Assistant in Positron"),
      "editor-agent-permissions": factClaim("Normal, Auto, YOLO, Restricted, and per-tool rules", "https://assistant.posit.co/docs/features/permissions/", "Posit Assistant permissions and trust"),
      "editor-agent-sandbox": factClaim("Optional Seatbelt or bubblewrap; Windows allowlist only", "https://assistant.posit.co/docs/features/permissions/", "Posit Assistant permissions and trust"),
      "editor-browser-tools": factClaim("Web search; no IDE browser agent documented", "https://positron.posit.co/assistant.html", "Posit Assistant in Positron"),
      "editor-verification-loop": factClaim("R/Python execution, terminal, tests, and builds", "https://positron.posit.co/assistant.html", "Posit Assistant in Positron"),
      "editor-specialization": factClaim("Data science", "https://github.com/posit-dev/positron", "Positron repository", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("Bundled first-party Posit Assistant", "https://positron.posit.co/assistant.html", "Posit Assistant in Positron"),
      "editor-release-channel": factClaim("Active stable desktop release", "https://positron.posit.co/", "Positron documentation"),
    },
  }),
  product({
    id: "onlook", name: "Onlook", categoryId: "code-editors", editorialOrder: 12, officialUrl: "https://docs.onlook.com/", repository: repo("onlook-dev/onlook"), repoMetricId: "onlook",
    tags: ["visual-editor", "react", "nextjs", "tailwind", "agent-panel", "mcp", "checkpoints", "browser-ide", "oss"], platform: ["web"], platformNote: "The current product is a browser-based editor that can be hosted or run locally; the historical desktop app is a separate surface.", source: "open-source", execution: ["container", "vendor-cloud", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/onlook-dev/onlook", "Onlook repository README", ["editor-project-tree", "editor-agent-mode", "editor-mcp", "editor-change-review", "editor-remote-workspaces"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/onlook-dev/onlook", "Onlook repository README", ["editor-terminal", "editor-agent-shell-tools"], "Command execution is documented, but a general interactive integrated terminal is not established.", "repository-derived"),
      ...limitedClaims("https://github.com/onlook-dev/onlook", "Onlook repository README", ["editor-background-jobs"], "Queued messages are narrower than independent durable background jobs.", "repository-derived"),
      ...limitedClaims("https://github.com/onlook-dev/onlook", "Onlook repository README", ["editor-worktree-isolation"], "Onlook branches design experiments, but Git worktree isolation is not established.", "repository-derived"),
      "editor-model-access": factClaim("OpenRouter and external apply-model providers", "https://github.com/onlook-dev/onlook", "Onlook repository README", undefined, "repository-derived"),
      "editor-browser-tools": factClaim("Live preview and visual DOM editor", "https://docs.onlook.com/getting-started/ui-overview", "Onlook UI overview"),
      "editor-verification-loop": factClaim("Preview and checkpoints; test loop unverified", "https://github.com/onlook-dev/onlook", "Onlook repository README", undefined, "repository-derived"),
      "editor-specialization": factClaim("React/Next.js/Tailwind visual web design", "https://github.com/onlook-dev/onlook", "Onlook repository README", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("Built into the open-source editor", "https://github.com/onlook-dev/onlook", "Onlook repository README", undefined, "repository-derived"),
      "editor-release-channel": factClaim("Active development; hosted next product early access", "https://github.com/onlook-dev/onlook", "Onlook repository README", undefined, "repository-derived"),
    },
  }),
  product({
    id: "visual-studio-code", name: "Visual Studio Code", categoryId: "code-editors", editorialOrder: 1,
    officialUrl: "https://code.visualstudio.com/docs/agents/overview", repository: repo("microsoft/vscode", "source-tree"), repoMetricId: "vscode",
    tags: ["agent-sessions", "extensions", "background-agent-client", "remote-development"], platform: ["macos", "windows", "linux", "web"], source: "split-source", execution: ["local-process", "vendor-cloud", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://code.visualstudio.com/docs/agents/run/agents-window", "Visual Studio Code Agents window", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-background-jobs", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/run/tools", "Visual Studio Code agent tools", ["editor-agent-shell-tools", "editor-mcp"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/concepts/agent-harnesses", "Visual Studio Code agent harnesses", ["editor-worktree-isolation"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/overview", "Visual Studio Code agents overview", ["editor-remote-workspaces"]),
      "editor-inline-prediction": capability("via-extension", "https://code.visualstudio.com/docs/editing/ai-powered-suggestions", "Visual Studio Code inline suggestions", "GitHub Copilot provides inline and next-edit suggestions in VS Code."),
      "editor-model-access": factClaim("Built-in providers, extension providers, and BYOK", "https://code.visualstudio.com/docs/agent-customization/language-models", "VS Code language models"),
      "editor-agent-permissions": factClaim("Session autonomy, per-tool approval, URL approval, and terminal policies", "https://code.visualstudio.com/docs/agents/run/approvals", "VS Code approvals and permissions"),
      "editor-agent-sandbox": factClaim("Optional filesystem and network sandbox on macOS and Linux/WSL", "https://code.visualstudio.com/docs/agents/run/approvals", "VS Code approvals and permissions"),
      "editor-browser-tools": factClaim("Integrated browser with built-in agent browser tools", "https://code.visualstudio.com/docs/agents/run/browser-tools", "VS Code browser tools"),
      "editor-verification-loop": factClaim("Terminal, diagnostics, tests, and interactive browser verification", "https://code.visualstudio.com/docs/agents/run/browser-tools", "VS Code browser tools"),
      "editor-specialization": factClaim("General software development", "https://code.visualstudio.com/docs/", "Visual Studio Code documentation"),
      "editor-ai-feature-boundary": factClaim("Core agent host plus first-party and third-party harness extensions", "https://code.visualstudio.com/docs/agents/run/agent-harnesses", "VS Code agent harnesses"),
      "editor-release-channel": factClaim("Monthly stable and continuously published Insiders", "https://code.visualstudio.com/updates/archive", "VS Code release archive"),
    },
  }),
  product({
    id: "cursor-ide", name: "Cursor IDE", categoryId: "code-editors", editorialOrder: 2, officialUrl: "https://docs.cursor.com/en/get-started/quickstart",
    tags: ["agent-panel", "background-agent-client", "vscode-derived"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.cursor.com/en/get-started/quickstart", "Cursor quickstart", ["editor-project-tree", "editor-agent-mode", "editor-inline-prediction"]),
      ...builtInClaims("https://docs.cursor.com/en/agent/terminal", "Cursor terminal documentation", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.cursor.com/context/model-context-protocol", "Cursor MCP documentation", ["editor-mcp"]),
      ...builtInClaims("https://docs.cursor.com/background-agent", "Cursor Background Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-remote-workspaces"]),
      ...builtInClaims("https://cursor.com/docs/agent/agents-window", "Cursor Agents Window", ["editor-worktree-isolation", "editor-change-review"]),
      "editor-model-access": factClaim("Cursor models and third-party frontier models", "https://cursor.com/docs/models-and-pricing", "Cursor models and pricing"),
      "editor-agent-permissions": factClaim("Auto-review, allowlists, per-tool approval, and unrestricted run modes", "https://cursor.com/docs/agent/security/run-modes", "Cursor run modes"),
      "editor-agent-sandbox": factClaim("Workspace filesystem and configurable network sandbox for terminal commands", "https://cursor.com/docs/agent/security/run-modes", "Cursor run modes"),
      "editor-browser-tools": factClaim("Integrated browser pane with first-party agent tools", "https://cursor.com/docs/agent/tools/browser", "Cursor browser tools"),
      "editor-verification-loop": factClaim("Review diffs and run checks inside Cursor", "https://cursor.com/docs", "Cursor documentation"),
      "editor-specialization": factClaim("General software development", "https://cursor.com/docs", "Cursor documentation"),
      "editor-ai-feature-boundary": factClaim("Built into Cursor; plugins, skills, MCP, and rules extend it", "https://cursor.com/docs/customize-cursor", "Cursor customization documentation"),
      "editor-release-channel": factClaim("Active desktop release", "https://cursor.com/changelog", "Cursor changelog"),
    },
  }),
  product({
    id: "windsurf", name: "Devin Desktop", categoryId: "code-editors", editorialOrder: 3, officialUrl: "https://docs.devin.ai/desktop/getting-started",
    tags: ["agent-panel", "vscode-derived", "formerly-windsurf", "local-agent"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started", ["editor-project-tree", "editor-agent-mode"]),
      ...builtInClaims("https://docs.devin.ai/desktop/terminal", "Devin Desktop terminal", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.devin.ai/desktop/tab/overview", "Devin Desktop Tab", ["editor-inline-prediction"]),
      ...builtInClaims("https://docs.devin.ai/desktop/cascade/mcp", "Devin Desktop MCP documentation", ["editor-mcp"]),
      ...builtInClaims("https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started", ["editor-remote-workspaces"]),
      "editor-change-review": capability("built-in", "https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started", "Quick Review is a documented first-party editor surface."),
      "editor-model-access": factClaim("Devin-managed selectable editor models", "https://docs.devin.ai/desktop/models", "Devin Desktop models"),
      "editor-browser-tools": factClaim("Browser previews", "https://docs.devin.ai/desktop/previews", "Devin Desktop browser previews"),
      "editor-verification-loop": factClaim("Local agent code execution, terminal, Quick Review, and browser previews", "https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started"),
      "editor-specialization": factClaim("General software development", "https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started"),
      "editor-ai-feature-boundary": factClaim("Built-in Devin Local harness shared with Devin CLI", "https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started"),
      "editor-release-channel": factClaim("Stable desktop plus Devin Desktop Next prerelease", "https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started"),
    },
  }),
  product({
    id: "zed", name: "Zed", categoryId: "code-editors", editorialOrder: 4, officialUrl: "https://zed.dev/docs/ai/overview", repository: repo("zed-industries/zed"), repoMetricId: "zed",
    tags: ["agent-panel", "terminal", "scm", "worktrees", "parallel-agents", "oss"], platform: ["macos", "windows", "linux"], platformSource: { url: "https://zed.dev/docs/installation", title: "Zed installation and platform support" }, source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://zed.dev/docs/ai/zed-agent", "Zed Agent documentation", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-change-review"]),
      ...builtInClaims("https://zed.dev/docs/ai/parallel-agents", "Zed Parallel Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-worktree-isolation"]),
      ...builtInClaims("https://zed.dev/docs/ai/edit-prediction", "Zed Edit Prediction", ["editor-inline-prediction"]),
      ...builtInClaims("https://zed.dev/docs/ai/agent-panel", "Zed Agent Panel", ["editor-mcp"]),
      "editor-remote-workspaces": capability("built-in", "https://zed.dev/docs/remote-development", "Zed Remote Development", "An SSH-backed remote server owns source files, language servers, tasks, and terminals while the local application owns the UI and AI client."),
      "editor-model-access": factClaim("Zed-hosted and configured external providers", "https://zed.dev/docs/ai/zed-agent", "Zed Agent documentation"),
      "editor-agent-permissions": factClaim("Per-tool allow, deny, or confirmation rules", "https://zed.dev/docs/ai/agent-profiles", "Zed Agent Profiles"),
      "editor-agent-sandbox": factClaim("Optional terminal and fetch sandbox on macOS, Linux, and Windows/WSL", "https://zed.dev/docs/ai/sandboxing", "Zed agent sandboxing"),
      "editor-verification-loop": factClaim("Terminal commands, project diagnostics, and change review", "https://zed.dev/docs/ai/tools", "Zed agent tools"),
      "editor-specialization": factClaim("General software development", "https://zed.dev/docs/", "Zed getting started"),
      "editor-ai-feature-boundary": factClaim("Built-in Zed Agent plus ACP external agents and terminal threads", "https://zed.dev/docs/ai/agents", "AI agents in Zed"),
      "editor-release-channel": factClaim("Weekly stable and preview channels", "https://zed.dev/docs/installation", "Zed installation and channels"),
    },
  }),
  product({
    id: "lapce", name: "Lapce", categoryId: "code-editors", editorialOrder: 13,
    officialUrl: "https://docs.lapce.dev/get-started/setup",
    repository: repo("lapce/lapce"), repoMetricId: "lapce",
    tags: ["rust", "modal-editing", "remote-ssh", "plugins", "copilot", "oss"],
    platform: ["macos", "windows", "linux"],
    platformSource: { url: "https://docs.lapce.dev/get-started/setup", title: "Lapce setup" },
    source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://docs.lapce.dev/get-started/setup", "Lapce setup", ["editor-project-tree"]),
      ...builtInClaims("https://docs.lapce.dev/get-started/terminal", "Lapce terminal documentation", ["editor-terminal"]),
      ...builtInClaims("https://docs.lapce.dev/get-started/remote-development", "Lapce remote development", ["editor-remote-workspaces"]),
      "editor-inline-prediction": capability("limited", "https://github.com/lapce/lapce/releases/tag/v0.4.0", "Lapce v0.4.0 release", "Lapce documents experimental Copilot support; a current first-party agent workflow is not established.", "repository-derived"),
      "editor-model-access": factClaim("Experimental GitHub Copilot integration", "https://github.com/lapce/lapce/releases/tag/v0.4.0", "Lapce v0.4.0 release", "No built-in multi-provider agent surface is established.", "repository-derived"),
      "editor-specialization": factClaim("General software development with modal editing", "https://github.com/lapce/lapce/blob/master/README.md", "Lapce README", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("Experimental Copilot completion; no first-party agent panel established", "https://github.com/lapce/lapce/releases/tag/v0.4.0", "Lapce v0.4.0 release", undefined, "repository-derived"),
      "editor-release-channel": factClaim("Active stable desktop releases", "https://github.com/lapce/lapce/releases/latest", "Lapce releases", undefined, "repository-derived"),
    },
  }),
  product({
    id: "helix", name: "Helix", categoryId: "code-editors", editorialOrder: 14,
    officialUrl: "https://helix-editor.com/",
    repository: repo("helix-editor/helix"), repoMetricId: "helix",
    tags: ["terminal-editor", "modal-editing", "lsp", "tree-sitter", "oss"],
    platform: ["macos", "windows", "linux"],
    platformSource: { url: "https://docs.helix-editor.com/package-managers.html", title: "Helix package managers" },
    source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://docs.helix-editor.com/master/commands.html", "Helix commands", ["editor-project-tree"], "Helix provides workspace file explorer and picker commands in its terminal UI."),
      "editor-terminal": capability("not-available", "https://github.com/helix-editor/helix/issues/1976", "Helix integrated-terminal proposal", "Helix itself runs in a terminal and exposes shell-command pipes, but the integrated-terminal proposal remains open.", "source-inspected"),
      "editor-inline-prediction": capability("limited", "https://github.com/helix-editor/helix/discussions/4037", "Helix Copilot support discussion", "Maintainers point to external LSP integrations; Helix has no native Copilot or generic inline-AI integration.", "repository-derived"),
      "editor-model-access": factClaim("External LSP or CLI integrations only", "https://github.com/helix-editor/helix/discussions/4037", "Helix Copilot support discussion", "No built-in model provider or agent configuration is established.", "repository-derived"),
      "editor-specialization": factClaim("Terminal-first modal code editing", "https://github.com/helix-editor/helix", "Helix repository", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("No built-in AI; external LSP or CLI integrations", "https://github.com/helix-editor/helix/discussions/4037", "Helix Copilot support discussion", undefined, "repository-derived"),
      "editor-release-channel": factClaim("Stable GitHub releases; nightly by building master", "https://docs.helix-editor.com/install.html", "Helix installation documentation"),
    },
  }),
  product({
    id: "kiro", name: "Kiro", categoryId: "code-editors", editorialOrder: 15, officialUrl: "https://kiro.dev/docs/ide/",
    tags: ["agent-panel", "spec-driven", "parallel-agents", "cloud-sessions"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://kiro.dev/docs/ide/", "Kiro IDE documentation", ["editor-project-tree", "editor-agent-mode", "editor-mcp"]),
      ...builtInClaims("https://kiro.dev/docs/chat/dev-servers/", "Kiro dev servers", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://kiro.dev/docs/ide/experimental/focus-mode", "Kiro Agent Focus", ["editor-background-jobs", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://kiro.dev/ide/", "Kiro IDE product documentation", ["editor-remote-workspaces"]),
      "editor-model-access": factClaim("Kiro model catalog and Auto routing", "https://kiro.dev/docs/how-kiro-works", "How Kiro works"),
      "editor-agent-permissions": factClaim("Capability rules with deny, ask, and allow plus IDE autonomy mode", "https://kiro.dev/docs/cli/chat/permissions/", "Kiro permissions"),
      "editor-browser-tools": factClaim("Built-in web search and fetch tools", "https://kiro.dev/docs/cli/reference/built-in-tools/", "Kiro built-in tools"),
      "editor-verification-loop": factClaim("Shell, diagnostics, editor-native code analysis, checkpoints, and rewind", "https://kiro.dev/docs/how-kiro-works", "How Kiro works"),
      "editor-specialization": factClaim("General software development with spec-driven workflows", "https://kiro.dev/docs/ide/", "Kiro IDE documentation"),
      "editor-ai-feature-boundary": factClaim("Built-in IDE client for Kiro's shared ACP harness", "https://kiro.dev/docs/how-kiro-works", "How Kiro works"),
      "editor-release-channel": factClaim("Active IDE 1.x stable channel", "https://kiro.dev/changelog/ide/page/2/", "Kiro IDE changelog"),
    },
  }),
  product({
    id: "void", name: "Void", categoryId: "code-editors", editorialOrder: 16, officialUrl: "https://github.com/voideditor/void", repository: repo("voideditor/void"), repoMetricId: "void",
    tags: ["agent-panel", "vscode-derived", "oss", "historical"], platform: ["macos", "windows", "linux"], platformSource: { url: "https://github.com/voideditor/binaries/releases", title: "Void first-party binary releases" }, source: "open-source", execution: ["local-process"], status: "archived",
    claims: {
      ...builtInClaims("https://github.com/voideditor/void", "Void repository", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-change-review"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/voideditor/void/releases", "Void releases", ["editor-inline-prediction"], undefined, "repository-derived"),
      "editor-model-access": factClaim("Direct provider access, BYOK, and local models", "https://github.com/voideditor/void", "Void repository", undefined, "repository-derived"),
      "editor-specialization": factClaim("General software development", "https://github.com/voideditor/void", "Void repository", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("Built into the archived open-source desktop app", "https://github.com/voideditor/void", "Void repository", undefined, "repository-derived"),
      "editor-release-channel": factClaim("Archived; historical binaries retained", "https://github.com/voideditor/void", "Void repository", undefined, "repository-derived"),
    },
  }),
  product({
    id: "visual-studio", name: "Visual Studio", categoryId: "code-editors", editorialOrder: 17,
    officialUrl: "https://visualstudio.microsoft.com/github-copilot/",
    tags: ["windows", "github-copilot", "agent-mode", "enterprise"], platform: ["windows"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://visualstudio.microsoft.com/vs/", "Visual Studio product page", ["editor-project-tree", "editor-terminal"]),
      ...builtInClaims("https://visualstudio.microsoft.com/github-copilot/", "GitHub Copilot in Visual Studio", ["editor-agent-mode", "editor-inline-prediction", "editor-agent-shell-tools", "editor-change-review"]),
      "editor-model-access": factClaim("GitHub Copilot managed models", "https://visualstudio.microsoft.com/github-copilot/", "GitHub Copilot in Visual Studio"),
      "editor-ai-feature-boundary": factClaim("Integrated GitHub Copilot extension", "https://visualstudio.microsoft.com/github-copilot/", "GitHub Copilot in Visual Studio"),
      "editor-specialization": factClaim("Windows, .NET, C++, and game development", "https://visualstudio.microsoft.com/vs/", "Visual Studio product page"),
      "editor-release-channel": factClaim("Active stable releases", "https://visualstudio.microsoft.com/vs/", "Visual Studio product page"),
    },
  }),
  product({
    id: "replit-project-editor", name: "Replit Project Editor", categoryId: "code-editors", editorialOrder: 18,
    officialUrl: "https://docs.replit.com/learn/projects-and-artifacts/project-editor",
    tags: ["browser-ide", "agent", "preview", "task-board", "background"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor", ["editor-project-tree", "editor-agent-mode", "editor-browser-tools", "editor-change-review"]),
      ...builtInClaims("https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", ["editor-background-jobs", "editor-parallel-sessions"]),
      "editor-agent-shell-tools": capability("built-in", "https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor", "The editor exposes console and development tools to Agent within the hosted workspace."),
      "editor-worktree-isolation": capability("limited", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", "Tasks run independently and return changes for application, but the documentation does not describe Git worktrees."),
      "editor-model-access": factClaim("Replit-managed agent modes", "https://docs.replit.com/billing/ai-billing", "Replit AI billing and modes"),
      "editor-agent-sandbox": capability("built-in", "https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor", "Agent executes inside a Replit-hosted project environment."),
      "editor-verification-loop": factClaim("Live preview, console, and checkpoints", "https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor"),
      "editor-specialization": factClaim("Hosted application building and deployment", "https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor"),
      "editor-ai-feature-boundary": factClaim("Agent is built into the hosted editor", "https://docs.replit.com/learn/projects-and-artifacts/project-editor", "Replit Project Editor"),
      "editor-release-channel": factClaim("Continuously delivered hosted product", "https://docs.replit.com/updates", "Replit product updates"),
    },
  }),
  product({
    id: "stagewise", name: "stagewise", categoryId: "code-editors", editorialOrder: 19,
    officialUrl: "https://github.com/stagewise-io/stagewise", repository: repo("stagewise-io/stagewise"), repoMetricId: "stagewise",
    tags: ["agentic-ide", "previews", "git", "multi-provider", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/stagewise-io/stagewise", "stagewise repository", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-change-review", "editor-browser-tools", "editor-verification-loop"], undefined, "repository-derived"),
      "editor-model-access": factClaim("Multiple providers and models", "https://github.com/stagewise-io/stagewise", "stagewise repository", undefined, "repository-derived"),
      "editor-specialization": factClaim("Agentic web and application development", "https://github.com/stagewise-io/stagewise", "stagewise repository", undefined, "repository-derived"),
      "editor-ai-feature-boundary": factClaim("Agents are built into the IDE", "https://github.com/stagewise-io/stagewise", "stagewise repository", undefined, "repository-derived"),
      "editor-release-channel": factClaim("Active open-source releases", "https://github.com/stagewise-io/stagewise/releases", "stagewise releases", undefined, "repository-derived"),
    },
  }),

  // 2. Agent workbenches
  product({
    id: "tortie", name: "Tortie", categoryId: "agent-workbenches", editorialOrder: 1, officialUrl: "https://github.com/gregce/tortie", repository: repo("gregce/tortie"), repoMetricId: "tortie",
    tags: ["terminal", "editor", "scm", "session-durability", "multi-project", "remote-ssh", "bundled-tmux", "context-inventory", "skills", "mcp", "specstory", "oss"],
    platform: ["macos"],
    platformNote: "The current supported desktop build requires macOS 15.7.9 or later on Apple silicon. Early remote-project hosts have been tested on macOS; Linux hosts are not yet claimed as supported clients.",
    platformSource: { url: "https://github.com/gregce/tortie#install", title: "Tortie installation requirements" },
    source: "open-source",
    sourceSource: { url: "https://github.com/gregce/tortie/blob/main/LICENSE", title: "Tortie Apache 2.0 license", basis: "repository-derived" },
    execution: ["local-process", "local-daemon", "ssh-host"],
    executionSource: { url: "https://github.com/gregce/tortie#durable-agent-sessions", title: "Tortie durable and remote session architecture", basis: "repository-derived" },
    status: "active",
    statusSource: { url: "https://github.com/gregce/tortie/releases/latest", title: "Tortie latest release", basis: "repository-derived" },
    claims: {
      ...builtInClaims("https://github.com/gregce/tortie#supported-coding-agents", "Tortie supported coding agents", ["workbench-arbitrary-cli"], "Thirteen coding agents ship as configured launch targets, and operators can add another CLI through a reviewed JSON agent definition.", "repository-derived"),
      ...builtInClaims("https://github.com/gregce/tortie#durable-agent-sessions", "Tortie durable agent sessions", ["workbench-named-sessions", "workbench-pty-survives-ui", "workbench-splits", "workbench-session-recovery"], "Named sessions live in Tortie's private bundled tmux server after the app quits; reboot recovery replays scrollback and arms each supported harness's resume command for operator confirmation.", "repository-derived"),
      ...builtInClaims("https://github.com/gregce/tortie#one-window-pane-for-your-projects", "Tortie multi-project workspace", ["workbench-cross-project-attention"], "Project tabs scope their sessions, repository state, file tree, and editor; universal search can widen across every open project.", "repository-derived"),
      ...builtInClaims("https://github.com/gregce/tortie#familiar-ide-features", "Tortie IDE features", ["workbench-editor", "workbench-file-tree", "workbench-scm", "workbench-change-review"], "Monaco editing and diffs, a decorated project tree, ripgrep search, staging, branches, history, commit graph, and GitHub Actions runs are integrated surfaces.", "repository-derived"),
      "workbench-attention-signals": capability("built-in", "https://github.com/gregce/tortie/blob/main/docs/DESIGN-SPEC.md", "Tortie operator interface specification", "Session and project state roll up working, needs-input, idle, ended, and failed states into project badges, an attention overlay, notifications, and a dock badge.", "source-inspected"),
      "workbench-browser": capability("limited", "https://github.com/gregce/tortie#familiar-ide-features", "Tortie IDE features", "Markdown and sandboxed HTML previews are built in with scripts and network disabled; Tortie does not document a general interactive web browser.", "repository-derived"),
      "workbench-remote-host": capability("built-in", "https://github.com/gregce/tortie#remote-machines-early", "Tortie remote machines", "Remote Mac project tabs use SSH and the host's tmux for files, search, Git, Actions, agent launch, and recovery. The surface is explicitly early, with a configured write-root allowlist.", "repository-derived"),
    },
  }),
  product({
    id: "cate", name: "Cate", categoryId: "agent-workbenches", editorialOrder: 2, officialUrl: "https://github.com/0-AI-UG/cate", repository: repo("0-AI-UG/cate"), repoMetricId: "cate",
    tags: ["agent-ide", "infinite-canvas", "terminal", "editor", "browser", "scm", "worktrees", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/0-AI-UG/cate", "Cate repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-editor", "workbench-file-tree", "workbench-scm", "workbench-change-review", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-browser", "workbench-remote-host", "workbench-programmable-control", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/0-AI-UG/cate/blob/main/CHANGELOG.md", "Cate changelog", ["workbench-pty-survives-ui"], "Restores terminal scrollback and reattaches supported agents with provider resume commands; arbitrary live process survival is not claimed.", "repository-derived"),
    },
  }),
  product({
    id: "cdesktop", name: "cdesktop", categoryId: "agent-workbenches", editorialOrder: 3, officialUrl: "https://github.com/cdesktop-ai/cdesktop", repository: repo("cdesktop-ai/cdesktop"), repoMetricId: "cdesktop",
    tags: ["agent-ide", "browser-client", "multi-agent", "worktrees", "diff-review", "oss", "beta"], platform: ["web"], platformNote: "The shipped client is a local web application; macOS, Windows, and Linux Tauri installers remain roadmap items.", source: "open-source", execution: ["local-daemon", "local-process"], status: "beta",
    claims: {
      ...builtInClaims("https://github.com/cdesktop-ai/cdesktop", "cdesktop repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-scm", "workbench-change-review", "workbench-splits", "workbench-session-recovery", "workbench-browser", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/cdesktop-ai/cdesktop", "cdesktop repository README", ["workbench-editor"], "Current file and plan panes support edits, but the complete project editing surface is not yet documented.", "repository-derived"),
      ...limitedClaims("https://github.com/cdesktop-ai/cdesktop", "cdesktop repository README", ["workbench-file-tree"], "Session working-directory files are available; a complete project tree remains on the roadmap.", "repository-derived"),
      ...limitedClaims("https://github.com/cdesktop-ai/cdesktop", "cdesktop repository README", ["workbench-remote-host"], "Remote SSH configuration opens an external VS Code Remote-SSH target; cdesktop does not own the remote execution session.", "repository-derived"),
    },
  }),
  product({
    id: "cmux", name: "cmux", categoryId: "agent-workbenches", editorialOrder: 4, officialUrl: "https://github.com/manaflow-ai/cmux", repository: repo("manaflow-ai/cmux"), repoMetricId: "cmux",
    tags: ["terminal", "session-restore", "browser", "notifications", "remote-ssh", "oss"], platform: ["macos"], platformNote: "iOS is a companion surface, not the evaluated desktop host.", source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux#session-restore", "cmux session restore", ["workbench-pty-survives-ui", "workbench-session-recovery"], "Restores layouts, working directories, scrollback, and supported agent conversations through native resume IDs; arbitrary process state is not checkpointed.", "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-scm"], "Sidebar shows branch and linked pull-request status; it is not documented as a full source-control editor.", "repository-derived"),
      "workbench-file-tree": capability("built-in", "https://cmux.com/blog/cmux-finder", "cmux Finder", "The Finder-style Files sidebar browses the workspace tree, previews common file types, and follows the remote root in SSH workspaces."),
      "workbench-change-review": capability("built-in", "https://cmux.com/docs/changelog", "cmux changelog 0.64.20", "Diff comments bind to changed lines, persist per repository, and can be attached as structured feedback to the agent terminal."),
      "workbench-worktrees": capability("via-integration", "https://github.com/manaflow-ai/cmux-home/blob/main/docs/customization.md", "cmux customization examples", "The official customization collection includes a worktree starter; it is an ecosystem integration rather than a cmux core capability.", "repository-derived"),
    },
  }),
  product({
    id: "herdr", name: "Herdr", categoryId: "agent-workbenches", editorialOrder: 5, officialUrl: "https://herdr.dev/", repository: repo("herdrdev/herdr"), repoMetricId: "herdr",
    tags: ["tui", "terminal", "multi-agent", "multi-project", "daemon-pty", "session-restore", "attention", "remote-ssh", "socket-api", "worktrees", "plugins", "oss"],
    platform: ["macos", "windows", "linux"],
    platformSource: { url: "https://herdr.dev/docs/persistence-remote/", title: "Herdr persistence and remote access" },
    source: "open-source",
    sourceSource: { url: "https://github.com/herdrdev/herdr/blob/master/LICENSE", title: "Herdr Apache 2.0 license", basis: "repository-derived" },
    execution: ["local-process", "local-daemon", "ssh-host"],
    executionSource: { url: "https://herdr.dev/docs/persistence-remote/", title: "Herdr persistence and remote access" },
    status: "active",
    statusSource: { url: "https://github.com/herdrdev/herdr/releases/latest", title: "Herdr latest release", basis: "repository-derived" },
    claims: {
      ...builtInClaims("https://herdr.dev/docs/concepts/", "Herdr concepts", ["workbench-named-sessions", "workbench-pty-survives-ui", "workbench-splits"]),
      ...builtInClaims("https://herdr.dev/docs/agents/", "Herdr agents", ["workbench-arbitrary-cli", "workbench-cross-project-attention", "workbench-attention-signals"]),
      ...builtInClaims("https://herdr.dev/docs/session-state/", "Herdr session state and restore", ["workbench-session-recovery"]),
      ...builtInClaims("https://herdr.dev/docs/persistence-remote/", "Herdr persistence and remote access", ["workbench-remote-host"]),
      ...builtInClaims("https://herdr.dev/docs/socket-api/", "Herdr socket API", ["workbench-programmable-control", "workbench-worktrees"]),
    },
  }),
  product({ id: "mosaic-terminal", name: "Mosaic Terminal", categoryId: "agent-workbenches", editorialOrder: 6, officialUrl: "https://mosaicterminal.dev/", tags: ["terminal", "session-restore", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: { ...builtInClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-named-sessions", "workbench-cross-project-attention"]), ...limitedClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-pty-survives-ui"], "Continuity is documented as agent relaunch with provider resume flags.") } }),
  product({ id: "airport", name: "Airport", categoryId: "agent-workbenches", editorialOrder: 7, officialUrl: "https://get-airport.com/", tags: ["terminal", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: builtInClaims("https://get-airport.com/", "Airport product", ["workbench-named-sessions", "workbench-cross-project-attention"]) }),
  product({
    id: "wmux", name: "wmux", categoryId: "agent-workbenches", editorialOrder: 8, officialUrl: "https://github.com/openwong2kim/wmux", repository: repo("openwong2kim/wmux"), repoMetricId: "wmux",
    tags: ["terminal", "daemon-pty", "worktrees", "browser", "notifications", "scm", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Linux desktop packages are experimental; the browser/PWA client is read-only and loopback-only by default.", source: "open-source", execution: ["local-daemon", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-browser", "workbench-remote-host", "workbench-programmable-control", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-scm"], "A Git tab covers worktrees and pull requests; this is not a full VS Code-style SCM surface.", "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-file-tree"], "The task-harvest diff surface has a file tree and per-hunk selection; it is not a project-wide editor tree.", "repository-derived"),
      "workbench-change-review": capability("built-in", "https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", "Workspace diffs and task-harvest views provide file trees, unified diffs, per-hunk selection, and atomic adoption.", "repository-derived"),
    },
  }),
  product({
    id: "warp", name: "Warp", categoryId: "agent-workbenches", editorialOrder: 9, officialUrl: "https://www.warp.dev/", repository: repo("warpdotdev/warp"), repoMetricId: "warp",
    tags: ["terminal", "cloud-agent", "blocks", "code-editor", "hybrid:workbench-cloud", "oss", "agpl-3.0"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.warp.dev/code/code-editor", "Warp code editor", ["workbench-editor", "workbench-file-tree"]),
      ...limitedClaims("https://docs.warp.dev/code/code-review", "Warp Code Review", ["workbench-scm"], "Code Review covers Git diffs, branch comparisons, edits, and reverts; the documentation does not establish a complete source-control client."),
      ...builtInClaims("https://docs.warp.dev/code/ssh-feature-support", "Warp SSH feature support", ["workbench-remote-host"]),
      ...builtInClaims("https://docs.warp.dev/agents/cli/", "Warp Agent CLI", ["workbench-programmable-control"]),
      "workbench-change-review": capability("built-in", "https://docs.warp.dev/code/code-review", "Warp Code Review", "The Code Review panel supports live diffs, inline comments, batch agent feedback, editing, reverting, and marking files reviewed."),
      "workbench-worktrees": capability("built-in", "https://docs.warp.dev/code/code-review", "Warp Code Review", "Warp documents native Git worktree support as part of its Code Review workflow."),
    },
  }),
  product({
    id: "wave-terminal", name: "Wave Terminal", categoryId: "agent-workbenches", editorialOrder: 10, officialUrl: "https://github.com/wavetermdev/waveterm", repository: repo("wavetermdev/waveterm"), repoMetricId: "wave-terminal",
    tags: ["terminal", "workspace-blocks", "editor-blocks", "browser", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-arbitrary-cli", "workbench-editor", "workbench-splits", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      "workbench-named-sessions": capability("built-in", "https://docs.waveterm.dev/workspaces", "Wave Terminal workspaces", "Named saved workspaces persist tabs, layouts, terminal histories, and AI histories and can be reopened."),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-pty-survives-ui"], "Durable SSH terminal sessions survive network changes and Wave restarts; equivalent survival is not established for arbitrary local processes.", "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-file-tree"], "Directory and file preview plus connected file management are built in; a project-wide IDE tree is not claimed.", "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-session-recovery"], "Durable SSH sessions reconnect after network changes and Wave restarts; this does not establish local-process survival.", "repository-derived"),
    },
  }),
  product({
    id: "dmux", name: "dmux", categoryId: "agent-workbenches", editorialOrder: 11, officialUrl: "https://github.com/standardagents/dmux", repository: repo("standardagents/dmux"), repoMetricId: "dmux",
    tags: ["tui", "tmux", "multi-agent", "multi-project", "worktrees", "diff-review", "notifications", "oss"], platform: ["macos", "linux"], platformNote: "dmux requires tmux and documents macOS and Linux-specific integration. Native Windows support is not established.", platformSource: { url: "https://github.com/standardagents/dmux/blob/main/docs/src/content/getting-started.js", title: "dmux getting started" }, source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/standardagents/dmux", "dmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-scm", "workbench-change-review", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/standardagents/dmux", "dmux repository README", ["workbench-pty-survives-ui"], "dmux recreates durable terminal panes and resumes supported agent conversations; it does not claim that every live process survives UI exit.", "repository-derived"),
      ...limitedClaims("https://github.com/standardagents/dmux", "dmux repository README", ["workbench-file-tree"], "The built-in file browser searches and previews worktree files and diffs; it is not a project editor.", "repository-derived"),
    },
  }),
  product({
    id: "claude-squad", name: "claude-squad", categoryId: "agent-workbenches", editorialOrder: 12, officialUrl: "https://github.com/smtg-ai/claude-squad", repository: repo("smtg-ai/claude-squad"), repoMetricId: "claude-squad",
    tags: ["tui", "tmux", "multi-agent", "worktrees", "diff-review", "oss"], platform: ["macos", "linux"], platformNote: "The canonical installer has explicit macOS and Linux dependency/install paths. Windows requires a separate tmux environment and is not asserted as a native client.", source: "open-source", execution: ["local-process"],
    claims: {
      ...builtInClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-scm", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["workbench-change-review"], "The TUI supports reviewing changes before applying or checking them out; line-comment feedback is not documented.", "repository-derived"),
      "workbench-cross-project-attention": capability("limited", "https://github.com/smtg-ai/claude-squad", "claude-squad repository", "The session list shows worker state across managed worktrees; a dedicated multi-project attention inbox is not documented.", "repository-derived"),
    },
  }),
  product({
    id: "nodeterm", name: "nodeterm", categoryId: "agent-workbenches", editorialOrder: 13, officialUrl: "https://nodeterm.dev/", repository: repo("eneskirca/nodeterm"), repoMetricId: "nodeterm",
    tags: ["terminal", "tmux", "infinite-canvas", "multi-agent", "session-durability", "attention", "editor", "scm", "worktrees", "remote-ssh", "mobile", "source-available"],
    platform: ["macos", "linux", "web", "ios"], platformNote: "iOS is a companion client. The browser Server Edition is a self-hosted surface over the same live sessions.",
    platformSource: { url: "https://github.com/eneskirca/nodeterm#readme", title: "nodeterm README" },
    source: "source-available", sourceSource: { url: "https://github.com/eneskirca/nodeterm/blob/main/LICENSE", title: "nodeterm Business Source License 1.1", basis: "repository-derived" },
    execution: ["local-daemon", "ssh-host", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/eneskirca/nodeterm#readme", "nodeterm README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-editor", "workbench-file-tree", "workbench-scm", "workbench-change-review", "workbench-attention-signals", "workbench-session-recovery", "workbench-browser", "workbench-remote-host", "workbench-worktrees"], undefined, "repository-derived"),
      "workbench-splits": capability("limited", "https://github.com/eneskirca/nodeterm#readme", "nodeterm README", "Terminals, agents, editors, diffs, and browser nodes share an infinite canvas rather than a conventional split-pane tree.", "repository-derived"),
    },
  }),
  product({
    id: "ccmanager", name: "CCManager", categoryId: "agent-workbenches", editorialOrder: 14, officialUrl: "https://github.com/kbwo/ccmanager", repository: repo("kbwo/ccmanager"), repoMetricId: "ccmanager",
    tags: ["tui", "multi-agent", "multi-project", "worktrees", "attention", "session-resume", "hooks", "oss"],
    platform: ["macos", "windows", "linux"], platformNote: "The cross-platform Node.js CLI is self-contained and has no tmux dependency.",
    platformSource: { url: "https://github.com/kbwo/ccmanager#readme", title: "CCManager README" },
    source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/kbwo/ccmanager#readme", "CCManager README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-attention-signals", "workbench-session-recovery", "workbench-worktrees", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/kbwo/ccmanager#readme", "CCManager README", ["workbench-scm"], "CCManager creates, merges, and deletes Git worktrees; it is not documented as a full source-control client.", "repository-derived"),
    },
  }),
  product({
    id: "tty7", name: "tty7", categoryId: "agent-workbenches", editorialOrder: 15, officialUrl: "https://tty7.io/", repository: repo("l0ng-ai/tty7"), repoMetricId: "tty7",
    tags: ["terminal", "persistent-server", "multi-agent", "multi-project", "notifications", "scm", "worktrees", "remote-ssh", "agent-cli", "oss"],
    platform: ["macos", "windows", "linux"], platformNote: "The release page publishes native macOS, Windows, and Linux packages.",
    platformSource: { url: "https://github.com/l0ng-ai/tty7#install", title: "tty7 installation matrix" },
    source: "open-source", execution: ["local-daemon", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/l0ng-ai/tty7#readme", "tty7 README", ["workbench-arbitrary-cli", "workbench-agent-handoff", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-scm", "workbench-change-review", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-remote-host", "workbench-programmable-control", "workbench-worktrees"], undefined, "repository-derived"),
      "workbench-file-tree": capability("limited", "https://github.com/l0ng-ai/tty7#readme", "tty7 README", "Remote workspaces expose remote files and repositories; the README does not establish a full local project editor tree.", "repository-derived"),
    },
  }),

  // 3. Agent orchestrators
  product({
    id: "claude-code-desktop", name: "Claude Code on desktop", categoryId: "agent-orchestrators", editorialOrder: 1, officialUrl: "https://code.claude.com/docs/en/desktop",
    tags: ["claude-desktop", "code-tab", "worktrees", "diff-review", "pr-lifecycle", "remote-execution"], platform: ["macos", "windows"], platformNote: "This is the Code tab inside Claude Desktop. Linux is explicitly unsupported for this surface; Cowork is a sibling mode, and Claude Code CLI remains a separate harness SKU.", source: "proprietary", execution: ["local-process", "ssh-host", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://code.claude.com/docs/en/desktop", "Claude Code on desktop", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering"]),
      "orchestrator-multi-harness": capability("not-available", "https://code.claude.com/docs/en/desktop", "Claude Code on desktop", "The Code tab runs the Claude Code engine; its documentation does not expose other coding harnesses and reserves agent teams for CLI and SDK surfaces."),
    },
  }),
  product({
    id: "chatgpt-desktop", name: "ChatGPT desktop", categoryId: "agent-orchestrators", editorialOrder: 2, officialUrl: "https://learn.chatgpt.com/docs/app",
    tags: ["desktop", "chatgpt", "codex", "parallel-projects", "long-running-work", "worktrees", "cloud-environments", "containers", "review", "scheduled-tasks", "notifications"], platform: ["macos", "windows", "linux"], platformNote: "This is the current ChatGPT desktop app, which includes ChatGPT and Codex modes. Codex CLI, the IDE extension, and Codex cloud remain separate SKUs.", platformSource: { url: "https://learn.chatgpt.com/docs/app", title: "ChatGPT desktop app" }, source: "proprietary", execution: ["local-process", "vendor-cloud"], executionSource: { url: "https://learn.chatgpt.com/docs/environments/modes", title: "ChatGPT desktop Codex environments" }, status: "active",
    claims: {
      "orchestrator-isolated-workspaces": capability("built-in", "https://learn.chatgpt.com/docs/environments/git-worktrees", "Git worktrees in ChatGPT desktop", "Each worktree chat receives an independent checkout so multiple Codex chats can change the same repository without colliding."),
      "orchestrator-parallel-workers": capability("built-in", "https://learn.chatgpt.com/docs/app", "ChatGPT desktop app", "The app explicitly supports running projects in parallel and keeping long-running work moving."),
      "orchestrator-multi-harness": capability("built-in", "https://learn.chatgpt.com/docs/app", "ChatGPT desktop app", "The desktop composer explicitly lets the operator choose ChatGPT or Codex; this does not imply support for third-party harnesses."),
      "orchestrator-review-delivery": capability("built-in", "https://learn.chatgpt.com/docs/code-review", "ChatGPT desktop code review", "The review pane presents the full diff and supports line-specific feedback, staging, reverting, committing, and pushing changes."),
      "orchestrator-worktrees": capability("built-in", "https://learn.chatgpt.com/docs/environments/git-worktrees", "Git worktrees in ChatGPT desktop", "Desktop Codex can create isolated Git worktrees for parallel chats, move work between Local and Worktree modes, and use dedicated background worktrees for scheduled tasks."),
      "orchestrator-containers": capability("built-in", "https://learn.chatgpt.com/docs/environments/cloud-environment", "ChatGPT desktop cloud environments", "A cloud chat creates a fresh container, checks out the selected repository revision, runs setup, and applies the configured network policy."),
      "orchestrator-task-board": capability("limited", "https://learn.chatgpt.com/docs/automations", "ChatGPT desktop scheduled tasks", "The Scheduled view manages active, paused, and completed recurring tasks and recent runs; it is not documented as a conventional Kanban planning board."),
      "orchestrator-inline-review": capability("built-in", "https://learn.chatgpt.com/docs/code-review", "ChatGPT desktop code review", "Operators can inspect file diffs and leave line-specific feedback for Codex from the desktop review pane."),
      "orchestrator-pr-lifecycle": capability("built-in", "https://learn.chatgpt.com/docs/environments/cloud-environment", "ChatGPT desktop cloud environments", "Cloud Codex work can produce a diff, open a pull request, and continue with follow-up turns in the same environment."),
      "orchestrator-remote-execution": capability("built-in", "https://learn.chatgpt.com/docs/environments/modes", "ChatGPT desktop Codex environments", "Cloud mode runs Codex in a configured remote environment while Local and Worktree modes remain available on the operator's machine."),
      "orchestrator-attention-signals": capability("built-in", "https://learn.chatgpt.com/docs/notifications", "ChatGPT desktop notifications and activity", "Activity and notifications surface running, waiting-for-response, needs-input, ready, blocked, permission, and completion states across chats."),
      "orchestrator-live-steering": capability("built-in", "https://learn.chatgpt.com/docs/long-running-work", "ChatGPT desktop long-running work", "The progress row lets operators pause, resume, edit, or clear a long-running task while the same chat retains context."),
    },
  }),
  product({ id: "orca", name: "Orca", categoryId: "agent-orchestrators", editorialOrder: 3, officialUrl: "https://onorca.dev/", repository: repo("stablyai/orca"), repoMetricId: "orca", tags: ["agent-ide", "worktrees", "terminal", "editor", "scm", "remote-ssh", "mobile", "oss"], platform: ["macos", "windows", "linux", "web", "ios", "android"], platformNote: "iOS and Android are companion clients; the desktop and remote-server surfaces own agent execution.", platformSources: [{ url: "https://onorca.dev/", title: "Orca product and downloads" }, { url: "https://www.onorca.dev/docs/remote-servers", title: "Orca remote server browser clients" }], source: "open-source", execution: ["local-process", "ssh-host", "user-cloud"], claims: {
    ...builtInClaims("https://github.com/stablyai/orca#readme", "Orca repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-remote-execution"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md", "Orca CLI guide", ["orchestrator-worktrees", "orchestrator-programmable"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/stablyai/orca#readme", "Orca repository README", ["orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-attention-signals", "orchestrator-live-steering"], "Orca documents GitHub and Linear project boards, PR browsing, notifications and unread state, mobile follow-ups, and steering active agents.", "repository-derived"),
  } }),
  product({ id: "conductor", name: "Conductor", categoryId: "agent-orchestrators", editorialOrder: 4, officialUrl: "https://www.conductor.build/docs/", tags: ["native-macos", "worktrees", "review", "multi-agent"], platform: ["macos"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://www.conductor.build/docs/", "Conductor documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/git-worktrees", "Conductor Git worktrees", ["orchestrator-worktrees"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/workflow", "Conductor workflow", ["orchestrator-inline-review", "orchestrator-pr-lifecycle"]),
    "orchestrator-multi-harness": capability("built-in", "https://www.conductor.build/docs/reference/harnesses", "Conductor harness overview", "Conductor documents Claude Code, Codex, Cursor, and OpenCode as selectable harnesses."),
    "orchestrator-remote-execution": capability("built-in", "https://www.conductor.build/docs/api", "Conductor API", "The API creates and supervises isolated cloud workspaces."),
    "orchestrator-live-steering": capability("built-in", "https://www.conductor.build/docs/api", "Conductor API", "The API documents sending follow-up messages to active sessions when work stalls or drifts."),
    "orchestrator-programmable": capability("built-in", "https://www.conductor.build/docs/api", "Conductor API", "A documented HTTP and OpenAPI control plane manages projects, cloud workspaces, prompts, status, and transcripts."),
  } }),
  product({
    id: "poolside-desktop-assistant", name: "Poolside Desktop Assistant", categoryId: "agent-orchestrators", editorialOrder: 5, officialUrl: "https://poolside.ai/blog/introducing-poolside-desktop-assistant",
    tags: ["agent-orchestration", "acp", "multi-harness", "worktrees", "diff-review", "cross-harness-handoff"], platform: ["macos"], platformNote: "The announced desktop product currently documents macOS; the separate pool CLI and editor extensions are not this SKU.", source: "proprietary", execution: ["local-process"], status: "active",
    claims: builtInClaims("https://poolside.ai/blog/introducing-poolside-desktop-assistant", "Poolside Desktop Assistant announcement", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-worktrees"]),
  }),
  product({
    id: "bb", name: "bb", categoryId: "agent-orchestrators", editorialOrder: 6, officialUrl: "https://github.com/get-bb/bb", repository: repo("get-bb/bb"), repoMetricId: "bb",
    tags: ["agent-ide", "threads", "multi-harness", "worktrees", "multi-machine", "api", "oss"], platform: ["macos", "linux", "web"], platformNote: "Apple-silicon macOS desktop, alpha Linux AppImage, and local browser UI are documented. Windows is supported through WSL2, not as a native client.", source: "open-source", execution: ["local-daemon", "local-process", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/get-bb/bb", "bb repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-worktrees", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable", "orchestrator-live-steering", "orchestrator-agent-handoff"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/get-bb/bb", "bb repository README", ["orchestrator-task-board", "orchestrator-inline-review"], "The current first-party product screenshot and description explicitly identify a task board and code-review thread.", "repository-derived"),
      ...limitedClaims("https://github.com/get-bb/bb/blob/main/docs/worktrees.md", "bb worktree documentation", ["orchestrator-review-delivery"], "Quick-open and a built-in diff surface support review, while commit, push, and pull-request creation remain agent or shell operations.", "repository-derived"),
    },
  }),
  product({
    id: "omnigent", name: "Omnigent", categoryId: "agent-orchestrators", editorialOrder: 7, officialUrl: "https://github.com/omnigent-ai/omnigent", repository: repo("omnigent-ai/omnigent"), repoMetricId: "omnigent",
    tags: ["meta-harness", "multi-harness", "worktrees", "sandboxes", "cross-vendor-review", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Native Windows mode is documented with degraded isolation; macOS also has a wrapper app and all desktop hosts can use the browser UI.", source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud"], status: "active",
    claims: builtInClaims("https://github.com/omnigent-ai/omnigent", "Omnigent repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-containers", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable", "orchestrator-live-steering"], undefined, "repository-derived"),
  }),
  product({
    id: "agent-orchestrator", name: "Agent Orchestrator", categoryId: "agent-orchestrators", editorialOrder: 8, officialUrl: "https://github.com/Untrivial-ai/agent-orchestrator", repository: repo("Untrivial-ai/agent-orchestrator"), repoMetricId: "agent-orchestrator",
    tags: ["desktop", "multi-harness", "worktrees", "kanban", "pr-lifecycle", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-daemon", "local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/Untrivial-ai/agent-orchestrator", "Agent Orchestrator repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-attention-signals", "orchestrator-live-steering"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/Untrivial-ai/agent-orchestrator", "Agent Orchestrator repository README", ["orchestrator-programmable"], "A current local daemon and CLI route map are documented, but the earlier public npm CLI is frozen and no broad stable automation contract is claimed.", "repository-derived"),
    },
  }),
  product({
    id: "emdash", name: "Emdash", categoryId: "agent-orchestrators", editorialOrder: 9, officialUrl: "https://emdash.com/docs", repository: repo("generalaction/emdash"), repoMetricId: "emdash",
    tags: ["agentic-development-environment", "multi-harness", "worktrees", "diff-review", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "ssh-host", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://emdash.com/docs", "Emdash documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-pr-lifecycle", "orchestrator-remote-execution"]),
      "orchestrator-attention-signals": capability("built-in", "https://emdash.com/docs/providers", "Emdash providers", "Lifecycle hooks track working, awaiting-input, and done states and drive notifications for supported harnesses."),
    },
  }),
  product({
    id: "kandev", name: "Kandev", categoryId: "agent-orchestrators", editorialOrder: 10, officialUrl: "https://kandev.ai/docs/", repository: repo("kdlbs/kandev"), repoMetricId: "kandev",
    tags: ["kanban", "multi-harness", "worktrees", "containers", "remote-execution", "mcp", "oss"], platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "container", "ssh-host", "user-cloud"], status: "active",
    claims: builtInClaims("https://github.com/kdlbs/kandev/blob/main/docs/features.md", "Kandev feature contract", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-containers", "orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
  }),
  product({
    id: "paseo", name: "Paseo", categoryId: "agent-orchestrators", editorialOrder: 11, officialUrl: "https://github.com/getpaseo/paseo", repository: repo("getpaseo/paseo"), repoMetricId: "paseo",
    tags: ["multi-harness", "worktrees", "subagents", "cross-provider-handoff", "mobile", "self-hosted", "oss"], platform: ["macos", "windows", "linux", "web", "ios", "android"], platformNote: "Desktop, browser, and mobile clients connect to a self-hosted Paseo daemon.", source: "open-source", execution: ["local-daemon", "local-process", "container", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/getpaseo/paseo/blob/main/public-docs/orchestration.md", "Paseo orchestration documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-agent-handoff", "orchestrator-worktrees", "orchestrator-live-steering"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/getpaseo/paseo/blob/main/public-docs/providers.md", "Paseo provider documentation", ["orchestrator-multi-harness"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/getpaseo/paseo", "Paseo repository README", ["orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/getpaseo/paseo", "Paseo repository README", ["orchestrator-containers"], "An official Docker daemon and web deployment are documented, but the sources do not establish a separate container or VM for each delegated task.", "repository-derived"),
    },
  }),
  product({ id: "superset", name: "Superset", categoryId: "agent-orchestrators", editorialOrder: 12, officialUrl: "https://github.com/superset-sh/superset", repository: repo("superset-sh/superset"), repoMetricId: "superset", tags: ["worktrees", "terminal", "diff-review", "remote-hosts", "source-available"], platform: ["macos", "linux"], platformNote: "macOS is primary; Linux support is documented as experimental and Windows is explicitly not yet available.", source: "source-available", execution: ["local-process", "ssh-host"], status: "active", claims: {
    ...builtInClaims("https://github.com/superset-sh/superset", "Superset repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
  } }),
  product({ id: "coder-mux", name: "Xum", categoryId: "agent-orchestrators", editorialOrder: 13, officialUrl: "https://github.com/coder/xum", repository: repo("coder/xum"), repoMetricId: "coder-mux", tags: ["chat-control-plane", "worktrees", "ssh", "review", "oss", "formerly-coder-mux"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/coder/xum", "Xum repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived") }),
  product({ id: "nimbalyst", name: "Nimbalyst", categoryId: "agent-orchestrators", editorialOrder: 14, officialUrl: "https://github.com/nimbalyst/nimbalyst", repository: repo("nimbalyst/nimbalyst"), repoMetricId: "nimbalyst", tags: ["agent-ide", "worktrees", "kanban", "editor", "visual-docs", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Mobile companion reach is not counted as a desktop host platform.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst#readme", "Nimbalyst repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board", "orchestrator-inline-review", "orchestrator-attention-signals"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst/blob/main/docs/WORKTREES.md", "Nimbalyst worktree documentation", ["orchestrator-worktrees"], undefined, "repository-derived"),
    "orchestrator-live-steering": capability("built-in", "https://github.com/nimbalyst/nimbalyst", "Nimbalyst repository README", "The dashboard supports replying to agent questions by text or voice and resumes the agent immediately.", "repository-derived"),
  } }),
  product({ id: "t3-code", name: "T3 Code", categoryId: "agent-orchestrators", editorialOrder: 15, officialUrl: "https://t3.codes/", tags: ["chat-control-plane", "branches", "pr-flow", "multi-harness", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The product page provides a macOS download and a first-party Windows/Linux download path; iOS and Android are companion apps.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://t3.codes/", "T3 Code product page", ["orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-pr-lifecycle"], "T3 Code documents multiple agent threads, five named harnesses, mid-thread model switching, inline diff review, and a commit/push/pull-request workflow."),
  } }),
  product({ id: "vibe-kanban", name: "Vibe Kanban", categoryId: "agent-orchestrators", editorialOrder: 16, officialUrl: "https://github.com/BloopAI/vibe-kanban", repository: repo("BloopAI/vibe-kanban"), repoMetricId: "vibe-kanban", tags: ["kanban", "worktrees", "approvals", "oss", "sunsetting"], platform: ["macos", "web"], platformNote: "The repository documents a macOS source build and a browser UI. Windows-specific configuration does not establish a native Windows client; Linux client support is not asserted.", source: "open-source", execution: ["local-process"], status: "sunsetting", claims: {
    ...builtInClaims("https://github.com/BloopAI/vibe-kanban/blob/main/docs/core-features/monitoring-task-execution.mdx", "Vibe Kanban task execution documentation", ["orchestrator-isolated-workspaces", "orchestrator-multi-harness", "orchestrator-worktrees"], undefined, "source-inspected"),
    ...builtInClaims("https://github.com/BloopAI/vibe-kanban/blob/main/docs/workspaces/changes.mdx", "Vibe Kanban changes panel", ["orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-pr-lifecycle"], undefined, "source-inspected"),
    ...builtInClaims("https://github.com/BloopAI/vibe-kanban/blob/main/docs/core-features/creating-tasks.mdx", "Vibe Kanban task documentation", ["orchestrator-task-board"], undefined, "source-inspected"),
    "orchestrator-remote-execution": capability("limited", "https://github.com/BloopAI/vibe-kanban", "Vibe Kanban repository README", "The project documents remote-server and self-hosted Docker deployments; this does not establish a vendor-managed execution plane.", "repository-derived"),
  } }),
  product({ id: "sculptor", name: "Sculptor", categoryId: "agent-orchestrators", editorialOrder: 17, officialUrl: "https://github.com/imbue-ai/sculptor", repository: repo("imbue-ai/sculptor"), repoMetricId: "sculptor", tags: ["containers", "worktrees", "ide-pairing", "oss"], platform: ["macos", "linux"], source: "open-source", execution: ["container"], status: "beta", claims: {
    ...builtInClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-pr-lifecycle"], undefined, "repository-derived"),
    ...limitedClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-containers"], "Docker and remote container backends are documented as experimental.", "repository-derived"),
    "orchestrator-remote-execution": capability("limited", "https://github.com/imbue-ai/sculptor/blob/main/docs/help/experimental/container_backend.md", "Sculptor experimental container backend", "A remote container backend is documented as experimental.", "repository-derived"),
  } }),
  product({ id: "humanlayer", name: "HumanLayer", categoryId: "agent-orchestrators", editorialOrder: 18, officialUrl: "https://humanlayer.com/", repository: repo("humanlayer/humanlayer", "deprecated-predecessor"), tags: ["worktrees", "kanban", "local-daemon", "cloud-daemon", "review"], platform: ["macos", "windows", "linux", "web"], platformNote: "The current product page links macOS plus Linux/Windows installs and documents the same UI on web, desktop, and phone.", source: "proprietary", execution: ["local-daemon", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://humanlayer.com/", "HumanLayer product", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board"]),
    ...builtInClaims("https://docs.humanlayer.com/guide/workspaces", "HumanLayer workspace setup", ["orchestrator-worktrees"]),
    ...limitedClaims("https://docs.humanlayer.com/release-notes", "HumanLayer release notes", ["orchestrator-inline-review"], "Keyboard diff navigation and inline comments are currently an experimental alpha."),
    ...builtInClaims("https://docs.humanlayer.com/reference/skills-workflows", "HumanLayer workflows reference", ["orchestrator-pr-lifecycle"]),
    ...builtInClaims("https://docs.humanlayer.com/tutorials/remote-daemon", "HumanLayer remote daemon", ["orchestrator-remote-execution"]),
    "orchestrator-attention-signals": capability("built-in", "https://humanlayer.com/", "HumanLayer product page", "The task view surfaces running, idle, done, and draft session states across many parallel sessions."),
    "orchestrator-live-steering": capability("built-in", "https://humanlayer.com/", "HumanLayer product page", "The current UI documents real-time human-agent collaboration and a Send to agent action."),
    "orchestrator-programmable": capability("built-in", "https://humanlayer.com/", "HumanLayer product page", "The current execution topology explicitly exposes the HumanLayer API between clients and local or cloud daemons."),
  } }),
  product({ id: "agent-deck", name: "agent-deck", categoryId: "agent-orchestrators", editorialOrder: 19, officialUrl: "https://github.com/asheshgoplani/agent-deck", repository: repo("asheshgoplani/agent-deck"), repoMetricId: "agent-deck", tags: ["tui", "tmux", "worktrees", "remote-ssh", "oss"], platform: ["macos", "linux", "web"], platformNote: "macOS and Linux are documented directly; Windows is supported through WSL rather than as a native client. The local daemon exposes an official browser UI.", source: "open-source", execution: ["local-process", "ssh-host", "container"], status: "active", claims: {
    ...builtInClaims("https://github.com/asheshgoplani/agent-deck", "agent-deck repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-worktrees", "orchestrator-containers", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
  } }),
  product({
    id: "openai-symphony", name: "OpenAI Symphony", categoryId: "agent-orchestrators", editorialOrder: 20,
    officialUrl: "https://github.com/openai/symphony", repository: repo("openai/symphony"), repoMetricId: "openai-symphony",
    tags: ["codex", "linear", "isolated-workspaces", "daemon", "oss", "preview"], platform: ["macos", "linux"], platformNote: "The reference implementation publishes self-contained arm64 and x86_64 executables for macOS and Linux; Windows is not a published target.", platformSource: { url: "https://github.com/openai/symphony/blob/main/elixir/README.md#burrito-releases", title: "Symphony reference releases" }, source: "open-source", execution: ["local-daemon", "local-process"], status: "beta",
    claims: {
      ...builtInClaims("https://github.com/openai/symphony/blob/main/SPEC.md", "Symphony service specification", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "source-inspected"),
      "orchestrator-multi-harness": capability("limited", "https://github.com/openai/symphony/blob/main/SPEC.md", "Symphony service specification", "The reference contract targets Codex app-server; the specification is portable but does not ship multiple harness adapters.", "source-inspected"),
      "orchestrator-live-steering": capability("limited", "https://github.com/openai/symphony/blob/main/SPEC.md", "Symphony service specification", "Workers reconcile tracker state and continuation turns; an interactive operator steering UI is optional rather than required.", "source-inspected"),
    },
  }),
  product({
    id: "aionui", name: "AionUi", categoryId: "agent-orchestrators", editorialOrder: 21,
    officialUrl: "https://github.com/iOfficeAI/AionUi", repository: repo("iOfficeAI/AionUi"), repoMetricId: "aionui",
    tags: ["cowork", "multi-harness", "team-mode", "automation", "remote-access", "oss"], platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "local-daemon", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/iOfficeAI/AionUi", "AionUi repository", ["orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-task-board", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
      "orchestrator-isolated-workspaces": capability("limited", "https://github.com/iOfficeAI/AionUi", "AionUi repository", "Parallel agents have independent contexts and permissions but Team Mode currently shares a working folder.", "repository-derived"),
      "orchestrator-review-delivery": capability("built-in", "https://github.com/iOfficeAI/AionUi", "AionUi repository", "The unified interface exposes each agent's progress, outputs, files, and approval requests.", "repository-derived"),
    },
  }),
  product({
    id: "openhands-agent-canvas", name: "OpenHands Agent Canvas", categoryId: "agent-orchestrators", editorialOrder: 22,
    officialUrl: "https://docs.openhands.dev/openhands/usage/agent-canvas/overview", repository: repo("OpenHands/OpenHands"), repoMetricId: "openhands-agent-canvas",
    tags: ["self-hosted", "multi-harness", "automations", "containers", "remote-backends", "oss"], platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "container", "user-cloud", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/OpenHands/OpenHands", "OpenHands Agent Canvas repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-containers", "orchestrator-remote-execution", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
      "orchestrator-agent-handoff": capability("built-in", "https://docs.openhands.dev/openhands/usage/agent-canvas/overview", "Agent Canvas overview", "Canvas can switch between OpenHands and ACP-compatible agents and between local, remote, and cloud backends."),
      "orchestrator-task-board": capability("limited", "https://github.com/OpenHands/OpenHands", "OpenHands Agent Canvas repository", "Automations can decompose issues and dispatch work, but a conventional Kanban board is not the primary surface.", "repository-derived"),
      "orchestrator-attention-signals": capability("built-in", "https://docs.openhands.dev/openhands/usage/agent-canvas/overview", "Agent Canvas overview", "Conversation and automation states remain visible across connected backends."),
    },
  }),
  product({
    id: "kortix", name: "Kortix", categoryId: "agent-orchestrators", editorialOrder: 23,
    officialUrl: "https://github.com/kortix-ai/suna", repository: repo("kortix-ai/suna", "source-tree"), repoMetricId: "kortix",
    tags: ["ai-management-system", "sandboxes", "branches", "approvals", "triggers", "source-available", "formerly-suna"], platform: ["macos", "windows", "linux", "web"], source: "source-available", execution: ["container", "user-cloud", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/kortix-ai/suna", "Kortix repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-containers", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived"),
      "orchestrator-multi-harness": capability("limited", "https://github.com/kortix-ai/suna", "Kortix repository", "Kortix supports multiple models and agent roles but documents OpenCode as its primary session agent.", "repository-derived"),
      "orchestrator-task-board": capability("limited", "https://github.com/kortix-ai/suna", "Kortix repository", "Sessions and change requests are managed centrally; a Kanban board contract is not established.", "repository-derived"),
      "orchestrator-live-steering": capability("built-in", "https://github.com/kortix-ai/suna", "Kortix repository", "Sessions support on-demand and human-assisted operation with operator check-ins.", "repository-derived"),
    },
  }),
  product({
    id: "cc-haha", name: "Claude Code Haha", categoryId: "agent-orchestrators", editorialOrder: 24, officialUrl: "https://github.com/NanmiCoder/cc-haha", repository: repo("NanmiCoder/cc-haha"), repoMetricId: "cc-haha",
    tags: ["desktop", "agent-teams", "workflow-orchestration", "parallel-subagents", "worktrees", "diff-review", "scheduled-tasks", "remote-mobile", "oss"],
    platform: ["macos", "windows", "linux", "web"], platformNote: "The web surface is H5 remote access to the desktop workspace rather than an independent execution host.",
    platformSource: { url: "https://github.com/NanmiCoder/cc-haha#readme", title: "Claude Code Haha README" },
    source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/NanmiCoder/cc-haha#readme", "Claude Code Haha README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-worktrees", "orchestrator-task-board", "orchestrator-attention-signals", "orchestrator-live-steering"], undefined, "repository-derived"),
      "orchestrator-review-delivery": capability("limited", "https://github.com/NanmiCoder/cc-haha#readme", "Claude Code Haha README", "The app provides task progress, changed-file review, syntax-highlighted diffs, and whole-turn undo; a complete delivery or merge gate is not documented.", "repository-derived"),
      "orchestrator-inline-review": capability("limited", "https://github.com/NanmiCoder/cc-haha#readme", "Claude Code Haha README", "The app provides syntax-highlighted file diffs and whole-turn undo; line-level review comments are not documented.", "repository-derived"),
      "orchestrator-remote-execution": capability("limited", "https://github.com/NanmiCoder/cc-haha#readme", "Claude Code Haha README", "H5 remote access and messaging integrations can continue locally owned work from another device, but do not establish a separate remote execution host.", "repository-derived"),
    },
  }),
  product({
    id: "codeg", name: "Codeg", categoryId: "agent-orchestrators", editorialOrder: 25, officialUrl: "https://docs.codeg.app/", repository: repo("xintaofei/codeg"), repoMetricId: "codeg",
    tags: ["task-board", "delegation", "multi-harness", "parallel-workers", "worktrees", "review-gate", "server", "mobile", "acp", "oss"],
    platform: ["macos", "windows", "linux", "web", "ios", "android"], platformNote: "The iOS and Android apps are clients for a desktop or self-hosted Codeg server.",
    platformSource: { url: "https://github.com/xintaofei/codeg#readme", title: "Codeg README" },
    source: "open-source", execution: ["local-process", "local-daemon", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/xintaofei/codeg#readme", "Codeg README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-task-board", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived"),
      "orchestrator-inline-review": capability("limited", "https://github.com/xintaofei/codeg#readme", "Codeg README", "Finished tasks wait in review with a visual diff and another-pass or accept controls; line-comment feedback is not documented.", "repository-derived"),
      "orchestrator-live-steering": capability("limited", "https://github.com/xintaofei/codeg#readme", "Codeg README", "A finished task can be sent back for another pass, but redirecting an actively running unattended worker is not documented.", "repository-derived"),
      "orchestrator-programmable": capability("built-in", "https://github.com/xintaofei/codeg#readme", "Codeg README", "Reusable automations run headlessly on a cron schedule or on demand, creating sessions or reviewable to-do tasks.", "repository-derived"),
    },
  }),
  product({
    id: "cli-agent-orchestrator", name: "AWS CLI Agent Orchestrator", categoryId: "agent-orchestrators", editorialOrder: 26,
    officialUrl: "https://awslabs.github.io/cli-agent-orchestrator/", repository: repo("awslabs/cli-agent-orchestrator"), repoMetricId: "cli-agent-orchestrator",
    tags: ["supervisor", "multi-harness", "parallel-workers", "tmux", "web-ui", "mcp", "workflows", "worktrees", "oss"],
    platform: ["macos", "linux"], platformNote: "CAO requires tmux; its first-party setup is documented for Unix-like hosts rather than native Windows.",
    platformSource: { url: "https://github.com/awslabs/cli-agent-orchestrator#prerequisites", title: "CLI Agent Orchestrator prerequisites" },
    source: "open-source", execution: ["local-daemon", "local-process", "container"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/awslabs/cli-agent-orchestrator#readme", "CLI Agent Orchestrator README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-worktrees", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
      "orchestrator-containers": capability("limited", "https://github.com/awslabs/cli-agent-orchestrator#readme", "CLI Agent Orchestrator README", "A devcontainer installation is documented, but per-worker container isolation is not the default execution contract.", "repository-derived"),
    },
  }),
  product({
    id: "oh-my-claudecode", name: "Oh My ClaudeCode", categoryId: "agent-orchestrators", editorialOrder: 27,
    officialUrl: "https://oh-my-claudecode.dev/", repository: repo("Yeachan-Heo/oh-my-claudecode"), repoMetricId: "oh-my-claudecode",
    tags: ["claude-code", "teams", "multi-harness", "parallel-workers", "tmux", "verification-loop", "worktrees", "sdk", "oss"],
    platform: ["macos", "windows", "linux"], platformNote: "OMC runs through Claude Code's plugin surface or its Node.js CLI; named workflow profiles have an additional Linux-only flock requirement.",
    platformSource: { url: "https://github.com/Yeachan-Heo/oh-my-claudecode#readme", title: "Oh My ClaudeCode README" },
    source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/Yeachan-Heo/oh-my-claudecode#readme", "Oh My ClaudeCode README", ["orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived"),
      "orchestrator-isolated-workspaces": capability("limited", "https://github.com/Yeachan-Heo/oh-my-claudecode#readme", "Oh My ClaudeCode README", "Native team worktrees are documented behind an opt-in configuration gate rather than as the default worker boundary.", "repository-derived"),
      "orchestrator-worktrees": capability("limited", "https://github.com/Yeachan-Heo/oh-my-claudecode/blob/main/docs/TEAM-WORKTREE-MODE.md", "Oh My ClaudeCode team worktree mode", "Native team worktrees are opt-in and the README describes the mode as being added behind a configuration gate.", "repository-derived"),
      "orchestrator-task-board": capability("limited", "https://github.com/Yeachan-Heo/oh-my-claudecode#readme", "Oh My ClaudeCode README", "Team execution has explicit plan, execute, verify, and fix stages with live HUD status; a conventional Kanban board is not documented.", "repository-derived"),
    },
  }),

  // 4. Coding-agent harnesses
  product({ id: "claude-code", name: "Claude Code", categoryId: "coding-agent-harnesses", editorialOrder: 1, officialUrl: "https://code.claude.com/docs/en/getting-started", tags: ["cli", "vendor-model", "resume", "subagents"], platform: ["macos", "windows", "linux"], platformNote: "Current requirements list native Windows and named Linux distributions.", source: "proprietary", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://docs.anthropic.com/en/docs/claude-code/overview", "Claude Code documentation", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://code.claude.com/docs/en/memory", "Claude Code memory documentation", "CLAUDE.md project and user instructions are loaded as memory."),
    "harness-permission-controls": capability("built-in", "https://code.claude.com/docs/en/permissions", "Claude Code permissions documentation", "Tool allow and deny rules and permission modes; interactive approvals remain visible."),
    "harness-sandbox": capability("built-in", "https://code.claude.com/docs/en/sandboxing", "Claude Code sandboxing documentation", "Filesystem and network isolation can run commands inside an operating-system sandbox."),
    "harness-checkpoints": capability("built-in", "https://code.claude.com/docs/en/checkpointing", "Claude Code checkpointing documentation", "Claude Code records checkpoints and can rewind code or conversation state."),
    "harness-subagents": capability("built-in", "https://code.claude.com/docs/en/sub-agents", "Claude Code subagents documentation", "Built-in and custom subagents have separate context, prompts, tools, and permissions."),
    "harness-structured-output": capability("built-in", "https://docs.anthropic.com/en/docs/claude-code/cli-usage", "Claude Code CLI usage", "Print mode supports text, JSON, and stream-JSON output."),
    "harness-git-workflow": capability("built-in", "https://code.claude.com/docs/en/common-workflows", "Claude Code common workflows", "First-party workflows document Git operations, commits, and pull-request creation."),
    "harness-multimodal-input": capability("built-in", "https://code.claude.com/docs/en/tutorials", "Claude Code tutorials", "First-party tutorials document adding image inputs to a coding session."),
    "harness-multi-provider": capability("built-in", "https://code.claude.com/docs/en/model-config", "Claude Code model configuration", "Anthropic, Amazon Bedrock, Google Vertex AI, and Microsoft Foundry deployment paths are documented; this is provider routing for Claude models, not arbitrary-model BYOK."),
  } }),
  product({ id: "codex-cli", name: "Codex CLI", categoryId: "coding-agent-harnesses", editorialOrder: 2, officialUrl: "https://learn.chatgpt.com/docs/codex/cli", repository: repo("openai/codex"), repoMetricId: "codex-cli", tags: ["cli", "multi-agent-runtime", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Official install guidance provides macOS, Linux, and Windows paths.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/openai/codex", "Codex CLI repository", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://learn.chatgpt.com/docs/agent-configuration/agents-md", "Codex AGENTS.md documentation", "Hierarchical AGENTS.md and AGENTS.override.md instructions load before work."),
    "harness-permission-controls": capability("built-in", "https://learn.chatgpt.com/docs/codex/cli", "Codex CLI documentation", "User-selectable permissions govern what Codex may do."),
    "harness-sandbox": capability("built-in", "https://learn.chatgpt.com/docs/sandboxing", "Codex sandboxing documentation", "Codex documents sandbox modes and operating-system enforcement."),
    "harness-subagents": capability("built-in", "https://learn.chatgpt.com/docs/agent-configuration/subagents", "Codex subagents documentation", "First-party subagent configuration and delegation."),
    "harness-multi-provider": capability("built-in", "https://learn.chatgpt.com/docs/config-file/config-advanced", "Codex advanced configuration", "Custom providers configure base URL, wire API, authentication, and headers; local OSS mode supports Ollama and LM Studio."),
    "harness-structured-output": capability("built-in", "https://learn.chatgpt.com/docs/non-interactive-mode", "Codex non-interactive mode", "Codex exec can emit JSONL events and a schema-constrained final result."),
    "harness-git-workflow": capability("built-in", "https://learn.chatgpt.com/docs/codex/cli", "Codex CLI documentation", "The CLI documentation includes repository-aware review and Git workflows."),
    "harness-multimodal-input": capability("built-in", "https://learn.chatgpt.com/docs/codex/cli", "Codex CLI documentation", "The CLI accepts image inputs as session context."),
  } }),
  product({ id: "github-copilot-cli", name: "GitHub Copilot CLI", categoryId: "coding-agent-harnesses", editorialOrder: 3, officialUrl: "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", repository: repo("github/copilot-cli", "metadata-only"), tags: ["cli", "github-cli", "copilot", "vendor-service", "resume"], platform: ["macos", "windows", "linux"], platformNote: "The separate copilot executable supports macOS, Linux, Windows PowerShell, and WSL; gh is a launcher and task client, not this harness.", source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", "GitHub Copilot CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    "harness-extension-protocol": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview", "GitHub Copilot CLI customization", "Custom agents, skills, MCP servers, hooks, and plugins are first-party customization surfaces."),
    "harness-multi-provider": capability("limited", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", "About GitHub Copilot CLI", "Multiple GitHub-selected models are available; this row does not treat model selection as general bring-your-own provider support."),
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview", "GitHub Copilot CLI overview", ["harness-project-instructions", "harness-checkpoints", "harness-subagents"]),
    "harness-permission-controls": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools", "GitHub Copilot CLI tool permissions", "Users can allow individual tools and remembered tool patterns."),
    "harness-structured-output": capability("built-in", "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference", "GitHub Copilot CLI reference", "The CLI reference documents machine-readable command output."),
    "harness-git-workflow": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", "About GitHub Copilot CLI", "Git and pull-request workflows are first-party product capabilities."),
    "harness-sandbox": capability("built-in", "https://github.com/github/copilot-cli/blob/main/changelog.md", "GitHub Copilot CLI changelog", "The first-party changelog documents the /sandbox policy UI, path and network enforcement, platform policies, bypass behavior, and sandboxed command execution.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/github/copilot-cli/blob/main/changelog.md", "GitHub Copilot CLI changelog", "The first-party changelog documents pasted and dragged images, attached images and PDFs, vision policy, and the non-interactive --attachment flag.", "repository-derived"),
  } }),
  product({ id: "gemini-cli", name: "Gemini CLI", categoryId: "coding-agent-harnesses", editorialOrder: 4, officialUrl: "https://geminicli.com/docs/get-started/installation/", repository: repo("google-gemini/gemini-cli"), repoMetricId: "gemini-cli", tags: ["cli", "vendor-model", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "macOS 15+, Windows 11 24H2+, and Ubuntu 20.04+ are documented.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://geminicli.com/docs/cli/tutorials/memory-management/", "Gemini CLI memory management", "Hierarchical GEMINI.md project context and persistent memory."),
    "harness-permission-controls": capability("built-in", "https://geminicli.com/docs/reference/policy-engine/", "Gemini CLI policy engine", "The policy engine evaluates tool calls against configurable allow, deny, and confirmation rules."),
    "harness-sandbox": capability("built-in", "https://geminicli.com/docs/cli/sandbox/", "Gemini CLI sandbox documentation", "macOS Seatbelt and Docker or Podman sandbox options; sandbox expansion can request added access."),
    "harness-checkpoints": capability("built-in", "https://geminicli.com/docs/cli/checkpointing/", "Gemini CLI checkpointing documentation", "Optional checkpoints restore files, conversation history, and the pending tool call."),
    "harness-structured-output": capability("built-in", "https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", "Headless mode supports JSON and newline-delimited stream JSON.", "repository-derived"),
    "harness-subagents": capability("built-in", "https://geminicli.com/docs/core/subagents/", "Gemini CLI subagents", "First-party documentation defines specialized subagents with separate prompts and tool access."),
    "harness-git-workflow": capability("built-in", "https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", "The first-party GitHub integration documents pull-request review and issue workflows.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", "The current README explicitly documents generating applications from PDFs, images, or sketches through multimodal input.", "repository-derived"),
  } }),
  product({ id: "amp", name: "Amp", categoryId: "coding-agent-harnesses", editorialOrder: 5, officialUrl: "https://ampcode.com/manual", tags: ["cli", "headless", "threads", "plugins", "subagents"], platform: ["macos", "windows", "linux"], platformNote: "The manual documents macOS, Linux, WSL, and native Windows PowerShell installs.", source: "proprietary", sourceSource: { url: "https://ampcode.com/security", title: "Amp Security Reference" }, execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://ampcode.com/manual", "Amp manual", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-subagents", "harness-structured-output", "harness-multimodal-input"]),
    "harness-permission-controls": capability("built-in", "https://ampcode.com/manual", "Amp manual", "Amp runs tools without prompts by default, but its Plugin API and compatibility settings provide allow, reject, and interactive approval policies."),
    "harness-sandbox": capability("via-integration", "https://ampcode.com/manual/orbs", "Amp Orbs", "The local CLI uses its host environment; optional Orbs give each thread a fresh remote machine containing a cloned repository and its tools."),
    "harness-git-workflow": capability("built-in", "https://ampcode.com/manual", "Amp manual", "Changes Workflow can commit and push to main, push a branch and return a GitHub pull-request URL, or run a configured custom ship prompt."),
  } }),
  product({ id: "prime-agent", name: "Prime Agent", categoryId: "coding-agent-harnesses", editorialOrder: 6, officialUrl: "https://github.com/PrimeIntellect-ai/prime-agent", repository: repo("PrimeIntellect-ai/prime-agent"), repoMetricId: "prime-agent", tags: ["cli", "daemon", "continual-agent", "subagents", "multi-model", "oss"], platform: ["macos", "linux"], platformNote: "The stable installation path documents macOS and Linux; native Windows support is not asserted.", source: "open-source", execution: ["local-process", "local-daemon"], status: "active", claims: {
    ...builtInClaims("https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md", "Prime Agent README", ["harness-interactive-cli", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-subagents"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md", "Prime Agent usage", ["harness-headless", "harness-project-instructions", "harness-permission-controls", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    "harness-sandbox": capability("not-available", "https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md", "Prime Agent README", "The project explicitly says commands run with the user's permissions and are not sandboxed.", "source-inspected"),
    "harness-checkpoints": capability("limited", "https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md", "Prime Agent usage", "Refine can restore harness state, but workspace mutation rollback is not established.", "repository-derived"),
  } }),
  product({ id: "deepseek-harness", name: "DeepSeek Harness", categoryId: "coding-agent-harnesses", editorialOrder: 7, officialUrl: "https://deepseek.com/harness/en/", repository: repo("deepseek-ai/deepseek-harness"), repoMetricId: "deepseek-harness", tags: ["cli", "headless", "web", "plugin-runtime", "subagents", "oss"], platform: ["web"], platformNote: "The base repository explicitly documents a locally served browser UI. Host operating-system support is not asserted by the current first-party install contract.", source: "open-source", execution: ["local-process"], status: "beta", claims: {
    "harness-interactive-cli": capability("via-extension", "https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md", "DeepSeek Harness CLI", "The base CLI ships web and headless profiles; the first-party TUI is an optional installed profile.", "repository-derived"),
    "harness-headless": capability("built-in", "https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md", "DeepSeek Harness CLI", "The headless profile runs a persisted one-shot task.", "repository-derived"),
    ...builtInClaims("https://deepseek.com/harness/en/", "DeepSeek Harness product", ["harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-subagents"]),
    "harness-project-instructions": capability("built-in", "https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/context/agent-instructions/README.md", "DeepSeek Harness agent instructions", "Hierarchical user and project AGENTS.md and CLAUDE.md files are loaded.", "repository-derived"),
    ...builtInClaims("https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md", "DeepSeek Harness configuration catalog", ["harness-permission-controls", "harness-sandbox"], undefined, "repository-derived"),
    "harness-checkpoints": capability("limited", "https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md", "DeepSeek Harness configuration catalog", "The checkpoint policy governs session-log durability; workspace-file rollback is not established.", "repository-derived"),
    "harness-structured-output": capability("limited", "https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md", "DeepSeek Harness CLI", "Headless and JSON-RPC surfaces exist, but the CLI does not document a stable result schema.", "repository-derived"),
    "harness-git-workflow": capability("limited", "https://deepseek.com/harness/en/", "DeepSeek Harness product", "Shell and editing tools can operate on Git, but a managed branch, commit, or review lifecycle is not documented."),
  } }),
  product({ id: "poolside-pool", name: "pool", categoryId: "coding-agent-harnesses", editorialOrder: 8, officialUrl: "https://docs.poolside.ai/cli/pool", repository: repo("poolsideai/pool", "source-tree"), tags: ["cli", "acp", "sandbox", "subagents", "source-available", "poolside"], platform: ["macos", "windows", "linux"], platformNote: "Linux and macOS are supported; Windows is documented as preview.", source: "source-available", execution: ["local-process", "container"], status: "active", claims: {
    ...builtInClaims("https://github.com/poolsideai/pool", "pool repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-subagents", "harness-structured-output"], undefined, "repository-derived"),
    "harness-sandbox": capability("built-in", "https://docs.poolside.ai/sandboxes", "Poolside sandbox documentation", "An optional managed local container sandbox controls file and network access; unsandboxed local execution remains available."),
    "harness-checkpoints": capability("limited", "https://github.com/poolsideai/pool", "pool repository", "Conversation rewind is documented; workspace-file rollback is not.", "repository-derived"),
    "harness-git-workflow": capability("limited", "https://github.com/poolsideai/pool", "pool repository", "The agent can modify repositories, but a managed worktree, branch, or review lifecycle is not established.", "repository-derived"),
  } }),
  product({ id: "kimi-code-cli", name: "Kimi Code CLI", categoryId: "coding-agent-harnesses", editorialOrder: 9, officialUrl: "https://moonshotai.github.io/kimi-code/en/", repository: repo("MoonshotAI/kimi-code"), repoMetricId: "kimi-code-cli", tags: ["cli", "tui", "acp", "video-input", "subagents", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The Windows installation path requires Git Bash.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    "harness-interactive-cli": capability("built-in", "https://github.com/MoonshotAI/kimi-code", "Kimi Code README", "Kimi Code ships an interactive terminal interface.", "repository-derived"),
    "harness-headless": capability("limited", "https://github.com/MoonshotAI/kimi-code", "Kimi Code README", "A local server/API surface exists, but a stable one-shot CLI contract is not established.", "repository-derived"),
    "harness-multi-provider": capability("built-in", "https://moonshotai.github.io/kimi-code/en/configuration/config-files", "Kimi Code configuration", "Configuration supports Kimi, Anthropic, OpenAI/Responses, Google GenAI, and Vertex AI provider types."),
    "harness-session-resume": capability("built-in", "https://moonshotai.github.io/kimi-code/en/guides/sessions", "Kimi Code sessions", "Persistent sessions support resume, fork, and export."),
    ...builtInClaims("https://github.com/MoonshotAI/kimi-code", "Kimi Code README", ["harness-extension-protocol", "harness-subagents"], undefined, "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/customization/agents.md", "Kimi Code agent customization", "Global and project AGENTS.md files are loaded as workspace instructions.", "repository-derived"),
    "harness-permission-controls": capability("built-in", "https://moonshotai.github.io/kimi-code/en/guides/interaction", "Kimi Code interaction guide", "Approval rules and interaction modes govern tool execution."),
    "harness-checkpoints": capability("limited", "https://moonshotai.github.io/kimi-code/en/guides/sessions", "Kimi Code sessions", "Sessions can be forked, but workspace rollback is not established."),
    "harness-structured-output": capability("limited", "https://moonshotai.github.io/kimi-code/en/guides/sessions", "Kimi Code sessions", "Session export and local APIs exist, but a canonical one-shot result schema is not established."),
    "harness-multimodal-input": capability("built-in", "https://moonshotai.github.io/kimi-code/en/guides/interaction", "Kimi Code interaction guide", "The interaction surface accepts images and video."),
  } }),
  product({ id: "kilo-code-cli", name: "Kilo Code CLI", categoryId: "coding-agent-harnesses", editorialOrder: 10, officialUrl: "https://kilo.ai/docs/code-with-ai/platforms/cli", repository: repo("Kilo-Org/kilocode"), repoMetricId: "kilo-code", tags: ["cli", "tui", "acp", "multi-model", "subagents", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://kilo.ai/docs/code-with-ai/platforms/cli", "Kilo Code CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-subagents", "harness-git-workflow"]),
    "harness-structured-output": capability("limited", "https://kilo.ai/docs/code-with-ai/platforms/cli", "Kilo Code CLI documentation", "Sessions export as JSON, but a stable machine-readable event stream for run is not established."),
  } }),
  product({ id: "mistral-vibe", name: "Mistral Vibe", categoryId: "coding-agent-harnesses", editorialOrder: 11, officialUrl: "https://github.com/mistralai/mistral-vibe", repository: repo("mistralai/mistral-vibe"), repoMetricId: "mistral-vibe", tags: ["cli", "multi-model", "permissions", "subagents", "oss"], platform: ["macos", "linux"], platformNote: "macOS and Linux are official targets; Windows may work but is explicitly not an official target.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/mistralai/mistral-vibe", "Mistral Vibe repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-subagents", "harness-structured-output"], undefined, "repository-derived"),
    "harness-git-workflow": capability("limited", "https://github.com/mistralai/mistral-vibe", "Mistral Vibe repository", "Git tools are included, but a managed branch or worktree lifecycle is not established.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/mistralai/mistral-vibe#features", "Mistral Vibe README", "Image attachments supplied with @ mentions are sent to vision-capable models as native multimodal content.", "repository-derived"),
  } }),
  product({ id: "continue-cli", name: "Continue CLI", categoryId: "coding-agent-harnesses", editorialOrder: 12, officialUrl: "https://docs.continue.dev/cli/quickstart", repository: repo("continuedev/continue"), repoMetricId: "continue", tags: ["cli", "cn", "multi-model", "mcp", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://docs.continue.dev/cli/quickstart", "Continue CLI quickstart", ["harness-interactive-cli", "harness-multi-provider", "harness-extension-protocol", "harness-project-instructions"]),
    ...builtInClaims("https://github.com/continuedev/continue/blob/main/extensions/cli/README.md", "Continue CLI README", ["harness-headless", "harness-session-resume", "harness-structured-output"], undefined, "repository-derived"),
    "harness-permission-controls": capability("built-in", "https://github.com/continuedev/continue/blob/main/docs/cli/tool-permissions.mdx", "Continue CLI tool permissions", "Tool permissions can allow, ask, or exclude tool execution.", "repository-derived"),
    "harness-git-workflow": capability("limited", "https://docs.continue.dev/cli/quickstart", "Continue CLI quickstart", "Repository changes are supported, but a managed branch or worktree lifecycle is not documented."),
  } }),
  product({ id: "crush", name: "Crush", categoryId: "coding-agent-harnesses", editorialOrder: 13, officialUrl: "https://github.com/charmbracelet/crush", repository: repo("charmbracelet/crush", "source-tree"), tags: ["cli", "tui", "multi-model", "mcp", "fsl-1.1-mit", "source-available"], platform: ["macos", "windows", "linux", "android"], platformNote: "The repository also documents BSD; the shared platform vocabulary does not currently expose a BSD badge.", source: "source-available", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/charmbracelet/crush", "Crush repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls"], undefined, "repository-derived"),
    "harness-git-workflow": capability("limited", "https://github.com/charmbracelet/crush", "Crush repository", "Shell and editing tools can operate on repositories; a managed Git lifecycle is not established.", "repository-derived"),
  } }),
  product({ id: "auggie-cli", name: "Auggie CLI", categoryId: "coding-agent-harnesses", editorialOrder: 14, officialUrl: "https://docs.augmentcode.com/cli/overview", repository: repo("augmentcode/auggie", "metadata-only"), tags: ["cli", "vendor-service", "mcp", "subagents", "beta"], platform: ["macos", "linux"], platformNote: "The documented shells are Bash, Zsh, and Fish; native Windows support is not asserted.", source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "beta", claims: {
    "harness-interactive-cli": capability("built-in", "https://docs.augmentcode.com/cli/overview", "Auggie CLI overview", "Auggie starts an interactive coding-agent session."),
    ...builtInClaims("https://docs.augmentcode.com/cli/reference", "Auggie CLI reference", ["harness-headless", "harness-session-resume", "harness-structured-output", "harness-multimodal-input"]),
    "harness-multi-provider": capability("limited", "https://docs.augmentcode.com/cli/reference", "Auggie CLI reference", "Users can select offered models; bring-your-own model providers are not established."),
    "harness-extension-protocol": capability("built-in", "https://docs.augmentcode.com/cli/integrations", "Auggie CLI integrations", "MCP integrations extend the harness."),
    "harness-project-instructions": capability("built-in", "https://docs.augmentcode.com/cli/rules", "Auggie CLI rules", "Workspace rules provide persistent project instructions."),
    "harness-permission-controls": capability("built-in", "https://docs.augmentcode.com/cli/permissions", "Auggie CLI permissions", "Tool permission modes can ask, allow, or deny execution."),
    "harness-subagents": capability("built-in", "https://docs.augmentcode.com/cli/subagents", "Auggie CLI subagents", "Dedicated subagents and delegation are documented."),
  } }),
  product({ id: "kiro-cli", name: "Kiro CLI", categoryId: "coding-agent-harnesses", editorialOrder: 15, officialUrl: "https://kiro.dev/docs/cli/installation/", tags: ["cli", "vendor-service", "steering", "subagents", "checkpoints"], platform: ["macos", "windows", "linux"], platformNote: "Kiro documents macOS, Linux, and Windows 11.", source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://kiro.dev/docs/how-kiro-works", "How Kiro works", ["harness-interactive-cli", "harness-session-resume", "harness-project-instructions", "harness-checkpoints", "harness-git-workflow"]),
    "harness-headless": capability("built-in", "https://kiro.dev/docs/cli/", "Kiro CLI documentation", "Headless invocation is documented for scripts and CI."),
    "harness-multi-provider": capability("limited", "https://kiro.dev/docs/how-kiro-works", "How Kiro works", "Users can select Kiro-offered models; bring-your-own providers are not established."),
    ...builtInClaims("https://kiro.dev/docs/", "Kiro documentation", ["harness-extension-protocol", "harness-subagents"]),
    "harness-permission-controls": capability("built-in", "https://kiro.dev/docs/cli/chat/help-agent/", "Kiro CLI agent help", "Agent and tool permissions are configurable."),
    "harness-sandbox": capability("via-integration", "https://kiro.dev/docs/how-kiro-works", "How Kiro works", "Local execution is not established as sandboxed; Kiro cloud execution can provide an isolated boundary."),
    "harness-structured-output": capability("limited", "https://kiro.dev/docs/cli/", "Kiro CLI documentation", "Headless and CI execution exist, but a stable event schema is not established."),
  } }),
  product({ id: "amplifier-agent", name: "Amplifier Agent", categoryId: "coding-agent-harnesses", editorialOrder: 16, officialUrl: "https://github.com/microsoft/amplifier-agent", repository: repo("microsoft/amplifier-agent"), repoMetricId: "amplifier-agent", tags: ["headless", "embedded", "multi-model", "subagents", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The canonical installer documents the Unix install path and a Windows Git Bash path.", platformSource: { url: "https://github.com/microsoft/amplifier-agent", title: "Amplifier Agent repository" }, source: "open-source", execution: ["local-process"], status: "active", claims: {
    "harness-interactive-cli": capability("not-available", "https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md", "Amplifier Agent CLI reference", "The CLI explicitly runs one command, one turn, and exits rather than providing an interactive TUI.", "source-inspected"),
    ...builtInClaims("https://github.com/microsoft/amplifier-agent/blob/main/docs/CLI.md", "Amplifier Agent CLI reference", ["harness-headless", "harness-session-resume", "harness-permission-controls", "harness-structured-output"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/microsoft/amplifier-agent", "Amplifier Agent repository", ["harness-multi-provider", "harness-extension-protocol", "harness-subagents"], undefined, "repository-derived"),
    "harness-project-instructions": capability("limited", "https://github.com/microsoft/amplifier-agent", "Amplifier Agent repository", "Modes and skills inject durable guidance; a standard repository instruction-file contract is not established.", "repository-derived"),
    "harness-git-workflow": capability("limited", "https://github.com/microsoft/amplifier-agent", "Amplifier Agent repository", "Tools can manipulate repositories, but no managed worktree or branch lifecycle is documented.", "repository-derived"),
  } }),
  product({ id: "gptme", name: "gptme", categoryId: "coding-agent-harnesses", editorialOrder: 17, officialUrl: "https://github.com/gptme/gptme", repository: repo("gptme/gptme"), repoMetricId: "gptme", tags: ["cli", "multi-model", "mcp", "vision", "jsonl", "oss"], platform: ["macos", "linux"], platformNote: "First-party install paths clearly cover macOS and Linux; native Windows support is not asserted.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/gptme/gptme", "gptme repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-permission-controls", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    "harness-project-instructions": capability("limited", "https://github.com/gptme/gptme", "gptme repository", "Configuration and prompt files supply persistent guidance; a standard hierarchical repository instruction contract is not established.", "repository-derived"),
    "harness-checkpoints": capability("limited", "https://github.com/gptme/gptme", "gptme repository", "Undo and fork operate on conversation state; workspace mutation rollback is not established.", "repository-derived"),
    "harness-subagents": capability("via-integration", "https://github.com/gptme/gptme", "gptme repository", "Autonomous templates can compose agents, but recursive subagents are not established as a base CLI primitive.", "repository-derived"),
    "harness-git-workflow": capability("built-in", "https://github.com/gptme/gptme/blob/master/docs/features.rst", "gptme features", "The built-in auto-commit tool and pre-commit integration provide a Git-aware change workflow.", "repository-derived"),
  } }),
  product({ id: "cursor-cli", name: "Cursor CLI", categoryId: "coding-agent-harnesses", editorialOrder: 18, officialUrl: "https://cursor.com/cli", tags: ["cli", "vendor-client", "resume"], platform: ["macos", "windows", "linux"], platformNote: "Cursor publishes native CLI installation for macOS and Linux plus Windows PowerShell; WSL remains an additional supported Windows path.", platformSource: { url: "https://docs.cursor.com/en/enterprise/deployment-patterns", title: "Cursor CLI deployment" }, source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://cursor.com/cli", "Cursor CLI product", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    ...builtInClaims("https://docs.cursor.com/en/cli/using", "Cursor CLI usage", ["harness-extension-protocol", "harness-project-instructions"]),
    "harness-permission-controls": capability("built-in", "https://docs.cursor.com/cli/reference/permissions", "Cursor CLI permissions", "First-party permission rules control shell commands and tool use."),
    "harness-structured-output": capability("built-in", "https://docs.cursor.com/en/cli/reference/output-format", "Cursor CLI output formats", "Non-interactive runs can emit documented machine-readable output."),
    "harness-git-workflow": capability("built-in", "https://docs.cursor.com/en/cli/headless", "Cursor CLI headless mode", "Headless workflows are documented for Git-aware automation and review."),
  } }),
  product({ id: "factory-droid-cli", name: "Factory Droid CLI", categoryId: "coding-agent-harnesses", editorialOrder: 19, officialUrl: "https://docs.factory.ai/cli/getting-started/quickstart", tags: ["cli", "vendor-client", "resume"], platform: ["macos", "windows", "linux"], platformNote: "Factory publishes direct Droid binaries for Darwin/macOS, Windows, and Linux on x64 and arm64 where available.", platformSource: { url: "https://docs.factory.ai/droid-cli/cli-reference", title: "Droid CLI installation and binary targets" }, source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://docs.factory.ai/cli/getting-started/quickstart", "Factory Droid CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://docs.factory.ai/droid-exec/overview", "Factory Droid Exec", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/overview", "Factory Droid CLI overview", ["harness-extension-protocol", "harness-subagents"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/settings", "Factory Droid settings", ["harness-project-instructions", "harness-permission-controls"]),
    "harness-sandbox": capability("built-in", "https://docs.factory.ai/enterprise/llm-safety-and-agent-controls", "Factory agent controls", "Factory documents sandbox controls for agent execution."),
  } }),
  product({ id: "codewhale", name: "CodeWhale", categoryId: "coding-agent-harnesses", editorialOrder: 20, officialUrl: "https://github.com/Hmbown/CodeWhale", repository: repo("Hmbown/CodeWhale"), repoMetricId: "codewhale", tags: ["cli", "multi-model", "resume", "oss"], platform: ["macos", "windows", "linux", "android"], platformNote: "Published releases cover macOS, Windows, and Linux. Android/Termux arm64 is explicitly preview-only.", platformSource: { url: "https://github.com/Hmbown/CodeWhale/blob/main/docs/INSTALL.md#1-supported-platforms", title: "CodeWhale supported platforms" }, source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/Hmbown/CodeWhale", "CodeWhale repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-permission-controls", "harness-sandbox", "harness-checkpoints", "harness-subagents", "harness-structured-output"], undefined, "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://github.com/Hmbown/CodeWhale/blob/main/docs/CONFIGURATION.md", "CodeWhale configuration", "AGENTS.md is the canonical project instruction file; CLAUDE.md and .claude/instructions.md are compatibility fallbacks.", "repository-derived"),
  } }),
  product({ id: "antigravity-cli", name: "Antigravity CLI", categoryId: "coding-agent-harnesses", editorialOrder: 21, officialUrl: "https://antigravity.google/docs/cli-overview", tags: ["cli", "vendor-client", "resume"], platform: ["macos", "windows", "linux"], platformNote: "The CLI documents native keychain, sandbox, path, and credential behavior for macOS, Windows, and Linux.", platformSource: { url: "https://www.antigravity.google/docs/cli/troubleshooting/", title: "Antigravity CLI platform troubleshooting" }, source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://antigravity.google/docs/cli-overview", "Antigravity CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://antigravity.google/docs/cli/headless/", "Antigravity headless mode", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/features", "Antigravity CLI features", ["harness-extension-protocol", "harness-checkpoints", "harness-subagents", "harness-git-workflow"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/best-practices/", "Antigravity CLI best practices", ["harness-project-instructions", "harness-multimodal-input"]),
    "harness-permission-controls": capability("built-in", "https://www.antigravity.google/docs/cli/permissions", "Antigravity CLI permissions", "First-party permission controls govern tool execution."),
    "harness-sandbox": capability("built-in", "https://www.antigravity.google/docs/cli/sandbox/", "Antigravity CLI sandbox", "First-party documentation describes the CLI execution sandbox."),
  } }),
  product({ id: "muse-code", name: "Muse Code", categoryId: "coding-agent-harnesses", editorialOrder: 22, officialUrl: "https://ai.meta.com/llama/", tags: ["cli", "vendor-model", "resume", "skills", "subagents", "sandbox", "beta"], platform: ["macos", "linux"], platformNote: "Meta's current first-party launcher publishes Darwin/macOS and Linux binaries for arm64 and x86_64; native Windows is rejected as unsupported.", platformSource: { url: "https://api.meta.ai/muse-launcher.sh", title: "Meta Muse Code launcher" }, source: "proprietary", execution: ["local-process"], status: "beta", claims: {
    "harness-interactive-cli": capability("built-in", "https://ai.meta.com/llama/", "Meta Muse product page", "Meta distributes Muse Code as the terminal agent built to run Muse Spark."),
    "harness-multi-provider": capability("limited", "https://ai.meta.com/llama/", "Meta Muse product page", "Muse Code is documented around Meta's Muse Spark model rather than general bring-your-own-provider routing."),
    "harness-session-resume": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/tree/main/04_muse_code/01_event_log_and_resume", "Meta Muse Code event-log and resume recipe", "The append-only session log supports crash-safe resume without duplicating completed side effects.", "repository-derived"),
    "harness-extension-protocol": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/08_bundled_skills/README.md", "Meta Muse Code bundled skills recipe", "Built-in and project skills load through the documented SKILL.md contract.", "repository-derived"),
    "harness-permission-controls": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/03_staged_approvals/README.md", "Meta Muse Code staged approvals recipe", "Compound commands are resolved stage by stage and unresolved actions require allow-once, workspace approval, or rejection.", "repository-derived"),
    "harness-sandbox": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/04_contained_execution/README.md", "Meta Muse Code contained-execution recipe", "The managed OS sandbox restricts filesystem writes and network egress and refuses execution when enforcement cannot be verified.", "repository-derived"),
    "harness-subagents": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/06_subagent_fanout/README.md", "Meta Muse Code subagent fanout recipe", "Parallel subagents run in isolated worktrees and can be watched, steered, or stopped from the parent session.", "repository-derived"),
    "harness-structured-output": capability("limited", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/README.md", "Meta Muse Code cookbook", "The append-only event log is exportable and replayable; a general schema-constrained final-answer mode is not established.", "repository-derived"),
    "harness-git-workflow": capability("built-in", "https://github.com/meta-models/meta-model-cookbook/blob/main/04_muse_code/06_subagent_fanout/README.md", "Meta Muse Code subagent fanout recipe", "Muse Code owns isolated Git worktrees for parallel writing agents and records their lifecycle in the session event log.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://ai.meta.com/llama/", "Meta Muse product page", "Meta documents native perception over images, documents, audio, and video for Muse Spark workflows."),
  } }),
  product({ id: "qwen-code", name: "Qwen Code", categoryId: "coding-agent-harnesses", editorialOrder: 23, officialUrl: "https://github.com/QwenLM/qwen-code", repository: repo("QwenLM/qwen-code"), repoMetricId: "qwen-code", tags: ["cli", "vendor-model", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "First-party standalone installers are documented for macOS, Windows, and Linux.", source: "open-source", execution: ["local-process"], status: "active", claims: {
    ...builtInClaims("https://github.com/QwenLM/qwen-code", "Qwen Code repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol"], undefined, "repository-derived"),
    "harness-subagents": capability("built-in", "https://github.com/QwenLM/qwen-code", "Qwen Code repository", "Auto-Memory, Auto-Skills, SubAgents, Agent Teams, and MCP are documented out of the box.", "repository-derived"),
    "harness-structured-output": capability("built-in", "https://github.com/QwenLM/qwen-code", "Qwen Code repository", "Headless qwen -p mode is documented for scripts, CI, and batch processing.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/", "Qwen Code memory", "Project instruction and memory files are loaded as documented context."),
    "harness-permission-controls": capability("built-in", "https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md", "Qwen Code settings", "Documented settings control tool permissions."),
    "harness-sandbox": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/", "Qwen Code sandbox", "First-party documentation describes isolated tool execution."),
    "harness-git-workflow": capability("limited", "https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md", "Qwen Code settings", "Git attribution is documented; broader automated review delivery is not asserted."),
    "harness-multimodal-input": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/developers/tools/file-system/", "Qwen Code filesystem tools", "The first-party file tool supports multimodal file inputs."),
  } }),
  product({ id: "pi-coding-agent", name: "Pi coding agent", categoryId: "coding-agent-harnesses", editorialOrder: 24, officialUrl: "https://github.com/earendil-works/pi", repository: repo("earendil-works/pi"), repoMetricId: "pi", tags: ["cli", "multi-model", "resume", "extensions", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Pi publishes arm64 and x64 release archives for macOS, Windows, and Linux and maintains a first-party Windows guide.", platformSources: [{ url: "https://github.com/earendil-works/pi/releases/latest", title: "Pi release artifacts" }, { url: "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/windows.md", title: "Pi on Windows" }], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/earendil-works/pi#readme", "Pi coding agent repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol"]),
    "harness-permission-controls": capability("limited", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Runs with launcher-process permissions; stronger boundaries require a documented container or sandbox pattern.", "repository-derived"),
    "harness-sandbox": capability("via-integration", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Gondolin, Docker, and OpenShell are documented isolation patterns rather than a default built-in boundary.", "repository-derived"),
    ...builtInClaims("https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", ["harness-project-instructions", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    ...Object.fromEntries(["harness-checkpoints", "harness-subagents", "harness-git-workflow"].map((id) => [id, capability("via-extension", "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", "The project documents this as an extension capability rather than Pi core.", "repository-derived")])),
  } }),
  product({ id: "opencode", name: "OpenCode CLI", categoryId: "coding-agent-harnesses", editorialOrder: 25, officialUrl: "https://opencode.ai/docs/cli/", repository: repo("anomalyco/opencode"), repoMetricId: "opencode", tags: ["cli", "multi-model", "desktop-client", "extensions", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The canonical README lists native packages for macOS, Windows, and Linux.", platformSource: { url: "https://github.com/anomalyco/opencode", title: "OpenCode repository" }, source: "open-source", sourceSource: { url: "https://github.com/anomalyco/opencode", title: "OpenCode repository" }, execution: ["local-process"], claims: {
    ...builtInClaims("https://opencode.ai/docs/cli/", "OpenCode CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-structured-output"]),
    "harness-project-instructions": capability("built-in", "https://opencode.ai/docs/rules", "OpenCode rules", "Project and global instruction files are documented."),
    "harness-permission-controls": capability("built-in", "https://opencode.ai/docs/permissions/", "OpenCode permissions", "Permission rules can allow, ask, or deny tool use."),
    "harness-subagents": capability("built-in", "https://opencode.ai/docs/agents/", "OpenCode agents", "Primary agents can invoke documented subagents."),
    "harness-checkpoints": capability("built-in", "https://opencode.ai/v2/docs/snapshots", "OpenCode snapshots", "Snapshots support restoring earlier project state."),
    "harness-multimodal-input": capability("built-in", "https://opencode.ai/v2/docs/attachments", "OpenCode attachments", "Sessions accept documented file and image attachments."),
  } }),
  product({ id: "goose", name: "Goose CLI", categoryId: "coding-agent-harnesses", editorialOrder: 26, officialUrl: "https://github.com/aaif-goose/goose", repository: repo("aaif-goose/goose"), repoMetricId: "goose", tags: ["cli", "multi-model", "extensions", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The canonical repository and installation guide publish Goose CLI and desktop distributions for macOS, Windows, and Linux.", platformSource: { url: "https://github.com/aaif-goose/goose#readme", title: "Goose platform and installation matrix" }, source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/aaif-goose/goose#readme", "Goose CLI repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-extension-protocol"], undefined, "repository-derived"),
    ...builtInClaims("https://block.github.io/goose/index.html", "Goose documentation", ["harness-permission-controls", "harness-sandbox", "harness-subagents"]),
    "harness-session-resume": capability("built-in", "https://goose-docs.ai/docs/guides/sessions/session-management/", "Goose session management", "Named CLI sessions are saved automatically and can be resumed by name or session ID."),
    "harness-project-instructions": capability("built-in", "https://goose-docs.ai/docs/guides/context-engineering/using-goosehints/", "Goose project hints", "AGENTS.md and .goosehints load hierarchically as global and project context."),
    "harness-structured-output": capability("built-in", "https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/running-tasks.md", "Goose running tasks", "The CLI supports complete JSON and streaming JSON output formats for automation.", "repository-derived"),
  } }),
  product({ id: "aider", name: "Aider", categoryId: "coding-agent-harnesses", editorialOrder: 27, officialUrl: "https://github.com/Aider-AI/aider", repository: repo("Aider-AI/aider"), repoMetricId: "aider", tags: ["cli", "multi-model", "git-native", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The first-party installation guide provides supported paths for macOS, Windows, and Linux.", platformSource: { url: "https://aider.chat/docs/install.html", title: "Aider installation guide" }, source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/Aider-AI/aider", "Aider repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume"]),
    "harness-git-workflow": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Repository map plus automatic Git commits, diffs, and familiar Git undo.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Images and web pages can be attached as context.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://aider.chat/docs/usage/conventions.html", "Aider conventions", "Repository convention files can provide persistent project instructions."),
    "harness-checkpoints": capability("built-in", "https://aider.chat/docs/git.html", "Aider Git integration", "Automatic commits and /undo provide a Git-backed rollback point."),
  } }),
  product({ id: "grok-build", name: "Grok Build", categoryId: "coding-agent-harnesses", editorialOrder: 28, officialUrl: "https://github.com/xai-org/grok-build", repository: repo("xai-org/grok-build"), repoMetricId: "grok-build", tags: ["cli", "vendor-model", "source-transparent", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The canonical README documents installation on macOS, Linux, and Windows through Git Bash.", platformSource: { url: "https://github.com/xai-org/grok-build", title: "Grok Build repository" }, source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/xai-org/grok-build", "Grok Build repository", ["harness-interactive-cli", "harness-headless", "harness-extension-protocol", "harness-sandbox", "harness-checkpoints", "harness-git-workflow"], undefined, "repository-derived"),
    "harness-multi-provider": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/11-custom-models.md", "Grok Build custom models", "BYOK, Ollama, and OpenAI-compatible endpoints are documented model options.", "repository-derived"),
    "harness-session-resume": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/17-sessions.md", "Grok Build session management", "Sessions can be saved, loaded, resumed, and rewound.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/12-project-rules.md", "Grok Build project rules", "Project rules are loaded from documented AGENTS.md files.", "repository-derived"),
    "harness-permission-controls": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/22-permissions-and-safety.md", "Grok Build permissions and safety", "First-party user guidance documents tool permissions and safety controls.", "repository-derived"),
    "harness-subagents": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/16-subagents.md", "Grok Build subagents", "Subagents and personas are documented built-in capabilities.", "repository-derived"),
    "harness-structured-output": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/14-headless-mode.md", "Grok Build headless mode", "Headless mode provides documented machine-readable output formats.", "repository-derived"),
  } }),
  product({ id: "rovo-dev-cli", name: "Rovo Dev CLI", categoryId: "coding-agent-harnesses", editorialOrder: 29, officialUrl: "https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/", tags: ["cli", "atlassian", "sessions", "mcp", "skills", "subagents", "worktrees", "server-mode"], platform: ["macos", "windows", "linux"], platformNote: "Rovo Dev is an ACLI extension; Atlassian publishes ACLI installation paths for macOS, Windows, and Linux.", platformSource: { url: "https://support.atlassian.com/rovo/docs/install-and-run-rovo-dev-cli-on-your-device/", title: "Install Rovo Dev CLI" }, source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    "harness-interactive-cli": capability("built-in", "https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/", "Rovo Dev CLI documentation", "Rovo Dev provides an interactive terminal coding-agent interface."),
    "harness-headless": capability("built-in", "https://support.atlassian.com/rovo/docs/use-server-mode-in-rovo-dev-cli/", "Rovo Dev server mode", "Server mode exposes JSON and server-sent event APIs for non-interactive integrations."),
    "harness-multi-provider": capability("limited", "https://support.atlassian.com/rovo/docs/switch-between-large-language-models-in-rovo-dev-cli/", "Rovo Dev model selection", "Operators can switch among Atlassian-provided models; arbitrary provider credentials are not documented."),
    "harness-session-resume": capability("built-in", "https://support.atlassian.com/rovo/docs/manage-sessions-in-rovo-dev-cli/", "Rovo Dev session management", "Saved sessions can be listed, renamed, resumed, and deleted."),
    "harness-extension-protocol": capability("built-in", "https://support.atlassian.com/rovo/docs/connect-to-an-mcp-server-in-rovo-dev-cli/", "Rovo Dev MCP servers", "Local and remote MCP servers extend the agent with tools; Agent Skills provide another documented extension surface."),
    "harness-project-instructions": capability("built-in", "https://support.atlassian.com/rovo/docs/use-memory-in-rovo-dev-cli/", "Rovo Dev memory", "Project and user memory files provide persistent instructions and context."),
    "harness-permission-controls": capability("built-in", "https://support.atlassian.com/rovo/docs/use-server-mode-in-rovo-dev-cli/", "Rovo Dev server mode", "Server-mode clients receive explicit approval requests for tool operations."),
    "harness-subagents": capability("built-in", "https://support.atlassian.com/rovo/docs/use-subagents-in-rovo-dev-cli/", "Rovo Dev subagents", "Specialized subagents can be created and delegated focused work."),
    "harness-structured-output": capability("built-in", "https://support.atlassian.com/rovo/docs/use-server-mode-in-rovo-dev-cli/", "Rovo Dev server mode", "The documented server protocol emits structured JSON and server-sent events."),
    "harness-git-workflow": capability("built-in", "https://support.atlassian.com/rovo/docs/use-worktree-mode-in-rovo-dev-cli/", "Rovo Dev worktree mode", "Worktree mode creates isolated Git worktrees for agent tasks and supports merging completed work."),
  } }),
  product({
    id: "oh-my-openagent", name: "Oh My OpenAgent", categoryId: "coding-agent-harnesses", editorialOrder: 30,
    officialUrl: "https://github.com/code-yeongyu/oh-my-openagent", repository: repo("code-yeongyu/oh-my-openagent", "source-tree"), repoMetricId: "oh-my-openagent",
    tags: ["opencode", "codex", "standalone", "plugins", "teams", "source-available"], platform: ["macos", "windows", "linux"], source: "source-available", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/code-yeongyu/oh-my-openagent", "Oh My OpenAgent repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-subagents", "harness-structured-output", "harness-git-workflow"], undefined, "repository-derived"),
      "harness-sandbox": capability("limited", "https://github.com/code-yeongyu/oh-my-openagent", "Oh My OpenAgent repository", "The product can configure autonomous permissions and inherits containment from the selected OpenCode, Codex, or standalone host; it does not define one universal sandbox.", "repository-derived"),
      "harness-checkpoints": capability("via-integration", "https://github.com/code-yeongyu/oh-my-openagent", "Oh My OpenAgent repository", "Checkpoint behavior is supplied by the selected host harness and installed components.", "repository-derived"),
    },
  }),
  product({
    id: "oh-my-pi", name: "Oh My Pi", categoryId: "coding-agent-harnesses", editorialOrder: 31,
    officialUrl: "https://github.com/can1357/oh-my-pi", repository: repo("can1357/oh-my-pi"), repoMetricId: "oh-my-pi",
    tags: ["cli", "tui", "ide", "multi-provider", "subagents", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/can1357/oh-my-pi", "Oh My Pi repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-subagents", "harness-structured-output", "harness-git-workflow", "harness-multimodal-input"], undefined, "repository-derived"),
      "harness-sandbox": capability("built-in", "https://github.com/can1357/oh-my-pi", "Oh My Pi repository", "The harness documents sandbox and approval controls for tool execution.", "repository-derived"),
      "harness-checkpoints": capability("built-in", "https://github.com/can1357/oh-my-pi", "Oh My Pi repository", "The IDE-integrated workflow preserves sessions and reversible change state.", "repository-derived"),
    },
  }),
  product({
    id: "open-interpreter", name: "Open Interpreter", categoryId: "coding-agent-harnesses", editorialOrder: 32,
    officialUrl: "https://github.com/openinterpreter/openinterpreter", repository: repo("openinterpreter/openinterpreter"), repoMetricId: "open-interpreter",
    tags: ["cli", "open-models", "codex-derived", "acp", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/openinterpreter/openinterpreter", "Open Interpreter repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-sandbox", "harness-structured-output", "harness-git-workflow", "harness-multimodal-input"], undefined, "repository-derived"),
      "harness-checkpoints": capability("built-in", "https://github.com/openinterpreter/openinterpreter", "Open Interpreter repository", "The Codex-derived runtime includes session and change recovery mechanisms.", "repository-derived"),
    },
  }),
  product({
    id: "swe-agent", name: "SWE-agent", categoryId: "coding-agent-harnesses", editorialOrder: 33,
    officialUrl: "https://github.com/SWE-agent/SWE-agent", repository: repo("SWE-agent/SWE-agent"), repoMetricId: "swe-agent",
    tags: ["issues", "research", "docker", "trajectories", "multi-provider", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "container"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/SWE-agent/SWE-agent", "SWE-agent repository", ["harness-headless", "harness-multi-provider", "harness-project-instructions", "harness-sandbox", "harness-structured-output", "harness-git-workflow"], undefined, "repository-derived"),
      "harness-interactive-cli": capability("limited", "https://github.com/SWE-agent/SWE-agent", "SWE-agent repository", "SWE-agent is primarily an issue-driven research and automation harness rather than a conversational TUI.", "repository-derived"),
      "harness-session-resume": capability("limited", "https://github.com/SWE-agent/SWE-agent", "SWE-agent repository", "Runs emit trajectories and artifacts, but named conversational resume is not its primary contract.", "repository-derived"),
    },
  }),
  product({
    id: "reasonix", name: "Reasonix", categoryId: "coding-agent-harnesses", editorialOrder: 34,
    officialUrl: "https://reasonix.io/", repository: repo("esengine/DeepSeek-Reasonix"), repoMetricId: "reasonix",
    tags: ["cli", "tui", "desktop", "browser", "acp", "multi-provider", "mcp", "sandbox", "checkpoints", "oss"],
    platform: ["macos", "windows", "linux", "web"], platformNote: "Reasonix publishes native CLI and desktop packages for macOS, Windows, and Linux; the browser is another client for the same local engine.",
    platformSource: { url: "https://github.com/esengine/DeepSeek-Reasonix#install", title: "Reasonix installation matrix" },
    source: "open-source", execution: ["local-process", "local-daemon"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/esengine/DeepSeek-Reasonix#readme", "Reasonix README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-extension-protocol", "harness-project-instructions", "harness-permission-controls", "harness-sandbox", "harness-checkpoints", "harness-subagents"], undefined, "repository-derived"),
      "harness-session-resume": capability("built-in", "https://github.com/esengine/DeepSeek-Reasonix/blob/main/docs/RECOVERY.md", "Reasonix recovery documentation", "The local engine preserves workspace sessions and documents recovery behavior.", "repository-derived"),
    },
  }),

  // 5. IDE extensions
  product({ id: "github-copilot-vscode", name: "GitHub Copilot for IDEs", categoryId: "ide-extensions", editorialOrder: 1, officialUrl: "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension?tool=vscode", tags: ["vscode", "visual-studio", "jetbrains", "eclipse", "xcode", "neovim", "autocomplete", "agent-panel", "background-agent-client"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/reference/copilot-feature-matrix?tool=vscode", "GitHub Copilot feature matrix", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-background-delegation", "extension-host-vscode", "extension-host-jetbrains"]),
    "extension-mcp": capability("built-in", "https://code.visualstudio.com/docs/copilot/concepts/customization", "VS Code agent customization", "VS Code agent customization includes MCP tools and servers."),
    "extension-codebase-context": capability("built-in", "https://code.visualstudio.com/docs/agent-customization/custom-instructions", "VS Code custom instructions", "Workspace instructions, AGENTS.md, and file-scoped instruction files are automatically applied."),
    "extension-install-channel": factClaim("IDE marketplaces", "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension?tool=vscode", "Install the GitHub Copilot extension", "Separate official plugins are documented for VS Code, Visual Studio, JetBrains, Eclipse, Xcode, Vim, and Neovim."),
    "extension-tool-execution-boundary": factClaim("Host IDE + GitHub cloud", "https://docs.github.com/en/copilot/reference/copilot-feature-matrix?tool=vscode", "GitHub Copilot feature matrix"),
    "extension-remote-session-client": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", "GitHub Copilot coding agent documentation", "Supported IDE surfaces can delegate to and monitor the distinct GitHub Copilot coding agent."),
  } }),
  product({ id: "cline", name: "Cline extension", categoryId: "ide-extensions", editorialOrder: 2, officialUrl: "https://docs.cline.bot/", repository: repo("cline/cline"), repoMetricId: "cline", tags: ["vscode", "agent-panel", "cli", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Cline's first-party extension documentation defines platform-specific storage and setup paths for macOS, Windows, and Linux/WSL.", platformSource: { url: "https://docs.cline.bot/customization/cline-rules", title: "Cline platform-specific configuration" }, source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://docs.cline.bot/", "Cline extension documentation", ["extension-hosts", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.cline.bot/usage/ide", "Cline IDE documentation", "First-party extension workflow runs in the VS Code panel."),
    "extension-checkpoints": capability("built-in", "https://docs.cline.bot/core-workflows/checkpoints", "Cline checkpoints documentation", "Shadow-Git checkpoints restore files, task history, or both."),
    "extension-permissions": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "Auto Approve controls reads, edits, commands, browser, MCP, and notifications."),
    "extension-mcp": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "MCP tools are a documented approval category in the extension."),
    "extension-provider-choice": capability("built-in", "https://docs.cline.bot/provider-config/other-30-plus-providers", "Cline provider configuration", "Extension settings expose API-provider, credential, and model selection across hosted, local, and OpenAI-compatible providers."),
    "extension-install-channel": factClaim("VS Code Marketplace / Open VSX", "https://docs.cline.bot/usage/ide", "Cline IDE documentation"),
    "extension-tool-execution-boundary": factClaim("Host IDE", "https://docs.cline.bot/usage/ide", "Cline IDE documentation"),
    "extension-byok-local-model": capability("built-in", "https://docs.cline.bot/running-models-locally/overview", "Cline local models", "Supports local models through documented Ollama, LM Studio, and Atomic Chat integrations."),
  } }),
  product({ id: "continue", name: "Continue extension", categoryId: "ide-extensions", editorialOrder: 3, officialUrl: "https://docs.continue.dev/", repository: repo("continuedev/continue"), repoMetricId: "continue", tags: ["vscode", "jetbrains", "autocomplete", "agent-panel", "cli", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The archived final product shipped VS Code and JetBrains plugins used on macOS, Windows, and Linux; this is historical support, not a claim of ongoing maintenance.", platformSources: [{ url: "https://github.com/continuedev/continue", title: "Continue final product repository" }, { url: "https://github.com/continuedev/continue/blob/main/docs/faqs.mdx", title: "Continue platform FAQ" }], source: "open-source", execution: ["host-ide-process"], status: "archived", statusSource: { url: "https://github.com/continuedev/continue", title: "Continue repository README", basis: "repository-derived" }, claims: {
    ...builtInClaims("https://docs.continue.dev/", "Continue extension documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party VS Code extension."),
    "extension-host-jetbrains": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party JetBrains extension with its own sidebar shortcut."),
    "extension-provider-choice": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Multiple hosted providers and self-hosted model providers can be configured by role."),
    "extension-mcp": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Agent mode can use tools supplied by MCP servers."),
    "extension-codebase-context": capability("built-in", "https://docs.continue.dev/customize/deep-dives/custom-providers", "Continue custom providers documentation", "Repository map, files, tree, Git diff, terminal, and embedding-backed codebase context."),
    "extension-tool-execution-boundary": factClaim("Host IDE", "https://docs.continue.dev/ide-extensions/agent/how-it-works", "Continue agent mode documentation"),
    "extension-byok-local-model": capability("built-in", "https://docs.continue.dev/customize/model-providers/overview", "Continue model providers", "Supports hosted providers, self-hosted endpoints, and local model providers."),
  } }),
  product({ id: "kilo-code", name: "Kilo Code extension", categoryId: "ide-extensions", editorialOrder: 4, officialUrl: "https://kilo.ai/docs/", repository: repo("Kilo-Org/kilocode"), repoMetricId: "kilo-code", tags: ["vscode", "jetbrains", "agent-panel", "cli", "oss"], platform: ["macos", "windows", "linux"], platformNote: "The official VS Code and JetBrains plugins run in supported desktop hosts on macOS, Windows, and Linux; Windows-specific installation guidance is documented.", platformSources: [{ url: "https://kilo.ai/docs/getting-started/installing", title: "Kilo Code installation" }, { url: "https://kilo.ai/docs/code-with-ai/platforms/jetbrains", title: "Kilo Code for JetBrains" }], source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://kilo.ai/docs/", "Kilo Code extension documentation", ["extension-hosts", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://kilo.ai/docs/code-with-ai/platforms/vscode", "Kilo Code for VS Code", "Official VS Code extension with embedded runtime."),
    "extension-host-jetbrains": capability("built-in", "https://kilo.ai/docs/code-with-ai/platforms/jetbrains", "Kilo Code for JetBrains", "Official native JetBrains plugin for the listed JetBrains IDE family."),
    "extension-provider-choice": capability("built-in", "https://kilo.ai/docs/getting-started/setup-authentication", "Kilo Code authentication setup", "Kilo provider, BYOK, and custom providers are shared across extension surfaces."),
    "extension-mcp": capability("built-in", "https://kilo.ai/docs/automate/mcp/using-in-kilo-code", "Kilo Code MCP documentation", "Global and project MCP configuration is built into Kilo settings."),
    "extension-checkpoints": capability("built-in", "https://kilo.ai/docs/code-with-ai/features/checkpoints", "Kilo Code checkpoints", "Snapshots are enabled by default and expose file diffs and Revert to here."),
    "extension-permissions": capability("built-in", "https://kilo.ai/docs/getting-started/settings/auto-approving-actions", "Kilo Code auto-approval settings", "Per-tool Allow, Ask, and Deny rules; default is Ask."),
    "extension-isolated-parallel": capability("built-in", "https://kilo.ai/docs/automate/agent-manager", "Kilo Code Agent Manager", "Agent Manager runs parallel sessions in separate Git worktrees with diff review."),
    "extension-inline-completion": capability("built-in", "https://kilo.ai/docs/code-with-ai/platforms/vscode", "Kilo Code for VS Code", "FIM autocomplete is a named VS Code extension feature."),
    "extension-background-delegation": capability("built-in", "https://kilo.ai/docs/automate/agent-manager", "Kilo Code Agent Manager", "Agent Manager runs multiple worktree-isolated sessions in parallel and keeps panel state."),
    "extension-install-channel": {
      state: "fact",
      displayValue: "VS Code and JetBrains marketplaces",
      evidence: [
        evidence("https://kilo.ai/docs/code-with-ai/platforms/vscode", "Kilo Code for VS Code"),
        evidence("https://kilo.ai/docs/code-with-ai/platforms/jetbrains", "Kilo Code for JetBrains"),
      ],
    },
    "extension-tool-execution-boundary": factClaim("Host IDE + local agent manager", "https://kilo.ai/docs/automate/agent-manager", "Kilo Code Agent Manager"),
    "extension-byok-local-model": capability("built-in", "https://kilo.ai/docs/getting-started/setup-authentication", "Kilo Code authentication setup", "Kilo provider, BYOK, and custom providers are supported."),
  } }),
  product({ id: "codex-ide-extension", name: "OpenAI Codex IDE extension", categoryId: "ide-extensions", editorialOrder: 5, officialUrl: "https://developers.openai.com/codex/ide", repository: repo("openai/codex", "source-tree"), repoMetricId: "codex-cli", tags: ["vscode", "cursor", "windsurf", "agent-panel", "cloud-session-client"], platform: ["macos", "windows", "linux"], source: "split-source", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://developers.openai.com/codex/ide", "Codex IDE extension documentation", ["extension-hosts", "extension-agent-panel", "extension-host-vscode", "extension-mcp", "extension-permissions"]),
    "extension-background-delegation": capability("limited", "https://developers.openai.com/codex/ide/cloud-tasks", "Codex IDE cloud tasks", "The extension can create and monitor separately owned Codex cloud tasks."),
    "extension-install-channel": factClaim("VS Code Marketplace / compatible forks", "https://developers.openai.com/codex/ide", "Codex IDE extension documentation"),
    "extension-tool-execution-boundary": factClaim("Local Codex sidecar + OpenAI cloud", "https://developers.openai.com/codex/ide", "Codex IDE extension documentation"),
    "extension-remote-session-client": capability("built-in", "https://developers.openai.com/codex/ide/cloud-tasks", "Codex IDE cloud tasks", "Cloud tasks can be delegated and followed from the IDE surface."),
  } }),
  product({ id: "claude-code-vscode", name: "Claude Code for VS Code", categoryId: "ide-extensions", editorialOrder: 6, officialUrl: "https://code.claude.com/docs/en/ide-integrations", tags: ["vscode", "cursor", "windsurf", "kiro", "agent-panel", "local-cli"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/ide-integrations", "Claude Code IDE integrations", ["extension-hosts", "extension-agent-panel", "extension-host-vscode", "extension-permissions", "extension-codebase-context"]),
    "extension-background-delegation": capability("limited", "https://code.claude.com/docs/en/platforms", "Claude Code platform comparison", "Remote and web sessions are separately owned surfaces rather than IDE-owned workers."),
    "extension-install-channel": factClaim("VS Code Marketplace / bundled CLI", "https://code.claude.com/docs/en/ide-integrations", "Claude Code IDE integrations"),
    "extension-tool-execution-boundary": factClaim("Local bundled Claude Code CLI", "https://code.claude.com/docs/en/ide-integrations", "Claude Code IDE integrations"),
    "extension-remote-session-client": capability("limited", "https://code.claude.com/docs/en/platforms", "Claude Code platform comparison", "Cloud sessions can be handed off, but are not an IDE-owned background worker."),
  } }),
  product({ id: "claude-code-jetbrains", name: "Claude Code for JetBrains", categoryId: "ide-extensions", editorialOrder: 7, officialUrl: "https://code.claude.com/docs/en/platforms", tags: ["jetbrains", "intellij", "pycharm", "webstorm", "agent-panel", "local-cli"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/platforms", "Claude Code platform comparison", ["extension-hosts", "extension-agent-panel", "extension-host-jetbrains", "extension-permissions"]),
    "extension-background-delegation": capability("limited", "https://code.claude.com/docs/en/platforms", "Claude Code platform comparison", "Remote and web sessions are separately owned surfaces rather than IDE-owned workers."),
    "extension-install-channel": factClaim("JetBrains Marketplace", "https://code.claude.com/docs/en/platforms", "Claude Code platform comparison"),
    "extension-tool-execution-boundary": factClaim("Local Claude Code CLI", "https://code.claude.com/docs/en/platforms", "Claude Code platform comparison"),
  } }),
  product({ id: "amazon-q-developer-ide", name: "Amazon Q Developer IDE extension", categoryId: "ide-extensions", editorialOrder: 8, officialUrl: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", tags: ["vscode", "jetbrains", "eclipse", "visual-studio", "autocomplete", "agent-panel", "mcp"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", "Amazon Q Developer in IDEs", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-mcp", "extension-codebase-context"]),
    "extension-permissions": capability("built-in", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/qdev-mcp.html", "Amazon Q Developer MCP tools", "IDE MCP configuration supports auto-approved, requires-approval, and dangerous tool permission levels."),
    "extension-install-channel": factClaim("IDE marketplaces", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", "Amazon Q Developer in IDEs"),
    "extension-tool-execution-boundary": factClaim("Host IDE + AWS cloud", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", "Amazon Q Developer in IDEs"),
  } }),
  product({ id: "gemini-code-assist", name: "Gemini Code Assist Standard / Enterprise extensions", categoryId: "ide-extensions", editorialOrder: 9, officialUrl: "https://docs.cloud.google.com/gemini/docs/codeassist/overview", tags: ["vscode", "jetbrains", "autocomplete", "agent-panel", "standard", "enterprise"], platform: ["macos", "windows", "linux"], platformNote: "Google's current setup and usage documentation explicitly covers the VS Code and JetBrains extensions on macOS, Windows, and Linux.", platformSources: [{ url: "https://docs.cloud.google.com/gemini/docs/codeassist/set-up-gemini", title: "Set up Gemini Code Assist" }, { url: "https://docs.cloud.google.com/gemini/docs/codeassist/keyboard-shortcuts", title: "Gemini Code Assist platform shortcuts" }], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.cloud.google.com/gemini/docs/codeassist/supported-languages", "Gemini Code Assist supported IDEs", ["extension-hosts", "extension-host-vscode", "extension-host-jetbrains"]),
    ...builtInClaims("https://docs.cloud.google.com/gemini/docs/codeassist/overview", "Gemini Code Assist Standard and Enterprise overview", ["extension-inline-completion", "extension-agent-panel", "extension-codebase-context"]),
    ...builtInClaims("https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", "Gemini Code Assist agent mode", ["extension-mcp"]),
    "extension-permissions": capability("limited", "https://docs.cloud.google.com/gemini/docs/codeassist/use-agentic-chat-pair-programmer", "Gemini Code Assist agent mode", "VS Code exposes coreTools and excludeTools with command-specific restrictions; IntelliJ documents review, approval, and auto-approval of changes rather than the same per-tool policy."),
    "extension-tool-execution-boundary": factClaim("Host IDE + Google Cloud service", "https://docs.cloud.google.com/gemini/docs/codeassist/overview", "Gemini Code Assist Standard and Enterprise overview"),
  } }),
  product({ id: "jetbrains-ai-assistant", name: "JetBrains AI Assistant", categoryId: "ide-extensions", editorialOrder: 10, officialUrl: "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", tags: ["jetbrains", "autocomplete", "agent-panel", "external-agents"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "JetBrains AI Assistant overview", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-jetbrains", "extension-provider-choice", "extension-codebase-context"]),
    ...builtInClaims("https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents", ["extension-mcp", "extension-permissions"]),
    "extension-install-channel": factClaim("JetBrains Marketplace", "https://www.jetbrains.com/help/ai-assistant/installation-guide-ai-assistant.html", "JetBrains AI Assistant installation"),
    "extension-tool-execution-boundary": factClaim("Host IDE + selectable agents/models", "https://www.jetbrains.com/help/ai-assistant/agents.html", "JetBrains AI Assistant agents"),
    "extension-byok-local-model": capability("built-in", "https://www.jetbrains.com/help/ai-assistant/use-custom-models.html", "JetBrains custom models", "Supports configured external and local model endpoints in eligible editions."),
  } }),
  product({ id: "pochi-vscode", name: "Pochi VS Code extension", categoryId: "ide-extensions", editorialOrder: 11, officialUrl: "https://github.com/TabbyML/pochi", repository: repo("TabbyML/pochi"), repoMetricId: "pochi", tags: ["vscode", "open-vsx", "autocomplete", "parallel-agents", "worktrees", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/TabbyML/pochi", "Pochi repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-background-delegation", "extension-host-vscode", "extension-provider-choice", "extension-checkpoints", "extension-permissions", "extension-isolated-parallel"], undefined, "repository-derived"),
    "extension-install-channel": factClaim("VS Code Marketplace / Open VSX", "https://github.com/TabbyML/pochi/blob/main/packages/docs/content/docs/vscode.mdx", "Pochi VS Code guide", undefined, "source-inspected"),
    "extension-tool-execution-boundary": factClaim("Host IDE + isolated local worktrees", "https://github.com/TabbyML/pochi", "Pochi repository", undefined, "repository-derived"),
    "extension-byok-local-model": capability("built-in", "https://github.com/TabbyML/pochi", "Pochi repository", "Supports configurable providers and OpenAI-compatible endpoints.", "repository-derived"),
  } }),
  product({ id: "tabby-ide-extensions", name: "Tabby IDE extensions", categoryId: "ide-extensions", editorialOrder: 12, officialUrl: "https://github.com/TabbyML/tabby", repository: repo("TabbyML/tabby"), repoMetricId: "tabby", tags: ["vscode", "jetbrains", "vim", "neovim", "self-hosted", "autocomplete", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-daemon", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/TabbyML/tabby", "Tabby repository", ["extension-hosts", "extension-inline-completion", "extension-host-vscode", "extension-host-jetbrains", "extension-provider-choice"], undefined, "repository-derived"),
    "extension-agent-panel": capability("limited", "https://github.com/TabbyML/tabby/blob/main/clients/tabby-agent/README.md", "Tabby Agent client README", "The primary cited client surface establishes completion and editor integration; it is not equivalent to a full delegated agent panel.", "source-inspected"),
    "extension-install-channel": factClaim("IDE marketplaces / editor package managers", "https://github.com/TabbyML/tabby", "Tabby repository", undefined, "repository-derived"),
    "extension-tool-execution-boundary": factClaim("Host IDE + self-hosted Tabby server", "https://github.com/TabbyML/tabby/blob/main/clients/tabby-agent/README.md", "Tabby Agent client README", undefined, "source-inspected"),
    "extension-byok-local-model": capability("built-in", "https://github.com/TabbyML/tabby", "Tabby repository", "Tabby is a self-hosted inference server with first-party editor clients.", "repository-derived"),
  } }),
  product({ id: "codecompanion-nvim", name: "CodeCompanion.nvim", categoryId: "ide-extensions", editorialOrder: 13, officialUrl: "https://github.com/olimorris/codecompanion.nvim", repository: repo("olimorris/codecompanion.nvim"), repoMetricId: "codecompanion-nvim", tags: ["neovim", "chat-buffer", "acp", "multi-provider", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-provider-choice", "extension-permissions"], undefined, "repository-derived"),
    "extension-mcp": capability("built-in", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository README", "The canonical README explicitly lists built-in Model Context Protocol support.", "repository-derived"),
    "extension-background-delegation": capability("limited", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", "Asynchronous execution is documented, not a hosted delegated-job service.", "repository-derived"),
    "extension-install-channel": factClaim("Neovim plugin manager", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", undefined, "repository-derived"),
    "extension-tool-execution-boundary": factClaim("Neovim process + local ACP agents", "https://github.com/olimorris/codecompanion.nvim/blob/main/doc/codecompanion.txt", "CodeCompanion.nvim documentation", undefined, "source-inspected"),
    "extension-byok-local-model": capability("built-in", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", "Multiple provider adapters and ACP-compatible local agents are supported.", "repository-derived"),
  } }),
  product({ id: "avante-nvim", name: "avante.nvim", categoryId: "ide-extensions", editorialOrder: 14, officialUrl: "https://github.com/avante-corp/avante.nvim", repository: repo("avante-corp/avante.nvim"), repoMetricId: "avante-nvim", tags: ["neovim", "agent-panel", "acp", "multi-provider", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/avante-corp/avante.nvim", "avante.nvim repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-provider-choice", "extension-codebase-context"], undefined, "repository-derived"),
    "extension-install-channel": factClaim("Neovim plugin manager", "https://github.com/avante-corp/avante.nvim", "avante.nvim repository", undefined, "repository-derived"),
    "extension-tool-execution-boundary": factClaim("Neovim process + local ACP agents", "https://github.com/avante-corp/avante.nvim", "avante.nvim repository", undefined, "repository-derived"),
    "extension-byok-local-model": capability("built-in", "https://github.com/avante-corp/avante.nvim", "avante.nvim repository", "Configurable model providers and ACP agents are supported.", "repository-derived"),
  } }),
  product({ id: "refact-ide-plugins", name: "Refact IDE plugins", categoryId: "ide-extensions", editorialOrder: 15, officialUrl: "https://github.com/smallcloudai/refact", repository: repo("smallcloudai/refact"), repoMetricId: "refact", tags: ["vscode", "jetbrains", "visual-studio", "sublime", "neovim", "self-hosted", "oss", "archived", "historical"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-daemon", "vendor-cloud", "user-cloud"], status: "archived", claims: {
    ...builtInClaims("https://github.com/smallcloudai/refact", "Refact repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-provider-choice", "extension-mcp", "extension-codebase-context"], undefined, "repository-derived"),
    "extension-install-channel": factClaim("IDE marketplaces / editor package managers", "https://github.com/smallcloudai/refact-lsp/blob/main/README.md", "Refact agent README", undefined, "source-inspected"),
    "extension-tool-execution-boundary": factClaim("Local Refact agent/LSP + selectable server", "https://github.com/smallcloudai/refact-lsp/blob/main/README.md", "Refact agent README", undefined, "source-inspected"),
    "extension-byok-local-model": capability("built-in", "https://github.com/smallcloudai/refact", "Refact repository", "Cloud, BYOK, and self-hosted server paths are supported.", "repository-derived"),
  } }),
  product({
    id: "roo-code", name: "Roo Code extension", categoryId: "ide-extensions", editorialOrder: 16,
    officialUrl: "https://github.com/RooCodeInc/Roo-Code",
    repository: repo("RooCodeInc/Roo-Code"), repoMetricId: "roo-code",
    tags: ["vscode", "agent-panel", "mcp", "checkpoints", "multi-provider", "historical", "oss"],
    platform: ["macos", "windows", "linux"],
    platformSource: {
      url: "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/getting-started/installing.mdx",
      title: "Roo Code installation documentation",
    },
    platformNote: "Historical host support before the extension shut down on 2026-05-15.",
    source: "open-source", execution: ["host-ide-process"], status: "archived",
    claims: {
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/getting-started/installing.mdx", "Roo Code installation documentation", ["extension-hosts", "extension-agent-panel", "extension-host-vscode"], "Historical VS Code, Cursor, VSCodium, Windsurf, and compatible-editor extension surface.", "source-inspected"),
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/providers/index.mdx", "Roo Code model providers", ["extension-provider-choice", "extension-byok-local-model"], "Historical support included multiple hosted providers plus Ollama and LM Studio.", "source-inspected"),
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/advanced-usage/available-tools/use-mcp-tool.md", "Roo Code MCP tool documentation", ["extension-mcp"], undefined, "source-inspected"),
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/checkpoints.mdx", "Roo Code checkpoints", ["extension-checkpoints"], "Task-scoped shadow-Git checkpoints supplied diff review and file/task restoration.", "source-inspected"),
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/auto-approving-actions.mdx", "Roo Code auto-approval documentation", ["extension-permissions"], undefined, "source-inspected"),
      ...builtInClaims("https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/codebase-indexing.mdx", "Roo Code codebase indexing", ["extension-codebase-context"], undefined, "source-inspected"),
      "extension-install-channel": factClaim("Historical Marketplace, Open VSX, and VSIX; distribution ended", "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/getting-started/installing.mdx", "Roo Code installation documentation", "The extension shut down on 2026-05-15; these are historical channels, not current installation guidance.", "source-inspected"),
      "extension-tool-execution-boundary": factClaim("Host IDE workspace and local processes", "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/advanced-usage/available-tools/tool-use-overview.md", "Roo Code tool-use overview", undefined, "source-inspected"),
    },
  }),
  product({
    id: "tabnine-agent", name: "Tabnine Agent", categoryId: "ide-extensions", editorialOrder: 17,
    officialUrl: "https://docs.tabnine.com/main/getting-started/tabnine-agent",
    tags: ["vscode", "visual-studio", "jetbrains", "eclipse", "agent-panel", "autocomplete", "enterprise"],
    platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.tabnine.com/main/getting-started/tabnine-agent", "Tabnine Agent documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-codebase-context"]),
      "extension-permissions": capability("limited", "https://docs.tabnine.com/main/getting-started/tabnine-agent", "Tabnine Agent documentation", "The agent pauses at documented checkpoints for operator review; a general per-tool policy system is not established."),
      "extension-install-channel": factClaim("IDE marketplaces and enterprise deployment", "https://docs.tabnine.com/main/getting-started/install", "Install Tabnine"),
      "extension-tool-execution-boundary": factClaim("Host IDE with Tabnine-managed inference", "https://docs.tabnine.com/main/getting-started/tabnine-agent", "Tabnine Agent documentation"),
    },
  }),
  product({
    id: "windsurf-plugins", name: "Windsurf Plugins", categoryId: "ide-extensions", editorialOrder: 18,
    officialUrl: "https://docs.devin.ai/windsurf/plugins/changelog",
    tags: ["jetbrains", "cascade", "autocomplete", "agent-panel", "mcp"],
    platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.devin.ai/windsurf/plugins/changelog", "Windsurf Plugins changelog", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-jetbrains", "extension-mcp", "extension-codebase-context"]),
      "extension-permissions": capability("limited", "https://docs.devin.ai/windsurf/plugins/changelog", "Windsurf Plugins changelog", "Cascade documents review and approval interactions; equivalent per-tool policy controls are not established."),
      "extension-install-channel": factClaim("JetBrains Marketplace", "https://docs.devin.ai/windsurf/plugins/getting-started", "Windsurf Plugins getting started"),
      "extension-tool-execution-boundary": factClaim("JetBrains host IDE with Devin-managed services", "https://docs.devin.ai/windsurf/plugins/changelog", "Windsurf Plugins changelog"),
    },
  }),
  product({
    id: "sourcegraph-cody-enterprise", name: "Sourcegraph Cody Enterprise", categoryId: "ide-extensions", editorialOrder: 19,
    officialUrl: "https://sourcegraph.com/docs/cody",
    tags: ["vscode", "jetbrains", "autocomplete", "agent-panel", "enterprise", "self-hosted"],
    platform: ["macos", "windows", "linux", "web"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://sourcegraph.com/docs/cody", "Sourcegraph Cody Enterprise documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-provider-choice", "extension-codebase-context"]),
      "extension-install-channel": factClaim("VS Code and JetBrains marketplaces", "https://sourcegraph.com/docs/cody", "Sourcegraph Cody documentation"),
      "extension-tool-execution-boundary": factClaim("Host IDE with Sourcegraph Enterprise service", "https://sourcegraph.com/docs/cody", "Sourcegraph Cody Enterprise documentation"),
      "extension-byok-local-model": capability("built-in", "https://sourcegraph.com/docs/cody/enterprise/model-configuration", "Cody Enterprise model configuration", "Enterprise deployments can configure supported model providers and self-hosted inference endpoints."),
    },
  }),

  // 6. Cloud and background agents
  product({ id: "openai-codex-cloud", name: "OpenAI Codex cloud", categoryId: "cloud-agents", editorialOrder: 1, officialUrl: "https://openai.com/codex/", tags: ["issue-to-pr", "sandbox", "github", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    "cloud-repo-intake": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Connect a GitHub repository or GitLab Beta project and start from several first-party surfaces."),
    "cloud-sandbox": capability("built-in", "https://learn.chatgpt.com/docs/environments/cloud-environment", "Codex cloud environment documentation", "Every task checks out the selected ref in its own container."),
    "cloud-live-observability": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Live task logs, summary, and diff."),
    "cloud-durable-result": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Review summary and diff, request changes, or open a pull request."),
    "cloud-intake-surfaces": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Web, GitHub, GitLab, Linear, and Slack task starts."),
    "cloud-code-hosts": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "GitHub and GitLab Beta repositories."),
    "cloud-parallel-tasks": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Dedicated cloud environments can continue in parallel."),
    "cloud-environment-config": capability("built-in", "https://learn.chatgpt.com/docs/environments/cloud-environment", "Codex cloud environment documentation", "Container checkout, setup and maintenance scripts, dependencies, tools, variables, and secrets."),
    "cloud-network-policy": capability("built-in", "https://learn.chatgpt.com/docs/cloud/internet-access", "Codex cloud internet access documentation", "Agent internet is off by default and can be enabled with limited or unrestricted access."),
    "cloud-project-instructions": capability("built-in", "https://learn.chatgpt.com/docs/environments/cloud-environment", "Codex cloud environment documentation", "Cloud runs use repository AGENTS.md instructions."),
    "cloud-live-steering": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Watch logs, run in background, request follow-up changes, and review the diff."),
    "cloud-execution-owner": factClaim("OpenAI cloud", "https://learn.chatgpt.com/docs/environments/cloud-environment", "Codex cloud environment documentation"),
    "cloud-isolation-unit": factClaim("Fresh container per task", "https://learn.chatgpt.com/docs/environments/cloud-environment", "Codex cloud environment documentation"),
    "cloud-human-takeover": capability("limited", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Operators can inspect logs and diffs and request follow-ups; the documentation does not describe entering the live container."),
    "cloud-triggered-automation": capability("built-in", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation", "Tasks can start from GitHub, GitLab, Linear, Slack, and first-party automation surfaces."),
    "cloud-result-type": factClaim("Patch, branch, or pull request", "https://learn.chatgpt.com/docs/cloud", "Codex cloud documentation"),
  } }),
  product({ id: "github-copilot-coding-agent", name: "GitHub Copilot coding agent", categoryId: "cloud-agents", editorialOrder: 2, officialUrl: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", tags: ["issue-to-pr", "github", "background", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", "GitHub Copilot coding agent documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result"]),
    "cloud-intake-surfaces": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub agents panel, issues, VS Code, PR comments, API, schedules, and event automations."),
    "cloud-code-hosts": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub repositories only. Treat this positive scope as a fact, not a negative score."),
    "cloud-environment-config": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Ephemeral GitHub Actions-powered development environment."),
    "cloud-network-policy": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall", "GitHub Copilot cloud-agent firewall", "Internet access is limited by default; organization and repository policy can manage the recommended and custom allowlists or disable the firewall."),
    "cloud-project-instructions": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Repository custom instructions, MCP, custom agents, hooks, and skills."),
    "cloud-live-steering": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Continue the same conversation, ask follow-ups, inspect commits and logs, and iterate before PR creation."),
    "cloud-execution-owner": factClaim("GitHub cloud", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation"),
    "cloud-isolation-unit": factClaim("Ephemeral GitHub Actions environment", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation"),
    "cloud-human-takeover": capability("limited", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Operators inspect logs, commits, and diffs and can iterate; no live shell takeover is documented."),
    "cloud-triggered-automation": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Supports API, schedules, issue assignment, pull-request comments, and repository event automations."),
    "cloud-result-type": factClaim("Pull request with commits", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation"),
    "cloud-task-limit": {
      state: "fact",
      displayValue: "59 minutes",
      note: "Maximum execution time per session.",
      evidence: [evidence("https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation")],
    },
  } }),
  product({ id: "devin", name: "Devin", categoryId: "cloud-agents", editorialOrder: 3, officialUrl: "https://docs.devin.ai/get-started/devin-intro", tags: ["cloud-sandbox", "issue-to-pr", "cli-client", "vendor-service"], platform: ["web"], platformSource: { url: "https://docs.devin.ai/get-started/devin-intro", title: "Introducing Devin" }, source: "hosted-service", sourceSource: { url: "https://docs.devin.ai/get-started/devin-intro", title: "Introducing Devin" }, execution: ["vendor-cloud"], executionSource: { url: "https://docs.devin.ai/onboard-devin/environment/blueprints", title: "Devin environment blueprints" }, status: "active", statusSource: { url: "https://docs.devin.ai/release-notes/overview", title: "Devin release notes" }, claims: {
    "cloud-repo-intake": capability("built-in", "https://docs.devin.ai/integrations/gh", "Devin GitHub integration", "Repositories can be mentioned in web prompts and sessions can be created through the API."),
    "cloud-sandbox": capability("built-in", "https://docs.devin.ai/onboard-devin/environment/blueprints", "Devin environment blueprints", "Each session boots a fresh copy of the configured snapshot."),
    "cloud-live-observability": capability("built-in", "https://docs.devin.ai/work-with-devin/devin-session-tools", "Devin session tools", "Progress view plus live Shell, IDE, Browser, and diff inspection."),
    "cloud-durable-result": capability("via-integration", "https://docs.devin.ai/integrations/gh", "Devin GitHub integration", "GitHub integration creates pull requests and continues responding to PR comments while the session is active."),
    "cloud-intake-surfaces": capability("built-in", "https://docs.devin.ai/api-reference/v1/sessions/create-a-new-devin-session", "Devin session API", "Web sessions, API-created sessions, repository mentions, and GitHub PR comments."),
    "cloud-code-hosts": capability("via-integration", "https://docs.devin.ai/integrations/gh", "Devin GitHub integration", "GitHub integration can be scoped to selected repositories."),
    "cloud-parallel-tasks": capability("built-in", "https://docs.devin.ai/get-started/first-run", "Devin first-run documentation", "First-party guidance recommends running larger work as focused sessions in parallel with managed Devins."),
    "cloud-environment-config": capability("built-in", "https://docs.devin.ai/onboard-devin/environment/blueprints", "Devin environment blueprints", "YAML blueprints produce VM snapshots; each session boots a fresh copy."),
    "cloud-project-instructions": capability("built-in", "https://docs.devin.ai/onboard-devin/knowledge-onboarding", "Devin knowledge onboarding", "Knowledge incorporates repository guidance including CLAUDE.md and AGENTS.md."),
    "cloud-live-steering": capability("built-in", "https://docs.devin.ai/work-with-devin/devin-session-tools", "Devin session tools", "Operator can monitor progress, inspect Shell, IDE, and Browser, stop, take over, edit, and resume."),
    "cloud-execution-owner": factClaim("Devin cloud", "https://docs.devin.ai/onboard-devin/environment/blueprints", "Devin environment blueprints"),
    "cloud-isolation-unit": factClaim("Fresh VM from a saved snapshot", "https://docs.devin.ai/onboard-devin/environment/blueprints", "Devin environment blueprints"),
    "cloud-human-takeover": capability("built-in", "https://docs.devin.ai/work-with-devin/devin-session-tools", "Devin session tools", "Operators can enter the live Shell, IDE, or Browser, edit directly, and resume Devin."),
    "cloud-triggered-automation": capability("built-in", "https://docs.devin.ai/api-reference/v1/sessions/create-a-new-devin-session", "Devin session API", "Sessions can be started through the API and GitHub integration events."),
    "cloud-result-type": factClaim("Branch or pull request", "https://docs.devin.ai/integrations/gh", "Devin GitHub integration"),
  } }),
  product({ id: "jules", name: "Jules", categoryId: "cloud-agents", editorialOrder: 4, officialUrl: "https://jules.google/docs/", tags: ["github", "cloud-vm", "issue-to-pr", "experimental"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://jules.google/docs/", "Jules getting started", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts"]),
    "cloud-parallel-tasks": capability("built-in", "https://jules.google/docs/usage-limits", "Jules limits and plans", "Current plans publish concurrent-task allowances of 3, 15, and 60."),
    "cloud-environment-config": capability("built-in", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Tasks run in a fresh environment configured from the connected repository."),
    "cloud-project-instructions": capability("built-in", "https://jules.google/docs/", "Jules getting started", "Jules automatically reads root-level AGENTS.md for repository tools and conventions."),
    "cloud-live-steering": capability("built-in", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Operators review the plan, monitor progress, and provide follow-up direction."),
    "cloud-task-limit": {
      state: "fact",
      displayValue: "15 / 100 / 300 daily; 3 / 15 / 60 concurrent",
      note: "Rolling-24-hour task quotas and concurrent-task caps for Jules, Pro, and Ultra respectively.",
      evidence: [evidence("https://jules.google/docs/usage-limits", "Jules limits and plans")],
    },
    "cloud-execution-owner": factClaim("Google cloud", "https://jules.google/docs/changelog/2025-05-19", "Jules launch architecture"),
    "cloud-isolation-unit": factClaim("Fresh cloud VM per task", "https://jules.google/docs/changelog/2025-05-19", "Jules launch architecture"),
    "cloud-human-takeover": capability("limited", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Plan review and follow-up are documented; direct shell takeover is not."),
    "cloud-triggered-automation": capability("built-in", "https://jules.google/docs/api/reference/", "Jules REST API quickstart", "The API creates and manages sessions and is documented for CI/CD, Slack, Linear, and GitHub automation."),
    "cloud-result-type": factClaim("Branch and pull request", "https://jules.google/docs/running-tasks/", "Jules running tasks"),
  } }),
  product({ id: "claude-code-web", name: "Claude Code on the web", categoryId: "cloud-agents", editorialOrder: 5, officialUrl: "https://code.claude.com/docs/en/claude-code-on-the-web", tags: ["github", "local-bundle", "cloud-vm", "teleport", "research-preview"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "paired-machine"], status: "beta", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-project-instructions", "cloud-live-steering"]),
    "cloud-execution-owner": factClaim("Anthropic cloud", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
    "cloud-isolation-unit": factClaim("Fresh isolated VM per session", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
    "cloud-human-takeover": capability("built-in", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", "A cloud session can be teleported to the local Claude Code CLI."),
    "cloud-environment-config": capability("built-in", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", "Saved cloud environments configure network access, environment variables, and setup scripts."),
    "cloud-network-policy": capability("built-in", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", "Anthropic-hosted environments limit network access by default and can disable it; self-hosted deployments own their egress policy."),
    "cloud-triggered-automation": capability("built-in", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", "Routines support schedules, API calls, and GitHub events; auto-fix reacts to CI failures and review comments."),
    "cloud-result-type": factClaim("Branch, pull request, or local CLI handoff", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
  } }),
  product({ id: "cursor-cloud-agents", name: "Cursor Cloud Agents", categoryId: "cloud-agents", editorialOrder: 6, officialUrl: "https://cursor.com/docs/cloud-agent", tags: ["github", "cloud-vm", "self-hosted-option", "branch-handoff"], platform: ["web", "macos", "windows", "linux"], source: "hosted-service", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-execution-owner": factClaim("Cursor cloud or self-hosted", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation"),
    "cloud-isolation-unit": factClaim("Isolated VM", "https://cursor.com/docs/cloud-agent/builds", "Cursor Cloud Agent builds"),
    "cloud-human-takeover": capability("built-in", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation", "Operators can follow runs and hand branches back to the desktop IDE."),
    "cloud-network-policy": capability("built-in", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation", "Teams can restrict outbound domains and connect private networks."),
    "cloud-project-instructions": capability("built-in", "https://cursor.com/docs/rules", "Cursor Rules documentation", "Version-controlled project rules and AGENTS.md provide repository-scoped instructions."),
    "cloud-triggered-automation": capability("built-in", "https://docs.cursor.com/background-agent/api/overview", "Cursor Cloud Agent API", "First-party API starts and monitors cloud agent runs."),
    "cloud-result-type": factClaim("Pushed branch or pull request", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation"),
  } }),
  product({ id: "factory-cloud-sessions", name: "Factory Droid Computers / cloud sessions", categoryId: "cloud-agents", editorialOrder: 7, officialUrl: "https://docs.factory.ai/", tags: ["cloud-computer", "templates", "web", "mobile", "pull-request"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.factory.ai/", "Factory documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-code-hosts": capability("built-in", "https://docs.factory.ai/enterprise/self-managed-scm", "Factory self-managed source control", "Factory supports GitHub, GitHub Enterprise, GitLab, and GitLab Self-Hosted repositories in sessions."),
    "cloud-network-policy": capability("built-in", "https://docs.factory.ai/enterprise/network-and-deployment", "Factory deployment patterns", "Cloud, hybrid, and air-gapped execution support outbound host restrictions, proxies, custom certificate authorities, and managed network settings."),
    "cloud-project-instructions": capability("built-in", "https://docs.factory.ai/harness/agents-md", "Factory AGENTS.md", "Droids load root and nested repository instruction files with documented discovery and precedence."),
    "cloud-execution-owner": factClaim("Factory cloud or operator machine", "https://docs.factory.ai/", "Factory documentation"),
    "cloud-isolation-unit": factClaim("Cloud computer from a template", "https://docs.factory.ai/droid-computers/cloud-templates", "Factory cloud templates"),
    "cloud-human-takeover": capability("built-in", "https://docs.factory.ai/", "Factory documentation", "Sessions are synchronized to web and mobile for operator review and steering."),
    "cloud-triggered-automation": capability("built-in", "https://docs.factory.ai/software-factory/automations", "Factory custom automations", "Schedules, Slack messages, and GitHub events can start Droid workflows."),
    "cloud-result-type": factClaim("Reviewable diff, branch, or pull request", "https://docs.factory.ai/", "Factory documentation"),
  } }),
  product({ id: "codegen-agent", name: "Codegen agent", categoryId: "cloud-agents", editorialOrder: 8, officialUrl: "https://docs.codegen.com/", tags: ["github", "api", "slack", "linear", "jira", "pull-request"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.codegen.com/integrations/github", "Codegen GitHub integration", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts"]),
    "cloud-sandbox": capability("built-in", "https://docs.codegen.com/sandboxes/overview", "Codegen code execution sandboxes", "Agents run in secure isolated sandboxes with filesystem, terminal, process, and controlled-network access."),
    "cloud-environment-config": capability("built-in", "https://docs.codegen.com/sandboxes/setup-commands", "Codegen sandbox setup commands", "Repository setup commands create reusable snapshots; environment variables and encrypted repository secrets configure runs."),
    "cloud-network-policy": capability("built-in", "https://docs.codegen.com/sandboxes/overview", "Codegen code execution sandboxes", "Sandbox networking is controlled and can be restricted."),
    "cloud-project-instructions": capability("built-in", "https://docs.codegen.com/settings/repo-rules", "Codegen agent rules", "User, organization, and repository rules are supported, including automatic discovery of AGENTS.md and compatible instruction files."),
    "cloud-live-steering": capability("built-in", "https://docs.codegen.com/capabilities/triggering-codegen", "Triggering Codegen", "Follow-ups in the originating thread, issue, ticket, or pull request return to the same agent context."),
    "cloud-execution-owner": factClaim("Codegen cloud", "https://docs.codegen.com/api-reference/agents/create-agent-run", "Codegen agent-run API"),
    "cloud-isolation-unit": factClaim("Isolated sandbox per agent context", "https://docs.codegen.com/sandboxes/overview", "Codegen code execution sandboxes"),
    "cloud-human-takeover": capability("built-in", "https://docs.codegen.com/sandboxes/editor", "Codegen remote editor", "A password-protected VS Code editor opens the active sandbox for terminal access, debugging, inspection, and manual edits."),
    "cloud-triggered-automation": capability("built-in", "https://docs.codegen.com/api-reference/agents/create-agent-run", "Codegen agent-run API", "Agent runs can be created and monitored through the API; Slack, Linear, and Jira are documented intake surfaces."),
    "cloud-result-type": factClaim("Branch or pull request", "https://docs.codegen.com/integrations/github", "Codegen GitHub integration"),
  } }),
  product({ id: "gitlab-duo-developer-flow", name: "GitLab Duo Developer Flow", categoryId: "cloud-agents", editorialOrder: 9, officialUrl: "https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", repository: { id: "gitlab-org/gitlab", url: "https://gitlab.com/gitlab-org/gitlab", relationship: "source-tree" }, repoMetricId: "gitlab", tags: ["gitlab", "ci-runner", "merge-request", "open-core"], platform: ["web"], source: "split-source", execution: ["user-cloud", "local-process"], status: "active", claims: {
    ...builtInClaims("https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", "GitLab Duo Developer Flow", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-project-instructions"]),
    "cloud-sandbox": capability("limited", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution", "Flows run through configured GitLab CI/CD runners or locally; isolation depends on operator runner configuration."),
    "cloud-environment-config": capability("built-in", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "Configure GitLab Duo flow execution", "Committed agent configuration supports setup scripts, container images, caches, variables, ID tokens, and selected runners."),
    "cloud-network-policy": capability("built-in", "https://docs.gitlab.com/user/duo_agent_platform/environment_sandbox/", "GitLab remote execution environment sandbox", "The remote execution sandbox provides default allowed domains and project, group, and instance allow or deny controls."),
    "cloud-execution-owner": factClaim("Customer CI runner or local IDE", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution"),
    "cloud-isolation-unit": factClaim("CI job or local process", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution"),
    "cloud-triggered-automation": capability("built-in", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution", "Developer Flow can be executed asynchronously through GitLab CI/CD."),
    "cloud-result-type": factClaim("Commit or draft merge request", "https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", "GitLab Duo Developer Flow"),
  } }),
  product({ id: "coder-agents", name: "Coder Agents", categoryId: "cloud-agents", editorialOrder: 10, officialUrl: "https://coder.com/docs/ai-coder/agents", repository: repo("coder/coder"), repoMetricId: "coder", tags: ["self-hosted", "workspaces", "customer-infrastructure", "open-core", "beta"], platform: ["web"], source: "split-source", execution: ["user-cloud"], status: "beta", claims: {
    "cloud-repo-intake": capability("limited", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Tasks select a Coder template and workspace rather than requiring GitHub-only intake."),
    ...builtInClaims("https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", ["cloud-sandbox", "cloud-live-observability", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-durable-result": capability("limited", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Durable files, diffs, and attachments are documented; a pull request is not guaranteed."),
    "cloud-code-hosts": capability("built-in", "https://coder.com/docs/ai-coder/agents/architecture", "Coder Agents architecture", "External authentication supports GitHub, GitLab, and Bitbucket, including enterprise and self-hosted variants."),
    "cloud-network-policy": capability("built-in", "https://coder.com/docs/ai-coder/agents/platform-controls/template-optimization", "Coder Agents template optimization", "The workspace is the network boundary and can restrict egress to the control plane and Git provider."),
    "cloud-project-instructions": capability("built-in", "https://coder.com/docs/ai-coder/agents/getting-started", "Coder Agents getting started", "Coder automatically loads workspace AGENTS.md instructions and supports an administrator system prompt."),
    "cloud-execution-owner": factClaim("Operator Coder deployment", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
    "cloud-isolation-unit": factClaim("Provisioned Coder workspace", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
    "cloud-human-takeover": capability("built-in", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Operators can open the same provisioned workspace through Coder."),
    "cloud-triggered-automation": capability("built-in", "https://coder.com/docs/ai-coder/agents/getting-started", "Coder Agents getting started", "The Chats API and service-to-service API keys provide a programmatic automation surface."),
    "cloud-result-type": factClaim("Workspace files, diff, and attachments", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
  } }),
  product({ id: "replit-agent-background-tasks", name: "Replit Agent background tasks", categoryId: "cloud-agents", editorialOrder: 11, officialUrl: "https://docs.replit.com/core-concepts/agent/task-system", tags: ["replit", "background-tasks", "checkpoints", "deployment"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    "cloud-repo-intake": capability("limited", "https://docs.replit.com/category/replit-apps", "Replit Apps documentation", "Starts from a Replit project or imported repository rather than a code-host issue assignment."),
    ...builtInClaims("https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", ["cloud-sandbox", "cloud-live-observability", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-live-steering"]),
    "cloud-durable-result": capability("limited", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", "The primary result is a checkpointed Replit project or deployment, not necessarily a pull request."),
    "cloud-project-instructions": capability("built-in", "https://docs.replit.com/updates/2025/07/11/changelog", "Replit replit.md documentation announcement", "Agent automatically reads the root replit.md file for project architecture, conventions, and preferred tools."),
    "cloud-execution-owner": factClaim("Replit cloud", "https://docs.replit.com/learn/foundations/introduction-to-ai", "Replit AI foundations"),
    "cloud-task-limit": {
      state: "fact",
      displayValue: "1 concurrent on Core; up to 10 on Pro",
      note: "Additional accepted background tasks queue when the plan's active-task cap is reached.",
      evidence: [evidence("https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system")],
    },
    "cloud-isolation-unit": factClaim("Durable Replit workspace", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system"),
    "cloud-human-takeover": capability("built-in", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", "The operator can edit the shared Replit workspace around independent task threads."),
    "cloud-result-type": factClaim("Checkpoint, app, or deployment", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system"),
  } }),
  product({ id: "openhands-cloud", name: "OpenHands Cloud", categoryId: "cloud-agents", editorialOrder: 12, officialUrl: "https://github.com/OpenHands/OpenHands-Cloud", repository: repo("OpenHands/OpenHands-Cloud"), repoMetricId: "openhands-cloud", tags: ["github", "gitlab", "cloud", "self-hosted-enterprise", "source-available"], platform: ["web"], source: "source-available", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/OpenHands/OpenHands", "OpenHands repository", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-environment-config", "cloud-project-instructions", "cloud-live-steering"], undefined, "repository-derived"),
    "cloud-execution-owner": factClaim("OpenHands cloud or enterprise self-host", "https://github.com/OpenHands/OpenHands-Cloud", "OpenHands Cloud repository", undefined, "repository-derived"),
    "cloud-isolation-unit": factClaim("Sandboxed OpenHands runtime", "https://github.com/OpenHands/OpenHands", "OpenHands repository", undefined, "repository-derived"),
    "cloud-human-takeover": capability("built-in", "https://github.com/OpenHands/OpenHands", "OpenHands repository", "The web workspace exposes terminal, browser, files, and live conversation for operator intervention.", "repository-derived"),
    "cloud-triggered-automation": capability("built-in", "https://docs.openhands.dev/openhands/usage/cloud/github-installation", "OpenHands Cloud GitHub integration", "Installed GitHub integration can launch work from the Cloud UI, an openhands issue label, or @openhands; successful issue work opens a pull request and reports progress back to the issue."),
    "cloud-result-type": factClaim("Repository changes or pull request", "https://github.com/OpenHands/OpenHands", "OpenHands repository", undefined, "repository-derived"),
  } }),
  product({ id: "open-swe", name: "Open SWE", categoryId: "cloud-agents", editorialOrder: 13, officialUrl: "https://github.com/langchain-ai/open-swe", repository: repo("langchain-ai/open-swe"), repoMetricId: "open-swe", tags: ["github", "issue-to-pr", "sandbox", "langgraph", "oss"], platform: ["web"], source: "open-source", execution: ["container", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/langchain-ai/open-swe", "Open SWE repository", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-environment-config", "cloud-project-instructions", "cloud-live-steering"], undefined, "repository-derived"),
    "cloud-execution-owner": factClaim("Operator deployment on LangGraph-compatible infrastructure", "https://github.com/langchain-ai/open-swe", "Open SWE repository", undefined, "repository-derived"),
    "cloud-isolation-unit": factClaim("Per-task sandbox", "https://github.com/langchain-ai/open-swe", "Open SWE repository", undefined, "repository-derived"),
    "cloud-human-takeover": capability("limited", "https://github.com/langchain-ai/open-swe", "Open SWE repository", "The UI exposes live status and steering; direct shell takeover is not established.", "repository-derived"),
    "cloud-triggered-automation": capability("built-in", "https://github.com/langchain-ai/open-swe", "Open SWE repository", "GitHub issue and repository workflows can dispatch work to the agent.", "repository-derived"),
    "cloud-result-type": factClaim("Branch and pull request", "https://github.com/langchain-ai/open-swe", "Open SWE repository", undefined, "repository-derived"),
  } }),
  product({ id: "amazon-q-github", name: "Amazon Q Developer for GitHub", categoryId: "cloud-agents", editorialOrder: 14, officialUrl: "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", tags: ["github", "code-review", "aws", "background-agent"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", "Amazon Q Developer GitHub code review", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-project-instructions", "cloud-triggered-automation"]),
    "cloud-execution-owner": factClaim("AWS managed service", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", "Amazon Q Developer GitHub code review"),
    "cloud-isolation-unit": factClaim("Managed review job", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", "Amazon Q Developer GitHub code review"),
    "cloud-human-takeover": capability("limited", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", "Amazon Q Developer GitHub code review", "Operators interact through GitHub review surfaces; a live execution environment is not exposed."),
    "cloud-result-type": factClaim("GitHub review findings and suggested changes", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-code-reviews.html", "Amazon Q Developer GitHub code review"),
  } }),
  product({ id: "sentry-seer", name: "Sentry Seer", categoryId: "cloud-agents", editorialOrder: 15, officialUrl: "https://docs.sentry.io/product/ai-in-sentry/seer/", tags: ["sentry", "issue-fix", "github", "background-agent"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.sentry.io/product/ai-in-sentry/seer/", "Sentry Seer documentation", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-live-steering", "cloud-triggered-automation"]),
    "cloud-sandbox": capability("built-in", "https://docs.sentry.io/product/ai-in-sentry/seer/autofix/", "Sentry Seer Autofix", "Autofix analyzes an issue and connected repository in a managed execution environment."),
    "cloud-execution-owner": factClaim("Sentry managed service", "https://docs.sentry.io/product/ai-in-sentry/seer/", "Sentry Seer documentation"),
    "cloud-isolation-unit": factClaim("Per-issue Autofix run", "https://docs.sentry.io/product/ai-in-sentry/seer/autofix/", "Sentry Seer Autofix"),
    "cloud-human-takeover": capability("limited", "https://docs.sentry.io/product/ai-in-sentry/seer/autofix/", "Sentry Seer Autofix", "Operators review and steer the generated plan and patch; direct shell takeover is not documented."),
    "cloud-result-type": factClaim("Root-cause analysis, patch, and pull request", "https://docs.sentry.io/product/ai-in-sentry/seer/autofix/", "Sentry Seer Autofix"),
  } }),

  // 7. General purpose agents
  product({
    id: "openclaw", name: "OpenClaw", categoryId: "general-purpose-agents", editorialOrder: 1,
    officialUrl: "https://openclaw.ai/", repository: repo("openclaw/openclaw"), repoMetricId: "openclaw",
    tags: ["personal-agent", "gateway", "memory", "browser", "computer-use", "messaging", "automation", "mcp", "oss"],
    platform: ["macos", "windows", "linux", "web", "ios", "android"],
    platformNote: "The Gateway is supported on macOS, Windows, and Linux and exposes a Web Control UI. macOS and Windows have companion apps; iOS and Android are paired nodes rather than desktop hosts.",
    platformSource: { url: "https://docs.openclaw.ai/platforms", title: "OpenClaw platforms" },
    source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://docs.openclaw.ai/", "OpenClaw overview", ["general-durable-identity", "general-long-term-memory", "general-communications", "general-self-hosting", "general-model-freedom"]),
      ...builtInClaims("https://docs.openclaw.ai/browser", "OpenClaw managed browser", ["general-browser-control"]),
      ...builtInClaims("https://docs.openclaw.ai/tools", "OpenClaw tools overview", ["general-terminal-files", "general-skills-integrations", "general-multi-agent"]),
      ...builtInClaims("https://docs.openclaw.ai/nodes/computer-use", "OpenClaw computer use", ["general-computer-use"]),
      ...builtInClaims("https://github.com/openclaw/openclaw/blob/main/docs/automation/cron-jobs.md", "OpenClaw automations", ["general-scheduled-automation", "general-event-triggers"], undefined, "source-inspected"),
      "general-operator-surfaces": factClaim("Control UI, CLI, TUI, desktop companions, and mobile nodes", "https://docs.openclaw.ai/platforms", "OpenClaw platforms"),
      "general-human-approvals": capability("built-in", "https://docs.openclaw.ai/nodes", "OpenClaw nodes", "Pairing, command allowlists, and exec approvals gate host actions; enabled computer control is a durable grant rather than a per-action prompt."),
      "general-execution-owner": factClaim("Operator Gateway plus optional paired nodes", "https://docs.openclaw.ai/", "OpenClaw overview"),
      "general-isolation": capability("limited", "https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md", "OpenClaw sandboxing", "Tool execution can use Docker, SSH, or OpenShell isolation, but sandboxing is off by default and the Gateway remains on the host.", "source-inspected"),
    },
  }),
  product({
    id: "hermes-agent", name: "Hermes Agent", categoryId: "general-purpose-agents", editorialOrder: 2,
    officialUrl: "https://hermes-agent.nousresearch.com/docs/", repository: repo("NousResearch/hermes-agent"), repoMetricId: "hermes-agent",
    tags: ["personal-agent", "memory", "browser", "terminal", "messaging", "cron", "subagents", "mcp", "byok", "local-models", "oss"],
    platform: ["macos", "windows", "linux", "web", "android"],
    platformNote: "Native desktop is documented for macOS, Windows, and Linux; the CLI also has a tested Android/Termux path. Web and messaging are remote operator surfaces, not native mobile clients.",
    platformSource: { url: "https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md", title: "Hermes Agent repository" },
    source: "open-source", execution: ["local-process", "local-daemon", "container", "ssh-host", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md", "Hermes Agent repository", ["general-durable-identity", "general-long-term-memory", "general-communications", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
      ...builtInClaims("https://hermes-agent.nousresearch.com/docs/user-guide/features/browser/", "Hermes browser automation", ["general-browser-control"]),
      ...builtInClaims("https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/", "Hermes tools", ["general-terminal-files", "general-skills-integrations"]),
      ...builtInClaims("https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/", "Hermes cron", ["general-scheduled-automation"]),
      ...builtInClaims("https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation/", "Hermes subagent delegation", ["general-multi-agent"]),
      "general-event-triggers": capability("limited", "https://hermes-agent.nousresearch.com/docs/user-guide/messaging", "Hermes messaging gateway", "The Gateway includes a webhook adapter with full tools; a broader typed event-routing system is not established."),
      "general-operator-surfaces": factClaim("Native desktop, CLI/TUI, web dashboard, and messaging gateway", "https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/README.md", "Hermes Desktop repository", undefined, "repository-derived"),
      "general-human-approvals": capability("built-in", "https://hermes-agent.nousresearch.com/docs/user-guide/configuration", "Hermes configuration", "Smart and manual modes gate potentially dangerous commands; hard deny rules remain enforceable."),
      "general-execution-owner": factClaim("Local, Docker/Singularity, SSH, Modal, Daytona, or Vercel Sandbox", "https://hermes-agent.nousresearch.com/docs/user-guide/configuration", "Hermes configuration"),
      "general-isolation": capability("limited", "https://hermes-agent.nousresearch.com/docs/user-guide/configuration", "Hermes configuration", "Container and cloud backends provide isolation; the default local backend provides none."),
    },
  }),
  product({
    id: "grok-bot", name: "Grok Bot", categoryId: "general-purpose-agents", editorialOrder: 3,
    officialUrl: "https://x.ai/bot", tags: ["named-agents", "cloud-computer", "browser", "desktop-tools", "connectors", "routines", "approvals", "multi-agent"],
    platform: ["macos", "windows", "ios"],
    platformNote: "The exact Grok Bot SKU has native macOS and Windows desktop clients plus an iOS companion. Its FAQ explicitly says Linux, Android, and iPad are unsupported at initial launch.",
    platformSource: { url: "https://docs.x.ai/grok-bot/faq", title: "Grok Bot FAQ" },
    source: "hosted-service", execution: ["vendor-cloud", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://docs.x.ai/grok-bot/overview", "Grok Bot overview", ["general-durable-identity", "general-skills-integrations", "general-multi-agent"]),
      ...builtInClaims("https://docs.x.ai/grok-bot/faq", "Grok Bot FAQ", ["general-long-term-memory"]),
      ...builtInClaims("https://docs.x.ai/grok-bot/computer-and-apps", "Grok Bot computer and apps", ["general-browser-control", "general-terminal-files", "general-computer-use"]),
      "general-communications": capability("limited", "https://docs.x.ai/grok-bot/chat-and-collaboration", "Grok Bot collaboration", "Direct conversations, groups, threads, and Bot-to-Bot messages are built in; external chat-channel ingress is not established."),
      "general-operator-surfaces": factClaim("macOS and Windows desktop plus iOS companion", "https://docs.x.ai/grok-bot/faq", "Grok Bot FAQ"),
      ...builtInClaims("https://docs.x.ai/grok-bot/skills-routines-and-automations", "Grok Bot skills and routines", ["general-scheduled-automation", "general-event-triggers"]),
      "general-human-approvals": capability("built-in", "https://docs.x.ai/grok-bot/approvals-security-and-privacy", "Grok Bot approvals", "Actions can stop for one-time approval or denial; Auto-review supports narrow Require Approval rules."),
      "general-execution-owner": factClaim("Persistent vendor-managed Linux cloud VM plus permissioned local actions", "https://docs.x.ai/grok-bot/faq", "Grok Bot FAQ"),
      "general-isolation": factClaim("One cloud computer per user account; Bots share it", "https://docs.x.ai/grok-bot/computer-and-apps", "Grok Bot computer and apps", "Bots are separate work surfaces, not separate security boundaries."),
      "general-self-hosting": unknownClaim("The managed cloud computer is documented; the exact SKU does not establish or explicitly deny a self-hosted edition."),
      "general-model-freedom": unknownClaim("Current exact-SKU documentation does not establish operator-selectable third-party or local models."),
    },
  }),
  product({
    id: "perplexity-computer", name: "Perplexity Computer", categoryId: "general-purpose-agents", editorialOrder: 4,
    officialUrl: "https://www.perplexity.ai/products/computer", tags: ["digital-worker", "cloud-sandbox", "memory", "browser", "connectors", "scheduled-tasks", "subagents"],
    platform: ["web", "ios", "android"], platformSource: { url: "https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", title: "What is Computer?" },
    source: "hosted-service", execution: ["vendor-cloud"], executionSource: { url: "https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", title: "What is Computer?" }, status: "active",
    claims: {
      ...builtInClaims("https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", "What is Computer?", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-skills-integrations", "general-multi-agent"]),
      "general-computer-use": capability("limited", "https://www.perplexity.ai/products/computer", "What is Perplexity Computer", "Browser automation, code, and artifacts are documented; native desktop-application control is not established."),
      "general-operator-surfaces": factClaim("Web desktop, iOS, Android, Slack, and Microsoft 365", "https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", "What is Computer?"),
      ...builtInClaims("https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", "What is Computer?", ["general-scheduled-automation", "general-event-triggers"]),
      "general-execution-owner": factClaim("Perplexity cloud", "https://www.perplexity.ai/help-center/en/articles/13837784-what-is-computer", "What is Computer?"),
      "general-isolation": capability("built-in", "https://www.perplexity.ai/help-center/en/articles/13901210-computer-for-enterprise", "Computer for Enterprise", "Computer tasks run in isolated compute containers with dedicated filesystems and browser instances."),
      "general-self-hosting": unknownClaim("Current exact-SKU documentation does not establish a self-hosted deployment."),
      "general-model-freedom": unknownClaim("Current exact-SKU documentation does not establish operator-selectable third-party or local models."),
    },
  }),
  product({
    id: "manus", name: "Manus", categoryId: "general-purpose-agents", editorialOrder: 5,
    officialUrl: "https://manus.im/", tags: ["cloud-computer", "desktop", "browser", "terminal", "files", "skills", "scheduled-tasks", "approvals"],
    platform: ["macos", "windows", "web"], platformSource: { url: "https://manus.im/docs/features/desktop", title: "Manus Desktop documentation" },
    source: "proprietary", execution: ["vendor-cloud", "local-process", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer", "Manus Cloud Computer", ["general-durable-identity", "general-browser-control", "general-terminal-files", "general-computer-use"]),
      "general-long-term-memory": capability("limited", "https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer", "Manus Cloud Computer", "Projects, files, tools, and processes persist across sessions; a distinct semantic-memory contract is not established."),
      "general-operator-surfaces": factClaim("Web plus macOS and Windows Desktop", "https://manus.im/docs/features/desktop", "Manus Desktop documentation"),
      ...builtInClaims("https://manus.im/features/agent-skills", "Manus Agent Skills", ["general-skills-integrations"]),
      ...builtInClaims("https://manus.im/features/agent-skills", "Manus Agent Skills", ["general-scheduled-automation"]),
      "general-human-approvals": capability("built-in", "https://manus.im/docs/features/desktop", "Manus Desktop documentation", "Local folders require explicit authorization and commands use scoped approval prompts."),
      "general-execution-owner": factClaim("Persistent Manus cloud VM or user-authorized local desktop", "https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer", "Manus Cloud Computer"),
      "general-isolation": factClaim("Isolated Ubuntu cloud VM plus folder-scoped local authorization", "https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer", "Manus Cloud Computer"),
      "general-self-hosting": unknownClaim("Current exact-SKU documentation does not establish a self-hosted deployment."),
      "general-model-freedom": unknownClaim("Current exact-SKU documentation does not establish operator-selectable third-party or local models."),
    },
  }),
  product({
    id: "genspark-super-agent", name: "Genspark Super Agent", categoryId: "general-purpose-agents", editorialOrder: 6,
    officialUrl: "https://www.genspark.ai/helpcenter/super-agent", tags: ["super-agent", "cloud-sandbox", "browser", "files", "secondbrain", "skills", "parallel-agents", "background"],
    platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://www.genspark.ai/helpcenter/super-agent", "Genspark Super Agent help", ["general-durable-identity", "general-browser-control", "general-terminal-files", "general-skills-integrations", "general-multi-agent"]),
      ...builtInClaims("https://www.genspark.ai/helpcenter/secondbrain", "Genspark SecondBrain", ["general-long-term-memory"]),
      "general-computer-use": capability("limited", "https://www.genspark.ai/helpcenter/super-agent", "Genspark Super Agent help", "A real browser and execution sandbox are documented; native desktop-application control is not established."),
      "general-communications": capability("limited", "https://www.genspark.ai/helpcenter/secondbrain", "Genspark SecondBrain", "Connected email, calendar, chat, meetings, and apps provide context and selected actions rather than a general external messaging gateway."),
      "general-operator-surfaces": factClaim("Browser application", "https://www.genspark.ai/helpcenter/super-agent", "Genspark Super Agent help"),
      "general-execution-owner": factClaim("Genspark cloud", "https://www.genspark.ai/helpcenter/super-agent", "Genspark Super Agent help"),
      "general-isolation": capability("built-in", "https://www.genspark.ai/helpcenter/super-agent", "Genspark Super Agent help", "Each task uses a dedicated browser, filesystem, and execution sandbox."),
      "general-self-hosting": unknownClaim("Current exact-SKU documentation does not establish a self-hosted deployment."),
      "general-model-freedom": unknownClaim("Current exact-SKU documentation does not establish operator-selectable third-party or local models."),
    },
  }),
  product({
    id: "nanobot", name: "nanobot", categoryId: "general-purpose-agents", editorialOrder: 7,
    officialUrl: "https://github.com/HKUDS/nanobot", repository: repo("HKUDS/nanobot"), repoMetricId: "nanobot",
    tags: ["personal-agent", "gateway", "webui", "tui", "memory", "messaging", "automation", "mcp", "subagents", "oss"],
    platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/HKUDS/nanobot/main/README.md", "nanobot repository", ["general-durable-identity", "general-long-term-memory", "general-terminal-files", "general-communications", "general-skills-integrations", "general-multi-agent", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
      "general-browser-control": capability("limited", "https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md", "nanobot configuration", "Web search and fetch are built in; click/type browser automation is not established.", "source-inspected"),
      "general-operator-surfaces": factClaim("WebUI, terminal client, API, and chat apps", "https://raw.githubusercontent.com/HKUDS/nanobot/main/README.md", "nanobot repository", undefined, "repository-derived"),
      ...builtInClaims("https://github.com/HKUDS/nanobot/blob/main/docs/automations.md", "nanobot automations", ["general-scheduled-automation"], undefined, "source-inspected"),
      "general-event-triggers": capability("limited", "https://github.com/HKUDS/nanobot/blob/main/docs/automations.md", "nanobot automations", "Durable local triggers accept CI or webhook-adapter messages, but nanobot has no built-in public webhook receiver.", "source-inspected"),
      "general-execution-owner": factClaim("Operator-controlled local or server Gateway", "https://raw.githubusercontent.com/HKUDS/nanobot/main/README.md", "nanobot repository", undefined, "repository-derived"),
      "general-isolation": capability("limited", "https://github.com/HKUDS/nanobot/blob/main/docs/configuration.md", "nanobot configuration", "Linux bubblewrap and Docker isolation are available, but workspace restriction and shell sandboxing are off by default.", "source-inspected"),
    },
  }),
  product({
    id: "agent-zero", name: "Agent Zero", categoryId: "general-purpose-agents", editorialOrder: 8,
    officialUrl: "https://www.agent-zero.ai/", repository: repo("agent0ai/agent-zero"), repoMetricId: "agent-zero",
    tags: ["agent-workbench", "linux-desktop", "browser", "documents", "projects", "memory", "plugins", "scheduler", "subagents", "oss"],
    platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["container", "local-daemon", "user-cloud", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/agent0ai/agent-zero", "Agent Zero repository", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-computer-use", "general-skills-integrations", "general-multi-agent", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
      "general-operator-surfaces": factClaim("Browser Web UI, A0 Launcher, and A0 CLI", "https://github.com/agent0ai/agent-zero", "Agent Zero repository", undefined, "repository-derived"),
      ...builtInClaims("https://www.agent-zero.ai/p/docs/task-scheduler/", "Agent Zero Task Scheduler", ["general-scheduled-automation"]),
      "general-human-approvals": capability("limited", "https://www.agent-zero.ai/p/docs/a0-cli-connector/", "Agent Zero A0 CLI", "Tool, MCP, and Skill permissions plus explicit host-computer enablement are documented; a general per-action approval workflow is not established."),
      "general-execution-owner": factClaim("Operator Docker container with optional host bridge", "https://github.com/agent0ai/agent-zero", "Agent Zero repository", undefined, "repository-derived"),
      "general-isolation": capability("built-in", "https://github.com/agent0ai/agent-zero", "Agent Zero repository", "The default work environment is a Dockerized Linux desktop; host access is a separate explicit bridge.", "repository-derived"),
    },
  }),
  product({
    id: "zeroclaw", name: "ZeroClaw", categoryId: "general-purpose-agents", editorialOrder: 9,
    officialUrl: "https://github.com/zeroclaw-labs/zeroclaw", repository: repo("zeroclaw-labs/zeroclaw"), repoMetricId: "zeroclaw",
    tags: ["personal-agent", "rust", "single-binary", "browser", "shell", "messaging", "mcp", "self-hosted", "oss"],
    platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-skills-integrations", "general-self-hosting"], undefined, "repository-derived"),
      "general-operator-surfaces": factClaim("CLI and 30+ messaging adapters", "https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", undefined, "repository-derived"),
      "general-scheduled-automation": capability("built-in", "https://github.com/zeroclaw-labs/zeroclaw/blob/master/.claude/skills/zeroclaw/SKILL.md", "ZeroClaw operations skill", "Persistent cron, at-time, interval, pause, resume, and one-shot scheduled tasks are documented.", "source-inspected"),
      "general-event-triggers": capability("limited", "https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", "Webhook adapters are documented; a broader durable event-automation contract is not established.", "repository-derived"),
      "general-multi-agent": capability("built-in", "https://github.com/zeroclaw-labs/zeroclaw/blob/master/docs/book/src/providers/routing.md", "ZeroClaw provider routing", "spawn_subagent runs an ephemeral child under its own identity and provider/model profile.", "source-inspected"),
      "general-human-approvals": capability("limited", "https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", "Autonomy, sandboxing, and tool-receipt controls are documented; the exact default and per-action policy require the security guide.", "repository-derived"),
      "general-execution-owner": factClaim("Operator machine, container, or server", "https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", undefined, "repository-derived"),
      "general-isolation": capability("limited", "https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/README.md", "ZeroClaw repository", "Sandbox controls are configurable; the reviewed first-party summary does not establish the exact default policy.", "repository-derived"),
      "general-model-freedom": capability("built-in", "https://github.com/zeroclaw-labs/zeroclaw/blob/master/docs/book/src/providers/overview.md", "ZeroClaw model providers", "Supports vendor providers, arbitrary OpenAI-compatible endpoints, self-hosted inference, and local Ollama models.", "source-inspected"),
    },
  }),
  product({
    id: "ironclaw", name: "IronClaw", categoryId: "general-purpose-agents", editorialOrder: 10,
    officialUrl: "https://github.com/nearai/ironclaw", repository: repo("nearai/ironclaw"), repoMetricId: "ironclaw",
    tags: ["personal-agent", "agent-os", "encrypted-memory", "webui", "repl", "webhooks", "wasm", "mcp", "automation", "oss"],
    platform: ["macos", "windows", "linux", "web"], platformNote: "Windows support is documented through WSL; the WebUI is served by the operator-run background service.",
    source: "open-source", execution: ["local-daemon", "container", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/nearai/ironclaw/main/README.md", "IronClaw repository", ["general-durable-identity", "general-long-term-memory", "general-terminal-files", "general-communications", "general-scheduled-automation", "general-event-triggers", "general-skills-integrations", "general-self-hosting"], undefined, "repository-derived"),
      "general-operator-surfaces": factClaim("Background service, browser WebUI, and terminal REPL", "https://raw.githubusercontent.com/nearai/ironclaw/main/README.md", "IronClaw repository", undefined, "repository-derived"),
      "general-multi-agent": capability("limited", "https://raw.githubusercontent.com/nearai/ironclaw/main/README.md", "IronClaw repository", "Parallel isolated jobs are documented; arbitrary peer-agent handoff is not established.", "repository-derived"),
      "general-execution-owner": factClaim("Operator-run local or server service", "https://raw.githubusercontent.com/nearai/ironclaw/main/README.md", "IronClaw repository", undefined, "repository-derived"),
      "general-isolation": capability("built-in", "https://raw.githubusercontent.com/nearai/ironclaw/main/README.md", "IronClaw repository", "Untrusted tools run in capability-limited WASM; container jobs use per-job tokens and secrets cross the host boundary explicitly.", "repository-derived"),
      "general-model-freedom": capability("built-in", "https://github.com/nearai/ironclaw/blob/main/docs/capabilities/llm-providers.md", "IronClaw inference providers", "More than twenty selectable providers are documented, including Ollama and custom OpenAI-compatible endpoints.", "source-inspected"),
    },
  }),
  product({
    id: "picoclaw", name: "PicoClaw", categoryId: "general-purpose-agents", editorialOrder: 11,
    officialUrl: "https://github.com/sipeed/picoclaw", repository: repo("sipeed/picoclaw"), repoMetricId: "picoclaw",
    tags: ["personal-agent", "edge", "webui", "android", "messaging", "mcp", "cron", "subagents", "model-routing", "oss"],
    platform: ["macos", "windows", "linux", "web", "android"], platformNote: "Android is documented through an APK and Termux; desktop/server binaries span x86, ARM, MIPS, and RISC-V.",
    source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/sipeed/picoclaw/main/README.md", "PicoClaw repository", ["general-durable-identity", "general-long-term-memory", "general-communications", "general-scheduled-automation", "general-skills-integrations", "general-multi-agent", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
      "general-browser-control": capability("limited", "https://raw.githubusercontent.com/sipeed/picoclaw/main/README.md", "PicoClaw repository", "Web search is documented; interactive click/type browser control is not established.", "repository-derived"),
      "general-terminal-files": capability("built-in", "https://github.com/sipeed/picoclaw/blob/main/docs/guides/configuration.md", "PicoClaw configuration", "Read, write, edit, append, list, and exec tools operate within the configured agent workspace.", "source-inspected"),
      "general-operator-surfaces": factClaim("Browser WebUI, terminal/gateway, Android, and 19+ chat channels", "https://raw.githubusercontent.com/sipeed/picoclaw/main/README.md", "PicoClaw repository", undefined, "repository-derived"),
      "general-event-triggers": capability("limited", "https://raw.githubusercontent.com/sipeed/picoclaw/main/README.md", "PicoClaw repository", "Hooks are documented in current guides and releases; a general public webhook contract is not established.", "repository-derived"),
      "general-execution-owner": factClaim("Operator local host, Docker, VM, Android, or edge device", "https://raw.githubusercontent.com/sipeed/picoclaw/main/README.md", "PicoClaw repository", undefined, "repository-derived"),
      "general-isolation": capability("limited", "https://github.com/sipeed/picoclaw/blob/main/docs/reference/tools_configuration.md", "PicoClaw tools configuration", "Workspace restrictions and command deny patterns are enabled by default, but child processes can bypass the direct exec guard; stronger container or VM isolation is recommended for untrusted code.", "source-inspected"),
    },
  }),
  product({
    id: "openfang", name: "OpenFang", categoryId: "general-purpose-agents", editorialOrder: 12,
    officialUrl: "https://github.com/RightNow-AI/openfang", repository: repo("RightNow-AI/openfang"), repoMetricId: "openfang",
    tags: ["agent-os", "scheduled-hands", "browser", "messaging", "mcp", "a2a", "wasm", "approvals", "oss"],
    platform: ["macos", "windows", "linux", "web"], platformNote: "The exact product documents macOS/Linux shell and Windows PowerShell installs, a local dashboard, CLI/TUI, and a Tauri desktop app.",
    source: "open-source", execution: ["local-process", "local-daemon", "user-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-communications", "general-scheduled-automation", "general-event-triggers", "general-skills-integrations", "general-self-hosting"], undefined, "repository-derived"),
      "general-terminal-files": capability("built-in", "https://github.com/RightNow-AI/openfang/blob/main/MIGRATION.md", "OpenFang canonical tool mapping", "The tool contract names file_read, file_write, file_list, and capability-gated shell_exec.", "source-inspected"),
      "general-computer-use": capability("limited", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", "Persistent browser workflows are documented; general native-desktop control is not established.", "repository-derived"),
      "general-operator-surfaces": factClaim("Local dashboard, CLI/TUI, Tauri desktop, and 40 channel adapters", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", undefined, "repository-derived"),
      "general-multi-agent": capability("limited", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", "Scheduled Hands are autonomous capability packages; arbitrary peer-agent collaboration is not established.", "repository-derived"),
      "general-human-approvals": capability("built-in", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", "The Browser Hand gates purchases and the Twitter Hand has a publication approval queue.", "repository-derived"),
      "general-execution-owner": factClaim("Operator-run Agent OS", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", undefined, "repository-derived"),
      "general-isolation": capability("built-in", "https://raw.githubusercontent.com/RightNow-AI/openfang/main/README.md", "OpenFang repository", "WASM tool sandboxing, capability gates, signed manifests, audit trails, injection checks, and approval gates are documented.", "repository-derived"),
      "general-model-freedom": capability("built-in", "https://github.com/RightNow-AI/openfang/blob/main/docs/configuration.md", "OpenFang configuration", "The configurable provider contract spans cloud providers and local Ollama, vLLM, and LM Studio endpoints.", "source-inspected"),
    },
  }),
  product({
    id: "agent-tars", name: "Agent TARS", categoryId: "general-purpose-agents", editorialOrder: 13,
    officialUrl: "https://github.com/bytedance/UI-TARS-desktop", repository: repo("bytedance/UI-TARS-desktop"), repoMetricId: "agent-tars",
    tags: ["multimodal-agent", "browser", "gui", "vision", "mcp", "cli", "webui", "sandbox", "oss"],
    platform: ["web"], platformNote: "Agent TARS documents a WebUI, CLI, and headless server. The shared repository's native macOS/Windows claims belong to the separate UI-TARS Desktop SKU and are not applied here.",
    source: "open-source", execution: ["local-process", "container"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/bytedance/UI-TARS-desktop", "Agent TARS repository", ["general-browser-control", "general-terminal-files", "general-computer-use", "general-skills-integrations", "general-self-hosting"], undefined, "repository-derived"),
      "general-operator-surfaces": factClaim("CLI, WebUI, and headless server", "https://github.com/bytedance/UI-TARS-desktop", "Agent TARS repository", undefined, "repository-derived"),
      "general-execution-owner": factClaim("Operator-run process or isolated AIO sandbox", "https://github.com/bytedance/UI-TARS-desktop", "Agent TARS repository", undefined, "repository-derived"),
      "general-isolation": capability("built-in", "https://github.com/bytedance/UI-TARS-desktop", "Agent TARS repository", "The exact Agent TARS material documents an isolated all-in-one agent sandbox.", "repository-derived"),
    },
  }),
  product({ id: "claude-cowork", name: "Claude Cowork", categoryId: "general-purpose-agents", editorialOrder: 14, officialUrl: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork", tags: ["cowork", "computer-use", "files", "browser", "scheduled-tasks"], platform: ["macos", "windows", "linux", "web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "paired-machine"], status: "beta", claims: {
    ...builtInClaims("https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork", "Get started with Claude Cowork", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-computer-use", "general-operator-surfaces", "general-scheduled-automation", "general-skills-integrations", "general-multi-agent", "general-human-approvals"]),
    "general-execution-owner": factClaim("Anthropic cloud with approved access to the paired computer", "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork", "Get started with Claude Cowork"),
    "general-isolation": capability("limited", "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork", "Get started with Claude Cowork", "Cowork uses explicit folder and action permissions; a general-purpose sandbox contract is not established."),
  } }),
  product({ id: "chatgpt-work", name: "ChatGPT Work", categoryId: "general-purpose-agents", editorialOrder: 15, officialUrl: "https://openai.com/chatgpt-work/", tags: ["work", "computer-use", "browser", "files", "connectors", "tasks"], platform: ["macos", "windows", "web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://openai.com/chatgpt-work/", "ChatGPT Work", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-skills-integrations", "general-computer-use", "general-operator-surfaces", "general-scheduled-automation", "general-event-triggers", "general-human-approvals"]),
    "general-execution-owner": factClaim("OpenAI cloud and approved connected applications", "https://openai.com/chatgpt-work/", "ChatGPT Work"),
    "general-isolation": capability("limited", "https://openai.com/chatgpt-work/", "ChatGPT Work", "Connected-app permissions and confirmations are documented; a uniform sandbox across every tool is not established."),
  } }),
  product({ id: "eigent", name: "Eigent", categoryId: "general-purpose-agents", editorialOrder: 16, officialUrl: "https://github.com/eigent-ai/eigent", repository: repo("eigent-ai/eigent"), repoMetricId: "eigent", tags: ["cowork", "multi-agent", "browser", "mcp", "desktop", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/eigent-ai/eigent", "Eigent repository", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-skills-integrations", "general-multi-agent", "general-computer-use", "general-operator-surfaces", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
    "general-human-approvals": capability("built-in", "https://github.com/eigent-ai/eigent", "Eigent repository", "The desktop operator reviews and authorizes consequential agent actions.", "repository-derived"),
    "general-execution-owner": factClaim("Operator desktop with optional managed providers", "https://github.com/eigent-ai/eigent", "Eigent repository", undefined, "repository-derived"),
    "general-isolation": capability("limited", "https://github.com/eigent-ai/eigent", "Eigent repository", "Local tool execution is operator-owned; a complete per-task isolation contract is not established.", "repository-derived"),
  } }),
  product({ id: "lobsterai", name: "LobsterAI", categoryId: "general-purpose-agents", editorialOrder: 17, officialUrl: "https://github.com/netease-youdao/LobsterAI", repository: repo("netease-youdao/LobsterAI"), repoMetricId: "lobsterai", tags: ["desktop", "mobile", "browser", "personal-agent", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/netease-youdao/LobsterAI", "LobsterAI repository", ["general-durable-identity", "general-long-term-memory", "general-browser-control", "general-terminal-files", "general-communications", "general-skills-integrations", "general-computer-use", "general-operator-surfaces", "general-self-hosting", "general-model-freedom"], undefined, "repository-derived"),
    "general-human-approvals": capability("built-in", "https://github.com/netease-youdao/LobsterAI", "LobsterAI repository", "The local operator remains in control of desktop and external actions.", "repository-derived"),
    "general-execution-owner": factClaim("Operator desktop and paired clients", "https://github.com/netease-youdao/LobsterAI", "LobsterAI repository", undefined, "repository-derived"),
    "general-isolation": capability("limited", "https://github.com/netease-youdao/LobsterAI", "LobsterAI repository", "Local execution is documented, but a complete sandbox boundary is not established.", "repository-derived"),
  } }),

  // 8. Remote companions and relays
  product({ id: "happy", name: "Happy", categoryId: "remote-companions", editorialOrder: 1, officialUrl: "https://github.com/slopus/happy", repository: repo("slopus/happy"), repoMetricId: "happy", tags: ["mobile", "web", "e2e-encryption", "claude", "codex", "oss"], platform: ["web", "ios", "android"], source: "open-source", execution: ["paired-machine", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/slopus/happy", "Happy repository", ["remote-client-reach", "remote-existing-session", "remote-approvals"], undefined, "repository-derived"),
    "remote-encryption": capability("limited", "https://github.com/slopus/happy/blob/main/docs/README.md", "Happy architecture documentation", "End-to-end encryption is documented for session content; do not generalize the claim to every stored credential.", "source-inspected"),
    "remote-native-ios": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party iOS app.", "repository-derived"),
    "remote-native-android": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party Android app.", "repository-derived"),
    "remote-browser-pwa": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party web app.", "repository-derived"),
    "remote-supported-harnesses": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Explicit wrappers for Claude Code and Codex.", "repository-derived"),
    "remote-terminal-input": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Switch control between phone and desktop; remote mode steers the wrapped session.", "repository-derived"),
    "remote-notifications": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Push alerts for permission requests and errors.", "repository-derived"),
    "remote-hosting-boundary": capability("limited", "https://github.com/slopus/happy/blob/main/docs/README.md", "Happy architecture documentation", "Encrypted session sync uses the Happy Server relay. The claim is scoped to session content, not every stored credential.", "source-inspected"),
    "remote-session-history": capability("built-in", "https://github.com/slopus/happy/blob/main/packages/happy-agent/README.md", "Happy agent CLI", "The CLI exposes encrypted chronological message history per session, with bounded and JSON output.", "source-inspected"),
    "remote-agent-aware": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Happy wraps Claude Code and Codex sessions and understands permission requests and errors.", "repository-derived"),
    "remote-input-model": factClaim("Follow-ups, terminal control, and approve/deny", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Existing session on paired machine", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Hosted encrypted sync relay; self-hostable server", "https://github.com/slopus/happy-server", "Happy Server repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("End-to-end encrypted session content", "https://github.com/slopus/happy-server", "Happy Server security model", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Survives client disconnect while host session runs", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
  } }),
  product({
    id: "happier", name: "Happier", categoryId: "remote-companions", editorialOrder: 2, officialUrl: "https://happier.dev/", repository: repo("happier-dev/happier"), repoMetricId: "happier",
    tags: ["mobile", "desktop", "web", "multi-harness", "existing-sessions", "notifications", "e2e-encryption", "self-hosted", "oss", "alpha"],
    platform: ["macos", "windows", "linux", "web", "ios", "android"], platformNote: "Happier combines a cross-platform host CLI with mobile, browser, and desktop clients.",
    platformSource: { url: "https://github.com/happier-dev/happier#installation", title: "Happier installation guide" },
    source: "open-source", execution: ["local-daemon", "paired-machine", "vendor-cloud", "user-cloud"], status: "beta",
    claims: {
      ...builtInClaims("https://github.com/happier-dev/happier#key-features", "Happier key features", ["remote-client-reach", "remote-existing-session", "remote-approvals", "remote-encryption", "remote-native-ios", "remote-native-android", "remote-browser-pwa", "remote-supported-harnesses", "remote-terminal-input", "remote-notifications", "remote-hosting-boundary", "remote-session-history", "remote-agent-aware"], undefined, "repository-derived"),
      "remote-input-model": factClaim("Agent messages, approvals, steering, and embedded terminal input", "https://github.com/happier-dev/happier#key-features", "Happier key features", undefined, "repository-derived"),
      "remote-host-ownership": factClaim("Existing or Happier-launched session on a connected machine", "https://github.com/happier-dev/happier#key-features", "Happier key features", undefined, "repository-derived"),
      "remote-relay-deployment": factClaim("Happier Cloud or self-hosted relay", "https://github.com/happier-dev/happier#key-features", "Happier key features", undefined, "repository-derived"),
      "remote-transport-security": factClaim("End-to-end encrypted by default; configurable self-hosted storage policy", "https://github.com/happier-dev/happier#key-features", "Happier key features", undefined, "repository-derived"),
      "remote-session-durability": factClaim("Persistent host sessions with restart resume and tmux-backed terminal resume", "https://github.com/happier-dev/happier#key-features", "Happier key features", undefined, "repository-derived"),
    },
  }),
  product({ id: "vibetunnel", name: "VibeTunnel", categoryId: "remote-companions", editorialOrder: 3, officialUrl: "https://github.com/amantus-ai/vibetunnel", repository: repo("amantus-ai/vibetunnel"), repoMetricId: "vibetunnel", tags: ["browser-terminal", "mobile-web", "server-owned-pty", "oss"], platform: ["macos", "web"], source: "open-source", execution: ["local-daemon", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", ["remote-client-reach", "remote-existing-session"], undefined, "repository-derived"),
    "remote-native-ios": capability("limited", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Native iOS app is work in progress and not recommended for production.", "repository-derived"),
    "remote-browser-pwa": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Responsive browser interface works from phones and tablets.", "repository-derived"),
    "remote-supported-harnesses": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Wraps any terminal command; the README explicitly positions it for terminal AI agents.", "repository-derived"),
    "remote-terminal-input": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "vt forwards interactive shells and arbitrary commands to the browser.", "repository-derived"),
    "remote-hosting-boundary": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Local server with documented Tailscale, ngrok, LAN, and Cloudflare tunnel options; multiple authentication modes.", "repository-derived"),
    "remote-session-history": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Sessions are recorded in asciinema format for later playback.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Designed for terminal agents but streams a generic PTY rather than normalized agent tool state.", "repository-derived"),
    "remote-input-model": factClaim("Raw interactive terminal input", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Local command or PTY on host Mac", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("LAN, SSH/VPN, or user-supplied tunnel", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Deployment-dependent", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Tailscale, SSH, and tunnel options are documented; product-level E2EE is not established.", "repository-derived"),
    "remote-session-durability": factClaim("Browser reconnect + recorded PTY; host process must remain", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", undefined, "repository-derived"),
  } }),
  product({ id: "omnara", name: "Omnara", categoryId: "remote-companions", editorialOrder: 4, officialUrl: "https://github.com/omnara-ai/omnara", repository: repo("omnara-ai/omnara", "deprecated-predecessor"), tags: ["web", "mobile", "durable-agent-api", "pivoted", "oss"], source: "open-source", execution: ["vendor-cloud"], status: "pivoted" }),
  product({ id: "shunt", name: "Shunt", categoryId: "remote-companions", editorialOrder: 5, officialUrl: "https://shunt.app/", tags: ["remote-tmux", "permissions", "mobile"], platform: ["macos", "linux", "web", "ios"], platformNote: "macOS and Linux daemon; embedded web/PWA client; native iOS client is preview/TestFlight.", source: "unknown", execution: ["paired-machine"], status: "active", claims: {
    ...builtInClaims("https://shunt.app/", "Shunt product documentation", ["remote-client-reach", "remote-existing-session", "remote-approvals"]),
    "remote-native-ios": capability("limited", "https://shunt.app/", "Shunt product documentation", "Native SwiftUI client is distributed through TestFlight in the documented initial release."),
    "remote-browser-pwa": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Embedded web client plus standalone mobile and iPad PWA support."),
    "remote-supported-harnesses": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Detects Claude Code, Codex, Aider, Goose, and OpenCode in tmux sessions."),
    "remote-terminal-input": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Direct browser input including Tab, Escape, Ctrl+C, arrows, and prompts."),
    "remote-notifications": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Unread activity badges and approval-state attention indicators in web and iOS clients."),
    "remote-session-history": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Existing tmux sessions remain the durable session owner; prompt history and per-window drafts persist in the client."),
    "remote-agent-aware": capability("built-in", "https://shunt.app/", "Shunt product documentation", "Detects named coding harnesses and exposes Claude Code approve/deny state."),
    "remote-input-model": factClaim("Terminal input, prompts, and structured approve/deny", "https://shunt.app/", "Shunt product documentation"),
    "remote-host-ownership": factClaim("Existing tmux session on paired machine", "https://shunt.app/", "Shunt product documentation"),
    "remote-session-durability": factClaim("Owned by tmux; survives browser and client exit", "https://shunt.app/", "Shunt product documentation"),
  } }),
  product({ id: "claude-code-remote-control", name: "Claude Code Remote Control", categoryId: "remote-companions", editorialOrder: 6, officialUrl: "https://code.claude.com/docs/en/remote-control", tags: ["claude-code", "browser", "mobile", "approvals", "research-preview"], platform: ["web", "ios", "android"], source: "proprietary", execution: ["paired-machine", "vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", ["remote-client-reach", "remote-existing-session", "remote-approvals", "remote-native-ios", "remote-native-android", "remote-browser-pwa", "remote-supported-harnesses", "remote-notifications", "remote-agent-aware"]),
    "remote-encryption": capability("limited", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "TLS and scoped credentials are documented; end-to-end or zero-knowledge encryption is not claimed."),
    "remote-terminal-input": capability("limited", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "Remote Control sends Claude Code follow-ups and approvals rather than exposing an arbitrary raw terminal."),
    "remote-hosting-boundary": capability("built-in", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "The local CLI makes outbound HTTPS connections through Anthropic services; no inbound port is required."),
    "remote-session-history": capability("built-in", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "Remote Control carries over current conversation history and exposes named sessions through claude.ai/code and the mobile session list."),
    "remote-input-model": factClaim("Follow-ups and structured approvals", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-host-ownership": factClaim("Existing local CLI or VS Code session", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-relay-deployment": factClaim("Anthropic-hosted relay", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-transport-security": factClaim("Outbound HTTPS with scoped credentials", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-session-durability": factClaim("Survives remote client disconnect; local session must remain", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
  } }),
  product({ id: "code-server", name: "code-server", categoryId: "remote-companions", editorialOrder: 7, officialUrl: "https://github.com/coder/code-server", repository: repo("coder/code-server"), repoMetricId: "code-server", tags: ["browser-ide", "self-hosted", "vscode-compatible", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/coder/code-server", "code-server repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", "Reconnects to a server-owned editor workspace, not an agent conversation.", "source-inspected"),
    "remote-agent-aware": capability("limited", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", "This baseline exposes a remote VS Code-compatible workspace rather than a normalized agent-session protocol.", "source-inspected"),
    "remote-input-model": factClaim("Full browser IDE, terminal, and file editing", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Self-hosted remote editor workspace", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted server; user supplies proxy/VPN", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", undefined, "source-inspected"),
    "remote-transport-security": factClaim("Deployment-dependent TLS or secure tunnel", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Server workspace survives browser close", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
  } }),
  product({ id: "openvscode-server", name: "OpenVSCode Server", categoryId: "remote-companions", editorialOrder: 8, officialUrl: "https://github.com/gitpod-io/openvscode-server", repository: repo("gitpod-io/openvscode-server"), repoMetricId: "openvscode-server", tags: ["browser-ide", "self-hosted", "code-oss", "oss"], platform: ["linux", "web"], source: "open-source", execution: ["local-daemon", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", "Reconnects to a server-owned Code OSS workspace, not an agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", "This baseline exposes Code OSS in a browser rather than a normalized agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Full browser IDE, terminal, and file editing", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Self-hosted Code OSS server", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted server", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Deployment-dependent", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Server workspace survives browser close", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
  } }),
  product({ id: "vscode-remote-development", name: "VS Code Remote Development extensions", categoryId: "remote-companions", editorialOrder: 9, officialUrl: "https://code.visualstudio.com/docs/remote/remote-overview", tags: ["vscode", "ssh", "containers", "wsl", "tunnels"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["ssh-host", "container", "user-cloud"], status: "active", claims: {
    "remote-existing-session": capability("limited", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", "Connects to a remote development workspace, not an agent conversation."),
    "remote-client-reach": capability("built-in", "https://code.visualstudio.com/docs/remote/tunnels", "VS Code Remote Tunnels", "Connects from VS Code desktop or from a vscode.dev URL on a client of the operator's choosing."),
    "remote-browser-pwa": capability("built-in", "https://code.visualstudio.com/docs/remote/tunnels", "VS Code Remote Tunnels", "The official tunnel workflow emits a vscode.dev browser URL with the Remote Tunnels extension preinstalled."),
    ...builtInClaims("https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", ["remote-terminal-input", "remote-hosting-boundary"]),
    "remote-agent-aware": capability("limited", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", "The suite moves the editor extension host and terminal rather than defining a normalized agent-session protocol."),
    "remote-input-model": factClaim("Full desktop IDE, terminal, and file editing", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-host-ownership": factClaim("SSH host, container, WSL, or tunnel workspace", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-relay-deployment": factClaim("SSH, container transport, WSL, or VS Code tunnel", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-transport-security": factClaim("Selected transport", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-session-durability": factClaim("Remote workspace persists; IDE connection can reconnect", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
  } }),
  product({ id: "sshx", name: "sshx", categoryId: "remote-companions", editorialOrder: 10, officialUrl: "https://github.com/ekzhang/sshx", repository: repo("ekzhang/sshx"), repoMetricId: "sshx", tags: ["collaborative-terminal", "browser", "e2e-encryption", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "paired-machine", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/ekzhang/sshx", "sshx repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-encryption"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/ekzhang/sshx", "sshx repository", "Shares the command launched under sshx rather than attaching to any arbitrary existing agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/ekzhang/sshx", "sshx repository", "sshx is a generic collaborative terminal rather than a normalized agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Raw collaborative terminal input", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Command launched on paired host", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
    "remote-hosting-boundary": capability("built-in", "https://github.com/ekzhang/sshx", "sshx repository", "Uses a hosted coordination relay while terminal content remains protected by client-side Argon2-derived AES end-to-end encryption.", "repository-derived"),
    "remote-relay-deployment": factClaim("Hosted relay", "https://github.com/ekzhang/sshx", "sshx repository", "Development self-hosting is not packaged as a supported deployment.", "repository-derived"),
    "remote-transport-security": factClaim("Argon2-derived AES end-to-end encryption", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Host command must remain running", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
  } }),
  product({ id: "upterm", name: "Upterm", categoryId: "remote-companions", editorialOrder: 11, officialUrl: "https://github.com/owenthereal/upterm", repository: repo("owenthereal/upterm"), repoMetricId: "upterm", tags: ["ssh", "terminal-sharing", "self-hosted-relay", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-daemon", "paired-machine", "vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/owenthereal/upterm", "Upterm repository", ["remote-client-reach", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/owenthereal/upterm", "Upterm repository", "Hosts a command or tmux attachment; it is not an agent-session protocol.", "repository-derived"),
    "remote-encryption": capability("limited", "https://github.com/owenthereal/upterm", "Upterm repository", "SSH transport is documented, not a zero-knowledge relay claim.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/owenthereal/upterm", "Upterm repository", "Upterm is a generic terminal-sharing service rather than an agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("SSH terminal input", "https://github.com/owenthereal/upterm", "Upterm repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Hosted command or tmux attachment", "https://github.com/owenthereal/upterm", "Upterm repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Hosted or self-hosted uptermd relay", "https://github.com/owenthereal/upterm", "Upterm repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("SSH transport", "https://github.com/owenthereal/upterm", "Upterm repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Host command or tmux attachment must remain", "https://github.com/owenthereal/upterm", "Upterm repository", undefined, "repository-derived"),
  } }),
  product({ id: "termix", name: "Termix", categoryId: "remote-companions", editorialOrder: 12, officialUrl: "https://github.com/Termix-SSH/Termix", repository: repo("Termix-SSH/Termix"), repoMetricId: "termix", tags: ["ssh", "rdp", "vnc", "web", "desktop", "mobile", "self-hosted", "oss"], platform: ["macos", "windows", "linux", "web", "ios", "android"], source: "open-source", execution: ["local-daemon", "user-cloud", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/Termix-SSH/Termix", "Termix repository", ["remote-client-reach", "remote-existing-session", "remote-native-ios", "remote-native-android", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary", "remote-session-history"], undefined, "repository-derived"),
    "remote-approvals": capability("limited", "https://github.com/Termix-SSH/Termix", "Termix repository", "The optional AI Assistant proposes infrastructure changes for explicit user approval instead of applying them directly; this does not establish approvals for arbitrary external harnesses.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/Termix-SSH/Termix", "Termix repository", "Termix manages generic SSH, RDP, VNC, and Telnet sessions rather than a normalized coding-agent protocol.", "repository-derived"),
    "remote-input-model": factClaim("SSH terminal and remote desktop input", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Remote SSH/RDP/VNC/Telnet host", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-notifications": capability("built-in", "https://github.com/Termix-SSH/Termix", "Termix repository", "Alert and automation rules notify operators through ntfy, Discord, and webhooks, with firing and resolved history.", "repository-derived"),
    "remote-relay-deployment": factClaim("Self-hosted Termix service", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Protocol and deployment-dependent", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Saved connection and shared-session history", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
  } }),
  product({ id: "ttyd", name: "ttyd", categoryId: "remote-companions", editorialOrder: 13, officialUrl: "https://github.com/tsl0922/ttyd", repository: repo("tsl0922/ttyd"), repoMetricId: "ttyd", tags: ["browser-terminal", "websocket", "minimal-relay", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/tsl0922/ttyd", "ttyd repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/tsl0922/ttyd", "ttyd repository", "Shares the command or PTY launched by ttyd, not a normalized existing agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/tsl0922/ttyd", "ttyd repository", "ttyd is a generic terminal-to-WebSocket bridge rather than an agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Raw browser terminal input", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Command or PTY on self-hosted machine", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted WebSocket service", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Deployment-dependent TLS", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Host command must remain running", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
  } }),
  product({ id: "sshhip", name: "SSHHIP", categoryId: "remote-companions", editorialOrder: 14, officialUrl: "https://sshhip.com/", tags: ["ssh", "ios", "ipad", "tmux", "sftp", "direct-connection"], platform: ["ios"], platformNote: "SSHHIP is a native iPhone and iPad SSH client.", platformSource: { url: "https://apps.apple.com/us/app/sshhip/id6785186457", title: "SSHHIP on the App Store" }, source: "proprietary", execution: ["paired-machine"], status: "active", claims: {
    "remote-client-reach": capability("built-in", "https://sshhip.com/", "SSHHIP", "The native iOS client connects directly to operator-owned SSH hosts."),
    "remote-existing-session": capability("built-in", "https://sshhip.com/tmux/", "SSHHIP tmux guide", "SSHHIP attaches to existing tmux sessions and documents reconnecting to persistent coding-agent work."),
    "remote-encryption": capability("limited", "https://sshhip.com/", "SSHHIP", "Transport uses direct SSH encryption; end-to-end application-layer encryption beyond SSH is not documented."),
    "remote-native-ios": capability("built-in", "https://apps.apple.com/us/app/sshhip/id6785186457", "SSHHIP on the App Store", "A native iPhone and iPad application is published in the App Store."),
    "remote-terminal-input": capability("built-in", "https://sshhip.com/", "SSHHIP", "Command Dial, keyboard input, terminal gestures, and arbitrary CLI/TUI use are documented."),
    "remote-hosting-boundary": capability("built-in", "https://sshhip.com/", "SSHHIP", "The product connects directly to the user's SSH server without a vendor account or relay."),
    "remote-supported-harnesses": factClaim("Any CLI or TUI reachable over SSH", "https://sshhip.com/guides/", "SSHHIP guides", "First-party guides cover Claude Code and generic terminal workflows."),
    "remote-notifications": capability("not-available", "https://sshhip.com/guides/claude-code-remote-control-vs-ssh/", "Claude Code Remote Control versus SSH", "The first-party comparison explicitly says SSHHIP does not provide push notifications."),
    "remote-input-model": factClaim("Native SSH terminal, Command Dial, and SFTP image insertion", "https://sshhip.com/guides/claude-code-from-iphone/", "Claude Code from iPhone with SSHHIP"),
    "remote-host-ownership": factClaim("Operator-owned SSH host", "https://sshhip.com/", "SSHHIP"),
    "remote-relay-deployment": factClaim("No vendor relay; direct SSH", "https://sshhip.com/", "SSHHIP"),
    "remote-transport-security": factClaim("SSH transport security", "https://sshhip.com/", "SSHHIP"),
    "remote-session-durability": factClaim("Provided by tmux or herdr on the host", "https://sshhip.com/tmux/", "SSHHIP tmux guide"),
  } }),

  // 9. Agent traces
  product({ id: "specstory", name: "SpecStory", categoryId: "agent-traces", editorialOrder: 1, officialUrl: "https://docs.specstory.com/", repository: repo("specstoryai/getspecstory", "source-tree"), repoMetricId: "specstory", tags: ["local-first", "markdown", "cloud-search", "cross-agent-resume", "redaction", "oss-cli", "specstory"], platform: ["macos", "windows", "linux", "web"], platformNote: "The SpecStory CLI and extensions run on macOS, Windows, and Linux; SpecStory Cloud is a browser service.", platformSource: { url: "https://docs.specstory.com/faqs", title: "SpecStory FAQs and platform paths" }, source: "split-source", execution: ["local-process", "host-ide-process", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("CLI and IDE capture across Claude, Codex, Cursor, Droid, Antigravity, DeepSeek, and Copilot", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-storage-boundary": factClaim("Local Markdown by default; optional SpecStory Cloud sync", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-git-linkage": capability("limited", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "History lives inside the project as versionable Markdown, but automatic commit, branch, or worktree linkage is not established."),
    "trace-replay-resume": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "The CLI can resume across projects and supported agents from its local session index."),
    "trace-search-timeline": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "Local cross-project and cross-agent search plus optional Cloud search."),
    "trace-multi-harness": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "The current docs name Claude Code, Cursor CLI and IDE, Codex CLI, Droid, Antigravity, DeepSeek, and Copilot capture paths."),
    "trace-transcript-coverage": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "Prompts, responses, commands, and decisions are rendered as searchable Markdown."),
    "trace-tool-call-coverage": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "Captured Markdown includes terminal-agent commands and outputs when present in the source session."),
    "trace-artifact-coverage": capability("limited", "https://docs.specstory.com/specstory/features", "SpecStory features", "Saved conversations preserve code blocks and diffs; an independent normalized workspace-artifact model is not established."),
    "trace-export-api": factClaim("Markdown, stdout/JSON CLI output, and Cloud API", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-redaction-privacy": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "Local-first capture, explicit cloud opt-in, configurable secret redaction, and analytics opt-out are documented."),
    "trace-sharing": capability("built-in", "https://docs.specstory.com/cloud/session-sharing", "SpecStory session sharing", "Individual sessions can be shared explicitly; local Markdown can also travel through normal repository review."),
    "trace-ci-analytics": capability("limited", "https://docs.specstory.com/cloud/analytics", "SpecStory Cloud Analytics", "Cross-agent activity, project, duration, concurrency, message, token, and cost analytics are built in; CI-specific and shared-team reporting are not established."),
    "trace-self-hosting": capability("limited", "https://docs.specstory.com/cloud/quickstart", "SpecStory Cloud quickstart", "Local capture and search are operator-owned; self-hosting SpecStory Cloud is not documented."),
  } }),
  product({ id: "entire", name: "Entire", categoryId: "agent-traces", editorialOrder: 2, officialUrl: "https://entire.io/", repository: repo("entireio/cli"), repoMetricId: "entire", tags: ["git-native", "checkpoints", "rewind", "cross-agent", "redaction", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "The CLI documents Homebrew/install.sh and Scoop distribution plus native OS keyrings; the optional dashboard is browser-based.", platformSource: { url: "https://github.com/entireio/cli", title: "Entire CLI repository and install matrix" }, source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Lifecycle hooks for built-in and external coding-agent adapters", "https://github.com/entireio/cli", "Entire CLI repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Git refs or checkpoint branch in the repository", "https://github.com/entireio/cli/blob/main/docs/architecture/sessions-and-checkpoints.md", "Entire sessions and checkpoints architecture", "Active state stays under .git; persistent checkpoints use a dedicated branch or refs.", "source-inspected"),
    "trace-git-linkage": capability("built-in", "https://github.com/entireio/cli/blob/main/docs/architecture/sessions-and-checkpoints.md", "Entire sessions and checkpoints architecture", "Checkpoints bind session metadata and code state to commits, branches, and independent worktrees.", "source-inspected"),
    "trace-replay-resume": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Rewind restores a checkpoint and session resume restores work on a branch.", "repository-derived"),
    "trace-search-timeline": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Checkpoint search and explain commands inspect the recorded history.", "repository-derived"),
    "trace-multi-harness": capability("built-in", "https://github.com/entireio/cli/blob/main/docs/architecture/sessions-and-checkpoints.md", "Entire sessions and checkpoints architecture", "Current architecture names Claude Code, Codex, Gemini CLI, OpenCode, Cursor, Droid, and Copilot CLI.", "source-inspected"),
    "trace-transcript-coverage": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Sessions capture prompts, responses, timestamps, and the full transcript.", "repository-derived"),
    "trace-tool-call-coverage": capability("built-in", "https://entire.io/", "Entire product page", "The first-party product page explicitly includes tool calls in the repository-backed session record."),
    "trace-artifact-coverage": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Checkpoints retain file changes, files touched, and code state alongside session metadata.", "repository-derived"),
    "trace-export-api": capability("built-in", "https://github.com/entireio/cli/blob/main/CHANGELOG.md", "Entire CLI changelog", "Current releases document the authenticated entire api passthrough and machine-readable checkpoint listing.", "source-inspected"),
    "trace-redaction-privacy": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Detected secrets are redacted before persistent checkpoint storage; the project describes this as best-effort.", "repository-derived"),
    "trace-sharing": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Checkpoint refs can use the code remote or a separate private checkpoint repository.", "repository-derived"),
    "trace-ci-analytics": capability("limited", "https://github.com/entireio", "Entire GitHub organization overview", "The dashboard browses activity across repositories; a dedicated CI analytics contract is not established.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://entire.io/", "Entire product page", "Core checkpoint capture and storage are open-source, local, and repository-backed."),
  } }),
  product({ id: "tapes", name: "Tapes", categoryId: "agent-traces", editorialOrder: 3, officialUrl: "https://tapes.dev/docs/introduction/", repository: repo("papercomputeco/tapes"), repoMetricId: "tapes", tags: ["opentelemetry", "append-only", "postgresql", "semantic-search", "export", "self-hosted", "oss", "paper-compute"], platform: ["macos", "linux"], platformNote: "The current first-party installer explicitly supports Darwin/macOS and Linux on x86_64 and arm64; current Windows support is not established.", platformSource: { url: "https://raw.githubusercontent.com/papercomputeco/tapes/main/install.sh", title: "Tapes installer" }, source: "open-source", execution: ["local-daemon", "container", "user-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Transparent provider proxy, transcript sync, and harness plugins", "https://tapes.dev/docs/integrations/", "Tapes agent integrations"),
    "trace-storage-boundary": factClaim("Operator-owned PostgreSQL append-only raw-turn log", "https://github.com/papercomputeco/tapes", "Tapes repository", undefined, "repository-derived"),
    "trace-search-timeline": capability("built-in", "https://tapes.dev/docs/introduction/", "Tapes introduction", "Sessions, traces, and spans are browsable and previous work is searchable by meaning."),
    "trace-multi-harness": capability("built-in", "https://tapes.dev/docs/integrations/", "Tapes agent integrations", "Documented lanes cover Claude Code, Codex CLI, Codex desktop, Pi, and generic compatible clients."),
    "trace-transcript-coverage": capability("built-in", "https://tapes.dev/docs/integrations/", "Tapes agent integrations", "Transcript lanes augment wire capture for clients whose local records contain additional structure."),
    "trace-tool-call-coverage": capability("built-in", "https://github.com/papercomputeco/tapes", "Tapes repository", "Original request and response data remains available through immutable raw turns and derived spans.", "repository-derived"),
    "trace-export-api": capability("built-in", "https://tapes.dev/docs/tapesctl/commands/", "Tapes client command reference", "The client exports session trace/span bundles as JSONL and reads the documented HTTP API."),
    "trace-ci-analytics": capability("limited", "https://github.com/papercomputeco/tapes", "Tapes repository", "Span-grain statistics, tokens, and costs are built in; team- or CI-specific reporting is not established.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://tapes.dev/docs/installation/", "Tapes installation and local setup", "The server, PostgreSQL storage, proxy, API, and derive worker run in the operator's environment."),
  } }),
  product({ id: "traces-com", name: "Traces", categoryId: "agent-traces", editorialOrder: 4, officialUrl: "https://traces.com/docs", tags: ["hosted", "sharing", "git-notes", "teams", "api", "redaction", "mcp"], platform: ["macos", "windows", "linux", "web"], platformNote: "The CLI has native macOS, Linux, and Windows distributions; shared traces and team namespaces have a browser client.", platformSource: { url: "https://traces.com/docs/getting-started/installation", title: "Traces installation and system requirements" }, source: "hosted-service", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Local discovery, agent lifecycle hooks, skills, Git hooks, and ingestion API", "https://traces.com/docs", "Traces documentation"),
    "trace-storage-boundary": factClaim("Local SQLite discovery cache plus hosted namespaces", "https://traces.com/docs/cli/troubleshooting", "Traces CLI troubleshooting"),
    "trace-git-linkage": capability("built-in", "https://traces.com/docs/sharing/git-hooks", "Traces Git hook sharing", "Post-commit hooks record repo, branch, and commit refs and attach trace IDs through Git notes."),
    "trace-replay-resume": capability("limited", "https://traces.com/docs/cli/commands", "Traces CLI command reference", "Exact native-session resume is currently macOS-only; other records return continuation guidance."),
    "trace-search-timeline": capability("built-in", "https://traces.com/docs/cli/commands", "Traces CLI command reference", "Local metadata and event search supports trace- or event-level results and bounded timeline windows."),
    "trace-multi-harness": capability("built-in", "https://traces.com/docs", "Traces documentation", "Current compatibility includes Claude Code, Cursor, OpenCode, Codex, Pi, Amp, Copilot, Cline, and OpenClaw."),
    "trace-transcript-coverage": capability("built-in", "https://traces.com/docs/getting-started", "Traces getting started", "Native JSONL, SQLite, and JSON records are normalized into unified messages and typed parts."),
    "trace-tool-call-coverage": capability("built-in", "https://traces.com/docs/traces-web/exports", "Traces data export", "Exports retain message parts including tool calls and thinking blocks."),
    "trace-export-api": capability("built-in", "https://traces.com/docs/api-reference", "Traces ingestion API", "Namespace-scoped ingestion APIs and JSONL namespace exports are documented."),
    "trace-redaction-privacy": capability("built-in", "https://traces.com/", "Traces product page", "Private/direct/public visibility and automatic sensitive-data scrubbing on publish are documented."),
    "trace-sharing": capability("built-in", "https://traces.com/docs", "Traces documentation", "Share links, team namespaces, organizations, API keys, and an MCP reader are first-class workflows."),
    "trace-ci-analytics": capability("built-in", "https://traces.com/", "Traces product page", "Git-hook and API publishing from CI plus team analytics are shown as product capabilities."),
    "trace-self-hosting": capability("limited", "https://traces.com/", "Traces product page", "Self-hosting and on-premises deployment are listed for custom enterprise plans rather than the standard hosted product."),
  } }),
  product({ id: "agentsview", name: "AgentsView", categoryId: "agent-traces", editorialOrder: 5, officialUrl: "https://www.agentsview.io/", repository: repo("kenn-io/agentsview"), repoMetricId: "agentsview", tags: ["local-first", "sqlite", "analytics", "multi-agent", "full-text-search", "semantic-search", "desktop", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "The CLI supports macOS, Windows, and Linux; desktop packages cover macOS, Windows, and Linux, and the local daemon serves a browser UI.", platformSource: { url: "https://github.com/kenn-io/agentsview", title: "AgentsView repository and install matrix" }, source: "open-source", execution: ["local-daemon", "user-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Direct parsers for local agent session stores plus S3-compatible roots", "https://github.com/kenn-io/agentsview", "AgentsView repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Local SQLite by default; optional PostgreSQL, DuckDB, and S3-compatible inputs", "https://github.com/kenn-io/agentsview", "AgentsView repository", undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Repository, branch, and worktree context are recorded and filterable; automatic commit-to-session linkage is not established.", "source-inspected"),
    "trace-replay-resume": capability("limited", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Full session trees can be exported as handoff context and Claude sessions can be forked; general native replay across harnesses is not established.", "source-inspected"),
    "trace-search-timeline": capability("built-in", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Full-text, semantic, and hybrid search span normalized messages, tool inputs, and tool results.", "source-inspected"),
    "trace-multi-harness": capability("built-in", "https://github.com/kenn-io/agentsview", "AgentsView repository", "One local archive ingests a broad documented set of coding-agent session formats.", "repository-derived"),
    "trace-transcript-coverage": capability("built-in", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "User, assistant, thinking, code, parent, and subagent transcript structures are rendered.", "source-inspected"),
    "trace-tool-call-coverage": capability("built-in", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Normalized tool calls, inputs, outputs, durations, failures, and subagent links are first-class views.", "source-inspected"),
    "trace-artifact-coverage": capability("limited", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Patch-bearing tool calls render as diffs when the source transcript exposes them; independent workspace artifacts are not claimed.", "source-inspected"),
    "trace-export-api": capability("built-in", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Markdown, CSV, JSON CLI contracts, and a local HTTP API are documented.", "source-inspected"),
    "trace-redaction-privacy": capability("limited", "https://github.com/kenn-io/agentsview", "AgentsView repository", "Session data stays local and the server binds to loopback by default; automatic content redaction is not established.", "repository-derived"),
    "trace-sharing": capability("built-in", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Sessions can be published to public or secret GitHub Gists.", "source-inspected"),
    "trace-ci-analytics": capability("limited", "https://github.com/kenn-io/agentsview/blob/main/docs/usage.md", "AgentsView usage guide", "Rich local usage, cost, performance, health, agent, and project analytics are built in; dedicated CI reporting is not established.", "source-inspected"),
    "trace-self-hosting": capability("built-in", "https://github.com/kenn-io/agentsview", "AgentsView repository", "The binary, local daemon, browser UI, Docker image, and optional shared backends are operator-deployed.", "repository-derived"),
  } }),
  product({ id: "claude-code-history-viewer", name: "Claude Code History Viewer", categoryId: "agent-traces", editorialOrder: 6, officialUrl: "https://jhlee0409.github.io/claude-code-history-viewer/", repository: repo("jhlee0409/claude-code-history-viewer"), repoMetricId: "claude-code-history-viewer", tags: ["local-first", "desktop", "web-ui", "multi-agent", "analytics", "export", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Desktop releases cover macOS, Windows, and Linux; the headless server exposes a browser UI.", platformSource: { url: "https://github.com/jhlee0409/claude-code-history-viewer", title: "Claude Code History Viewer repository" }, source: "open-source", execution: ["local-process", "local-daemon", "user-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Read-only discovery of 29 documented coding-assistant session stores", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Local source files and local application indexes; optional operator-hosted WebUI", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Projects and worktrees are grouped, but automatic commit-to-session linkage is not established.", "repository-derived"),
    "trace-replay-resume": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "The viewer reconstructs split and subagent histories and provides native resume commands for supported providers.", "repository-derived"),
    "trace-search-timeline": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Global and in-session search, activity timelines, and live file watching are documented.", "repository-derived"),
    "trace-multi-harness": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "The current support table names 29 coding-assistant sources.", "repository-derived"),
    "trace-transcript-coverage": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Conversation, thinking, subagent, and compacted-history structures are rendered where present.", "repository-derived"),
    "trace-tool-call-coverage": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Provider readers expose tool calls and results where their source formats retain them.", "repository-derived"),
    "trace-artifact-coverage": capability("limited", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Recent edits and image-bearing session content are inspectable for supported sources; a uniform cross-provider artifact model is not established.", "repository-derived"),
    "trace-export-api": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Headless HTML and JSON session export are documented.", "repository-derived"),
    "trace-redaction-privacy": capability("limited", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Desktop use is offline and reads local files; automatic content redaction is not established.", "repository-derived"),
    "trace-sharing": capability("limited", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "The self-hosted WebUI supports deep links, but a product collaboration workflow is not established.", "repository-derived"),
    "trace-ci-analytics": capability("limited", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "Local token, cost, provider, skill, and subagent analytics are built in; CI or team reporting is not established.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://github.com/jhlee0409/claude-code-history-viewer", "Claude Code History Viewer repository", "The complete desktop product and authenticated headless server, including Docker deployment, are operator-run.", "repository-derived"),
  } }),
  product({ id: "agent-sessions", name: "Agent Sessions", categoryId: "agent-traces", editorialOrder: 7, officialUrl: "https://jazzyalex.github.io/agent-sessions/", repository: repo("jazzyalex/agent-sessions"), repoMetricId: "agent-sessions", tags: ["local-first", "macos", "multi-agent", "resume", "analytics", "oss"], platform: ["macos"], platformNote: "The native desktop application requires macOS 14 or later.", platformSource: { url: "https://github.com/jazzyalex/agent-sessions", title: "Agent Sessions repository" }, source: "open-source", execution: ["local-process"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Read-only adapters for 15 documented local coding-agent histories", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Local source histories and local-only indexes on macOS", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Project context is retained, but commit, branch, or worktree binding is not established.", "repository-derived"),
    "trace-replay-resume": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "The app restores saved histories and emits or launches exact resume commands for supported CLIs.", "repository-derived"),
    "trace-search-timeline": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Unified cross-session search, in-session find, filters, and transcript navigation are documented.", "repository-derived"),
    "trace-multi-harness": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Fifteen local coding-agent sources share one adapter-driven archive.", "repository-derived"),
    "trace-transcript-coverage": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Agent replies, reasoning, compactions, and source-specific nested structures are rendered where documented.", "repository-derived"),
    "trace-tool-call-coverage": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Readable tool calls, inputs, outputs, and errors are first-class transcript navigation targets.", "repository-derived"),
    "trace-artifact-coverage": capability("limited", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "The image browser extracts session images where supported; general workspace artifacts and diffs are not established.", "repository-derived"),
    "trace-redaction-privacy": capability("limited", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "The app is local-only, read-only over source histories, and has no telemetry; automatic content redaction is not established.", "repository-derived"),
    "trace-ci-analytics": capability("limited", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "Per-session quota, token, model, and cost analytics are built in; CI or shared-team reporting is not established.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://github.com/jazzyalex/agent-sessions", "Agent Sessions repository", "The complete application and index run locally with no hosted service dependency.", "repository-derived"),
  } }),
  product({ id: "git-ai", name: "Git AI", categoryId: "agent-traces", editorialOrder: 8, officialUrl: "https://github.com/git-ai-project/git-ai", repository: repo("git-ai-project/git-ai"), repoMetricId: "git-ai", tags: ["git-notes", "attribution", "local-first", "analytics", "open-standard", "oss"], platform: ["macos", "linux", "windows"], platformNote: "The canonical README documents macOS, Linux, and Windows through WSL; native Windows support is experimental.", platformSource: { url: "https://github.com/git-ai-project/git-ai", title: "Git AI repository" }, source: "open-source", execution: ["local-process"], status: "active", claims: {
    "trace-capture-coverage": factClaim("Git hooks and integrations capture AI-authored code from supported coding agents", "https://github.com/git-ai-project/git-ai", "Git AI repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Local Git Notes plus a local SQLite event store; optional hosted or self-hosted sharing", "https://github.com/git-ai-project/git-ai", "Git AI repository", undefined, "repository-derived"),
    "trace-git-linkage": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "AI attribution is linked to commits and lines through Git Notes and survives common Git history rewrites.", "repository-derived"),
    "trace-replay-resume": capability("limited", "https://github.com/git-ai-project/git-ai", "Git AI repository", "The event log preserves prompts and tool activity, but relaunching an agent session from the trace is not established.", "repository-derived"),
    "trace-search-timeline": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "Local stats and event inspection expose attribution, prompts, tool calls, token use, cost, and acceptance rates.", "repository-derived"),
    "trace-multi-harness": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "The first-party integration list covers multiple editors and command-line coding agents.", "repository-derived"),
    "trace-transcript-coverage": capability("limited", "https://github.com/git-ai-project/git-ai", "Git AI repository", "Prompt and event data are captured for supported integrations; a complete normalized assistant transcript is not promised.", "repository-derived"),
    "trace-tool-call-coverage": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "The local event format records tool calls, timing, tokens, and cost where the integration supplies them.", "repository-derived"),
    "trace-artifact-coverage": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "Line-level AI authorship and accepted or rejected code changes are tracked in the repository.", "repository-derived"),
    "trace-export-api": factClaim("CLI, JSON statistics, Git Notes, and an open event format", "https://github.com/git-ai-project/git-ai", "Git AI repository", undefined, "repository-derived"),
    "trace-redaction-privacy": capability("limited", "https://github.com/git-ai-project/git-ai", "Git AI repository", "The default workflow is local-first and sharing is optional; automatic secret redaction is not established.", "repository-derived"),
    "trace-sharing": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "Attribution can be pushed through Git Notes and shared through optional hosted or self-hosted team services.", "repository-derived"),
    "trace-ci-analytics": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "Repository statistics expose AI contribution, acceptance, token, cost, model, and agent measures suitable for automation.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://github.com/git-ai-project/git-ai", "Git AI repository", "The CLI and attribution format are Apache-licensed and local-first; the documented team service has a self-hosted option.", "repository-derived"),
  } }),
  product({ id: "langfuse", name: "Langfuse", categoryId: "agent-traces", editorialOrder: 9, officialUrl: "https://github.com/langfuse/langfuse", repository: repo("langfuse/langfuse"), repoMetricId: "langfuse", tags: ["tracing", "evals", "prompt-management", "self-hosted", "split-source"], platform: ["web"], source: "split-source", execution: ["local-daemon", "container", "user-cloud", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("SDK, OpenTelemetry, and framework integrations capture LLM and agent traces", "https://github.com/langfuse/langfuse", "Langfuse repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Langfuse Cloud or operator self-hosted deployment", "https://github.com/langfuse/langfuse", "Langfuse repository", undefined, "repository-derived"),
    ...builtInClaims("https://github.com/langfuse/langfuse", "Langfuse repository", ["trace-search-timeline", "trace-multi-harness", "trace-transcript-coverage", "trace-tool-call-coverage", "trace-artifact-coverage", "trace-export-api", "trace-redaction-privacy", "trace-sharing", "trace-ci-analytics", "trace-self-hosting"], undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/langfuse/langfuse", "Langfuse repository", "Metadata can carry version and release identifiers; automatic commit or worktree binding is not established.", "repository-derived"),
    "trace-replay-resume": capability("limited", "https://github.com/langfuse/langfuse", "Langfuse repository", "Traces and datasets can be replayed for evaluation, but resuming the original interactive agent session is not established.", "repository-derived"),
  } }),
  product({ id: "arize-phoenix", name: "Arize Phoenix", categoryId: "agent-traces", editorialOrder: 10, officialUrl: "https://github.com/Arize-ai/phoenix", repository: repo("Arize-ai/phoenix"), repoMetricId: "arize-phoenix", tags: ["opentelemetry", "tracing", "evals", "self-hosted", "source-available"], platform: ["web"], source: "source-available", execution: ["local-daemon", "container", "user-cloud", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("OpenTelemetry and framework integrations capture LLM and agent traces", "https://github.com/Arize-ai/phoenix", "Arize Phoenix repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Local, self-hosted, or Arize-managed deployment", "https://github.com/Arize-ai/phoenix", "Arize Phoenix repository", undefined, "repository-derived"),
    ...builtInClaims("https://github.com/Arize-ai/phoenix", "Arize Phoenix repository", ["trace-search-timeline", "trace-multi-harness", "trace-transcript-coverage", "trace-tool-call-coverage", "trace-artifact-coverage", "trace-export-api", "trace-redaction-privacy", "trace-sharing", "trace-ci-analytics", "trace-self-hosting"], undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/Arize-ai/phoenix", "Arize Phoenix repository", "Trace metadata can include version identifiers; automatic Git commit or worktree linkage is not established.", "repository-derived"),
    "trace-replay-resume": capability("limited", "https://github.com/Arize-ai/phoenix", "Arize Phoenix repository", "Experiments can replay data through evaluations; resuming the original agent session is not established.", "repository-derived"),
  } }),
  product({ id: "agentops", name: "AgentOps", categoryId: "agent-traces", editorialOrder: 11, officialUrl: "https://github.com/AgentOps-AI/agentops", repository: repo("AgentOps-AI/agentops"), repoMetricId: "agentops", tags: ["tracing", "replay", "analytics", "multi-agent", "oss"], platform: ["web"], source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("SDK and integrations record agent runs, LLM calls, tools, and events", "https://github.com/AgentOps-AI/agentops", "AgentOps repository", undefined, "repository-derived"),
    "trace-storage-boundary": factClaim("Instrumented process with AgentOps dashboard service", "https://github.com/AgentOps-AI/agentops", "AgentOps repository", undefined, "repository-derived"),
    ...builtInClaims("https://github.com/AgentOps-AI/agentops", "AgentOps repository", ["trace-search-timeline", "trace-multi-harness", "trace-transcript-coverage", "trace-tool-call-coverage", "trace-artifact-coverage", "trace-export-api", "trace-redaction-privacy", "trace-sharing", "trace-ci-analytics"], undefined, "repository-derived"),
    "trace-git-linkage": capability("limited", "https://github.com/AgentOps-AI/agentops", "AgentOps repository", "Custom metadata can carry source versions; automatic Git lineage is not established.", "repository-derived"),
    "trace-replay-resume": capability("limited", "https://github.com/AgentOps-AI/agentops", "AgentOps repository", "Session replay visualizes recorded runs; it does not establish resuming the original agent process.", "repository-derived"),
    "trace-self-hosting": capability("limited", "https://github.com/AgentOps-AI/agentops", "AgentOps repository", "The SDK is open source; the cited product does not establish a complete self-hosted dashboard distribution.", "repository-derived"),
  } }),
];

const harnessFieldGuideOrder = [
  "claude-code",
  "codex-cli",
  "grok-build",
  "pi-coding-agent",
  "cursor-cli",
  "amp",
  "antigravity-cli",
  "opencode",
  "muse-code",
  "github-copilot-cli",
  "gemini-cli",
  "prime-agent",
  "deepseek-harness",
  "poolside-pool",
  "kimi-code-cli",
  "kilo-code-cli",
  "mistral-vibe",
  "continue-cli",
  "crush",
  "auggie-cli",
  "kiro-cli",
  "amplifier-agent",
  "gptme",
  "factory-droid-cli",
  "codewhale",
  "qwen-code",
  "goose",
  "aider",
  "rovo-dev-cli",
] as const;

for (const [index, productId] of harnessFieldGuideOrder.entries()) {
  const product = comparisonProducts.find((item) => item.id === productId);
  if (!product || product.categoryId !== "coding-agent-harnesses") {
    throw new Error(`Harness field-guide product is missing or misclassified: ${productId}`);
  }
  product.editorialOrder = index + 1;
}

export const comparisonProductById = new Map(
  comparisonProducts.map((item) => [item.id, item] as const),
);

const factDisplay = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(factDisplay).join(", ");
  const words = String(value).replaceAll("-", " ");
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
};

/**
 * Resolves both profile rows and sparse capability rows. Absence is always an
 * explicit Unknown. A UI must not derive Not available from an omitted claim.
 */
export function getComparisonClaim(
  item: ComparisonProduct,
  row: ComparisonRow | string,
): ComparisonClaim {
  const rowDefinition =
    typeof row === "string"
      ? comparisonCategories.flatMap((entry) => entry.rows).find((entry) => entry.id === row)
      : row;

  if (!rowDefinition) return unknownClaim("Unknown comparison criterion.");

  if (rowDefinition.platform) {
    const platformFact = item.profile.platform;
    if (platformFact.state === "unknown") return unknownClaim(platformFact.note);
    if (!platformFact.value.includes(rowDefinition.platform)) {
      return unknownClaim(`Support for ${rowDefinition.label} has not been established; absence is not treated as unavailability.`);
    }
    return {
      state: "built-in",
      displayValue: "Supported",
      ...(platformFact.note ? { note: platformFact.note } : {}),
      evidence: platformFact.evidence,
    };
  }

  if (rowDefinition.profileField) {
    const fact = item.profile[rowDefinition.profileField];
    if (fact.state === "unknown") return unknownClaim(fact.note);
    return {
      state: "fact",
      displayValue: factDisplay(fact.value),
      ...(fact.note ? { note: fact.note } : {}),
      evidence: fact.evidence,
    };
  }

  return item.claims[rowDefinition.id] ?? unknownClaim();
}
