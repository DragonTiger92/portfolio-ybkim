# Design Harness

## Purpose

This document defines the design harness for `portfolio-ybkim`.

The site is a small static portfolio, not a general-purpose product platform.
Treat the design system as a compact product vocabulary: a few stable decisions
that make every page feel intentional, coherent, accessible, and maintainable.

Use this document together with `.agents/guidelines/ui.md` when creating or
editing UI. `DESIGN.md` explains the product-level design intent; the agent
guideline explains operational HTML, CSS, accessibility, and responsiveness
rules.

## Source Handling

This harness is informed by external design material, but it must not copy
another creator's work as project-owned design content.

- Wayland's "every frame is perfect" principle is adapted as a UI quality
  metaphor: every visible page state should look complete and internally
  consistent.
- The referenced AI UI coherence article is adapted as a design-system
  discipline: choose a small set of visual axes, encode them as tokens or
  reusable patterns, and avoid inventing local variants for each component.
- When adding future design references, record the source, summarize only the
  reusable principle, and keep copied text, imagery, icons, and templates out of
  the project unless their license and attribution obligations are clear.

References:

- [The Wayland Protocol: Protocol design patterns](https://wayland-book.com/protocol-design/design-patterns.html)
- [AI가 만든 UI가 어딘가 '어색한' 이유 — 그리고 그걸 고치는 한 가지 원칙](https://dev.to/kiwibreaksme/aiga-mandeun-uiga-eodinga-eosaeghan-iyu-geurigo-geugeol-gocineun-han-gaji-weoncig-5e4p)

## Product Design Position

The portfolio should feel like:

- a focused web developer portfolio, not a decorative personal brand site;
- quiet, readable, and technically confident;
- semantic and standards-first rather than framework-driven;
- polished enough for desktop recruiter review while preserving full content and
  interaction quality across narrow and intermediate viewports.

Prefer clarity over novelty. Visual choices should help the user understand the
developer's work, project boundaries, and implementation judgment.

## Core Principles

### Every Visible State Is Coherent

Each screen, component state, and responsive layout should look like a committed
whole rather than a partial assembly of unrelated decisions.

- Do not show mismatched spacing, radius, shadows, colors, typography, or
  control sizes in the same UI region.
- If a dynamic feature later introduces loading, empty, error, disabled, or
  success states, design those states as first-class UI rather than temporary
  placeholders.
- Avoid local one-off visual choices that make a component look imported from a
  different product.

### Design Axes Are Sticky

For each recurring visual axis, prefer one value or one small family of values.
New UI should inherit the established decision before creating another one.

Current axes:

- Color: neutral canvas/surface/text tokens plus one accent family.
- Typography: body, display, and mono roles with a small responsive type scale.
- Spacing: the shared `--space-*` scale.
- Radius: a mildly rounded family through `--radius-sm`, `--radius-md`, and
  `--radius-lg`.
- Elevation: subdued card shadow through shared shadow tokens.
- Interaction: visible focus, minimum pointer target size, and reduced-motion
  support.
- Layout: shallow information architecture, constrained line lengths, and
  content-driven responsive breakpoints.

When a new axis value is genuinely needed, make it a product-level decision:
add or adjust a token, update this document if the decision changes the design
language, and avoid scattering magic values across components.

### Native Web Semantics Come First

Design quality includes document structure.

- Prefer native landmarks, headings, links, buttons, lists, and content
  relationships over decorative containers.
- Preserve the current one-page discovery flow and first-depth project detail
  pages unless a product requirement changes the information architecture.
- ARIA is a supplement for missing semantics, not the default way to repair
  avoidable markup choices.

### Responsive Means Preserved Intent

Desktop recruiter review is the primary presentation context, but responsive
CSS must preserve the same content, hierarchy, and actions at other widths.

- Write narrow-width baseline CSS first, then add content-driven `min-width`
  breakpoints as space becomes available.
- Do not copy generic device breakpoint catalogs.
- At every width, avoid horizontal overflow, preserve readable line lengths, and
  keep primary actions discoverable.

## Visual Vocabulary

### Color

Use the existing green accent family sparingly for identity, primary actions,
and small emphasis. Keep text, surfaces, and borders on the neutral token ramp.

Do not introduce decorative rainbow accents. Add semantic colors only when the
interface has a real status meaning such as success, warning, error, or info,
and never rely on color alone to convey that meaning.

### Typography

Use display type for major headings, body type for reading, and mono type for
small technical labels or eyebrow text. Avoid arbitrary font sizes outside the
token scale unless a specific layout problem justifies a new shared token.

Headings should make the outline easy to scan. Prefer concise noun phrases when
they accurately describe the section.

### Spacing And Layout

Use spacing to express grouping. Space inside a group should be smaller than the
space between groups. Prefer existing `--space-*` tokens and layout containers
before adding component-specific measurements.

Use `--content-max` and `--prose-max` to keep content readable. If a new layout
needs a different measure, treat it as a shared layout decision rather than a
local patch.

### Radius And Elevation

Keep the current softened radius personality. Controls, cards, and callouts may
use different sizes from the radius family, but they should still feel related.

Use elevation quietly. A shadow should clarify grouping or depth, not decorate a
component. Do not mix unrelated shadow directions or intensities in the same
screen.

### Interaction And Motion

Interactive elements should have clear affordance, keyboard access, visible
focus, and at least the project minimum pointer target size.

Motion should be short and functional. It may signal interaction but should not
carry essential information. Respect `prefers-reduced-motion`.

## UI Work Checklist

Before adding or changing UI:

1. Identify whether an existing Astro component, CSS pattern, or token already
   expresses the needed decision.
2. Check the visual axes: color, typography, spacing, radius, elevation,
   interaction, and layout should remain coherent with nearby UI.
3. Check semantic structure before styling: heading level, landmark, list,
   button/link role, and accessible name.
4. Check responsive behavior at narrow and wide viewports.
5. Check light and dark themes when the component uses color, surface, border,
   shadow, or focus tokens.
6. If a one-off exception is necessary, document why it is local and why it
   should not become a shared token.
