# UI Guidelines

## Design Reference

When creating or editing visible UI, use root `DESIGN.md` together with this
file. `DESIGN.md` defines the product design intent and small token vocabulary;
this file defines operational implementation rules for HTML, CSS,
responsiveness, and accessibility.

Do not treat `DESIGN.md` as a mandate to build a broad design system. Use it to
keep new UI coherent with the portfolio's existing visual axes.

## UI Structure

When creating or editing UI code:

- Prefer small focused functions and modules.
- Keep DOM queries typed and guarded.
- Avoid large modules with multiple unrelated responsibilities.
- Keep conditional rendering readable.
- Avoid excessive inline logic inside template strings.
- Extract complex derived values before `return`.
- Keep styling clear, accessible, responsive, and appropriate for a portfolio site.

If UI code becomes hard to read because of branching, split it into smaller modules or extract helper functions.

## Accessibility

The portfolio should be accessible by default.

When editing UI:

- Prefer native HTML semantics. Add ARIA only when native elements cannot express
  the required role, name, state, or relationship.
- Use buttons for actions and links for navigation.
- Provide meaningful `alt` text for images.
- Ensure interactive elements are keyboard accessible.
- Avoid removing focus styles without replacing them.
- Preserve readable text contrast.
- Give each generated page exactly one visible `main` landmark and one page-level
  `h1`. Keep the `h1` visible by default; the landing page may visually hide its
  concise document title when the adjacent positioning statement and header
  identity already provide the intended visual hierarchy.
- Use `section` and `article` only for independently meaningful content, and give
  each one an accessible heading. Do not add an artificial hidden heading to
  `main`; `main` is a landmark, not sectioning content that requires a heading.
- Keep heading levels logical. The landing-page `h1` is the concise page title
  "웹 개발자 김용범의 포트폴리오" and remains available to the document
  outline even when visually hidden; its positioning statement belongs in a
  paragraph. A project-detail page uses its project title as `h1`.
- Prefer concise noun phrases for headings when they still describe the content
  accurately and read naturally in a heading outline.
- Use native `header`, `nav`, `main`, `article`, `section`, `aside`, and `footer`
  landmarks according to their content model instead of using generic containers
  with redundant roles.
- Keep pointer targets at least 44 by 44 CSS pixels unless an equivalent target
  for the same action is available nearby or another documented WCAG exception
  applies.

Automated accessibility and standards checks are a safety net, not proof of full
conformance. Preserve manual review for keyboard order, content meaning, zoom,
reflow, contrast, and assistive-technology behavior.

## Affordance And Interaction States

For every interactive element, align native semantics, wording, and CSS so the
control communicates both its role and its current state.

- Make interaction recognizable in the default state. Do not depend on hover,
  a pointer cursor, motion, or color alone to reveal that an element is usable.
- Keep links recognizable as navigation and buttons recognizable as actions.
  Do not make non-interactive cards, labels, or decoration look clickable.
- Define only the states that the interaction can actually enter, choosing from
  default, `:hover`, `:focus-visible`, `:active`, `:visited`, current or
  selected, disabled, and busy. Do not invent visual states unsupported by the
  element's behavior.
- Treat hover as supplementary feedback. Preserve the same information and
  operation for keyboard and touch input, where hover may be absent.
- Keep `:focus-visible` clearly distinguishable from hover and never suppress
  it without an equally visible replacement.
- Pair persistent visual state with the matching semantic state, such as
  `aria-current`, `aria-pressed`, `aria-expanded`, a native `disabled`
  attribute, or an appropriate form state. Do not add ARIA when native HTML
  already expresses the state.
- Make disabled or busy controls visibly unavailable without reducing text or
  status contrast below readable levels. Prevent the unavailable operation in
  behavior as well as in CSS.
- Use transitions to reinforce a state change, not to postpone it. Respect
  `prefers-reduced-motion`, and keep essential feedback perceivable without
  animation.
- Use visited styling only where revisitation history helps users understand
  content navigation; do not apply it to action-like controls or primary site
  navigation merely for decoration.

Before completing UI work, manually compare applicable states with keyboard and
pointer input, at a touch-sized narrow viewport, and in light and dark themes.
Confirm that the role and state remain understandable without hover or color.

## Styling

The project uses layered pure CSS and CSS custom properties. Treat the shared
tokens as a small product vocabulary, not as a promise to build a general-purpose
design system. Add a token or reusable pattern only when it represents an actual
shared decision.

When styling:

- Keep every visible state coherent: spacing, radius, shadow, color, typography,
  and control sizing should look like one committed product decision.
- Prefer existing token families for color, typography, spacing, radius,
  elevation, interaction, and layout before introducing a new local value.
- Add a new token or visual family only when it represents a product-wide
  decision; otherwise keep the exception narrow and explain it near the change.
- Keep class names or style utilities readable.
- Avoid duplicated styling logic.
- Prefer reusable patterns after they are intentionally established.
- Do not introduce global CSS changes without checking their impact.
- Maintain responsive behavior.
- Prefer logical properties and values such as `margin-inline`, `padding-block`,
  and `inset-inline-start` so layout remains writing-mode resilient.
- Treat desktop recruiter review as the primary product presentation while
  preserving the same content and actions at narrow and intermediate widths.
- Use mobile-first responsive CSS: write the narrow-width baseline first, then
  add content-driven `min-width` breakpoints as the composition gains room. The
  term describes CSS composition order, not a product priority above desktop.
- Do not copy device breakpoint catalogs.
- Test both narrow and wide viewports. Avoid horizontal scrolling, preserve
  readable line lengths, and let grids collapse according to available space.
