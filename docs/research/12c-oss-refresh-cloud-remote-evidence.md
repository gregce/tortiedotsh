# OSS refresh audit: Cloud Agents, Remote, and changed evidence

Checked 2026-08-23 against first-party product documentation, canonical repository files, and live forge API responses. This handoff covers the 12 `cloud-agents` and `remote-companions` records currently present in `open-source-projects.json`, then resolves the 13 URLs whose monitored content hash changed.

The important result is that this is not a clean “accept all 13 hashes” refresh. Six URLs can be accepted without changing their attached claims, six require a claim edit, replacement, or supplemental source, and one has become a high-level redirect that no longer supports any of the detailed claims attached to it. The manifest also has one orphan, one dead forge coordinate, three license traps, and two release-selection traps.

## Required manifest and collector corrections

### 1. Remove the orphan `openhands` Cloud manifest record

`OpenHands/OpenHands` is the MIT-licensed core coding-agent platform. It is not a second Cloud Agents SKU alongside the exact `OpenHands Cloud` product already represented by `OpenHands/OpenHands-Cloud`.

Do not add a duplicate “OpenHands” column to Cloud Agents. Remove the current orphan `openhands` manifest entry. It has no `repoMetricId` consumer, so its statistics are generated but never displayed.

If the core product is added later, it should be researched as an exact **coding-agent harness / local OpenHands** product and joined to the core repository there. At that point, re-add the manifest record under the harness category. The core repository can also remain evidence for runtime capabilities of OpenHands Cloud without being treated as a second Cloud SKU.

Keep `openhands-cloud` for the exact Cloud product. Its first-party README says the repository contains the Helm charts used for both self-hosted and public OpenHands Cloud, while directing core-agent issues to the separate MIT repository: [OpenHands Cloud README](https://github.com/OpenHands/OpenHands-Cloud/blob/main/README.md).

### 2. Replace GitLab's dead GitHub coordinate with a real GitLab forge provider

`https://github.com/gitlab-org/gitlab` and its API endpoint returned 404. The canonical repository is [gitlab.com/gitlab-org/gitlab](https://gitlab.com/gitlab-org/gitlab). A mirror must not be silently substituted merely to preserve GitHub-only telemetry.

The durable correction is to make the manifest forge-aware, for example:

```json
{
  "id": "gitlab",
  "name": "GitLab Duo Developer Flow",
  "category": "cloud-agents",
  "forge": "gitlab",
  "owner": "gitlab-org",
  "repo": "gitlab",
  "repositoryUrl": "https://gitlab.com/gitlab-org/gitlab",
  "apiUrl": "https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab",
  "loc": { "enabled": true, "timeoutMinutes": 60 }
}
```

The collector then needs GitLab adapters for project metadata, contributors, releases/tags, and archive checkout. Until that exists, the catalog must not show a GitHub URL or stale GitHub counts. Explicit “telemetry awaiting GitLab provider” is more accurate than fabricated or blank GitHub data.

GitLab is also mixed-license. The root [LICENSE](https://gitlab.com/gitlab-org/gitlab/-/blob/master/LICENSE) applies MIT to most code, CC BY-SA 4.0 to `doc/`, and separate licenses to `ee/` and `jh/`. Report “Mixed: MIT + GitLab Enterprise/JH terms”, not simply MIT. CLOC of this repository describes the whole GitLab monorepo, not Duo Developer Flow.

### 3. Add exact license overrides

GitHub reports `NOASSERTION` for two records and incompletely reports the third:

- `openhands-cloud`: **PolyForm Free Trial 1.0.0**, explicitly not open source and limited to 30 days per calendar year without a commercial license. Source: [LICENSE](https://github.com/OpenHands/OpenHands-Cloud/blob/main/LICENSE) and [README warning](https://github.com/OpenHands/OpenHands-Cloud/blob/main/README.md). Keep the catalog classification `source-available`.
- `termix`: **Apache-2.0**. Source: [Termix LICENSE](https://github.com/Termix-SSH/Termix/blob/main/LICENSE).
- `coder`: the root is **AGPL-3.0**, while code under the `enterprise` directory uses the separate [Coder Enterprise License](https://github.com/coder/coder/blob/main/LICENSE.enterprise). GitHub's single AGPL result is incomplete for this split-source monorepo. The metric label should be “AGPL-3.0 + Coder Enterprise License”, matching the catalog's `split-source` classification.

The current override schema accepts only one `sourceUrl`. Extend it to accept `sourceUrls` before encoding Coder's mixed license; otherwise one half of the assertion has no provenance. If a temporary single-source override is unavoidable, link `LICENSE.enterprise` and keep the root AGPL file linked in the metric note.

### 4. Stop treating `/releases/latest` as chronologically authoritative

The live GitHub API returned `v2.35.4` from `coder/coder/releases/latest`, while the release list contains stable `v2.36.1` published 2026-08-20. The endpoint reflects GitHub's “latest” designation, which can be manually or legacy selected; it is not guaranteed to be the most recently published stable release.

Fetch `/releases?per_page=100`, reject drafts, and select the newest non-prerelease by `published_at`. Preserve the exact tag. Only fall back to tags when the repository has no releases.

VibeTunnel exposes the complementary problem: it has only prereleases. `/releases/latest` returns 404 even though `v1.0.0-beta.18` was published 2026-07-11. The collector currently falls back to the first tag, losing `published_at` and the prerelease flag. When no stable release exists, select the newest published prerelease and label it **prerelease** rather than treating it as a bare tag.

### 5. Reject Happy's component-only version as a product-wide release

The latest Happy GitHub release is `cli-1.1.10` (2026-06-23). Happy is a monorepo containing the app, CLI, agent, and server; that tag is only the CLI version. It must not be displayed as the unified Happy product version.

The correct current-schema fallback is a `release.mode: "default-branch"` exception with `cli-1.1.10` recorded as the rejected component-specific candidate. A better future schema would support `release.scope: "CLI"`, allowing the UI to say `CLI 1.1.10` without implying an app/server release.

## Canonical repository ledger

Live observations below are scope and policy checks, not a replacement for the generated snapshot.

| Manifest ID | Canonical repository | License finding | Release finding | CLOC / scope trap | Recommendation |
| --- | --- | --- | --- | --- | --- |
| `openhands` | [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | MIT | `v1.15.0`, 2026-08-21 | Large core platform monorepo; not the exact Cloud control-plane repository. | Remove orphan now. Re-add only with a distinct harness product. |
| `happy` | [slopus/happy](https://github.com/slopus/happy) | MIT | `cli-1.1.10` is component-scoped | CLOC correctly covers the app, CLI, agent, and server together, but no single release identifies all four. | Default-branch policy or add component-scoped releases. |
| `vibetunnel` | [amantus-ai/vibetunnel](https://github.com/amantus-ai/vibetunnel) | MIT | Newest published release is prerelease `v1.0.0-beta.18` | Repository is large because it contains native app, server, web frontend, assets, and history. Binary assets do not inflate CLOC, but repository size is not source LOC. | Add prerelease selection; allow a longer LOC timeout. Also add `linux` to the product platform list: the first-party npm package supports Linux and headless systems. |
| `gitlab` | [gitlab-org/gitlab on GitLab](https://gitlab.com/gitlab-org/gitlab) | Mixed MIT / CC BY-SA / Enterprise / JH | GitLab-native release stream | Whole GitLab monorepo; Developer Flow is only one feature. Current GitHub collector cannot refresh it. | Add GitLab forge support and an explicit shared-monorepo scope note. |
| `coder` | [coder/coder](https://github.com/coder/coder) | AGPL-3.0 plus Coder Enterprise License | API “latest” is stale; newest stable is `v2.36.1` | CLOC is the entire Coder platform, not only Coder Agents. | Mixed-license override, chronological release selection, and shared-monorepo scope note. |
| `openhands-cloud` | [OpenHands/OpenHands-Cloud](https://github.com/OpenHands/OpenHands-Cloud) | PolyForm Free Trial 1.0.0 | `openhands/0.50.0`, 2026-08-21 | CLOC measures the public Cloud charts/control-plane surface, not the MIT core runtime or every hosted-service component. | Add license override and retain the component-prefixed release tag verbatim. |
| `code-server` | [coder/code-server](https://github.com/coder/code-server) | MIT | `v4.133.0`, 2026-08-17 | Shallow clone does not initialize the upstream VS Code submodule, so CLOC describes code-server's checked-in source/glue rather than a bundled VS Code total. | Keep; add the scope note so its smaller LOC is not misread against full forks. |
| `openvscode-server` | [gitpod-io/openvscode-server](https://github.com/gitpod-io/openvscode-server) | MIT | `openvscode-server-v1.109.5`, 2026-02-20 | GitHub identifies this as a fork of `microsoft/vscode`; CLOC is the full fork and contributor counts are fork-repository contributors, not all upstream VS Code authors. | Keep, preserve exact prefixed release, and label metrics “full Code OSS fork”. |
| `sshx` | [ekzhang/sshx](https://github.com/ekzhang/sshx) | MIT | `v0.4.1`, 2025-02-12 | Small Rust/web repository. An old release does not itself prove abandonment; repository is not archived. | Keep exact stable release and do not infer a lifecycle state from age alone. |
| `upterm` | [owenthereal/upterm](https://github.com/owenthereal/upterm) | Apache-2.0 | `v0.24.0`, 2026-05-06 | Uses `master`; vendor dependencies are excluded by the global CLOC policy. | Keep. |
| `termix` | [Termix-SSH/Termix](https://github.com/Termix-SSH/Termix) | Apache-2.0 despite GitHub `NOASSERTION` | `release-2.7.1-tag`, 2026-08-23 | Monorepo LOC covers server and clients; retain the unusual upstream tag rather than normalizing it to an invented version. | Add Apache-2.0 override; keep exact tag. |
| `ttyd` | [tsl0922/ttyd](https://github.com/tsl0922/ttyd) | MIT | `1.7.7`, 2024-03-30 | Stable-release CLOC is intentionally older than the active default branch; uninitialized dependency submodules are not counted. | Keep release-pinned LOC and expose the measured ref/date so the age is visible. |

## CLOC policy for these repositories

The current source-only policy is materially correct: it runs CLOC at the measured ref and excludes Markdown, JSON, JSONC, YAML, TOML, XML, CSV, TSV, text, lockfiles, dependency directories, build output, coverage, and common generated directories.

Three additions are needed for honest comparisons:

1. Allow per-project `loc.excludeDirs` and `loc.includeDirs`. Generated clients and embedded fixtures do not always live under a globally named `generated` directory.
2. Record whether submodules were initialized. The current answer is “no”; this is important for code-server, ttyd, and any full-fork comparison.
3. Add a `metricScope` string to the manifest/UI. Use values such as “whole Coder monorepo”, “OpenHands Cloud charts/control plane”, “full Code OSS fork”, and “code-server source excluding VS Code submodule”. CLOC is deterministic without being directly comparable across these scopes.

Do not disable LOC merely because a repository is large. Give `vibetunnel`, `coder`, `openhands-cloud`, and `openvscode-server` explicit 30–60 minute timeouts. GitLab needs its own forge checkout path first.

## The 13 changed evidence URLs

`changed` means the monitor observed a different body hash. It does not mean every attached claim became false. The exact dispositions follow.

### Android Studio

1. `https://developer.android.com/studio/gemini/agent-mode` — **split, then accept**.
   - Still directly supports Agent Mode, multi-stage tool use, edits across files, permission grants, review/approval, parallel conversations, iterative builds, Logcat/device inspection, screenshots, and `adb shell input`.
   - Keep: `editor-agent-mode`, `editor-agent-shell-tools`, `editor-parallel-sessions`, `editor-change-review`, and `editor-agent-permissions`.
   - Change `editor-background-jobs` to `limited`: multiple conversations can run concurrently and be monitored from Recent Chats, but the page does not establish durability after Android Studio exits.
   - Do not use this page for the visible project tree or integrated terminal. Cite [Android Studio projects](https://developer.android.com/studio/projects) for the Project window and [build from the command line](https://developer.android.com/build/building-cmdline) for View → Tool Windows → Terminal. Otherwise leave those two rows Unknown.

2. `https://developer.android.com/studio/gemini/create-a-new-project-with-ai` — **narrow the claims**.
   - Supports the autonomous new-project loop: generate files, build, inspect build errors, self-correct, and continue until the project builds.
   - It does not support the current `editor-browser-tools` display value “Emulator and device tools”; its validation step tells the operator to run the app. Move that claim to the Agent Mode page, which explicitly documents agent-controlled device deployment, screen inspection, Logcat, screenshots, and input.
   - Change `editor-verification-loop` from “Builds, tests, diagnostics, emulator, and device” to “Builds, build-error diagnosis, emulator, and connected-device checks”. Neither changed source establishes that the agent runs a test suite.

3. `https://developer.android.com/studio/gemini/features` — **accept**.
   - Still supports next-edit prediction, MCP servers, configured local/remote model providers, Agent Mode permissions, parallel conversations, web search, skills, and connected-device tools.
   - The current `editor-inline-prediction`, `editor-mcp`, `editor-model-access`, and integrated-AI boundary claims remain supportable.

4. `https://developer.android.com/studio/install` — **accept**.
   - Still has separate Windows, Mac, Linux, and ChromeOS installation/system-requirement sections and current download/update instructions.
   - It supports the platform profile and active desktop release. Android specialization remains better sourced from the main [Android Studio product page](https://developer.android.com/studio), but is not contradicted here.

### Gemini Code Assist extension

5. `https://developers.google.com/gemini-code-assist/docs/overview` — **replace; do not accept as detailed evidence**.
   - The page now contains only a high-level product sentence and links to Google Cloud documentation. It no longer names VS Code, JetBrains, Android Studio, completion, agent chat, local context, or marketplace installation. It does not support any of the detailed rows currently attached to it.
   - Replace capability evidence with [Gemini Code Assist Standard and Enterprise overview](https://docs.cloud.google.com/gemini/docs/codeassist/overview) and host evidence with [supported IDEs](https://docs.cloud.google.com/gemini/docs/codeassist/supported-languages).
   - Rename the exact product to **Gemini Code Assist Standard / Enterprise extensions**, or add a scope note. Google's current overview says the individual, Google AI Pro, and Google AI Ultra IDE extension tiers stopped serving requests on 2026-06-18 and directs those users to Antigravity. Standard and Enterprise remain active.
   - The supported-IDE page establishes VS Code and JetBrains extension hosts and distinguishes Android Studio's built-in integration. Do not describe Android Studio as an installed Gemini Code Assist extension.
   - The current pages do not directly enumerate client operating systems. Either add first-party marketplace/system-requirement evidence for macOS, Windows, and Linux or make the platform profile Unknown; do not infer OS support solely from the host names.

### Warp

6. `https://docs.warp.dev/code/code-editor` — **accept**.
   - Directly supports both `workbench-editor` and `workbench-file-tree`, including edits, tabs, syntax support, find/replace, and the Project Explorer.

7. `https://docs.warp.dev/code/ssh-feature-support` — **accept**.
   - Directly supports `workbench-remote-host`. It now gives a more precise boundary: basic agent/shell/MCP functions work in Warpified sessions, while file tree, code editor, indexing, diffs, and code review require Warp's SSH extension on a macOS or Linux host.

8. `https://docs.warp.dev/reference/cli` — **replace the source, keep the capability**.
   - The page still proves programmable CLI control, but now explicitly marks Oz (`oz`, formerly `warp-cli`) deprecated.
   - Cite [Warp Agent CLI overview](https://docs.warp.dev/agents/cli/) and title the evidence “Warp Agent CLI”. It documents the replacement `warp` command, shell execution, persistent conversations, cloud handoff, and orchestration. Keeping “Warp Oz CLI” would make the matrix stale immediately.

### Orca

9. `https://onorca.dev/` — **accept core profile claims; add exact platform sources**.
   - The current page still supports an Agent Development Environment centered on parallel worktrees, local desktop operation, SSH worktrees, MIT source, and macOS/Windows/Linux builds.
   - The homepage does not by itself establish the browser client. Keep `web` only with [Remote Orca Servers](https://www.onorca.dev/docs/remote-servers), which explicitly describes browser clients.
   - The current platform profile omits documented native companions. Add `ios` and `android` with [Orca downloads](https://www.onorca.dev/download) or [mobile companion docs](https://www.onorca.dev/docs/mobile), and keep the note that the desktop/remote runtime remains the source of truth.

### TraeCode

10. `https://www.trae.ai/blog/engineering_thought_0731` — **accept**.
    - Still directly supports `editor-inline-prediction`: Cue provides autocomplete, multi-line/block edits, cursor prediction, auto-import, smart rename, and cross-file navigation.

11. `https://www.trae.ai/blog/product_solo` — **split; do not use for parallel sessions or a project tree**.
    - Supports SOLO agent mode, an integrated editor/browser/terminal/documentation view, autonomous end-to-end work, progress monitoring, and switching between SOLO and IDE modes.
    - It does not mention parallel sessions. Move `editor-parallel-sessions` to the first-party [SOLO GA release](https://www.trae.ai/blog/product_solo_1112?v=1), which explicitly documents multiple agents executing simultaneously.
    - It does not explicitly establish a visible project tree. Either find a current first-party UI reference or preserve Unknown for `editor-project-tree`.
    - Keep `editor-background-jobs` limited; the 2025 page supports autonomous work but not persistence after the client exits. Narrow the review note to “progress and final summary are visible; per-hunk accept/reject is not established.”

12. `https://www.trae.ai/blog/product_thought_0617` — **keep for tool orchestration, replace for verification**.
    - Still supports unified agent mode, autonomous tool selection, code writing, folder browsing, file reading/search, and improved file edits.
    - It does not establish tests, builds, diagnostics, browser inspection, or another verification action. Therefore it does not support `editor-verification-loop`, whose current value says “Agent tool loop; test contract unverified”. A generic tool loop is not a verification loop.
    - Replace that row with a current first-party source that explicitly documents browser inspection/console debugging, or preserve Unknown. The current [TraeCode product page](https://www.trae.ai/ide/) describes an interactive preview tab, console logs, and real-time debugging and is the best available first-party replacement.

13. `https://www.trae.ai/blog/trae_membership_0213` — **accept, with claim-specific reading**.
    - Still supports vendor-managed model choices and context-window/tool-call tiers.
    - It also still names “MCPs, Rules, Memories, Skills” as product capabilities. `editor-mcp` and the conservative `editor-model-access` value remain supported, although the [current TraeCode product page](https://www.trae.ai/ide/) is a better durable source for MCP.

## Evidence acceptance pipeline trap

The 13 rows cannot all be cleared correctly by rerunning `refresh-comparison-evidence.mjs` today.

The monitor advances `reviewedHash` only when a source's `latestReviewAt` is lexically greater than the prior value. Every catalog evidence item uses the date-only global `COMPARISON_SNAPSHOT`, currently `2026-08-23`. A human review later on the same day does not advance that date, so unchanged URLs approved above remain `changed` even after review.

Add an explicit review operation, for example:

```text
npm run refresh:evidence -- --accept-changed <exact-url>
```

That operation should require the URL to be in the current catalog, copy the observed `contentHash` to `reviewedHash`, set a full timestamp `reviewedAt`, and append a small audit record. It must not accept unreachable or awaiting-refresh sources. Replaced URLs should enter as new sources and receive their first baseline normally.

Do not bump the snapshot to a future date and do not mass-accept all changed URLs: Gemini Code Assist, Warp CLI, Android's new-project claim, and multiple Trae claims require catalog edits first.

## Implementation order

1. Remove orphan `openhands`; add the three license corrections.
2. Add GitLab forge support or explicitly quarantine that metric record until it exists.
3. Correct chronological stable/prerelease selection and Happy's component-only release policy.
4. Apply the evidence claim/source edits above.
5. Add explicit same-day evidence acceptance and accept only URLs that remain in the catalog after the edits.
6. Refresh these manifest projects with `--loc`, then verify every displayed metric has a measured ref, commit SHA, CLOC version, scope note, and source link.
