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
  | "remote-companions";

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
  | "remote-session";

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
  ],
  "agent-workbenches": [
    { id: "workbench-arbitrary-cli", label: "Arbitrary CLI agents", group: "Session admission" },
    { id: "workbench-named-sessions", label: "Durable named sessions", group: "Session identity" },
    { id: "workbench-pty-survives-ui", label: "Live PTY survives UI exit", group: "Live continuity" },
    { id: "workbench-cross-project-attention", label: "Cross-project attention state", group: "Attention" },
    { id: "workbench-editor", label: "Code editor", group: "Workbench depth" },
    { id: "workbench-file-tree", label: "Project file tree", group: "Workbench depth" },
    { id: "workbench-scm", label: "Source control workflow", group: "Workbench depth" },
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
    { id: "orchestrator-review-delivery", label: "Review and delivery flow", group: "Review and delivery" },
    { id: "orchestrator-worktrees", label: "Git worktree isolation", group: "Isolation" },
    { id: "orchestrator-containers", label: "Container or VM isolation", group: "Isolation" },
    { id: "orchestrator-task-board", label: "Task or Kanban board", group: "Planning" },
    { id: "orchestrator-inline-review", label: "Inline diff feedback", group: "Review" },
    { id: "orchestrator-pr-lifecycle", label: "Pull-request workflow", group: "Delivery" },
    { id: "orchestrator-remote-execution", label: "Remote execution", group: "Execution" },
    { id: "orchestrator-attention-signals", label: "Fleet attention signals", group: "Attention" },
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
  ],
  "remote-companions": [
    { id: "remote-client-reach", label: "Web or mobile client", group: "Client" },
    { id: "remote-existing-session", label: "Connects to an existing session", group: "Session ownership" },
    { id: "remote-approvals", label: "Remote approvals and follow-ups", group: "Interaction" },
    { id: "remote-encryption", label: "End-to-end encryption", group: "Security" },
    { id: "remote-native-ios", label: "Native iOS client", group: "Client" },
    { id: "remote-native-android", label: "Native Android client", group: "Client" },
    { id: "remote-browser-pwa", label: "Browser or PWA client", group: "Client" },
    { id: "remote-supported-harnesses", label: "Named agent harnesses", group: "Compatibility" },
    { id: "remote-terminal-input", label: "Live terminal input", group: "Interaction" },
    { id: "remote-notifications", label: "Push or attention notifications", group: "Attention" },
    { id: "remote-hosting-boundary", label: "Relay and hosting boundary", group: "Security" },
    { id: "remote-session-history", label: "Session history or recording", group: "Continuity" },
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
  category("code-editors", "Code editors and IDEs", "Editors", "/compare/editors/", 1, "Products organized around files, projects, and an editor window."),
  category("agent-workbenches", "Agent workbenches", "Agent IDEs", "/compare/agent-ides/", 2, "Products organized around named, recurring sessions inside projects."),
  category("agent-orchestrators", "Agent orchestrators", "Orchestrators", "/compare/orchestrators/", 3, "Products organized around delegated tasks in isolated workspaces."),
  category("coding-agent-harnesses", "Coding-agent harnesses", "Harnesses", "/compare/harnesses/", 4, "Processes that own one model conversation and its tool loop."),
  category("ide-extensions", "IDE extensions", "Extensions", "/compare/extensions/", 5, "Agent and assistance surfaces that depend on a host editor."),
  category("cloud-agents", "Cloud and background agents", "Cloud agents", "/compare/cloud-agents/", 6, "Remote jobs that return durable patches, branches, pull requests, or results."),
  category("remote-companions", "Remote companions and relays", "Remote", "/compare/remote/", 7, "Clients that observe or steer a session owned by another machine or product."),
];

const objectForCategory: Record<CategoryId, PrimaryObject> = {
  "code-editors": "file-or-project",
  "agent-workbenches": "named-session",
  "agent-orchestrators": "delegated-task",
  "coding-agent-harnesses": "agent-conversation",
  "ide-extensions": "host-ide-panel",
  "cloud-agents": "remote-job",
  "remote-companions": "remote-session",
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
          ? known(input.platform, sourceUrl, sourceTitle, "vendor-documented", input.platformNote)
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

export const comparisonProducts: readonly ComparisonProduct[] = [
  // 1. Code editors and IDEs
  product({
    id: "visual-studio-code", name: "Visual Studio Code", categoryId: "code-editors", editorialOrder: 1,
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
    id: "cursor-ide", name: "Cursor IDE", categoryId: "code-editors", editorialOrder: 2, officialUrl: "https://docs.cursor.com/en/get-started/quickstart",
    tags: ["agent-panel", "background-agent-client", "vscode-derived"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://docs.cursor.com/en/get-started/quickstart", "Cursor quickstart", ["editor-project-tree", "editor-agent-mode", "editor-inline-prediction"]),
      ...builtInClaims("https://docs.cursor.com/en/agent/terminal", "Cursor terminal documentation", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.cursor.com/context/model-context-protocol", "Cursor MCP documentation", ["editor-mcp"]),
      ...builtInClaims("https://docs.cursor.com/background-agent", "Cursor Background Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-remote-workspaces"]),
    },
  }),
  product({
    id: "windsurf", name: "Devin Desktop", categoryId: "code-editors", editorialOrder: 3, officialUrl: "https://docs.devin.ai/desktop/getting-started",
    tags: ["agent-panel", "vscode-derived", "formerly-windsurf", "local-agent"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://docs.devin.ai/desktop/getting-started", "Devin Desktop getting started", ["editor-project-tree", "editor-agent-mode"]),
      ...builtInClaims("https://docs.devin.ai/desktop/terminal", "Devin Desktop terminal", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://docs.devin.ai/desktop/tab/overview", "Devin Desktop Tab", ["editor-inline-prediction"]),
      ...builtInClaims("https://docs.devin.ai/desktop/cascade/mcp", "Devin Desktop MCP documentation", ["editor-mcp"]),
    },
  }),
  product({
    id: "zed", name: "Zed", categoryId: "code-editors", editorialOrder: 4, officialUrl: "https://zed.dev/docs/ai/overview", repository: repo("zed-industries/zed"), repoMetricId: "zed",
    tags: ["agent-panel", "terminal", "scm", "worktrees", "parallel-agents", "oss"], platform: ["macos", "linux"], source: "open-source", execution: ["local-process"],
    claims: {
      ...builtInClaims("https://zed.dev/docs/ai/zed-agent", "Zed Agent documentation", ["editor-project-tree", "editor-terminal", "editor-agent-mode", "editor-agent-shell-tools", "editor-change-review"]),
      ...builtInClaims("https://zed.dev/docs/ai/parallel-agents", "Zed Parallel Agents", ["editor-background-jobs", "editor-parallel-sessions", "editor-worktree-isolation"]),
      ...builtInClaims("https://zed.dev/docs/ai/edit-prediction", "Zed Edit Prediction", ["editor-inline-prediction"]),
      ...builtInClaims("https://zed.dev/docs/ai/agent-panel", "Zed Agent Panel", ["editor-mcp"]),
    },
  }),
  product({
    id: "kiro", name: "Kiro", categoryId: "code-editors", editorialOrder: 5, officialUrl: "https://kiro.dev/docs/ide/",
    tags: ["agent-panel", "spec-driven", "parallel-agents", "cloud-sessions"], platform: ["macos", "windows", "linux"], source: "unknown", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://kiro.dev/docs/ide/", "Kiro IDE documentation", ["editor-project-tree", "editor-agent-mode", "editor-mcp"]),
      ...builtInClaims("https://kiro.dev/docs/chat/dev-servers/", "Kiro dev servers", ["editor-terminal", "editor-agent-shell-tools"]),
      ...builtInClaims("https://kiro.dev/docs/ide/experimental/focus-mode", "Kiro Agent Focus", ["editor-background-jobs", "editor-parallel-sessions", "editor-change-review"]),
      ...builtInClaims("https://kiro.dev/ide/", "Kiro IDE product documentation", ["editor-remote-workspaces"]),
    },
  }),
  product({
    id: "void", name: "Void", categoryId: "code-editors", editorialOrder: 6, officialUrl: "https://github.com/voideditor/void", repository: repo("voideditor/void"), repoMetricId: "void",
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
    id: "cmux", name: "cmux", categoryId: "agent-workbenches", editorialOrder: 2, officialUrl: "https://github.com/manaflow-ai/cmux", repository: repo("manaflow-ai/cmux"), repoMetricId: "cmux",
    tags: ["terminal", "session-restore", "browser", "notifications", "remote-ssh", "oss"], platform: ["macos"], platformNote: "iOS is a companion surface, not the evaluated desktop host.", source: "open-source", execution: ["local-process", "ssh-host"],
    claims: {
      ...builtInClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux#session-restore", "cmux session restore", ["workbench-pty-survives-ui", "workbench-session-recovery"], "Restores layouts, working directories, scrollback, and supported agent conversations through native resume IDs; arbitrary process state is not checkpointed.", "repository-derived"),
      ...limitedClaims("https://github.com/manaflow-ai/cmux/blob/main/README.md", "cmux repository README", ["workbench-scm"], "Sidebar shows branch and linked pull-request status; it is not documented as a full source-control editor.", "repository-derived"),
      "workbench-worktrees": capability("via-integration", "https://github.com/manaflow-ai/cmux-home/blob/main/docs/customization.md", "cmux customization examples", "The official customization collection includes a worktree starter; it is an ecosystem integration rather than a cmux core capability.", "repository-derived"),
    },
  }),
  product({ id: "mosaic-terminal", name: "Mosaic Terminal", categoryId: "agent-workbenches", editorialOrder: 3, officialUrl: "https://mosaicterminal.dev/", tags: ["terminal", "session-restore", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: { ...builtInClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-named-sessions", "workbench-cross-project-attention"]), ...limitedClaims("https://mosaicterminal.dev/", "Mosaic Terminal product", ["workbench-pty-survives-ui"], "Continuity is documented as agent relaunch with provider resume flags.") } }),
  product({ id: "airport", name: "Airport", categoryId: "agent-workbenches", editorialOrder: 4, officialUrl: "https://get-airport.com/", tags: ["terminal", "attention", "multi-project"], source: "unknown", execution: ["local-process"], claims: builtInClaims("https://get-airport.com/", "Airport product", ["workbench-named-sessions", "workbench-cross-project-attention"]) }),
  product({
    id: "wmux", name: "wmux", categoryId: "agent-workbenches", editorialOrder: 5, officialUrl: "https://github.com/openwong2kim/wmux", repository: repo("openwong2kim/wmux"), repoMetricId: "wmux",
    tags: ["terminal", "daemon-pty", "worktrees", "browser", "notifications", "scm", "oss"], platform: ["macos", "windows"], source: "open-source", execution: ["local-daemon", "ssh-host"],
    claims: {
      ...builtInClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-arbitrary-cli", "workbench-named-sessions", "workbench-pty-survives-ui", "workbench-cross-project-attention", "workbench-splits", "workbench-attention-signals", "workbench-session-recovery", "workbench-browser", "workbench-remote-host", "workbench-programmable-control", "workbench-worktrees"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-scm"], "A Git tab covers worktrees and pull requests; this is not a full VS Code-style SCM surface.", "repository-derived"),
      ...limitedClaims("https://github.com/openwong2kim/wmux/blob/main/README.md", "wmux repository README", ["workbench-file-tree"], "The task-harvest diff surface has a file tree and per-hunk selection; it is not a project-wide editor tree.", "repository-derived"),
    },
  }),
  product({
    id: "warp", name: "Warp", categoryId: "agent-workbenches", editorialOrder: 6, officialUrl: "https://www.warp.dev/", repository: repo("warpdotdev/Warp", "metadata-only"),
    tags: ["terminal", "cloud-agent", "blocks", "code-editor", "hybrid:workbench-cloud"], platform: ["macos", "windows", "linux"], source: "proprietary", execution: ["local-process", "vendor-cloud"],
    claims: {
      ...builtInClaims("https://docs.warp.dev/code/code-editor", "Warp code editor", ["workbench-editor", "workbench-file-tree"]),
      ...limitedClaims("https://docs.warp.dev/agent-platform/local-agents/overview", "Warp local agents overview", ["workbench-scm"], "Interactive code review covers agent diffs and inline feedback; documentation does not establish a complete source-control surface."),
      ...builtInClaims("https://docs.warp.dev/agent-platform/local-agents/interacting-with-agents", "Warp agent conversations", ["workbench-splits", "workbench-session-recovery"]),
    },
  }),
  product({
    id: "wave-terminal", name: "Wave Terminal", categoryId: "agent-workbenches", editorialOrder: 7, officialUrl: "https://github.com/wavetermdev/waveterm",
    tags: ["terminal", "workspace-blocks", "editor-blocks", "browser", "remote-ssh", "oss"], platform: ["macos", "windows", "linux"], source: "unknown", execution: ["local-process", "ssh-host"],
    claims: {
      ...builtInClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-editor", "workbench-splits", "workbench-browser", "workbench-remote-host", "workbench-programmable-control"], undefined, "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-file-tree"], "Directory and file preview plus connected file management are built in; a project-wide IDE tree is not claimed.", "repository-derived"),
      ...limitedClaims("https://github.com/wavetermdev/waveterm", "Wave Terminal repository", ["workbench-session-recovery"], "Durable SSH sessions reconnect after network changes and Wave restarts; this does not establish local-process survival.", "repository-derived"),
    },
  }),

  // 3. Agent orchestrators
  product({ id: "orca", name: "Orca", categoryId: "agent-orchestrators", editorialOrder: 1, officialUrl: "https://onorca.dev/", repository: repo("stablyai/orca"), repoMetricId: "orca", tags: ["agent-ide", "worktrees", "terminal", "editor", "scm", "remote-ssh", "mobile", "oss"], platform: ["macos", "windows", "linux", "web"], platformNote: "Mobile apps are companion clients; these values describe the desktop and web operator surfaces.", source: "open-source", execution: ["local-process", "ssh-host", "user-cloud"], claims: {
    ...builtInClaims("https://github.com/stablyai/orca#readme", "Orca repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-inline-review", "orchestrator-remote-execution"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md", "Orca CLI guide", ["orchestrator-worktrees", "orchestrator-programmable"], undefined, "repository-derived"),
  } }),
  product({ id: "conductor", name: "Conductor", categoryId: "agent-orchestrators", editorialOrder: 2, officialUrl: "https://www.conductor.build/docs/", tags: ["native-macos", "worktrees", "review", "multi-agent"], platform: ["macos"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://www.conductor.build/docs/", "Conductor documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/git-worktrees", "Conductor Git worktrees", ["orchestrator-worktrees"]),
    ...builtInClaims("https://www.conductor.build/docs/concepts/workflow", "Conductor workflow", ["orchestrator-inline-review", "orchestrator-pr-lifecycle"]),
  } }),
  product({ id: "superset", name: "Superset", categoryId: "agent-orchestrators", editorialOrder: 3, officialUrl: "https://github.com/superset-sh/superset", repository: repo("superset-sh/superset"), repoMetricId: "superset", tags: ["worktrees", "terminal", "diff-review", "remote-hosts", "source-available"], platform: ["macos", "linux"], platformNote: "macOS is primary; Linux support was documented as experimental in the research snapshot.", source: "source-available", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/superset-sh/superset", "Superset repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived") }),
  product({ id: "coder-mux", name: "Coder Mux", categoryId: "agent-orchestrators", editorialOrder: 4, officialUrl: "https://mux.coder.com", repository: repo("coder/cmux"), repoMetricId: "coder-mux", tags: ["chat-control-plane", "worktrees", "ssh", "review", "oss"], platform: ["macos", "linux", "web"], source: "open-source", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/coder/cmux", "Coder Mux repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-inline-review", "orchestrator-remote-execution", "orchestrator-attention-signals"], undefined, "repository-derived") }),
  product({ id: "nimbalyst", name: "Nimbalyst", categoryId: "agent-orchestrators", editorialOrder: 5, officialUrl: "https://github.com/nimbalyst/nimbalyst", repository: repo("nimbalyst/nimbalyst"), repoMetricId: "nimbalyst", tags: ["agent-ide", "worktrees", "kanban", "editor", "visual-docs", "oss"], platform: ["macos", "windows", "linux"], platformNote: "Mobile companion reach is not counted as a desktop host platform.", source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst#readme", "Nimbalyst repository README", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board", "orchestrator-inline-review", "orchestrator-attention-signals"], undefined, "repository-derived"),
    ...builtInClaims("https://github.com/nimbalyst/nimbalyst/blob/main/docs/WORKTREES.md", "Nimbalyst worktree documentation", ["orchestrator-worktrees"], undefined, "repository-derived"),
  } }),
  product({ id: "t3-code", name: "T3 Code", categoryId: "agent-orchestrators", editorialOrder: 6, officialUrl: "https://t3.codes/", tags: ["chat-control-plane", "branches", "pr-flow"], source: "unknown", execution: ["local-process"] }),
  product({ id: "vibe-kanban", name: "Vibe Kanban", categoryId: "agent-orchestrators", editorialOrder: 7, officialUrl: "https://github.com/BloopAI/vibe-kanban", repository: repo("BloopAI/vibe-kanban"), repoMetricId: "vibe-kanban", tags: ["kanban", "worktrees", "approvals", "oss", "sunsetting"], source: "open-source", execution: ["local-process"], status: "sunsetting", claims: {
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/monitoring-task-execution", "Vibe Kanban task execution documentation", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees"]),
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/creating-tasks", "Vibe Kanban task documentation", ["orchestrator-task-board"]),
    ...builtInClaims("https://www.vibekanban.com/docs/core-features/reviewing-code-changes", "Vibe Kanban code review", ["orchestrator-inline-review"]),
    ...builtInClaims("https://www.vibekanban.com/docs/reviewing-code", "Vibe Kanban review workflow", ["orchestrator-pr-lifecycle"]),
  } }),
  product({ id: "sculptor", name: "Sculptor", categoryId: "agent-orchestrators", editorialOrder: 8, officialUrl: "https://github.com/imbue-ai/sculptor", repository: repo("imbue-ai/sculptor"), repoMetricId: "sculptor", tags: ["containers", "worktrees", "ide-pairing", "oss"], platform: ["macos", "linux"], source: "open-source", execution: ["container"], status: "beta", claims: {
    ...builtInClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees", "orchestrator-pr-lifecycle"], undefined, "repository-derived"),
    ...limitedClaims("https://github.com/imbue-ai/sculptor", "Sculptor repository", ["orchestrator-containers"], "Docker and remote container backends are documented as experimental.", "repository-derived"),
  } }),
  product({ id: "humanlayer", name: "HumanLayer", categoryId: "agent-orchestrators", editorialOrder: 9, officialUrl: "https://humanlayer.com/", repository: repo("humanlayer/humanlayer", "deprecated-predecessor"), tags: ["worktrees", "kanban", "local-daemon", "cloud-daemon", "review"], source: "proprietary", execution: ["local-daemon", "vendor-cloud"], claims: {
    ...builtInClaims("https://humanlayer.com/", "HumanLayer product", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-task-board"]),
    ...builtInClaims("https://docs.humanlayer.com/guide/workspaces", "HumanLayer workspace setup", ["orchestrator-worktrees"]),
    ...limitedClaims("https://docs.humanlayer.com/release-notes", "HumanLayer release notes", ["orchestrator-inline-review"], "Keyboard diff navigation and inline comments are currently an experimental alpha."),
    ...builtInClaims("https://docs.humanlayer.com/reference/skills-workflows", "HumanLayer workflows reference", ["orchestrator-pr-lifecycle"]),
    ...builtInClaims("https://docs.humanlayer.com/tutorials/remote-daemon", "HumanLayer remote daemon", ["orchestrator-remote-execution"]),
  } }),
  product({ id: "claude-squad", name: "claude-squad", categoryId: "agent-orchestrators", editorialOrder: 10, officialUrl: "https://github.com/smtg-ai/claude-squad", repository: repo("smtg-ai/claude-squad"), repoMetricId: "claude-squad", tags: ["tui", "tmux", "worktrees", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-review-delivery", "orchestrator-worktrees"], undefined, "repository-derived"),
    ...limitedClaims("https://github.com/smtg-ai/claude-squad", "claude-squad repository", ["orchestrator-inline-review"], "TUI supports reviewing changes before applying or checking them out; line-comment feedback is not documented.", "repository-derived"),
  } }),
  product({ id: "agent-deck", name: "agent-deck", categoryId: "agent-orchestrators", editorialOrder: 11, officialUrl: "https://github.com/asheshgoplani/agent-deck", repository: repo("asheshgoplani/agent-deck"), repoMetricId: "agent-deck", tags: ["tui", "tmux", "worktrees", "remote-ssh", "oss"], source: "open-source", execution: ["local-process", "ssh-host"], claims: builtInClaims("https://github.com/asheshgoplani/agent-deck", "agent-deck repository", ["orchestrator-isolated-workspaces", "orchestrator-parallel-workers", "orchestrator-multi-harness", "orchestrator-worktrees", "orchestrator-remote-execution", "orchestrator-attention-signals", "orchestrator-programmable"], undefined, "repository-derived") }),

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
  product({ id: "cursor-cli", name: "Cursor CLI", categoryId: "coding-agent-harnesses", editorialOrder: 3, officialUrl: "https://cursor.com/cli", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://cursor.com/cli", "Cursor CLI product", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    ...builtInClaims("https://docs.cursor.com/en/cli/using", "Cursor CLI usage", ["harness-extension-protocol", "harness-project-instructions"]),
    "harness-permission-controls": capability("built-in", "https://docs.cursor.com/cli/reference/permissions", "Cursor CLI permissions", "First-party permission rules control shell commands and tool use."),
    "harness-structured-output": capability("built-in", "https://docs.cursor.com/en/cli/reference/output-format", "Cursor CLI output formats", "Non-interactive runs can emit documented machine-readable output."),
    "harness-git-workflow": capability("built-in", "https://docs.cursor.com/en/cli/headless", "Cursor CLI headless mode", "Headless workflows are documented for Git-aware automation and review."),
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
  product({ id: "factory-droid-cli", name: "Factory Droid CLI", categoryId: "coding-agent-harnesses", editorialOrder: 5, officialUrl: "https://docs.factory.ai/cli/getting-started/quickstart", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://docs.factory.ai/cli/getting-started/quickstart", "Factory Droid CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://docs.factory.ai/droid-exec/overview", "Factory Droid Exec", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/overview", "Factory Droid CLI overview", ["harness-extension-protocol", "harness-subagents"]),
    ...builtInClaims("https://docs.factory.ai/droid-cli/settings", "Factory Droid settings", ["harness-project-instructions", "harness-permission-controls"]),
    "harness-sandbox": capability("built-in", "https://docs.factory.ai/enterprise/llm-safety-and-agent-controls", "Factory agent controls", "Factory documents sandbox controls for agent execution."),
  } }),
  product({ id: "codewhale", name: "CodeWhale", categoryId: "coding-agent-harnesses", editorialOrder: 6, officialUrl: "https://github.com/Hmbown/CodeWhale", repository: repo("Hmbown/CodeWhale"), repoMetricId: "codewhale", tags: ["cli", "multi-model", "resume", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/Hmbown/CodeWhale", "CodeWhale repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-permission-controls", "harness-sandbox", "harness-checkpoints", "harness-subagents", "harness-structured-output"], undefined, "repository-derived"),
  } }),
  product({ id: "antigravity-cli", name: "Antigravity CLI", categoryId: "coding-agent-harnesses", editorialOrder: 7, officialUrl: "https://antigravity.google/docs/cli-overview", tags: ["cli", "vendor-client", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://antigravity.google/docs/cli-overview", "Antigravity CLI documentation", ["harness-interactive-cli", "harness-session-resume"]),
    ...builtInClaims("https://antigravity.google/docs/cli/headless/", "Antigravity headless mode", ["harness-headless", "harness-structured-output"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/features", "Antigravity CLI features", ["harness-extension-protocol", "harness-checkpoints", "harness-subagents", "harness-git-workflow"]),
    ...builtInClaims("https://www.antigravity.google/docs/cli/best-practices/", "Antigravity CLI best practices", ["harness-project-instructions", "harness-multimodal-input"]),
    "harness-permission-controls": capability("built-in", "https://www.antigravity.google/docs/cli/permissions", "Antigravity CLI permissions", "First-party permission controls govern tool execution."),
    "harness-sandbox": capability("built-in", "https://www.antigravity.google/docs/cli/sandbox/", "Antigravity CLI sandbox", "First-party documentation describes the CLI execution sandbox."),
  } }),
  product({ id: "muse-code", name: "Muse Code", categoryId: "coding-agent-harnesses", editorialOrder: 8, officialUrl: null, tags: ["cli", "vendor-client", "resume", "source-needed"], source: "unknown", execution: "unknown", status: "source-needed" }),
  product({ id: "qwen-code", name: "Qwen Code", categoryId: "coding-agent-harnesses", editorialOrder: 9, officialUrl: "https://github.com/QwenLM/qwen-code", repository: repo("QwenLM/qwen-code"), repoMetricId: "qwen-code", tags: ["cli", "vendor-model", "resume", "oss"], platform: ["macos", "windows", "linux"], platformNote: "First-party standalone installers are documented for macOS, Windows, and Linux.", source: "open-source", execution: ["local-process"], claims: {
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
  product({ id: "pi-coding-agent", name: "Pi coding agent", categoryId: "coding-agent-harnesses", editorialOrder: 10, officialUrl: "https://github.com/earendil-works/pi", repository: repo("earendil-works/pi"), repoMetricId: "pi", tags: ["cli", "multi-model", "resume", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/earendil-works/pi#readme", "Pi coding agent repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol"]),
    "harness-permission-controls": capability("limited", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Runs with launcher-process permissions; stronger boundaries require a documented container or sandbox pattern.", "repository-derived"),
    "harness-sandbox": capability("via-integration", "https://github.com/earendil-works/pi", "Pi coding agent repository", "Gondolin, Docker, and OpenShell are documented isolation patterns rather than a default built-in boundary.", "repository-derived"),
    ...builtInClaims("https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", ["harness-project-instructions", "harness-structured-output", "harness-multimodal-input"], undefined, "repository-derived"),
    ...Object.fromEntries(["harness-checkpoints", "harness-subagents", "harness-git-workflow"].map((id) => [id, capability("via-extension", "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md", "Pi coding agent README", "The project documents this as an extension capability rather than Pi core.", "repository-derived")])),
  } }),
  product({ id: "opencode", name: "OpenCode CLI", categoryId: "coding-agent-harnesses", editorialOrder: 11, officialUrl: "https://opencode.ai/docs/cli/", repository: repo("anomalyco/opencode"), repoMetricId: "opencode", tags: ["cli", "multi-model", "desktop-client", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://opencode.ai/docs/cli/", "OpenCode CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume", "harness-extension-protocol", "harness-structured-output"]),
    "harness-project-instructions": capability("built-in", "https://opencode.ai/docs/rules", "OpenCode rules", "Project and global instruction files are documented."),
    "harness-permission-controls": capability("built-in", "https://opencode.ai/docs/permissions/", "OpenCode permissions", "Permission rules can allow, ask, or deny tool use."),
    "harness-subagents": capability("built-in", "https://opencode.ai/docs/agents/", "OpenCode agents", "Primary agents can invoke documented subagents."),
    "harness-checkpoints": capability("built-in", "https://opencode.ai/v2/docs/snapshots", "OpenCode snapshots", "Snapshots support restoring earlier project state."),
    "harness-multimodal-input": capability("built-in", "https://opencode.ai/v2/docs/attachments", "OpenCode attachments", "Sessions accept documented file and image attachments."),
  } }),
  product({ id: "github-copilot-cli", name: "GitHub Copilot CLI", categoryId: "coding-agent-harnesses", editorialOrder: 12, officialUrl: "https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", repository: repo("github/copilot-cli", "metadata-only"), tags: ["cli", "vendor-service", "resume"], source: "proprietary", execution: ["local-process"], claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli", "GitHub Copilot CLI documentation", ["harness-interactive-cli", "harness-headless", "harness-session-resume"]),
    "harness-extension-protocol": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview", "GitHub Copilot CLI customization", "Custom agents, skills, MCP servers, hooks, and plugins are first-party customization surfaces."),
    "harness-multi-provider": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview", "GitHub Copilot CLI customization", "GitHub documents bringing an external model with a user-supplied API key."),
    ...builtInClaims("https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview", "GitHub Copilot CLI overview", ["harness-project-instructions", "harness-sandbox", "harness-subagents"]),
    "harness-permission-controls": capability("built-in", "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools", "GitHub Copilot CLI tool permissions", "Users can allow individual tools and remembered tool patterns."),
    "harness-structured-output": capability("built-in", "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference", "GitHub Copilot CLI reference", "The CLI reference documents machine-readable command output."),
    "harness-git-workflow": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli", "About GitHub Copilot CLI", "Git and pull-request workflows are first-party product capabilities."),
  } }),
  product({ id: "goose", name: "Goose CLI", categoryId: "coding-agent-harnesses", editorialOrder: 13, officialUrl: "https://github.com/aaif-goose/goose", repository: repo("aaif-goose/goose"), repoMetricId: "goose", tags: ["cli", "multi-model", "extensions", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/aaif-goose/goose#readme", "Goose CLI repository README", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-extension-protocol"], undefined, "repository-derived"),
    ...builtInClaims("https://block.github.io/goose/index.html", "Goose documentation", ["harness-permission-controls", "harness-sandbox", "harness-subagents"]),
  } }),
  product({ id: "aider", name: "Aider", categoryId: "coding-agent-harnesses", editorialOrder: 14, officialUrl: "https://github.com/Aider-AI/aider", repository: repo("Aider-AI/aider"), repoMetricId: "aider", tags: ["cli", "multi-model", "git-native", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/Aider-AI/aider", "Aider repository", ["harness-interactive-cli", "harness-headless", "harness-multi-provider", "harness-session-resume"]),
    "harness-git-workflow": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Repository map plus automatic Git commits, diffs, and familiar Git undo.", "repository-derived"),
    "harness-multimodal-input": capability("built-in", "https://github.com/Aider-AI/aider", "Aider repository", "Images and web pages can be attached as context.", "repository-derived"),
    "harness-project-instructions": capability("built-in", "https://aider.chat/docs/usage/conventions.html", "Aider conventions", "Repository convention files can provide persistent project instructions."),
    "harness-checkpoints": capability("built-in", "https://aider.chat/docs/git.html", "Aider Git integration", "Automatic commits and /undo provide a Git-backed rollback point."),
  } }),
  product({ id: "grok-build", name: "Grok Build", categoryId: "coding-agent-harnesses", editorialOrder: 15, officialUrl: "https://github.com/xai-org/grok-build", repository: repo("xai-org/grok-build"), repoMetricId: "grok-build", tags: ["cli", "vendor-model", "source-transparent", "oss"], source: "open-source", execution: ["local-process"], claims: {
    ...builtInClaims("https://github.com/xai-org/grok-build", "Grok Build repository", ["harness-interactive-cli", "harness-headless", "harness-extension-protocol", "harness-sandbox", "harness-checkpoints", "harness-git-workflow"], undefined, "repository-derived"),
  } }),

  // 5. IDE extensions
  product({ id: "github-copilot-vscode", name: "GitHub Copilot for VS Code", categoryId: "ide-extensions", editorialOrder: 1, officialUrl: "https://code.visualstudio.com/docs/copilot/overview", repository: repo("microsoft/vscode", "source-tree"), repoMetricId: "vscode", tags: ["vscode", "autocomplete", "agent-panel", "background-agent-client"], source: "split-source", execution: ["host-ide-process", "vendor-cloud"], claims: {
    ...builtInClaims("https://code.visualstudio.com/docs/copilot/overview", "GitHub Copilot in VS Code documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel", "extension-background-delegation", "extension-host-vscode"]),
    "extension-mcp": capability("built-in", "https://code.visualstudio.com/docs/copilot/concepts/customization", "VS Code agent customization", "VS Code agent customization includes MCP tools and servers."),
    "extension-codebase-context": capability("built-in", "https://code.visualstudio.com/docs/agent-customization/custom-instructions", "VS Code custom instructions", "Workspace instructions, AGENTS.md, and file-scoped instruction files are automatically applied."),
  } }),
  product({ id: "cline", name: "Cline extension", categoryId: "ide-extensions", editorialOrder: 2, officialUrl: "https://docs.cline.bot/", repository: repo("cline/cline"), repoMetricId: "cline", tags: ["vscode", "agent-panel", "cli", "oss"], source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://docs.cline.bot/", "Cline extension documentation", ["extension-hosts", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.cline.bot/usage/ide", "Cline IDE documentation", "First-party extension workflow runs in the VS Code panel."),
    "extension-checkpoints": capability("built-in", "https://docs.cline.bot/core-workflows/checkpoints", "Cline checkpoints documentation", "Shadow-Git checkpoints restore files, task history, or both."),
    "extension-permissions": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "Auto Approve controls reads, edits, commands, browser, MCP, and notifications."),
    "extension-mcp": capability("built-in", "https://docs.cline.bot/features/auto-approve", "Cline Auto Approve documentation", "MCP tools are a documented approval category in the extension."),
  } }),
  product({ id: "continue", name: "Continue extension", categoryId: "ide-extensions", editorialOrder: 3, officialUrl: "https://docs.continue.dev/", repository: repo("continuedev/continue"), repoMetricId: "continue", tags: ["vscode", "jetbrains", "autocomplete", "agent-panel", "cli", "oss"], source: "open-source", execution: ["host-ide-process"], claims: {
    ...builtInClaims("https://docs.continue.dev/", "Continue extension documentation", ["extension-hosts", "extension-inline-completion", "extension-agent-panel"]),
    "extension-host-vscode": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party VS Code extension."),
    "extension-host-jetbrains": capability("built-in", "https://docs.continue.dev/customize/deep-dives/configuration", "Continue configuration documentation", "First-party JetBrains extension with its own sidebar shortcut."),
    "extension-provider-choice": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Multiple hosted providers and self-hosted model providers can be configured by role."),
    "extension-mcp": capability("built-in", "https://docs.continue.dev/customize/overview", "Continue customization overview", "Agent mode can use tools supplied by MCP servers."),
    "extension-codebase-context": capability("built-in", "https://docs.continue.dev/customize/deep-dives/custom-providers", "Continue custom providers documentation", "Repository map, files, tree, Git diff, terminal, and embedding-backed codebase context."),
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
  } }),
  product({ id: "github-copilot-coding-agent", name: "GitHub Copilot coding agent", categoryId: "cloud-agents", editorialOrder: 2, officialUrl: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", tags: ["issue-to-pr", "github", "background", "vendor-service"], platform: ["web"], source: "hosted-service", execution: ["vendor-cloud"], claims: {
    ...builtInClaims("https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", "GitHub Copilot coding agent documentation", ["cloud-repo-intake", "cloud-sandbox", "cloud-live-observability", "cloud-durable-result"]),
    "cloud-intake-surfaces": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub agents panel, issues, VS Code, PR comments, API, schedules, and event automations."),
    "cloud-code-hosts": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "GitHub repositories only. Treat this positive scope as a fact, not a negative score."),
    "cloud-environment-config": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Ephemeral GitHub Actions-powered development environment."),
    "cloud-project-instructions": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Repository custom instructions, MCP, custom agents, hooks, and skills."),
    "cloud-live-steering": capability("built-in", "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", "GitHub Copilot cloud agent documentation", "Continue the same conversation, ask follow-ups, inspect commits and logs, and iterate before PR creation."),
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
  } }),
  product({ id: "vibetunnel", name: "VibeTunnel", categoryId: "remote-companions", editorialOrder: 2, officialUrl: "https://github.com/amantus-ai/vibetunnel", repository: repo("amantus-ai/vibetunnel"), repoMetricId: "vibetunnel", tags: ["browser-terminal", "mobile-web", "server-owned-pty", "oss"], platform: ["macos", "web"], source: "open-source", execution: ["local-daemon", "paired-machine"], claims: {
    ...builtInClaims("https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", ["remote-client-reach", "remote-existing-session"], undefined, "repository-derived"),
    "remote-native-ios": capability("limited", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Native iOS app is work in progress and not recommended for production.", "repository-derived"),
    "remote-browser-pwa": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Responsive browser interface works from phones and tablets.", "repository-derived"),
    "remote-supported-harnesses": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Wraps any terminal command; the README explicitly positions it for terminal AI agents.", "repository-derived"),
    "remote-terminal-input": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "vt forwards interactive shells and arbitrary commands to the browser.", "repository-derived"),
    "remote-hosting-boundary": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Local server with documented Tailscale, ngrok, LAN, and Cloudflare tunnel options; multiple authentication modes.", "repository-derived"),
    "remote-session-history": capability("built-in", "https://github.com/amantus-ai/vibetunnel", "VibeTunnel repository", "Sessions are recorded in asciinema format for later playback.", "repository-derived"),
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
