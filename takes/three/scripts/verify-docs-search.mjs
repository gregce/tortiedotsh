import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const pagefindEntry = new URL("../dist/pagefind/pagefind.js", import.meta.url);
const docsIndex = new URL("../dist/docs/index.html", import.meta.url);
const docsStyles = new URL("../src/styles/docs.css", import.meta.url);
const nativeFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (url.protocol === "file:") {
    return new Response(await readFile(fileURLToPath(url)));
  }
  return nativeFetch(input, init);
};

const pagefind = await import(`${pathToFileURL(fileURLToPath(pagefindEntry)).href}?verify=${Date.now()}`);
await pagefind.init();

async function search(query) {
  const response = await pagefind.search(query);
  assert.ok(response, `Pagefind returned no response for “${query}”.`);
  return Promise.all(response.results.map((result) => result.data()));
}

function assertPage(results, expectedPath, query) {
  const page = results.find((result) => result.url.includes(expectedPath));
  assert.ok(page, `“${query}” did not return ${expectedPath}.`);
  return page;
}

function assertSection(page, expectedHash, query) {
  const section = page.sub_results?.find((result) => result.url?.endsWith(expectedHash));
  assert.ok(section, `“${query}” did not return section ${expectedHash}.`);
  assert.match(section.excerpt ?? "", /<mark>/, `“${query}” did not include a highlighted excerpt.`);
}

const sshResults = await search("ssh");
const remotePage = assertPage(sshResults, "/docs/remote-machines/", "ssh");
assertSection(remotePage, "#requirements", "ssh");

const siliconResults = await search("Apple silicon");
const gettingStartedPage = assertPage(siliconResults, "/docs/", "Apple silicon");
assertSection(gettingStartedPage, "#requirements", "Apple silicon");

const catchUpResults = await search("Catch Me Up");
const attentionPage = assertPage(catchUpResults, "/docs/attention-and-catch-me-up/", "Catch Me Up");
assertSection(attentionPage, "#catch-me-up", "Catch Me Up");

const changelogResults = await search("0.62.1");
const changelogPage = assertPage(changelogResults, "/docs/changelog/", "0.62.1");
assertSection(changelogPage, "#v0.62.1", "0.62.1");

assert.equal((await search("walrusnotfound")).length, 0, "An impossible query returned results.");

const [html, css] = await Promise.all([
  readFile(docsIndex, "utf8"),
  readFile(docsStyles, "utf8"),
]);
assert.ok(html.includes('role="combobox"'), "The docs search input is not exposed as a combobox.");
assert.ok(html.includes('role="listbox"'), "The docs results are not exposed as a listbox.");
assert.ok(
  html.indexOf('id="docs-search-results"') < html.indexOf('class="docs-nav"'),
  "Search results must remain in the rail before the table of contents.",
);
assert.match(css, /\.docs-search-result\[aria-selected="true"\]/, "Selected search results have no visible state.");

console.log("Docs search verified: 10-page index, section anchors, excerpts, changelog, empty state, and inline rail semantics.");
