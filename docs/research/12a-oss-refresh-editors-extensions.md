# OSS refresh audit: Code IDEs and Extensions

Checked against first-party repositories and live GitHub API responses on 2026-08-23. Scope: the 9 `code-editors` and 9 `ide-extensions` entries in `takes/three/src/data/open-source-projects.json`, plus the refresh pipeline. GitHub counts and activity are intentionally left to the generated snapshot; this audit covers whether that snapshot can be refreshed deterministically and whether it describes the catalog product honestly.

## Manifest corrections

These four corrections were applied to the shared manifest after this audit. The exact records remain below as review evidence.

### 1. Point avante.nvim at its canonical owner

`yetone/avante.nvim` redirects to `avante-corp/avante.nvim`. GitHub and Git currently follow that redirect, but the manifest should not rely on a historical owner for repository identity or provenance.

```json
{
  "id": "avante-nvim",
  "name": "avante.nvim",
  "category": "ide-extensions",
  "owner": "avante-corp",
  "repo": "avante.nvim",
  "githubUrl": "https://github.com/avante-corp/avante.nvim",
  "apiUrl": "https://api.github.com/repos/avante-corp/avante.nvim",
  "loc": { "enabled": true }
}
```

The catalog's `repository`, `officialUrl`, and repository-derived claim URLs must be changed in the same reviewed change; otherwise the manifest and UI will disagree.

### 2. Reject IntelliJ's cross-product Releases feed

The canonical repository is correct. Its latest GitHub release was [`pycharm/2026.2.1`](https://github.com/JetBrains/intellij-community/releases/tag/pycharm/2026.2.1), published 2026-08-12. That is a PyCharm artifact in a shared source repository, not an IntelliJ IDEA release. Without an exception, the UI reports the wrong product version and CLOC measures the wrong product tag.

Add after `apiUrl`:

```json
"release": {
  "mode": "default-branch",
  "reason": "The shared JetBrains source repository's GitHub Releases feed contains product-specific build artifacts; its latest entry is a PyCharm release, not an IntelliJ IDEA release.",
  "checkedAt": "2026-08-23",
  "rejectedCandidate": {
    "tagName": "pycharm/2026.2.1",
    "name": "pycharm/2026.2.1",
    "url": "https://github.com/JetBrains/intellij-community/releases/tag/pycharm/2026.2.1"
  }
},
```

This deliberately leaves the product release unknown and measures the exact default-branch commit. IntelliJ product-version collection would need a separate JetBrains updater; GitHub Releases cannot supply it.

### 3. Reject Continue's single-surface Releases feed

The canonical repository is shared by the Continue VS Code extension, JetBrains extension, and CLI catalog products. Its latest release was [`v2.0.0-vscode`](https://github.com/continuedev/continue/releases/tag/v2.0.0-vscode), published 2026-06-19. Treating that tag as the release for every join measures a VS Code artifact while presenting repository-wide metrics.

Add after `apiUrl`:

```json
"release": {
  "mode": "default-branch",
  "reason": "The repository is shared by the VS Code extension, JetBrains extension, and CLI; its latest GitHub release is a VS Code-specific artifact and cannot represent every catalog product joined to this repository.",
  "checkedAt": "2026-08-23",
  "rejectedCandidate": {
    "tagName": "v2.0.0-vscode",
    "name": "v2.0.0-vscode",
    "url": "https://github.com/continuedev/continue/releases/tag/v2.0.0-vscode"
  }
},
```

### 4. Override Positron's verified source-available license

GitHub reports `NOASSERTION`, but Posit's [official licensing page](https://positron.posit.co/licensing.html) and canonical [`LICENSE.txt`](https://github.com/posit-dev/positron/blob/main/LICENSE.txt) identify Elastic License 2.0. Posit explicitly calls it source-available, not open source. Add after `apiUrl`:

```json
"license": {
  "spdxId": "Elastic-2.0",
  "name": "Elastic License 2.0",
  "sourceUrl": "https://github.com/posit-dev/positron/blob/main/LICENSE.txt",
  "checkedAt": "2026-08-23"
},
```

## `NOASSERTION` cases that must remain explicit

| Repository | First-party evidence | Correct treatment |
| --- | --- | --- |
| `JetBrains/intellij-community` | Root [`LICENSE.txt`](https://github.com/JetBrains/intellij-community/blob/master/LICENSE.txt) says the open-source build consists of Apache-2.0 software, with third-party components under their own terms; the file also contains JetBrains Open-Source Build Terms. | Do not collapse this to a bare SPDX value until the UI can distinguish source-code licensing, build terms, and third-party notices. |
| `zed-industries/zed` | The canonical [README licensing section](https://github.com/zed-industries/zed#licensing) says the source is primarily GPL-3.0-or-later with marked Apache-2.0 components; collaboration services also carry AGPL-3.0-or-later declarations. | This is genuinely multi-license. Add structured multi-license support rather than claiming the whole repository is only GPL. |
| `TabbyML/tabby` | Root [`LICENSE`](https://github.com/TabbyML/tabby/blob/main/LICENSE) says content outside `ee/` is Apache-2.0 and `ee/` uses its own license. | This is split-license. A single Apache-2.0 override would be false while full-repository CLOC includes `ee/`. |
| `posit-dev/positron` | Posit's licensing page and repository establish Elastic-2.0. | Apply the dated override above; the catalog already labels the product `source-available`. |

Recommended schema follow-up for the first three: let a manifest license record carry `summary` plus a non-empty `components[]` array of `{ spdxId, scope, sourceUrl }`. Keep the existing single SPDX form for genuinely single-license repositories.

## Repository and lifecycle ledger

| ID | Canonical repository | Release resolution | Audit result |
| --- | --- | --- | --- |
| `vscode` | [`microsoft/vscode`](https://github.com/microsoft/vscode) | Stable GitHub release; `1.134.0` on check date | Ready; very large repository. |
| `eclipse-theia-ide` | [`eclipse-theia/theia-ide`](https://github.com/eclipse-theia/theia-ide) | No GitHub release; default branch for CLOC, latest tag only as labelled fallback | Ready. |
| `intellij-community` | [`JetBrains/intellij-community`](https://github.com/JetBrains/intellij-community) | Wrong cross-product release selected | Apply default-branch exception. Split-source boundary: this is the public IntelliJ Platform/IDEA source tree, not all closed IntelliJ product code. |
| `positron` | [`posit-dev/positron`](https://github.com/posit-dev/positron) | Stable GitHub release | Ready after license override; source-available and Code OSS-derived. |
| `onlook` | [`onlook-dev/onlook`](https://github.com/onlook-dev/onlook) | Stable GitHub release exists but is older than branch activity | Mechanically ready. Preserve the stable-release rule; surface release age rather than silently switching refs. |
| `zed` | [`zed-industries/zed`](https://github.com/zed-industries/zed) | Stable GitHub release | Ready with mixed-license disclosure. Full-repo CLOC includes editor and collaboration/server components. |
| `lapce` | [`lapce/lapce`](https://github.com/lapce/lapce) | Stable GitHub release | Ready. |
| `helix` | [`helix-editor/helix`](https://github.com/helix-editor/helix) | Stable GitHub release exists but is older than branch activity | Mechanically ready; show release age. |
| `void` | [`voideditor/void`](https://github.com/voideditor/void) | No GitHub release; default branch for CLOC | Historical repository is correct. It is archived and the first-party README says work is paused; catalog status must stay archived. CLOC includes the Code OSS base. |
| `continue` | [`continuedev/continue`](https://github.com/continuedev/continue) | Latest release is VS Code-specific | Apply default-branch exception. Repository metrics and CLOC span extensions and CLI. |
| `cline` | [`cline/cline`](https://github.com/cline/cline) | Stable GitHub release | Ready, but the repository now spans extension, CLI, and SDK; full-repo LOC is not extension-only LOC. |
| `kilo-code` | [`Kilo-Org/kilocode`](https://github.com/Kilo-Org/kilocode) | Stable GitHub release | Ready; one repository backs both extension and CLI catalog products. |
| `roo-code` | [`RooCodeInc/Roo-Code`](https://github.com/RooCodeInc/Roo-Code) | Final stable release `v3.54.0` | Historical repository is correct, but it was archived and the first-party README says the extension shut down on 2026-05-15. Catalog status should be archived, not active. |
| `pochi` | [`TabbyML/pochi`](https://github.com/TabbyML/pochi) | VS Code-specific stable release, matching the manifest product | Ready. |
| `tabby` | [`TabbyML/tabby`](https://github.com/TabbyML/tabby) | Stable GitHub release | Mechanically ready, but stars, releases, and CLOC describe the complete Tabby server/client monorepo, not only IDE extensions. Mixed-license disclosure required. |
| `codecompanion-nvim` | [`olimorris/codecompanion.nvim`](https://github.com/olimorris/codecompanion.nvim) | Stable GitHub release | Ready. |
| `avante-nvim` | [`avante-corp/avante.nvim`](https://github.com/avante-corp/avante.nvim) | Stable GitHub release | Correct stale owner in manifest and catalog. |
| `refact` | [`smallcloudai/refact`](https://github.com/smallcloudai/refact) | Stable GitHub release | Repository is canonical but was archived 2026-05-30. Refact's first-party [cloud shutdown notice](https://refact.ai/blog/2026/refact-cloud-is-shutting-down/) promised an open-source, local-first future, yet the canonical repo is now read-only; catalog status should not remain active without a new canonical development source. |

## CLOC and scale risks

The pipeline's `source-code-v2` method correctly excludes Markdown, JSON, YAML, TOML, XML, text/data/lock files and common dependency, generated, and build directories. It records the exact ref, commit SHA, CLOC version, exclusions, measurement time, and later verification time.

The remaining risk is checkout scope, not file counting. `git clone --depth=1 --single-branch` has a fixed 10-minute timeout and clones the whole selected tree before exclusions apply. GitHub reported unusually large repository sizes for IntelliJ (5,873,532 KB), VS Code (1,373,836 KB), Continue (872,279 KB), Kilo Code (594,194 KB), Cline (558,188 KB), Zed (507,146 KB), Roo Code (368,021 KB), Pochi (348,842 KB), and Positron (301,775 KB). These API sizes are not checkout sizes, but they identify the jobs most likely to exceed CI time or storage.

Do not disable LOC for these projects. Instead:

1. use the new per-project `loc.timeoutMinutes` field for unusually large repositories; the current manifest assigns larger budgets to IntelliJ, VS Code, and the other high-risk checkouts;
2. persist structured failure reasons and keep the last verified measurement, as the pipeline already does;
3. label full-repository CLOC as repository source LOC, not product-authored LOC;
4. add a `metricScope` note for Code OSS derivatives, split-source products, and monorepos shared by multiple catalog products; and
5. keep releases and default-branch exceptions human-reviewed—the GitHub API cannot infer product boundaries from tag names.

## Deterministic refresh verdict

With the four manifest corrections above, all 18 entries have a deterministic repository/ref policy. That does not make every metric product-specific: IntelliJ, Positron, Void, Continue, Cline, Kilo Code, Zed, and Tabby require visible scope notes. Archive state should automatically flow from GitHub, but publication should fail when an `active` catalog product joins an archived repository; that cross-file invariant would have caught Void, Roo Code, and Refact lifecycle drift.

## Orphan resolution and implementation-ready columns

The manifest currently has no catalog join for Lapce, Helix, or Roo Code. None should be removed.

- **Lapce belongs in Code IDEs.** It is an active, cross-platform graphical code editor with roughly 38,000 GitHub stars on the check date. First-party documentation establishes a project workspace/file explorer, integrated terminal, SSH remote development, WASI plugins, and experimental Copilot support. This is an independently useful comparison column, not a marginal repository statistic.
- **Helix belongs in Code IDEs.** It is an active, cross-platform terminal code editor with roughly 46,000 GitHub stars. Its intentionally terminal-first and non-agentic design supplies an important open-source baseline against which AI-first editors can be compared. The absence of a native agent surface is a result, not a reason to omit the product.
- **Roo Code belongs in IDE extensions as a historical column.** The extension passed 3 million downloads and its repository retains roughly 24,000 stars. It is important to the Cline-derived extension lineage and documents capabilities still used for comparison. Its first-party repository says the extension shut down and was archived on 2026-05-15, so it must be last among extension products, visibly `archived`, and never described as installable today.

Recommended editor order: keep Zed at 12, add Lapce at 13 and Helix at 14, shift Kiro to 15, and shift archived Void to 16. Recommended extension order: keep active products in their current order and add archived Roo Code at 16, after Refact.

### Lapce catalog object

```ts
product({
  id: "lapce", name: "Lapce", categoryId: "code-editors", editorialOrder: 13,
  officialUrl: "https://docs.lapce.dev/get-started/setup",
  repository: repo("lapce/lapce"), repoMetricId: "lapce",
  tags: ["rust", "modal-editing", "remote-ssh", "plugins", "copilot", "oss"],
  platform: ["macos", "windows", "linux"],
  platformSource: { url: "https://docs.lapce.dev/get-started/setup", title: "Lapce setup" },
  source: "open-source", execution: ["local-process", "ssh-host"], status: "active",
  claims: {
    ...builtInClaims(
      "https://docs.lapce.dev/get-started/setup",
      "Lapce setup",
      ["editor-project-tree"],
    ),
    ...builtInClaims(
      "https://docs.lapce.dev/get-started/terminal",
      "Lapce terminal documentation",
      ["editor-terminal"],
    ),
    ...builtInClaims(
      "https://docs.lapce.dev/get-started/remote-development",
      "Lapce remote development",
      ["editor-remote-workspaces"],
    ),
    "editor-inline-prediction": capability(
      "limited",
      "https://github.com/lapce/lapce/releases/tag/v0.4.0",
      "Lapce v0.4.0 release",
      "Lapce documents experimental Copilot support; a current first-party agent workflow is not established.",
      "repository-derived",
    ),
    "editor-model-access": factClaim(
      "Experimental GitHub Copilot integration",
      "https://github.com/lapce/lapce/releases/tag/v0.4.0",
      "Lapce v0.4.0 release",
      "No built-in multi-provider agent surface is established.",
      "repository-derived",
    ),
    "editor-specialization": factClaim(
      "General software development with modal editing",
      "https://github.com/lapce/lapce/blob/master/README.md",
      "Lapce README",
      undefined,
      "repository-derived",
    ),
    "editor-ai-feature-boundary": factClaim(
      "Experimental Copilot completion; no first-party agent panel established",
      "https://github.com/lapce/lapce/releases/tag/v0.4.0",
      "Lapce v0.4.0 release",
      undefined,
      "repository-derived",
    ),
    "editor-release-channel": factClaim(
      "Active stable desktop releases",
      "https://github.com/lapce/lapce/releases/latest",
      "Lapce releases",
      undefined,
      "repository-derived",
    ),
  },
}),
```

Leave the remaining agent-specific cells Unknown. The primary sources establish no native agent mode, background jobs, MCP client, agent permission model, agent sandbox, worktree-managed agent session, or agent change-review workflow; absence should not be inferred from documentation silence.

### Helix catalog object

```ts
product({
  id: "helix", name: "Helix", categoryId: "code-editors", editorialOrder: 14,
  officialUrl: "https://helix-editor.com/",
  repository: repo("helix-editor/helix"), repoMetricId: "helix",
  tags: ["terminal-editor", "modal-editing", "lsp", "tree-sitter", "oss"],
  platform: ["macos", "windows", "linux"],
  platformSource: { url: "https://docs.helix-editor.com/package-managers.html", title: "Helix package managers" },
  source: "open-source", execution: ["local-process"], status: "active",
  claims: {
    ...builtInClaims(
      "https://docs.helix-editor.com/master/commands.html",
      "Helix commands",
      ["editor-project-tree"],
      "Helix provides workspace file explorer and picker commands in its terminal UI.",
    ),
    "editor-terminal": capability(
      "not-available",
      "https://github.com/helix-editor/helix/issues/1976",
      "Helix integrated-terminal proposal",
      "Helix itself runs in a terminal and exposes shell-command pipes, but the integrated-terminal proposal remains open.",
      "source-inspected",
    ),
    "editor-inline-prediction": capability(
      "limited",
      "https://github.com/helix-editor/helix/discussions/4037",
      "Helix Copilot support discussion",
      "Maintainers point to external LSP integrations; Helix has no native Copilot or generic inline-AI integration.",
      "repository-derived",
    ),
    "editor-model-access": factClaim(
      "External LSP or CLI integrations only",
      "https://github.com/helix-editor/helix/discussions/4037",
      "Helix Copilot support discussion",
      "No built-in model provider or agent configuration is established.",
      "repository-derived",
    ),
    "editor-specialization": factClaim(
      "Terminal-first modal code editing",
      "https://github.com/helix-editor/helix",
      "Helix repository",
      undefined,
      "repository-derived",
    ),
    "editor-ai-feature-boundary": factClaim(
      "No built-in AI; external LSP or CLI integrations",
      "https://github.com/helix-editor/helix/discussions/4037",
      "Helix Copilot support discussion",
      undefined,
      "repository-derived",
    ),
    "editor-release-channel": factClaim(
      "Stable GitHub releases; nightly by building master",
      "https://docs.helix-editor.com/install.html",
      "Helix installation documentation",
    ),
  },
}),
```

Keep agent mode, background jobs, agent shell tools, MCP, parallel agent sessions, worktree isolation, agent change review, agent permissions, agent sandbox, browser tools, verification loop, and remote workspaces Unknown. Helix can execute shell commands and run over an SSH shell, but neither fact establishes an integrated agent tool loop or a first-party remote-workspace architecture.

### Roo Code historical catalog object

```ts
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
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/getting-started/installing.mdx",
      "Roo Code installation documentation",
      ["extension-hosts", "extension-agent-panel", "extension-host-vscode"],
      "Historical VS Code, Cursor, VSCodium, Windsurf, and compatible-editor extension surface.",
      "source-inspected",
    ),
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/providers/index.mdx",
      "Roo Code model providers",
      ["extension-provider-choice", "extension-byok-local-model"],
      "Historical support included multiple hosted providers plus Ollama and LM Studio.",
      "source-inspected",
    ),
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/advanced-usage/available-tools/use-mcp-tool.md",
      "Roo Code MCP tool documentation",
      ["extension-mcp"],
      undefined,
      "source-inspected",
    ),
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/checkpoints.mdx",
      "Roo Code checkpoints",
      ["extension-checkpoints"],
      "Task-scoped shadow-Git checkpoints supplied diff review and file/task restoration.",
      "source-inspected",
    ),
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/auto-approving-actions.mdx",
      "Roo Code auto-approval documentation",
      ["extension-permissions"],
      undefined,
      "source-inspected",
    ),
    ...builtInClaims(
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/codebase-indexing.mdx",
      "Roo Code codebase indexing",
      ["extension-codebase-context"],
      undefined,
      "source-inspected",
    ),
    "extension-install-channel": factClaim(
      "Historical Marketplace, Open VSX, and VSIX; distribution ended",
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/getting-started/installing.mdx",
      "Roo Code installation documentation",
      "The extension shut down on 2026-05-15; these are historical channels, not current installation guidance.",
      "source-inspected",
    ),
    "extension-tool-execution-boundary": factClaim(
      "Host IDE workspace and local processes",
      "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/advanced-usage/available-tools/tool-use-overview.md",
      "Roo Code tool-use overview",
      undefined,
      "source-inspected",
    ),
  },
}),
```

Leave inline completion, background delegation, JetBrains hosting, isolated parallel agents, and remote-session client Unknown. Roo Code's “team” and Orchestrator Mode delegated subtasks inside the extension, but the reviewed sources do not establish worktree-isolated parallel extension agents or a durable remote session client. Its archived repository and final release remain valid historical metric sources.
