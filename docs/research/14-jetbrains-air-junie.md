# JetBrains Air and Junie classification

Checked 2 September 2026 against first-party JetBrains product pages, documentation, legal terms, changelogs, and repositories.

## Classification

- **JetBrains Air** belongs in Agent Orchestrators. JetBrains describes it as an agentic development environment built around concurrent delegated tasks, multiple harnesses, Git worktrees, Docker isolation, attention routing, and review.
- **Junie CLI** belongs in Coding-agent Harnesses. It owns an interactive or headless model conversation and tool loop, and supports session resume, multiple providers, MCP, project instructions, approvals, subagents, structured output, Git-aware review, and image input.
- **Junie for JetBrains IDEs** belongs in IDE Extensions. It is installed into the JetBrains IDE family or Android Studio and exposes the Junie engine through AI Chat or a dedicated tool window.

The two Junie columns deliberately represent exact surfaces. CLI-only features such as headless JSON output and worktree session management are not assigned to the IDE plugin, while IDE-only review and host integration are not generalized to the terminal client.

## Source boundary

JetBrains publishes a public `JetBrains/junie` repository for installers, registries, templates, tests, and issue tracking. Its license reserves the product to JetBrains and points users to JetBrains AI terms. The catalog therefore records the repository as `metadata-only`, labels both Junie surfaces proprietary, and does not create an open-source metrics or CLOC join.

Air is also proprietary. Its product agreement prohibits deriving source code and retains product intellectual-property rights to JetBrains. No repository metrics join is appropriate.

## Primary sources

- <https://air.dev/>
- <https://air.dev/download>
- <https://air.dev/changelog>
- <https://blog.jetbrains.com/air/2026/03/air-launches-as-public-preview-a-new-wave-of-dev-tooling-built-on-26-years-of-experience/>
- <https://blog.jetbrains.com/air/2026/06/jetbrains-air-lands-on-windows/>
- <https://www.jetbrains.com/legal/docs/terms/jetbrains-air/>
- <https://junie.jetbrains.com/docs/junie-cli.html>
- <https://junie.jetbrains.com/docs/junie-ide-plugin.html>
- <https://junie.jetbrains.com/docs/parameters.html>
- <https://junie.jetbrains.com/docs/guidelines-and-memory.html>
- <https://junie.jetbrains.com/docs/action-allowlist-junie-cli.html>
- <https://junie.jetbrains.com/docs/junie-cli-subagents.html>
- <https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/>
- <https://github.com/JetBrains/junie/blob/main/LICENSE.md>
