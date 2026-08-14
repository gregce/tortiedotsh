# 03. The design brief for tortie.sh

This is the brief the three takes build from. Everything in sections 1 through 8 is fixed and common to all three takes. Section 9 lists what may vary. Section 10 names the three take directions so the builders diverge deliberately.

## 1. What the site is for

The visitor has three goals, in this order:

- Download the macOS build. The primary CTA is a filled button labeled **Download for macOS** that links to https://github.com/gregce/tortie/releases/latest.
- See the source. The secondary CTA is an outlined button labeled **View on GitHub** that links to https://github.com/gregce/tortie.
- Understand the unique value proposition, which is durable agent sessions that outlive the window. One HyperFrames composition demonstrates it. The scene is a terminal frame with a named agent session working, the window closes, the window reopens, and the same conversation is still there with its scrollback.

Both CTAs appear inside the first screen with zero scrolling, and both repeat small in the nav. The demo sits directly after the value copy so a visitor who scrolls once sees the claim proven.

## 2. Framework and scaffold

Fixed for all takes. The reasons are in 02-framework-and-graphics.md.

- Astro 7.2.2 in static output mode, deployed to Vercel with no adapter.
- One page, `src/pages/index.astro`, with components in `src/components/`.
- The token file is imported as a plain global stylesheet from assets/gmux-tokens.css. No take copies token values into its own CSS.
- The HyperFrames player loads from one script tag. Its composition lives in `public/demos/durable-session/` with a self hosted runtime, so the page makes no request to a third party CDN.
- Exactly one live composition on the page. Its iframe loads lazily behind a rendered poster. All other motion is plain CSS inside the app's motion tokens.
- No React, no islands, no analytics scripts, no external fonts.

## 3. Token mapping

The site invents no color. All values come from assets/gmux-tokens.css.

| Role on the site | Token | Value |
| --- | --- | --- |
| Page background | `--bg-canvas` | #131417 |
| Alternating band, nav bar | `--bg-sidebar` | #17181c |
| Cards, inputs, code blocks | `--bg-surface` | #1b1d22 |
| Hover fills, chips | `--bg-raised` | #22252b |
| Selected or pressed fills | `--bg-active` | #2a2e36 |
| Headline text, TORTIE | `--text-primary` | #e8eaed |
| Body text, .sh suffix | `--text-secondary` | #a8adb8 |
| Captions and hints | `--text-muted` | #838996 |
| Primary button fill | `--accent` | #4d9de8, hover `--accent-hover` |
| Text on accent buttons | `--on-accent` | #0d1117 |
| Links | `--accent-text` | #82bfff |
| Selected wash | `--accent-wash` | rgba(77,157,232,0.14) |
| Hairlines, always 1px | `--border` | #2a2d34 |
| Input borders | `--border-strong` | #3a3e48 |
| Focus ring | `--focus-ring` | 2px ring at 0.6 alpha accent |

Contrast note. `--text-muted` measures 5.25:1 on the canvas but falls below 4.5:1 on `--bg-raised`, so muted text steps up to `--text-secondary` on any raised fill.

The status colors appear only inside the product demo, never as site decoration:

- Working, solid `--status-working` #4d9de8.
- Needs input, solid `--status-attention` #f5b84a, with the pulse.
- Idle, solid `--status-idle` #6e7583.
- Failed, hollow `--status-failed` #e5655e.

Amber is reserved. Nothing decorative on the site may be yellow, because in Tortie amber means the session needs you and nothing else.

Type and motion. The site uses `--font-ui`, the system sans, everywhere. `--font-mono` appears only on commands, paths and keycaps, never as a costume on headings. Durations are 120 to 200ms with nothing over 250ms, ease `cubic-bezier(0.2, 0, 0, 1)`. Radii are 4, 6 and 10px. `prefers-reduced-motion` disables all animation and swaps the live demo for its rendered MP4 poster.

Rhythm. Spacing sits on the 4px grid, tight inside a group at 2 to 8px and generous between groups at 16 to 24px. Regions separate with 1px `--border` hairlines, never with shadows. Shadows exist only on things that float. The nav is the app's band, a single bar on `--bg-sidebar` with exactly one 1px hairline under it.

## 4. The wordmark law

Every rule is a ratio, so it holds at any display size.

- One line, one object, set in `--font-ui`. `TORTIE` in capitals at weight 600 with tracking 0.06em in `--text-primary`. `.sh` in lowercase at weight 400 with tracking 0.02em in `--text-secondary`.
- Both halves are the same font size, whatever that size is. Equal size makes the ascender of the h meet the cap line, which locks the halves into one object.
- Never `.SH` and never sentence case `Tortie.sh` for the mark itself.
- Line height ratio is about 1.14.
- The cat mark beside the wordmark is 1.5 to 2.5 times the cap height, with a gap of one third of the mark's width. At large sizes use the master or macos brand variants, because the mark's body is low contrast on the canvas and the wordmark carries the name.
- The wordmark is the only `<h1>`. The heading carries `aria-label="Tortie.sh"`, the two styled spans are `aria-hidden`, and the mark image is `alt=""`.
- The lockup itself is never animated. The brief asks for a bold TORTIE.sh, and boldness comes from scale, not from motion on the mark.

## 5. Copy inventory, final and rules audited

All visible copy on all takes comes from this inventory. A take may cut, and may shorten a long form to its short form, but may not write new claims. Every sentence here passed the writing rules in /Users/gdc/gmux/CLAUDE.md, section "How to write to the operator".

### Hero

> **The sessions were never interrupted.**
> Tortie is a macOS shell for coding agents. Sessions run on a private background server that outlives the window, so quitting the app never stops the work.

The alternate subhead, if a take wants the plainer promise, is the home screen line. "Sessions you start keep running even when Tortie is closed."

### The four pillars

**One window for your projects**
- Short. Every project is a tab in one window.
- Long. Every project is a tab in one window. Switch with ⌘1 through ⌘9. Everything on screen scopes to the project you are looking at. You never search a window switcher for the agent you left working.

**Durable agent sessions**
- Short. Sessions outlive the app, and conversations resume where they stopped.
- Long. This is the reason Tortie exists. Sessions run on a private background server, and the app is a window onto them. Quit the app and the agents keep working. Reboot your Mac and Tortie restores every session with its scrollback. It also arms each agent's own resume command, so one keypress continues the conversation where it stopped.

**Intuitive multiplexing**
- Short. There is a full terminal multiplexer underneath, and you never need to learn it.
- Long. Sessions have names, and the window is the whole interface. Drag one session onto another to split the view. Drop an image from the file tree into an agent. See which session needs your input, and jump to it with ⌘J. There are no prefix keys and no configuration files.

**Feels like VS Code**
- Short. Tortie keeps the layout you know from VS Code, so there is almost nothing to learn.
- Long. Tortie keeps the layout you know from VS Code, so there is almost nothing to learn.
  - A git sidebar that stages changes and shows the history.
  - A file tree with git status colors and the icons you are used to.
  - Click a file to edit it with Monaco, or diff it against HEAD.
  - Project search runs on ripgrep and reaches every open project in the window.

### Download

- Primary button. **Download for macOS**
- Line under the button. Apple silicon. Free under the Apache 2.0 license.
- Secondary button. **View on GitHub**
- Install line, if the section wants one. Drag Tortie into Applications and point it at a project folder. Any folder works. A git repository gets the full sidebar.

### Refusals

Heading. **What Tortie refuses to do**

- It never touches your own tmux server or your ~/.tmux.conf.
- It never adopts a terminal session it did not create.
- It never previews a key file or anything that looks like a secret.
- It never asks you to watch an agent work.
- It shows no counters and no activity feeds.

The refusals list is the only place the word tmux may appear on the site, because there it names the thing Tortie protects.

### Copy rules that bind any sentence a builder must add

- Simple everyday words and complete sentences.
- No em dashes and no en dashes anywhere, including number ranges. Ranges use "to" or "through".
- A colon only introduces a list.
- No metaphors, no imagery, no invented hyphenated adjectives, no empty emphasis.
- No series of three items inside a sentence. Items get bullets.
- Numbers rather than adjectives.
- No agent count is stated anywhere, because the README says twelve and DESIGN.md counts ten plus shell, and the two are not yet reconciled.
- No testimonials, no star counts, no invented quotes.

## 6. The value demonstration

One HyperFrames composition, `demos/durable-session/index.html`, shared by all takes. The scene, in order:

1. A Tortie window with a named session and an agent mid conversation. The status dot shows working blue.
2. The window closes. The whole app quits.
3. A beat where only the desktop is visible. A small caption states the fact. "The session is still running."
4. The window reopens. The same session is there with its scrollback, and the resume command is typed and waiting.
5. The closing caption is the hero line. "The sessions were never interrupted."

The composition is built from the same tokens as the site, so the demo and the page are visibly one system. It is seekable in the page through the player, and its MP4 render serves as the poster, the reduced motion fallback, and the social preview image. The one perpetual motion allowed anywhere is the needs input pulse inside the demo, dot opacity 1 to 0.45 to 1 over 1.6s, if the scene uses it.

## 7. Performance budget

The numbers are the budget. A take that exceeds them is not done.

- First paint payload, meaning HTML plus CSS plus page JS plus the player component, at most 120 KB compressed. External fonts are 0 bytes because the site uses the system stack.
- The demo iframe, loading lazily behind its poster, adds at most 160 KB compressed for runtime plus GSAP.
- Whole page including the demo at most 300 KB compressed, poster image included.
- No autoplay video. No request leaves the page's own origin.

For scale, cmux.com transfers about 1,200 KB compressed and cursor.com ships 5,370 KB of JavaScript alone. The budget keeps tortie.sh under a quarter of cmux.

## 8. Accessibility and correctness gates

- Every text and background pair from section 3 meets 4.5:1.
- The page reads correctly with JS disabled. The demo degrades to its poster with a caption.
- `prefers-reduced-motion` disables all animation.
- Keyboard focus is visible everywhere via `--focus-ring`.
- The page body never scrolls horizontally at any width from 320px up.

## 9. What may vary per take

- Layout. Column width, section order after the hero, nav treatment, and footer.
- Demo treatment. Scroll scrubbed, hover scrubbed, or a plain play control. The composition itself is shared.
- Density. From cmux quiet to editorial spacious.
- Motion. From none outside the demo to restrained page transitions inside the motion tokens.

## 10. The three takes

| Take | Name | Direction |
| --- | --- | --- |
| 1 | The quiet monolith | cmux adjacent. One narrow column, small type, 12px muted section labels, hyphen feature lists, the demo as the single breakout element after the pillars. The wordmark is bold by isolation, large against an empty first screen |
| 2 | The session | Terminal first. The page itself behaves like a Tortie session. The nav is the app's 36px band with its single hairline. Sections read as named sessions with status dots. Commands, paths and keycaps set in `--font-mono`. The demo plays inside a window frame that matches the page chrome, so the product and the page are the same object |
| 3 | The lockup | Bold editorial. The giant TORTIE.sh lockup is the design. The first screen is the wordmark at display scale under the wordmark law, the hero sentence, and the two CTAs. Everything after it is spacious, with the demo given a full width stage |

Each take keeps every fixed section of this brief. The takes differ only along section 9.

## 11. What is not true yet, and what was assumed

- tortie.sh resolved to Vercel but served nothing as of 2026-08-12. Shipping this site closes the wordmark question, and the full TORTIE.sh lockup becomes correct in both the app and the site.
- The releases URL assumes the repo publishes a macOS build at github.com/gregce/tortie/releases/latest. This was not fetched to confirm an asset exists, because a release phase is running now.
- The contrast figures come from the app's own research measurements, not from new measurement on the built site. The built takes must re check contrast where they compose new pairs.
- No end to end HyperFrames MP4 render has been executed yet. The first builder to touch the demo runs one early.
- "Private background server" is the site's phrase for the tmux server, matching the app rule that user facing copy never says tmux. The refusals list is the deliberate exception.
