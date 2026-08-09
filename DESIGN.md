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
- Getdesign's versioned design-analysis approach reinforces keeping rationale,
  color, typography, spacing, and component decisions together. The selected
  references contribute a structured blue ramp, restrained technical surfaces,
  and blueprint-like precision without copying their layouts or assets.
- Mobbin and Lazyweb are pattern-research indexes. Use them to compare hierarchy,
  scanning flow, and responsive behavior across real products, never to import a
  screen, brand expression, or proprietary asset into this portfolio.
- When adding future design references, record the source, summarize only the
  reusable principle, and keep copied text, imagery, icons, and templates out of
  the project unless their license and attribution obligations are clear.

References:

- [The Wayland Protocol: Protocol design patterns](https://wayland-book.com/protocol-design/design-patterns.html)
- [AI가 만든 UI가 어딘가 '어색한' 이유 — 그리고 그걸 고치는 한 가지 원칙](https://dev.to/kiwibreaksme/aiga-mandeun-uiga-eodinga-eosaeghan-iyu-geurigo-geugeol-gocineun-han-gaji-weoncig-5e4p)
- [Getdesign](https://getdesign.md/), including its
  [IBM](https://getdesign.md/ibm/design-md),
  [Together AI](https://getdesign.md/together.ai/design-md),
  [Cal.com](https://getdesign.md/cal/design-md), and
  [Vercel](https://getdesign.md/vercel/design-md) analyses
- [Mobbin](https://mobbin.com/)
- [Lazyweb](https://www.lazyweb.com/)

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

### Affordance Is Perceivable And Truthful

Users should be able to recognize what can be interacted with, what kind of
interaction it supports, and how the interface responded. Semantics and visual
treatment must communicate the same role.

- Make links, buttons, form controls, and selectable items recognizable before
  interaction; do not rely on hover, motion, color alone, or explanatory copy
  elsewhere on the page.
- Keep navigation, actions, and non-interactive content visually distinct. Do
  not style static content like a control or make a control look inert.
- Design every applicable interaction state as part of the component: default,
  hover, keyboard focus, active or pressed, current or selected, visited,
  disabled, and busy.
- Treat hover as an enhancement. The same purpose and feedback must remain
  available to keyboard and touch users.
- Make state feedback immediate and proportionate. CSS transitions may soften a
  change, but must not delay recognition or become the only evidence that an
  action occurred.
- Separate a text label from an icon or typographic mark that communicates an
  interaction affordance. Keep each role in its own child element and preserve
  at least `--space-1` of visible separation through the shared component that
  owns it or a deliberate larger logical CSS gap; do not rely on collapsed
  source whitespace or `&nbsp;`.
- Use `NewWindowLink` for links that open a new browsing context so their label,
  `↗` mark, accessible name, security attributes, and spacing remain one
  canonical contract.
- Keep affordance coherent across light and dark themes, responsive layouts,
  and repeated instances of the same interaction pattern.

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

Use the owner-provided blue `yb` identity family sparingly for primary actions
and small emphasis. Keep text, surfaces, and borders on the slate neutral ramp.
The light and dark token sets must preserve the same hierarchy rather than
introducing theme-specific component colors.

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

The landing page uses an editorial, portfolio-specific hierarchy: one focused
intro presents positioning and recruiter actions without a parallel guide card,
and one Projects section groups all development work by evidence boundary.
Inspectable public results use cards, while company-confidential business
projects use a quieter list treatment and explicit disclosure cues. At narrow
widths these regions retain the same single-column reading order.

Landing section headings stand on their own without decorative indices or blue
eyebrow copy. Preserve small technical labels only where they classify a
project or communicate an evidence boundary. The Skills section uses a grouped
technology inventory followed by one comparison matrix so evidence density does
not become another fragmented card wall.

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
4. Check that interactive roles are recognizable before interaction and that
   every applicable state has perceivable, non-color-only feedback.
5. Check the interaction with keyboard, pointer, and a touch-sized viewport;
   hover must not reveal essential information or access.
6. Check responsive behavior at narrow and wide viewports.
7. Check light and dark themes when the component uses color, surface, border,
   shadow, or focus tokens.
8. If a one-off exception is necessary, document why it is local and why it
   should not become a shared token.
