/**
 * Launch catalog for the Tortie comparison workspace.
 *
 * Editorial order is intentional. Do not alphabetize categories, products, or
 * rows: the order follows docs/research/04-comparison-taxonomy.md. Product
 * capabilities are sparse by design; getComparisonClaim() converts every
 * unresearched cell to an explicit Unknown rather than inferring a negative.
 */

export const COMPARISON_SNAPSHOT = "2026-08-23" as const;

export type CategoryId =
  | "code-editors"
  | "agent-workbenches"
  | "agent-orchestrators"
  | "coding-agent-harnesses"
  | "ide-extensions"
  | "cloud-agents"
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
  category("agent-workbenches", "Agent IDEs", "Agent IDEs", "/compare/agent-ides/", 3, "Products organized around named, recurring sessions inside projects."),
  category("agent-orchestrators", "Agent orchestrators", "Agent Orchestrators", "/compare/orchestrators/", 4, "Products organized around delegated tasks in isolated workspaces."),
  category("coding-agent-harnesses", "Coding-agent harnesses", "Harnesses", "/compare/harnesses/", 5, "Processes that own one model conversation and its tool loop."),
  category("agent-traces", "Agent Traces", "Agent Traces", "/compare/agent-traces/", 6, "Durable provenance and observability records of coding-agent work."),
  category("cloud-agents", "Cloud and background agents", "Cloud agents", "/compare/cloud-agents/", 7, "Remote jobs that return durable patches, branches, pull requests, or results."),
  category("remote-companions", "Remote companions and relays", "Remote", "/compare/remote/", 8, "Clients that observe or steer a session owned by another machine or product."),
];

const objectForCategory: Record<CategoryId, PrimaryObject> = {
  "code-editors": "file-or-project",
  "agent-workbenches": "named-session",
  "agent-orchestrators": "delegated-task",
  "coding-agent-harnesses": "agent-conversation",
  "ide-extensions": "host-ide-panel",
  "cloud-agents": "remote-job",
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
  source: SourceModel | "unknown";
  execution: readonly ExecutionLocation[] | "unknown";
  status?: ProductStatus;
  claims?: Readonly<Record<string, ComparisonClaim>>;
}

const product = (input: ProductInput): ComparisonProduct => {
  const sourceUrl = input.officialUrl ?? input.repository?.url ?? null;
  const sourceTitle = `${input.name} primary source`;
  const profileUnknown = "Primary-source verification has not yet established this value.";

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
        input.platform && sourceUrl
          ? known(
              input.platform,
              input.platformSource?.url ?? sourceUrl,
              input.platformSource?.title ?? sourceTitle,
              input.platformSource?.url?.includes("github.com") ? "repository-derived" : "vendor-documented",
              input.platformNote,
            )
          : unknown("Platform support is not yet verified from a primary source at row level."),
      source:
        input.source !== "unknown" && sourceUrl
          ? known(input.source, sourceUrl, sourceTitle, input.repository ? "source-inspected" : "vendor-documented")
          : unknown("The shipped product's source model is not yet established by primary evidence."),
      execution:
        input.execution !== "unknown" && sourceUrl
          ? known(input.execution, sourceUrl, sourceTitle)
          : unknown(profileUnknown),
      primaryObject: sourceUrl
        ? known(objectForCategory[input.categoryId], sourceUrl, sourceTitle, "vendor-documented")
        : unknown("No public first-party product source has been established."),
      status:
        input.status && sourceUrl
          ? known(input.status, sourceUrl, sourceTitle, input.repository ? "repository-derived" : "vendor-documented")
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
    id: "eclipse-theia-ide", name: "Eclipse Theia IDE", categoryId: "code-editors", editorialOrder: 1,
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
    id: "traecode", name: "TraeCode", categoryId: "code-editors", editorialOrder: 2, officialUrl: "https://www.trae.ai/ide",
    tags: ["agent-panel", "solo-mode", "inline-completion", "mcp", "embedded-browser", "formerly-trae-ide"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools"]),
      ...builtInClaims("https://www.trae.ai/blog/engineering_thought_0731", "TraeCode Cue product notes", ["editor-inline-prediction"]),
      ...builtInClaims("https://www.trae.ai/blog/trae_membership_0213", "TraeCode capability overview", ["editor-mcp"]),
      ...builtInClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-parallel-sessions"]),
      ...limitedClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-background-jobs"], "SOLO supports long multi-step work, but detached durability after client exit is not established."),
      ...limitedClaims("https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes", ["editor-change-review"], "Agent changes and artifacts are surfaced in the IDE, but per-hunk accept and reject behavior is not established."),
      "editor-model-access": factClaim("Vendor-managed models", "https://www.trae.ai/blog/trae_membership_0213", "TraeCode capability overview"),
      "editor-browser-tools": factClaim("Embedded browser in SOLO", "https://www.trae.ai/blog/product_solo", "TraeCode SOLO product notes"),
      "editor-verification-loop": factClaim("Agent tool loop; test contract unverified", "https://www.trae.ai/blog/product_thought_0617", "TraeCode agent tool notes"),
      "editor-specialization": factClaim("General software", "https://www.trae.ai/ide", "TraeCode product page"),
      "editor-ai-feature-boundary": factClaim("Built into TraeCode", "https://www.trae.ai/ide", "TraeCode product page"),
      "editor-release-channel": factClaim("Active desktop release", "https://www.trae.ai/download?auto=1&product_type=ide", "TraeCode download center"),
    },
  }),
  product({
    id: "qoder-ide", name: "Qoder IDE", categoryId: "code-editors", editorialOrder: 3, officialUrl: "https://docs.qoder.com/product-series/what-is-qoder",
    tags: ["agent-panel", "quest", "inline-completion", "mcp", "parallel-agents", "scheduled-tasks", "remote-ssh", "sandbox"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://docs.qoder.com/user-guide/chat/agent", "Qoder IDE Agent guide", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-mcp", "editor-change-review"]),
      ...builtInClaims("https://docs.qoder.com/user-guide/chat/overview", "Qoder IDE Editor overview", ["editor-inline-prediction"]),
      ...builtInClaims("https://docs.qoder.com/release-notes/desktop", "Qoder IDE release notes", ["editor-background-jobs", "editor-parallel-sessions", "editor-remote-workspaces"]),
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
    id: "antigravity-ide", name: "Antigravity IDE", categoryId: "code-editors", editorialOrder: 4, officialUrl: "https://antigravity.google/docs/ide/overview/",
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
    id: "android-studio", name: "Android Studio", categoryId: "code-editors", editorialOrder: 5, officialUrl: "https://developer.android.com/studio/install",
    tags: ["android", "gemini", "agent-panel", "parallel-agents", "inline-completion", "mcp", "emulator", "split-source"], platform: ["macos", "windows", "linux"], source: "split-source", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-background-jobs", "editor-agent-shell-tools", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features", ["editor-inline-prediction", "editor-mcp"]),
      "editor-model-access": factClaim("Gemini default and configured supported providers", "https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features"),
      "editor-agent-permissions": factClaim("Tool permissions and change review", "https://developer.android.com/studio/gemini/agent-mode", "Gemini in Android Studio Agent Mode"),
      "editor-browser-tools": factClaim("Emulator and device tools", "https://developer.android.com/studio/gemini/create-a-new-project-with-ai", "Android Studio new-project agent"),
      "editor-verification-loop": factClaim("Builds, tests, diagnostics, emulator, and device", "https://developer.android.com/studio/gemini/create-a-new-project-with-ai", "Android Studio new-project agent"),
      "editor-specialization": factClaim("Android", "https://developer.android.com/studio/install", "Android Studio install guide"),
      "editor-ai-feature-boundary": factClaim("Integrated Gemini service in the shipped IDE", "https://developer.android.com/studio/gemini/features", "Gemini in Android Studio features"),
      "editor-release-channel": factClaim("Active stable desktop release", "https://developer.android.com/studio/install", "Android Studio install guide"),
    },
  }),
  product({
    id: "intellij-idea", name: "IntelliJ IDEA", categoryId: "code-editors", editorialOrder: 6, officialUrl: "https://www.jetbrains.com/help/idea/intellij-idea-single-distribution.html",
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
    id: "positron", name: "Positron", categoryId: "code-editors", editorialOrder: 7, officialUrl: "https://positron.posit.co/", repository: repo("posit-dev/positron"), repoMetricId: "positron",
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
    id: "onlook", name: "Onlook", categoryId: "code-editors", editorialOrder: 8, officialUrl: "https://docs.onlook.com/", repository: repo("onlook-dev/onlook"), repoMetricId: "onlook",
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
    id: "visual-studio-code", name: "Visual Studio Code", categoryId: "code-editors", editorialOrder: 9,
    officialUrl: "https://code.visualstudio.com/docs/agents/overview", repository: repo("microsoft/vscode", "source-tree"), repoMetricId: "vscode",
    tags: ["agent-sessions", "extensions", "background-agent-client", "remote-development"], platform: ["macos", "windows", "linux", "web"], source: "split-source", execution: ["local-process", "vendor-cloud", "ssh-host"],
    claims: {
      ...builtInClaims("https://code.visualstudio.com/docs/agents/run/agents-window", "Visual Studio Code Agents window", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-background-jobs", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/run/tools", "Visual Studio Code agent tools", ["editor-agent-shell-tools", "editor-mcp"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/concepts/agent-harnesses", "Visual Studio Code agent harnesses", ["editor-worktree-isolation"]),
      ...builtInClaims("https://code.visualstudio.com/docs/agents/overview", "Visual Studio Code agents overview", ["editor-remote-workspaces"]),
      "editor-inline-prediction": capability("via-extension", "https://code.visualstudio.com/docs/editing/ai-powered-suggestions", "Visual Studio Code inline suggestions", "GitHub Copilot provides inline and next-edit suggestions in VS Code."),
    },
  }),
  product({
    id: "cursor-ide", name: "Cursor IDE", categoryId: "code-editors", editorialOrder: 10, officialUrl: "https://docs.cursor.com/en/get-started/quickstart",
    tags: ["agent-panel", "background-agent-client", "vscode-derived"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://docs.cursor.com/en/get-started/quickstart", "Cursor quickstart", ["editor-project-tree", "editor-agent-mode", "editor-inline-prediction"]),
      ...builtInClaims("https://docs.cursor.com/en/agent/terminal", "Cursor terminal documentation", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.cursor.com/context/model-context-protocol", "Cursor MCP documentation", ["editor-mcp"]),
      ...builtInClaims("https://docs.cursor.com/background-agent", "Cursor Background Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-remote-workspaces"]),
    },
  }),
  product({
    id: "windsurf", name: "Devin Desktop", categoryId: "code-editors", editorialOrder: 11, officialUrl: "https://docs.devin.ai/desktop/getting-started",
    tags: ["agent-panel", "vscode-derived", "formerly-windsurf", "local-agent"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started", ["editor-project-tree", "editor-agent-mode"]),
      ...builtInClaims("https://docs.devin.ai/desktop/terminal", "Devin Desktop terminal", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.devin.ai/desktop/tab/overview", "Devin Desktop Tab", ["editor-inline-prediction"]),
      ...builtInClaims("https://docs.devin.ai/desktop/cascade/mcp", "Devin Desktop MCP documentation", ["editor-mcp"]),
    },
  }),
  product({
    id: "zed", name: "Zed", categoryId: "code-editors", editorialOrder: 12, officialUrl: "https://zed.dev/docs/ai/overview", repository: repo("zed-industries/zed"), repoMetricId: "zed",
    tags: ["agent-panel", "terminal", "scm", "worktrees", "parallel-agents", "oss"], platform: ["macos", "linux"], source: "open-source", execution: ["local-process"],
    claims: {
      ...builtInClaims("https://zed.dev/docs/ai/zed-agent", "Zed Agent documentation", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-change-review"]),
      ...builtInClaims("https://zed.dev/docs/ai/parallel-agents", "Zed Parallel Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-worktree-isolation"]),
      ...builtInClaims("https://zed.dev/docs/ai/edit-prediction", "Zed Edit Prediction", ["editor-inline-prediction"]),
      ...builtInClaims("https://zed.dev/docs/ai/agent-panel", "Zed Agent Panel", ["editor-mcp"]),
    },
  }),
  product({
    id: "kiro", name: "Kiro", categoryId: "code-editors", editorialOrder: 13, officialUrl: "https://kiro.dev/docs/ide/",
    tags: ["agent-panel", "spec-driven", "parallel-agents", "cloud-sessions"], platform: ["macos", "windows", "linux"], source: "unknown", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://kiro.dev/docs/ide/", "Kiro IDE documentation", ["editor-project-tree", "editor-agent-mode", "editor-mcp"]),
      ...builtInClaims("https://kiro.dev/docs/chat/dev-servers/", "Kiro dev servers", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://kiro.dev/docs/ide/experimental/focus-mode", "Kiro Agent Focus", ["editor-background-jobs", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://kiro.dev/ide/", "Kiro IDE product documentation", ["editor-remote-workspaces"]),
    },
  }),
  product({
    id: "void", name: "Void", categoryId: "code-editors", editorialOrder: 14, officialUrl: "https://github.com/voideditor/void", repository: repo("voideditor/void"), repoMetricId: "void",
    tags: ["agent-panel", "vscode-derived", "oss", "historical"], source: "open-source", execution: ["local-process"], status: "archived",
    claims: {
      ...builtInClaims("https://github.com/voideditor/void", "Void repository", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-change-review"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/voideditor/void/releases", "Void releases", ["editor-inline-prediction"], undefined, "repository-derived"),
    },
  }),

  // 2. Agent workbenches
  product({
    id: "tortie", name: "Tortie", categoryId: "agent-workbenches", editorialOrder: 1, officialUrl: "https://github.com/gregce/tortie", repository: repo("gregce/tortie"), repoMetricId: "tortie",
    tags: ["terminal", "editor", "scm", "session-durability", "multi-project", "remote-ssh", "oss"], platform: ["macos"], platformNote: "The current supported desktop build is macOS on Apple silicon.", source: "open-source", execution: ["local-process", "local-daemon", "ssh-host"],
    claims: builtInClaims("https://github.com/gregce/tortie#readme", "Tortie repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-editor", "workbench-file-tree", "workbench-scm", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-remote-host"], undefined, "repository-derived"),
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
    tags: ["terminal", "session-restore", "browser", "notifications", "remote-ssh", "oss"], platform: ["macos"], platformNote: "iOS is a companion surface, not the evaluated desktop host.", source: "open-source", execution: ["local-process", "ssh-host"],
    claims: {
      ...builtInClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux#session-restore", "cmux session restore", ["workbench-pty-survives-ui", "workbench-session-recovery"], "Restores layouts, working directories, scrollback, and supported agent conversations through native resume IDs; arbitrary process state is not checkpointed.", "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-scm"], "Sidebar shows branch and linked pull-request status; it is not documented as a full source-control editor.", "repository-derived"),
      "workbench-file-tree": capability("built-in", "https://cmux.com/blog/cmux-finder", "cmux Finder", "The Finder-style Files sidebar browses the workspace tree, previews common file types, and follows the remote root in SSH workspaces."),
      "workbench-change-review": capability("built-in", "https://cmux.com/docs/changelog", "cmux changelog 0.64.20", "Diff comments bind to changed lines, persist per repository, and can be attached as structured feedback to the agent terminal."),
      "workbench-worktrees": capability("via-integration", "https://github.com/manaflow-ai/cmux-home/blob/main/docs/customization.md", "cmux customization examples", "The official customization collection includes a worktree starter; it is an ecosystem integration rather than a cmux core capability.", "repository-derived"),
    },
  }),
  product({ id: "mosaic-terminal", name: "Mosaic Terminal", categoryId: "agent-workbenches", editorialOrder: 5, officialUrl: "https://mosaicterminal.dev/", tags: ["terminal", "session-restore", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: { ...builtInClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-named-sessions", "workbench-cross-project-attention"]), ...limitedClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-pty-survives-ui"], "Continuity is documented as agent relaunch with provider resume flags.") } }),
  product({ id: "airport", name: "Airport", categoryId: "agent-workbenches", editorialOrder: 6, officialUrl: "https://get-airport.com/", tags: ["terminal", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: builtInClaims("https://get-airport.com/", "Airport product", ["workbench-named-sessions", "workbench-cross-project-attention"]) }),
  product({
    id: "wmux", name: "wmux", categoryId: "agent-workbenches", editorialOrder: 7, officialUrl: "https://github.com/openwong2kim/wmux", repository: repo("openwong2kim/wmux"), repoMetricId: "wmux",
    tags: ["terminal", "daemon-pty", "worktrees", "browser", "notifications", "scm", "oss"], platform: ["macos", "windows"], source: "open-source", execution: ["local-daemon", "ssh-host"],
    claims: {
      ...builtInClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-browser", "workbench-remote-host", "workbench-programmable-control", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-scm"], "A Git tab covers worktrees and pull requests; this is not a full VS Code-style SCM surface.", "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-file-tree"], "The task-harvest diff surface has a file tree and per-hunk selection; it is not a project-wide editor tree.", "repository-derived"),
    },
  }),
  product({
    id: "warp", name: "Warp", categoryId: "agent-workbenches", editorialOrder: 8, officialUrl: "https://www.warp.dev/", repository: repo("warpdotdev/warp"), repoMetricId: "warp",
    tags: ["terminal", "cloud-agent", "blocks", "code-editor", "hybrid:workbench-cloud", "oss", "agpl-3.0"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "vendor-cloud"], status: "active",
    claims: {
      ...builtInClaims("https://docs.warp.dev/code/code-editor", "Warp code editor", ["workbench-editor", "workbench-file-tree"]),
      ...limitedClaims("https://docs.warp.dev/agent-platform/local-agents/overview", "Warp local agents overview", ["workbench-scm"], "Interactive code review covers agent diffs and inline feedback; documentation does not establish a complete source-control surface."),
      ...builtInClaims("https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", "Warp agent conversations", ["workbench-named-sessions", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery"]),
      ...builtInClaims("https://docs.warp.dev/agent-platform/getting-started/agents-in-warp", "Agents in Warp", ["workbench-cross-project-attention"]),
      ...builtInClaims("https://docs.warp.dev/code/ssh-feature-support", "Warp SSH feature support", ["workbench-remote-host"]),
      ...builtInClaims("https://docs.warp.dev/reference/cli", "Warp Oz CLI", ["workbench-programmable-control"]),
    },
  }),
  product({
    id: "wave-terminal", name: "Wave Terminal", categoryId: "agent-workbenches", editorialOrder: 9, officialUrl: "https://github.com/wavetermdev/waveterm", repository: repo("wavetermdev/waveterm"), repoMetricId: "wave-terminal",
    tags: ["terminal", "workspace-blocks", "editor-blocks", "browser", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-arbitrary-cli", "workbench-editor", "workbench-splits", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-pty-survives-ui"], "Durable SSH terminal sessions survive network changes and Wave restarts; equivalent survival is not established for arbitrary local processes.", "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-file-tree"], "Directory and file preview plus connected file management are built in; a project-wide IDE tree is not claimed.", "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-session-recovery"], "Durable SSH sessions reconnect after network changes and Wave restarts; this does not establish local-process survival.", "repository-derived"),
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
  product({ id: "orca", name: "Orca", categoryId: "agent-orchestrators", editorialOrder: 2, officialUrl: "https://onorca.dev/", repository: repo("stablyai/orca"), repoMetricId: "orca", tags: ["agent-ide", "worktrees", "terminal", "editor", "scm", "remote-ssh", "mobile", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Mobile apps are companion clients; these values describe the desktop and web operator surfaces.", source: "open-source", execution: ["local-process", "ssh-host", "user-cloud"], claims: {
    ...builtInClaims("https://github.com/stablyai/orca#readme", "Orca repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-remote-execution"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md", "Orca CLI guide", ["orchestrator-worktrees", "orchestrator-programmable"], undefined, "repository-derived"),
  } }),
  product({ id: "conductor", name: "Conductor", categoryId: "agent-orchestrators", editorialOrder: 3, officialUrl: "https://www.conductor.build/docs/", tags: ["native-macos", "worktrees", "review", "multi-agent"], platform: ["macos"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://www.conductor.build/docs/", "Conductor documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/git-worktrees", "Conductor Git worktrees", ["orchestrator-worktrees"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/workflow", "Conductor workflow", ["orchestrator-inline-review", "orchestrator-pr-lifecycle"]),
  } }),
  product({
    id: "poolside-desktop-assistant", name: "Poolside Desktop Assistant", categoryId: "agent-orchestrators", editorialOrder: 4, officialUrl: "https://poolside.ai/blog/introducing-poolside-desktop-assistant",
    tags: ["agent-orchestration", "acp", "multi-harness", "worktrees", "diff-review", "cross-harness-handoff"], platform: ["macos"], platformNote: "The announced desktop product currently documents macOS; the separate pool CLI and editor extensions are not this SKU.", source: "proprietary", execution: ["local-process"], status: "active",
    claims: builtInClaims("https://poolside.ai/blog/introducing-poolside-desktop-assistant", "Poolside Desktop Assistant announcement", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-worktrees"]),
  }),
  product({
    id: "bb", name: "bb", categoryId: "agent-orchestrators", editorialOrder: 5, officialUrl: "https://github.com/get-bb/bb", repository: repo("get-bb/bb"), repoMetricId: "bb",
    tags: ["agent-ide", "threads", "multi-harness", "worktrees", "multi-machine", "api", "oss"], platform: ["macos", "linux", "web"], platformNote: "Apple-silicon macOS desktop, alpha Linux AppImage, and local browser UI are documented. Windows is supported through WSL2, not as a native client.", source: "open-source", execution: ["local-daemon", "local-process", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/get-bb/bb", "bb repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-worktrees", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable", "orchestrator-live-steering", "orchestrator-agent-handoff"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/get-bb/bb/blob/main/docs/worktrees.md", "bb worktree documentation", ["orchestrator-review-delivery"], "Quick-open and a built-in diff surface support review, while commit, push, and pull-request creation remain agent or shell operations.", "repository-derived"),
    },
  }),
  product({
    id: "omnigent", name: "Omnigent", categoryId: "agent-orchestrators", editorialOrder: 6, officialUrl: "https://github.com/omnigent-ai/omnigent", repository: repo("omnigent-ai/omnigent"), repoMetricId: "omnigent",
    tags: ["meta-harness", "multi-harness", "worktrees", "sandboxes", "cross-vendor-review", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Native Windows mode is documented with degraded isolation; macOS also has a wrapper app and all desktop hosts can use the browser UI.", source: "open-source", execution: ["local-process", "local-daemon", "container", "user-cloud"], status: "active",
    claims: builtInClaims("https://github.com/omnigent-ai/omnigent", "Omnigent repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-containers", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable", "orchestrator-live-steering"], undefined, "repository-derived"),
  }),
  product({
    id: "agent-orchestrator", name: "Agent Orchestrator", categoryId: "agent-orchestrators", editorialOrder: 7, officialUrl: "https://github.com/Untrivial-ai/agent-orchestrator", repository: repo("Untrivial-ai/agent-orchestrator"), repoMetricId: "agent-orchestrator",
    tags: ["desktop", "multi-harness", "worktrees", "kanban", "pr-lifecycle", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-daemon", "local-process"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/Untrivial-ai/agent-orchestrator", "Agent Orchestrator repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-attention-signals", "orchestrator-live-steering"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/Untrivial-ai/agent-orchestrator", "Agent Orchestrator repository README", ["orchestrator-programmable"], "A current local daemon and CLI route map are documented, but the earlier public npm CLI is frozen and no broad stable automation contract is claimed.", "repository-derived"),
    },
  }),
  product({
    id: "emdash", name: "Emdash", categoryId: "agent-orchestrators", editorialOrder: 8, officialUrl: "https://emdash.com/docs", repository: repo("generalaction/emdash"), repoMetricId: "emdash",
    tags: ["agentic-development-environment", "multi-harness", "worktrees", "diff-review", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-process", "ssh-host", "user-cloud"], status: "active",
    claims: builtInClaims("https://emdash.com/docs", "Emdash documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals"]),
  }),
  product({
    id: "kandev", name: "Kandev", categoryId: "agent-orchestrators", editorialOrder: 9, officialUrl: "https://kandev.ai/docs/", repository: repo("kdlbs/kandev"), repoMetricId: "kandev",
    tags: ["kanban", "multi-harness", "worktrees", "containers", "remote-execution", "mcp", "oss"], platform: ["macos", "windows", "linux", "web"], source: "open-source", execution: ["local-process", "container", "ssh-host", "user-cloud"], status: "active",
    claims: builtInClaims("https://github.com/kdlbs/kandev/blob/main/docs/features.md", "Kandev feature contract", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-agent-handoff", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-containers", "orchestrator-task-board", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-live-steering", "orchestrator-programmable"], undefined, "repository-derived"),
  }),
  product({
    id: "paseo", name: "Paseo", categoryId: "agent-orchestrators", editorialOrder: 10, officialUrl: "https://github.com/getpaseo/paseo", repository: repo("getpaseo/paseo"), repoMetricId: "paseo",
    tags: ["multi-harness", "worktrees", "subagents", "cross-provider-handoff", "mobile", "self-hosted", "oss"], platform: ["macos", "windows", "linux", "web", "ios", "android"], platformNote: "Desktop, browser, and mobile clients connect to a self-hosted Paseo daemon.", source: "open-source", execution: ["local-daemon", "local-process", "container", "paired-machine"], status: "active",
    claims: {
      ...builtInClaims("https://github.com/getpaseo/paseo/blob/main/public-docs/orchestration.md", "Paseo orchestration documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-agent-handoff", "orchestrator-worktrees", "orchestrator-live-steering"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/getpaseo/paseo/blob/main/public-docs/providers.md", "Paseo provider documentation", ["orchestrator-multi-harness"], undefined, "repository-derived"),
      ...builtInClaims("https://github.com/getpaseo/paseo", "Paseo repository README", ["orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-pr-lifecycle", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/getpaseo/paseo", "Paseo repository README", ["orchestrator-containers"], "An official Docker daemon and web deployment are documented, but the sources do not establish a separate container or VM for each delegated task.", "repository-derived"),
    },
  }),
  product({ id: "superset", name: "Superset", categoryId: "agent-orchestrators", editorialOrder: 11, officialUrl: "https://github.com/superset-sh/superset", repository: repo("superset-sh/superset"), repoMetricId: "superset", tags: ["worktrees", "terminal", "diff-review", "remote-hosts", "source-available"], platform: ["macos", "linux"], platformNote: "macOS is primary; Linux support was documented as experimental in the research snapshot.", source: "source-available", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/superset-sh/superset", "Superset repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived") }),
  product({ id: "coder-mux", name: "Coder Mux", categoryId: "agent-orchestrators", editorialOrder: 12, officialUrl: "https://mux.coder.com", repository: repo("coder/cmux"), repoMetricId: "coder-mux", tags: ["chat-control-plane", "worktrees", "ssh", "review", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/coder/cmux", "Coder Mux repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived") }),
  product({ id: "nimbalyst", name: "Nimbalyst", categoryId: "agent-orchestrators", editorialOrder: 13, officialUrl: "https://github.com/nimbalyst/nimbalyst", repository: repo("nimbalyst/nimbalyst"), repoMetricId: "nimbalyst", tags: ["agent-ide", "worktrees", "kanban", "editor", "visual-docs", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Mobile companion reach is not counted as a desktop host platform.", source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst#readme", "Nimbalyst repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board", "orchestrator-inline-review", "orchestrator-attention-signals"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst/blob/main/docs/WORKTREES.md", "Nimbalyst worktree documentation", ["orchestrator-worktrees"], undefined, "repository-derived"),
  } }),
  product({ id: "t3-code", name: "T3 Code", categoryId: "agent-orchestrators", editorialOrder: 14, officialUrl: "https://t3.codes/", tags: ["chat-control-plane", "branches", "pr-flow"], source: "unknown", execution: ["local-process"] }),
  product({ id: "vibe-kanban", name: "Vibe Kanban", categoryId: "agent-orchestrators", editorialOrder: 15, officialUrl: "https://github.com/BloopAI/vibe-kanban", repository: repo("BloopAI/vibe-kanban"), repoMetricId: "vibe-kanban", tags: ["kanban", "worktrees", "approvals", "oss", "sunsetting"], source: "open-source", execution: ["local-process"], status: "sunsetting", claims: {
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/monitoring-task-execution", "Vibe Kanban task execution documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees"]),
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/creating-tasks", "Vibe Kanban task documentation", ["orchestrator-task-board"]),
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/reviewing-code-changes", "Vibe Kanban code review", ["orchestrator-inline-review"]),
    ...builtInClaims("https://www.vibekanban.com/docs/reviewing-code", "Vibe Kanban review workflow", ["orchestrator-pr-lifecycle"]),
  } }),
  product({ id: "sculptor", name: "Sculptor", categoryId: "agent-orchestrators", editorialOrder: 16, officialUrl: "https://github.com/imbue-ai/sculptor", repository: repo("imbue-ai/sculptor"), repoMetricId: "sculptor", tags: ["containers", "worktrees", "ide-pairing", "oss"], platform: ["macos", "linux"], source: "open-source", execution: ["container"], status: "beta", claims: {
    ...builtInClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-pr-lifecycle"], undefined, "repository-derived"),
    ...limitedClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-containers"], "Docker and remote container backends are documented as experimental.", "repository-derived"),
  } }),
  product({ id: "humanlayer", name: "HumanLayer", categoryId: "agent-orchestrators", editorialOrder: 17, officialUrl: "https://humanlayer.com/", repository: repo("humanlayer/humanlayer", "deprecated-predecessor"), tags: ["worktrees", "kanban", "local-daemon", "cloud-daemon", "review"], source: "proprietary", execution: ["local-daemon", "vendor-cloud"], claims: {
    ...builtInClaims("https://humanlayer.com/", "HumanLayer product", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board"]),
    ...builtInClaims("https://docs.humanlayer.com/guide/workspaces", "HumanLayer workspace setup", ["orchestrator-worktrees"]),
    ...limitedClaims("https://docs.humanlayer.com/release-notes", "HumanLayer release notes", ["orchestrator-inline-review"], "Keyboard diff navigation and inline comments are currently an experimental alpha."),
    ...builtInClaims("https://docs.humanlayer.com/reference/skills-workflows", "HumanLayer workflows reference", ["orchestrator-pr-lifecycle"]),
    ...builtInClaims("https://docs.humanlayer.com/tutorials/remote-daemon", "HumanLayer remote daemon", ["orchestrator-remote-execution"]),
  } }),
  product({ id: "claude-squad", name: "claude-squad", categoryId: "agent-orchestrators", editorialOrder: 18, officialUrl: "https://github.com/smtg-ai/claude-squad", repository: repo("smtg-ai/claude-squad"), repoMetricId: "claude-squad", tags: ["tui", "tmux", "worktrees", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees"], undefined, "repository-derived"),
    ...limitedClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["orchestrator-inline-review"], "TUI supports reviewing changes before applying or checking them out; line-comment feedback is not documented.", "repository-derived"),
  } }),
  product({ id: "agent-deck", name: "agent-deck", categoryId: "agent-orchestrators", editorialOrder: 19, officialUrl: "https://github.com/asheshgoplani/agent-deck", repository: repo("asheshgoplani/agent-deck"), repoMetricId: "agent-deck", tags: ["tui", "tmux", "worktrees", "remote-ssh", "oss"], source: "open-source", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/asheshgoplani/agent-deck", "agent-deck repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-worktrees", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived") }),

  // 4. Coding-agent harnesses
  product({ id: "claude-code", name: "Claude Code", categoryId: "coding-agent-harnesses", editorialOrder: 1, officialUrl: "https://code.claude.com/docs/en/getting-started", tags: ["cli", "vendor-model", "resume", "subagents"], platform: ["macos", "windows", "linux"], platformNote: "Current requirements list native Windows and named Linux distributions.", source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://docs.anthropic.com/en/docs/claude-code/overview", "Claude Code documentation", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://code.claude.com/docs/en/memory", "Claude Code memory documentation", "CLAUDE.md project and user instructions are loaded as memory."),
    "harness-permission-controls": capability("built-in", "https://code.claude.com/docs/en/permissions", "Claude Code permissions documentation", "Tool allow and deny rules and permission modes; interactive approvals remain visible."),
    "harness-sandbox": capability("built-in", "https://code.claude.com/docs/en/sandboxing", "Claude Code sandboxing documentation", "Filesystem and network isolation can run commands inside an operating-system sandbox."),
    "harness-checkpoints": capability("built-in", "https://code.claude.com/docs/en/checkpointing", "Claude Code checkpointing documentation", "Claude Code records checkpoints and can rewind code or conversation state."),
    "harness-subagents": capability("built-in", "https://code.claude.com/docs/en/sub-agents", "Claude Code subagents documentation", "Built-in and custom subagents have separate context, prompts, tools, and permissions."),
    "harness-structured-output": capability("built-in", "https://docs.anthropic.com/en/docs/claude-code/cli-usage", "Claude Code CLI usage", "Print mode supports text, JSON, and stream-JSON output."),
    "harness-git-workflow": capability("built-in", "https://code.claude.com/docs/en/common-workflows", "Claude Code common workflows", "First-party workflows document Git operations, commits, and pull-request creation."),
    "harness-multimodal-input": capability("built-in", "https://code.claude.com/docs/en/tutorials", "Claude Code tutorials", "First-party tutorials document adding image inputs to a coding session."),
  } }),
  product({ id: "codex-cli", name: "Codex CLI", categoryId: "coding-agent-harnesses", editorialOrder: 2, officialUrl: "https://learn.chatgpt.com/docs/codex/cli", repository: repo("openai/codex"), repoMetricId: "codex-cli", tags: ["cli", "multi-agent-runtime", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Official install guidance provides macOS, Linux, and Windows paths.", source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/openai/codex", "Codex CLI repository", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://learn.chatgpt.com/docs/agent-configuration/agents-md", "Codex AGENTS.md documentation", "Hierarchical AGENTS.md and AGENTS.override.md instructions load before work."),
    "harness-permission-controls": capability("built-in", "https://learn.chatgpt.com/docs/codex/cli", "Codex CLI documentation", "User-selectable permissions govern what Codex may do."),
    "harness-sandbox": capability("built-in", "https://learn.chatgpt.com/docs/sandboxing", "Codex sandboxing documentation", "Codex documents sandbox modes and operating-system enforcement."),
    "harness-subagents": capability("built-in", "https://learn.chatgpt.com/docs/agent-configuration/subagents", "Codex subagents documentation", "First-party subagent configuration and delegation."),
  } }),
  product({ id: "github-copilot-cli", name: "GitHub Copilot CLI", categoryId: "coding-agent-harnesses", editorialOrder: 3, officialUrl: "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", repository: repo("github/copilot-cli", "metadata-only"), tags: ["cli", "github-cli", "copilot", "vendor-service", "resume"], platform: ["macos", "windows", "linux"], platformNote: "The separate copilot executable supports macOS, Linux, Windows PowerShell, and WSL; gh is a launcher and task client, not this harness.", source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", "GitHub Copilot CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    "harness-extension-protocol": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview", "GitHub Copilot CLI customization", "Custom agents, skills, MCP servers, hooks, and plugins are first-party customization surfaces."),
    "harness-multi-provider": capability("limited", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", "About GitHub Copilot CLI", "Multiple GitHub-selected models are available; this row does not treat model selection as general bring-your-own provider support."),
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview", "GitHub Copilot CLI overview", ["harness-project-instructions", "harness-checkpoints", "harness-subagents"]),
    "harness-permission-controls": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools", "GitHub Copilot CLI tool permissions", "Users can allow individual tools and remembered tool patterns."),
    "harness-structured-output": capability("built-in", "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference", "GitHub Copilot CLI reference", "The CLI reference documents machine-readable command output."),
    "harness-git-workflow": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", "About GitHub Copilot CLI", "Git and pull-request workflows are first-party product capabilities."),
  } }),
  product({ id: "gemini-cli", name: "Gemini CLI", categoryId: "coding-agent-harnesses", editorialOrder: 4, officialUrl: "https://geminicli.com/docs/get-started/installation/", repository: repo("google-gemini/gemini-cli"), repoMetricId: "gemini-cli", tags: ["cli", "vendor-model", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "macOS 15+, Windows 11 24H2+, and Ubuntu 20.04+ are documented.", source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", ["harness-interactive-cli", "harness-headless", "harness-session-resume", "harness-extension-protocol"]),
    "harness-project-instructions": capability("built-in", "https://geminicli.com/docs/cli/tutorials/memory-management/", "Gemini CLI memory management", "Hierarchical GEMINI.md project context and persistent memory."),
    "harness-permission-controls": capability("built-in", "https://geminicli.com/docs/reference/policy-engine/", "Gemini CLI policy engine", "The policy engine evaluates tool calls against configurable allow, deny, and confirmation rules."),
    "harness-sandbox": capability("built-in", "https://geminicli.com/docs/cli/sandbox/", "Gemini CLI sandbox documentation", "macOS Seatbelt and Docker or Podman sandbox options; sandbox expansion can request added access."),
    "harness-checkpoints": capability("built-in", "https://geminicli.com/docs/cli/checkpointing/", "Gemini CLI checkpointing documentation", "Optional checkpoints restore files, conversation history, and the pending tool call."),
    "harness-structured-output": capability("built-in", "https://github.com/google-gemini/gemini-cli", "Gemini CLI repository", "Headless mode supports JSON and newline-delimited stream JSON.", "repository-derived"),
    "harness-subagents": capability("built-in", "https://geminicli.com/docs/core/subagents/", "Gemini CLI subagents", "First-party documentation defines specialized subagents with separate prompts and tool access."),
  } }),
  product({ id: "amp", name: "Amp", categoryId: "coding-agent-harnesses", editorialOrder: 5, officialUrl: "https://ampcode.com/manual", tags: ["cli", "headless", "threads", "plugins", "subagents"], platform: ["macos", "windows", "linux"], platformNote: "The manual documents macOS, Linux, WSL, and native Windows PowerShell installs.", source: "proprietary", execution: ["local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://ampcode.com/manual", "Amp manual", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-project-instructions", "harness-subagents", "harness-structured-output", "harness-multimodal-input"]),
    "harness-permission-controls": capability("not-available", "https://ampcode.com/manual", "Amp manual", "The local agent does not ask before tool execution; the manual directs users to isolation for a stronger boundary."),
    "harness-sandbox": capability("via-integration", "https://ampcode.com/manual", "Amp manual", "Local CLI execution is not sandboxed; hosted runners and Orbs can supply an isolated execution environment."),
    "harness-git-workflow": capability("limited", "https://ampcode.com/manual", "Amp manual", "Amp documents Git-aware changes and commit trailers, but not a managed worktree or branch lifecycle."),
  } }),
  product({ id: "prime-agent", name: "Prime Agent", categoryId: "coding-agent-harnesses", editorialOrder: 6, officialUrl: "https://github.com/PrimeIntellect-ai/prime-agent", repository: repo("PrimeIntellect-ai/prime-agent"), repoMetricId: "prime-agent", tags: ["cli", "daemon", "continual-agent", "subagents", "multi-model", "oss"], platform: ["macos", "linux"], platformNote: "The stable installation path documents macOS and Linux; native Windows support is not asserted.", source: "open-source", execution: ["local-process", "local-daemon"], status: "active", claims: {
    ...builtInClaims("https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md", "Prime Agent README", ["harness-interactive-cli", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-subagents"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md", "Prime Agent usage", ["harness-headless", "harness-project-instructions", "harness-permission-controls", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    "harness-sandbox": capability("not-available", "https://github.com/PrimeIntellect-ai/prime-agent/blob/main/README.md", "Prime Agent README", "The project explicitly says commands run with the user's permissions and are not sandboxed.", "source-inspected"),
    "harness-checkpoints": capability("limited", "https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/usage.md", "Prime Agent usage", "Refine can restore harness state, but workspace mutation rollback is not established.", "repository-derived"),
  } }),
  product({ id: "deepseek-harness", name: "DeepSeek Harness", categoryId: "coding-agent-harnesses", editorialOrder: 7, officialUrl: "https://deepseek.com/harness/en/", repository: repo("deepseek-ai/deepseek-harness"), repoMetricId: "deepseek-harness", tags: ["cli", "headless", "web", "plugin-runtime", "subagents", "oss"], source: "open-source", execution: ["local-process"], status: "beta", claims: {
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
  product({ id: "amplifier-agent", name: "Amplifier Agent", categoryId: "coding-agent-harnesses", editorialOrder: 16, officialUrl: "https://github.com/microsoft/amplifier-agent", repository: repo("microsoft/amplifier-agent"), repoMetricId: "amplifier-agent", tags: ["headless", "embedded", "multi-model", "subagents", "oss"], source: "open-source", execution: ["local-process"], status: "active", claims: {
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
  } }),
  product({ id: "cursor-cli", name: "Cursor CLI", categoryId: "coding-agent-harnesses", editorialOrder: 18, officialUrl: "https://cursor.com/cli", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://cursor.com/cli", "Cursor CLI product", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    ...builtInClaims("https://docs.cursor.com/en/cli/using", "Cursor CLI usage", ["harness-extension-protocol", "harness-project-instructions"]),
    "harness-permission-controls": capability("built-in", "https://docs.cursor.com/cli/reference/permissions", "Cursor CLI permissions", "First-party permission rules control shell commands and tool use."),
    "harness-structured-output": capability("built-in", "https://docs.cursor.com/en/cli/reference/output-format", "Cursor CLI output formats", "Non-interactive runs can emit documented machine-readable output."),
    "harness-git-workflow": capability("built-in", "https://docs.cursor.com/en/cli/headless", "Cursor CLI headless mode", "Headless workflows are documented for Git-aware automation and review."),
  } }),
  product({ id: "factory-droid-cli", name: "Factory Droid CLI", categoryId: "coding-agent-harnesses", editorialOrder: 19, officialUrl: "https://docs.factory.ai/cli/getting-started/quickstart", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://docs.factory.ai/cli/getting-started/quickstart", "Factory Droid CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://docs.factory.ai/droid-exec/overview", "Factory Droid Exec", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/overview", "Factory Droid CLI overview", ["harness-extension-protocol", "harness-subagents"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/settings", "Factory Droid settings", ["harness-project-instructions", "harness-permission-controls"]),
    "harness-sandbox": capability("built-in", "https://docs.factory.ai/enterprise/llm-safety-and-agent-controls", "Factory agent controls", "Factory documents sandbox controls for agent execution."),
  } }),
  product({ id: "codewhale", name: "CodeWhale", categoryId: "coding-agent-harnesses", editorialOrder: 20, officialUrl: "https://github.com/Hmbown/CodeWhale", repository: repo("Hmbown/CodeWhale"), repoMetricId: "codewhale", tags: ["cli", "multi-model", "resume", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/Hmbown/CodeWhale", "CodeWhale repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-permission-controls", "harness-sandbox", "harness-checkpoints", "harness-subagents", "harness-structured-output"], undefined, "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://github.com/Hmbown/CodeWhale/blob/main/docs/CONFIGURATION.md", "CodeWhale configuration", "AGENTS.md is the canonical project instruction file; CLAUDE.md and .claude/instructions.md are compatibility fallbacks.", "repository-derived"),
  } }),
  product({ id: "antigravity-cli", name: "Antigravity CLI", categoryId: "coding-agent-harnesses", editorialOrder: 21, officialUrl: "https://antigravity.google/docs/cli-overview", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://antigravity.google/docs/cli-overview", "Antigravity CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://antigravity.google/docs/cli/headless/", "Antigravity headless mode", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/features", "Antigravity CLI features", ["harness-extension-protocol", "harness-checkpoints", "harness-subagents", "harness-git-workflow"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/best-practices/", "Antigravity CLI best practices", ["harness-project-instructions", "harness-multimodal-input"]),
    "harness-permission-controls": capability("built-in", "https://www.antigravity.google/docs/cli/permissions", "Antigravity CLI permissions", "First-party permission controls govern tool execution."),
    "harness-sandbox": capability("built-in", "https://www.antigravity.google/docs/cli/sandbox/", "Antigravity CLI sandbox", "First-party documentation describes the CLI execution sandbox."),
  } }),
  product({ id: "muse-code", name: "Muse Code", categoryId: "coding-agent-harnesses", editorialOrder: 22, officialUrl: null, tags: ["cli", "vendor-client", "resume", "source-needed"], source: "unknown", execution: "unknown", status: "source-needed" }),
  product({ id: "qwen-code", name: "Qwen Code", categoryId: "coding-agent-harnesses", editorialOrder: 23, officialUrl: "https://github.com/QwenLM/qwen-code", repository: repo("QwenLM/qwen-code"), repoMetricId: "qwen-code", tags: ["cli", "vendor-model", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "First-party standalone installers are documented for macOS, Windows, and Linux.", source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/QwenLM/qwen-code", "Qwen Code repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol"], undefined, "repository-derived"),
    "harness-subagents": capability("built-in", "https://github.com/QwenLM/qwen-code", "Qwen Code repository", "Auto-Memory, Auto-Skills, SubAgents, Agent Teams, and MCP are documented out of the box.", "repository-derived"),
    "harness-structured-output": capability("built-in", "https://github.com/QwenLM/qwen-code", "Qwen Code repository", "Headless qwen -p mode is documented for scripts, CI, and batch processing.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/", "Qwen Code memory", "Project instruction and memory files are loaded as documented context."),
    "harness-permission-controls": capability("built-in", "https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md", "Qwen Code settings", "Documented settings control tool permissions."),
    "harness-sandbox": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/", "Qwen Code sandbox", "First-party documentation describes isolated tool execution."),
    "harness-checkpoints": capability("built-in", "https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md", "Qwen Code settings", "Checkpointing is a documented configurable capability."),
    "harness-git-workflow": capability("limited", "https://github.com/QwenLM/qwen-code/blob/main/docs/users/configuration/settings.md", "Qwen Code settings", "Git attribution is documented; broader automated review delivery is not asserted."),
    "harness-multimodal-input": capability("built-in", "https://qwenlm.github.io/qwen-code-docs/en/developers/tools/file-system/", "Qwen Code filesystem tools", "The first-party file tool supports multimodal file inputs."),
  } }),
  product({ id: "pi-coding-agent", name: "Pi coding agent", categoryId: "coding-agent-harnesses", editorialOrder: 24, officialUrl: "https://github.com/earendil-works/pi", repository: repo("earendil-works/pi"), repoMetricId: "pi", tags: ["cli", "multi-model", "resume", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/earendil-works/pi#readme", "Pi coding agent repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol"]),
    "harness-permission-controls": capability("limited", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Runs with launcher-process permissions; stronger boundaries require a documented container or sandbox pattern.", "repository-derived"),
    "harness-sandbox": capability("via-integration", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Gondolin, Docker, and OpenShell are documented isolation patterns rather than a default built-in boundary.", "repository-derived"),
    ...builtInClaims("https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", ["harness-project-instructions", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    ...Object.fromEntries(["harness-checkpoints", "harness-subagents", "harness-git-workflow"].map((id) => [id, capability("via-extension", "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", "The project documents this as an extension capability rather than Pi core.", "repository-derived")])),
  } }),
  product({ id: "opencode", name: "OpenCode CLI", categoryId: "coding-agent-harnesses", editorialOrder: 25, officialUrl: "https://opencode.ai/docs/cli/", repository: repo("anomalyco/opencode"), repoMetricId: "opencode", tags: ["cli", "multi-model", "desktop-client", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://opencode.ai/docs/cli/", "OpenCode CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-structured-output"]),
    "harness-project-instructions": capability("built-in", "https://opencode.ai/docs/rules", "OpenCode rules", "Project and global instruction files are documented."),
    "harness-permission-controls": capability("built-in", "https://opencode.ai/docs/permissions/", "OpenCode permissions", "Permission rules can allow, ask, or deny tool use."),
    "harness-subagents": capability("built-in", "https://opencode.ai/docs/agents/", "OpenCode agents", "Primary agents can invoke documented subagents."),
    "harness-checkpoints": capability("built-in", "https://opencode.ai/v2/docs/snapshots", "OpenCode snapshots", "Snapshots support restoring earlier project state."),
    "harness-multimodal-input": capability("built-in", "https://opencode.ai/v2/docs/attachments", "OpenCode attachments", "Sessions accept documented file and image attachments."),
  } }),
  product({ id: "goose", name: "Goose CLI", categoryId: "coding-agent-harnesses", editorialOrder: 26, officialUrl: "https://github.com/aaif-goose/goose", repository: repo("aaif-goose/goose"), repoMetricId: "goose", tags: ["cli", "multi-model", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/aaif-goose/goose#readme", "Goose CLI repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-extension-protocol"], undefined, "repository-derived"),
    ...builtInClaims("https://block.github.io/goose/index.html", "Goose documentation", ["harness-permission-controls", "harness-sandbox", "harness-subagents"]),
    "harness-session-resume": capability("built-in", "https://goose-docs.ai/docs/guides/sessions/session-management/", "Goose session management", "Named CLI sessions are saved automatically and can be resumed by name or session ID."),
    "harness-project-instructions": capability("built-in", "https://goose-docs.ai/docs/guides/context-engineering/using-goosehints/", "Goose project hints", "AGENTS.md and .goosehints load hierarchically as global and project context."),
  } }),
  product({ id: "aider", name: "Aider", categoryId: "coding-agent-harnesses", editorialOrder: 27, officialUrl: "https://github.com/Aider-AI/aider", repository: repo("Aider-AI/aider"), repoMetricId: "aider", tags: ["cli", "multi-model", "git-native", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/Aider-AI/aider", "Aider repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume"]),
    "harness-git-workflow": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Repository map plus automatic Git commits, diffs, and familiar Git undo.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Images and web pages can be attached as context.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://aider.chat/docs/usage/conventions.html", "Aider conventions", "Repository convention files can provide persistent project instructions."),
    "harness-checkpoints": capability("built-in", "https://aider.chat/docs/git.html", "Aider Git integration", "Automatic commits and /undo provide a Git-backed rollback point."),
  } }),
  product({ id: "grok-build", name: "Grok Build", categoryId: "coding-agent-harnesses", editorialOrder: 28, officialUrl: "https://github.com/xai-org/grok-build", repository: repo("xai-org/grok-build"), repoMetricId: "grok-build", tags: ["cli", "vendor-model", "source-transparent", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/xai-org/grok-build", "Grok Build repository", ["harness-interactive-cli", "harness-headless", "harness-extension-protocol", "harness-sandbox", "harness-checkpoints", "harness-git-workflow"], undefined, "repository-derived"),
    "harness-multi-provider": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/11-custom-models.md", "Grok Build custom models", "BYOK, Ollama, and OpenAI-compatible endpoints are documented model options.", "repository-derived"),
    "harness-session-resume": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/17-sessions.md", "Grok Build session management", "Sessions can be saved, loaded, resumed, and rewound.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/12-project-rules.md", "Grok Build project rules", "Project rules are loaded from documented AGENTS.md files.", "repository-derived"),
    "harness-permission-controls": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/22-permissions-and-safety.md", "Grok Build permissions and safety", "First-party user guidance documents tool permissions and safety controls.", "repository-derived"),
    "harness-subagents": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/16-subagents.md", "Grok Build subagents", "Subagents and personas are documented built-in capabilities.", "repository-derived"),
    "harness-structured-output": capability("built-in", "https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/14-headless-mode.md", "Grok Build headless mode", "Headless mode provides documented machine-readable output formats.", "repository-derived"),
  } }),

  // 5. IDE extensions
  product({ id: "github-copilot-vscode", name: "GitHub Copilot for IDEs", categoryId: "ide-extensions", editorialOrder: 1, officialUrl: "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension?tool=vscode", tags: ["vscode", "visual-studio", "jetbrains", "eclipse", "xcode", "neovim", "autocomplete", "agent-panel", "background-agent-client"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/reference/copilot-feature-matrix?tool=vscode", "GitHub Copilot feature matrix", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-background-delegation", "extension-host-vscode", "extension-host-jetbrains"]),
    "extension-mcp": capability("built-in", "https://code.visualstudio.com/docs/copilot/concepts/customization", "VS Code agent customization", "VS Code agent customization includes MCP tools and servers."),
    "extension-codebase-context": capability("built-in", "https://code.visualstudio.com/docs/agent-customization/custom-instructions", "VS Code custom instructions", "Workspace instructions, AGENTS.md, and file-scoped instruction files are automatically applied."),
    "extension-install-channel": factClaim("IDE marketplaces", "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-extension?tool=vscode", "Install the GitHub Copilot extension", "Separate official plugins are documented for VS Code, Visual Studio, JetBrains, Eclipse, Xcode, Vim, and Neovim."),
    "extension-tool-execution-boundary": factClaim("Host IDE + GitHub cloud", "https://docs.github.com/en/copilot/reference/copilot-feature-matrix?tool=vscode", "GitHub Copilot feature matrix"),
    "extension-remote-session-client": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", "GitHub Copilot coding agent documentation", "Supported IDE surfaces can delegate to and monitor the distinct GitHub Copilot coding agent."),
  } }),
  product({ id: "cline", name: "Cline extension", categoryId: "ide-extensions", editorialOrder: 2, officialUrl: "https://docs.cline.bot/", repository: repo("cline/cline"), repoMetricId: "cline", tags: ["vscode", "agent-panel", "cli", "oss"], source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://docs.cline.bot/", "Cline extension documentation", ["extension-hosts", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.cline.bot/usage/ide", "Cline IDE documentation", "First-party extension workflow runs in the VS Code panel."),
    "extension-checkpoints": capability("built-in", "https://docs.cline.bot/core-workflows/checkpoints", "Cline checkpoints documentation", "Shadow-Git checkpoints restore files, task history, or both."),
    "extension-permissions": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "Auto Approve controls reads, edits, commands, browser, MCP, and notifications."),
    "extension-mcp": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "MCP tools are a documented approval category in the extension."),
    "extension-install-channel": factClaim("VS Code Marketplace / Open VSX", "https://docs.cline.bot/usage/ide", "Cline IDE documentation"),
    "extension-tool-execution-boundary": factClaim("Host IDE", "https://docs.cline.bot/usage/ide", "Cline IDE documentation"),
    "extension-byok-local-model": capability("built-in", "https://docs.cline.bot/provider-config/overview", "Cline provider configuration", "Supports configured hosted providers, OpenAI-compatible endpoints, and local providers."),
  } }),
  product({ id: "continue", name: "Continue extension", categoryId: "ide-extensions", editorialOrder: 3, officialUrl: "https://docs.continue.dev/", repository: repo("continuedev/continue"), repoMetricId: "continue", tags: ["vscode", "jetbrains", "autocomplete", "agent-panel", "cli", "oss"], source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://docs.continue.dev/", "Continue extension documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party VS Code extension."),
    "extension-host-jetbrains": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party JetBrains extension with its own sidebar shortcut."),
    "extension-provider-choice": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Multiple hosted providers and self-hosted model providers can be configured by role."),
    "extension-mcp": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Agent mode can use tools supplied by MCP servers."),
    "extension-codebase-context": capability("built-in", "https://docs.continue.dev/customize/deep-dives/custom-providers", "Continue custom providers documentation", "Repository map, files, tree, Git diff, terminal, and embedding-backed codebase context."),
    "extension-install-channel": factClaim("VS Code and JetBrains marketplaces", "https://docs.continue.dev/getting-started/install", "Continue installation documentation"),
    "extension-tool-execution-boundary": factClaim("Host IDE", "https://docs.continue.dev/ide-extensions/agent/how-it-works", "Continue agent mode documentation"),
    "extension-byok-local-model": capability("built-in", "https://docs.continue.dev/customize/model-providers/overview", "Continue model providers", "Supports hosted providers, self-hosted endpoints, and local model providers."),
  } }),
  product({ id: "kilo-code", name: "Kilo Code extension", categoryId: "ide-extensions", editorialOrder: 4, officialUrl: "https://kilo.ai/docs/", repository: repo("Kilo-Org/kilocode"), repoMetricId: "kilo-code", tags: ["vscode", "jetbrains", "agent-panel", "cli", "oss"], source: "open-source", execution: ["host-ide-process"], claims: {
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
    "extension-install-channel": factClaim("VS Code and JetBrains marketplaces", "https://kilo.ai/docs/code-with-ai/platforms", "Kilo Code IDE platforms"),
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
    "extension-install-channel": factClaim("IDE marketplaces", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", "Amazon Q Developer in IDEs"),
    "extension-tool-execution-boundary": factClaim("Host IDE + AWS cloud", "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE.html", "Amazon Q Developer in IDEs"),
  } }),
  product({ id: "gemini-code-assist", name: "Gemini Code Assist IDE extension", categoryId: "ide-extensions", editorialOrder: 9, officialUrl: "https://developers.google.com/gemini-code-assist/docs/overview", tags: ["vscode", "jetbrains", "android-studio", "autocomplete", "agent-panel"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://developers.google.com/gemini-code-assist/docs/overview", "Gemini Code Assist overview", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-codebase-context"]),
    "extension-install-channel": factClaim("VS Code and JetBrains marketplaces", "https://developers.google.com/gemini-code-assist/docs/overview", "Gemini Code Assist overview"),
    "extension-tool-execution-boundary": factClaim("Host IDE + Google cloud", "https://developers.google.com/gemini-code-assist/docs/overview", "Gemini Code Assist overview"),
  } }),
  product({ id: "jetbrains-ai-assistant", name: "JetBrains AI Assistant", categoryId: "ide-extensions", editorialOrder: 10, officialUrl: "https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", tags: ["jetbrains", "autocomplete", "agent-panel", "external-agents"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://www.jetbrains.com/help/idea/ai-assistant-in-jetbrains-ides.html", "JetBrains AI Assistant overview", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-jetbrains", "extension-provider-choice", "extension-codebase-context"]),
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
    "extension-background-delegation": capability("limited", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", "Asynchronous execution is documented, not a hosted delegated-job service.", "repository-derived"),
    "extension-install-channel": factClaim("Neovim plugin manager", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", undefined, "repository-derived"),
    "extension-tool-execution-boundary": factClaim("Neovim process + local ACP agents", "https://github.com/olimorris/codecompanion.nvim/blob/main/doc/codecompanion.txt", "CodeCompanion.nvim documentation", undefined, "source-inspected"),
    "extension-byok-local-model": capability("built-in", "https://github.com/olimorris/codecompanion.nvim", "CodeCompanion.nvim repository", "Multiple provider adapters and ACP-compatible local agents are supported.", "repository-derived"),
  } }),
  product({ id: "avante-nvim", name: "avante.nvim", categoryId: "ide-extensions", editorialOrder: 14, officialUrl: "https://github.com/yetone/avante.nvim", repository: repo("yetone/avante.nvim"), repoMetricId: "avante-nvim", tags: ["neovim", "agent-panel", "acp", "multi-provider", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-process", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/yetone/avante.nvim", "avante.nvim repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-provider-choice", "extension-codebase-context"], undefined, "repository-derived"),
    "extension-install-channel": factClaim("Neovim plugin manager", "https://github.com/yetone/avante.nvim", "avante.nvim repository", undefined, "repository-derived"),
    "extension-tool-execution-boundary": factClaim("Neovim process + local ACP agents", "https://github.com/yetone/avante.nvim", "avante.nvim repository", undefined, "repository-derived"),
    "extension-byok-local-model": capability("built-in", "https://github.com/yetone/avante.nvim", "avante.nvim repository", "Configurable model providers and ACP agents are supported.", "repository-derived"),
  } }),
  product({ id: "refact-ide-plugins", name: "Refact IDE plugins", categoryId: "ide-extensions", editorialOrder: 15, officialUrl: "https://github.com/smallcloudai/refact", repository: repo("smallcloudai/refact"), repoMetricId: "refact", tags: ["vscode", "jetbrains", "visual-studio", "sublime", "neovim", "self-hosted", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["host-ide-process", "local-daemon", "vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/smallcloudai/refact", "Refact repository", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-host-vscode", "extension-host-jetbrains", "extension-provider-choice", "extension-mcp", "extension-codebase-context"], undefined, "repository-derived"),
    "extension-install-channel": factClaim("IDE marketplaces / editor package managers", "https://github.com/smallcloudai/refact-lsp/blob/main/README.md", "Refact agent README", undefined, "source-inspected"),
    "extension-tool-execution-boundary": factClaim("Local Refact agent/LSP + selectable server", "https://github.com/smallcloudai/refact-lsp/blob/main/README.md", "Refact agent README", undefined, "source-inspected"),
    "extension-byok-local-model": capability("built-in", "https://github.com/smallcloudai/refact", "Refact repository", "Cloud, BYOK, and self-hosted server paths are supported.", "repository-derived"),
  } }),

  // 6. Cloud and background agents
  product({ id: "openai-codex-cloud", name: "OpenAI Codex cloud", categoryId: "cloud-agents", editorialOrder: 1, officialUrl: "https://openai.com/codex/", tags: ["issue-to-pr", "sandbox", "github", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], claims: {
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
  product({ id: "github-copilot-coding-agent", name: "GitHub Copilot coding agent", categoryId: "cloud-agents", editorialOrder: 2, officialUrl: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", tags: ["issue-to-pr", "github", "background", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", "GitHub Copilot coding agent documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result"]),
    "cloud-intake-surfaces": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub agents panel, issues, VS Code, PR comments, API, schedules, and event automations."),
    "cloud-code-hosts": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub repositories only. Treat this positive scope as a fact, not a negative score."),
    "cloud-environment-config": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Ephemeral GitHub Actions-powered development environment."),
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
  product({ id: "devin", name: "Devin", categoryId: "cloud-agents", editorialOrder: 3, officialUrl: "https://devin.ai/", tags: ["cloud-sandbox", "issue-to-pr", "cli-client", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], claims: {
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
    "cloud-environment-config": capability("built-in", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Tasks run in a fresh environment configured from the connected repository."),
    "cloud-live-steering": capability("built-in", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Operators review the plan, monitor progress, and provide follow-up direction."),
    "cloud-execution-owner": factClaim("Google cloud", "https://jules.google/docs/changelog/2025-05-19", "Jules launch architecture"),
    "cloud-isolation-unit": factClaim("Fresh cloud VM per task", "https://jules.google/docs/changelog/2025-05-19", "Jules launch architecture"),
    "cloud-human-takeover": capability("limited", "https://jules.google/docs/running-tasks/", "Jules running tasks", "Plan review and follow-up are documented; direct shell takeover is not."),
    "cloud-result-type": factClaim("Branch and pull request", "https://jules.google/docs/running-tasks/", "Jules running tasks"),
  } }),
  product({ id: "claude-code-web", name: "Claude Code on the web", categoryId: "cloud-agents", editorialOrder: 5, officialUrl: "https://code.claude.com/docs/en/claude-code-on-the-web", tags: ["github", "local-bundle", "cloud-vm", "teleport", "research-preview"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "paired-machine"], status: "beta", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-project-instructions", "cloud-live-steering"]),
    "cloud-execution-owner": factClaim("Anthropic cloud", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
    "cloud-isolation-unit": factClaim("Fresh isolated VM per session", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
    "cloud-human-takeover": capability("built-in", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation", "A cloud session can be teleported to the local Claude Code CLI."),
    "cloud-result-type": factClaim("Branch, pull request, or local CLI handoff", "https://code.claude.com/docs/en/claude-code-on-the-web", "Claude Code on the web documentation"),
  } }),
  product({ id: "cursor-cloud-agents", name: "Cursor Cloud Agents", categoryId: "cloud-agents", editorialOrder: 6, officialUrl: "https://cursor.com/docs/cloud-agent", tags: ["github", "cloud-vm", "self-hosted-option", "branch-handoff"], platform: ["web", "macos", "windows", "linux"], source: "hosted-service", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-execution-owner": factClaim("Cursor cloud or self-hosted", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation"),
    "cloud-isolation-unit": factClaim("Isolated VM", "https://cursor.com/docs/cloud-agent/builds", "Cursor Cloud Agent builds"),
    "cloud-human-takeover": capability("built-in", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation", "Operators can follow runs and hand branches back to the desktop IDE."),
    "cloud-triggered-automation": capability("built-in", "https://docs.cursor.com/background-agent/api/overview", "Cursor Cloud Agent API", "First-party API starts and monitors cloud agent runs."),
    "cloud-result-type": factClaim("Pushed branch or pull request", "https://cursor.com/docs/cloud-agent", "Cursor Cloud Agents documentation"),
  } }),
  product({ id: "factory-cloud-sessions", name: "Factory Droid Computers / cloud sessions", categoryId: "cloud-agents", editorialOrder: 7, officialUrl: "https://docs.factory.ai/", tags: ["cloud-computer", "templates", "web", "mobile", "pull-request"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.factory.ai/", "Factory documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-execution-owner": factClaim("Factory cloud or operator machine", "https://docs.factory.ai/", "Factory documentation"),
    "cloud-isolation-unit": factClaim("Cloud computer from a template", "https://docs.factory.ai/droid-computers/cloud-templates", "Factory cloud templates"),
    "cloud-human-takeover": capability("built-in", "https://docs.factory.ai/", "Factory documentation", "Sessions are synchronized to web and mobile for operator review and steering."),
    "cloud-result-type": factClaim("Reviewable diff, branch, or pull request", "https://docs.factory.ai/", "Factory documentation"),
  } }),
  product({ id: "codegen-agent", name: "Codegen agent", categoryId: "cloud-agents", editorialOrder: 8, officialUrl: "https://docs.codegen.com/", tags: ["github", "api", "slack", "linear", "jira", "pull-request"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://docs.codegen.com/integrations/github", "Codegen GitHub integration", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts"]),
    "cloud-execution-owner": factClaim("Codegen cloud", "https://docs.codegen.com/api-reference/agents/create-agent-run", "Codegen agent-run API"),
    "cloud-triggered-automation": capability("built-in", "https://docs.codegen.com/api-reference/agents/create-agent-run", "Codegen agent-run API", "Agent runs can be created and monitored through the API; Slack, Linear, and Jira are documented intake surfaces."),
    "cloud-result-type": factClaim("Branch or pull request", "https://docs.codegen.com/integrations/github", "Codegen GitHub integration"),
  } }),
  product({ id: "gitlab-duo-developer-flow", name: "GitLab Duo Developer Flow", categoryId: "cloud-agents", editorialOrder: 9, officialUrl: "https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", repository: repo("gitlab-org/gitlab"), repoMetricId: "gitlab", tags: ["gitlab", "ci-runner", "merge-request", "open-core"], platform: ["web"], source: "split-source", execution: ["user-cloud", "local-process"], status: "active", claims: {
    ...builtInClaims("https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", "GitLab Duo Developer Flow", ["cloud-repo-intake", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-project-instructions"]),
    "cloud-sandbox": capability("limited", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution", "Flows run through configured GitLab CI/CD runners or locally; isolation depends on operator runner configuration."),
    "cloud-execution-owner": factClaim("Customer CI runner or local IDE", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution"),
    "cloud-isolation-unit": factClaim("CI job or local process", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution"),
    "cloud-triggered-automation": capability("built-in", "https://docs.gitlab.com/user/duo_agent_platform/flows/execution/", "GitLab Duo flow execution", "Developer Flow can be executed asynchronously through GitLab CI/CD."),
    "cloud-result-type": factClaim("Commit or draft merge request", "https://docs.gitlab.com/user/duo_agent_platform/flows/foundational_flows/developer/", "GitLab Duo Developer Flow"),
  } }),
  product({ id: "coder-agents", name: "Coder Agents", categoryId: "cloud-agents", editorialOrder: 10, officialUrl: "https://coder.com/docs/ai-coder/agents", repository: repo("coder/coder"), repoMetricId: "coder", tags: ["self-hosted", "workspaces", "customer-infrastructure", "open-core", "beta"], platform: ["web"], source: "split-source", execution: ["user-cloud"], status: "beta", claims: {
    "cloud-repo-intake": capability("limited", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Tasks select a Coder template and workspace rather than requiring GitHub-only intake."),
    ...builtInClaims("https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", ["cloud-sandbox", "cloud-live-observability", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-environment-config", "cloud-live-steering"]),
    "cloud-durable-result": capability("limited", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Durable files, diffs, and attachments are documented; a pull request is not guaranteed."),
    "cloud-execution-owner": factClaim("Operator Coder deployment", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
    "cloud-isolation-unit": factClaim("Provisioned Coder workspace", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
    "cloud-human-takeover": capability("built-in", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture", "Operators can open the same provisioned workspace through Coder."),
    "cloud-result-type": factClaim("Workspace files, diff, and attachments", "https://coder.com/docs/ai-coder/agents", "Coder Agents architecture"),
  } }),
  product({ id: "replit-agent-background-tasks", name: "Replit Agent background tasks", categoryId: "cloud-agents", editorialOrder: 11, officialUrl: "https://docs.replit.com/core-concepts/agent/task-system", tags: ["replit", "background-tasks", "checkpoints", "deployment"], platform: ["web", "ios", "android"], source: "hosted-service", execution: ["vendor-cloud"], status: "active", claims: {
    "cloud-repo-intake": capability("limited", "https://docs.replit.com/category/replit-apps", "Replit Apps documentation", "Starts from a Replit project or imported repository rather than a code-host issue assignment."),
    ...builtInClaims("https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", ["cloud-sandbox", "cloud-live-observability", "cloud-intake-surfaces", "cloud-parallel-tasks", "cloud-live-steering"]),
    "cloud-durable-result": capability("limited", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", "The primary result is a checkpointed Replit project or deployment, not necessarily a pull request."),
    "cloud-execution-owner": factClaim("Replit cloud", "https://docs.replit.com/learn/foundations/introduction-to-ai", "Replit AI foundations"),
    "cloud-isolation-unit": factClaim("Durable Replit workspace", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system"),
    "cloud-human-takeover": capability("built-in", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system", "The operator can edit the shared Replit workspace around independent task threads."),
    "cloud-result-type": factClaim("Checkpoint, app, or deployment", "https://docs.replit.com/core-concepts/agent/task-system", "Replit Agent task system"),
  } }),
  product({ id: "openhands-cloud", name: "OpenHands Cloud", categoryId: "cloud-agents", editorialOrder: 12, officialUrl: "https://github.com/OpenHands/OpenHands-Cloud", repository: repo("OpenHands/OpenHands-Cloud"), repoMetricId: "openhands-cloud", tags: ["github", "gitlab", "cloud", "self-hosted-enterprise", "source-available"], platform: ["web"], source: "source-available", execution: ["vendor-cloud", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/OpenHands/OpenHands", "OpenHands repository", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result", "cloud-intake-surfaces", "cloud-code-hosts", "cloud-parallel-tasks", "cloud-environment-config", "cloud-project-instructions", "cloud-live-steering"], undefined, "repository-derived"),
    "cloud-execution-owner": factClaim("OpenHands cloud or enterprise self-host", "https://github.com/OpenHands/OpenHands-Cloud", "OpenHands Cloud repository", undefined, "repository-derived"),
    "cloud-isolation-unit": factClaim("Sandboxed OpenHands runtime", "https://github.com/OpenHands/OpenHands", "OpenHands repository", undefined, "repository-derived"),
    "cloud-human-takeover": capability("built-in", "https://github.com/OpenHands/OpenHands", "OpenHands repository", "The web workspace exposes terminal, browser, files, and live conversation for operator intervention.", "repository-derived"),
    "cloud-triggered-automation": capability("built-in", "https://github.com/apps/openhands-ai", "OpenHands GitHub App", "GitHub App integration can start and update repository work."),
    "cloud-result-type": factClaim("Repository changes or pull request", "https://github.com/OpenHands/OpenHands", "OpenHands repository", undefined, "repository-derived"),
  } }),

  // 7. Remote companions and relays
  product({ id: "happy", name: "Happy", categoryId: "remote-companions", editorialOrder: 1, officialUrl: "https://github.com/slopus/happy", repository: repo("slopus/happy"), repoMetricId: "happy", tags: ["mobile", "web", "e2e-encryption", "claude", "codex", "oss"], platform: ["web", "ios", "android"], source: "open-source", execution: ["paired-machine", "vendor-cloud"], claims: {
    ...builtInClaims("https://github.com/slopus/happy", "Happy repository", ["remote-client-reach", "remote-existing-session", "remote-approvals"], undefined, "repository-derived"),
    "remote-encryption": capability("limited", "https://github.com/slopus/happy/blob/main/docs/README.md", "Happy architecture documentation", "End-to-end encryption is documented for session content; do not generalize the claim to every stored credential.", "source-inspected"),
    "remote-native-ios": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party iOS app.", "repository-derived"),
    "remote-native-android": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party Android app.", "repository-derived"),
    "remote-browser-pwa": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "First-party web app.", "repository-derived"),
    "remote-supported-harnesses": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Explicit wrappers for Claude Code and Codex.", "repository-derived"),
    "remote-terminal-input": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Switch control between phone and desktop; remote mode steers the wrapped session.", "repository-derived"),
    "remote-notifications": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Push alerts for permission requests and errors.", "repository-derived"),
    "remote-hosting-boundary": capability("limited", "https://github.com/slopus/happy/blob/main/docs/README.md", "Happy architecture documentation", "Encrypted session sync uses the Happy Server relay. The claim is scoped to session content, not every stored credential.", "source-inspected"),
    "remote-agent-aware": capability("built-in", "https://github.com/slopus/happy", "Happy repository", "Happy wraps Claude Code and Codex sessions and understands permission requests and errors.", "repository-derived"),
    "remote-input-model": factClaim("Follow-ups, terminal control, and approve/deny", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Existing session on paired machine", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Hosted encrypted sync relay; self-hostable server", "https://github.com/slopus/happy-server", "Happy Server repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("End-to-end encrypted session content", "https://github.com/slopus/happy-server", "Happy Server security model", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Survives client disconnect while host session runs", "https://github.com/slopus/happy", "Happy repository", undefined, "repository-derived"),
  } }),
  product({ id: "vibetunnel", name: "VibeTunnel", categoryId: "remote-companions", editorialOrder: 2, officialUrl: "https://github.com/amantus-ai/vibetunnel", repository: repo("amantus-ai/vibetunnel"), repoMetricId: "vibetunnel", tags: ["browser-terminal", "mobile-web", "server-owned-pty", "oss"], platform: ["macos", "web"], source: "open-source", execution: ["local-daemon", "paired-machine"], claims: {
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
  product({ id: "omnara", name: "Omnara", categoryId: "remote-companions", editorialOrder: 3, officialUrl: "https://github.com/omnara-ai/omnara", repository: repo("omnara-ai/omnara", "deprecated-predecessor"), tags: ["web", "mobile", "durable-agent-api", "pivoted", "oss"], source: "open-source", execution: ["vendor-cloud"], status: "pivoted" }),
  product({ id: "shunt", name: "Shunt", categoryId: "remote-companions", editorialOrder: 4, officialUrl: "https://shunt.app/", tags: ["remote-tmux", "permissions", "mobile"], platform: ["macos", "linux", "web", "ios"], platformNote: "macOS and Linux daemon; embedded web/PWA client; native iOS client is preview/TestFlight.", source: "unknown", execution: ["paired-machine"], claims: {
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
  product({ id: "claude-code-remote-control", name: "Claude Code Remote Control", categoryId: "remote-companions", editorialOrder: 5, officialUrl: "https://code.claude.com/docs/en/remote-control", tags: ["claude-code", "browser", "mobile", "approvals", "research-preview"], platform: ["web", "ios", "android"], source: "proprietary", execution: ["paired-machine", "vendor-cloud"], status: "beta", claims: {
    ...builtInClaims("https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", ["remote-client-reach", "remote-existing-session", "remote-approvals", "remote-native-ios", "remote-native-android", "remote-browser-pwa", "remote-supported-harnesses", "remote-notifications", "remote-agent-aware"]),
    "remote-encryption": capability("limited", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "TLS and scoped credentials are documented; end-to-end or zero-knowledge encryption is not claimed."),
    "remote-terminal-input": capability("limited", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "Remote Control sends Claude Code follow-ups and approvals rather than exposing an arbitrary raw terminal."),
    "remote-hosting-boundary": capability("built-in", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation", "The local CLI makes outbound HTTPS connections through Anthropic services; no inbound port is required."),
    "remote-input-model": factClaim("Follow-ups and structured approvals", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-host-ownership": factClaim("Existing local CLI or VS Code session", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-relay-deployment": factClaim("Anthropic-hosted relay", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-transport-security": factClaim("Outbound HTTPS with scoped credentials", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
    "remote-session-durability": factClaim("Survives remote client disconnect; local session must remain", "https://code.claude.com/docs/en/remote-control", "Claude Code Remote Control documentation"),
  } }),
  product({ id: "code-server", name: "code-server", categoryId: "remote-companions", editorialOrder: 6, officialUrl: "https://github.com/coder/code-server", repository: repo("coder/code-server"), repoMetricId: "code-server", tags: ["browser-ide", "self-hosted", "vscode-compatible", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/coder/code-server", "code-server repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", "Reconnects to a server-owned editor workspace, not an agent conversation.", "source-inspected"),
    "remote-agent-aware": capability("limited", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", "This baseline exposes a remote VS Code-compatible workspace rather than a normalized agent-session protocol.", "source-inspected"),
    "remote-input-model": factClaim("Full browser IDE, terminal, and file editing", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Self-hosted remote editor workspace", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted server; user supplies proxy/VPN", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", undefined, "source-inspected"),
    "remote-transport-security": factClaim("Deployment-dependent TLS or secure tunnel", "https://github.com/coder/code-server/blob/main/docs/FAQ.md", "code-server FAQ", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Server workspace survives browser close", "https://github.com/coder/code-server", "code-server repository", undefined, "repository-derived"),
  } }),
  product({ id: "openvscode-server", name: "OpenVSCode Server", categoryId: "remote-companions", editorialOrder: 7, officialUrl: "https://github.com/gitpod-io/openvscode-server", repository: repo("gitpod-io/openvscode-server"), repoMetricId: "openvscode-server", tags: ["browser-ide", "self-hosted", "code-oss", "oss"], platform: ["linux", "web"], source: "open-source", execution: ["local-daemon", "user-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", "Reconnects to a server-owned Code OSS workspace, not an agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", "This baseline exposes Code OSS in a browser rather than a normalized agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Full browser IDE, terminal, and file editing", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Self-hosted Code OSS server", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted server", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Deployment-dependent", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Server workspace survives browser close", "https://github.com/gitpod-io/openvscode-server", "OpenVSCode Server repository", undefined, "repository-derived"),
  } }),
  product({ id: "vscode-remote-development", name: "VS Code Remote Development extensions", categoryId: "remote-companions", editorialOrder: 8, officialUrl: "https://code.visualstudio.com/docs/remote/remote-overview", tags: ["vscode", "ssh", "containers", "wsl", "tunnels"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["ssh-host", "container", "user-cloud"], status: "active", claims: {
    "remote-existing-session": capability("limited", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", "Connects to a remote development workspace, not an agent conversation."),
    ...builtInClaims("https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", ["remote-terminal-input", "remote-hosting-boundary"]),
    "remote-agent-aware": capability("limited", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview", "The suite moves the editor extension host and terminal rather than defining a normalized agent-session protocol."),
    "remote-input-model": factClaim("Full desktop IDE, terminal, and file editing", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-host-ownership": factClaim("SSH host, container, WSL, or tunnel workspace", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-relay-deployment": factClaim("SSH, container transport, WSL, or VS Code tunnel", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-transport-security": factClaim("Selected transport", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
    "remote-session-durability": factClaim("Remote workspace persists; IDE connection can reconnect", "https://code.visualstudio.com/docs/remote/remote-overview", "VS Code Remote Development overview"),
  } }),
  product({ id: "sshx", name: "sshx", categoryId: "remote-companions", editorialOrder: 9, officialUrl: "https://github.com/ekzhang/sshx", repository: repo("ekzhang/sshx"), repoMetricId: "sshx", tags: ["collaborative-terminal", "browser", "e2e-encryption", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "paired-machine", "vendor-cloud"], status: "active", claims: {
    ...builtInClaims("https://github.com/ekzhang/sshx", "sshx repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-encryption"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/ekzhang/sshx", "sshx repository", "Shares the command launched under sshx rather than attaching to any arbitrary existing agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/ekzhang/sshx", "sshx repository", "sshx is a generic collaborative terminal rather than a normalized agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Raw collaborative terminal input", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Command launched on paired host", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Hosted relay", "https://github.com/ekzhang/sshx", "sshx repository", "Development self-hosting is not packaged as a supported deployment.", "repository-derived"),
    "remote-transport-security": factClaim("Argon2-derived AES end-to-end encryption", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "source-inspected"),
    "remote-session-durability": factClaim("Host command must remain running", "https://github.com/ekzhang/sshx", "sshx repository", undefined, "repository-derived"),
  } }),
  product({ id: "upterm", name: "Upterm", categoryId: "remote-companions", editorialOrder: 10, officialUrl: "https://github.com/owenthereal/upterm", repository: repo("owenthereal/upterm"), repoMetricId: "upterm", tags: ["ssh", "terminal-sharing", "self-hosted-relay", "oss"], platform: ["macos", "windows", "linux"], source: "open-source", execution: ["local-daemon", "paired-machine", "vendor-cloud", "user-cloud"], status: "active", claims: {
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
  product({ id: "termix", name: "Termix", categoryId: "remote-companions", editorialOrder: 11, officialUrl: "https://github.com/Termix-SSH/Termix", repository: repo("Termix-SSH/Termix"), repoMetricId: "termix", tags: ["ssh", "rdp", "vnc", "web", "desktop", "mobile", "self-hosted", "oss"], platform: ["macos", "windows", "linux", "web", "ios", "android"], source: "open-source", execution: ["local-daemon", "user-cloud", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/Termix-SSH/Termix", "Termix repository", ["remote-client-reach", "remote-existing-session", "remote-native-ios", "remote-native-android", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary", "remote-session-history"], undefined, "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/Termix-SSH/Termix", "Termix repository", "Termix manages generic SSH, RDP, VNC, and Telnet sessions rather than a normalized coding-agent protocol.", "repository-derived"),
    "remote-input-model": factClaim("SSH terminal and remote desktop input", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Remote SSH/RDP/VNC/Telnet host", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Self-hosted Termix service", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Protocol and deployment-dependent", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Saved connection and shared-session history", "https://github.com/Termix-SSH/Termix", "Termix repository", undefined, "repository-derived"),
  } }),
  product({ id: "ttyd", name: "ttyd", categoryId: "remote-companions", editorialOrder: 12, officialUrl: "https://github.com/tsl0922/ttyd", repository: repo("tsl0922/ttyd"), repoMetricId: "ttyd", tags: ["browser-terminal", "websocket", "minimal-relay", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-daemon", "paired-machine"], status: "active", claims: {
    ...builtInClaims("https://github.com/tsl0922/ttyd", "ttyd repository", ["remote-client-reach", "remote-browser-pwa", "remote-terminal-input", "remote-hosting-boundary"], undefined, "repository-derived"),
    "remote-existing-session": capability("limited", "https://github.com/tsl0922/ttyd", "ttyd repository", "Shares the command or PTY launched by ttyd, not a normalized existing agent conversation.", "repository-derived"),
    "remote-agent-aware": capability("limited", "https://github.com/tsl0922/ttyd", "ttyd repository", "ttyd is a generic terminal-to-WebSocket bridge rather than an agent-session protocol.", "repository-derived"),
    "remote-input-model": factClaim("Raw browser terminal input", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-host-ownership": factClaim("Command or PTY on self-hosted machine", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-relay-deployment": factClaim("Direct self-hosted WebSocket service", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-transport-security": factClaim("Deployment-dependent TLS", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
    "remote-session-durability": factClaim("Host command must remain running", "https://github.com/tsl0922/ttyd", "ttyd repository", undefined, "repository-derived"),
  } }),

  // 8. Agent traces
  product({ id: "specstory", name: "SpecStory", categoryId: "agent-traces", editorialOrder: 1, officialUrl: "https://docs.specstory.com/", repository: repo("specstoryai/getspecstory", "source-tree"), repoMetricId: "specstory", tags: ["local-first", "markdown", "cloud-search", "cross-agent-resume", "redaction", "oss-cli", "specstory"], platform: ["macos", "windows", "linux", "web"], platformNote: "The SpecStory CLI and extensions run on macOS, Windows, and Linux; SpecStory Cloud is a browser service.", platformSource: { url: "https://docs.specstory.com/faqs", title: "SpecStory FAQs and platform paths" }, source: "split-source", execution: ["local-process", "host-ide-process", "vendor-cloud"], status: "active", claims: {
    "trace-capture-coverage": factClaim("CLI and IDE capture across Claude, Codex, Cursor, Droid, Antigravity, DeepSeek, and Copilot", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-storage-boundary": factClaim("Local Markdown by default; optional SpecStory Cloud sync", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-git-linkage": capability("limited", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "History lives inside the project as versionable Markdown, but automatic commit, branch, or worktree linkage is not established."),
    "trace-replay-resume": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "The CLI can resume across projects and supported agents from its local session index."),
    "trace-search-timeline": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "Local cross-project and cross-agent search plus optional Cloud search."),
    "trace-multi-harness": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "The current docs name Claude Code, Cursor CLI and IDE, Codex CLI, Droid, Antigravity, DeepSeek, and Copilot capture paths."),
    "trace-transcript-coverage": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "Prompts, responses, commands, and decisions are rendered as searchable Markdown."),
    "trace-tool-call-coverage": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents", "SpecStory terminal-agent overview", "Captured Markdown includes terminal-agent commands and outputs when present in the source session."),
    "trace-export-api": factClaim("Markdown, stdout/JSON CLI output, and Cloud API", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage"),
    "trace-redaction-privacy": capability("built-in", "https://docs.specstory.com/integrations/terminal-coding-agents/usage", "SpecStory CLI usage", "Local-first capture, explicit cloud opt-in, configurable secret redaction, and analytics opt-out are documented."),
    "trace-sharing": capability("built-in", "https://docs.specstory.com/cloud/session-sharing", "SpecStory session sharing", "Individual sessions can be shared explicitly; local Markdown can also travel through normal repository review."),
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
    "trace-redaction-privacy": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Detected secrets are redacted before persistent checkpoint storage; the project describes this as best-effort.", "repository-derived"),
    "trace-sharing": capability("built-in", "https://github.com/entireio/cli", "Entire CLI repository", "Checkpoint refs can use the code remote or a separate private checkpoint repository.", "repository-derived"),
    "trace-ci-analytics": capability("limited", "https://github.com/entireio", "Entire GitHub organization overview", "The dashboard browses activity across repositories; a dedicated CI analytics contract is not established.", "repository-derived"),
    "trace-self-hosting": capability("built-in", "https://entire.io/", "Entire product page", "Core checkpoint capture and storage are open-source, local, and repository-backed."),
  } }),
  product({ id: "tapes", name: "Tapes", categoryId: "agent-traces", editorialOrder: 3, officialUrl: "https://tapes.dev/docs/introduction/", repository: repo("papercomputeco/tapes"), repoMetricId: "tapes", tags: ["opentelemetry", "append-only", "postgresql", "semantic-search", "export", "self-hosted", "oss", "paper-compute"], platform: ["macos", "windows", "linux"], platformSource: { url: "https://tapes.dev/agents/", title: "Tapes agent installation" }, source: "open-source", execution: ["local-daemon", "container", "user-cloud"], status: "active", claims: {
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
];

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
