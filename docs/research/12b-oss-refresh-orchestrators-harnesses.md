# OSS refresh audit: orchestrators and harnesses

Checked 2026-08-23 against each canonical GitHub repository and GitHub's REST API. This audit covers the 14 `agent-orchestrators` and 15 `coding-agent-harnesses` entries currently present in `open-source-projects.json`. It does not treat a public repository as proof that a product is open source, and it does not treat an arbitrary repository tag as a stable product release.

## Result

The manifest is structurally ready for the weekly refresh, with three required curation changes and several release/LOC caveats that automation must keep explicit:

1. Coder Mux has been renamed **Xum**. GitHub now canonicalizes [`coder/cmux`](https://github.com/coder/cmux) to [`coder/xum`](https://github.com/coder/xum), and the current README calls the product “Xum - Coding Agent Multiplexer.” This is an exact-product identity migration, not a new product or a repository fork.
2. GitHub reports `NOASSERTION` for Paseo even though the root [`LICENSE`](https://github.com/getpaseo/paseo/blob/main/LICENSE) grants the project under AGPLv3. The manifest needs a dated `AGPL-3.0-only` override.
3. GitHub reports `NOASSERTION` for Superset even though [`LICENSE.md`](https://github.com/superset-sh/superset/blob/main/LICENSE.md) is Elastic License 2.0. The manifest needs a dated `Elastic-2.0` override. Superset must remain `source-available`, not `open-source`.

No other canonical-repository error was found. All other coordinates returned the same `full_name`, are non-forks, and were unarchived when checked. Pi's current canonical organization repository is [`earendil-works/pi`](https://github.com/earendil-works/pi), not the historical `badlogic/pi-mono` identity.

## Required coordinated corrections

### Coder Mux to Xum

Keep the stable join ID `coder-mux`, but update all user-visible and source-identity surfaces together:

- manifest coordinates: `owner: "coder"`, `repo: "xum"`, `githubUrl: "https://github.com/coder/xum"`, `apiUrl: "https://api.github.com/repos/coder/xum"`;
- catalog product name: `Xum`; repository URL: `https://github.com/coder/xum`;
- evidence titles and repository links that currently call the product Coder Mux;
- identity asset provenance and logo to the first-party Xum artwork, for example [`docs/img/black-xum.svg`](https://github.com/coder/xum/blob/main/docs/img/black-xum.svg);
- generated metrics, by running the normal refresh after the manifest and catalog agree.

The existing product ID and metrics ID should not change: they are durable internal keys. The README still contains some old `mux.coder.com` and `coder/mux` links, so URL redirects alone are not a reliable product-name signal.

### License overrides

GitHub's `license.spdx_id: NOASSERTION` is not equivalent to “no license.” These two root license files are clear enough for deterministic, dated manifest overrides:

```json
{
  "id": "paseo",
  "license": {
    "spdxId": "AGPL-3.0-only",
    "name": "GNU Affero General Public License v3.0 only",
    "sourceUrl": "https://github.com/getpaseo/paseo/blob/main/LICENSE",
    "checkedAt": "2026-08-23"
  }
}
```

```json
{
  "id": "superset",
  "license": {
    "spdxId": "Elastic-2.0",
    "name": "Elastic License 2.0",
    "sourceUrl": "https://github.com/superset-sh/superset/blob/main/LICENSE.md",
    "checkedAt": "2026-08-23"
  }
}
```

`AGPL-3.0-only` is used because Paseo's grant incorporates the version 3 text and does not add an “or any later version” grant. Superset's ELv2 terms restrict offering the software as a managed service, so its public source is measurable but must not be counted as OSI open source.

## Repository and release audit

“Latest release” below means GitHub's [`releases/latest`](https://docs.github.com/en/rest/releases/releases#get-the-latest-release) result. “Top tag” is shown only where it demonstrates why taking `tags[0]` would be unsafe. Tags are not promoted to a verified stable release.

### Agent orchestrators

| Manifest ID | Canonical repository | License evidence | Release state checked | Refresh note |
| --- | --- | --- | --- | --- |
| `orca` | [`stablyai/orca`](https://github.com/stablyai/orca) | MIT | `v1.4.188` | Exact Orca family; repository also contains mobile, native, examples, skills, and tests. |
| `bb` | [`get-bb/bb`](https://github.com/get-bb/bb) | MIT | `desktop-v0.39.0`; top tag `plugin-memory-v0.2.0` | Product-prefixed release is valid; a naïve top-tag version would join the plugin instead of desktop. |
| `omnigent` | [`omnigent-ai/omnigent`](https://github.com/omnigent-ai/omnigent) | Apache-2.0 | `v0.10.0`; top tag `v0.11.0.dev20260823` | Stable release endpoint correctly avoids a development tag. |
| `agent-orchestrator` | [`Untrivial-ai/agent-orchestrator`](https://github.com/Untrivial-ai/agent-orchestrator) | Apache-2.0 | `v0.12.6`; top tag `v0.12.7-nightly.202608231948` | Stable release endpoint correctly avoids nightly tags. |
| `emdash` | [`generalaction/emdash`](https://github.com/generalaction/emdash) | Apache-2.0 | `v1.1.40`; top tag `v1.1.41-canary.84` | Stable release endpoint correctly avoids canaries. |
| `kandev` | [`kdlbs/kandev`](https://github.com/kdlbs/kandev) | AGPL-3.0 | `v0.91.0` | Exact product repository. |
| `paseo` | [`getpaseo/paseo`](https://github.com/getpaseo/paseo) | Root license is AGPLv3; API says `NOASSERTION` | `v0.5.1` | Add the manifest override above. |
| `superset` | [`superset-sh/superset`](https://github.com/superset-sh/superset) | Root license is Elastic-2.0; API says `NOASSERTION` | `desktop-v1.24.2`; top tag `v0.0.1` | Source-available boundary and product-prefixed release must remain explicit. |
| `coder-mux` | [`coder/xum`](https://github.com/coder/xum) | AGPL-3.0 | `v0.28.2`; top tag `v0.28.3-nightly.70` | Required rename/coordinate migration described above. |
| `nimbalyst` | [`nimbalyst/nimbalyst`](https://github.com/nimbalyst/nimbalyst) | MIT | `v0.74.4`; top tag `v0.75.0` | A tag can be newer than the latest verified stable release; keep the distinction. |
| `sculptor` | [`imbue-ai/sculptor`](https://github.com/imbue-ai/sculptor) | MIT | `sculptor-v0.44.0` | Product-prefixed release is valid. |
| `claude-squad` | [`smtg-ai/claude-squad`](https://github.com/smtg-ai/claude-squad) | AGPL-3.0 | `v1.0.20` | Exact product repository. |
| `agent-deck` | [`asheshgoplani/agent-deck`](https://github.com/asheshgoplani/agent-deck) | MIT | `v1.15.0` | Exact product repository. |
| `vibe-kanban` | [`BloopAI/vibe-kanban`](https://github.com/BloopAI/vibe-kanban) | Apache-2.0 | `v0.1.44-20260424091429`; top tag is malformed `vv0.0.40-nbump.2...` | Repository is unarchived, but its first-party notice says the product is sunsetting. Archive/activity automation must not overwrite the editorial lifecycle status. |

### Coding-agent harnesses

| Manifest ID | Canonical repository | License evidence | Release state checked | Refresh note |
| --- | --- | --- | --- | --- |
| `codex-cli` | [`openai/codex`](https://github.com/openai/codex) | Apache-2.0 | `rust-v0.149.1`; top tag was a `winget-test-...alpha` artifact | The release prefix is correct for the current Rust CLI. Whole-repo LOC includes the Codex CLI family, SDK, app-server, tools, and retained legacy source. |
| `gemini-cli` | [`google-gemini/gemini-cli`](https://github.com/google-gemini/gemini-cli) | Apache-2.0 | `v0.56.0`; top tag `v0.57.0-preview.0` | Stable endpoint correctly excludes preview; repository LOC also counts code in eval/integration/memory/performance test trees. |
| `codewhale` | [`Hmbown/CodeWhale`](https://github.com/Hmbown/CodeWhale) | MIT | `v0.9.11` | Exact current successor repository. |
| `qwen-code` | [`QwenLM/qwen-code`](https://github.com/QwenLM/qwen-code) | Apache-2.0 | `v0.22.0`; top tag `weaken-tool-error-shots` | Strong example of why top-tag inference is invalid. |
| `grok-build` | [`xai-org/grok-build`](https://github.com/xai-org/grok-build) | Apache-2.0 | No release and no tag | Version remains Unknown; LOC correctly falls back to the default branch at a recorded commit SHA. Public source and an Apache license support the OSS classification even though contributions are not accepted. |
| `opencode` | [`anomalyco/opencode`](https://github.com/anomalyco/opencode) | MIT | `v1.18.21`; top tag `vscode-v0.0.13` | Catalog column is CLI-scoped, while whole-repo LOC also includes SDKs, apps/packages, infra, and integrations. |
| `pi` | [`earendil-works/pi`](https://github.com/earendil-works/pi) | MIT | `v0.84.2` | Canonical identity is correct. Pi coding agent is one package in the broader Pi agent toolkit, so LOC is family-wide. |
| `aider` | [`Aider-AI/aider`](https://github.com/Aider-AI/aider) | Apache-2.0 | `v0.86.0` (2025-08-09); top tag `v0.86.3.dev` | An old stable release is still a verified stable release; do not replace it with a dev tag or infer abandonment. |
| `goose` | [`aaif-goose/goose`](https://github.com/aaif-goose/goose) | Apache-2.0 | `v1.47.0`; top tag `v2.0.0-rc-04-27-0` | Canonical post-transfer organization is correct. CLI column joins a broader repo containing UI, services, evals, and examples. |
| `deepseek-harness` | [`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness) | MIT | No GitHub release; top tag `dsh-v0.1.1-rc.2` | The tag is explicitly an RC and must remain “repository tag,” never “stable release.” LOC uses the default branch, not the RC tag. |
| `prime-agent` | [`PrimeIntellect-ai/prime-agent`](https://github.com/PrimeIntellect-ai/prime-agent) | MIT | `v0.8.0` | Exact family; whole repo includes packages and `prime-agent-runtime`. |
| `kimi-code-cli` | [`MoonshotAI/kimi-code`](https://github.com/MoonshotAI/kimi-code) | MIT | `@moonshot-ai/kimi-code@0.38.0` | Scoped package tag is the official release identity; do not normalize it into an invented semver string. |
| `mistral-vibe` | [`mistralai/mistral-vibe`](https://github.com/mistralai/mistral-vibe) | Apache-2.0 | `v2.24.3` | Exact product repository. |
| `amplifier-agent` | [`microsoft/amplifier-agent`](https://github.com/microsoft/amplifier-agent) | MIT | `v0.14.1`; top tag `wrapper-v0.7.1` | Current release is agent-scoped; top tag belongs to a wrapper component. |
| `gptme` | [`gptme/gptme`](https://github.com/gptme/gptme) | MIT | `v0.33.0`; top tag `v0.33.1.dev20260820` | Stable endpoint correctly avoids development tags. |

Release values are a dated audit sample, not hard-coded catalog facts. The weekly job should continue to resolve them from GitHub and store the exact source URL and fetch time.

## Release resolution traps and deterministic policy

The current collector's policy is substantially correct:

1. Use `GET /repos/{owner}/{repo}/releases/latest` first.
2. Present only that result as a verified stable release.
3. If no release exists, retain the first repository tag separately as `latestTag`; do not give it a release date and do not label it stable.
4. For LOC, check out the stable release tag when one exists. Otherwise check out the default branch and record the exact commit SHA. The collector does **not** measure an arbitrary fallback tag.

This prevents today's preview/nightly/canary/dev traps for Omnigent, Agent Orchestrator, Emdash, Xum, Gemini CLI, Goose, Aider, and gptme, and it prevents unrelated component tags from becoming the product version for bb, Qwen Code, Codex, OpenCode, and Amplifier.

One remaining design gap is multi-product GitHub Releases feeds. `releases/latest` can become another component's release in the future. bb, Superset, Codex, Sculptor, Kimi Code, OpenCode, and Amplifier already demonstrate component-prefixed release identities. The manifest currently supports only “accept GitHub latest” or “ignore all releases and use the default branch”; it cannot say “accept only tags matching `desktop-v*`.” Add an optional reviewed `release.tagPattern`/`release.productPrefix` only if a wrong latest release actually appears. Until then, retain the exact returned tag rather than guessing.

DeepSeek Harness needs no release-policy override today: the UI already distinguishes its RC tag from a stable release, and LOC resolves to `master`. Grok Build correctly has no version. Aider's 2025 stable release must not be suppressed merely because it is old.

## LOC scope and exclusion audit

The collector runs `cloc` over a shallow, ref-pinned checkout and records the commit SHA, tool version, code/comments/blanks/files, measurement time, and exact exclusions. It excludes Markdown, JSON/JSONC, YAML, TOML, XML, CSV/TSV, text, and lock files, plus dependency/build/generated directories including `node_modules`, `vendor`, `third_party`, `dist`, `build`, `target`, coverage, `.next`, `out`, and directories named `generated`. This satisfies the requirement that documentation and structured data not inflate source LOC.

The number is nevertheless **repository source LOC**, not “production application LOC”:

- tests, fixtures written in programming languages, examples, evals, scripts, SDKs, and sibling packages count;
- Orca includes desktop/web plus mobile and native clients;
- Codex CLI, OpenCode CLI, Goose CLI, Pi coding agent, Gemini CLI, DeepSeek Harness, and Prime Agent all join repositories broader than the named operator surface;
- source-available Superset is measurable with the same method, but its LOC must not be presented as an OSS quality score.

This is not a bad join: each repository is the official source family containing the exact product. It is a labelling constraint. UI copy should say “source lines in canonical repository at measured ref,” and comparisons should not imply that family-wide LOC measures product quality or implementation efficiency.

Two reproducibility gaps remain:

- The manifest has no per-project include roots. Adding `loc.includePaths` would allow a deliberately narrower SKU count, but only after documenting the path contract and retaining the whole-repository method as a separately named series. Silently changing existing counts would destroy longitudinal comparability.
- The workflow uses `ubuntu-latest` and installs the distribution's current `cloc`; that tool version can change. Pin the runner image or CLOC version, and include the tool version in the cache key. Today the reuse check compares ref, SHA, and methodology but not the `cloc` version. Any exclusion change must also increment the methodology identifier so unchanged SHAs are remeasured.

The unusually high measured counts for repositories such as Orca, Codex, Gemini CLI, OpenCode, and Goose are therefore scope signals, not evidence that Markdown or JSON leaked into CLOC. Their stored records show the source-only exclusion list. A future path-scoped metric should be added as a new method rather than retroactively relabeling these whole-repository measurements.

## Automation boundary

The weekly workflow at [`.github/workflows/refresh-open-source-metrics.yml`](../../.github/workflows/refresh-open-source-metrics.yml) already performs the correct broad loop: GitHub metadata, release/tag state, contributor pagination, languages, CLOC, evidence fingerprints, strict freshness validation, and a generated-data commit. The product build remains network-free.

Automation can safely refresh facts that GitHub owns. It cannot safely decide:

- that a redirect/rename represents the same product rather than a repository transfer;
- that `NOASSERTION` means no license;
- that a public source license is OSI open source;
- which component in a monorepo is the catalog SKU;
- whether an unarchived repository's product is active, sunsetting, or superseded;
- whether a new release prefix still names the evaluated product.

Those remain dated manifest/catalog review decisions. The freshness audit should fail closed on identity disagreement, missing public-source metrics, unresolved license overrides, or a release-policy exception older than its review window. It should never replace those cases with a guessed value.

## Implementation checklist

- [ ] Apply the two license overrides exactly as shown.
- [ ] Coordinate the Xum manifest, catalog, evidence, asset, and generated-metrics migration while keeping stable ID `coder-mux`.
- [ ] Run `node takes/three/scripts/refresh-open-source-metrics.mjs --sync-only` after manifest identity changes, then the normal networked `--loc` refresh.
- [ ] Run `npm --prefix takes/three run audit:freshness`; do not ship a partial/stale generated record.
- [ ] Keep Superset `source-available` and Vibe Kanban `sunsetting` regardless of their current unarchived GitHub state.
- [ ] Preserve DeepSeek's RC as `latestTag`, Grok Build's version as Unknown, and Aider's older release as its latest verified stable release.
- [ ] Consider pinning CLOC and adding its version to the reuse key before treating repeated counts as fully reproducible across runner upgrades.
