# 06. Comparison evidence audit

**Audit date:** 2026-08-23

**Initial publish decision:** Blocked pending the P0 items below.

**Post-remediation decision:** Guarded launch for evidence-qualified columns; unresolved cells remain explicitly `Unknown` and four identity-incomplete products remain outside the public matrix. See “Remediation record” below.
**Scope:** High-risk correctness issues in `04-comparison-taxonomy.md` and `05-matrix-ux-spec.md`, checked against the local Tortie/gmux and Orca research plus the current first-party sources reached during this audit. This is not a completeness or prose review.

## Must fix before publish

1. **Correct the repository identities that feed automated metrics.**
   - Goose has moved from `block/goose` to [`aaif-goose/goose`](https://github.com/aaif-goose/goose). Keep `block/goose` only as an alias/redirect. The comparison catalog and generated metric record already use the new owner, but `04-comparison-taxonomy.md` still presents the old repository as unresolved.
   - The initial audit suspected [`badlogic/pi-mono`](https://github.com/badlogic/pi-mono) was current. Follow-up identity verification established [`earendil-works/pi`](https://github.com/earendil-works/pi) as the current organization-owned repository, so the catalog, manifest, and generated metrics now agree on it. Keep the former name only as historical discovery context.
   - Keep [`anomalyco/opencode`](https://github.com/anomalyco/opencode) as OpenCode's canonical repository. Do not revive the unrelated earlier `sst/opencode` identity in aliases or ingestion.

2. **Change Vibe Kanban's status.** Its [official repository](https://github.com/BloopAI/vibe-kanban) says the product is sunsetting. `community-maintained` and the prose “community-maintained after the maker shutdown” are not supported current states. Use `sunsetting` (or `status unknown` if the schema cannot represent that), attach the announcement date/source, and do not imply continuing community stewardship without evidence.

3. **Do not label Warp open source.** [`warpdotdev/Warp`](https://github.com/warpdotdev/Warp) is not evidence that the shipped Warp client source is open. The local survey already warns that its public repository has mixed/file-level purposes. The product profile must be `proprietary` or `unknown`, and the repository must not be a `product-source` metrics repository unless a source tree and license for the shipped client are established.

4. **Remove or downgrade capability claims contradicted by the local product inventory.** The current matrix marks `workbench-editor-scm` as `Built in` for wmux, while `gmux/docs/research/24-agent-workspace-product-inventory.md` says wmux has no full editor or decorated project tree. Wave Terminal is also credited with the same combined claim even though that inventory records editor blocks but no VS Code-grade SCM/decorated tree. Split this compound row into editor, file tree, and SCM depth; set unsupported parts to `Unknown` or a precisely bounded `Limited` value.

5. **Stop generating row-level `Built in` claims from generic product roots.** A homepage or repository root establishes identity and possibly an advertised feature, not every capability passed to `builtInClaims(...)`. This currently affects, among others, Cursor, Windsurf, Zed, Airport, wmux, Wave Terminal, T3 Code, Shunt, Devin, and the cloud-agent rows. Each matrix cell needs a direct source that supports that exact proposition; otherwise it remains `Unknown`. A source title such as “Product” is not evidence of terminal ownership, durability, background execution, sandboxing, review delivery, or approval behavior.

6. **Resolve SKU boundaries before scoring Cline, Continue, Kilo Code, Goose, and OpenCode.** The current first-party material documents CLI and/or desktop surfaces for these names. The matrix currently gives each name one primary category while adding `cli` or `desktop-client` tags. That is safe only if every feature cell is explicitly scoped to the extension, CLI, or desktop surface. Prefer separate rows when the surface is independently installed or versioned (for example, `Cline extension` and `Cline CLI`). At minimum, rename the existing columns to the evaluated SKU and do not transfer capabilities or OS support between surfaces.

7. **Make the metrics labels match what the collector actually measures.** The design documents promise “deduplicated human contributors at the stable release” and “active human authors in the last 90 days.” The collector documentation says it counts entries from GitHub's current contributors endpoint, including anonymous contributors. That is neither deduplicated people, human-only, release-bounded, nor a 90-day activity count. Until a different collector exists, label it `GitHub contributor entries (current repository history)` and remove `human`, `at the stable release`, and `active in 90 days` claims.

8. **Do not present tag fallback as a verified latest stable release.** A first tag returned by GitHub is not necessarily the project's stable product version, and default-branch LOC is not release LOC. Require a per-project stable-tag pattern or package/release resolver. When that resolver is absent, show `Latest stable version: Unknown`; separately show `Latest repository tag` or `LOC at default-branch commit` with the exact ref. Sorting must not mix these values under one “latest release” or “source LOC” label.

9. **Preserve platform type, not only platform name.** The taxonomy correctly distinguishes native OS support, WSL-only support, browser client, full mobile client, and companion. The profile currently collapses them into values such as `ios`, `web`, or `windows`. That can make cmux or Orca's companion/client reach look like equivalent full-platform support. Store `surface`, `role`, and `execution target` separately; OS filtering must say whether it filters the operator client, desktop host, relay client, or execution host.

10. **Exclude evidence-incomplete columns from the public launch matrix.** `Muse Code` has no first-party URL. Mosaic Terminal and Airport lack verified source/license status. Omnara is explicitly pivoted and its earlier companion claims cannot be carried onto the current API product. These records may appear in a clearly labeled research backlog, but must not appear as ordinary current product columns until identity, evaluated SKU/version, current status, and claim-level sources are attached. Shunt was initially in this group but is now public after a direct first-party evidence pass established its current identity, platforms, and launch claims.

## Category and identity corrections

| Product | Current treatment | Required treatment |
| --- | --- | --- |
| Goose | Whole product under coding-agent harnesses | Either `Goose CLI` under harnesses or a clearly scoped hybrid record. The official repository describes desktop, CLI, and API surfaces, so unqualified `Goose` must not inherit CLI-only cells. |
| Cline | IDE extension with a CLI tag | Keep the extension only if the column is renamed/scoped to it; ingest the independently documented CLI as a separate SKU when version evidence is available. |
| Continue | IDE extension with a CLI tag | Same SKU split rule as Cline. Do not inherit JetBrains/VS Code capabilities into Continue CLI or vice versa. |
| Kilo Code | IDE extension with a CLI tag | Same SKU split rule. `Kilo Code` without a surface qualifier is too broad for row-level claims. |
| OpenCode | Harness with desktop and extension tags | Acceptable only as `OpenCode CLI`; otherwise split the beta desktop app and integrations where their release/support contracts differ. |
| Omnara | Remote companion marked pivoted | Treat the earlier companion as a frozen historical SKU. Classify the current durable-agent API independently after new evidence; do not score it as the same product. |
| Warp | Open-source agent workbench | Workbench/hybrid classification can remain, but source model must be proprietary/unknown and cloud-agent claims must be surface-scoped. |
| Vibe Kanban | Active community-maintained orchestrator | Orchestrator classification is sound; lifecycle status must be `sunsetting`, with claims frozen to a dated evaluated release. |

Orca's primary orchestrator classification is supported by its local source and README: worktree creation, fan-out, compare/review, and merge are the product spine. Tortie's primary workbench classification is likewise supported by the gmux research: durable named terminal sessions are primary and worktrees are optional. These two anchor classifications should remain.

## Unsupported negatives and required Unknowns

`Not available` requires affirmative, version-specific evidence. An omitted docs section, an empty repository search, a marketing page, or a product-category assumption cannot support it. Apply the following publish rule:

- Use `Unknown` for app-quit PTY survival, crash survival, reboot reconstruction, telemetry defaults, code-training policy, network controls, secret exclusions, audit logs, enterprise controls, self-hosting, local-only mode, and native platform support unless a direct first-party source or reproduced test establishes the answer.
- Use `Unknown` for claims that a product has no editor, SCM, worktree support, mobile client, background agent, or extension ecosystem unless the evaluated version's documentation or an observed test establishes the absence.
- Use `Limited` only when the limitation itself is sourced. For example, provider-native relaunch is not evidence of live PTY survival; describe the former without asserting the latter is impossible.
- Use `Not applicable` only for a logically impossible row with a recorded reason. Hosted execution does not automatically make OS, local client, or self-hosting rows inapplicable; those may still be `Unknown` or `Not available` depending on evidence.

The following launch records should remain `Unknown` for source model or current status until direct evidence is attached: Kiro's shipped-client license, Mosaic Terminal, Airport, Wave Terminal, T3 Code, and Muse Code. Historical/pivoted records—Void, Omnara's former product, and any deprecated HumanLayer repository—must show an evaluated version and frozen evidence date rather than inheriting current defaults.

## Evidence-model blockers in the specifications

- The proposed evidence record allows `confidence: inferred` alongside a scored value. Inference may explain an `Unknown` or a research note, but it must not produce `Built in`, `Limited`, or `Not available` in the public matrix.
- Repository presence is not license evidence. License must come from the exact measured source tree/tag, and the license of a repository must not be transferred to a separately distributed vendor build or hosted service.
- Product `status` must not default to `active` merely because a URL exists. Status needs a current source or should be `Unknown`; Vibe Kanban demonstrates the failure mode.
- “Latest release,” contributor count, LOC, language percentages, and activity dates need independent freshness and error states. A successful repository metadata fetch must not make a stale LOC or failed release resolver look current.
- Combined Boolean rows such as `editor-scm`, `review-delivery`, `extension-protocol`, and `cloud-live-observability` are too broad to evidence cleanly. Split them before comparing products; otherwise one supported subfeature incorrectly grants the whole cell.

## Publish gate

The category-navigation and `Unknown`/`Not available` UX in `05-matrix-ux-spec.md` are directionally sound. Publish only after all of the following are true:

- every visible product has a canonical current identity and evaluated SKU/version;
- all repository redirects and aliases resolve to one metrics repository node;
- Vibe Kanban and other lifecycle states are corrected;
- Warp's source model and Pi's metrics repository are corrected;
- every non-Unknown cell has claim-level support rather than a generic product URL;
- compound claims are split or downgraded;
- contributor and LOC labels describe the collector actually shipped;
- evidence-incomplete products are removed from the launch columns or visibly separated as backlog records;
- a validation step rejects `Not available` without affirmative evidence and rejects a known status/license sourced only from URL existence.

Until then, the matrix may be used as an internal research instrument, but it should not be represented as an evidence-backed public comparison.

## Remediation record

The implementation was revised after this audit. The original findings above remain intact as the review record; this section records the launch guardrails now in code.

- Canonical metric joins now use `aaif-goose/goose`, `anomalyco/opencode`, and the current `earendil-works/pi` repository. The former Pi identity is retained only as historical discovery context.
- Vibe Kanban is labelled `sunsetting`. Warp is labelled proprietary and its public metadata repository is excluded from product-source metrics.
- Workbench editor, file-tree, and SCM depth are separate criteria. Unsupported wmux and Wave conclusions are `Unknown`; wmux's narrower Git workflow is labelled `Limited`.
- Cline, Continue, Kilo Code, Goose, and OpenCode columns name the evaluated extension or CLI surface.
- The UI shows only a GitHub `releases/latest` result as “Latest verified stable release”. Repository tags remain separate collector data, and LOC always shows the measured ref and ref type.
- Contributor copy now says “GitHub contributor entries” and explains that the value is the current repository-history endpoint result, including anonymous entries.
- Companion reach is not counted as full desktop-host OS support for cmux, Orca, or Nimbalyst. The filter is labelled “Documented client platform”.
- Mosaic Terminal, Airport, Muse Code, and Omnara remain in the research catalog but are excluded from public columns pending current, SKU-specific evidence. Shunt is public after its current macOS/iOS product and relevant capability claims were re-evidenced from first-party sources.
- `scripts/validate-comparison-data.mjs` now rejects scored cells without evidence, scored inference/community evidence, unsupported `Not available` claims, unknown facts carrying scoring evidence, broken metric joins, duplicate IDs, and ordering drift.

This is a guarded launch, not a claim of exhaustive coverage. A blank research area renders as `Unknown`; it is never converted into a negative conclusion.
