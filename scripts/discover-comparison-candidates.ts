import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { comparisonProducts } from "../src/data/comparison-catalog.ts";

interface GitHubRepository {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  archived: boolean;
  pushed_at: string;
  homepage: string | null;
}

interface SearchResponse {
  items: GitHubRepository[];
}

const args = process.argv.slice(2);
const valueFor = (name: string, fallback: string): string => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const minStars = Number(valueFor("--min-stars", "200"));
const maxCandidatesPerCategory = Number(valueFor("--limit", "25"));
const outputDirectory = resolve(valueFor("--output", ".audit/comparison-candidates"));

const categoryLabels = {
  "code-editors": "Code IDEs",
  "ide-extensions": "IDE extensions",
  "agent-workbenches": "Agent multiplexers",
  "agent-orchestrators": "Agent orchestrators",
  "coding-agent-harnesses": "Coding-agent harnesses",
  "agent-traces": "Agent traces",
  "cloud-agents": "Cloud and background agents",
  "general-purpose-agents": "General-purpose agents",
  "remote-companions": "Remote companions and relays",
} as const;
type DiscoveryCategory = keyof typeof categoryLabels;

const searches = [
  { category: "code-editors", signal: "agentic-ide", query: `"agentic IDE" in:name,description stars:>=${minStars} archived:false` },
  { category: "code-editors", signal: "ai-code-editor", query: `"AI code editor" in:name,description stars:>=${minStars} archived:false` },
  { category: "code-editors", signal: "ai-ide", query: `AI IDE in:name,description stars:>=${minStars} archived:false` },
  { category: "code-editors", signal: "agentic-editor", query: `agentic editor in:name,description stars:>=${minStars} archived:false` },
  { category: "ide-extensions", signal: "vscode-agent-extension", query: `"coding agent" "VS Code extension" in:name,description stars:>=${minStars} archived:false` },
  { category: "ide-extensions", signal: "editor-agent-plugin", query: `"coding agent" "editor plugin" in:name,description stars:>=${minStars} archived:false` },
  { category: "ide-extensions", signal: "vscode-coding-agent", query: `coding agent vscode in:name,description stars:>=${minStars} archived:false` },
  { category: "ide-extensions", signal: "neovim-coding-agent", query: `coding agent neovim in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-workbenches", signal: "coding-agent-workspace", query: `"coding agent" workspace in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-workbenches", signal: "agent-session-manager", query: `"agent" "session manager" coding in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-workbenches", signal: "persistent-agent-terminal", query: `"coding agent" "persistent sessions" terminal in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-orchestrators", signal: "coding-agent-orchestrator", query: `"coding agent" orchestrator in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-orchestrators", signal: "multi-agent-orchestration", query: `"multi-agent orchestration" in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-orchestrators", signal: "parallel-worktree-agents", query: `"multi-agent" worktree coding in:name,description stars:>=${minStars} archived:false` },
  { category: "coding-agent-harnesses", signal: "coding-agent-topic", query: `topic:coding-agent stars:>=${minStars} archived:false` },
  { category: "coding-agent-harnesses", signal: "terminal-agent", query: `"coding agent" terminal in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-traces", signal: "coding-agent-observability", query: `"coding agent" observability in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-traces", signal: "agent-traces", query: `"agent trace" coding in:name,description stars:>=${minStars} archived:false` },
  { category: "agent-traces", signal: "coding-agent-telemetry", query: `coding agent telemetry in:name,description stars:>=${minStars} archived:false` },
  { category: "cloud-agents", signal: "cloud-coding-agent", query: `"cloud coding agent" in:name,description stars:>=${minStars} archived:false` },
  { category: "cloud-agents", signal: "background-coding-agent", query: `"background agent" coding in:name,description stars:>=${minStars} archived:false` },
  { category: "cloud-agents", signal: "agent-pull-request", query: `coding agent "pull request" cloud in:name,description stars:>=${minStars} archived:false` },
  { category: "general-purpose-agents", signal: "general-agent-workspace", query: `"agent workspace" automation desktop in:name,description stars:>=${minStars} archived:false` },
  { category: "general-purpose-agents", signal: "computer-use-agent", query: `"computer use" agent desktop in:name,description stars:>=${minStars} archived:false` },
  { category: "remote-companions", signal: "remote-coding-agent", query: `"coding agent" remote mobile in:name,description stars:>=${minStars} archived:false` },
  { category: "remote-companions", signal: "agent-companion", query: `"coding agent" companion in:name,description stars:>=${minStars} archived:false` },
  { category: "remote-companions", signal: "mobile-coding-agents", query: `coding agents mobile in:name,description stars:>=${minStars} archived:false` },
  { category: "remote-companions", signal: "remote-agent-sessions", query: `agent sessions remote in:name,description stars:>=${minStars} archived:false` },
  { category: "remote-companions", signal: "cross-device-agent-client", query: `"Claude Code" Codex mobile client in:name,description stars:>=${minStars} archived:false` },
] as const;

const normalizeRepository = (url: string): string | null => {
  const match = url.match(/(?:github\.com|api\.github\.com\/repos)\/([^/]+\/[^/#?]+)/i);
  return match?.[1]?.replace(/\.git$/i, "").toLowerCase() ?? null;
};

const existingRepositories = new Set(
  comparisonProducts
    .map((product) => product.repository?.url)
    .filter((url): url is string => Boolean(url))
    .map(normalizeRepository)
    .filter((repository): repository is string => Boolean(repository)),
);

const fetchSearch = (query: string): SearchResponse => {
  const output = execFileSync("gh", [
    "api",
    "--method",
    "GET",
    "search/repositories",
    "-f",
    `q=${query}`,
    "-f",
    "sort=stars",
    "-f",
    "order=desc",
    "-f",
    "per_page=100",
    "-H",
    "Accept: application/vnd.github+json",
  ], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(output) as SearchResponse;
};

const aggregate = new Map<string, GitHubRepository & { signals: Set<string>; categorySignals: Map<DiscoveryCategory, Set<string>> }>();
for (const search of searches) {
  const response = fetchSearch(search.query);
  for (const repository of response.items) {
    const key = repository.full_name.toLowerCase();
    const current = aggregate.get(key);
    if (current) {
      current.signals.add(search.signal);
      const signals = current.categorySignals.get(search.category) ?? new Set<string>();
      signals.add(search.signal);
      current.categorySignals.set(search.category, signals);
    } else {
      aggregate.set(key, {
        ...repository,
        signals: new Set([search.signal]),
        categorySignals: new Map([[search.category, new Set([search.signal])]]),
      });
    }
  }
}

const looksLikeComparableProduct = (repository: GitHubRepository): boolean => {
  const text = [repository.full_name, repository.description ?? "", ...repository.topics]
    .join(" ")
    .toLowerCase();
  const hasAgentSignal = /coding[- ]agent|agentic[- ]cod|claude code|codex|code agent/.test(text);
  const hasProductSurface = /terminal|desktop|workspace|workbench|\bide\b|editor|orchestrat|harness|session|worktree|multiplex/.test(text);
  const isCollection = /awesome|curated (list|collection)|skills? (collection|library)|prompt collection|mcp server/.test(text);
  return hasAgentSignal && hasProductSurface && !isCollection;
};

const rankedCandidates = [...aggregate.values()]
  .filter((repository) => !existingRepositories.has(repository.full_name.toLowerCase()))
  .filter(looksLikeComparableProduct)
  .map((repository) => {
    const categoryScores = [...repository.categorySignals.entries()]
      .map(([category, signals]) => ({ category, signals: [...signals].sort(), score: signals.size }))
      .sort((left, right) => right.score - left.score || categoryLabels[left.category].localeCompare(categoryLabels[right.category]));
    return {
      repository: repository.full_name,
      url: repository.html_url,
      homepage: repository.homepage,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      language: repository.language,
      topics: repository.topics,
      pushedAt: repository.pushed_at,
      signals: [...repository.signals].sort(),
      categoryScores,
      recommendedCategories: categoryScores.map(({ category }) => category),
      discoveryScore: Math.round(
        Math.log10(Math.max(repository.stargazers_count, 1)) * 25
        + repository.signals.size * 12
        + (Date.now() - Date.parse(repository.pushed_at) < 90 * 86_400_000 ? 10 : 0),
      ),
    };
  })
  .sort((left, right) => right.discoveryScore - left.discoveryScore || right.stars - left.stars);

// Keep a review queue for every category. A single global slice allowed the
// largest search surface (usually harnesses) to crowd out quieter categories.
const selectedRepositories = new Set<string>();
for (const category of Object.keys(categoryLabels) as DiscoveryCategory[]) {
  rankedCandidates
    .filter((candidate) => candidate.recommendedCategories.includes(category))
    .slice(0, maxCandidatesPerCategory)
    .forEach((candidate) => selectedRepositories.add(candidate.repository.toLowerCase()));
}
const candidates = rankedCandidates.filter((candidate) => selectedRepositories.has(candidate.repository.toLowerCase()));

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "candidates.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  minStars,
  maxCandidatesPerCategory,
  searches,
  existingRepositoryCount: existingRepositories.size,
  candidates,
}, null, 2)}\n`);

const table = [
  "# Comparison candidates",
  "",
  `Generated ${new Date().toISOString()} from ${searches.length} repeatable, category-specific GitHub searches, capped at ${maxCandidatesPerCategory} candidates per category.`,
  "",
  "Discovery is not evidence. Review a candidate's primary documentation, product boundary, maintenance status, and category fit before adding it to the catalog.",
  "",
  ...Object.entries(categoryLabels).flatMap(([category, label]) => {
    const categoryCandidates = candidates.filter((candidate) => candidate.recommendedCategories.includes(category as DiscoveryCategory));
    return [
      `## ${label}`,
      "",
      "| Candidate | Stars | Category signals | Description |",
      "| --- | ---: | --- | --- |",
      ...categoryCandidates.map((candidate) => {
        const categoryScore = candidate.categoryScores.find((score) => score.category === category);
        return `| [${candidate.repository}](${candidate.url}) | ${candidate.stars.toLocaleString("en-US")} | ${categoryScore?.signals.join(", ") ?? ""} | ${(candidate.description ?? "No description").replaceAll("|", "\\|")} |`;
      }),
      "",
    ];
  }),
  "",
];
writeFileSync(resolve(outputDirectory, "candidates.md"), table.join("\n"));

process.stdout.write(`Found ${candidates.length} unseen candidates. Reports: ${outputDirectory}\n`);
