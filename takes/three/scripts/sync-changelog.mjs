import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SOURCE_URL = "https://raw.githubusercontent.com/gregce/tortie/main/CHANGELOG.md";
const outputPath = resolve(import.meta.dirname, "../src/data/changelog.json");
const sourceIndex = process.argv.indexOf("--source");
const localSource = sourceIndex >= 0 ? process.argv[sourceIndex + 1] : null;
if (sourceIndex >= 0 && !localSource) throw new Error("--source requires a CHANGELOG.md path");

const markdown = localSource
  ? await readFile(resolve(localSource), "utf8")
  : await fetch(SOURCE_URL, { headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {} })
      .then((response) => { if (!response.ok) throw new Error(`Changelog fetch failed: ${response.status}`); return response.text(); });

const releases = [];
const matches = [...markdown.matchAll(/^##\s+([^\s]+)\s+\((\d{4}-\d{2}-\d{2})\)\s*$/gm)];
for (let index = 0; index < matches.length; index += 1) {
  const match = matches[index];
  const body = markdown.slice(match.index + match[0].length, matches[index + 1]?.index ?? markdown.length).trim();
  const sectionMatches = [...body.matchAll(/^###\s+(.+)$/gm)];
  const summary = body.slice(0, sectionMatches[0]?.index ?? body.length).replace(/\s+/g, " ").trim();
  const sections = [];
  for (let sectionIndex = 0; sectionIndex < sectionMatches.length; sectionIndex += 1) {
    const sectionMatch = sectionMatches[sectionIndex];
    const sectionBody = body.slice(sectionMatch.index + sectionMatch[0].length, sectionMatches[sectionIndex + 1]?.index ?? body.length);
    const items = sectionBody.split("\n").filter((line) => line.startsWith("- ")).map((line) => {
      const commits = [...line.matchAll(/\[`([^`]+)`\]\((https:\/\/github\.com\/gregce\/tortie\/commit\/[^)]+)\)/g)].map((commit) => ({ hash: commit[1], url: commit[2] }));
      const text = line.slice(2).replace(/\s*\((?:\[`[^`]+`\]\([^)]+\)(?:,\s*)?)+\)\s*$/, "").trim();
      return { text, commits };
    });
    if (items.length) sections.push({ title: sectionMatch[1].trim(), items });
  }
  releases.push({ version: match[1], date: match[2], summary, sections });
}
if (!releases.length) throw new Error("No release headings found in CHANGELOG.md");
await writeFile(outputPath, `${JSON.stringify({ sourceUrl: SOURCE_URL, releases }, null, 2)}\n`);
console.log(`synced ${releases.length} releases to ${outputPath}`);
