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
  blocks: DocBlock[];
}

export interface DocPage {
  path: string;
  slug: string;
  title: string;
  description: string;
  lead: string;
  sections: DocSection[];
}

export const docsNavGroups: DocsNavGroup[] = [
  {
    title: "Start",
    items: [
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
        title: "Files, search, and previews",
        href: "/docs/files-search-and-previews/",
        description: "Browse, find, edit, and preview files across open projects.",
        searchTerms: "explorer quick open ripgrep markdown html image monaco",
      },
      {
        title: "Source control",
        href: "/docs/source-control/",
        description: "Review changes, stage work, commit, inspect history, and check actions.",
        searchTerms: "git diff branch graph github actions scm",
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
        searchTerms: "claude codex cursor gemini qwen muse pi grok droid",
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
    sections: [
      {
        id: "requirements",
        title: "Requirements",
        blocks: [
          { type: "paragraph", html: "Tortie runs on Apple silicon Macs. The release includes its own copy of tmux, so you do not need Homebrew or a separate terminal multiplexer." },
          { type: "note", title: "Why there is no macOS version here", html: "The packaged release proves Apple silicon support, but the project does not yet declare one tested minimum macOS version. This guide will name a version when the release process enforces it." },
        ],
      },
      {
        id: "install",
        title: "Install Tortie",
        blocks: [
          { type: "steps", items: [
            { title: "Download the latest DMG.", html: "Use the <a href=\"https://github.com/gregce/tortie/releases/latest\">latest Tortie release</a>." },
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
          { type: "paragraph", html: "Local sessions run in a private background server outside the Tortie window. Quitting the app, closing its window, or installing an update does not end those processes." },
          { type: "paragraph", html: "The first time you quit with active sessions, Tortie briefly confirms that the work will continue. Later quits are immediate." },
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
          { type: "note", title: "Off until you choose it", html: "The optional writer currently supports Claude Code, Codex CLI, Cursor CLI, Pi, and Grok. Tortie rejects a model sentence that makes unsafe claims about files, numbers, or session state." },
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
    path: "/docs/files-search-and-previews/",
    slug: "files-search-and-previews",
    title: "Files, search, and previews",
    description: "Browse, edit, search, and preview the files involved in agent work.",
    lead: "Follow the files an agent changed without switching to a second application for routine review.",
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
    ],
  },
  {
    path: "/docs/source-control/",
    slug: "source-control",
    title: "Source control",
    description: "Review changes, stage work, commit, inspect branches and history, and check GitHub Actions.",
    lead: "The source-control sidebar keeps the repository record beside the sessions changing it.",
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
        ],
      },
      {
        id: "actions",
        title: "Check GitHub Actions",
        blocks: [
          { type: "paragraph", html: "If the GitHub CLI is installed and authenticated, Tortie shows recent workflow runs in Source Control. This view is read only. Tortie does not cancel or rerun workflows." },
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
    description: "Use the core Tortie shortcuts for projects, sessions, attention, files, and source control.",
    lead: "These are the shortcuts most people need first. Press ⌘/ inside Tortie for the live, complete map.",
    sections: [
      {
        id: "sessions",
        title: "Sessions and attention",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action"], rows: [
            ["⌘T", "Create a named session"],
            ["F2", "Rename the active session"],
            ["⌘⌥↓ / ⌘⌥↑", "Move through sessions"],
            ["⌘⌥← / ⌘⌥→", "Move between split panes"],
            ["⌘J", "Show sessions waiting for you"],
            ["⇧⌘U", "Open Catch Me Up"],
            ["⇧⌘Enter", "Focus the active file or session"],
          ] },
        ],
      },
      {
        id: "projects",
        title: "Projects",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action"], rows: [
            ["⌘O", "Open a folder"],
            ["⇧⌘N", "Create a project"],
            ["⌘1 to ⌘8", "Select a project by position"],
            ["⌘9", "Select the rightmost project"],
            ["⌃Tab / ⌃⇧Tab", "Move to the next or previous project"],
          ] },
        ],
      },
      {
        id: "files-and-search",
        title: "Files and search",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action"], rows: [
            ["⌘P", "Quick Open by file name or path"],
            ["⌘Enter", "Keep the selected preview open"],
            ["⇧⌘F", "Search project contents"],
            ["⇧⌘O", "Search symbols"],
            ["F4 / ⇧F4", "Move through search results"],
            ["⌘E", "Show or hide the editor"],
            ["⌘S", "Save the active file"],
          ] },
        ],
      },
      {
        id: "views-and-source-control",
        title: "Views and source control",
        blocks: [
          { type: "table", headers: ["Shortcut", "Action"], rows: [
            ["⇧⌘E", "Show Explorer"],
            ["⌃⇧G", "Show Source Control"],
            ["⌃⇧C", "Show Context"],
            ["⌘B", "Toggle the sidebar"],
            ["Space or S", "Stage or unstage the selected change"],
            ["Enter", "Open the selected diff"],
            ["⌘Enter", "Commit staged changes from the commit box"],
            ["⌘,", "Open Settings"],
            ["⌘/", "Open the full shortcut map"],
          ] },
          { type: "note", title: "The live keymap wins", html: "Tortie's shortcut overlay and Settings both read the app's canonical keymap. If this page and the app ever differ, use the shortcut shown in the current release." },
        ],
      },
    ],
  },
];

export const docsPageByPath = new Map(docsPages.map((page) => [page.path, page]));
