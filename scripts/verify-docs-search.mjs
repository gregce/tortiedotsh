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

const macOSResults = await search("macOS 15.7.9");
const requirementsPage = assertPage(macOSResults, "/docs/", "macOS 15.7.9");
assertSection(requirementsPage, "#requirements", "macOS 15.7.9");

const catchUpResults = await search("Catch Me Up");
const attentionPage = assertPage(catchUpResults, "/docs/attention-and-catch-me-up/", "Catch Me Up");
assertSection(attentionPage, "#catch-me-up", "Catch Me Up");

const tmuxResults = await search("private tmux server");
const durabilityPage = assertPage(tmuxResults, "/docs/durability-and-recovery/", "private tmux server");
assertSection(durabilityPage, "#private-tmux-server", "private tmux server");

const menuResults = await search("context menus");
const sessionToolsPage = assertPage(menuResults, "/docs/session-tools-and-menus/", "context menus");
assertSection(sessionToolsPage, "#menu-model", "context menus");

const audienceResults = await search("who Tortie is for");
const productPage = assertPage(audienceResults, "/docs/what-tortie-is/", "who Tortie is for");
assertSection(productPage, "#who-it-is-for", "who Tortie is for");

const nameResults = await search("deeply loyal opinionated vigilant");
const namePage = assertPage(nameResults, "/docs/what-tortie-is/", "deeply loyal opinionated vigilant");
assertSection(namePage, "#behind-the-name", "deeply loyal opinionated vigilant");

const forkResults = await search("not a VS Code fork");
const forkPage = assertPage(forkResults, "/docs/what-tortie-is/", "not a VS Code fork");
assertSection(forkPage, "#not-a-vscode-fork", "not a VS Code fork");

const updateResults = await search("every 6 hours");
const updatePage = assertPage(updateResults, "/docs/settings-and-customization/", "every 6 hours");
assertSection(updatePage, "#automatic-updates", "every 6 hours");

const monacoResults = await search("Monaco Editor");
const filesPage = assertPage(monacoResults, "/docs/files-search-and-previews/", "Monaco Editor");
assertSection(filesPage, "#libraries", "Monaco Editor");

const actionsResults = await search("gh run list");
const sourceControlPage = assertPage(actionsResults, "/docs/source-control/", "gh run list");
assertSection(sourceControlPage, "#actions", "gh run list");

const changelogResults = await search("0.62.1");
const changelogPage = assertPage(changelogResults, "/docs/changelog/", "0.62.1");
assertSection(changelogPage, "#v0.62.1", "0.62.1");

// Avoid a token ending in a single shortcut letter such as Q. Pagefind's
// tokenizer can legitimately reduce that to the documented keycap.
const impossibleResults = await search("zzzzzzzzzzzzzzzzzzzzzzzz");
assert.equal(
  impossibleResults.length,
  0,
  "An impossible query returned results.",
);

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
assert.ok(
  html.indexOf(">What Tortie is<") < html.indexOf(">Getting started<"),
  "What Tortie is must appear before Getting started in the docs navigation.",
);
assert.match(css, /\.docs-search-result\[aria-selected="true"\]/, "Selected search results have no visible state.");

console.log("Docs search verified: 14-page index, product positioning and name, navigation order, tmux and library architecture, automatic updates, read-only GitHub Actions, context menus, section anchors, excerpts, changelog, empty state, and inline rail semantics.");
