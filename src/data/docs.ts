import { TORTIE_MACOS_DOWNLOAD_URL } from "./site-links";

export interface DocsNavItem {
  title: string;
  href: string;
  description: string;
  searchTerms?: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export type DocBlock =
  | { type: "paragraph"; html: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; html: string }[] }
  | { type: "code"; label?: string; code: string }
  | { type: "note"; title?: string; html: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface DocSection {
  id: string;
  title: string;
  illustration?: {
    asset: string;
    alt: string;
    width: number;
    height: number;
  };
  blocks: DocBlock[];
}

export interface DocPage {
  path: string;
  slug: string;
  title: string;
  description: string;
  lead: string;
  hero?: {
    asset: string;
    alt: string;
    width: number;
    height: number;
  };
  sections: DocSection[];
}

export const docsNavGroups: DocsNavGroup[] = [
  {
    title: "Start",
    items: [
      {
        title: "What Tortie is",
        href: "/docs/what-tortie-is/",
        description: "Understand the product, who it is for, and where it fits.",
        searchTerms: "what is tortie who for name tortoiseshell cat shell coding agent workspace terminal ide tmux supervisor orchestration",
      },
      {
        title: "Getting started",
        href: "/docs/",
        description: "Install Tortie, open a project, and start your first session.",
        searchTerms: "download dmg install first launch requirements",
      },
    ],
  },
  {
    title: "Core concepts",
    items: [
      {
        title: "Projects and sessions",
        href: "/docs/projects-and-sessions/",
        description: "Understand projects, sessions, surfaces, splits, and the one-window model.",
        searchTerms: "tabs panes layout terminal names",
      },
      {
        title: "Durability and recovery",
        href: "/docs/durability-and-recovery/",
        description: "Learn what survives quit, restart, reboot, and conversation restore.",
        searchTerms: "tmux resume scrollback removed restore crash reboot",
      },
      {
        title: "Attention and Catch Me Up",
        href: "/docs/attention-and-catch-me-up/",
        description: "Find the sessions that need you and review work without reading every terminal.",
        searchTerms: "needs input command j overview digest summary conversation",
      },
    ],
  },
  {
    title: "Work with Tortie",
    items: [
      {
        title: "Session tools and menus",
        href: "/docs/session-tools-and-menus/",
        description: "Use native context menus, captures, scrollback, splits, and session actions.",
        searchTerms: "right click context menu terminal capture screen selection scrollback split copy paste end restore",
      },
      {
        title: "Files, search, and previews",
        href: "/docs/files-search-and-previews/",
        description: "Browse, find, edit, and preview files across open projects.",
        searchTerms: "explorer quick open pierre trees ripgrep tree sitter markdown html image monaco editor shiki react markdown",
      },
      {
        title: "Source control",
        href: "/docs/source-control/",
        description: "Review changes, stage work, commit, inspect history, and check actions.",
        searchTerms: "system git cli pierre diffs diff branch graph github actions scm hooks signing credentials",
      },
      {
        title: "Agent context and skills",
        href: "/docs/agent-context-and-skills/",
        description: "Inspect the skills, MCP servers, hooks, plugins, and instructions an agent will load.",
        searchTerms: "context skills skills.sh mcp hooks plugins instructions precedence shadowed enable disable update",
      },
      {
        title: "Settings and customization",
        href: "/docs/settings-and-customization/",
        description: "Configure agents, launches, appearance, capture, updates, and diagnostics.",
        searchTerms: "preferences command comma general agents keyboard hotkeys appearance font contrast scrollback specstory automatic update updater restart install diagnostics",
      },
      {
        title: "Remote machines",
        href: "/docs/remote-machines/",
        description: "Run sessions and review projects on another Mac with explicit write consent.",
        searchTerms: "ssh tailscale key remote login edit commit",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Supported agents",
        href: "/docs/supported-agents/",
        description: "See built-in agents, launch settings, custom definitions, and resume support.",
        searchTerms: "claude codex cursor gemini qwen muse pi omp grok droid",
      },
      {
        title: "Keyboard shortcuts",
        href: "/docs/keyboard-shortcuts/",
        description: "Use the default shortcuts for projects, sessions, files, and navigation.",
        searchTerms: "hotkeys commands keys command shift option control",
      },
      {
        title: "Changelog",
        href: "/docs/changelog/",
        description: "Read every Tortie release, synchronized from the public repository.",
        searchTerms: "release notes versions added changed fixed commits",
      },
    ],
  },
];

export const docsNavItems = docsNavGroups.flatMap((group) => group.items);

export const docsPages: DocPage[] = [
  {
    path: "/docs/",
    slug: "getting-started",
    title: "Getting started",
    description: "Install Tortie, open a project, and start a durable coding-agent session.",
    lead: "Open a project. Start an agent. Close Tortie whenever you like—your session keeps running.",
    hero: {
      asset: "getting_started",
      alt: "Tortie welcome screen for opening, creating, or cloning a project.",
      width: 1600,
      height: 1014,
    },
    sections: [
      {
        id: "requirements",
        title: "Requirements",
        blocks: [
          { type: "paragraph", html: "Tortie supports Apple silicon Macs running macOS 15.7.9 or later. The release includes its own copy of tmux, so you do not need Homebrew or a separate terminal multiplexer." },
          { type: "note", title: "Tested system baseline", html: "The packaged app has been tested on macOS 15.7.9 and later releases. Intel Macs and earlier macOS versions are not currently supported." },
        ],
      },
      {
        id: "install",
        title: "Install Tortie",
        blocks: [
          { type: "steps", items: [
            { title: "Download the latest DMG.", html: `Download <a href="${TORTIE_MACOS_DOWNLOAD_URL}">Tortie for Apple silicon</a> directly from GitHub.` },
            { title: "Move Tortie to Applications.", html: "Open the DMG and drag Tortie into your Applications folder." },
            { title: "Open Tortie.", html: "macOS may ask you to confirm the first launch of the signed application." },
          ] },
        ],
      },
      {
        id: "first-project",
        title: "Open your first project",
        blocks: [
          { type: "paragraph", html: "Choose any folder from the home screen. A Git repository adds source control, history, branches, and change-aware file decorations. An ordinary folder still supports sessions, files, editing, and search." },
          { type: "list", items: [
            "Open an existing folder.",
            "Create a new folder-backed project and optionally initialise Git.",
            "Clone a repository.",
            "Open a folder on a configured remote machine.",
          ] },
        ],
      },
      {
        id: "first-session",
        title: "Start your first session",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⌘T</kbd>. Choose an installed agent or a shell, give the session a useful name, and confirm its working directory. Tortie applies any launch defaults you have saved for that agent." },
          { type: "note", title: "Tortie does not install agents silently", html: "If an agent is missing, Tortie shows its installation command so you can inspect and copy it. The app does not run that command without you." },
          { type: "paragraph", html: "You can now quit Tortie without ending the session. Reopen the app to reconnect to the same running work." },
        ],
      },
      {
        id: "what-tortie-is-for",
        title: "What Tortie is for",
        blocks: [
          { type: "paragraph", html: "Tortie is for developers who run several coding-agent threads and want one calm place to keep them named, scoped, and recoverable." },
          { type: "list", items: [
            "It is not a supervisor dashboard or an activity feed.",
            "It is not an IDE rebuilt from scratch. It provides the familiar file, search, editor, and source-control tools that agent work needs.",
            "It is not a remote-control API. The optional <code>tortie</code> command only opens a folder.",
            "It does not require you to learn tmux commands, attach rituals, or server concepts.",
          ] },
          { type: "paragraph", html: "Read <a href=\"/docs/what-tortie-is/\">What Tortie is</a> for the full product model, intended audience, and cases where another kind of tool may fit better." },
        ],
      },
    ],
  },
  {
    path: "/docs/what-tortie-is/",
    slug: "what-tortie-is",
    title: "What Tortie is",
    description: "Understand what Tortie does, who it is for, and how it differs from an agent, IDE, or supervisor.",
    lead: "Tortie is a calm agent multiplexer with familiar IDE features for macOS. It keeps coding-agent sessions across projects without tying their lifetime to the app window.",
    sections: [
      {
        id: "product",
        title: "One window for agent work",
        blocks: [
          { type: "paragraph", html: "Tortie launches coding-agent command-line tools and ordinary shells that are already available on your Mac. It keeps each session named and attached to a project, then puts files, search, editing, source control, agent context, and conversation review beside it." },
          { type: "table", headers: ["Tortie provides", "What that means"], rows: [
            ["Project workspace", "Each folder is a project tab with its own sessions, file tree, search, editor, and Git state."],
            ["Durable sessions", "A private tmux server keeps agents and shells running when the Tortie window closes."],
            ["Work review", "Catch Me Up, attention signals, diffs, history, and saved output help you return without supervising every terminal."],
            ["Inspectable agent context", "The Context view shows the skills, MCP servers, hooks, plugins, and instruction files an agent will load."],
            ["Remote projects", "Early support opens folders and runs agents on another Mac over SSH, with writes disabled until you approve a root."],
          ] },
        ],
      },
      {
        id: "behind-the-name",
        title: "Behind the name",
        illustration: {
          asset: "10-mascot-accent-square",
          alt: "Pixel-art Tortie mascot watching blue and amber signals.",
          width: 1536,
          height: 1024,
        },
        blocks: [
          { type: "paragraph", html: "Tortie.sh is a name and a shell joke. A tortie is a tortoiseshell cat; <code>.sh</code> is the familiar suffix for a shell script. The name points to both the cat in the mark and the shell sessions Tortie keeps alive." },
          { type: "paragraph", html: "Tortoiseshell cats have a reputation for being deeply loyal, opinionated, and vigilant. Tortie is built with the same character: it stays with your work after the window closes, keeps sessions firmly named and scoped, and watches quietly for the moment an agent needs you." },
        ],
      },
      {
        id: "not-a-vscode-fork",
        title: "Built from focused parts, not a VS Code fork",
        blocks: [
          { type: "paragraph", html: "Tortie is an Electron application, not a VS Code fork. It does not ship VS Code's workbench, extension host, settings model, or product shell. <a href=\"https://microsoft.github.io/monaco-editor/\">Monaco Editor</a> is a standalone library also used by VS Code. It gives Tortie a proven editing surface without making VS Code the application." },
          { type: "table", headers: ["Surface", "What Tortie uses", "Why"], rows: [
            ["Terminal", "<a href=\"https://xtermjs.org/\">xterm.js</a>, <a href=\"https://github.com/microsoft/node-pty\">node-pty</a>, and a private tmux server", "True terminal behaviour with process lifetime separated from the app window."],
            ["Editing", "<a href=\"https://microsoft.github.io/monaco-editor/\">Monaco Editor</a>", "Mature editing, find, selections, undo, syntax support, and a lazy-loaded editor surface."],
            ["Diffs and files", "<a href=\"https://diffs.com/\">Pierre Diffs</a> and <a href=\"https://www.npmjs.com/package/@pierre/trees\">Pierre Trees</a>", "Virtualized diffs and a path-first explorer with Git state."],
            ["Search and symbols", "<a href=\"https://github.com/microsoft/vscode-ripgrep\">ripgrep</a> and <a href=\"https://tree-sitter.github.io/tree-sitter/\">Tree-sitter</a>", "Fast content search and syntax-aware symbol navigation."],
            ["Markdown", "<a href=\"https://github.com/remarkjs/react-markdown\">react-markdown</a> and <a href=\"https://shiki.style/\">Shiki</a>", "Structured previews with consistent syntax highlighting."],
            ["Source control", "Your system Git CLI", "The same configuration, credentials, hooks, and signing you already use."],
          ] },
        ],
      },
      {
        id: "who-it-is-for",
        title: "Who Tortie is for",
        blocks: [
          { type: "paragraph", html: "Tortie is for developers who use terminal coding agents as part of normal repository work and need to keep several threads understandable over time. If your agents currently live in VS Code, Cursor, or separate terminal windows—and changing projects means hunting for the right window or losing work to a restart—this is the problem Tortie is designed to solve." },
          { type: "list", items: [
            "You run more than one agent session or project at a time.",
            "You want sessions to survive an app quit, crash, or update.",
            "You need to review files, diffs, branches, and agent conversations beside the terminal.",
            "You want to see which configuration and context an agent will actually load.",
            "You prefer named sessions and explicit recovery over a live supervisor dashboard.",
          ] },
        ],
      },
      {
        id: "what-it-is-not",
        title: "What Tortie is not",
        blocks: [
          { type: "list", items: [
            "Tortie is not a coding agent or model. It launches agents you install and choose.",
            "Tortie is not a cloud execution service. Local sessions run on your Mac; remote sessions run on a machine you add.",
            "Tortie is not an autonomous supervisor, task queue, or activity feed. It raises work that needs you and stays quiet otherwise.",
            "Tortie is not a replacement for Git. Its source-control view runs normal Git operations against your repository.",
            "Tortie is not a general remote-control API. The optional <code>tortie</code> shell command only asks the app to open a folder.",
            "Tortie is not a tmux interface you must learn. tmux is the private durability server behind Tortie's project and session language.",
          ] },
        ],
      },
      {
        id: "daily-loop",
        title: "The daily loop",
        blocks: [
          { type: "steps", items: [
            { title: "Open a project.", html: "Choose a local folder, clone a repository, or open an approved folder on another machine." },
            { title: "Start named sessions.", html: "Launch the agents or shells the project needs and arrange related sessions in splits." },
            { title: "Work in one place.", html: "Move between sessions, files, search, source control, and Context without changing project scope." },
            { title: "Leave when you need to.", html: "Quit Tortie without ending live local sessions." },
            { title: "Return with context.", html: "Reconnect to live work, review Catch Me Up, or restore saved sessions after a reboot." },
          ] },
        ],
      },
      {
        id: "choose-another-tool",
        title: "When to choose another tool",
        blocks: [
          { type: "paragraph", html: "Choose a full IDE if you need its language extensions, debugger, or notebook environment as the centre of your work. Choose a cloud agent platform if you need managed machines or unattended jobs that continue after your own hardware is offline. Choose an orchestrator if you want automatic task decomposition, worktree assignment, or a supervisor queue." },
          { type: "paragraph", html: "Tortie is strongest when the unit of work is a project with several durable, human-directed agent sessions." },
        ],
      },
    ],
  },
  {
    path: "/docs/projects-and-sessions/",
    slug: "projects-and-sessions",
    title: "Projects and sessions",
    description: "Understand how Tortie keeps projects, named sessions, and splits coherent.",
    lead: "Projects are folders. Sessions are named terminals. Splits only change how sessions are arranged.",
    hero: {
      asset: "sessions",
      alt: "A Tortie project with named coding-agent sessions arranged beside project files.",
      width: 1600,
      height: 1021,
    },
    sections: [
      {
        id: "projects",
        title: "Projects keep work scoped",
        blocks: [
          { type: "paragraph", html: "A project is a folder-backed workspace shown as a top-level tab. Its sessions, files, search results, source-control state, and attention signals stay together." },
          { type: "table", headers: ["Concept", "What it means"], rows: [
            ["Project", "One local or remote folder and everything Tortie knows about work in it."],
            ["Session", "A named, durable terminal running an agent or shell."],
            ["Split", "A visual arrangement of independent sessions inside one project."],
          ] },
          { type: "paragraph", html: "Use <kbd>⌘1</kbd> to <kbd>⌘8</kbd> to select a project by position. <kbd>⌘9</kbd> selects the rightmost project. Use <kbd>⌃Tab</kbd> and <kbd>⌃⇧Tab</kbd> to cycle." },
        ],
      },
      {
        id: "sessions",
        title: "Sessions belong to the work",
        blocks: [
          { type: "paragraph", html: "Every session has its own name, agent, working directory, process, and state. Create one with <kbd>⌘T</kbd>, rename it with <kbd>F2</kbd>, and move between sessions with <kbd>⌘⌥↑</kbd> and <kbd>⌘⌥↓</kbd>." },
          { type: "list", items: [
            "A running or idle session continues until you deliberately end it.",
            "Closing a project tab does not end the sessions inside it.",
            "Ending or removing a session asks for confirmation.",
            "Session actions include restore or restart, saved output, loaded context, Catch Me Up, and working-directory copy.",
          ] },
        ],
      },
      {
        id: "splits",
        title: "Splits change layout, not ownership",
        blocks: [
          { type: "paragraph", html: "Drag one session onto another to create a split. A project can arrange up to 6 sessions together, but each one remains an independent durable session." },
          { type: "paragraph", html: "Use <kbd>⌘⌥←</kbd> and <kbd>⌘⌥→</kbd> to move between split panes. You can rearrange a split, pull a session back into its own tab, or separate the sessions without restarting them." },
        ],
      },
      {
        id: "context",
        title: "Context stays inspectable",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⌃⇧C</kbd> to inspect the skills, MCP servers, hooks, plugins, and instruction files available to agents on the current machine. Tortie shows where each item came from rather than hiding it behind a generic capability label." },
        ],
      },
    ],
  },
  {
    path: "/docs/durability-and-recovery/",
    slug: "durability-and-recovery",
    title: "Durability and recovery",
    description: "Learn what Tortie preserves after an app quit, crash, update, or Mac restart.",
    lead: "The window is disposable. The session is not. Recovery stays honest about what can return.",
    sections: [
      {
        id: "quit",
        title: "Quit without ending the work",
        blocks: [
          { type: "paragraph", html: "Local sessions run in a private tmux server outside the Tortie window. Quitting the app, closing its window, or installing an update does not end those processes." },
          { type: "paragraph", html: "The first time you quit with active sessions, Tortie briefly confirms that the work will continue. Later quits are immediate." },
        ],
      },
      {
        id: "private-tmux-server",
        title: "tmux is the private session server",
        blocks: [
          { type: "paragraph", html: "Tortie ships a pinned copy of tmux and starts a separate server on the <code>gmux</code> socket. Each named tmux session owns the pseudo-terminal, agent process, and server-side scrollback. The Tortie window attaches as a client and can disappear without taking that work with it." },
          { type: "table", headers: ["Part", "Responsibility"], rows: [
            ["Private tmux server", "Keeps the live processes, terminal state, names, and scrollback while Tortie is closed."],
            ["Tortie window", "Shows the sessions and sends your input. Reopening it reconnects to the same live work."],
            ["Tortie session record", "Keeps project ownership, agent identity, restore information, and saved snapshots."],
          ] },
          { type: "paragraph", html: "Private means separate from the tmux server you may already use. Tortie does not read your default <code>tmux ls</code> server or your <code>~/.tmux.conf</code>. It only adopts sessions carrying Tortie's own identity marker." },
          { type: "code", label: "Optional: inspect the server if tmux is already on your PATH", code: "tmux -L gmux ls" },
          { type: "paragraph", html: "You do not need to install or learn tmux to use Tortie. The app carries the local runtime it needs; the command above is only for people who already use tmux and want to inspect the private server directly." },
          { type: "note", title: "You do not need to manage tmux", html: "Use Tortie to rename, end, restore, and remove sessions. The command above is an inspection tool, not a required workflow. Do not kill the <code>gmux</code> server if you want the running sessions to continue." },
        ],
      },
      {
        id: "reboot",
        title: "A reboot is different",
        blocks: [
          { type: "paragraph", html: "A Mac restart ends every running process. Tortie does not pretend otherwise. It saves session snapshots, including bounded scrollback and the information needed to prepare a supported agent's own resume command." },
          { type: "steps", items: [
            { title: "Choose Restore.", html: "Tortie recreates the session and its working directory." },
            { title: "Review the recovered terminal.", html: "Saved output is replayed so you can see what happened before the restart." },
            { title: "Confirm the conversation resume.", html: "When Tortie has exact resume information, it types the agent's command and waits. Press Enter to run it." },
          ] },
        ],
      },
      {
        id: "recovery-levels",
        title: "Recovery has different levels",
        blocks: [
          { type: "table", headers: ["Recovery result", "What returns"], rows: [
            ["Live reconnect", "The original process, terminal, and conversation are still running."],
            ["Agent resume ready", "Saved output returns and the agent's native resume command waits for your confirmation."],
            ["Transcript restored", "Saved output returns, but Tortie cannot safely resume the agent conversation."],
            ["Shell only", "The folder and terminal return without a conversation claim."],
          ] },
          { type: "note", title: "Tortie fails closed", html: "If a required working directory is gone or the conversation identifier is uncertain, Tortie does not claim that a resume is safe." },
        ],
      },
      {
        id: "history",
        title: "Removed sessions remain recoverable",
        blocks: [
          { type: "paragraph", html: "Tortie retains removed sessions in Past Sessions for 90 days. Recovery still depends on the saved state and the agent's own resume support." },
        ],
      },
    ],
  },
  {
    path: "/docs/attention-and-catch-me-up/",
    slug: "attention-and-catch-me-up",
    title: "Attention and Catch Me Up",
    description: "Find blocked sessions and review completed agent conversations without supervising every terminal.",
    lead: "Tortie keeps routine work quiet. It raises the sessions that need a person and preserves the rest until you return.",
    hero: {
      asset: "catch_me_up",
      alt: "Catch Me Up summarizing coding-agent conversations across a Tortie project.",
      width: 1600,
      height: 1021,
    },
    sections: [
      {
        id: "needs-input",
        title: "Find what needs you",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⌘J</kbd> to open a cross-project list of sessions waiting for human input. The newest request appears first." },
          { type: "list", items: [
            "Each row names the agent, session, machine, and project path.",
            "A recent terminal excerpt helps you recognise the request.",
            "Use the arrow keys to move and Enter to jump to the live session.",
            "The menu-bar indicator stays quiet unless a session is blocked on a person.",
          ] },
        ],
      },
      {
        id: "catch-me-up",
        title: "Review conversations with Catch Me Up",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⇧⌘U</kbd> to open Catch Me Up for the active session, the sessions in a split, or the whole project. It reads your asks and each available agent answer from the agent's own log." },
          { type: "list", items: [
            "The session view includes a rail of your asks. Use the arrow keys to move between exchanges.",
            "Press Return on an exchange to jump back to that point in the live session.",
            "Project rows can compare file claims with the current Git state.",
            "Gemini currently supplies your asks but not agent answers because its log does not record them in the required form.",
          ] },
        ],
      },
      {
        id: "optional-summary",
        title: "Model-written summaries are optional",
        blocks: [
          { type: "paragraph", html: "By default, Tortie builds the project overview without calling a model. You can choose an agent and model in Settings to write one short line after a turn finishes." },
          { type: "note", title: "Off until you choose it", html: "The optional writer currently supports Claude Code, Codex CLI, Cursor CLI, Pi, Oh My Pi, and Grok. Tortie rejects a model sentence that makes unsafe claims about files, numbers, or session state." },
        ],
      },
      {
        id: "not-a-dashboard",
        title: "Orientation without supervision",
        blocks: [
          { type: "paragraph", html: "Catch Me Up opens only when you ask. It does not create a live activity feed, progress score, or supervisor console. The goal is to return without reconstructing the work from terminal scrollback." },
        ],
      },
    ],
  },
  {
    path: "/docs/session-tools-and-menus/",
    slug: "session-tools-and-menus",
    title: "Session tools and menus",
    description: "Use Tortie's native context menus, terminal captures, scrollback tools, split actions, and safe session controls.",
    lead: "Right-click the thing you are working with. Tortie uses native macOS menus and changes the available actions to match that surface and its current state.",
    hero: {
      asset: "sessions_menu",
      alt: "A Tortie session context menu with actions for managing a coding-agent session.",
      width: 1600,
      height: 1021,
    },
    sections: [
      {
        id: "menu-model",
        title: "Menus follow the surface",
        blocks: [
          { type: "paragraph", html: "Context menus are part of the main workflow. A session row, terminal, file, editor tab, search result, branch, and commit each open a menu for that exact object. Disabled or absent actions reflect the current selection, connection, and safety boundary." },
          { type: "note", title: "The menu acts on what you selected", html: "In lists that support multiple selection, right-clicking a selected row acts on the whole selection. Right-clicking outside the selection acts on that row alone." },
        ],
      },
      {
        id: "session-menu",
        title: "Manage a session from its row",
        blocks: [
          { type: "paragraph", html: "Right-click a session name or use its trailing actions button. The menu changes when the session is live, ended, saved, remote, or temporarily unreachable." },
          { type: "list", items: [
            "Rename the session without changing the running process.",
            "Restore a saved session or restart an ended local session.",
            "Read what the session loaded, open saved output, or open Catch Me Up for that session.",
            "Review changes made by a session on another machine when that machine is answering.",
            "Copy the session's working-directory path.",
            "End a live session or remove an ended record. Both actions ask before changing anything.",
          ] },
          { type: "note", title: "Unknown means Tortie waits", html: "If a session server does not answer, Tortie keeps read-only actions and withholds actions that could start, stop, rename, or duplicate work. It does not guess that the session ended." },
        ],
      },
      {
        id: "terminal-menu",
        title: "Use the terminal menu",
        blocks: [
          { type: "paragraph", html: "Right-click inside a live session to open terminal actions. The menu keeps selection-sensitive actions disabled until text is selected." },
          { type: "table", headers: ["Action", "What it does"], rows: [
            ["New Session or Split Session", "Starts another session or creates one beside the current session."],
            ["Copy or Copy as HTML", "Copies selected terminal text as plain text or styled HTML."],
            ["Paste and Select All", "Pastes into the session or selects the visible terminal output."],
            ["Capture Screen", "Copies the visible terminal as an image and offers a save action."],
            ["Capture Selection", "Captures only the selected terminal region."],
            ["Capture Last 250 or 1,000 Lines", "Reads recent history from the local private tmux server."],
            ["Read Last Lines", "Reads recent output from a session on another machine without writing there."],
            ["Clear", "Clears the visible screen and server-side history. The agent keeps running."],
          ] },
          { type: "paragraph", html: "When available, the menu also shows how much scrollback that one session currently holds. Tortie reads the figure only when you open the menu; it does not turn memory use into a dashboard." },
          { type: "paragraph", html: "The terminal surface combines <a href=\"https://xtermjs.org/\">xterm.js</a> for terminal rendering with <a href=\"https://github.com/microsoft/node-pty\">node-pty</a> for a real pseudoterminal. Tortie's private tmux server owns the durable session, so closing the Electron window does not end the process." },
          { type: "note", title: "Command C has two terminal meanings", html: "With text selected, <kbd>⌘C</kbd> copies. With no selection, it sends an interrupt to stop the foreground agent or command." },
        ],
      },
      {
        id: "splits",
        title: "Arrange sessions without restarting them",
        blocks: [
          { type: "paragraph", html: "Drag one session onto another to make a split, or use a session menu to open it to the left, right, top, or bottom of the active surface. A surface can hold up to 6 sessions." },
          { type: "list", items: [
            "Rename the focused session in a split group.",
            "Break a group back into independent session tabs.",
            "End all live sessions in a group after one confirmation.",
            "Use <kbd>⌘⌥←</kbd> and <kbd>⌘⌥→</kbd> to move between panes.",
          ] },
        ],
      },
      {
        id: "other-context-menus",
        title: "Find actions where the object lives",
        blocks: [
          { type: "table", headers: ["Surface", "Useful context-menu actions"], rows: [
            ["Project tab", "Close the project tab without ending its sessions."],
            ["File tree", "Open, keep in a new tab, open with another app, create, rename, duplicate, move to Trash, reveal, and copy paths."],
            ["Editor tab", "Close this or other tabs, keep a preview open, copy paths, and reveal the file in Finder."],
            ["Search result", "Open a preview or new tab, expand matches, copy matching lines, and copy paths."],
            ["Source-control file", "Open the diff, stage or unstage, discard after confirmation, and copy paths."],
            ["Branch or remote", "Check out, create, delete, publish, compare, and copy remote URLs when those actions apply."],
            ["Commit", "Open changes, open on GitHub, check out, branch, tag, cherry-pick, or copy the commit ID and message."],
            ["Context entry", "Open its source, reveal it, copy details, check an MCP connection, or manage a user-owned skill."],
          ] },
        ],
      },
      {
        id: "destructive-actions",
        title: "Destructive actions stay explicit",
        blocks: [
          { type: "list", items: [
            "Ending a session saves available recovery material before stopping the process and always asks first.",
            "Moving local files to Trash is recoverable and asks before acting.",
            "Discarding Git changes cannot be undone, so Tortie confirms the exact selection.",
            "Remote file deletion is not offered because it would not have the local Trash as a recovery path.",
          ] },
        ],
      },
    ],
  },
  {
    path: "/docs/files-search-and-previews/",
    slug: "files-search-and-previews",
    title: "Files, search, and previews",
    description: "Browse, edit, search, and preview the files involved in agent work.",
    lead: "Follow the files an agent changed without switching to a second application for routine review.",
    hero: {
      asset: "find",
      alt: "Tortie searching project files with results beside a live coding-agent session.",
      width: 1600,
      height: 1021,
    },
    sections: [
      {
        id: "explorer",
        title: "Browse the project",
        blocks: [
          { type: "paragraph", html: "The Explorer shows the active project's files with familiar file icons and Git decorations. A modified tracked file opens as a diff against HEAD. Clean and untracked files open in the editor." },
          { type: "list", items: [
            "Create, rename, duplicate, and move files or folders.",
            "Move deletions to the macOS Trash after confirmation.",
            "Reveal a file in Finder or copy its full or relative path.",
            "Drag a file from Explorer onto a supported agent session as an attachment.",
          ] },
        ],
      },
      {
        id: "quick-open",
        title: "Find a file by name",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⌘P</kbd> and type the parts of a file name or path that you remember. Enter opens a reusable preview. <kbd>⌘Enter</kbd> keeps the file open in its own tab." },
          { type: "paragraph", html: "Press <kbd>⌘P</kbd> again while the palette is open to search every project already open in Tortie. Add a line number, such as <code>:412</code>, to open the file at that line." },
        ],
      },
      {
        id: "file-menus",
        title: "Use file and tab menus",
        blocks: [
          { type: "paragraph", html: "Right-click a file or folder for actions that belong to that selection. Local files can open in Tortie, the default macOS app, or another compatible app. You can also create entries, rename, duplicate, reveal in Finder, copy paths, or move local items to Trash." },
          { type: "paragraph", html: "Right-click an editor tab to close one or several tabs, keep a reusable preview open, copy its path, or reveal the file in Finder. A single click normally uses one reusable preview tab; double-clicking the tab or editing the file keeps it open." },
          { type: "note", title: "Remote menus are narrower", html: "A remote file menu only shows actions that are true on that machine and inside its approved write root. It does not offer Reveal in Finder, Open With, duplicate, or Move to Trash for a remote path." },
        ],
      },
      {
        id: "content-search",
        title: "Search content and symbols",
        blocks: [
          { type: "list", items: [
            "Use <kbd>⇧⌘F</kbd> to search file contents with ripgrep.",
            "Use <kbd>⇧⌘O</kbd> to search symbols in the current file.",
            "Prefix a Quick Open query with <code>#</code> to search symbols across the project.",
            "Use <kbd>F4</kbd> and <kbd>⇧F4</kbd> to move between results.",
          ] },
          { type: "paragraph", html: "Content search supports case-sensitive, whole-word, and regular-expression modes." },
          { type: "paragraph", html: "Right-click a result to open a preview or new tab, copy one matching line or every match in a file, and copy the full or relative path." },
        ],
      },
      {
        id: "edit-and-preview",
        title: "Edit and preview safely",
        blocks: [
          { type: "paragraph", html: "Use <kbd>⌘E</kbd> to show or hide the editor and <kbd>⌘S</kbd> to save. Markdown, HTML, images, and other supported formats open in purpose-built previews." },
          { type: "note", title: "Sensitive files stay plain", html: "Tortie does not render key files or content that looks like a secret as a friendly preview. Untrusted HTML opens without scripts or network access." },
        ],
      },
      {
        id: "libraries",
        title: "The parts behind files and search",
        blocks: [
          { type: "table", headers: ["Part", "Library and benefit"], rows: [
            ["Explorer", "<a href=\"https://www.npmjs.com/package/@pierre/trees\">Pierre Trees</a> provides a path-first file tree that can carry search results, file icons, and Git state."],
            ["Editor", "<a href=\"https://microsoft.github.io/monaco-editor/\">Monaco Editor</a> provides proven editing, find, selections, undo, syntax support, and a minimap. Tortie loads it only when you first open a file."],
            ["Content search", "<a href=\"https://github.com/microsoft/vscode-ripgrep\">ripgrep</a> streams fast results across large repositories."],
            ["Symbols", "<a href=\"https://tree-sitter.github.io/tree-sitter/\">Tree-sitter</a> understands source structure so symbol search is more useful than plain text matching."],
            ["Previews", "<a href=\"https://github.com/remarkjs/react-markdown\">react-markdown</a> renders Markdown as structured content, while <a href=\"https://shiki.style/\">Shiki</a> keeps code highlighting consistent."],
          ] },
          { type: "note", title: "A focused work surface", html: "These are maintained libraries inside Tortie's own product shell. Tortie does not include the VS Code workbench or extension system." },
        ],
      },
    ],
  },
  {
    path: "/docs/source-control/",
    slug: "source-control",
    title: "Source control",
    description: "Review changes, stage work, commit, inspect branches and history, and check GitHub Actions.",
    lead: "The source-control sidebar keeps the repository record beside the sessions changing it.",
    hero: {
      asset: "source_control",
      alt: "Tortie's source-control view showing changes, commit history, and a project diff.",
      width: 1600,
      height: 1021,
    },
    sections: [
      {
        id: "changes",
        title: "Review and stage changes",
        blocks: [
          { type: "paragraph", html: "Tortie groups merge changes, staged files, modified files, and untracked files. Select a file and press Enter to open its diff." },
          { type: "list", items: [
            "Press Space or <kbd>S</kbd> to stage or unstage the selected change.",
            "Use <kbd>⌘Enter</kbd> to commit staged work from the commit box.",
            "Tortie uses a temporary message file so multiline messages, hooks, and signing behave like normal Git.",
            "Discarding a change is treated as irreversible and always asks for confirmation.",
          ] },
        ],
      },
      {
        id: "branches",
        title: "Work with branches",
        blocks: [
          { type: "paragraph", html: "The branch control shows upstream state and ahead or behind information. You can create, check out, delete, fetch, pull, push, publish, and synchronize branches." },
        ],
      },
      {
        id: "history",
        title: "Inspect history",
        blocks: [
          { type: "paragraph", html: "History combines a commit list with a branch graph. Open a commit to inspect its message, references, changed files, and per-file diffs. Scope history to the repository, a folder, or a file when you need a narrower record." },
          { type: "paragraph", html: "Right-click a commit to open all its changes, open it on GitHub, check it out detached, create a branch or tag, cherry-pick it, or copy its full ID and message. Tortie only shows actions supported by the current repository and installed Git capabilities." },
        ],
      },
      {
        id: "source-control-menus",
        title: "Use source-control menus",
        blocks: [
          { type: "table", headers: ["Subject", "Available actions"], rows: [
            ["Changed files", "Open a diff, stage or unstage, discard with confirmation, reveal the file, and copy paths."],
            ["Local branches", "Check out, compare, publish, pull, push, synchronize, rename, or delete when the repository state permits it."],
            ["Remote branches", "Check out a local tracking branch and compare against the current branch."],
            ["Git remotes", "Copy fetch and push URLs."],
            ["History commits", "Open changes, use GitHub, branch, tag, cherry-pick, and copy commit details."],
          ] },
          { type: "note", title: "Menus reflect repository state", html: "A Git action may be absent or disabled when there is no upstream, no remote, an operation is already running, or the installed Git version cannot support it safely." },
        ],
      },
      {
        id: "actions",
        title: "Read GitHub Actions runs",
        blocks: [
          { type: "paragraph", html: "If the <a href=\"https://cli.github.com/\">GitHub CLI</a> is installed and authenticated for <code>github.com</code>, Tortie adds a Runs section to Source Control for repositories with a GitHub remote. It starts collapsed and does not ask GitHub for anything until you expand it." },
          { type: "list", items: [
            "See the latest workflow runs for the current branch and its newest commit, including status, conclusion, trigger, age, and duration.",
            "Expand a run to inspect its jobs and steps. Hover for its branch or tag, trigger, start time, duration, and cached job summary.",
            "Refresh on demand, open a run or job on GitHub, or copy its URL.",
            "After the section has been opened, Tortie notices a push and follows the runs started by that commit without turning failures into app notifications or session status.",
          ] },
          { type: "paragraph", html: "Every GitHub CLI command in this feature is read only and names the repository explicitly. Tortie permits only <code>gh auth status</code>, <code>gh run list</code>, and <code>gh run view</code> with a fixed set of fields. It refuses any other GitHub CLI command before starting a process." },
          { type: "note", title: "Observation, not control", html: "Tortie cannot cancel or rerun a workflow, change repository settings, or write to GitHub from this view. It does not stream logs. Use Open on GitHub when you need GitHub's full run page or an action that changes the run." },
        ],
      },
      {
        id: "git-engine",
        title: "Tortie uses your Git",
        blocks: [
          { type: "paragraph", html: "Tortie runs your system Git command-line tool instead of embedding a separate Git engine. That keeps your existing configuration, credentials, hooks, signing, and repository behaviour in charge. Background reads set <code>GIT_OPTIONAL_LOCKS=0</code> so refreshes do not lock the repository." },
          { type: "paragraph", html: "Changed files and commits open in <a href=\"https://diffs.com/\">Pierre Diffs</a>, a purpose-built, virtualized diff surface with split and stacked layouts and syntax-aware highlighting." },
        ],
      },
    ],
  },
  {
    path: "/docs/agent-context-and-skills/",
    slug: "agent-context-and-skills",
    title: "Agent context and skills",
    description: "Inspect the skills, MCP servers, hooks, plugins, and instruction files an agent will load.",
    lead: "The Context view answers a practical question: what will this agent load here, and which definition wins when several copies exist?",
    hero: {
      asset: "context",
      alt: "Tortie's Context view inspecting the skills and configuration available to an agent.",
      width: 1600,
      height: 1032,
    },
    sections: [
      {
        id: "open-context",
        title: "Open the Context view",
        blocks: [
          { type: "paragraph", html: "Press <kbd>⌃⇧C</kbd> to open Context for the active project. Choose an agent to inspect the configuration Tortie found for that agent and folder." },
          { type: "table", headers: ["Category", "What Tortie shows"], rows: [
            ["Skills", "User, project, plugin, managed, and compatible skill folders the agent can discover."],
            ["MCP servers", "Configured server commands, scope, connection state, and the file that defines each entry."],
            ["Hooks", "The events and commands that can run around agent actions."],
            ["Plugins", "Installed plugin context and the source folder it comes from."],
            ["Instructions", "Agent-specific and shared instruction files that apply to the project."],
          ] },
        ],
      },
      {
        id: "precedence",
        title: "See which definition wins",
        blocks: [
          { type: "paragraph", html: "Agents use different scope and precedence rules. Tortie applies the rule for the selected agent and category, shows the resolved winner, and keeps shadowed definitions reachable. It does not flatten every tool into one invented order." },
          { type: "list", items: [
            "Skills, MCP servers, plugins, settings, and instructions may resolve in different orders.",
            "Hooks are grouped by event when they all run instead of pretending one shadows another.",
            "Broken, disabled, managed, shadowing, and shadowed entries keep distinct states.",
            "The detail view names the source path, scope, reload behavior, and any known problem.",
          ] },
        ],
      },
      {
        id: "context-menus",
        title: "Open and manage context entries",
        blocks: [
          { type: "paragraph", html: "Right-click an entry to open its source file, reveal it in Finder, copy its name or path, and copy the command for MCP servers and hooks. A winning entry can also take you to the definition it shadows." },
          { type: "list", items: [
            "Use Check connection for an MCP server only when you want Tortie to start its process or make its network request.",
            "Enable a user-owned skill for another supported agent.",
            "Update, disable, enable, or remove a user-owned skill through the bundled skills command.",
            "Review what changed before re-enabling a skill Tortie switched off after its pinned contents changed.",
          ] },
          { type: "note", title: "Tortie does not run plugin code", html: "The Context view reads configuration and uses data-only management actions. Tortie does not load third-party plugin code into its own main or renderer processes." },
        ],
      },
      {
        id: "remote-context",
        title: "Inspect context on another machine",
        blocks: [
          { type: "paragraph", html: "On a remote project, Context reads the agent configuration on that machine and applies the same agent-specific precedence rules. Paths are labelled for the remote machine." },
          { type: "paragraph", html: "Remote Context is inspectable but not a configuration editor. Tortie keeps copy actions and withholds actions that would open a remote path in a local app or install, update, disable, or remove a skill on the other machine." },
        ],
      },
    ],
  },
  {
    path: "/docs/settings-and-customization/",
    slug: "settings-and-customization",
    title: "Settings and customization",
    description: "Configure Tortie's agents, launch behavior, appearance, scrollback, machines, capture, updates, summaries, and diagnostics.",
    lead: "Press ⌘, to open Settings. Tortie keeps routine choices together and makes actions with wider consequences ask for explicit agreement.",
    hero: {
      asset: "settings",
      alt: "Tortie settings for configuring agents, sessions, appearance, and application behavior.",
      width: 1600,
      height: 1304,
    },
    sections: [
      {
        id: "settings-map",
        title: "Find the setting you need",
        blocks: [
          { type: "table", headers: ["Section", "What it controls"], rows: [
            ["General", "Open at login, default agent, split-exit focus, the optional <code>tortie</code> shell command, updates, live scrollback, and saved scrollback."],
            ["Agents", "Installed-agent detection on this Mac and configured machines, version and path details, custom definitions, and re-scan."],
            ["Keyboard", "The complete built-in keymap and your per-agent new-session shortcuts."],
            ["Launch defaults", "Per-agent launch flags applied to each new session."],
            ["SpecStory", "Local conversation capture defaults and optional SpecStory Cloud sign-in."],
            ["Appearance", "Highlight colour, contrast, and the terminal and editor font."],
            ["Machines", "SSH connections, keys, remote capabilities, agent availability, and the one approved write root per machine."],
            ["Catch Me Up", "The optional agent and model that write one-line project summaries."],
            ["Diagnostics", "Temporary debug logging and a readable support report."],
          ] },
        ],
      },
      {
        id: "agents-and-launches",
        title: "Configure agents and launches",
        blocks: [
          { type: "paragraph", html: "Agents shows what Tortie can actually launch on each machine. Re-scan after installing or updating a CLI. A missing agent keeps its installation command visible for you to copy; Tortie does not run it automatically." },
          { type: "paragraph", html: "Launch defaults are preselected in the new-session sheet. Turning off one option there changes only that session. Options marked as dangerous can only become defaults after you confirm them in Settings; editing the settings file alone does not bypass that agreement." },
          { type: "paragraph", html: "The Keyboard section lets you record a dedicated new-session shortcut for an agent. Tortie's built-in shortcuts are fixed in the current release." },
        ],
      },
      {
        id: "scrollback",
        title: "Choose live and saved scrollback",
        blocks: [
          { type: "paragraph", html: "Scrollback depth controls how much output each live local session keeps in the private tmux server. Saved scrollback controls how much bounded output Tortie writes into a recovery snapshot for a restart or reboot." },
          { type: "note", title: "These limits solve different problems", html: "Raising live scrollback uses more memory while sessions run. Raising saved scrollback uses more storage and makes recovery snapshots larger. Settings shows the current live total when it is available." },
        ],
      },
      {
        id: "appearance-and-zoom",
        title: "Change appearance and text size",
        blocks: [
          { type: "paragraph", html: "Appearance changes the highlight scheme, interface contrast, and work-area font. Font size is contextual instead of global: <kbd>⌘+</kbd>, <kbd>⌘-</kbd>, and <kbd>⌘0</kbd> change the focused terminal, sidebar, or editor. Use <kbd>⇧⌘0</kbd> to reset every region." },
        ],
      },
      {
        id: "capture-and-summaries",
        title: "Keep capture and summaries optional",
        blocks: [
          { type: "paragraph", html: "SpecStory can save supported agent conversations as Markdown inside each project's <code>.specstory/history</code> folder. Nothing is uploaded to SpecStory Cloud unless you sign in. Capture defaults vary by agent and can be switched off." },
          { type: "paragraph", html: "Catch Me Up does not need a model for its conversation views. The separate one-line project summary writer stays off until you choose both an agent and one of its measured model recipes." },
        ],
      },
      {
        id: "automatic-updates",
        title: "Update Tortie without stopping your sessions",
        blocks: [
          { type: "paragraph", html: "Signed packaged builds check for an update 30 seconds after Tortie starts, then every 6 hours while it remains open. Downloads happen in the background. A routine check failure is logged instead of interrupting your work." },
          { type: "paragraph", html: "Tortie only says an update is ready after the macOS updater has verified and staged it. Open the update ring and choose <strong>Restart and update now</strong> or <strong>Install when you quit</strong>. Tortie never restarts itself without your choice." },
          { type: "list", items: [
            "Use Tortie > Check for Updates when you want to check manually.",
            "Development builds do not update themselves.",
            "Live local sessions stay in the private tmux server while the app updates and reconnect when Tortie opens again.",
            "If installation fails, the next launch explains the problem and offers repair. Repair Updates appears only when it is needed.",
          ] },
          { type: "note", title: "Updates do not own your sessions", html: "The updater can replace the application, but the private tmux server owns the running agents and shells. That separation is why an app restart does not become a session restart." },
        ],
      },
      {
        id: "diagnostics",
        title: "Collect diagnostics when something fails",
        blocks: [
          { type: "paragraph", html: "Diagnostics can enable extra logging until Tortie quits. It switches itself off at the next launch. Copy support report creates plain text containing the boot snapshot, recent log lines, and crash-dump list so you can inspect it before sharing." },
        ],
      },
    ],
  },
  {
    path: "/docs/remote-machines/",
    slug: "remote-machines",
    title: "Remote machines",
    description: "Run sessions and work with projects on another Mac through explicit SSH and write boundaries.",
    lead: "Remote support is shipped and labelled Early. It has been verified between Macs, with every write kept behind explicit consent.",
    hero: {
      asset: "machines",
      alt: "Tortie's remote-machine view for connecting to another Mac over SSH.",
      width: 1600,
      height: 1448,
    },
    sections: [
      {
        id: "requirements",
        title: "Prepare the remote Mac",
        blocks: [
          { type: "list", items: [
            "Enable Remote Login and make the machine reachable over SSH.",
            "Use a private network such as Tailscale when the Macs are not on the same trusted network.",
            "Install tmux on the remote machine. Tortie's bundled local copy is not uploaded there.",
            "Add and confirm the machine in Tortie Settings. Tortie can create a dedicated SSH key for you.",
          ] },
          { type: "note", title: "Nothing is installed remotely", html: "Tortie uses the machine's existing SSH, shell, Git, tmux, and agent tools. Agent availability is measured separately for each machine." },
        ],
      },
      {
        id: "projects-and-sessions",
        title: "Open projects and run sessions",
        blocks: [
          { type: "paragraph", html: "A remote folder becomes a normal project tab. You can start and restore sessions there, browse files, use Quick Open and content search, review diffs and history, and inspect GitHub Actions." },
          { type: "paragraph", html: "Remote sessions live in that machine's own private tmux server. Tortie connects over SSH and attaches the session into your local window. The bundled local tmux binary is not copied to the remote machine, so the remote host must already have tmux installed." },
          { type: "paragraph", html: "Remote conversation restoration runs only when Tortie has an exact recorded conversation identifier and resume command. Remote SpecStory capture is not supported." },
        ],
      },
      {
        id: "writes",
        title: "Choose where Tortie may write",
        blocks: [
          { type: "paragraph", html: "Remote projects stay read only until you choose one write root for that machine in Settings. Tortie then permits edits, saves, new folders, renames, staging, and commits only beneath that confirmed folder." },
          { type: "list", items: [
            "Remote saves have no local undo.",
            "A disconnect can make the final result of a write uncertain.",
            "Remote hooks and signing run on the remote machine.",
            "Tortie cannot answer an interactive signing passphrase.",
            "A commit that times out may still finish remotely.",
          ] },
        ],
      },
      {
        id: "limits",
        title: "Know the current limits",
        blocks: [
          { type: "paragraph", html: "The remote implementation handles both BSD and GNU command shapes, but Linux hosts have not been fully tested. Remote processes may continue after the local app loses contact, so an unreachable session remains recorded instead of being guessed away." },
        ],
      },
    ],
  },
  {
    path: "/docs/supported-agents/",
    slug: "supported-agents",
    title: "Supported agents",
    description: "See which agents Tortie can launch and how resume, history, and attachments vary.",
    lead: "Tortie launches 11 coding-agent CLIs and plain shells. Resume and conversation history are separate capabilities and vary by agent.",
    sections: [
      {
        id: "launchable-agents",
        title: "Launchable agents",
        blocks: [
          { type: "table", headers: ["Agent", "Current note"], rows: [
            ["Claude Code", "Launch, activity, resume, attachments, and Catch Me Up integration."],
            ["Cursor CLI", "Launchable terminal agent. Some attachment behavior is inferred."],
            ["Codex CLI", "Launch, activity, resume, attachments, and Catch Me Up integration."],
            ["Gemini CLI", "Launch and resume machinery exist; full resume round-trip remains unproven."],
            ["Factory Droid CLI", "Early. Launch exists; resume capture remains unverified."],
            ["CodeWhale", "Launchable terminal agent."],
            ["Antigravity CLI", "Development status; support depth is still being measured."],
            ["Muse Code", "Launchable terminal agent."],
            ["Qwen Code", "Launchable; safe resume depends on the original project directory."],
            ["Pi", "Launchable; safe resume depends on the original project directory."],
            ["Oh My Pi", "Launchable; the pi successor. Resumes from any directory, and joins Catch Me Up."],
            ["Grok", "Launch and Catch Me Up integration; no SpecStory capture provider."],
          ] },
          { type: "paragraph", html: "Tortie also supports ordinary shell sessions. Cursor IDE and VS Code Copilot are capture-only observers, not terminal agents Tortie can launch." },
        ],
      },
      {
        id: "resume-and-history",
        title: "Resume and history are different",
        blocks: [
          { type: "paragraph", html: "Resume continues an agent's own conversation after its process ends. Optional SpecStory capture writes a readable conversation history. An agent can support one without supporting the other." },
          { type: "note", title: "No blanket continuity claim", html: "When Tortie lacks exact resume evidence, it restores the directory and saved terminal output without claiming that the conversation returned." },
        ],
      },
      {
        id: "agent-settings",
        title: "Set launch behavior per agent",
        blocks: [
          { type: "paragraph", html: "Settings lets you choose a default agent, assign per-agent shortcuts, and save launch flags. Tortie marks dangerous flags instead of hiding their effect." },
          { type: "paragraph", html: "If an agent is missing, Tortie shows a copyable installation command. It does not run the command for you." },
        ],
      },
      {
        id: "custom-agents",
        title: "Add a custom agent definition",
        blocks: [
          { type: "paragraph", html: "Custom agents are data-only JSON definitions. They can describe a command, arguments, icon, activity behavior, and safe resume shape without loading third-party code into Tortie's own processes." },
          { type: "paragraph", html: "Tortie asks before a new definition starts a process. Read the <a href=\"https://github.com/gregce/tortie/blob/main/resources/config/README.md\">custom agent configuration guide</a> before adding one." },
        ],
      },
    ],
  },
  {
    path: "/docs/keyboard-shortcuts/",
    slug: "keyboard-shortcuts",
    title: "Keyboard shortcuts",
    description: "Use the complete Tortie shortcut map for projects, sessions, terminals, files, search, source control, and layout.",
    lead: "Shortcuts are scoped to where your keyboard is. The same chord can do different work in a terminal, editor, list, or palette without colliding.",
    sections: [
      {
        id: "sessions",
        title: "Sessions and attention",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘T</kbd>", "Open the new-session sheet", "Anywhere"],
            ["<kbd>F2</kbd>", "Rename the highlighted or active session", "Anywhere"],
            ["<kbd>⌥⌘↓</kbd> / <kbd>⌥⌘↑</kbd>", "Move to the next or previous session", "Anywhere"],
            ["<kbd>⌥⌘←</kbd> / <kbd>⌥⌘→</kbd>", "Move between split panes", "Anywhere"],
            ["<kbd>⌘J</kbd>", "List sessions that need input across every project", "Anywhere"],
            ["<kbd>↑</kbd> / <kbd>↓</kbd>, then <kbd>Return</kbd>", "Choose a session and hand the keyboard to its terminal", "Session list"],
            ["<kbd>⌘⌫</kbd>", "Ask to end the highlighted session", "Sessions needing input"],
          ] },
          { type: "note", title: "Ending has no global shortcut", html: "Use a session's menu or trailing action and confirm. <kbd>⌘⌫</kbd> only works in the Sessions Needing Input list, where a closed project's session would otherwise have no direct surface." },
        ],
      },
      {
        id: "projects",
        title: "Projects",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘O</kbd>", "Open a folder as a project", "Anywhere"],
            ["<kbd>⇧⌘N</kbd>", "Create a folder-backed project and optionally initialise Git", "Anywhere"],
            ["<kbd>⌘1</kbd> to <kbd>⌘8</kbd>", "Select a project by its position", "Anywhere"],
            ["<kbd>⌘9</kbd>", "Select the rightmost project", "Anywhere"],
            ["<kbd>⌃Tab</kbd> / <kbd>⌃⇧Tab</kbd>", "Move to the next or previous project", "Outside the editor"],
          ] },
          { type: "paragraph", html: "Closing a project is menu-only and asks first. It removes the tab from the window but leaves its sessions running." },
        ],
      },
      {
        id: "terminal",
        title: "Terminal and scrollback",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘C</kbd>", "Copy selected text, or interrupt when nothing is selected", "Terminal"],
            ["<kbd>⌘A</kbd>", "Select all visible output", "Terminal"],
            ["<kbd>⌘K</kbd>", "Clear the screen and session history without ending the process", "Terminal"],
            ["<kbd>⇧PgUp</kbd> / <kbd>⇧PgDn</kbd>", "Move through scrollback one screen at a time", "Terminal"],
            ["<kbd>⇧Return</kbd>", "Add a new line without sending the prompt", "Supported agent terminal"],
          ] },
        ],
      },
      {
        id: "editor-and-files",
        title: "Editor and files",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘S</kbd>", "Save the active file", "Anywhere"],
            ["<kbd>⌘E</kbd>", "Show or hide the editor", "Anywhere"],
            ["<kbd>⇧⌘]</kbd> / <kbd>⌥⌘→</kbd>", "Move to the next editor tab", "Editor"],
            ["<kbd>⇧⌘[</kbd> / <kbd>⌥⌘←</kbd>", "Move to the previous editor tab", "Editor"],
            ["<kbd>⌃Tab</kbd> / <kbd>⌃⇧Tab</kbd>", "Walk recent editor tabs and release Control to choose", "Editor"],
            ["<kbd>⌘W</kbd>", "Close the active editor tab only", "Anywhere"],
            ["<kbd>⌘F</kbd>", "Find text in the active file", "Editor"],
            ["<kbd>Return</kbd>", "Open a file or expand and collapse a folder", "Explorer"],
            ["<kbd>⌫</kbd>", "Ask to move the selected local item to Trash", "Explorer"],
          ] },
          { type: "note", title: "Command W is deliberately narrow", html: "<kbd>⌘W</kbd> closes the front editor tab. It does not close a project, end a session, or close the Tortie window." },
        ],
      },
      {
        id: "search",
        title: "Quick Open and search",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘P</kbd>", "Find a file by name or path; press again to include every open project", "Anywhere"],
            ["<kbd>Return</kbd>", "Open the highlighted file in the reusable preview", "Quick Open"],
            ["<kbd>⌘Return</kbd>", "Keep the highlighted file in a new tab", "Quick Open"],
            ["<kbd>⇧⌘F</kbd>", "Search file contents in the project", "Anywhere"],
            ["<kbd>⇧⌘O</kbd>", "Find a symbol in the file; use <code>#</code> for project symbols", "Anywhere"],
            ["<kbd>⌥⌘C</kbd>", "Toggle case-sensitive matching", "Search view"],
            ["<kbd>⌥⌘W</kbd>", "Toggle whole-word matching", "Search view"],
            ["<kbd>⌥⌘R</kbd>", "Toggle regular-expression matching", "Search view"],
            ["<kbd>F4</kbd> / <kbd>⇧F4</kbd>", "Move to the next or previous result", "Anywhere"],
          ] },
        ],
      },
      {
        id: "source-control",
        title: "Source control",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘Return</kbd>", "Commit staged changes with the message in the box", "Source Control"],
            ["<kbd>Space</kbd> or <kbd>S</kbd>", "Stage or unstage the highlighted files", "Source Control"],
            ["<kbd>Return</kbd>", "Open the highlighted diff", "Source Control"],
            ["<kbd>⌘A</kbd>", "Select all changes", "Source Control"],
            ["<kbd>⌫</kbd>", "Ask to discard the selected working-tree changes", "Source Control"],
          ] },
        ],
      },
      {
        id: "views-and-layout",
        title: "Views and layout",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⇧⌘E</kbd>", "Show Explorer or return focus to the session", "Anywhere"],
            ["<kbd>⌃⇧G</kbd>", "Show Source Control or return focus to the session", "Anywhere"],
            ["<kbd>⌃⇧C</kbd>", "Show Context or return focus to the session", "Anywhere"],
            ["<kbd>⇧⌘U</kbd>", "Open Catch Me Up for the session, split, or project", "Anywhere"],
            ["<kbd>⌘B</kbd>", "Collapse or restore the sidebar", "Anywhere"],
            ["<kbd>⇧⌘B</kbd>", "Let the open file fill the window", "Anywhere"],
            ["<kbd>⇧⌘Return</kbd>", "Let the focused session, split, or file fill the window", "Anywhere"],
            ["<kbd>⌘+</kbd> / <kbd>⌘-</kbd>", "Enlarge or reduce text in the focused region", "Anywhere"],
            ["<kbd>⌘0</kbd>", "Reset zoom in the focused region", "Anywhere"],
            ["<kbd>⇧⌘0</kbd>", "Reset zoom in every region", "Anywhere"],
          ] },
          { type: "paragraph", html: "Project tabs can sit across the top or down the left. Sessions can sit across the top or down the right. These controls are in the View menu and beside their respective tab strips; they do not have keyboard shortcuts." },
        ],
      },
      {
        id: "application",
        title: "Application",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action", "Where"], rows: [
            ["<kbd>⌘/</kbd>", "Open the in-app shortcut overlay", "Anywhere"],
            ["<kbd>⌘,</kbd>", "Open Settings", "Anywhere"],
            ["<kbd>Esc</kbd>", "Close the topmost menu, overlay, or modal", "Anywhere"],
            ["<kbd>⌘Q</kbd>", "Quit Tortie while leaving live local sessions running", "Anywhere"],
          ] },
        ],
      },
      {
        id: "agent-shortcuts",
        title: "Assign per-agent session shortcuts",
        blocks: [
          { type: "paragraph", html: "Open Settings, then Keyboard, to record a dedicated shortcut for starting a particular agent. Tortie checks the chord against its built-in map and other assigned agents before saving it." },
          { type: "note", title: "The live keymap wins", html: "The <kbd>⌘/</kbd> overlay and Settings read the app's canonical keymap. If this page and the installed release ever differ, use the shortcut shown by the app." },
        ],
      },
    ],
  },
];

export const docsPageByPath = new Map(docsPages.map((page) => [page.path, page]));
