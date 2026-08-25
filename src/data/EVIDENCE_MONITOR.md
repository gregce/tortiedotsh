# Comparison evidence monitor

Repository statistics can be regenerated directly from APIs. Product-capability
claims cannot: a changed sentence in vendor documentation needs review before it
changes a public matrix value. The evidence monitor automates the safe part of
that process.

`comparison-evidence-status.json` is a generated registry of every unique
first-party URL used by a catalog profile or scored capability cell. Run:

```sh
npm run refresh:evidence
```

The collector:

1. deterministically enumerates source URLs and every catalog field that uses them;
2. turns GitHub file links into raw-file requests and repository roots into README API requests;
3. strips scripts, styles, comments, tags, and whitespace from HTML before hashing;
4. records the resolved URL, HTTP status, content type, ETag, Last-Modified value,
   normalized SHA-256 content fingerprint, timestamps, and request errors;
5. preserves the reviewed fingerprint until a claim's `checkedAt` date advances;
6. marks a source `changed` when its current fingerprint differs from the reviewed fingerprint.

A source that has never returned usable content remains `awaiting-refresh` after
a transient HTTP or network failure. It becomes `unreachable` only after the
monitor has previously recorded a valid fingerprint, so a first run without a
GitHub token does not create a false public regression alert.

Use `--sync-only` after editing the catalog to reconcile URLs without making
network requests. Use `--dry-run` to test a network refresh without writing.

The weekly workflow refreshes this registry alongside open-source metrics. A
changed or unreachable source is surfaced beside the affected matrix evidence
links. It is a review queue, not an automatic capability rewriter: a maintainer
opens the linked first-party page, updates the claim or returns it to `Unknown`,
then advances `checkedAt`. The following refresh accepts that document version
as the new reviewed baseline.

Dynamic vendor sites can change navigation or build metadata without changing
product behavior. Text normalization reduces that noise, but human review remains
the publish boundary. GitHub releases, repository metadata, and exact-ref LOC
remain fully automated by the separate metrics collector.
