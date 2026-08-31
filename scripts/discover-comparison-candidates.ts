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
const maxCandidates = Number(valueFor("--limit", "100"));
const outputDirectory = resolve(valueFor("--output", ".audit/comparison-candidates"));

const searches = [
  { signal: "coding-agent-topic", query: `topic:coding-agent stars:>=${minStars} archived:false` },
  { signal: "agentic-ide-topic", query: `topic:agentic-ide stars:>=${minStars} archived:false` },
  { signal: "coding-agent-workspace", query: `"coding agent" workspace in:name,description stars:>=${minStars} archived:false` },
  { signal: "terminal-agent", query: `"coding agent" terminal in:name,description stars:>=${minStars} archived:false` },
  { signal: "multi-agent-workspace", query: `"multi-agent" coding in:name,description stars:>=${minStars} archived:false` },
  { signal: "claude-code-desktop", query: `"Claude Code" desktop in:name,description stars:>=${minStars} archived:false` },
  { signal: "agent-session-manager", query: `"agent" "session manager" coding in:name,description stars:>=${minStars} archived:false` },
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

const aggregate = new Map<string, GitHubRepository & { signals: Set<string> }>();
for (const search of searches) {
  const response = fetchSearch(search.query);
  for (const repository of response.items) {
    const key = repository.full_name.toLowerCase();
    const current = aggregate.get(key);
    if (current) {
      current.signals.add(search.signal);
    } else {
      aggregate.set(key, { ...repository, signals: new Set([search.signal]) });
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

const candidates = [...aggregate.values()]
  .filter((repository) => !existingRepositories.has(repository.full_name.toLowerCase()))
  .filter(looksLikeComparableProduct)
  .map((repository) => ({
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
    discoveryScore: Math.round(
      Math.log10(Math.max(repository.stargazers_count, 1)) * 25
      + repository.signals.size * 12
      + (Date.now() - Date.parse(repository.pushed_at) < 90 * 86_400_000 ? 10 : 0),
    ),
  }))
  .sort((left, right) => right.discoveryScore - left.discoveryScore || right.stars - left.stars)
  .slice(0, maxCandidates);

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "candidates.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  minStars,
  searches,
  existingRepositoryCount: existingRepositories.size,
  candidates,
}, null, 2)}\n`);

const table = [
  "# Comparison candidates",
  "",
  `Generated ${new Date().toISOString()} from ${searches.length} repeatable GitHub searches.`,
  "",
  "Discovery is not evidence. Review a candidate's primary documentation, product boundary, maintenance status, and category fit before adding it to the catalog.",
  "",
  "| Candidate | Stars | Signals | Description |",
  "| --- | ---: | --- | --- |",
  ...candidates.map((candidate) => `| [${candidate.repository}](${candidate.url}) | ${candidate.stars.toLocaleString("en-US")} | ${candidate.signals.join(", ")} | ${(candidate.description ?? "No description").replaceAll("|", "\\|")} |`),
  "",
];
writeFileSync(resolve(outputDirectory, "candidates.md"), table.join("\n"));

process.stdout.write(`Found ${candidates.length} unseen candidates. Reports: ${outputDirectory}\n`);
