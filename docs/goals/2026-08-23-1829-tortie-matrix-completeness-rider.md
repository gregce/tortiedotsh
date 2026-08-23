# tortie.sh — Matrix completeness rider

This rider specifies the goal at `/Users/gdc/tortiedotsh/docs/goals/2026-08-23-1829-tortie-matrix-completeness-goal.md`. The repo has no separate architecture document or earlier goal pair; `docs/research/04-comparison-taxonomy.md`, the three `10*` audit ledgers, and `takes/three/src/data/OPEN_SOURCE_METRICS.md` are the as-built substrate.

## Posture

- Preserve stable product/category IDs and current URLs unless a migration includes a redirect.
- Classify by the durable object in the default workflow, not marketing language or feature count.
- Separate independently versioned SKUs: desktop, CLI, extension, and cloud are not interchangeable evidence.
- Scored cells require exact-SKU first-party evidence. Omission stays `Unknown`; affirmative negatives need affirmative proof.
- Public product logos come from exact first-party product assets, then official project/vendor identities as a documented fallback.
- No `git push`. Phased local commits only. Never stage `.specstory/`.

## Data invariants

`comparison-catalog.ts` is editorial truth. `open-source-projects.json` is the hand-curated canonical GitHub identity manifest. `open-source-metrics.json`, `comparison-evidence-status.json`, and `comparison-assets.json` are reproducible generated/reviewed joins.

Every metrics record must contain repository API provenance and non-null `stars`, `forks`, `openIssues`, `contributors`, `repositorySizeKb`, `defaultBranch`, `pushedAt`, `archived`, `languages`, and license resolution. Release absence is a verified result, not an Unknown. LOC records carry measured ref, ref type, commit SHA, original `measuredAt`, current `verifiedAt`, and tool. A remote SHA match may re-verify an unchanged count; a changed SHA must remeasure.

## Phases

Each phase begins with a failing focused assertion or audit, implements the smallest coherent change, then runs structural validation, build, diff check, and a scoped local commit.

### P1 — Durable goal and checkpoint

- Commit this goal+rider pair.
- Reconcile the completed 10a/10b/10c audits, dmux, ChatGPT desktop, and retained trace additions.
- Depth test: catalog/manifest/generated/assets/evidence IDs form exact sets.

### P2 — Agent Traces repository completeness

- Fully refresh SpecStory, Entire, Tapes, AgentsView, Claude Code History Viewer, and Agent Sessions first.
- Render every Open-source project row without blank automatable values.
- Depth test: all six records are `current`, version-resolved, and LOC-measured at exact commits.

### P3 — Fleet-wide GitHub telemetry

- Refresh every manifest project with the workflow token and LOC enabled.
- Add batching/sharding or retries if the 90-minute job cannot finish honestly.
- Depth test: strict audit reports zero incomplete project records.

### P4 — General Purpose Agents

- Add the ninth tab between Cloud Agents and Remote.
- Start with OpenClaw, Nous Research Hermes Agent, and exact-SKU Grok Bot.
- Screen Open Interpreter, Agent Zero, nanobot, and stronger discoveries; reject frameworks and coding-only agents.
- Depth test: category rows discriminate persistence, memory, computer/browser/terminal control, communications, automation, approvals, delegation, execution, isolation, and source model.

### P5 — Code IDEs and Extensions closure

- Revisit every preserved 10a Unknown after source changes.
- Cover notable VSIX/JetBrains ecosystems without duplicating host capabilities.
- Depth test: each remaining Unknown appears in the current audit ledger with exact missing proof.

### P6 — Agent Multiplexers and Orchestrators closure

- Expand notable active OSS multiplexers using adoption and activity signals.
- Re-audit orchestrator isolation, handoff, review, attention, and control claims.
- Depth test: no simple multi-process wrapper is misclassified as a multiplexer or orchestrator.

### P7 — Harnesses closure

- Recheck every harness Unknown against current exact CLI documentation and source.
- Keep platform/client boundaries distinct from web or editor siblings.
- Depth test: all 28+ harness columns have an explicit residual-gap ledger.

### P8 — Cloud, background, and Remote breadth

- Find notable background agents beyond current coverage and expand remote control/relay products.
- Distinguish remote execution ownership from steering an existing session.
- Depth test: every addition passes the primary-object rule and has exact status/platform evidence.

### P9 — Identity and platform asset audit

- Replace generic organization avatars where an exact product mark exists.
- Visually inspect contact sheets and the rendered sticky header at desktop/mobile widths.
- Depth test: asset IDs exactly equal public product IDs; image magic/dimensions/provenance pass.

### P10 — Automation and deployment gate

- Run the scheduled workflow manually on the hosted repo, then verify the weekly schedule.
- Make production run `npm run audit:freshness` before build or require the refresh check.
- Depth test: a stale record, missing metric, changed evidence page, and absent asset each fail with an actionable message.

### P11 — As-built documentation and final acceptance

- Update taxonomy counts/names, audit ledgers, maintenance docs, and README.
- Record exact remaining Unknown counts by category and why they remain.
- Run all structural, freshness, build, link, asset, and rendered operator checks.
- Commit the final as-built state locally; do not push.

## Out of scope

- Generic LLM observability without first-class coding-agent history.
- SDK/framework catalogs whose primary user object is code, not a running end-user agent.
- Community reports as scored evidence.
- Automatic capability rewriting when a monitored page changes; page changes enter human review.
- Invented repository joins for hosted products or incomplete public mirrors.

## Process invariants

- Every addition names its exact SKU, official URL, source boundary, lifecycle, platform, category rationale, and evidence date.
- Repository redirects resolve to canonical coordinates without changing stable catalog join IDs unnecessarily.
- Generated snapshots are committed only after their manifests are synchronized.
- A failed refresh preserves last-known-good data but fails the strict publication audit.
- Phased commits are independently understandable and never include `.specstory/`.
