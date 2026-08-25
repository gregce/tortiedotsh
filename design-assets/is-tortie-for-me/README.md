# Is Tortie for me?

Experience and visual concepts for a short, honest fit check between the homepage demonstration and the feature chapters.

## Job

Help a developer answer “why would I use Tortie?” in about 30 seconds. The flow leads with the qualities that make Tortie distinct, then distinguishes only the three plausible choices: an agent multiplexer, a code IDE, or an agent orchestrator.

## Opening copy

- Eyebrow: `A 30-second fit check`
- Heading: `Is Tortie for me?`
- Introduction: `Five quick questions. See whether Tortie fits the way you work.`
- Reset action: `Start over`

## Five leading questions

Every visitor sees at most five questions. Selecting the Tortie-aligned answer advances immediately; an alternative may either continue to clarify the choice or reveal a result early when the category is already clear.

1. `Do you work across several projects or coding-agent sessions at once?`
   - `Several at once` → continue
   - `Usually one` → continue with Code IDE leaning
2. `Do you prefer terminal agents, but still want files, diffs, search, and Git nearby?`
   - `Yes, terminal plus IDE conveniences` → continue
   - `I prefer a full editor workflow` → Code IDE leaning
3. `Do you want to keep using each provider’s own agent?`
   - `Keep Claude Code, Codex, Gemini CLI, and others` → continue
   - `Give me one unified agent surface` → continue with Agent orchestrator leaning
4. `Should sessions keep running when the app window closes?`
   - `Yes, keep them running` → continue
   - `Relaunching them is fine` → continue with Code IDE leaning
5. `How do you want to work with agents?`
   - `Steer live sessions with the project beside them` → Agent multiplexer / Tortie
   - `Delegate tasks and review the results later` → Agent orchestrator

The complete Tortie path is terminal-first, several concurrent sessions, provider-specific agents, durable session lifetime, and live steering with familiar project tools.

## Result language

### Agent multiplexer / Tortie

- Label: `Agent multiplexer`
- Heading: `Tortie is built for this.`
- Copy: `Keep provider-specific terminal agents alive across projects, with files, diffs, search, and Git in one window.`
- Primary action: `Download Tortie`
- Evidence action: `Compare agent multiplexers`
- Route: `/compare/agent-multiplexers/`

### Code IDE

- Heading: `You may be happier in a code IDE.`
- Copy: `Your workflow starts with the editor and usually keeps the agent inside that project window.`
- Action: `Compare code IDEs`
- Route: `/compare/editors/`

### Agent orchestrator

- Heading: `You may want an agent orchestrator.`
- Copy: `You want to dispatch isolated tasks, let several workers run, and review their results rather than stay inside each live session.`
- Action: `Compare agent orchestrators`
- Route: `/compare/orchestrators/`

## Interaction rules

- One answer advances immediately; Back and Start over remain available.
- Announce question and result changes to assistive technology; move focus to the next question heading.
- Arrow keys move between choices; Enter or Space selects.
- Reduced-motion mode changes states without sliding transitions.
- Never show a score, percentage, or fabricated certainty.
- The result always explains the recommendation and provides evidence, not just a product name.

## Three visual directions

1. **Guided path** — one large question at a time, four-step progress rail, two or three decisive answers, and a calm recommendation reveal. Clearest and easiest to complete.
2. **Fit board** — all five Tortie-defining preferences in a compact left pane with a live recommendation on the right. Fastest for expert visitors and makes the logic transparent.
3. **Signal trail** — a branching blue trail led by Pixel Tortie toward only three destinations: Tortie, Code IDE, or Agent orchestrator. Most distinctive, but must remain secondary to the words.

## Selected direction

Build a **Signal trail / Guided path synthesis**. The visitor answers one focused question at a time while the Pixel Tortie route visibly changes toward one of three destinations. This keeps the guided flow easy to complete and makes the decision model distinctly Tortie.

The production component is `src/components/FitCheck.astro`. The selected visual reference is `mocks/03-signal-trail-v2.png`; the earlier directions remain in this folder as design history.
