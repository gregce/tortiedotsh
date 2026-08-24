---
name: Tortie.sh
description: A quiet graphite window onto coding work that keeps living after the app closes.
colors:
  canvas: "#131417"
  sidebar: "#17181c"
  surface: "#1b1d22"
  raised: "#22252b"
  active: "#2a2e36"
  border: "#2a2d34"
  border-strong: "#3a3e48"
  text-primary: "#e8eaed"
  text-secondary: "#a8adb8"
  text-muted: "#838996"
  action-blue: "#4d9de8"
  action-blue-hover: "#63acf0"
  action-blue-text: "#82bfff"
  attention-amber: "#f5b84a"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.action-blue-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "44px"
---

# Design System: Tortie.sh

## Overview

**Creative North Star: "The Disposable Window"**

Tortie is a quiet, precise window onto work that remains alive beyond the window. The site should feel like a dark studio built around the product: matte graphite materials, hard-working hairlines, generous negative space, and one high-resolution view of Tortie in motion. The surrounding interface stays restrained so the continuity of the work becomes the spectacle.

This world is minimal without feeling empty. Headlines are short and declarative. Product footage is large and specific. Supporting pages become dense only when the task requires it, as in the comparison evidence ledger.

**Key Characteristics:**

- Cool graphite fields with restrained tonal separation.
- Large product imagery set into a cinematic, low-light stage.
- Plain, compact copy with an obvious path to download.
- One blue action accent; amber only for work needing attention.
- Hairlines and alignment provide structure instead of ornamental cards.

## Colors

The palette is a cool near-black ramp with clear silver text and one calm blue action color.

### Primary

- **Action blue:** Download actions, interactive emphasis, links, and focus.

### Secondary

- **Attention amber:** A semantic signal that a session needs human input. It is never decorative.

### Neutral

- **Studio canvas:** The page base and the darkest cinematic field.
- **Graphite sidebar and surface:** Navigation, grouped content, and product chrome.
- **Hairline graphite:** Dividers and control boundaries.
- **Primary silver:** Headlines and important values.
- **Secondary and muted silver:** Explanations, metadata, and captions.

**The One Blue Rule.** Blue means action or focus. It should remain rare enough that the download path is unmistakable.

**The Amber Means Human Rule.** Amber appears only when a person is needed or when evidence is explicitly limited.

## Typography

**Display Font:** System UI with SF Pro Text first on macOS

**Body Font:** System UI with SF Pro Text first on macOS

**Label/Mono Font:** SF Mono, ui-monospace, Menlo for paths, commands, and measured data only

**Character:** Native, calm, and highly legible. Weight and scale make the hierarchy; the typography does not perform “technical” through decoration.

### Hierarchy

- **Display:** Semibold, compact, and no larger than the product stage can balance. Used for the single hero promise.
- **Headline:** Semibold with tight but readable tracking. Used for feature chapters and page titles.
- **Title:** Semibold at 18–24px for destinations and local sections.
- **Body:** Regular at 15–17px, normally held to 65–75 characters.
- **Label:** Regular or medium at 11–13px for captions and metadata.

**The Short Sentence Rule.** Marketing headlines should fit in one or two compact lines and say one thing.

## Layout

The marketing site uses a centered 1120px content field with 24px gutters. The hero is an asymmetrical split: concise copy on the left and a wide product-film stage on the right. Feature chapters alternate between a narrow explanation and a broad 16:9 recording slot, separated by hairlines and generous vertical rhythm.

At tablet and mobile sizes, the split collapses into a single reading order: promise, action, product. Navigation preserves the download action and exposes the remaining destinations through a compact menu. Dense comparison content continues to own its internal horizontal overflow and must never make the page body scroll sideways.

## Elevation & Depth

The system is flat by default. Tonal layering and 1px boundaries establish most hierarchy. Soft black shadows are reserved for the product window and transient overlays, where they separate a real object from the dark studio rather than decorate a container.

**The Product Casts the Shadow Rule.** Marketing furniture stays flat. The app window may lift because it is the subject.

## Shapes

Corners are gently restrained: 4px for compact controls, 6px for buttons, and 10px for the product window or large media. Hairlines are always 1px. Pills are reserved for tiny status or filter controls, never used as general containers.

## Components

### Buttons

- **Shape:** Compact rectangle with a 6px radius.
- **Primary:** Deep action blue with white text, 44px tall; the label names the action.
- **Hover / Focus:** A lighter blue hover and a visible blue focus ring.
- **Secondary:** Transparent graphite with a strong 1px boundary.

### Cards / Containers

- **Corner Style:** Mostly square page regions; large media may use a 10px radius.
- **Background:** Tonal graphite only.
- **Shadow Strategy:** Flat at rest except for the staged product window.
- **Border:** 1px graphite hairline.
- **Internal Padding:** 16–32px according to density.

### Navigation

The navigation uses one 56px structure across the site: the unchanged TORTIE.sh wordmark, an optional contextual route label, quiet text links, an active-page state, and one persistent blue download action. Only the homepage changes the material by placing that same structure transparently over the studio hero. Mobile navigation must remain keyboard-operable and must not hide access to Compare, Docs, Changelog, or GitHub.

### Evidence matrix

The comparison matrix is a native two-axis table and a deliberately denser sibling of the marketing pages. It preserves compact vendor headers, frozen orientation, explicit uncertainty states, and source-backed claims. It inherits the same graphite, hairline, type, and action rules without adopting the homepage’s cinematic spacing.

## Do's and Don'ts

### Do:

- **Do** make the product footage the largest visual object on the homepage.
- **Do** use 1px hairlines and alignment to structure page chapters.
- **Do** preserve native table semantics and contained overflow in Compare.
- **Do** provide a real static fallback for every video or animated feature.

### Don't:

- **Don't** place a generic app screenshot in a floating rounded card beneath a generic centered hero.
- **Don't** use gradients, glass effects, neon glows, or technical-looking grids as atmosphere.
- **Don't** spend amber on decoration or routine actions.
- **Don't** flatten evidence-backed comparison data into an aggregate score.
